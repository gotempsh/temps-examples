# Next.js SaaS Boilerplate

A production-ready Next.js boilerplate for building SaaS applications with subscriptions and one-time purchases.

## Features

- **Authentication** - Email/password and OAuth (GitHub, Google) with [better-auth](https://better-auth.com)
- **Payments** - Subscriptions and one-time purchases with [Stripe](https://stripe.com)
- **Database** - PostgreSQL with [Drizzle ORM](https://orm.drizzle.team)
- **Email** - Transactional emails with Temps SDK
- **Storage** - File uploads with Temps Blob
- **Rate Limiting** - API protection with Temps KV
- **Analytics** - Event tracking with Temps Analytics
- **Error Tracking** - [Sentry](https://sentry.io) integration
- **UI Components** - [shadcn/ui](https://ui.shadcn.com) with Tailwind CSS

## Quick Start

### 1. Clone and Install

```bash
git clone <repo-url>
cd nextjs-saas
bun install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Fill in your environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Random 32+ character string
- `STRIPE_SECRET_KEY` - From Stripe Dashboard
- `STRIPE_WEBHOOK_SECRET` - From Stripe CLI or Dashboard

### 3. Set Up Database

```bash
# Push schema to database
bun run db:push

# Or generate and run migrations
bun run db:generate
bun run db:migrate
```

### 4. Set Up Stripe Products

Create products in your Stripe Dashboard and add them to your database:

```sql
INSERT INTO products (id, name, description, type, stripe_product_id, stripe_price_id, price, currency, interval, features, is_active, sort_order)
VALUES
  ('prod_starter', 'Starter', 'For individuals', 'subscription', 'prod_xxx', 'price_xxx', 900, 'usd', 'month', '["Feature 1", "Feature 2"]', true, 1),
  ('prod_pro', 'Pro', 'For teams', 'subscription', 'prod_yyy', 'price_yyy', 2900, 'usd', 'month', '["Everything in Starter", "Feature 3", "Feature 4"]', true, 2);
```

### 5. Run Development Server

```bash
# Terminal 1: Start the app
bun run dev

# Terminal 2: Forward Stripe webhooks (requires Stripe CLI)
bun run stripe:listen
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Login, register pages
│   ├── (dashboard)/      # Protected dashboard pages
│   ├── api/
│   │   ├── auth/         # better-auth handlers
│   │   ├── checkout/     # Stripe checkout
│   │   ├── billing/      # Customer portal
│   │   └── webhooks/     # Stripe webhooks
│   └── pricing/          # Public pricing page
├── components/
│   └── ui/               # shadcn components
└── lib/
    ├── auth.ts           # better-auth config
    ├── db/               # Drizzle schema & client
    ├── stripe.ts         # Stripe client
    ├── stripe-helpers.ts # Checkout & portal helpers
    └── temps/            # Temps SDK integrations
```

## Key Files

| File | Description |
|------|-------------|
| `src/lib/db/schema.ts` | Database schema (users, products, subscriptions, purchases) |
| `src/lib/auth.ts` | Authentication configuration |
| `src/lib/stripe-helpers.ts` | Stripe checkout and customer portal |
| `src/app/api/webhooks/stripe/route.ts` | Stripe webhook handlers |
| `src/lib/temps/index.ts` | Temps SDK utilities (email, storage, rate limiting) |

## Stripe Webhook Events

The webhook handler (`/api/webhooks/stripe`) processes:

- `checkout.session.completed` - Create purchase records
- `customer.subscription.created` - New subscription
- `customer.subscription.updated` - Subscription changes
- `customer.subscription.deleted` - Cancellation
- `invoice.payment_succeeded` - Payment success
- `invoice.payment_failed` - Payment failure

## Authentication

better-auth provides:

- Email/password authentication
- OAuth providers (GitHub, Google)
- Session management
- Password reset (configure email first)

### Adding OAuth Providers

1. Create OAuth app in GitHub/Google
2. Add client ID and secret to `.env.local`
3. Update `src/lib/auth.ts` if needed

## Database Commands

```bash
bun run db:generate  # Generate migrations
bun run db:migrate   # Run migrations
bun run db:push      # Push schema (dev only)
bun run db:studio    # Open Drizzle Studio
```

## Customization

### Adding Products

1. Create product in Stripe Dashboard
2. Insert into `products` table with Stripe IDs
3. Products appear automatically on pricing page

### Styling

- Edit `src/app/globals.css` for theme colors
- Components use Tailwind CSS
- Add shadcn components: `bunx shadcn@latest add [component]`

### Email Templates

Edit templates in `src/lib/temps/index.ts`:

- `welcome` - New user signup
- `purchaseConfirmation` - One-time purchase
- `subscriptionStarted` - New subscription
- `subscriptionCanceled` - Cancellation

## Deployment

### Vercel

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

### Stripe Webhook

In production, create a webhook endpoint in Stripe Dashboard:

- URL: `https://your-domain.com/api/webhooks/stripe`
- Events: `checkout.session.completed`, `customer.subscription.*`, `invoice.payment_*`

## Temps SDK Integration

Once Temps SDK packages are published, update `src/lib/temps/index.ts`:

```typescript
import { TempsClient } from '@temps-sdk/node'
import { blob } from '@temps-sdk/blob'
import { kv } from '@temps-sdk/kv'

const temps = new TempsClient({ apiKey: process.env.TEMPS_API_KEY })
```

## License

MIT
