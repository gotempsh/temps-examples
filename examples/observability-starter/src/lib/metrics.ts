import { metrics } from "@opentelemetry/api";

/**
 * Custom application metrics (the metrics pillar).
 *
 * Mirrors the `trace.getTracer("observability-starter")` pattern used for custom
 * spans: we grab a named meter from the global MeterProvider and create a couple
 * of instruments. The provider is installed by `src/instrumentation.ts` →
 * `registerOTel({ metricReaders })`, which Next runs before any route is served,
 * so by the time this module is first imported the real SDK is already wired and
 * these are live instruments (not no-ops).
 *
 * They surface in Temps under Project → Monitoring / Metrics, keyed to this
 * deployment, and can be grouped by their attributes.
 */
const meter = metrics.getMeter("observability-starter");

/** Monotonic count of guestbook entries written to Postgres. */
export const guestbookEntriesCreated = meter.createCounter(
  "guestbook.entries.created",
  {
    description: "Guestbook entries successfully written to Postgres",
    unit: "{entry}",
  }
);

/**
 * Count of guestbook list (GET) requests, labelled by `outcome` so you can
 * group ok vs. error in Temps — a small demonstration of metric attributes.
 */
export const guestbookListRequests = meter.createCounter(
  "guestbook.list.requests",
  {
    description: "Guestbook list requests served",
    unit: "{request}",
  }
);
