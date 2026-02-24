'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { toast } from 'sonner'

export default function BillingPage() {
  const [loading, setLoading] = useState(false)

  async function handleManageBilling() {
    setLoading(true)
    try {
      const res = await fetch('/api/billing/portal', {
        method: 'POST',
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error('Unable to open billing portal. Please try again.')
      }
    } catch {
      toast.error('Something went wrong. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing details
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Management</CardTitle>
          <CardDescription>
            Update your payment method, view invoices, or cancel your subscription
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleManageBilling} disabled={loading}>
            {loading ? 'Loading...' : 'Manage Billing'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Need a different plan?</CardTitle>
          <CardDescription>
            Check out our pricing page for available options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" asChild>
            <Link href="/pricing">View Pricing</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
