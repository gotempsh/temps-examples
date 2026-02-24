import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getUserSubscription, getUserPurchases } from '@/lib/stripe-helpers'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default async function DashboardPage() {
  const headersList = await headers()
  const session = await auth.api.getSession({
    headers: headersList,
  })

  const user = session!.user
  const subscription = await getUserSubscription(user.id)
  const purchases = await getUserPurchases(user.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.name}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Subscription Status</CardTitle>
            <CardDescription>Your current plan</CardDescription>
          </CardHeader>
          <CardContent>
            {subscription ? (
              <div>
                <p className="text-2xl font-bold capitalize">
                  {subscription.status}
                </p>
                {subscription.currentPeriodEnd && (
                  <p className="text-sm text-muted-foreground">
                    Renews on{' '}
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <p className="text-2xl font-bold">Free</p>
                <p className="text-sm text-muted-foreground">
                  <Link href="/pricing" className="text-primary hover:underline">
                    Upgrade to Pro
                  </Link>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Purchases</CardTitle>
            <CardDescription>One-time purchases</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{purchases.length}</p>
            <p className="text-sm text-muted-foreground">
              Products purchased
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/billing"
              className="block text-sm text-primary hover:underline"
            >
              Manage billing &rarr;
            </Link>
            <Link
              href="/settings"
              className="block text-sm text-primary hover:underline"
            >
              Account settings &rarr;
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
