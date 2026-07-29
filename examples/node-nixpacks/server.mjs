import { createServer } from "node:http";

const port = Number.parseInt(process.env.PORT ?? "3000", 10);
const message = process.env.APP_MESSAGE ?? "Hello from Node.js on Temps";

if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  throw new Error(`PORT must be an integer between 1 and 65535, received: ${process.env.PORT}`);
}

const server = createServer((request, response) => {
  response.setHeader("Content-Type", "application/json; charset=utf-8");

  if (request.url === "/health") {
    response.writeHead(200);
    response.end(JSON.stringify({ status: "ok" }));
    return;
  }

  if (request.url === "/") {
    response.writeHead(200);
    response.end(
      JSON.stringify({
        message,
        nodeVersion: process.version,
        provider: "nixpacks",
      }),
    );
    return;
  }

  response.writeHead(404);
  response.end(JSON.stringify({ error: "Not found" }));
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Node.js Nixpacks example listening on port ${port}`);
});

const shutdown = (signal) => {
  console.log(`Received ${signal}, shutting down`);
  server.close((error) => {
    if (error) {
      console.error("Failed to close the HTTP server", error);
      process.exitCode = 1;
      return;
    }

    process.exitCode = 0;
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
