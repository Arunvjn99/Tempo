/** Shared DTOs for Supabase-backed services (align with public.profiles / public.companies). */

export interface ProfileRow {
  id: string;
  name: string;
  company_id: string | null;
  location: string;
  role?: string;
}

export interface CompanyRow {
  id: string;
  name: string;
  primary_color: string | null;
  secondary_color: string | null;
  branding_json?: Record<string, unknown> | null;
  logo_url?: string | null;
}
