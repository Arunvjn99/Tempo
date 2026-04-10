import i18n from "./core/i18n/index";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { I18nextProvider, useTranslation } from "react-i18next";
import "./core/styles/design-tokens.css";
import "./core/styles/design-system.css";
import "./core/theme/tokens.css";
import "./core/theme/global.css";
import "./core/styles/global.css";
import "./core/styles/layout-system.css";
import "./core/theme/light.css";
import "./core/theme/dark.css";
import "./core/theme/enrollment-dark.css";
import "./index.css";
import { loadUXtweak } from "./core/utils/uxtweakLoader";
import { loadUXsniff } from "./core/utils/uxsniffLoader";
import { loadClarity } from "./core/lib/analytics/clarity";
import { v4Router } from "./v4/router.tsx";
import { ThemeProvider } from "./core/context/ThemeContext";
import { AuthProvider } from "./core/context/AuthContext";
import { UserProvider } from "./core/context/UserContext";
import { NetworkProvider } from "./core/network/networkContext";
import { NetworkBanner } from "@/ui/system/NetworkBanner";

const savedTheme = localStorage.getItem("theme");
const effectiveTheme =
  savedTheme === "system"
    ? (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
    : savedTheme === "dark"
      ? "dark"
      : "light";
document.documentElement.classList.remove("light", "dark");
document.documentElement.classList.add(effectiveTheme);

function RootWithLanguageKey() {
  const { i18n: i18nInstance } = useTranslation();
  return (
    <NetworkProvider>
      <NetworkBanner />
      <AuthProvider>
        <ThemeProvider>
          <UserProvider>
            <RouterProvider key={i18nInstance.language || "en"} router={v4Router} />
          </UserProvider>
        </ThemeProvider>
      </AuthProvider>
    </NetworkProvider>
  );
}

loadUXtweak();
loadUXsniff();
loadClarity();

createRoot(document.getElementById("root")!).render(
  <I18nextProvider i18n={i18n}>
    <StrictMode>
      <RootWithLanguageKey />
    </StrictMode>
  </I18nextProvider>,
);
