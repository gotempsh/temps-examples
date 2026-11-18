// SPDX-FileCopyrightText: 2024-2026 Temps Contributors
// SPDX-License-Identifier: MIT OR Apache-2.0

// Server-only wiring: the executor handler Temps invokes, the client the API
// routes use, and the demo access check.
//
// Both are created on first use, not at import: `next build` imports route
// modules, and TEMPS_API_URL / TEMPS_WORKFLOWS_TOKEN only exist at runtime.

import { timingSafeEqual } from 'node:crypto';

import { createWorkflowHandler, WorkflowsClient, type FetchHandler } from '@temps-sdk/workflows';

import { createTempsMailer } from './mailer.ts';
import { createOnboardingWorkflow } from './onboarding.ts';

let handler: FetchHandler | undefined;
let client: WorkflowsClient | undefined;

export function workflowHandler(): FetchHandler {
  handler ??= createWorkflowHandler({ workflows: [createOnboardingWorkflow(createTempsMailer())] });
  return handler;
}

export function workflowsClient(): WorkflowsClient {
  client ??= new WorkflowsClient();
  return client;
}

export function problem(status: number, title: string, detail: string): Response {
  return Response.json({ type: 'about:blank', status, title, detail }, {
    status,
    headers: { 'content-type': 'application/problem+json' },
  });
}

/**
 * The demo routes send email to whatever address they are given, so they are
 * off until DEMO_API_KEY is set, and then need `Authorization: Bearer <key>`.
 * A real app would start the workflow from its own, authenticated, signup.
 */
export function demoAccess(request: Request): Response | null {
  const expected = process.env.DEMO_API_KEY;
  if (!expected) {
    return problem(503, 'Demo Disabled', 'Set the DEMO_API_KEY environment variable on the deployment to enable the demo.');
  }
  const given = Buffer.from((request.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, ''));
  const wanted = Buffer.from(expected);
  if (given.length !== wanted.length || !timingSafeEqual(given, wanted)) {
    return problem(401, 'Wrong Access Key', 'Enter the DEMO_API_KEY configured on this deployment.');
  }
  return null;
}

/** Turn an error from the workflows client into a Problem response. */
export function failure(operation: string, error: unknown): Response {
  const message = error instanceof Error ? error.message : String(error);
  console.error(JSON.stringify({ level: 'error', msg: `${operation} failed`, error: message }));
  return problem(502, `Could Not ${operation}`, message);
}
