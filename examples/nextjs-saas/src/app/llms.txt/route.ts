export function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const content = `# YourSaaS

> A production-ready Next.js SaaS boilerplate with authentication, payments, database, email, and everything you need to launch your SaaS.

## About

YourSaaS is a full-featured SaaS starter kit built with Next.js 16, React 19, and the Temps platform. It provides authentication, Stripe billing (subscriptions and one-time purchases), a PostgreSQL database, transactional email, blob storage, KV store, analytics, and error tracking out of the box.

## Pages

- [Home](${baseUrl}/): Landing page with feature overview, benefits, and call-to-action
- [Pricing](${baseUrl}/pricing): Dynamic pricing page with subscription and one-time purchase options
- [Sign In](${baseUrl}/login): Email/password and OAuth login (GitHub, Google)
- [Create Account](${baseUrl}/register): User registration with email/password or OAuth
- [Dashboard](${baseUrl}/dashboard): Protected dashboard with subscription status and purchase overview
- [Billing](${baseUrl}/billing): Stripe customer portal integration for billing management
- [Settings](${baseUrl}/settings): User profile and account settings

## Tech Stack

- **Framework**: Next.js 16 (App Router, React Compiler, Turbopack)
- **Authentication**: better-auth (email/password, GitHub OAuth, Google OAuth)
- **Payments**: Stripe (subscriptions, one-time purchases, customer portal, webhooks)
- **Database**: PostgreSQL with Drizzle ORM
- **Email**: Temps SDK transactional email
- **Storage**: Temps SDK blob storage
- **KV Store**: Temps SDK key-value store with rate limiting
- **Analytics**: Temps SDK event tracking
- **Error Tracking**: Sentry (client, server, edge)
- **UI**: shadcn/ui + Tailwind CSS v4 + Radix UI
- **Validation**: Zod v4 + React Hook Form

## API Endpoints

- \`POST /api/auth/[...all]\` — Authentication (login, register, session, OAuth callbacks)
- \`POST /api/checkout\` — Create Stripe checkout session (rate limited)
- \`POST /api/billing/portal\` — Create Stripe customer portal session
- \`POST /api/webhooks/stripe\` — Stripe webhook handler (checkout, subscription lifecycle, invoices)

## Optional

- [llms-full.txt](${baseUrl}/llms-full.txt): Detailed technical documentation
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
