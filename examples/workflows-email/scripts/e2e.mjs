// SPDX-FileCopyrightText: 2024-2026 Temps Contributors
// SPDX-License-Identifier: MIT OR Apache-2.0

// End-to-end check against a deployed copy of this example.
//
//   APP_URL=https://workflows-email.your-temps.example.com \
//   DEMO_API_KEY=... \
//   TEST_EMAIL_DOMAIN=mail.example.com \
//   node scripts/e2e.mjs
//
// Two users sign up with timings shortened to seconds:
//   - "activated" activates right after the welcome email → welcome + tips;
//   - "silent" never activates → welcome + reminder, then gives up.
// It also checks that signing up twice starts one sequence, not two.

import { strict as assert } from 'node:assert';
import { randomBytes } from 'node:crypto';

const appUrl = (process.env.APP_URL ?? '').replace(/\/+$/, '');
const apiKey = process.env.DEMO_API_KEY;
const domain = process.env.TEST_EMAIL_DOMAIN ?? 'example.com';
if (!appUrl || !apiKey) {
  console.error('Set APP_URL (the deployed app) and DEMO_API_KEY (the value configured on the deployment).');
  process.exit(2);
}

const timing = { activationTimeout: '15s', reminderTimeout: '15s', tipsDelay: '5s' };
const suffix = randomBytes(4).toString('hex');

async function call(method, path, body) {
  const response = await fetch(`${appUrl}${path}`, {
    method,
    headers: { authorization: `Bearer ${apiKey}`, ...(body ? { 'content-type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(30_000),
  });
  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  if (!response.ok) throw new Error(`${method} ${path} → HTTP ${response.status}: ${text}`);
  return { status: response.status, body: json };
}

async function waitFor(runId, predicate, what, timeoutMs = 120_000) {
  const deadline = Date.now() + timeoutMs;
  let run;
  while (Date.now() < deadline) {
    run = (await call('GET', `/runs/${runId}`)).body;
    if (predicate(run)) return run;
    if (['failed', 'cancelled', 'stuck'].includes(run.status)) break;
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(`Run ${runId} never reached "${what}"; last state: ${JSON.stringify(run)}`);
}

const log = (message, extra = {}) => console.log(JSON.stringify({ t: new Date().toISOString(), message, ...extra }));

// 1. Health and the executor manifest are reachable.
const health = await fetch(`${appUrl}/health`).then((r) => r.json());
assert.deepEqual(health.workflows, ['onboarding-emails']);
log('health ok');

// 2. Two signups.
const activated = { userId: `e2e-act-${suffix}`, email: `activated-${suffix}@${domain}`, name: 'Ada', timing };
const silent = { userId: `e2e-sil-${suffix}`, email: `silent-${suffix}@${domain}`, name: 'Grace', timing };

const a = await call('POST', '/signup', activated);
assert.equal(a.status, 201);
assert.equal(a.body.created, true);
const again = await call('POST', '/signup', activated);
assert.equal(again.body.runId, a.body.runId, 'a second signup must return the same run');
assert.equal(again.body.created, false);
log('signup idempotent', { runId: a.body.runId });

const s = await call('POST', '/signup', silent);
log('started', { activated: a.body.runId, silent: s.body.runId });

// 3. The activated user: wait until the welcome email is out and the run waits, then activate.
await waitFor(a.body.runId, (run) => run.status === 'waiting', 'waiting for activation');
log('activated user is waiting for the event');
const event = await call('POST', `/users/${activated.userId}/activate`);
assert.equal(event.body.delivered, 1, 'the activation event must wake exactly one run');

const doneA = await waitFor(a.body.runId, (run) => run.status === 'completed', 'completed');
log('activated user done', { output: doneA.output });
assert.equal(doneA.output.activated, true);
assert.equal(doneA.output.activatedVia, 'api');
assert.deepEqual(doneA.output.emails.map((e) => e.step), ['send-welcome', 'send-tips']);

// 4. The silent user: the reminder goes out after the activation timeout, then the run gives up.
const doneS = await waitFor(s.body.runId, (run) => run.status === 'completed', 'completed');
log('silent user done', { output: doneS.output });
assert.equal(doneS.output.activated, false);
assert.deepEqual(doneS.output.emails.map((e) => e.step), ['send-welcome', 'send-reminder']);

// 5. Every email went through Temps and got its own id.
const emails = [...doneA.output.emails, ...doneS.output.emails];
for (const email of emails) assert.ok(['sent', 'captured', 'queued'].includes(email.status), JSON.stringify(email));
assert.equal(new Set(emails.map((e) => e.id)).size, 4);
log('PASS', { emails });
