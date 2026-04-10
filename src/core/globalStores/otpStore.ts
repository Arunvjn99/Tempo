import { create } from "zustand";

const STORAGE_KEY = "otp_verified";

function readSessionVerified(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

type OtpState = {
  isOtpVerified: boolean;
  setOtpVerified: (value: boolean) => void;
  resetOtp: () => void;
};

export const useOtpStore = create<OtpState>((set) => ({
  isOtpVerified: typeof sessionStorage !== "undefined" ? readSessionVerified() : false,

  setOtpVerified: (value: boolean) => {
    try {
      if (value) sessionStorage.setItem(STORAGE_KEY, "true");
      else sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    set({ isOtpVerified: value });
  },

  resetOtp: () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    set({ isOtpVerified: false });
  },
}));

/** OTP gate for auth flows — backed by {@link useOtpStore} + sessionStorage. */
export function useOtp(): OtpState {
  return useOtpStore();
}
