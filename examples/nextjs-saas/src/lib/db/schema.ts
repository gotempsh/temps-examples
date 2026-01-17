import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  pgEnum,
} from 'drizzle-orm/pg-core'

// Enums
export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'active',
  'canceled',
  'past_due',
  'trialing',
  'paused',
])

export const productTypeEnum = pgEnum('product_type', [
  'subscription',
  'one_time',
])

// Users table (managed by better-auth, extended with billing)
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  // Stripe fields
  stripeCustomerId: text('stripe_customer_id').unique(),
})

// Sessions table (better-auth)
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
})

// Accounts table (better-auth OAuth)
export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// Verification tokens (better-auth)
export const verifications = pgTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Products (your digital products)
export const products = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  type: productTypeEnum('type').notNull(),
  // Stripe IDs
  stripeProductId: text('stripe_product_id').unique(),
  stripePriceId: text('stripe_price_id'),
  // Pricing
  price: integer('price').notNull(), // in cents
  currency: text('currency').notNull().default('usd'),
  // Subscription specific
  interval: text('interval'), // 'month' | 'year'
  intervalCount: integer('interval_count'),
  trialDays: integer('trial_days'),
  // Metadata
  features: text('features'), // JSON string of features
  isActive: boolean('is_active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// Subscriptions
export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  productId: text('product_id')
    .notNull()
    .references(() => products.id),
  // Stripe IDs
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  stripePriceId: text('stripe_price_id'),
  // Status
  status: subscriptionStatusEnum('status').notNull().default('active'),
  // Dates
  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').notNull().default(false),
  canceledAt: timestamp('canceled_at'),
  trialStart: timestamp('trial_start'),
  trialEnd: timestamp('trial_end'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// Purchases (one-time purchases)
export const purchases = pgTable('purchases', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  productId: text('product_id')
    .notNull()
    .references(() => products.id),
  // Stripe
  stripePaymentIntentId: text('stripe_payment_intent_id').unique(),
  stripeCheckoutSessionId: text('stripe_checkout_session_id'),
  // Amount
  amount: integer('amount').notNull(), // in cents
  currency: text('currency').notNull().default('usd'),
  // Status
  status: text('status').notNull().default('completed'), // 'completed' | 'refunded'
  refundedAt: timestamp('refunded_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// Type exports
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert
export type Subscription = typeof subscriptions.$inferSelect
export type Purchase = typeof purchases.$inferSelect
