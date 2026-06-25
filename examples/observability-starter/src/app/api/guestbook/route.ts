import { NextResponse } from "next/server";
import { trace } from "@opentelemetry/api";
import { addEntry, hasDatabase, listEntries } from "@/lib/db";
import { guestbookEntriesCreated, guestbookListRequests } from "@/lib/metrics";

const tracer = trace.getTracer("observability-starter");

// GET /api/guestbook — list recent entries (demonstrates a DB read inside a
// custom OpenTelemetry span, so you can see the query latency in Temps Traces,
// plus a custom counter so the request shows up in Temps Metrics).
export async function GET() {
  return tracer.startActiveSpan("guestbook.list", async (span) => {
    try {
      const entries = await listEntries();
      span.setAttribute("guestbook.count", entries.length);
      guestbookListRequests.add(1, { outcome: "ok" });
      return NextResponse.json({ hasDatabase, entries });
    } catch (err) {
      guestbookListRequests.add(1, { outcome: "error" });
      throw err;
    } finally {
      span.end();
    }
  });
}

// POST /api/guestbook — add an entry.
export async function POST(request: Request) {
  return tracer.startActiveSpan("guestbook.add", async (span) => {
    try {
      if (!hasDatabase) {
        return NextResponse.json(
          {
            error:
              "No database attached. Attach a Postgres service in Temps and redeploy — DATABASE_URL is injected automatically.",
          },
          { status: 503 }
        );
      }

      const body = (await request.json()) as {
        name?: unknown;
        message?: unknown;
      };
      const name = String(body.name ?? "").trim();
      const message = String(body.message ?? "").trim();

      if (!name || !message) {
        return NextResponse.json(
          { error: "Both name and message are required" },
          { status: 400 }
        );
      }

      const entry = await addEntry(name.slice(0, 80), message.slice(0, 280));
      span.setAttribute("guestbook.entry_id", entry.id);
      guestbookEntriesCreated.add(1);
      return NextResponse.json({ entry }, { status: 201 });
    } finally {
      span.end();
    }
  });
}
