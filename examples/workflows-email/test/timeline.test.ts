// SPDX-FileCopyrightText: 2024-2026 Temps Contributors
// SPDX-License-Identifier: MIT OR Apache-2.0

// The timeline the UI draws, from what the browser can see of a run.

import { strict as assert } from 'node:assert';
import { test } from 'node:test';

import { buildTimeline, type RunSnapshot, type TrackedSignup } from '../src/lib/timeline.ts';
import { parseTiming } from '../src/lib/timing.ts';

const T0 = Date.parse('2026-01-01T00:00:00Z');
const at = (seconds: number) => T0 + seconds * 1000;
const iso = (seconds: number) => new Date(at(seconds)).toISOString();

const signup = (extra: Partial<TrackedSignup> = {}): TrackedSignup => ({
  runId: '00000000-0000-4000-8000-000000000001',
  userId: 'user_1',
  name: 'Ada',
  email: 'ada@example.com',
  timing: { activationTimeout: '45s', reminderTimeout: '30s', tipsDelay: '10s' },
  ...extra,
});

const run = (status: RunSnapshot['status'], extra: Partial<RunSnapshot> = {}): RunSnapshot => ({
  status,
  created_at: iso(0),
  ...extra,
});

const states = (timeline: ReturnType<typeof buildTimeline>) => timeline.steps.map((s) => `${s.key}:${s.state}`);

test('a fresh run is sending the welcome email', () => {
  const timeline = buildTimeline(run('running'), signup(), at(1));
  assert.deepEqual(states(timeline), ['welcome:active', 'wait:pending', 'pause:pending', 'tips:pending']);
  assert.equal(timeline.canActivate, false);
});

test('waiting before the activation deadline offers Activate, with a countdown to the deadline', () => {
  const timeline = buildTimeline(run('waiting'), signup(), at(5));
  assert.deepEqual(states(timeline), ['welcome:done', 'wait:active', 'pause:pending', 'tips:pending']);
  assert.equal(timeline.canActivate, true);
  assert.equal(timeline.steps[1]?.until, iso(45));
});

test('after activation the run pauses before the tips email', () => {
  const s = signup({ activatedAt: iso(10) });
  assert.equal(buildTimeline(run('waiting'), s, at(10)).canActivate, false, 'the event is on its way: no second click');
  const timeline = buildTimeline(run('sleeping'), s, at(12));
  assert.deepEqual(states(timeline), ['welcome:done', 'wait:done', 'pause:active', 'tips:pending']);
  assert.equal(timeline.steps[2]?.until, iso(20));
  assert.deepEqual(states(buildTimeline(run('running'), s, at(21))), ['welcome:done', 'wait:done', 'pause:done', 'tips:active']);
});

test('past the activation deadline the reminder path appears', () => {
  assert.deepEqual(states(buildTimeline(run('running'), signup(), at(46))), [
    'welcome:done',
    'wait:done',
    'reminder:active',
    'wait-again:pending',
    'pause:pending',
    'tips:pending',
  ]);
  const waiting = buildTimeline(run('waiting'), signup(), at(50));
  assert.equal(waiting.steps[3]?.state, 'active');
  assert.equal(waiting.steps[3]?.until, iso(75));
  assert.equal(waiting.canActivate, true);
});

test('activating after the reminder keeps the reminder in the timeline', () => {
  const timeline = buildTimeline(run('sleeping'), signup({ activatedAt: iso(60) }), at(62));
  assert.deepEqual(states(timeline), ['welcome:done', 'wait:done', 'reminder:done', 'wait-again:done', 'pause:active', 'tips:pending']);
});

test('a completed run is drawn from its output, with the emails it sent', () => {
  const activated = buildTimeline(
    run('completed', {
      output: {
        activated: true,
        emails: [
          { step: 'send-welcome', id: 'e1', status: 'captured' },
          { step: 'send-tips', id: 'e2', status: 'captured' },
        ],
      },
    }),
    signup(),
    at(100),
  );
  assert.equal(activated.finished, true);
  assert.deepEqual(states(activated), ['welcome:done', 'wait:done', 'pause:done', 'tips:done']);
  assert.deepEqual(activated.steps[3]?.email, { id: 'e2', status: 'captured' });
  assert.match(activated.headline, /activated, 2 emails sent/);

  const silent = buildTimeline(
    run('completed', {
      output: {
        activated: false,
        emails: [
          { step: 'send-welcome', id: 'e1', status: 'sent' },
          { step: 'send-reminder', id: 'e3', status: 'sent' },
        ],
      },
    }),
    signup(),
    at(100),
  );
  assert.deepEqual(states(silent), ['welcome:done', 'wait:done', 'reminder:done', 'wait-again:done', 'pause:skipped', 'tips:skipped']);
  assert.match(silent.headline, /never activated/);
});

test('a failed run marks the current step failed with the error, and stops', () => {
  const timeline = buildTimeline(
    run('failed', { error: "Step 'send-welcome' could not send: domain not allowed" }),
    signup(),
    at(2),
  );
  assert.equal(timeline.finished, true);
  assert.equal(timeline.steps[0]?.state, 'failed');
  assert.match(timeline.steps[0]?.detail ?? '', /domain not allowed/);
  assert.equal(timeline.canActivate, false);
});

test('parseTiming keeps only well-formed durations', () => {
  assert.deepEqual(parseTiming({ activationTimeout: '30s', reminderTimeout: 'soon', tipsDelay: 5 }), { activationTimeout: '30s' });
  assert.equal(parseTiming('3d'), undefined);
  assert.equal(parseTiming({}), undefined);
});
