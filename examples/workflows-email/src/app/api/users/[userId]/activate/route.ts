// SPDX-FileCopyrightText: 2024-2026 Temps Contributors
// SPDX-License-Identifier: MIT OR Apache-2.0

// The user activated: deliver the event the waiting run listens for.

import { ACTIVATED_EVENT } from '@/lib/onboarding.ts';
import { demoAccess, failure, problem, workflowsClient } from '@/lib/server.ts';

export const dynamic = 'force-dynamic';

export async function POST(request: Request, { params }: { params: Promise<{ userId: string }> }): Promise<Response> {
  const denied = demoAccess(request);
  if (denied) return denied;
  const { userId } = await params;
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(userId)) return problem(400, 'Invalid User', `'${userId}' is not a user id`);
  try {
    const { delivered } = await workflowsClient().sendEvent(ACTIVATED_EVENT, { key: userId, payload: { source: 'ui' } });
    return Response.json({ userId, delivered }, { status: 202 });
  } catch (error) {
    return failure('Send Event', error);
  }
}
