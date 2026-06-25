# Observability Starter

The fastest way to see Temps in action. One deploy gives you a working Next.js
app wired to **all four** of Temps' built-in observability tools, plus a Postgres
database — no SaaS subscriptions, no extra setup.

| Pillar | How it's wired | Where to see it in Temps |
|--------|----------------|--------------------------|
| **Analytics** | [`@temps-sdk/react-analytics`](src/lib/analytics.tsx) provider in the root layout (pageviews, engagement, a custom `guestbook_signed` event, session recording) | Project → Analytics |
| **Error tracking** | [`@sentry/nextjs`](sentry.client.config.ts) pointed at a Temps DSN (Temps is Sentry wire-compatible) | Project → Error Tracking |
| **Tracing & metrics** | OpenTelemetry traces **and metrics** exported via [`instrumentation.ts`](src/instrumentation.ts); each guestbook request is a custom span, and [`src/lib/metrics.ts`](src/lib/metrics.ts) emits custom counters | Project → Traces / Monitoring |
| **Database** | Postgres-backed [guestbook](src/lib/db.ts); `DATABASE_URL` is injected when you attach a Postgres service | Project → Storage |

Stack: Next.js 16 (App Router), React 19, Tailwind CSS v4, Postgres.

## Deploy on Temps (recommended)

1. From your Temps dashboard, open **New Project → Templates** and pick
   **Observability Starter** (it's also offered as a one-click "Try the demo
   app" action on an empty projects page).
2. Temps creates a Postgres service and attaches it — `DATABASE_URL` is injected
   automatically.
3. After it deploys, open the live URL:
   - Sign the **guestbook** → a row is written to Postgres and a
     `guestbook_signed` event lands in **Analytics**.
   - Click **Trigger an error** → an exception (with a session replay) lands in
     **Error Tracking**.
   - Every request shows up as a span in **Traces**.

To complete error tracking and tracing, copy the DSN and OTLP endpoint/token
from your project's **Error Tracking** and **Monitoring** settings into the
project's environment variables (see [`.env.example`](.env.example)) and redeploy.

## Run locally

```bash
bun install
cp .env.example .env.local   # fill in DATABASE_URL (the rest are optional locally)
bun run dev
```

Open [http://localhost:3000](http://localhost:3000). Without a `DATABASE_URL`
the app still runs — the guestbook just reports that no database is attached.
Analytics is suppressed on localhost by default (`ignoreLocalhost`); it's enabled
automatically in production.

## How it works

- **`src/lib/analytics.tsx`** — wraps the app in `TempsAnalyticsProvider`. On
  Temps the Pingora proxy treats `/api/_temps/*` as a public ingest path, so no
  app-side analytics route handler is needed.
- **`src/instrumentation.ts`** — Next.js `register()` hook initializes
  OpenTelemetry trace **and metric** export (each via an explicit OTLP exporter
  carrying the Temps ingest auth header) and loads the Sentry server/edge configs.
- **`src/lib/metrics.ts`** — a named OTel meter with custom counters
  (`guestbook.entries.created`, `guestbook.list.requests`), recorded from the
  guestbook route — the metrics equivalent of the custom spans.
- **`sentry.*.config.ts`** — Sentry client/server/edge init. The SDK is a no-op
  until a DSN is set, so the app ships safely without one.
- **`src/lib/db.ts`** — lazy Postgres client; creates the `guestbook` table on
  first use.
- **`src/app/api/guestbook/route.ts`** — DB read/write wrapped in custom OTel
  spans.
- **`src/app/api/error-test/route.ts`** — deliberately throws so you can verify
  error capture end-to-end.

## License

MIT
