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
 *      pillar). Temps exposes an OTLP/HTTP endpoint per project; set
 *      OTEL_EXPORTER_OTLP_ENDPOINT + OTEL_EXPORTER_OTLP_TOKEN and spans show up
 *      under the project's Traces tab.
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

function registerOtel() {
  const otlpEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;

  if (!otlpEndpoint) {
    console.warn(
      "[OTEL] OTEL_EXPORTER_OTLP_ENDPOINT not set — skipping trace export. " +
        "Copy it from your Temps project's Traces / Monitoring settings to enable distributed tracing."
    );
    return;
  }

  // Bearer token auth, if the endpoint requires it.
  const headers: Record<string, string> = {};
  const token = process.env.OTEL_EXPORTER_OTLP_TOKEN;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const exporter = new OTLPTraceExporter({ url: otlpEndpoint, headers });

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
    `[OTEL] trace export initialized → ${otlpEndpoint} ` +
      `(service=${process.env.OTEL_SERVICE_NAME || SERVICE_NAME}, ` +
      `auth=${token ? "bearer" : "none"})`
  );
}
