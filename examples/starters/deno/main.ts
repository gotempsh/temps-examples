const port = parseInt(Deno.env.get("PORT") || "3000");

const server = Deno.serve({
  port,
  handler: (req) => {
    const url = new URL(req.url);
    
    if (url.pathname === "/") {
      return new Response(JSON.stringify({ message: "Hello from Deno on Temps!" }), {
        headers: { "Content-Type": "application/json" },
      });
    }
    
    if (url.pathname === "/health") {
      return new Response(JSON.stringify({ status: "ok" }), {
        headers: { "Content-Type": "application/json" },
      });
    }
    
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Listening on port ${server.port}`);
