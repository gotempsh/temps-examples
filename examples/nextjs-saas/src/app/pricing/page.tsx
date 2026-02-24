import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db, products } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { PricingCard } from '@/components/pricing-card'
import { Header } from '@/components/header'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Simple, transparent pricing. Choose the plan that works best for you. All plans include a 14-day free trial.',
  openGraph: {
    title: 'Pricing | YourSaaS',
    description:
      'Simple, transparent pricing. Choose the plan that works best for you.',
    images: [
      {
        url: '/og?title=Simple%2C%20transparent%20pricing&description=Choose%20the%20plan%20that%20works%20best%20for%20you.%20All%20plans%20include%20a%2014-day%20free%20trial.',
        width: 1200,
        height: 630,
      },
    ],
  },
}

export default async function PricingPage() {
  const headersList = await headers()
  const session = await auth.api.getSession({
    headers: headersList,
  })

  const allProducts = await db.query.products.findMany({
    where: eq(products.isActive, true),
    orderBy: (products, { asc }) => [asc(products.sortOrder)],
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="container py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that works best for you. All plans include a 14-day
              free trial.
            </p>
          </div>

          {allProducts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {allProducts.map((product, index) => (
                <PricingCard
                  key={product.id}
                  product={product}
                  isPopular={index === 1}
                  isAuthenticated={!!session?.user}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No products configured yet. Add products in your database to display pricing.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
