// On-demand anomaly window for the demo.
//
// The "Trigger an anomaly" button POSTs `/api/anomaly`, which flips this on; the
// `guestbook.activity.level` observable-gauge callback in `metrics.ts` reads it
// on every metric export and spikes the value for a few minutes — so a Temps
// anomaly alert on the metric fires (and emails a chart) on demand.
//
// State lives on `globalThis`, NOT a module-level `let`: Next.js can bundle the
// route handler and `instrumentation.ts`/`metrics.ts` separately, so a per-module
// variable wouldn't be shared between the trigger and the gauge. `globalThis` is
// process-global, so they always agree. (Per-process, so with multiple replicas
// only the instance that served the POST spikes — fine for a demo.)

const KEY = "__temps_anomaly_until__";

function getUntil(): number {
  return (globalThis as Record<string, unknown>)[KEY] as number | undefined ?? 0;
}

/** Spike the synthetic metric for `durationSec` seconds (default 5 minutes). */
export function triggerAnomaly(durationSec = 300): number {
  const until = Date.now() + Math.max(1, durationSec) * 1000;
  (globalThis as Record<string, unknown>)[KEY] = until;
  return until;
}

/** Whether the synthetic metric should currently report anomalous values. */
export function anomalyActive(): boolean {
  return Date.now() < getUntil();
}

/** Current anomaly-window status for the API / UI. */
export function anomalyStatus(): { active: boolean; until: string | null } {
  const until = getUntil();
  return {
    active: Date.now() < until,
    until: until > Date.now() ? new Date(until).toISOString() : null,
  };
}
