import { NextResponse } from "next/server";
import { trace } from "@opentelemetry/api";
import { addSubscription, hasDatabase } from "@/lib/db";
import {
  subscribeRequestDuration,
  subscriptionMrrCents,
  subscriptionsCreated,
} from "@/lib/metrics";

const tracer = trace.getTracer("observability-starter");

const PLAN_PRICES_CENTS: Record<string, number> = {
  free: 0,
  pro: 2900,
  scale: 9900,
};

// POST /api/subscribe — record a new subscription. Demonstrates a DB write
// inside a custom OpenTelemetry span (see it in Temps → Traces, with the nested
// INSERT span), plus custom counters/histograms (Temps → Metrics). Degrades
// gracefully to 503 when no database is attached.
export async function POST(request: Request) {
  return tracer.startActiveSpan("cadence.subscribe", async (span) => {
    const start = performance.now();
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

      const body = (await request.json().catch(() => ({}))) as {
        name?: unknown;
        email?: unknown;
        company?: unknown;
        plan?: unknown;
      };
      const name = String(body.name ?? "")
        .trim()
        .slice(0, 120);
      const email = String(body.email ?? "demo@cadence.app")
        .trim()
        .slice(0, 120);
      const company = String(body.company ?? "")
        .trim()
        .slice(0, 120);
      const plan = String(body.plan ?? "pro")
        .trim()
        .toLowerCase();
      const amount = PLAN_PRICES_CENTS[plan] ?? PLAN_PRICES_CENTS.pro;

      const subscription = await addSubscription(name, email, company, plan, amount);
      span.setAttribute("cadence.subscription_id", subscription.id);
      span.setAttribute("cadence.plan", plan);
      span.setAttribute("cadence.mrr_cents", amount);
      subscriptionsCreated.add(1, { plan });
      subscriptionMrrCents.add(amount, { plan });

      return NextResponse.json({ subscription }, { status: 201 });
    } finally {
      subscribeRequestDuration.record(performance.now() - start, {
        route: "subscribe",
      });
      span.end();
    }
  });
}
