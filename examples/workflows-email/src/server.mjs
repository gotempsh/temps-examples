// SPDX-FileCopyrightText: 2024-2026 Temps Contributors
// SPDX-License-Identifier: MIT OR Apache-2.0

// The app: a small HTTP API that starts the onboarding workflow on signup and
// reports activations, plus the executor endpoints Temps calls to run it.
//
//   GET  /health                          liveness, for the deployment health check
//   POST /signup                          start the onboarding workflow for a user
//   POST /users/{userId}/activate         deliver the "user.activated" event
//   GET  /runs/{runId}                    read a run's status and output
//   *    /.well-known/temps/workflows/*   called by Temps (manifest + invoke)
//
// /signup sends email to the address it is given, so the three API routes
// require `Authorization: Bearer $DEMO_API_KEY` and are switched off until
// DEMO_API_KEY is set. A real app would call `workflows.start` from its own
// signup handler, behind its own authentication.

import { createServer } from 'node:http';
import { timingSafeEqual } from 'node:crypto';

import { createWorkflowHandler, toNodeListener, TempsApiError, WorkflowsClient } from '@temps-sdk/workflows';

import { createTempsMailer } from './mailer.mjs';
import { ACTIVATED_EVENT, createOnboardingWorkflow, ONBOARDING_WORKFLOW } from './workflows.mjs';

const onboarding = createOnboardingWorkflow(createTempsMailer());
const executor = toNodeListener(createWorkflowHandler({ workflows: [onboarding] }));

let client;
function workflowsClient() {
  // Constructed on first use so a missing TEMPS_WORKFLOWS_TOKEN is reported
  // by the request that needs it instead of crashing the process at boot.
  client ??= new WorkflowsClient();
  return client;
}

function send(response, status, body) {
  response.writeHead(status, { 'content-type': status >= 400 ? 'application/problem+json' : 'application/json' });
  response.end(JSON.stringify(body));
}

function problem(response, status, title, detail) {
  send(response, status, { type: 'about:blank', status, title, detail });
}

async function readJson(request, limit = 16 * 1024) {
  let size = 0;
  const chunks = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > limit) throw Object.assign(new Error(`Request body is larger than ${limit} bytes`), { status: 413 });
    chunks.push(chunk);
  }
  if (size === 0) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw Object.assign(new Error('Request body is not valid JSON'), { status: 400 });
  }
}

function authorized(request) {
  const expected = process.env.DEMO_API_KEY;
  if (!expected) return 'disabled';
  const given = (request.headers.authorization ?? '').replace(/^Bearer\s+/i, '');
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b) ? 'ok' : 'denied';
}

async function api(request, response, path) {
  const auth = authorized(request);
  if (auth === 'disabled') {
    return problem(response, 503, 'Demo API Disabled', 'Set the DEMO_API_KEY environment variable to enable /signup, /users/{id}/activate and /runs/{id}');
  }
  if (auth === 'denied') return problem(response, 401, 'Unauthorized', 'Send Authorization: Bearer <DEMO_API_KEY>');

  if (request.method === 'POST' && path === '/signup') {
    const body = await readJson(request);
    const input = {
      userId: body.userId,
      email: body.email,
      name: body.name,
      appUrl: body.appUrl,
      ...(body.timing ? { timing: body.timing } : {}),
    };
    if (typeof input.userId !== 'string' || input.userId === '') return problem(response, 400, 'Invalid Signup', 'userId is required');
    // One onboarding sequence per user, however many times signup is retried.
    const { run, created } = await workflowsClient().start(ONBOARDING_WORKFLOW, input, {
      idempotencyKey: `signup:${input.userId}`,
    });
    return send(response, created ? 201 : 200, { runId: run.id, status: run.status, created });
  }

  const activate = /^\/users\/([A-Za-z0-9_-]{1,64})\/activate$/.exec(path);
  if (request.method === 'POST' && activate) {
    const userId = activate[1];
    const { delivered } = await workflowsClient().sendEvent(ACTIVATED_EVENT, { key: userId, payload: { source: 'api' } });
    return send(response, 202, { userId, delivered });
  }

  const runPath = /^\/runs\/([0-9a-fA-F-]{36})$/.exec(path);
  if (request.method === 'GET' && runPath) {
    return send(response, 200, await workflowsClient().getRun(runPath[1]));
  }

  return problem(response, 404, 'Not Found', `No route for ${request.method} ${path}`);
}

const server = createServer((request, response) => {
  const path = (request.url ?? '/').split('?')[0];
  if (path === '/health') return send(response, 200, { ok: true, workflows: [ONBOARDING_WORKFLOW] });
  if (path.startsWith('/.well-known/temps/workflows/')) return void executor(request, response);

  api(request, response, path).catch((error) => {
    if (error instanceof TempsApiError) {
      console.error(JSON.stringify({ level: 'error', msg: 'temps workflows api error', path, error: error.message }));
      return problem(response, 502, 'Temps Workflows API Error', error.message);
    }
    const status = error.status ?? 500;
    if (status >= 500) console.error(JSON.stringify({ level: 'error', msg: 'request failed', path, error: String(error?.stack ?? error) }));
    problem(response, status, status >= 500 ? 'Internal Server Error' : 'Bad Request', error.message);
  });
});

// An invocation can run several steps; give it room before Node cuts it off.
server.requestTimeout = 120_000;
server.headersTimeout = 10_000;

const port = Number(process.env.PORT || 3000);
server.listen(port, '0.0.0.0', () => {
  console.log(JSON.stringify({ level: 'info', msg: 'workflows-email listening', port, workflows: [ONBOARDING_WORKFLOW] }));
});

for (const signal of ['SIGTERM', 'SIGINT']) {
  process.once(signal, () => {
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10_000).unref();
  });
}
