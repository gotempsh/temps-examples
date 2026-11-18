// SPDX-FileCopyrightText: 2024-2026 Temps Contributors
// SPDX-License-Identifier: MIT OR Apache-2.0

// Turns what the browser can see of a run into the steps the UI draws.
//
// The app-facing workflows API returns a run's status, plus its output once it
// finishes, not its journal. While a run is in flight the timeline is derived
// from that status, the configured timings and the activation this browser
// sent. Once the run finishes, the output is authoritative: it lists every
// email the run actually sent.

import { durationMs, type Timing } from './timing.ts';

export type RunStatus =
  | 'queued'
  | 'running'
  | 'sleeping'
  | 'waiting'
  | 'retrying'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'stuck';

export interface RunSnapshot {
  status: RunStatus;
  created_at: string;
  finished_at?: string | null;
  error?: string | null;
  output?: {
    activated: boolean;
    emails: { step: string; id: string; status: string }[];
  } | null;
}

export interface TrackedSignup {
  runId: string;
  userId: string;
  name: string;
  email: string;
  timing: Timing;
  /** When this browser delivered the activation event, if it did. */
  activatedAt?: string;
}

export type StepState = 'done' | 'active' | 'pending' | 'skipped' | 'failed';

export interface TimelineStep {
  key: 'welcome' | 'wait' | 'reminder' | 'wait-again' | 'pause' | 'tips';
  label: string;
  state: StepState;
  detail?: string;
  /** For an active timed step: when it ends (ISO). */
  until?: string;
  /** For a sent email, when the run has finished. */
  email?: { id: string; status: string };
}

export interface Timeline {
  steps: TimelineStep[];
  /** One-line summary of where the run is. */
  headline: string;
  finished: boolean;
  /** Whether the Activate button makes sense right now. */
  canActivate: boolean;
}

const LABELS: Record<TimelineStep['key'], string> = {
  welcome: 'Welcome email',
  wait: 'Wait for activation',
  reminder: 'Reminder email',
  'wait-again': 'Wait after reminder',
  pause: 'Pause before tips',
  tips: 'Tips email',
};

type Phase = TimelineStep['key'] | 'giving-up';

function step(key: TimelineStep['key'], state: StepState, extra: Partial<TimelineStep> = {}): TimelineStep {
  return { key, label: LABELS[key], state, ...extra };
}

/** Where an unfinished run is, from its status, its age and the activation we sent. */
function phase(run: RunSnapshot, signup: TrackedSignup, now: number): { phase: Phase; remindedFirst: boolean } {
  const started = Date.parse(run.created_at);
  const activationDeadline = started + durationMs(signup.timing.activationTimeout);
  const giveUpDeadline = activationDeadline + durationMs(signup.timing.reminderTimeout);
  const activatedAt = signup.activatedAt ? Date.parse(signup.activatedAt) : undefined;

  if (activatedAt !== undefined && activatedAt < giveUpDeadline) {
    const remindedFirst = activatedAt >= activationDeadline;
    if (run.status === 'sleeping') return { phase: 'pause', remindedFirst };
    if (run.status === 'waiting') return { phase: remindedFirst ? 'wait-again' : 'wait', remindedFirst };
    const tipsDue = activatedAt + durationMs(signup.timing.tipsDelay);
    return { phase: now >= tipsDue ? 'tips' : 'pause', remindedFirst };
  }
  if (now < activationDeadline) return { phase: run.status === 'waiting' ? 'wait' : 'welcome', remindedFirst: false };
  if (now < giveUpDeadline) return { phase: run.status === 'waiting' ? 'wait-again' : 'reminder', remindedFirst: true };
  return { phase: 'giving-up', remindedFirst: true };
}

const ORDER_REMINDED: TimelineStep['key'][] = ['welcome', 'wait', 'reminder', 'wait-again', 'pause', 'tips'];
const ORDER_DIRECT: TimelineStep['key'][] = ['welcome', 'wait', 'pause', 'tips'];

function untilFor(key: TimelineStep['key'], run: RunSnapshot, signup: TrackedSignup): string | undefined {
  const started = Date.parse(run.created_at);
  const activationDeadline = started + durationMs(signup.timing.activationTimeout);
  if (key === 'wait') return new Date(activationDeadline).toISOString();
  if (key === 'wait-again') return new Date(activationDeadline + durationMs(signup.timing.reminderTimeout)).toISOString();
  if (key === 'pause' && signup.activatedAt) {
    return new Date(Date.parse(signup.activatedAt) + durationMs(signup.timing.tipsDelay)).toISOString();
  }
  return undefined;
}

function finishedTimeline(run: RunSnapshot): Timeline {
  const output = run.output;
  const sent = new Map((output?.emails ?? []).map((e) => [e.step, e]));
  const email = (stepName: string) => {
    const found = sent.get(stepName);
    return found ? { id: found.id, status: found.status } : undefined;
  };
  const reminded = sent.has('send-reminder');
  const activated = output?.activated ?? false;
  const steps: TimelineStep[] = [
    step('welcome', 'done', { email: email('send-welcome') }),
    step('wait', 'done', { detail: reminded ? 'Timed out' : 'Activated' }),
  ];
  if (reminded) {
    steps.push(step('reminder', 'done', { email: email('send-reminder') }));
    steps.push(step('wait-again', 'done', { detail: activated ? 'Activated' : 'Timed out' }));
  }
  steps.push(step('pause', activated ? 'done' : 'skipped'));
  steps.push(step('tips', activated ? 'done' : 'skipped', { email: email('send-tips') }));
  const count = output?.emails.length ?? 0;
  return {
    steps,
    finished: true,
    canActivate: false,
    headline: activated
      ? `Completed: activated, ${count} emails sent`
      : `Completed: never activated, ${count} emails sent`,
  };
}

export function buildTimeline(run: RunSnapshot, signup: TrackedSignup, now: number = Date.now()): Timeline {
  if (run.status === 'completed') return finishedTimeline(run);

  const current = phase(run, signup, now);
  const order = current.remindedFirst ? ORDER_REMINDED : ORDER_DIRECT;
  const active: TimelineStep['key'] = current.phase === 'giving-up' ? 'wait-again' : current.phase;
  const activeIndex = order.indexOf(active);
  const broken = run.status === 'failed' || run.status === 'cancelled' || run.status === 'stuck';

  const steps = order.map((key, index): TimelineStep => {
    if (index < activeIndex) return step(key, 'done');
    if (index > activeIndex) return step(key, 'pending');
    if (broken) return step(key, 'failed', { detail: run.error ?? `Run ${run.status}` });
    return step(key, 'active', { until: untilFor(key, run, signup) });
  });

  const waitingForUser = run.status === 'waiting' && (active === 'wait' || active === 'wait-again') && !signup.activatedAt;
  const headlines: Record<Phase, string> = {
    welcome: 'Sending the welcome email…',
    wait: 'Welcome sent. Waiting for the user to activate.',
    reminder: 'No activation yet: sending the reminder…',
    'wait-again': 'Reminder sent. Waiting once more.',
    pause: 'Activated. Pausing before the tips email.',
    tips: 'Sending the tips email…',
    'giving-up': 'No activation: finishing the sequence…',
  };
  const headline = broken
    ? `Run ${run.status}${run.error ? `: ${run.error}` : ''}`
    : run.status === 'retrying'
      ? `${headlines[current.phase]} (retrying after a transient error)`
      : headlines[current.phase];

  return { steps, headline, finished: broken, canActivate: waitingForUser };
}
