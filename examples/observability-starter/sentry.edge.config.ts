import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  // Let @vercel/otel own the OpenTelemetry tracer provider so traces reach Temps
  // over OTLP; Sentry keeps doing error capture. See sentry.server.config.ts for
  // the full explanation of the duplicate-registration conflict.
  skipOpenTelemetrySetup: true,
  tracesSampleRate: 0,
  enabled: !!process.env.SENTRY_DSN,
  debug: false,
});
