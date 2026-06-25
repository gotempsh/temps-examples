import { NextResponse } from "next/server";

// GET /api/error-test — deliberately throws so you can confirm error tracking
// works end-to-end. With a Sentry DSN configured, this exception (and a session
// replay of the click that triggered it) shows up in the project's Error
// Tracking tab. Next.js + @sentry/nextjs capture the uncaught throw
// automatically; no manual captureException needed.
export async function GET() {
  throw new Error(
    "Test error from /api/error-test — this is expected. Check Temps → Error Tracking."
  );

  // Unreachable, but keeps the route's return type honest for the type checker.
  return NextResponse.json({ ok: true });
}
