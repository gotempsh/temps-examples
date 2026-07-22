"use client";

import { useSimulate } from "./SimulateProvider";

/**
 * The hero's primary call to action. Kicks off the simulated user journey (see
 * SimulateProvider). Disabled while a run is in flight so it can't be
 * double-triggered.
 */
export function SimulateCTA({ size = "lg" }: { size?: "lg" | "md" }) {
  const { start, running } = useSimulate();
  const pad = size === "lg" ? "px-5 py-3 text-base" : "px-4 py-2.5 text-sm";
  return (
    <button
      type="button"
      onClick={start}
      disabled={running}
      className={`group inline-flex items-center gap-2 rounded-lg bg-accent ${pad} font-medium text-accent-ink transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed disabled:opacity-70`}
    >
      <span
        aria-hidden
        className={`grid h-5 w-5 place-items-center rounded-full bg-accent-ink/15 text-xs ${running ? "cds-pulse" : ""}`}
      >
        ▶
      </span>
      {running ? "Simulating…" : "Simulate a user journey"}
    </button>
  );
}
