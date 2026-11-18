// SPDX-FileCopyrightText: 2024-2026 Temps Contributors
// SPDX-License-Identifier: MIT OR Apache-2.0

// A run's status, and its output once it finished.

import { demoAccess, failure, problem, workflowsClient } from '@/lib/server.ts';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: Promise<{ runId: string }> }): Promise<Response> {
  const denied = demoAccess(request);
  if (denied) return denied;
  const { runId } = await params;
  if (!/^[0-9a-fA-F-]{36}$/.test(runId)) return problem(400, 'Invalid Run', `'${runId}' is not a run id`);
  try {
    return Response.json(await workflowsClient().getRun(runId));
  } catch (error) {
    return failure('Read Run', error);
  }
}
