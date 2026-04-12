/**
 * UserContext: profile + company for the current auth user.
 * PostgREST access is delegated to @/services/* (profiles, companies, enrollments).
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { useAuth } from "./AuthContext";
import { useTheme } from "./ThemeContext";
import { useDemoUser } from "@/core/hooks/useDemoUser";
import { isSupabaseConfigured } from "@/services/authService";
import { fetchCompanyForUserBranding } from "@/services/companyService";
import { fetchEnrollmentStatusForUser } from "@/services/enrollmentService";
import type { CompanyRow, ProfileRow } from "@/services/types";
import {
  fetchProfileByUserId,
  upsertProfileRow,
} from "@/services/userService";
import { APPLY_SUPABASE_COMPANY_BRANDING } from "@/core/theme/brandingFlags";
import { resolveDataBrand } from "@/core/theme/resolveDataBrand";

export type Profile = ProfileRow;
export type Company = CompanyRow;

interface UserContextValue {
  user: User | null;
  profile: Profile | null;
  company: Company | null;
  /** Enrollment state from `enrollments` row when present (`status` or `enrollment_status` if available). */
  enrollmentStatus: string | null;
  loading: boolean;
  refreshEnrollment: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | null>(null);

function syncDataBrand(companyName: string | null | undefined) {
  const slug = companyName?.trim() ? resolveDataBrand(companyName) : "default";
  document.documentElement.setAttribute("data-brand", slug);
}

