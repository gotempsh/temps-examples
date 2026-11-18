// SPDX-FileCopyrightText: 2024-2026 Temps Contributors
// SPDX-License-Identifier: MIT OR Apache-2.0

// Start the onboarding sequence for a new user.

import { inputProblems, ONBOARDING_WORKFLOW, type OnboardingInput } from '@/lib/onboarding.ts';
import { demoAccess, failure, problem, workflowsClient } from '@/lib/server.ts';
import { parseTiming } from '@/lib/timing.ts';

export const dynamic = 'force-dynamic';

export async function POST(request: Request): Promise<Response> {
  const denied = demoAccess(request);
  if (denied) return denied;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return problem(400, 'Invalid Signup', 'The request body must be JSON');
  }
  const input: OnboardingInput = {
    userId: String(body.userId ?? ''),
    email: String(body.email ?? ''),
    name: String(body.name ?? '').trim(),
    appUrl: new URL('/', request.url).toString(),
  };
  const timing = parseTiming(body.timing);
  if (timing) input.timing = timing;
  const problems = inputProblems(input);
  if (problems.length > 0) return problem(400, 'Invalid Signup', problems.join('; '));

  try {
    // One sequence per user, however many times signup is retried.
    const { run, created } = await workflowsClient().start(ONBOARDING_WORKFLOW, { ...input }, {
      idempotencyKey: `signup:${input.userId}`,
    });
    return Response.json({ runId: run.id, status: run.status, created, createdAt: run.created_at }, { status: created ? 201 : 200 });
  } catch (error) {
    return failure('Start Workflow', error);
  }
}
