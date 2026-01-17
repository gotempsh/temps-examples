import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db, users, subscriptions, purchases, products } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { sendEmail, emailTemplates, trackPurchase } from '@/lib/temps'
import { formatPrice } from '@/lib/stripe'
import type Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpsert(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  if (!userId) return

  if (session.mode === 'payment') {
    // One-time purchase
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
    const priceId = lineItems.data[0]?.price?.id

    if (priceId) {
      // Find product by stripe price ID
      const product = await db.query.products.findFirst({
        where: eq(products.stripePriceId, priceId),
      })

      if (product) {
        // Create purchase record
        await db.insert(purchases).values({
          id: crypto.randomUUID(),
          userId,
          productId: product.id,
          stripePaymentIntentId: session.payment_intent as string,
          stripeCheckoutSessionId: session.id,
          amount: session.amount_total || 0,
          currency: session.currency || 'usd',
          status: 'completed',
        })

        // Track analytics
        trackPurchase({
          productId: product.id,
          amount: session.amount_total || 0,
          currency: session.currency || 'usd',
          type: 'one_time',
        })

        // Send confirmation email
        const user = await db.query.users.findFirst({
          where: eq(users.id, userId),
        })

        if (user) {
          const template = emailTemplates.purchaseConfirmation({
            productName: product.name,
            amount: formatPrice(session.amount_total || 0, session.currency || 'usd'),
          })

          await sendEmail({
            to: user.email,
            ...template,
          })
        }
      }
    }
  }
  // Subscription checkout is handled by customer.subscription.created
}

async function handleSubscriptionUpsert(stripeSubscription: Stripe.Subscription) {
  const userId = stripeSubscription.metadata?.userId
  if (!userId) return

  const priceId = stripeSubscription.items.data[0]?.price?.id
  if (!priceId) return

  // Find product by stripe price ID
  const product = await db.query.products.findFirst({
    where: eq(products.stripePriceId, priceId),
  })

  if (!product) return

  // Check if subscription exists
  const existingSubscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.stripeSubscriptionId, stripeSubscription.id),
  })

  // Get period dates from the subscription object (handle both old and new API versions)
  const subData = stripeSubscription as unknown as Record<string, unknown>
  const currentPeriodStart = (subData.current_period_start ?? subData.currentPeriodStart) as number | undefined
  const currentPeriodEnd = (subData.current_period_end ?? subData.currentPeriodEnd) as number | undefined
  const cancelAtPeriodEnd = (subData.cancel_at_period_end ?? subData.cancelAtPeriodEnd) as boolean
  const canceledAt = (subData.canceled_at ?? subData.canceledAt) as number | null
  const trialStart = (subData.trial_start ?? subData.trialStart) as number | null
  const trialEnd = (subData.trial_end ?? subData.trialEnd) as number | null

  const subscriptionData = {
    userId,
    productId: product.id,
    stripeSubscriptionId: stripeSubscription.id,
    stripePriceId: priceId,
    status: mapStripeStatus(stripeSubscription.status),
    currentPeriodStart: currentPeriodStart ? new Date(currentPeriodStart * 1000) : null,
    currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : null,
    cancelAtPeriodEnd: cancelAtPeriodEnd ?? false,
    canceledAt: canceledAt ? new Date(canceledAt * 1000) : null,
    trialStart: trialStart ? new Date(trialStart * 1000) : null,
    trialEnd: trialEnd ? new Date(trialEnd * 1000) : null,
    updatedAt: new Date(),
  }

  if (existingSubscription) {
    await db
      .update(subscriptions)
      .set(subscriptionData)
      .where(eq(subscriptions.id, existingSubscription.id))
  } else {
    await db.insert(subscriptions).values({
      id: crypto.randomUUID(),
      ...subscriptionData,
      createdAt: new Date(),
    })

    // Track analytics for new subscription
    trackPurchase({
      productId: product.id,
      amount: stripeSubscription.items.data[0]?.price?.unit_amount || 0,
      currency: stripeSubscription.currency,
      type: 'subscription',
    })

    // Send welcome email for new subscription
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })

    if (user && currentPeriodEnd) {
      const template = emailTemplates.subscriptionStarted({
        planName: product.name,
        nextBillingDate: new Date(currentPeriodEnd * 1000).toLocaleDateString(),
      })

      await sendEmail({
        to: user.email,
        ...template,
      })
    }
  }
}

async function handleSubscriptionDeleted(stripeSubscription: Stripe.Subscription) {
  const existing = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.stripeSubscriptionId, stripeSubscription.id),
  })

  if (existing) {
    await db
      .update(subscriptions)
      .set({
        status: 'canceled',
        canceledAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, existing.id))

    // Send cancellation email
    const user = await db.query.users.findFirst({
      where: eq(users.id, existing.userId),
    })

    const product = await db.query.products.findFirst({
      where: eq(products.id, existing.productId),
    })

    const subData = stripeSubscription as unknown as Record<string, unknown>
    const currentPeriodEnd = (subData.current_period_end ?? subData.currentPeriodEnd) as number | undefined

    if (user && product && currentPeriodEnd) {
      const template = emailTemplates.subscriptionCanceled({
        planName: product.name,
        endDate: new Date(currentPeriodEnd * 1000).toLocaleDateString(),
      })

      await sendEmail({
        to: user.email,
        ...template,
      })
    }
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  // Update subscription status if needed
  const invoiceData = invoice as unknown as Record<string, unknown>
  const subscriptionId = invoiceData.subscription as string | null

  if (subscriptionId) {
    const existing = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.stripeSubscriptionId, subscriptionId),
    })

    if (existing && existing.status === 'past_due') {
      await db
        .update(subscriptions)
        .set({
          status: 'active',
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.id, existing.id))
    }
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const invoiceData = invoice as unknown as Record<string, unknown>
  const subscriptionId = invoiceData.subscription as string | null

  if (subscriptionId) {
    const existing = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.stripeSubscriptionId, subscriptionId),
    })

    if (existing) {
      await db
        .update(subscriptions)
        .set({
          status: 'past_due',
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.id, existing.id))
    }
  }
}

function mapStripeStatus(
  status: Stripe.Subscription.Status
): 'active' | 'canceled' | 'past_due' | 'trialing' | 'paused' {
  switch (status) {
    case 'active':
      return 'active'
    case 'canceled':
    case 'unpaid':
    case 'incomplete_expired':
      return 'canceled'
    case 'past_due':
    case 'incomplete':
      return 'past_due'
    case 'trialing':
      return 'trialing'
    case 'paused':
      return 'paused'
    default:
      return 'active'
  }
}
