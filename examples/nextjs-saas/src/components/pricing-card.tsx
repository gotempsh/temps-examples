'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import { formatPrice, formatInterval } from '@/lib/stripe'
import { toast } from 'sonner'

interface PricingCardProps {
  product: {
    id: string
    name: string
    description: string | null
    type: 'subscription' | 'one_time'
    price: number
    currency: string
    interval: string | null
    intervalCount: number | null
    features: string | null
  }
  isPopular?: boolean
  isAuthenticated: boolean
}

export function PricingCard({
  product,
  isPopular,
  isAuthenticated,
}: PricingCardProps) {
  const [loading, setLoading] = useState(false)

  const features = product.features ? JSON.parse(product.features) : []

  async function handleCheckout() {
    if (!isAuthenticated) {
      window.location.href = '/login?redirect=/pricing'
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      })

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error('Unable to start checkout. Please try again.')
      }
    } catch {
      toast.error('Something went wrong. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className={isPopular ? 'border-primary shadow-lg' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{product.name}</CardTitle>
          {isPopular && <Badge>Popular</Badge>}
        </div>
        {product.description && (
          <CardDescription>{product.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <span className="text-4xl font-bold">
            {formatPrice(product.price, product.currency)}
          </span>
          {product.type === 'subscription' && product.interval && (
            <span className="text-muted-foreground ml-2">
              /{formatInterval(product.interval, product.intervalCount || 1)}
            </span>
          )}
          {product.type === 'one_time' && (
            <span className="text-muted-foreground ml-2">one-time</span>
          )}
        </div>

        {features.length > 0 && (
          <ul className="space-y-2">
            {features.map((feature: string, index: number) => (
              <li key={index} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleCheckout}
          disabled={loading}
          variant={isPopular ? 'default' : 'outline'}
        >
          {loading ? 'Loading...' : 'Get Started'}
        </Button>
      </CardFooter>
    </Card>
  )
}
