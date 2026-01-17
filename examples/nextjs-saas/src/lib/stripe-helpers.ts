import { db, users, subscriptions, purchases } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { eq } from 'drizzle-orm'

// Get or create Stripe customer for a user
export async function getOrCreateStripeCustomer(userId: string): Promise<string> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  })

  if (!user) {
    throw new Error('User not found')
  }

  if (user.stripeCustomerId) {
    return user.stripeCustomerId
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name,
    metadata: {
      userId: user.id,
    },
  })

  // Save customer ID to user
  await db
    .update(users)
    .set({ stripeCustomerId: customer.id })
    .where(eq(users.id, userId))

  return customer.id
}

// Create checkout session for subscription
export async function createSubscriptionCheckout(
  userId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  const customerId = await getOrCreateStripeCustomer(userId)

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    subscription_data: {
      metadata: {
        userId,
      },
    },
    metadata: {
      userId,
    },
  })

  return session
}

// Create checkout session for one-time purchase
export async function createPurchaseCheckout(
  userId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  const customerId = await getOrCreateStripeCustomer(userId)

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
    },
  })

  return session
}

// Create customer portal session
export async function createCustomerPortalSession(
  userId: string,
  returnUrl: string
) {
  const customerId = await getOrCreateStripeCustomer(userId)

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session
}

// Get user's active subscription
export async function getUserSubscription(userId: string) {
  return db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, userId),
    with: {
      // product: true, // Uncomment when relations are set up
    },
  })
}

// Get user's purchases
export async function getUserPurchases(userId: string) {
  return db.query.purchases.findMany({
    where: eq(purchases.userId, userId),
  })
}

// Check if user has access to a product
export async function hasProductAccess(
  userId: string,
  productId: string
): Promise<boolean> {
  // Check subscription
  const subscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, userId),
  })

  if (
    subscription &&
    subscription.productId === productId &&
    subscription.status === 'active'
  ) {
    return true
  }

  // Check one-time purchase
  const purchase = await db.query.purchases.findFirst({
    where: eq(purchases.userId, userId),
  })

  if (purchase && purchase.productId === productId) {
    return true
  }

  return false
}
