import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db, products } from '@/lib/db'
import { eq } from 'drizzle-orm'
import {
  createSubscriptionCheckout,
  createPurchaseCheckout,
} from '@/lib/stripe-helpers'
import { rateLimit } from '@/lib/temps'

export async function POST(req: Request) {
  try {
    // Rate limiting
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') ?? 'anonymous'
    const { success } = await rateLimit(`checkout:${ip}`, { limit: 10, window: 60 })

    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    // Auth check
    const session = await auth.api.getSession({
      headers: headersList,
    })

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { productId } = await req.json()

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Get product
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
    })

    if (!product || !product.stripePriceId) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL!
    const successUrl = `${baseUrl}/billing?success=true`
    const cancelUrl = `${baseUrl}/pricing?canceled=true`

    let checkoutSession

    if (product.type === 'subscription') {
      checkoutSession = await createSubscriptionCheckout(
        session.user.id,
        product.stripePriceId,
        successUrl,
        cancelUrl
      )
    } else {
      checkoutSession = await createPurchaseCheckout(
        session.user.id,
        product.stripePriceId,
        successUrl,
        cancelUrl
      )
    }

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
