// SPDX-FileCopyrightText: 2024-2026 Temps Contributors
// SPDX-License-Identifier: MIT OR Apache-2.0

// What is configured, so the page can say what is missing instead of failing
// later. Names only: no secret value ever leaves the server.

import { ONBOARDING_WORKFLOW } from '@/lib/onboarding.ts';

export const dynamic = 'force-dynamic';

export interface SetupStatus {
  workflow: string;
  tempsApi: boolean;
  workflowCredential: boolean;
  deploymentToken: boolean;
  emailFrom: string | null;
  demoEnabled: boolean;
}

export function GET(): Response {
  const status: SetupStatus = {
    workflow: ONBOARDING_WORKFLOW,
    tempsApi: Boolean(process.env.TEMPS_API_URL),
    workflowCredential: Boolean(process.env.TEMPS_WORKFLOWS_TOKEN),
    deploymentToken: Boolean(process.env.TEMPS_API_TOKEN),
    emailFrom: process.env.EMAIL_FROM || null,
    demoEnabled: Boolean(process.env.DEMO_API_KEY),
  };
  return Response.json(status);
}
