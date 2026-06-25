import * as Sentry from "@sentry/nextjs";

// Temps is wire-compatible with Sentry, so the official @sentry/nextjs SDK works
// unchanged — just point the DSN at your Temps project's Error Tracking DSN
// (Project → Error Tracking → DSN & Setup).
Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Capture everything in dev, sample down in production.
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // The SDK is a no-op without a DSN, so this is safe even before you wire one up.
  enabled: !!process.env.SENTRY_DSN,

  debug: false,
});
