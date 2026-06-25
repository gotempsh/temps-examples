import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import {
  BatchSpanProcessor,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";

const SERVICE_NAME = "observability-starter";

/**
 * Next.js calls `register()` once per server runtime at boot. We use it for two
 * things:
 *   1. Initialize OpenTelemetry trace export to Temps (the distributed-tracing
 *      pillar). When deployed on Temps the standard OTLP env vars are injected
 *      automatically — `OTEL_EXPORTER_OTLP_ENDPOINT` (base, e.g.
 *      `https://host/api/otel`) and `OTEL_EXPORTER_OTLP_HEADERS`
 *      (`Authorization=Bearer <token>`). Spans then appear under the project's
 *      Traces tab with no manual setup.
 *   2. Load the Sentry server/edge configs so error tracking is active in the
 *      correct runtime.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
    registerOtel();
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

// Forward React render / Server Component errors to Sentry. Required by
// @sentry/nextjs for full server error capture.
export const onRequestError = async (
  ...args: Parameters<
    typeof import("@sentry/nextjs").captureRequestError
  >
) => {
  const Sentry = await import("@sentry/nextjs");
  return Sentry.captureRequestError(...args);
};

/**
 * Parse OTLP headers from the standard `OTEL_EXPORTER_OTLP_HEADERS` env var
 * (comma-separated `key=value` pairs), which is what Temps injects for auth
 * (`Authorization=Bearer <token>`). Falls back to `OTEL_EXPORTER_OTLP_TOKEN`
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

function registerOtel() {
  const otlpEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;

  if (!otlpEndpoint) {
    console.warn(
      "[OTEL] OTEL_EXPORTER_OTLP_ENDPOINT not set — skipping trace export. " +
        "Copy it from your Temps project's Traces / Monitoring settings to enable distributed tracing."
    );
    return;
  }

  const headers = resolveOtlpHeaders();

  // `OTEL_EXPORTER_OTLP_ENDPOINT` is the OTLP *base*; the traces signal lives at
  // `{base}/v1/traces`. We pass the full URL explicitly (the constructor uses it
  // as-is and does NOT append the signal path). Honour the per-signal
  // `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT` override if set (used verbatim).
  const tracesUrl =
    process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ||
    `${otlpEndpoint.replace(/\/+$/, "")}/v1/traces`;

  const exporter = new OTLPTraceExporter({ url: tracesUrl, headers });

  const resource = resourceFromAttributes({
    [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || SERVICE_NAME,
    [ATTR_SERVICE_VERSION]: process.env.OTEL_SERVICE_VERSION || "0.1.0",
    "deployment.environment.name": process.env.NODE_ENV || "development",
  });

  // Sync export in dev (errors are immediately visible), batched in production.
  const isDev = process.env.NODE_ENV !== "production";
  const spanProcessor = isDev
    ? new SimpleSpanProcessor(exporter)
    : new BatchSpanProcessor(exporter);

  const provider = new NodeTracerProvider({
    resource,
    spanProcessors: [spanProcessor],
  });
  provider.register();

  console.log(
    `[OTEL] trace export initialized → ${tracesUrl} ` +
      `(service=${process.env.OTEL_SERVICE_NAME || SERVICE_NAME}, ` +
      `auth=${headers["Authorization"] ? "bearer" : "none"})`
  );
}