export function UserProvider({ children }: { children: ReactNode }) {
  const { user: authUser, session, loading: authLoading } = useAuth();
  const { setCompanyBranding, setBrandingLoading } = useTheme();
  const demoUser = useDemoUser();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const refreshEnrollment = useCallback(async () => {
    if (!isSupabaseConfigured() || !authUser?.id) return;
    const { status, error } = await fetchEnrollmentStatusForUser(authUser.id);
    if (error) {
      console.warn("Enrollment fetch failed:", error.message);
      setEnrollmentStatus(null);
      return;
    }
    setEnrollmentStatus(status);
  }, [authUser?.id]);

  useEffect(() => {
    if (authLoading) return;

    if (!authUser || !session) {
      if (demoUser) {
        setProfile(null);
        setCompany(null);
        setEnrollmentStatus(null);
        setBrandingLoading(false);
        setProfileLoading(false);
        syncDataBrand(null);
        return;
      }
      setProfile(null);
      setCompany(null);
      setEnrollmentStatus(null);
      setBrandingLoading(false);
      setProfileLoading(false);
      setCompanyBranding("", undefined);
      syncDataBrand(null);
      return;
    }

    let cancelled = false;
    setProfileLoading(true);

    const fetchUserData = async () => {
      if (!isSupabaseConfigured()) {
        setProfile(null);
        setCompany(null);
        setEnrollmentStatus(null);
        setBrandingLoading(false);
        setProfileLoading(false);
        syncDataBrand(null);
        return;
      }

      const enrollmentPromise = fetchEnrollmentStatusForUser(authUser.id).then(
        ({ status, error }): string | null => {
          if (error) {
            console.warn("Enrollment fetch failed:", error.message);
            return null;
          }
          return status;
        },
      );

      try {
        if (import.meta.env.DEV) console.log("[user-diag] fetching profile for", authUser.id);
        const { data: profileData, error: profileError } = await fetchProfileByUserId(authUser.id);

        if (import.meta.env.DEV) console.log("[user-diag] profile result:", { profileData, profileError });
        if (cancelled) return;

        if (profileError) {
          if (import.meta.env.DEV) console.error("[user-diag] profile fetch failed:", profileError);
          setProfile(null);
          setCompany(null);
          syncDataBrand(null);
          setBrandingLoading(false);
          setProfileLoading(false);
          return;
        }

        let profileDataToUse = profileData;

        if (!profileDataToUse) {
          const meta = authUser.user_metadata as Record<string, unknown> | undefined;
          const { error: upsertError } = await upsertProfileRow(
            {
              id: authUser.id,
              name: (meta?.name as string) ?? "",
              company_id: (meta?.company_id as string) ?? null,
              location: (meta?.location as string) ?? "",
              role: "user",
            },
            { onConflict: "id" },
          );
          if (cancelled) return;
          if (upsertError) {
            if (import.meta.env.DEV) console.error("[user-diag] profile upsert failed:", upsertError);
            setProfile(null);
            setCompany(null);
            syncDataBrand(null);
            setBrandingLoading(false);
            setProfileLoading(false);
            return;
          }
          const { data: refetched, error: refetchError } = await fetchProfileByUserId(authUser.id);
          if (cancelled) return;
          if (refetchError || !refetched) {
            if (import.meta.env.DEV) console.error("[user-diag] profile refetch after upsert failed:", refetchError);
            setProfile(null);
            setCompany(null);
            syncDataBrand(null);
            setBrandingLoading(false);
            setProfileLoading(false);
            return;
          }
          profileDataToUse = refetched;
        }

        setProfile(profileDataToUse);

        if (import.meta.env.DEV) {
          console.log("[user-diag] profile.company_id:", profileDataToUse.company_id);
        }

        if (!profileDataToUse.company_id?.trim()) {
          if (import.meta.env.DEV) {
            console.warn("[UserContext] profile.company_id is missing; company branding will not be applied. User may need to complete signup or have profile updated.");
          }
          setCompany(null);
          setCompanyBranding("", undefined);
          syncDataBrand(null);
          setBrandingLoading(false);
          setProfileLoading(false);
          return;
        }

        const { data: companyData, error: companyError } = await fetchCompanyForUserBranding(
          profileDataToUse.company_id,
        );

        if (import.meta.env.DEV) console.log("[user-diag] company result:", { companyData, companyError });
        if (cancelled) return;

        if (companyError || !companyData) {
          if (import.meta.env.DEV) {
            console.warn("[UserContext] company fetch failed for company_id:", profileDataToUse.company_id, companyError);
          }
          setCompany(null);
          setCompanyBranding("", undefined);
          syncDataBrand(null);
          setBrandingLoading(false);
          setProfileLoading(false);
          return;
        }

        const companyResolved = companyData;
        setCompany(companyResolved);
        syncDataBrand(companyResolved.name);

        if (APPLY_SUPABASE_COMPANY_BRANDING) {
          setCompanyBranding(
            companyResolved.name,
            companyResolved.branding_json ?? undefined,
            companyResolved.logo_url ?? null,
            companyResolved.primary_color?.trim() || undefined,
            companyResolved.secondary_color?.trim() || undefined,
          );
        } else {
          setCompanyBranding("", undefined);
        }
        setBrandingLoading(false);
        setProfileLoading(false);
      } finally {
        const status = await enrollmentPromise;
        if (!cancelled) setEnrollmentStatus(status);
      }
    };

    fetchUserData();
    return () => {
      cancelled = true;
    };
  }, [authUser, authLoading, session, demoUser, setCompanyBranding, setBrandingLoading]);

  const loading = demoUser ? false : authLoading || profileLoading;

  const value = useMemo(() => {
    let effectiveProfile = profile;
    let effectiveEnrollment = enrollmentStatus;
    if (demoUser) {
      effectiveProfile = {
        id: demoUser.id,
        name: demoUser.name,
        company_id: profile?.company_id ?? null,
        location: profile?.location ?? "",
        role: profile?.role ?? "user",
      };
      effectiveEnrollment =
        demoUser.enrollmentStatus === "not_enrolled" ? null : "completed";
    }
    return {
      user: authUser,
      profile: effectiveProfile,
      company: demoUser ? null : company,
      enrollmentStatus: effectiveEnrollment,
      loading,
      refreshEnrollment,
    };
  }, [authUser, profile, company, enrollmentStatus, loading, refreshEnrollment, demoUser]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return ctx;
}
