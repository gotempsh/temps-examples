import { registerOTel } from "@vercel/otel";

const SERVICE_NAME = "observability-starter";

/**
 * Next.js calls `register()` once per server runtime at boot. Two jobs:
 *
 *   1. Distributed tracing → Temps. We use `@vercel/otel`'s `registerOTel` (the
 *      approach Temps' Traces setup page recommends) rather than a hand-rolled
 *      `OTLPTraceExporter`. It auto-instruments Next.js (every request, fetch,
 *      route handler becomes a span) AND reads the standard OTLP env vars that
 *      Temps injects automatically — `OTEL_EXPORTER_OTLP_ENDPOINT` (base, the
 *      `/v1/traces` path is appended for you) and `OTEL_EXPORTER_OTLP_HEADERS`
 *      (`Authorization=Bearer <token>`). A hand-rolled exporter drops that auth
 *      header and the ingest rejects the spans, so prefer the built-in `'auto'`
 *      exporter here.
 *
 *   2. Error tracking → load the Sentry server/edge config for the runtime.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }

  // No-op when OTEL_EXPORTER_OTLP_ENDPOINT is unset (e.g. local dev without the
  // var), so this is safe to call unconditionally.
  registerOTel({
    serviceName: process.env.OTEL_SERVICE_NAME || SERVICE_NAME,
  });
}

// Forward React render / Server Component errors to Sentry. Required by
// @sentry/nextjs for full server-side error capture.
export const onRequestError = async (
  ...args: Parameters<typeof import("@sentry/nextjs").captureRequestError>
) => {
  const Sentry = await import("@sentry/nextjs");
  return Sentry.captureRequestError(...args);
};
