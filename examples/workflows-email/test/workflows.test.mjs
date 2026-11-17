// SPDX-FileCopyrightText: 2024-2026 Temps Contributors
// SPDX-License-Identifier: MIT OR Apache-2.0

// Runs the real workflow against the SDK's in-memory orchestrator on a
// virtual clock: days of sleeps and waits pass instantly, and replays happen
// exactly as they would on Temps.

import { strict as assert } from 'node:assert';
import { test } from 'node:test';

import { createTestRunner } from '@temps-sdk/workflows/testing';

import { createTempsMailer, EmailRejectedError, idempotencyKeyFor } from '../src/mailer.mjs';
import { ACTIVATED_EVENT, createOnboardingWorkflow, ONBOARDING_WORKFLOW } from '../src/workflows.mjs';

const input = { userId: 'user_42', email: 'ada@example.com', name: 'Ada' };

/** Records every send; `script` lets a test fail the n-th call. */
function fakeMailer(script = []) {
  const sent = [];
  let calls = 0;
  return {
    sent,
    get calls() {
      return calls;
    },
    async send(message, key) {
      const outcome = script[calls++];
      if (outcome instanceof Error) throw outcome;
      sent.push({ to: message.to, subject: message.subject, tags: message.tags, key });
      return { id: `email-${sent.length}`, status: 'captured' };
    },
  };
}

function setup(mailer) {
  return createTestRunner({ workflows: [createOnboardingWorkflow(mailer)] });
}

test('activated user: welcome, then tips one day after activation', async () => {
  const mailer = fakeMailer();
  const runner = setup(mailer);
  const run = await runner.start(ONBOARDING_WORKFLOW, input);

  await runner.settle();
  assert.equal((await runner.run(run.id)).status, 'waiting');
  assert.deepEqual(mailer.sent.map((m) => m.tags[1]), ['welcome']);

  assert.equal(await runner.sendEvent(ACTIVATED_EVENT, { key: 'user_42', payload: { source: 'test' } }), 1);
  await runner.settle(); // delivering an event makes the run due; settle runs it
  assert.equal((await runner.run(run.id)).status, 'sleeping');

  await runner.advance('1d');
  await runner.advance('1m'); // just past the wake time
  const done = await runner.run(run.id);
  assert.equal(done.status, 'completed');
  assert.deepEqual(mailer.sent.map((m) => m.tags[1]), ['welcome', 'tips']);
  assert.deepEqual(done.output, {
    userId: 'user_42',
    activated: true,
    activatedVia: 'test',
    emails: [
      { step: 'send-welcome', id: 'email-1', status: 'captured' },
      { step: 'send-tips', id: 'email-2', status: 'captured' },
    ],
  });
});

test('an event for another user does not wake the run', async () => {
  const runner = setup(fakeMailer());
  const run = await runner.start(ONBOARDING_WORKFLOW, input);
  await runner.settle();
  assert.equal(await runner.sendEvent(ACTIVATED_EVENT, { key: 'user_7' }), 0);
  assert.equal((await runner.run(run.id)).status, 'waiting');
});

test('no activation: reminder after 3 days, gives up after 4 more', async () => {
  const mailer = fakeMailer();
  const runner = setup(mailer);
  const run = await runner.start(ONBOARDING_WORKFLOW, input);
  await runner.settle();

  await runner.advance('3d');
  await runner.advance('1m'); // just past the deadline
  assert.deepEqual(mailer.sent.map((m) => m.tags[1]), ['welcome', 'reminder']);
  assert.equal((await runner.run(run.id)).status, 'waiting');

  await runner.advance('4d');
  await runner.advance('1m'); // just past the deadline
  const done = await runner.run(run.id);
  assert.equal(done.status, 'completed');
  assert.equal(done.output.activated, false);
  assert.equal(mailer.sent.length, 2);
});

test('activation after the reminder still gets the tips email', async () => {
  const mailer = fakeMailer();
  const runner = setup(mailer);
  const run = await runner.start(ONBOARDING_WORKFLOW, input);
  await runner.settle();
  await runner.advance('3d');
  await runner.advance('1m'); // just past the deadline
  await runner.sendEvent(ACTIVATED_EVENT, { key: 'user_42' });
  await runner.settle();
  await runner.advance('1d');
  await runner.advance('1m'); // just past the wake time
  const done = await runner.run(run.id);
  assert.equal(done.status, 'completed');
  assert.deepEqual(mailer.sent.map((m) => m.tags[1]), ['welcome', 'reminder', 'tips']);
});

