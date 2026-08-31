// This app is deliberately NOT deployed by Temps — it's a plain Bun static
// server on its own origin, demonstrating how any app hosted anywhere else
// (Vercel, Netlify, GitHub Pages, your own VPS) sends analytics to a Temps
// instance.
//
// Normally Temps attributes analytics to a project by matching the request's
// Host header against its own route table, which only has entries for apps
// Temps itself deployed. An app hosted elsewhere has no such entry, so this
// demo instead authenticates with a project-scoped, non-secret "analytics
// ingest key" (see ADR-040) embedded directly in the page.
//
// Setup: see README.md in this directory.

const BASE_PATH = process.env.TEMPS_BASE_PATH;
const INGEST_KEY = process.env.TEMPS_INGEST_KEY;
const PORT = Number(process.env.PORT || 4300);

if (!BASE_PATH || !INGEST_KEY) {
  console.error("Set TEMPS_BASE_PATH and TEMPS_INGEST_KEY — see .env.example.");
  process.exit(1);
}

function page() {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Temps example: analytics ingest key</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 640px; margin: 4rem auto; padding: 0 1rem; }
    code { background: #f2f2f2; padding: 0.1rem 0.35rem; border-radius: 3px; }
    button { padding: 0.5rem 1rem; font-size: 1rem; cursor: pointer; }
    #log { margin-top: 1.5rem; font-size: 0.85rem; color: #555; }
  </style>
</head>
<body>
  <h1>App not hosted on Temps</h1>
  <p>This page is served by a plain Bun static server on <code>http://localhost:${PORT}</code> —
     a different origin than the Temps instance at <code>${BASE_PATH}</code>. There is no
     Temps deployment behind it, so Host-based route resolution can't attribute analytics
     to a project. Instead this page ships a project-scoped ingest key.</p>
  <button id="fire">Track a custom event</button>
  <div id="log">Loading...</div>

  <script
    defer
    data-base-path="${BASE_PATH}"
    data-ingest-key="${INGEST_KEY}"
    data-ignore-localhost="false"
    src="https://cdn.jsdelivr.net/npm/@temps-sdk/analytics-browser@latest/dist/temps.min.js"
  ></script>
  <script>
    window.addEventListener("DOMContentLoaded", () => {
      document.getElementById("log").textContent =
        "SDK auto-init fired on load: a page_view should already be on its way to " + ${JSON.stringify(BASE_PATH)} + ".";
    });
    document.getElementById("fire").addEventListener("click", () => {
      // The CDN auto-init script exposes the initialized instance on
      // window.temps (see analytics-browser's auto.ts boot()).
      if (window.temps && window.temps.trackEvent) {
        window.temps.trackEvent("demo_button_click", { source: "temps-examples" });
        document.getElementById("log").textContent = "Sent demo_button_click.";
      } else {
        document.getElementById("log").textContent = "window.temps not ready yet — reload and try again.";
      }
    });
  </script>
</body>
</html>`;
}

Bun.serve({
  port: PORT,
  routes: {
    "/": () => new Response(page(), { headers: { "content-type": "text/html" } }),
  },
});

console.log(`analytics-ingest-key example running at http://localhost:${PORT}`);
console.log(`  base path : ${BASE_PATH}`);
