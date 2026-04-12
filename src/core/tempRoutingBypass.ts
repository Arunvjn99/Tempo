/**
 * TEMPORARY flags for QA. Dashboard is the default home; enrollment is a separate route.
 * Set `TEMP_BYPASS_DASHBOARD_REDIRECTS` to `true` only if you need legacy QA redirects toward enrollment.
 */
export const TEMP_BYPASS_DASHBOARD_REDIRECTS = false;

/** Default in-app home (post-auth, fallbacks). */
export const TEMP_DEFAULT_APP_ROUTE = "/dashboard";
