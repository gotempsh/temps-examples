import { registerOTel, OTLPHttpProtoTraceExporter } from "@vercel/otel";

const SERVICE_NAME = "observability-starter";

/**
 * Parse the standard `OTEL_EXPORTER_OTLP_HEADERS` env var (comma-separated
 * `key=value` pairs) into a headers object. Temps injects the ingest auth here
 * as `Authorization=Bearer <token>`. Falls back to `OTEL_EXPORTER_OTLP_TOKEN`
 * for manual/self-hosted setups that prefer a bare token.
 */
function resolveOtlpHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  const raw =
    process.env.OTEL_EXPORTER_OTLP_TRACES_HEADERS ||
    process.env.OTEL_EXPORTER_OTLP_HEADERS;
  if (raw) {
    for (const pair of raw.split(",")) {
      const eq = pair.indexOf("=");
      if (eq > 0) {
        const key = pair.slice(0, eq).trim();
        const value = pair.slice(eq + 1).trim();
        if (key) headers[key] = value;
      }
    }
  }
  const token = process.env.OTEL_EXPORTER_OTLP_TOKEN;
  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Next.js calls `register()` once per server runtime at boot. Two jobs:
 *
 *   1. Distributed tracing → Temps via `@vercel/otel` (the approach Temps' Traces
 *      setup page recommends). It auto-instruments Next.js (every request, route
 *      handler, and fetch becomes a span). We pass an explicit
 *      `OTLPHttpProtoTraceExporter` with the endpoint + auth header because
 *      @vercel/otel's 'auto' exporter does NOT forward `OTEL_EXPORTER_OTLP_HEADERS`
 *      — so without this the ingest rejects every export with 401.
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

  const base = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;

  registerOTel({
    serviceName: process.env.OTEL_SERVICE_NAME || SERVICE_NAME,
    // Only attach an exporter when an endpoint is configured (Temps injects it
    // on deploy); otherwise tracing is a no-op, which is fine for local dev.
    ...(base
      ? {
          traceExporter: new OTLPHttpProtoTraceExporter({
            // OTEL_EXPORTER_OTLP_ENDPOINT is the OTLP *base*; the traces signal
            // lives at `{base}/v1/traces`. Honour a per-signal override too.
            url:
              process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ||
              `${base.replace(/\/+$/, "")}/v1/traces`,
            headers: resolveOtlpHeaders(),
          }),
        }
      : {}),
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
