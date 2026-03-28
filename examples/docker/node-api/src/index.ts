import postgres from "postgres";

const sql = postgres(
  process.env.POSTGRES_URL ||
    "postgresql://app:secret@localhost:5432/appdb"
);

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

Bun.serve({
  port: 3000,
  routes: {
    "/health": {
      GET: async () => {
        try {
          await sql`SELECT 1`;
          return Response.json(
            {
              status: "ok",
              database: "connected",
              timestamp: new Date().toISOString(),
            },
            { headers }
          );
        } catch {
          return Response.json(
            { status: "error", database: "disconnected" },
            { status: 503, headers }
          );
        }
      },
    },
    "/api/todos": {
      GET: async () => {
        try {
          const todos = await sql`SELECT * FROM todos ORDER BY created_at DESC`;
          return Response.json(todos, { headers });
        } catch (err) {
          return Response.json(
            { error: "Failed to fetch todos" },
            { status: 500, headers }
          );
        }
      },
      POST: async (req) => {
        try {
          const body = await req.json();
          if (!body.title || typeof body.title !== "string") {
            return Response.json(
              { error: "title is required and must be a string" },
              { status: 400, headers }
            );
          }
          const [todo] = await sql`
            INSERT INTO todos (title) VALUES (${body.title}) RETURNING *
          `;
          return Response.json(todo, { status: 201, headers });
        } catch (err) {
          return Response.json(
            { error: "Failed to create todo" },
            { status: 500, headers }
          );
        }
      },
    },
    "/api/todos/:id": {
      PATCH: async (req) => {
        try {
          const id = req.params.id;
          const [todo] = await sql`
            UPDATE todos
            SET completed = NOT completed, updated_at = NOW()
            WHERE id = ${id}
            RETURNING *
          `;
          if (!todo) {
            return Response.json(
              { error: "Not found" },
              { status: 404, headers }
            );
          }
          return Response.json(todo, { headers });
        } catch (err) {
          return Response.json(
            { error: "Failed to update todo" },
            { status: 500, headers }
          );
        }
      },
      DELETE: async (req) => {
        try {
          const id = req.params.id;
          const [todo] = await sql`
            DELETE FROM todos WHERE id = ${id} RETURNING *
          `;
          if (!todo) {
            return Response.json(
              { error: "Not found" },
              { status: 404, headers }
            );
          }
          return Response.json({ deleted: true }, { headers });
        } catch (err) {
          return Response.json(
            { error: "Failed to delete todo" },
            { status: 500, headers }
          );
        }
      },
    },
    "/api/users": {
      GET: async () => {
        try {
          const users = await sql`SELECT * FROM users ORDER BY created_at DESC`;
          return Response.json(users, { headers });
        } catch (err) {
          return Response.json(
            { error: "Failed to fetch users" },
            { status: 500, headers }
          );
        }
      },
    },
  },
  fetch(req) {
    if (req.method === "OPTIONS") {
      return new Response(null, { headers });
    }
    return Response.json({ error: "Not found" }, { status: 404, headers });
  },
});

console.log("API server running on http://localhost:3000");
