import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ProfileCard } from "./ProfileCard";

const STORAGE_KEY = "profile-notifications-preferences";

interface NotificationPrefs {
  email: boolean;
  sms: boolean;
  contributionAlerts: boolean;
  documentUploadAlerts: boolean;
  securityAlerts: boolean;
}

const DEFAULT_PREFS: NotificationPrefs = {
  email: true,
  sms: false,
  contributionAlerts: true,
  documentUploadAlerts: true,
  securityAlerts: true,
};

function loadPrefs(): NotificationPrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<NotificationPrefs>;
      return { ...DEFAULT_PREFS, ...parsed };
    }
  } catch {
    // ignore
  }
  return { ...DEFAULT_PREFS };
}

function savePrefs(prefs: NotificationPrefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
}

export function NotificationsCard() {
  const { t } = useTranslation();
  const [prefs, setPrefs] = useState<NotificationPrefs>(() => loadPrefs());

  useEffect(() => {
    savePrefs(prefs);
  }, [prefs]);

  const update = (key: keyof NotificationPrefs, value: boolean) => {
    setPrefs((p) => ({ ...p, [key]: value }));
  };

  return (
    <ProfileCard id="notifications" title={t("profile.notificationsPreferences")}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {[
          { key: "email" as const, labelKey: "profile.emailNotifications" },
          { key: "sms" as const, labelKey: "profile.smsNotifications" },
          { key: "contributionAlerts" as const, labelKey: "profile.contributionAlerts" },
          { key: "documentUploadAlerts" as const, labelKey: "profile.documentUploadAlerts" },
          { key: "securityAlerts" as const, labelKey: "profile.securityAlertsAlwaysOn", disabled: true },
        ].map(({ key, labelKey, disabled }) => (
          <div
            key={key}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.5rem 0",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <span style={{ fontSize: "0.9375rem", color: disabled ? "var(--color-text-secondary)" : "var(--color-text)" }}>
              {t(labelKey)}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={prefs[key]}
              disabled={disabled}
              onClick={() => !disabled && update(key, !prefs[key])}
              style={{
                position: "relative",
                width: 44,
                height: 24,
                borderRadius: 12,
                border: "none",
                background: prefs[key] ? "var(--color-primary)" : "var(--color-border)",
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.7 : 1,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 2,
                  left: prefs[key] ? 22 : 2,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "white",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  transition: "left 0.2s ease",
                }}
              />
            </button>
          </div>
        ))}
      </div>
    </ProfileCard>
  );
}
