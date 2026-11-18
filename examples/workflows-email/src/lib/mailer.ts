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

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
  tags?: string[];
}

export interface SentEmail {
  id: string;
  /** `sent` when delivered to the provider, `captured` when the sender domain is not verified yet. */
  status: string;
}

export interface Mailer {
  send(message: EmailMessage, idempotencyKey: string): Promise<SentEmail>;
}

/** A permanent failure: retrying the same request cannot succeed. */
export class EmailRejectedError extends Error {
  readonly status: number;
  readonly idempotencyKey: string;

  constructor(status: number, detail: string, idempotencyKey: string) {
    super(`Temps rejected email ${idempotencyKey} with HTTP ${status}: ${detail}`);
    this.name = 'EmailRejectedError';
    this.status = status;
    this.idempotencyKey = idempotencyKey;
  }
}

/** Temps' rule for Idempotency-Key: 1-128 of letters, digits, '-', '_', ':', '.'. */
export function idempotencyKeyFor(runId: string, stepName: string): string {
  const key = `wf:${runId}:${stepName}`.replace(/[^A-Za-z0-9_:.-]/g, '.');
  if (key.length > 128) throw new Error(`Idempotency key for step '${stepName}' is longer than 128 characters`);
  return key;
}

export interface TempsMailerOptions {
  /** Temps API root; default TEMPS_API_URL. */
  apiUrl?: string;
  /** Deployment token; default TEMPS_API_TOKEN. */
  token?: string;
  /** Sender address; default EMAIL_FROM. */
  from?: string;
  /** Sender display name; default EMAIL_FROM_NAME. */
  fromName?: string;
  fetch?: typeof fetch;
}

export function createTempsMailer(options: TempsMailerOptions = {}): Mailer {
  const apiUrl = (options.apiUrl ?? process.env.TEMPS_API_URL ?? '').replace(/\/+$/, '');
  const token = options.token ?? process.env.TEMPS_API_TOKEN ?? '';
  const from = options.from ?? process.env.EMAIL_FROM ?? '';
  const fromName = options.fromName ?? process.env.EMAIL_FROM_NAME ?? 'Workflows Email Example';
  const fetchImpl = options.fetch ?? fetch;

  const missing = [
    !apiUrl && 'TEMPS_API_URL',
    !token && 'TEMPS_API_TOKEN',
    !from && 'EMAIL_FROM',
  ].filter(Boolean);

  return {
    async send(message, idempotencyKey) {
      if (missing.length > 0) {
        // Thrown inside a step, this is recorded on the run, so the console
        // and the UI show exactly what to configure.
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
        const body = (await response.json()) as { id: string; status: string };
        return { id: body.id, status: body.status };
      }
      const detail = await problemDetail(response);
      // 408/429/5xx are transient: throw a plain error and let the step retry
      // with backoff. Anything else (sender domain not allowed for the
      // project, missing permission, key reused with a different payload)
      // fails the same way every time.
      if (response.status === 408 || response.status === 429 || response.status >= 500) {
        throw new Error(`Temps email API answered HTTP ${response.status} for ${idempotencyKey}: ${detail}`);
      }
      throw new EmailRejectedError(response.status, detail, idempotencyKey);
    },
  };
}

async function problemDetail(response: Response): Promise<string> {
  try {
    const problem = (await response.json()) as { detail?: string; title?: string };
    return problem.detail ?? problem.title ?? JSON.stringify(problem);
  } catch {
    return response.statusText || 'no response body';
  }
}
