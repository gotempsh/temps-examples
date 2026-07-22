import postgres from "postgres";
import { SpanKind, SpanStatusCode, trace } from "@opentelemetry/api";

const tracer = trace.getTracer("observability-starter");

/**
 * Wrap a Postgres query in a child span so DB calls show up in the Temps trace
 * waterfall. The `postgres` (porsager) client isn't auto-instrumented — only
 * Next.js requests and `fetch` are — so without this you'd see the route spans
 * but no database spans. We follow OTel DB semantic conventions (`db.system`,
 * `db.operation`, `db.sql.table`) and name spans `"<OPERATION> <table>"`.
 */
function dbSpan<T>(
  operation: string,
  table: string,
  fn: () => Promise<T>
): Promise<T> {
  return tracer.startActiveSpan(
    `${operation} ${table}`,
    {
      kind: SpanKind.CLIENT,
      attributes: {
        "db.system": "postgresql",
        "db.operation": operation,
        "db.sql.table": table,
      },
    },
    async (span) => {
      try {
        return await fn();
      } catch (err) {
        span.setStatus({ code: SpanStatusCode.ERROR, message: String(err) });
        throw err;
      } finally {
        span.end();
      }
    }
  );
}

/**
 * Postgres connection. When you deploy this template on Temps and attach a
 * Postgres service, Temps injects the connection string as `DATABASE_URL`
 * automatically — no manual wiring needed.
 *
 * We lazily create the client so the app can still build and render every page
 * even before a database is attached — features that need Postgres (like the
 * signup subscription write) simply report that it isn't configured yet.
 */
const connectionString =
  process.env.DATABASE_URL || process.env.POSTGRES_URL || "";

export const hasDatabase = connectionString.length > 0;

// Reuse the client across hot-reloads in dev to avoid exhausting connections.
const globalForDb = globalThis as unknown as {
  __sql?: ReturnType<typeof postgres>;
};

export const sql = hasDatabase
  ? (globalForDb.__sql ??= postgres(connectionString, { max: 5 }))
  : null;

export interface Subscription {
  id: number;
  name: string | null;
  email: string;
  company: string | null;
  plan: string;
  amount_cents: number;
  created_at: string;
}

/** Create the subscriptions table on first use. Safe to call repeatedly. */
export async function ensureSubscriptionsSchema(): Promise<void> {
  if (!sql) return;
  const db = sql;
  await dbSpan("CREATE TABLE", "subscriptions", () => db`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id SERIAL PRIMARY KEY,
      name TEXT,
      email TEXT NOT NULL,
      company TEXT,
      plan TEXT NOT NULL,
      amount_cents INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
  // Backfill the column on tables created before `name` existed (idempotent).
  await dbSpan("ALTER TABLE", "subscriptions", () => db`
    ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS name TEXT
  `);
}

export async function addSubscription(
  name: string,
  email: string,
  company: string,
  plan: string,
  amountCents: number
): Promise<Subscription> {
  if (!sql) {
    throw new Error("DATABASE_URL is not configured");
  }
  const db = sql;
  await ensureSubscriptionsSchema();
  const [row] = await dbSpan("INSERT", "subscriptions", () => db<Subscription[]>`
    INSERT INTO subscriptions (name, email, company, plan, amount_cents)
    VALUES (${name || null}, ${email}, ${company || null}, ${plan}, ${amountCents})
    RETURNING id, name, email, company, plan, amount_cents, created_at
  `);
  return row;
}
