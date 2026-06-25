import { TempsAnalyticsProvider } from "@temps-sdk/react-analytics";

/**
 * Client-side product analytics (the analytics pillar).
 *
 * The @temps-sdk/react-analytics package ships with `"use client"` baked in, so
 * we can drop the provider straight into the root layout (a Server Component).
 * When deployed on Temps, the Pingora proxy treats `/api/_temps/*` as a public
 * ingest path, so no app-side route handler is needed — pageviews, events,
 * engagement, and session recording flow to the project's Analytics tab.
 */
export function Analytics({ children }: { children: React.ReactNode }) {
  return (
    <TempsAnalyticsProvider
      // Temps-hosted apps ingest analytics under /api/_temps (proxy public path).
      basePath="/api/_temps"
      autoTrackPageviews
      autoTrackPageLeave
      autoTrackEngagement
      autoTrackSpeedAnalytics
      enableSessionRecording
      sessionRecordingConfig={{ maskAllInputs: true }}
      // `ignoreLocalhost` defaults to true, which means nothing is sent while
      // developing locally. Flip it off to verify the integration end-to-end.
      ignoreLocalhost={process.env.NODE_ENV === "production"}
    >
      {children}
    </TempsAnalyticsProvider>
  );
}
