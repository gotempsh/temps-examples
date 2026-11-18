// SPDX-FileCopyrightText: 2024-2026 Temps Contributors
// SPDX-License-Identifier: MIT OR Apache-2.0

// The executor endpoints Temps calls: GET .../manifest and POST .../invoke.
// The handler verifies Temps' signed invocation token before running anything.

import { workflowHandler } from '@/lib/server.ts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET(request: Request): Promise<Response> {
  return workflowHandler()(request);
}

export function POST(request: Request): Promise<Response> {
  return workflowHandler()(request);
}
