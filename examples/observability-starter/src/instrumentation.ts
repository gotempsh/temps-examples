import { registerOTel, OTLPHttpProtoTraceExporter } from "@vercel/otel";
import type { MetricReader } from "@opentelemetry/sdk-metrics";

const SERVICE_NAME = "observability-starter";

/**
 * Parse a comma-separated `key=value` OTLP headers string into a headers
 * object. Temps injects the ingest auth as `Authorization=Bearer <token>` in
 * the standard `OTEL_EXPORTER_OTLP_HEADERS`; a per-signal override
 * (`..._TRACES_HEADERS` / `..._METRICS_HEADERS`) wins when present. Falls back
 * to a bare `OTEL_EXPORTER_OTLP_TOKEN` for manual/self-hosted setups.
 */
function resolveOtlpHeaders(signalHeaders?: string): Record<string, string> {
  const headers: Record<string, string> = {};
  const raw = signalHeaders || process.env.OTEL_EXPORTER_OTLP_HEADERS;
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
 * Resolve a per-signal OTLP URL. `OTEL_EXPORTER_OTLP_ENDPOINT` is the OTLP
 * *base* (Temps injects `{host}/api/otel`); each signal lives at `{base}/v1/...`.
 * A per-signal endpoint override wins when set.
 */
function signalUrl(base: string, override: string | undefined, path: string) {
  return override || `${base.replace(/\/+$/, "")}${path}`;
}

/**
 * Build the OTLP metric reader(s).
 *
 * The OTLP/HTTP **protobuf** metric exporter is Node-only — it relies on Node's
 * http stack — so it's imported dynamically and only ever constructed under the
 * Node runtime. The Edge runtime bundle must stay free of `node:http`, which is
 * why this never runs there (the caller gates on `NEXT_RUNTIME === "nodejs"`).
 *
 * This mirrors the trace exporter exactly: same endpoint base
 * (`{base}/v1/metrics`) and the same resolved auth header — because
 * @vercel/otel's 'auto' exporter does NOT forward `OTEL_EXPORTER_OTLP_HEADERS`,
 * so without an explicit exporter the ingest rejects every export with 401.
 */
async function buildMetricReaders(base: string): Promise<MetricReader[]> {
  const { PeriodicExportingMetricReader } = await import(
    "@opentelemetry/sdk-metrics"
  );
  const { OTLPMetricExporter } = await import(
    "@opentelemetry/exporter-metrics-otlp-proto"
  );

  return [
    new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({
        url: signalUrl(
          base,
          process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT,
          "/v1/metrics"
        ),
        headers: resolveOtlpHeaders(
          process.env.OTEL_EXPORTER_OTLP_METRICS_HEADERS
        ),
      }),
      // Push every 15s so metrics surface promptly in the demo (the OTLP SDK
      // default is 60s). Each export is a cumulative snapshot of all instruments.
      exportIntervalMillis: 15_000,
    }),
  ];
}

/**
 * Next.js calls `register()` once per server runtime at boot. Three jobs:
 *
 *   1. Distributed tracing → Temps via `@vercel/otel`. It auto-instruments
 *      Next.js (every request, route handler, and fetch becomes a span). We pass
 *      an explicit `OTLPHttpProtoTraceExporter` so the ingest auth header rides
 *      along (see `buildMetricReaders` for why 'auto' isn't enough).
 *
 *   2. Metrics → Temps via an OTLP metric reader (Node runtime only). This wires
 *      up the SDK so any instrument from `@opentelemetry/api`'s global meter
 *      (see `src/lib/metrics.ts`) is exported on a fixed interval.
 *
 *   3. Error tracking → load the Sentry server/edge config for the runtime.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }

  const base = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;

  // Metrics use the Node-only protobuf exporter, so only attach a reader under
  // the Node runtime. Tracing's exporter is fetch-based and works in both.
  const metricReaders =
    base && process.env.NEXT_RUNTIME === "nodejs"
      ? await buildMetricReaders(base)
      : [];

  registerOTel({
    serviceName: process.env.OTEL_SERVICE_NAME || SERVICE_NAME,
    // Only attach exporters when an endpoint is configured (Temps injects it on
    // deploy); otherwise telemetry is a no-op, which is fine for local dev.
    ...(base
      ? {
          traceExporter: new OTLPHttpProtoTraceExporter({
            url: signalUrl(
              base,
              process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT,
              "/v1/traces"
            ),
            headers: resolveOtlpHeaders(
              process.env.OTEL_EXPORTER_OTLP_TRACES_HEADERS
            ),
          }),
        }
      : {}),
    ...(metricReaders.length ? { metricReaders } : {}),
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
