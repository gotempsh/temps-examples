import { metrics } from "@opentelemetry/api";
import { anomalyActive } from "./anomaly-state";

/**
 * Custom application metrics (the metrics pillar).
 *
 * Mirrors the `trace.getTracer("observability-starter")` pattern used for custom
 * spans: we grab a named meter from the global MeterProvider and create a few
 * instruments. The provider is installed by `src/instrumentation.ts` →
 * `registerOTel({ metricReaders })`, which Next runs before any route is served,
 * so by the time this module is first imported the real SDK is already wired and
 * these are live instruments (not no-ops).
 *
 * They surface in Temps under Project → OpenTelemetry → Metrics, keyed to this
 * deployment, and can be grouped by their attributes. Between them they cover
 * the three instrument shapes the Metrics explorer renders: a monotonic
 * **counter**, a **histogram** (so the explorer can compute p50/p95/p99 and you
 * can alert on a latency percentile), and an **observable gauge** (rises and
 * falls) — a good candidate for anomaly detection.
 */
const meter = metrics.getMeter("observability-starter");

/** Monotonic count of subscriptions created, labelled by plan. */
export const subscriptionsCreated = meter.createCounter(
  "cadence.subscriptions.created",
  {
    description: "Subscriptions created via /api/subscribe",
    unit: "{subscription}",
  }
);

/** Recognised MRR added by new subscriptions, in cents (labelled by plan). */
export const subscriptionMrrCents = meter.createCounter(
  "cadence.subscription.mrr_cents",
  {
    description: "MRR added by new subscriptions",
    unit: "By",
  }
);

/**
 * Per-request latency of the subscribe handler, in milliseconds. A histogram
 * records the full distribution, so Temps can show p50/p95/p99 in the Metrics
 * explorer and you can alert on a percentile (e.g. "p95 > 500ms"). The explicit
 * bucket boundaries are tuned for typical web latencies — without them you only
 * get count/sum, not percentiles.
 */
export const subscribeRequestDuration = meter.createHistogram(
  "cadence.subscribe.duration",
  {
    description: "Subscribe API handler latency",
    unit: "ms",
    advice: {
      explicitBucketBoundaries: [
        5, 10, 25, 50, 75, 100, 250, 500, 750, 1000, 2500, 5000,
      ],
    },
  }
);

/**
 * Synthetic activity level (~0–100). An **observable gauge**: its callback runs
 * on every metric export and reports a steady baseline with light noise — enough
 * history for an anomaly detector to learn a band — until you POST /api/anomaly,
 * which makes it spike for a few minutes. Set an anomaly alert on this metric in
 * Temps and watch it fire — and email a chart — on demand.
 */
const activityLevel = meter.createObservableGauge("cadence.activity.level", {
  description: "Synthetic activity level (0-100); spikes on /api/anomaly",
  unit: "1",
});
activityLevel.addCallback((result) => {
  const baseline = 18 + (Math.random() * 4 - 2); // ~16–20
  const spike = 90 + Math.random() * 8; // ~90–98
  result.observe(anomalyActive() ? spike : baseline);
});
