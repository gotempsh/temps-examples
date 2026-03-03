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
import { diag, DiagLogLevel } from "@opentelemetry/api";

// Expose the provider globally so routes can call forceFlush()
declare global {
  // eslint-disable-next-line no-var
  var __otelTracerProvider: NodeTracerProvider | undefined;
}

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const otlpEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;

    if (!otlpEndpoint) {
      console.warn(
        "[OTEL] OTEL_EXPORTER_OTLP_ENDPOINT is not set, skipping OpenTelemetry trace export"
      );
      return;
    }

    // Always log errors/warnings; set OTEL_LOG_LEVEL=debug for verbose output
    const logLevel =
      process.env.OTEL_LOG_LEVEL === "debug"
        ? DiagLogLevel.DEBUG
        : DiagLogLevel.WARN;

    diag.setLogger(
      {
        error: (...args) => console.error("[OTEL]", ...args),
        warn: (...args) => console.warn("[OTEL]", ...args),
        info: (...args) => console.info("[OTEL]", ...args),
        debug: (...args) => console.debug("[OTEL]", ...args),
        verbose: (...args) => console.trace("[OTEL]", ...args),
      },
      logLevel
    );

    // Build auth headers from OTEL_EXPORTER_OTLP_TOKEN
    const headers: Record<string, string> = {};
    const token = process.env.OTEL_EXPORTER_OTLP_TOKEN;
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Use the endpoint URL exactly as provided — it should be the full
    // URL to the traces ingestion endpoint, e.g.:
    //   http://localhost:8081/api/otel/v1/2/2/329/traces
    const exporter = new OTLPTraceExporter({
      url: otlpEndpoint,
      headers,
    });

    const resource = resourceFromAttributes({
      [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || "nextjs-saas",
      [ATTR_SERVICE_VERSION]: process.env.OTEL_SERVICE_VERSION || "0.1.0",
      "deployment.environment.name": process.env.NODE_ENV || "development",
    });

    // Use SimpleSpanProcessor in dev for immediate export + visible errors,
    // BatchSpanProcessor in production for performance.
    const isDev = process.env.NODE_ENV !== "production";
    const spanProcessor = isDev
      ? new SimpleSpanProcessor(exporter)
      : new BatchSpanProcessor(exporter);

    const provider = new NodeTracerProvider({
      resource,
      spanProcessors: [spanProcessor],
    });
    provider.register();

    // Store globally so test routes / API handlers can forceFlush
    globalThis.__otelTracerProvider = provider;

    console.log(
      `[OTEL] OpenTelemetry trace export initialized\n` +
        `  url: ${otlpEndpoint}\n` +
        `  format: protobuf\n` +
        `  service: ${process.env.OTEL_SERVICE_NAME || "nextjs-saas"}\n` +
        `  auth: ${token ? "Bearer token set" : "none (set OTEL_EXPORTER_OTLP_TOKEN)"}\n` +
        `  processor: ${isDev ? "SimpleSpanProcessor (sync, errors visible)" : "BatchSpanProcessor"}`
    );
  }
}
