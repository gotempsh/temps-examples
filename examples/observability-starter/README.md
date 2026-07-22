# Cadence — Observability Starter

A mock **revenue-analytics SaaS** ("Cadence") that doubles as the fastest way to
see Temps in action. One deploy gives you a polished multi-page product wired to
**all four** of Temps' built-in observability tools, plus a Postgres database —
no SaaS subscriptions, no extra setup.

The headline is the **“Simulate a user journey ▶”** button on the landing page:
one click drives a real front-end journey through the funnel
(`/` → `/pricing` → `/signup` → `/dashboard`), firing pageviews, funnel events, a
subscription write, and a caught error — so Analytics, Traces, Logs, and Error
tracking all light up in your Temps project while you watch.

| Pillar | How it's wired | Where to see it in Temps |
|--------|----------------|--------------------------|
| **Analytics** | [`@temps-sdk/react-analytics`](src/lib/analytics.tsx) provider in the root layout: auto pageviews across the real routes, engagement, session recording, and a funnel of custom events (`viewed_pricing` → `plan_selected` → `signup_started` → `account_created` → `subscribed`) | Project → Analytics |
| **Error tracking** | [`@sentry/nextjs`](sentry.client.config.ts) pointed at a Temps DSN (Temps is Sentry wire-compatible); the journey triggers one caught error via [`/api/error-test`](src/app/api/error-test/route.ts) | Project → Error Tracking |
| **Tracing & metrics** | OpenTelemetry traces **and metrics** via [`instrumentation.ts`](src/instrumentation.ts). [`/api/subscribe`](src/app/api/subscribe/route.ts) is a custom span with a nested DB `INSERT` span, and [`src/lib/metrics.ts`](src/lib/metrics.ts) emits a **counter** (`cadence.subscriptions.created`), an MRR counter, a latency **histogram** (`cadence.subscribe.duration` → p50/p95/p99), and an **observable gauge** (`cadence.activity.level`) | Project → OpenTelemetry → Traces / Metrics |
| **Anomaly on demand** | A POST to [`/api/anomaly`](src/app/api/anomaly/route.ts) makes `cadence.activity.level` spike for 5 min — set an anomaly alert on it and watch it fire (and email a chart) | Project → OpenTelemetry → Metrics → Alerts |
| **Database** | Postgres-backed [`subscriptions`](src/lib/db.ts) table; **signing up writes a real row** (best-effort — the app still works with no DB). `DATABASE_URL` is injected when you attach a Postgres service | Project → Storage |

Stack: Next.js 16 (App Router), React 19, Tailwind CSS v4, Postgres.

## The demo app

- **Landing** (`/`) — product page with the **Simulate a user journey** button.
- **Pricing** (`/pricing`) — Free / Pro / Scale; “Choose plan” carries the plan into signup.
- **Sign up** (`/signup`) — creates an account: writes a subscription to Postgres,
  fires the funnel events, and **signs you in** (the nav shows your account). No
  real auth — the session is a small client-side account in `localStorage`.
- **Dashboard** (`/dashboard`) — a mock product overview (MRR, subscribers, churn,
  a revenue chart). Figures are clearly labelled **SAMPLE DATA**.

## Deploy on Temps (recommended)

1. From your Temps dashboard, open **New Project → Templates** and pick this
   template (also offered as a one-click "Try the demo app" action on an empty
   projects page).
2. Temps creates a Postgres service and attaches it — `DATABASE_URL` is injected
   automatically, and the OTLP endpoint/token + Sentry DSN are injected on deploy
   when Monitoring / Error Tracking are enabled.
3. Open the live URL and click **Simulate a user journey** (or sign up manually):
   - Real pageviews across `/`, `/pricing`, `/signup`, `/dashboard` and the funnel
     events land in **Analytics** (with a session recording).
   - The subscription `INSERT` shows up in **Traces** (nested under the
     `cadence.subscribe` span) and increments the **Metrics**.
   - The caught error lands in **Error Tracking**.

`OTEL_*` / `SENTRY_*` are injected automatically on Temps; see
[`.env.example`](.env.example) if you want to set them by hand.

## Run locally

```bash
bun install
cp .env.example .env.local   # DATABASE_URL is optional; the rest are optional locally
bun run dev
```

Open [http://localhost:3000](http://localhost:3000). Without a `DATABASE_URL` the
app still runs fully — signup just skips the subscription write and still signs
you in. Analytics is suppressed on localhost by default (`ignoreLocalhost`); it's
enabled automatically in production.

## How it works

- **`src/lib/analytics.tsx`** — wraps the app in `TempsAnalyticsProvider`
  (auto pageviews, engagement, session recording). On Temps the Pingora proxy
  treats `/api/_temps/*` as a public ingest path, so no app-side analytics route
  handler is needed.
- **`src/components/SimulateProvider.tsx`** — the “Simulate” engine. Mounted above
  the page tree so it survives navigation; it `router.push`es through the funnel,
  fires the custom events, POSTs `/api/subscribe`, and triggers the caught error,
  with a progress overlay.
- **`src/instrumentation.ts`** — Next.js `register()` hook initializes OpenTelemetry
  trace **and metric** export (explicit OTLP exporters carrying the Temps ingest
  auth header) and loads the Sentry server/edge configs.
- **`src/lib/metrics.ts`** — a named OTel meter with a counter, an MRR counter, a
  latency **histogram** (p50/p95/p99), and an **observable gauge**
  (`cadence.activity.level`) for anomaly detection.
- **`src/lib/db.ts`** — lazy Postgres client; creates the `subscriptions` table on
  first use. DB reads/writes are wrapped in custom OTel spans.
- **`src/app/api/subscribe/route.ts`** — records a subscription (span + DB `INSERT`
  span + metrics); returns `503` gracefully when no database is attached.
- **`src/app/api/error-test/route.ts`** — deliberately throws so you can verify
  error capture end-to-end.
- **`src/lib/account.ts`** — the tiny client-side "signed-in account" the nav reads.

## License

MIT
