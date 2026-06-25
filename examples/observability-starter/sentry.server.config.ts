import * as Sentry from "@sentry/nextjs";

// Temps is wire-compatible with Sentry, so the official @sentry/nextjs SDK works
// unchanged — just point the DSN at your Temps project's Error Tracking DSN
// (Project → Error Tracking → DSN & Setup).
Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // CRITICAL for distributed tracing: @sentry/nextjs is built on OpenTelemetry
  // and, by default, registers its OWN global TracerProvider + ContextManager.
  // Because Sentry inits before `registerOTel()` (see instrumentation.ts), that
  // registration wins and @vercel/otel's is rejected as a duplicate — so every
  // span becomes "non-recording" and NO traces reach Temps (while metrics, which
  // use a separate MeterProvider Sentry never touches, still flow). Telling
  // Sentry to skip its OpenTelemetry setup hands tracing to @vercel/otel, which
  // exports spans to Temps over OTLP. Sentry still captures errors — that path
  // doesn't depend on owning the tracer provider.
  skipOpenTelemetrySetup: true,

  // Tracing goes to Temps via OTLP (@vercel/otel), not to Sentry, so don't have
  // Sentry sample its own performance transactions.
  tracesSampleRate: 0,

  // The SDK is a no-op without a DSN, so this is safe even before you wire one up.
  enabled: !!process.env.SENTRY_DSN,

  debug: false,
});