test('replays never resend: each email is sent once across many invocations', async () => {
  const mailer = fakeMailer();
  const runner = setup(mailer);
  const run = await runner.start(ONBOARDING_WORKFLOW, input);
  await runner.settle();
  await runner.advance('3d');
  await runner.advance('1m'); // just past the deadline
  await runner.sendEvent(ACTIVATED_EVENT, { key: 'user_42' });
  await runner.settle();
  await runner.advance('1d');
  await runner.advance('1m'); // just past the wake time
  // Four invocations replayed the journal; three sends happened in total.
  assert.equal(mailer.calls, 3);
  const keys = mailer.sent.map((m) => m.key);
  assert.deepEqual(keys, [
    idempotencyKeyFor(run.id, 'send-welcome'),
    idempotencyKeyFor(run.id, 'send-reminder'),
    idempotencyKeyFor(run.id, 'send-tips'),
  ]);
});

test('a transient failure is retried with the same idempotency key', async () => {
  const mailer = fakeMailer([new Error('HTTP 503')]);
  const runner = setup(mailer);
  const run = await runner.start(ONBOARDING_WORKFLOW, input);
  await runner.settle();
  assert.equal((await runner.run(run.id)).status, 'retrying');
  await runner.advance('2s');
  assert.equal((await runner.run(run.id)).status, 'waiting');
  assert.equal(mailer.calls, 2);
  assert.equal(mailer.sent.length, 1);
  assert.equal(mailer.sent[0].key, idempotencyKeyFor(run.id, 'send-welcome'));
});

test('a rejected email fails the run once, without retrying', async () => {
  const mailer = fakeMailer([new EmailRejectedError(400, 'Domain example.com is not authorized for project 1', 'k')]);
  const runner = setup(mailer);
  const run = await runner.start(ONBOARDING_WORKFLOW, input);
  await runner.settle();
  const done = await runner.run(run.id);
  assert.equal(done.status, 'failed');
  assert.match(done.error, /send-welcome.*not authorized/);
  assert.equal(mailer.calls, 1);
});

test('invalid input fails the run before any email is sent', async () => {
  const mailer = fakeMailer();
  const runner = setup(mailer);
  const run = await runner.start(ONBOARDING_WORKFLOW, { userId: 'ada@example.com', email: 'nope', name: '' });
  await runner.settle();
  const done = await runner.run(run.id);
  assert.equal(done.status, 'failed');
  assert.match(done.error, /userId must be.*email must be.*name is required/);
  assert.equal(mailer.calls, 0);
});

test('idempotency keys satisfy the Temps email API rule', () => {
  const key = idempotencyKeyFor('0b6f3c5e-8a51-4a52-9e5e-2f1c8f3f0a11', 'emails/send welcome');
  assert.match(key, /^[A-Za-z0-9_:.-]{1,128}$/);
  assert.throws(() => idempotencyKeyFor('r', 'x'.repeat(130)), /longer than 128/);
});

test('mailer: posts to /emails with the deployment token and the idempotency key', async () => {
  const calls = [];
  const mailer = createTempsMailer({
    apiUrl: 'https://temps.example.com/api/',
    token: 'dt_test',
    from: 'hello@mail.example.com',
    fetch: async (url, init) => {
      calls.push({ url, init });
      return new Response(JSON.stringify({ id: 'e1', status: 'sent' }), { status: 201 });
    },
  });
  const result = await mailer.send({ to: 'ada@example.com', subject: 'Hi', html: '<p>Hi</p>', text: 'Hi' }, 'wf:r:s');
  assert.deepEqual(result, { id: 'e1', status: 'sent' });
  assert.equal(calls[0].url, 'https://temps.example.com/api/emails');
  assert.equal(calls[0].init.headers.authorization, 'Bearer dt_test');
  assert.equal(calls[0].init.headers['idempotency-key'], 'wf:r:s');
  assert.deepEqual(JSON.parse(calls[0].init.body).to, ['ada@example.com']);
});

test('mailer: 4xx is a permanent rejection, 5xx and 429 are transient', async () => {
  const reply = (status) =>
    createTempsMailer({
      apiUrl: 'https://t/api',
      token: 't',
      from: 'a@b.c',
      fetch: async () => new Response(JSON.stringify({ detail: `status ${status}` }), { status }),
    });
  const message = { to: 'x@y.z', subject: 's', html: 'h', text: 't' };
  await assert.rejects(reply(400).send(message, 'k'), EmailRejectedError);
  await assert.rejects(reply(409).send(message, 'k'), EmailRejectedError);
  for (const status of [429, 500, 503]) {
    await assert.rejects(reply(status).send(message, 'k'), (error) => !(error instanceof EmailRejectedError));
  }
});

test('mailer: missing configuration is reported by name', async () => {
  const mailer = createTempsMailer({ apiUrl: '', token: '', from: '' });
  await assert.rejects(mailer.send({ to: 'x@y.z' }, 'k'), /TEMPS_API_URL, TEMPS_API_TOKEN, EMAIL_FROM/);
});
