/**
 * Temps SDK integrations
 *
 * This file provides placeholder implementations for Temps SDK packages.
 * Replace with actual SDK imports once packages are published:
 *
 * import { TempsClient } from '@temps-sdk/node'
 * import { blob } from '@temps-sdk/blob'
 * import { kv } from '@temps-sdk/kv'
 */

// ============================================================================
// Analytics (Temps built-in)
// ============================================================================

export function trackEvent(event: string, properties?: Record<string, unknown>) {
  // TODO: Replace with @temps-sdk/node implementation
  if (process.env.NODE_ENV === 'development') {
    console.log('[Temps Analytics]', event, properties)
  }
}

export function trackPageView(path: string, properties?: Record<string, unknown>) {
  trackEvent('page_view', { path, ...properties })
}

export function trackPurchase(data: {
  productId: string
  amount: number
  currency: string
  type: 'subscription' | 'one_time'
}) {
  trackEvent('purchase', data)
}

// ============================================================================
// Email (@temps-sdk/node)
// ============================================================================

interface EmailOptions {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  from?: string
  replyTo?: string
}

export async function sendEmail(options: EmailOptions): Promise<{ id: string }> {
  // TODO: Replace with @temps-sdk/node implementation
  // import { TempsClient } from '@temps-sdk/node'
  // const temps = new TempsClient({ apiKey: process.env.TEMPS_API_KEY })
  // return temps.emails.send(options)

  if (process.env.NODE_ENV === 'development') {
    console.log('[Temps Email]', options)
  }

  return { id: 'mock-email-id' }
}

// Email templates
export const emailTemplates = {
  welcome: (name: string) => ({
    subject: 'Welcome to our platform!',
    html: `
      <h1>Welcome, ${name}!</h1>
      <p>Thank you for signing up. We're excited to have you on board.</p>
    `,
  }),

  purchaseConfirmation: (data: { productName: string; amount: string }) => ({
    subject: 'Purchase Confirmation',
    html: `
      <h1>Thank you for your purchase!</h1>
      <p>You've successfully purchased <strong>${data.productName}</strong> for ${data.amount}.</p>
    `,
  }),

  subscriptionStarted: (data: { planName: string; nextBillingDate: string }) => ({
    subject: 'Subscription Activated',
    html: `
      <h1>Your subscription is active!</h1>
      <p>You're now subscribed to <strong>${data.planName}</strong>.</p>
      <p>Next billing date: ${data.nextBillingDate}</p>
    `,
  }),

  subscriptionCanceled: (data: { planName: string; endDate: string }) => ({
    subject: 'Subscription Canceled',
    html: `
      <h1>Subscription Canceled</h1>
      <p>Your ${data.planName} subscription has been canceled.</p>
      <p>You'll have access until: ${data.endDate}</p>
    `,
  }),
}

// ============================================================================
// Blob Storage (@temps-sdk/blob)
// ============================================================================

interface BlobUploadOptions {
  filename: string
  contentType?: string
  access?: 'public' | 'private'
}

interface BlobResult {
  url: string
  key: string
  size: number
}

export async function uploadBlob(
  data: Buffer | ReadableStream | Blob,
  options: BlobUploadOptions
): Promise<BlobResult> {
  // TODO: Replace with @temps-sdk/blob implementation
  // import { blob } from '@temps-sdk/blob'
  // return blob.upload(data, options)

  if (process.env.NODE_ENV === 'development') {
    console.log('[Temps Blob] Upload:', options.filename)
  }

  return {
    url: `https://blob.temps.sh/mock/${options.filename}`,
    key: `mock/${options.filename}`,
    size: 0,
  }
}

export async function deleteBlob(key: string): Promise<void> {
  // TODO: Replace with @temps-sdk/blob implementation
  if (process.env.NODE_ENV === 'development') {
    console.log('[Temps Blob] Delete:', key)
  }
}

export async function getBlobUrl(key: string): Promise<string> {
  // TODO: Replace with @temps-sdk/blob implementation
  return `https://blob.temps.sh/${key}`
}

// ============================================================================
// KV Store / Rate Limiting (@temps-sdk/kv)
// ============================================================================

export async function kvGet<T>(key: string): Promise<T | null> {
  // TODO: Replace with @temps-sdk/kv implementation
  // import { kv } from '@temps-sdk/kv'
  // return kv.get<T>(key)

  if (process.env.NODE_ENV === 'development') {
    console.log('[Temps KV] Get:', key)
  }

  return null
}

export async function kvSet<T>(
  key: string,
  value: T,
  options?: { ex?: number; px?: number }
): Promise<void> {
  // TODO: Replace with @temps-sdk/kv implementation
  if (process.env.NODE_ENV === 'development') {
    console.log('[Temps KV] Set:', key, value, options)
  }
}

export async function kvDelete(key: string): Promise<void> {
  // TODO: Replace with @temps-sdk/kv implementation
  if (process.env.NODE_ENV === 'development') {
    console.log('[Temps KV] Delete:', key)
  }
}

// Rate limiting helper
interface RateLimitResult {
  success: boolean
  remaining: number
  reset: number
}

export async function rateLimit(
  identifier: string,
  options: { limit: number; window: number } = { limit: 10, window: 60 }
): Promise<RateLimitResult> {
  // TODO: Replace with @temps-sdk/kv implementation
  // Uses sliding window rate limiting

  const key = `ratelimit:${identifier}`
  const now = Date.now()

  // Mock implementation - always allows in development
  if (process.env.NODE_ENV === 'development') {
    return {
      success: true,
      remaining: options.limit - 1,
      reset: now + options.window * 1000,
    }
  }

  // Production would use KV store:
  // const count = await kv.incr(key)
  // if (count === 1) await kv.expire(key, options.window)
  // return { success: count <= options.limit, remaining: Math.max(0, options.limit - count), reset: ... }

  return {
    success: true,
    remaining: options.limit - 1,
    reset: now + options.window * 1000,
  }
}
