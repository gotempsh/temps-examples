import * as Sentry from "@sentry/nextjs";

// Browser-side error tracking. Use the PUBLIC DSN here so it can be inlined into
// the client bundle. Session replay is enabled for errored sessions so you can
// watch exactly what the user did before the crash, right inside Temps.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,

  debug: false,

  // Always replay sessions that hit an error; sample a slice of normal sessions.
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});
