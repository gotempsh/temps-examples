import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { createCustomerPortalSession } from '@/lib/stripe-helpers'
import { rateLimit } from '@/lib/temps'

export async function POST() {
  try {
    const headersList = await headers()

    // Rate limiting
    const ip = headersList.get('x-forwarded-for') ?? 'anonymous'
    const { success } = await rateLimit(`portal:${ip}`, {
      limit: 10,
      window: 60,
    })

    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    const session = await auth.api.getSession({
      headers: headersList,
    })

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL!
    const returnUrl = `${baseUrl}/billing`

    const portalSession = await createCustomerPortalSession(
      session.user.id,
      returnUrl
    )

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    console.error('Billing portal error:', error)
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    )
  }
}
