import { NextResponse } from "next/server";
import { triggerAnomaly, anomalyStatus } from "@/lib/anomaly-state";

// Metrics are Node-only here (the OTLP/proto exporter), and the anomaly gauge
// lives in the same process, so pin this route to the Node runtime.
export const runtime = "nodejs";

// POST /api/anomaly?duration=300 — spike the `guestbook.activity.level` gauge for
// `duration` seconds (default 5 minutes) so a Temps anomaly alert on it fires.
export async function POST(request: Request) {
  const duration = Number(new URL(request.url).searchParams.get("duration"));
  triggerAnomaly(Number.isFinite(duration) && duration > 0 ? duration : 300);
  return NextResponse.json({ triggered: true, ...anomalyStatus() });
}

// GET /api/anomaly — current anomaly-window status.
export async function GET() {
  return NextResponse.json(anomalyStatus());
}
