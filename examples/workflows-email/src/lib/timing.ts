// SPDX-FileCopyrightText: 2024-2026 Temps Contributors
// SPDX-License-Identifier: MIT OR Apache-2.0

// Durations of the sequence. Shared by the workflow (server) and the timeline
// (browser), so this module imports nothing from the SDK.

export type Duration = `${number}${'ms' | 's' | 'm' | 'h' | 'd'}`;

export interface Timing {
  /** How long to wait for activation before sending the reminder. */
  activationTimeout: Duration;
  /** How long to wait after the reminder before giving up. */
  reminderTimeout: Duration;
  /** Pause between activation and the tips email. */
  tipsDelay: Duration;
}

/** Production timings. */
export const DEFAULT_TIMING: Timing = Object.freeze({
  activationTimeout: '3d',
  reminderTimeout: '4d',
  tipsDelay: '1d',
});

/** Demo timings: the whole sequence plays out in about a minute. */
export const DEMO_TIMING: Timing = Object.freeze({
  activationTimeout: '45s',
  reminderTimeout: '30s',
  tipsDelay: '10s',
});

const UNITS: Record<string, number> = { ms: 1, s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
const PATTERN = /^(\d+(?:\.\d+)?)(ms|s|m|h|d)$/;

export function isDuration(value: unknown): value is Duration {
  return typeof value === 'string' && PATTERN.test(value);
}

export function durationMs(duration: Duration): number {
  const match = PATTERN.exec(duration);
  if (!match) throw new Error(`Invalid duration '${duration}'`);
  return Number(match[1]) * (UNITS[match[2] as string] as number);
}

/** Keep only well-formed durations from untrusted input. */
export function parseTiming(value: unknown): Partial<Timing> | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const result: Partial<Timing> = {};
  for (const key of ['activationTimeout', 'reminderTimeout', 'tipsDelay'] as const) {
    const entry = (value as Record<string, unknown>)[key];
    if (isDuration(entry)) result[key] = entry;
  }
  return Object.keys(result).length > 0 ? result : undefined;
}
