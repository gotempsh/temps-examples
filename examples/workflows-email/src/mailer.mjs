// SPDX-FileCopyrightText: 2024-2026 Temps Contributors
// SPDX-License-Identifier: MIT OR Apache-2.0

// Sends email through the Temps email API (POST {TEMPS_API_URL}/emails).
//
// Temps injects TEMPS_API_URL and TEMPS_API_TOKEN (the deployment token) into
// every deployment, so a deployed app can send mail without its own SMTP
// credentials. A deployment-token send must carry an Idempotency-Key: Temps
// stores the key before it calls the provider, and a second request with the
// same key and payload returns the first delivery instead of sending again.
//
// That is what makes email safe inside a workflow step. A step body runs *at
// least once* (a crash after the send but before the step is recorded runs it
// again), so the key is derived from the run and the step: every retry of the
// same step reuses it, and the recipient gets one email.

/** A permanent failure: retrying the same request cannot succeed. */
export class EmailRejectedError extends Error {
  constructor(status, detail, idempotencyKey) {
    super(`Temps rejected email ${idempotencyKey} with HTTP ${status}: ${detail}`);
    this.name = 'EmailRejectedError';
    this.status = status;
    this.idempotencyKey = idempotencyKey;
  }
}

/** Temps' rule for Idempotency-Key: 1-128 of letters, digits, '-', '_', ':', '.'. */
export function idempotencyKeyFor(runId, stepName) {
  const key = `wf:${runId}:${stepName}`.replace(/[^A-Za-z0-9_:.-]/g, '.');
  if (key.length > 128) throw new Error(`Idempotency key for step '${stepName}' is longer than 128 characters`);
  return key;
}

/**
 * Create a mailer bound to a Temps instance.
 *
 * @param {object} [options]
 * @param {string} [options.apiUrl]  Temps API root; default TEMPS_API_URL.
 * @param {string} [options.token]   Deployment token; default TEMPS_API_TOKEN.
 * @param {string} [options.from]    Sender address; default EMAIL_FROM.
 * @param {string} [options.fromName] Sender display name; default EMAIL_FROM_NAME.
 * @param {typeof fetch} [options.fetch]
 */
export function createTempsMailer(options = {}) {
  const apiUrl = (options.apiUrl ?? process.env.TEMPS_API_URL ?? '').replace(/\/+$/, '');
  const token = options.token ?? process.env.TEMPS_API_TOKEN;
  const from = options.from ?? process.env.EMAIL_FROM;
  const fromName = options.fromName ?? process.env.EMAIL_FROM_NAME ?? 'Workflows Email Example';
  const fetchImpl = options.fetch ?? fetch;

  const missing = [
    !apiUrl && 'TEMPS_API_URL',
    !token && 'TEMPS_API_TOKEN',
    !from && 'EMAIL_FROM',
  ].filter(Boolean);

  return {
    /**
     * @param {{ to: string, subject: string, html: string, text: string, tags?: string[] }} message
     * @param {string} idempotencyKey
     * @returns {Promise<{ id: string, status: string }>}
     */
    async send(message, idempotencyKey) {
      if (missing.length > 0) {
        // Thrown inside a step, this is recorded on the run, so the console
        // shows exactly what to configure.
        throw new EmailRejectedError(0, `missing configuration: ${missing.join(', ')}`, idempotencyKey);
      }
      const response = await fetchImpl(`${apiUrl}/emails`, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
          'idempotency-key': idempotencyKey,
        },
        body: JSON.stringify({
          from,
          from_name: fromName,
          to: [message.to],
          subject: message.subject,
          html: message.html,
          text: message.text,
          tags: message.tags,
        }),
        signal: AbortSignal.timeout(30_000),
      });
      if (response.ok) {
        const body = await response.json();
        return { id: body.id, status: body.status };
      }
      const detail = await problemDetail(response);
      // 408/429/5xx are transient: throw a plain error and let the step retry
      // with backoff. Anything else (bad sender domain, missing permission,
      // key reused with a different payload) fails the same way every time.
      if (response.status === 408 || response.status === 429 || response.status >= 500) {
        throw new Error(`Temps email API answered HTTP ${response.status} for ${idempotencyKey}: ${detail}`);
      }
      throw new EmailRejectedError(response.status, detail, idempotencyKey);
    },
  };
}

async function problemDetail(response) {
  try {
    const problem = await response.json();
    return problem.detail ?? problem.title ?? JSON.stringify(problem);
  } catch {
    return response.statusText || 'no response body';
  }
}
