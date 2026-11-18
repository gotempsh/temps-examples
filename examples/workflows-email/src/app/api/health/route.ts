// SPDX-FileCopyrightText: 2024-2026 Temps Contributors
// SPDX-License-Identifier: MIT OR Apache-2.0

// Liveness for the deployment health check.

export const dynamic = 'force-dynamic';

export function GET(): Response {
  return Response.json({ ok: true });
}
