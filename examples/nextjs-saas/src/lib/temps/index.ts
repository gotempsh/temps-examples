/**
 * Temps SDK integrations
 *
 * This file provides real implementations using the Temps SDK packages:
 * - @temps-sdk/node-sdk — Email sending and analytics (via TempsClient)
 * - @temps-sdk/blob — File/blob storage
 * - @temps-sdk/kv — Key-value store and rate limiting
 */

import { TempsClient } from '@temps-sdk/node-sdk'
import { kv as kvClient } from '@temps-sdk/kv'
import { blob as blobClient } from '@temps-sdk/blob'

// ============================================================================
// Utilities
// ============================================================================

/** Escape user-supplied strings before interpolating into HTML email templates. */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// ============================================================================
// Temps Client (Email + Analytics)
// ============================================================================

const temps = new TempsClient({
  baseUrl: process.env.TEMPS_API_URL || 'https://localhost',
  apiKey: process.env.TEMPS_API_KEY,
})

// ============================================================================
// Analytics
// ============================================================================

/**
 * Track a server-side event via the Temps analytics API.
 * Uses the event metrics endpoint to record custom events.
 */
export async function trackEvent(
  event: string,
  properties?: Record<string, unknown>
) {
  try {
    await temps.analytics.recordEvent({
      body: {
        event_name: event,
        event_data: properties ?? {},
        request_path: '/',
        request_query: '',
      },
    })
  } catch (error) {
    console.error('[Temps Analytics] Failed to track event:', error)
  }
}

export function trackPurchase(data: {
  productId: string
  amount: number
  currency: string
  type: 'subscription' | 'one_time'
}) {
  trackEvent('purchase', {
    product_id: data.productId,
    amount: data.amount,
    currency: data.currency,
    type: data.type,
  })
}

// ============================================================================
// Email (@temps-sdk/node-sdk)
// ============================================================================

interface EmailOptions {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  from?: string
  replyTo?: string
}

const DEFAULT_FROM =
  process.env.EMAIL_FROM || 'noreply@yoursaas.com'

export async function sendEmail(
  options: EmailOptions
): Promise<{ id: string }> {
  try {
    const { data } = await temps.email.send({
      body: {
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html ?? undefined,
        text: options.text ?? undefined,
        from: options.from || DEFAULT_FROM,
        reply_to: options.replyTo ?? undefined,
      },
    })

    return { id: data?.id ?? 'unknown' }
  } catch (error) {
    console.error('[Temps Email] Failed to send email:', error)
    return { id: 'error' }
  }
}

// Email templates
export const emailTemplates = {
  welcome: (name: string) => ({
    subject: 'Welcome to our platform!',
    html: `
      <h1>Welcome, ${escapeHtml(name)}!</h1>
      <p>Thank you for signing up. We're excited to have you on board.</p>
    `,
  }),

  purchaseConfirmation: (data: { productName: string; amount: string }) => ({
    subject: 'Purchase Confirmation',
    html: `
      <h1>Thank you for your purchase!</h1>
      <p>You've successfully purchased <strong>${escapeHtml(data.productName)}</strong> for ${escapeHtml(data.amount)}.</p>
    `,
  }),

  subscriptionStarted: (data: {
    planName: string
    nextBillingDate: string
  }) => ({
    subject: 'Subscription Activated',
    html: `
      <h1>Your subscription is active!</h1>
      <p>You're now subscribed to <strong>${escapeHtml(data.planName)}</strong>.</p>
      <p>Next billing date: ${escapeHtml(data.nextBillingDate)}</p>
    `,
  }),

  subscriptionCanceled: (data: { planName: string; endDate: string }) => ({
    subject: 'Subscription Canceled',
    html: `
      <h1>Subscription Canceled</h1>
      <p>Your ${escapeHtml(data.planName)} subscription has been canceled.</p>
      <p>You'll have access until: ${escapeHtml(data.endDate)}</p>
    `,
  }),
}

// ============================================================================
// Blob Storage (@temps-sdk/blob)
// ============================================================================

export type { BlobInfo, PutOptions, ListResult } from '@temps-sdk/blob'

export async function uploadBlob(
  pathname: string,
  data: string | ArrayBuffer | Uint8Array | Blob | ReadableStream<Uint8Array> | Buffer,
  options?: { contentType?: string; addRandomSuffix?: boolean }
) {
  return blobClient.put(pathname, data, options)
}

export async function deleteBlob(url: string | string[]) {
  return blobClient.del(url)
}

export async function getBlobUrl(url: string) {
  const info = await blobClient.head(url)
  return info.url
}

export async function listBlobs(options?: {
  prefix?: string
  limit?: number
  cursor?: string
}) {
  return blobClient.list(options)
}

// ============================================================================
// KV Store / Rate Limiting (@temps-sdk/kv)
// ============================================================================

export async function kvGet<T = unknown>(key: string): Promise<T | null> {
  return kvClient.get<T>(key)
}

export async function kvSet(
  key: string,
  value: unknown,
  options?: { ex?: number; px?: number; nx?: boolean; xx?: boolean }
): Promise<'OK' | null> {
  return kvClient.set(key, value, options)
}

export async function kvDelete(...keys: string[]): Promise<number> {
  return kvClient.del(...keys)
}

export async function kvIncr(key: string): Promise<number> {
  return kvClient.incr(key)
}

// Rate limiting helper using KV
interface RateLimitResult {
  success: boolean
  remaining: number
  reset: number
}

export async function rateLimit(
  identifier: string,
  options: { limit: number; window: number } = { limit: 10, window: 60 }
): Promise<RateLimitResult> {
  const key = `ratelimit:${identifier}`
  const now = Date.now()

  try {
    const count = await kvClient.incr(key)

    // Set expiry on first increment
    if (count === 1) {
      await kvClient.expire(key, options.window)
    }

    const ttl = await kvClient.ttl(key)
    const reset = now + ttl * 1000

    return {
      success: count <= options.limit,
      remaining: Math.max(0, options.limit - count),
      reset,
    }
  } catch (error) {
    console.error('[Temps KV] Rate limit error:', error)
    // Fail open — allow the request if KV is unavailable
    return {
      success: true,
      remaining: options.limit - 1,
      reset: now + options.window * 1000,
    }
  }
}
