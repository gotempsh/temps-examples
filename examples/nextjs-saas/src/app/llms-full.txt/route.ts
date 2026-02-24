export function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const content = `# YourSaaS — Full Technical Documentation

> A production-ready Next.js SaaS boilerplate with authentication, payments, database, email, and everything you need to launch your SaaS.

## Architecture

YourSaaS follows the Next.js 16 App Router architecture with server components by default. Interactive components are explicitly marked with 'use client'. The project uses a route group pattern: (auth) for login/register and (dashboard) for protected pages.

### Route Protection

Two layers of authentication protect dashboard routes:
1. **Middleware** — Fast cookie-based redirect checking for \`better-auth.session_token\`
2. **Server layout** — Full server-side session validation via \`auth.api.getSession()\`

## Pages

### Public Pages

#### Home (\`/\`)
Landing page with four sections:
- Hero with gradient background, headline, CTA buttons, and social proof badges
- Features grid (6 cards: Authentication, Payments, Database, Email, Analytics, Error Monitoring)
- Benefits section with stat cards (10x Faster, $0 Upfront, 100% Customizable, 24/7 Support)
- CTA section with gradient border card

#### Pricing (\`/pricing\`)
Server component that fetches active products from PostgreSQL via Drizzle ORM. Renders PricingCard components with Stripe checkout integration. Supports both subscription and one-time purchase products.

#### Sign In (\`/login\`)
Email/password login with OAuth options (GitHub, Google). Redirects to dashboard if already authenticated.

#### Create Account (\`/register\`)
Registration form with name, email, password. OAuth signup available. Redirects to dashboard after successful registration.

### Protected Pages

#### Dashboard (\`/dashboard\`)
Shows subscription status (active plan or "Free"), purchase count, and quick action links. Server component with direct database queries.

#### Billing (\`/billing\`)
Client component with Stripe Customer Portal integration. "Manage Billing" button creates a portal session via \`POST /api/billing/portal\`.

#### Settings (\`/settings\`)
User profile display with avatar (initials fallback), name, and email. Read-only currently.

## Authentication

Uses better-auth v1.4 with Drizzle adapter for PostgreSQL.

### Providers
- Email/password (enabled, email verification configurable)
- GitHub OAuth (conditional — only when GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET are set)
- Google OAuth (conditional — only when GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set)

### Session
- 7-day expiration
- 1-day update age
- 5-minute cookie cache
- Custom user field: \`stripeCustomerId\`

## Database

PostgreSQL via Drizzle ORM with 6 tables:

### Tables
- **users** — id, name, email (unique), emailVerified, image, stripeCustomerId (unique), timestamps
- **sessions** — better-auth session management, FK to users (cascade delete)
- **accounts** — OAuth account linking (GitHub, Google), FK to users (cascade delete)
- **verifications** — email verification tokens
- **products** — name, description, type (subscription/one_time), Stripe IDs, price (cents), currency, interval, features (JSON), isActive, sortOrder
- **subscriptions** — userId, productId, Stripe IDs, status (active/canceled/past_due/trialing/paused), period dates, cancellation tracking
- **purchases** — userId, productId, Stripe payment intent/checkout session IDs, amount (cents), currency, status (completed/refunded)

## Payments (Stripe)

### Checkout Flow
1. User clicks pricing card
2. \`POST /api/checkout\` with productId (rate limited: 10 req/60s per IP)
3. Server creates Stripe Checkout Session (subscription or payment mode)
4. User redirected to Stripe Checkout
5. Stripe webhook processes completion

### Webhook Events Handled
- \`checkout.session.completed\` — Creates purchase record for one-time payments, sends confirmation email
- \`customer.subscription.created\` — Creates subscription record, sends welcome email
- \`customer.subscription.updated\` — Updates subscription status/dates
- \`customer.subscription.deleted\` — Marks subscription canceled, sends cancellation email
- \`invoice.payment_succeeded\` — Reactivates past_due subscriptions
- \`invoice.payment_failed\` — Marks subscription as past_due

### Customer Portal
\`POST /api/billing/portal\` creates a Stripe Billing Portal session for self-service billing management.

## Temps SDK Integrations

### Email
Transactional email via \`@temps-sdk/node-sdk\`. Pre-built templates:
- Welcome email
- Purchase confirmation
- Subscription started
- Subscription canceled

### Blob Storage
File storage via \`@temps-sdk/blob\`: upload (put), delete (del), metadata (head), list with pagination.

### KV Store
Key-value storage via \`@temps-sdk/kv\`: get, set (with TTL), delete, increment. Used for rate limiting with sliding window pattern.

### Analytics
Server-side event tracking via \`@temps-sdk/node-sdk\`: purchase events, custom events.

## Error Tracking

Sentry integration on three runtimes:
- **Client** — Session replay (100% on error, 10% session), 10% error sampling in production
- **Server** — 10% error/trace sampling
- **Edge** — Same as server config
- **Global error boundary** — Captures unhandled errors with Sentry and shows retry UI

## API Endpoints

- \`POST /api/auth/[...all]\` — better-auth catch-all handler
- \`POST /api/checkout\` — Stripe checkout session creation (authenticated, rate limited)
- \`POST /api/billing/portal\` — Stripe customer portal session (authenticated)
- \`POST /api/webhooks/stripe\` — Stripe webhook handler with signature verification
- \`GET /og\` — Dynamic Open Graph image generation (supports ?title and ?description query params)
- \`GET /sitemap.xml\` — Dynamic sitemap
- \`GET /robots.txt\` — Robots directives
- \`GET /llms.txt\` — LLM-readable site summary
- \`GET /llms-full.txt\` — Detailed technical documentation (this file)

## UI Components

14 shadcn/ui components (new-york style): avatar, badge, button, card, dialog, dropdown-menu, form, input, label, separator, sheet, sonner, table, tabs.

Custom components: Header (sticky nav), UserNav (auth-aware dropdown), AuthForm (login/register), PricingCard (Stripe checkout).

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| NEXT_PUBLIC_APP_URL | Yes | Base application URL |
| DATABASE_URL | Yes | PostgreSQL connection string |
| BETTER_AUTH_SECRET | Yes | Auth secret (min 32 chars) |
| STRIPE_SECRET_KEY | Yes | Stripe server-side key |
| STRIPE_WEBHOOK_SECRET | Yes | Stripe webhook signature verification |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | Yes | Stripe client-side key |
| TEMPS_API_URL | Yes | Temps platform URL |
| TEMPS_API_KEY | Yes | Temps API key |
| TEMPS_TOKEN | Yes | Temps deployment token (for KV/Blob) |
| TEMPS_PROJECT_ID | Yes | Temps project ID |
| EMAIL_FROM | No | Default sender email address |
| GITHUB_CLIENT_ID | No | GitHub OAuth client ID |
| GITHUB_CLIENT_SECRET | No | GitHub OAuth client secret |
| GOOGLE_CLIENT_ID | No | Google OAuth client ID |
| GOOGLE_CLIENT_SECRET | No | Google OAuth client secret |
| SENTRY_DSN | No | Sentry server-side DSN |
| NEXT_PUBLIC_SENTRY_DSN | No | Sentry client-side DSN |
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
