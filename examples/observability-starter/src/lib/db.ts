import postgres from "postgres";

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
  await sql`
    CREATE TABLE IF NOT EXISTS guestbook (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
}

export async function listEntries(limit = 20): Promise<GuestbookEntry[]> {
  if (!sql) return [];
  await ensureSchema();
  return sql<GuestbookEntry[]>`
    SELECT id, name, message, created_at
    FROM guestbook
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
}

export async function addEntry(
  name: string,
  message: string
): Promise<GuestbookEntry> {
  if (!sql) {
    throw new Error("DATABASE_URL is not configured");
  }
  await ensureSchema();
  const [row] = await sql<GuestbookEntry[]>`
    INSERT INTO guestbook (name, message)
    VALUES (${name}, ${message})
    RETURNING id, name, message, created_at
  `;
  return row;
}
