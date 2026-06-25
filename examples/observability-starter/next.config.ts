import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  // `standalone` produces a self-contained server bundle that Temps deploys
  // without needing the full node_modules tree at runtime.
  output: "standalone",
  // The OTLP protobuf metric exporter (and its transitive deps) is a Node
  // server package with dynamic internals. Keep it external so it's required at
  // runtime and traced into the standalone output rather than bundled.
  serverExternalPackages: [
    "@opentelemetry/sdk-metrics",
    "@opentelemetry/exporter-metrics-otlp-proto",
  ],
};

// Wrap with Sentry so client/server/edge error tracking is wired automatically.
// When no DSN is set the SDK is a no-op, so this is safe to ship as-is.
export default withSentryConfig(nextConfig, {
  silent: true,
});
