import { registerOTel } from "@vercel/otel";
import type { MetricReader } from "@opentelemetry/sdk-metrics";

const SERVICE_NAME = "observability-starter";

/**
 * Parse a comma-separated `key=value` OTLP headers string into a headers
 * object. Temps injects the ingest auth as `Authorization=Bearer <token>` in
 * the standard `OTEL_EXPORTER_OTLP_HEADERS`; a per-signal override
 * (`..._METRICS_HEADERS`) wins when present. Falls back to a bare
 * `OTEL_EXPORTER_OTLP_TOKEN` for manual/self-hosted setups.
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
 * Metrics need an *explicit* reader: @vercel/otel only auto-exports traces, so
 * without this nothing carries metrics to Temps. The OTLP/HTTP **protobuf**
 * metric exporter is Node-only (it relies on Node's http stack), so it's
 * imported dynamically and only ever constructed under the Node runtime — the
 * Edge runtime bundle must stay free of `node:http` (the caller gates on
 * `NEXT_RUNTIME === "nodejs"`). It posts to `{base}/v1/metrics` with the same
 * injected Bearer auth (`OTEL_EXPORTER_OTLP_HEADERS`) that traces use.
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
 *   1. Distributed tracing → Temps. We rely on @vercel/otel's built-in 'auto'
 *      span processor: in v2 it reads the injected `OTEL_EXPORTER_OTLP_ENDPOINT`
 *      and forwards the Bearer auth from `OTEL_EXPORTER_OTLP_HEADERS`, exporting
 *      every Next.js request/route span (and our custom spans) to
 *      `{base}/v1/traces`. We deliberately do NOT also pass `traceExporter`:
 *      that field adds a SECOND exporter alongside 'auto', so every span would
 *      be exported — and stored — twice (duplicate spans in the waterfall).
 *
 *   2. Metrics → Temps via an explicit OTLP metric reader (Node runtime only;
 *      @vercel/otel has no 'auto' metric reader). See `buildMetricReaders`.
 *
 *   3. Error tracking → load the Sentry server/edge config for the runtime.
 *      Sentry is configured with `skipOpenTelemetrySetup: true` so it doesn't
 *      steal the OTel tracer provider from @vercel/otel — without that, every
 *      span becomes non-recording and no traces are exported.
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
  // the Node runtime. Traces are handled by @vercel/otel's fetch-based 'auto'
  // exporter, which works in both Node and Edge.
  const metricReaders =
    base && process.env.NEXT_RUNTIME === "nodejs"
      ? await buildMetricReaders(base)
      : [];

  registerOTel({
    serviceName: process.env.OTEL_SERVICE_NAME || SERVICE_NAME,
    // Traces: handled by the built-in 'auto' span processor (see job #1 above) —
    // no `traceExporter` here, on purpose, to avoid double-exporting spans.
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
