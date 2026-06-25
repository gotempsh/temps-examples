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
 * We lazily create the client so the app can still build and render its landing
 * page even before a database is attached (the guestbook simply reports that the
 * database is not configured yet).
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

export interface GuestbookEntry {
  id: number;
  name: string;
  message: string;
  created_at: string;
}

/** Create the guestbook table on first use. Safe to call repeatedly. */
export async function ensureSchema(): Promise<void> {
  if (!sql) return;
  const db = sql;
  await dbSpan("CREATE TABLE", "guestbook", () => db`
    CREATE TABLE IF NOT EXISTS guestbook (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
}

export async function listEntries(limit = 20): Promise<GuestbookEntry[]> {
  if (!sql) return [];
  const db = sql;
  await ensureSchema();
  return dbSpan("SELECT", "guestbook", () => db<GuestbookEntry[]>`
    SELECT id, name, message, created_at
    FROM guestbook
    ORDER BY created_at DESC
    LIMIT ${limit}
  `);
}

export async function addEntry(
  name: string,
  message: string
): Promise<GuestbookEntry> {
  if (!sql) {
    throw new Error("DATABASE_URL is not configured");
  }
  const db = sql;
  await ensureSchema();
  const [row] = await dbSpan("INSERT", "guestbook", () => db<GuestbookEntry[]>`
    INSERT INTO guestbook (name, message)
    VALUES (${name}, ${message})
    RETURNING id, name, message, created_at
  `);
  return row;
}
