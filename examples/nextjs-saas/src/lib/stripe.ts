import Stripe from 'stripe'

// Initialize Stripe only if the secret key is available
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-12-15.clover',
  typescript: true,
})

// Price formatting utility
export function formatPrice(
  price: number,
  currency: string = 'usd',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(price / 100)
}

// Get billing interval display text
export function formatInterval(interval: string, count: number = 1): string {
  if (count === 1) {
    return interval === 'month' ? 'monthly' : 'yearly'
  }
  return `every ${count} ${interval}s`
}
