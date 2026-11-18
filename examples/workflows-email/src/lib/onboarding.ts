// SPDX-FileCopyrightText: 2024-2026 Temps Contributors
// SPDX-License-Identifier: MIT OR Apache-2.0

// The onboarding email sequence, as a durable workflow.
//
//   signup ──▶ welcome email ──▶ wait for "user.activated" (up to 3 days)
//                                   │ activated        │ timed out
//                                   │                  ▼
//                                   │            reminder email ──▶ wait again (up to 4 days)
//                                   ▼                                 │ activated     │ timed out
//                          sleep 1 day ──▶ tips email ◀───────────────┘               ▼
//                                                                          finish (not activated)
//
// Temps keeps the run's state, not this process: during the sleeps and waits
// no request is open and nothing is held in memory, so the app can restart or
// be redeployed in between and the sequence picks up where it was. Every
// email is sent inside `ctx.step`, so a completed send is recorded once and
// replayed (never re-sent) when the workflow function runs again.

import { defineWorkflow, type WorkflowContext } from '@temps-sdk/workflows';

import { EmailRejectedError, idempotencyKeyFor, type EmailMessage, type Mailer, type SentEmail } from './mailer.ts';
import { reminderEmail, tipsEmail, welcomeEmail } from './templates.ts';
import { DEFAULT_TIMING, type Timing } from './timing.ts';

export const ONBOARDING_WORKFLOW = 'onboarding-emails';
export const ACTIVATED_EVENT = 'user.activated';

export interface OnboardingInput {
  userId: string;
  email: string;
  name: string;
  appUrl?: string;
  timing?: Partial<Timing>;
}

export interface OnboardingEmail extends SentEmail {
  step: string;
}

export interface OnboardingOutput {
  userId: string;
  activated: boolean;
  activatedVia?: string | null;
  emails: OnboardingEmail[];
}

const USER_ID = /^[A-Za-z0-9_-]{1,64}$/;

export function inputProblems(input: unknown): string[] {
  const problems: string[] = [];
  if (!input || typeof input !== 'object') return ['input must be an object'];
  const value = input as Record<string, unknown>;
  // The user id becomes the event key, which Temps stores in plaintext: keep
  // personal data (like the email address) out of it.
  if (typeof value.userId !== 'string' || !USER_ID.test(value.userId)) problems.push('userId must be 1-64 of A-Z a-z 0-9 _ -');
  if (typeof value.email !== 'string' || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value.email)) problems.push('email must be an email address');
  if (typeof value.name !== 'string' || value.name.trim() === '') problems.push('name is required');
  return problems;
}

type RejectedSend = { rejected: true; reason: string };

export function createOnboardingWorkflow(mailer: Mailer) {
  return defineWorkflow<OnboardingInput, OnboardingOutput>(
    ONBOARDING_WORKFLOW,
    async (ctx: WorkflowContext<OnboardingInput>) => {
      const problems = inputProblems(ctx.input);
      if (problems.length > 0) throw new Error(`Invalid ${ONBOARDING_WORKFLOW} input: ${problems.join('; ')}`);
      const { userId, email, name } = ctx.input;
      const appUrl = ctx.input.appUrl ?? 'https://example.com/activate';
      const timing: Timing = { ...DEFAULT_TIMING, ...(ctx.input.timing ?? {}) };
      const emails: OnboardingEmail[] = [];

      const send = async (step: string, message: Omit<EmailMessage, 'to'>) => {
        const result = await ctx.step<SentEmail | RejectedSend>(
          step,
          async () => {
            try {
              return await mailer.send({ to: email, ...message }, idempotencyKeyFor(ctx.runId, step));
            } catch (error) {
              // A rejection is permanent: record it as the step's result so it
              // is not retried, and fail the run below with the reason.
              if (error instanceof EmailRejectedError) return { rejected: true, reason: error.message };
              throw error; // transient: the step retries with backoff
            }
          },
          { retries: 5, initialBackoff: '2s', maxBackoff: '1m', timeout: '45s' },
        );
        if ('rejected' in result) throw new Error(`Step '${step}' could not send: ${result.reason}`);
        emails.push({ step, id: result.id, status: result.status });
      };

      await send('send-welcome', welcomeEmail({ name, appUrl }));

      let activation = await ctx.waitForEvent<{ source?: string }>('wait-for-activation', {
        event: ACTIVATED_EVENT,
        key: userId,
        timeout: timing.activationTimeout,
      });

      if (!activation.received) {
        await send('send-reminder', reminderEmail({ name, appUrl }));
        activation = await ctx.waitForEvent<{ source?: string }>('wait-after-reminder', {
          event: ACTIVATED_EVENT,
          key: userId,
          timeout: timing.reminderTimeout,
        });
        if (!activation.received) return { userId, activated: false, emails };
      }

      await ctx.sleep('pause-before-tips', timing.tipsDelay);
      await send('send-tips', tipsEmail({ name }));

      return { userId, activated: true, activatedVia: activation.payload?.source ?? null, emails };
    },
    { version: '1', concurrency: 50 },
  );
}
