# Analytics Ingest Key

Demonstrates Temps' project-scoped analytics ingest key (ADR-040): how to
send Temps analytics, session replay, and performance data from an app Temps
does **not** deploy — Vercel, Netlify, GitHub Pages, or, as here, a plain
server on its own machine.

Temps normally attributes analytics to a project by matching the request's
`Host` header against its own route table, which only has entries for apps
Temps itself deployed. An app hosted anywhere else has no such entry, so
Temps instead supports an ingest key: a non-secret, project-scoped credential
you embed directly in client-side JS.

## Setup

1. In the Temps Console, go to **Project → Analytics → Setup → "Not hosted on
   Temps"** and copy the ingest key (or mint one via
   `bunx @temps-sdk/cli analytics keys create --project <project>`).
2. `cp .env.example .env` and fill in `TEMPS_BASE_PATH` (your Temps instance,
   including the `/api/_temps` suffix) and `TEMPS_INGEST_KEY`.
3. `bun install && bun run dev`
4. Open http://localhost:4300 and click "Track a custom event". Check
   **Project → Analytics** in the Console for the pageview and the event.

## Notes

- If `TEMPS_BASE_PATH` points at a `localhost` Temps instance, keep
  `data-ignore-localhost="false"` on the script tag in `index.mjs`. The SDK's
  `ignoreLocalhost` option defaults to `true` and silently drops every event
  on a page whose own origin looks like `localhost`/`127.*`/`file:`. Remove
  that attribute (or set it back to the default) once this demo is deployed
  on a real domain — you don't want to ignore real visitors' localhost too.
- The ingest key is safe to ship in client JS: it only grants analytics
  ingest for the one project (optionally one environment) it was minted for.
  Manage it anytime with `bunx @temps-sdk/cli analytics keys list`.
