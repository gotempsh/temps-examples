<!--
SPDX-FileCopyrightText: 2024-2026 Temps Contributors
SPDX-License-Identifier: MIT OR Apache-2.0
-->

# Workflows: onboarding emails

A durable onboarding email sequence built on **Temps workflows**
(`@temps-sdk/workflows`) and the **Temps email API**. No queue, no cron, and no
extra database: Temps stores the run and wakes the app when the next step is
due.

```
signup ──▶ welcome email ──▶ wait for "user.activated" (up to 3 days)
                                │ activated         │ timed out
                                │                   ▼
                                │             reminder email ──▶ wait again (up to 4 days)
                                ▼                                  │ activated     │ timed out
                       sleep 1 day ──▶ tips email ◀─────────────────┘               ▼
                                                                          finish (not activated)
```

What it shows:

| Primitive | Where |
|---|---|
| `ctx.step` with retries and a timeout, around each email send | `send-welcome`, `send-reminder`, `send-tips` |
| `ctx.waitForEvent` with a key and a timeout | `wait-for-activation`, `wait-after-reminder` |
| `ctx.sleep` lasting days | `pause-before-tips` |
| `WorkflowsClient.start` with an idempotency key | `POST /signup` (one sequence per user) |
| `WorkflowsClient.sendEvent` | `POST /users/{userId}/activate` |

During a sleep or a wait, no request is open and nothing is held in the app's
memory. The app can restart or be redeployed in the middle of a run, and the
next invocation replays the run's journal and continues from where it was.

## Sending each email exactly once

A workflow step runs **at least once**. If the container dies after the email
went out but before the step was recorded, the step runs again. The mailer
(`src/mailer.mjs`) therefore sends every email with an `Idempotency-Key`
derived from the run and the step (`wf:<runId>:<step>`). Temps stores the key
before it calls the provider, so a retried step gets the first delivery back
instead of sending a second email.

Errors are split in two:

- **Transient** (HTTP 408, 429, 5xx, network errors): the step throws and is
  retried with backoff, reusing the same idempotency key.
- **Permanent** (any other 4xx, e.g. a sender domain not authorized for the
  project): the step records the rejection instead of retrying, and the run
  fails with the reason, which is visible on the run in the console.

## Deploy on Temps

1. **Create the project** from this directory. It has a `Dockerfile`, port
   `3000`, and health check `/health`.
2. **Issue a workflow credential**: console → project → environment →
   **Workflows** → *Create credential*. Store it as the secret environment
   variable `TEMPS_WORKFLOWS_TOKEN`.
3. **Set up a sender**: under **Email → Domains**, add the domain you send from
   and allow it for this project. Set `EMAIL_FROM` (e.g.
   `onboarding@mail.example.com`). Until that domain is verified, Temps
   **captures** the emails (you can read them under **Email**) instead of
   delivering them, which is ideal for trying the example.
4. **Set `DEMO_API_KEY`** (any random string) to enable the demo API. Without
   it, `/signup` and the other routes answer `503`, so a deployed copy cannot
   be used to email arbitrary addresses.
5. **Deploy.** The environment's Workflows page then shows the executor and the
   `onboarding-emails` workflow.

Temps injects `TEMPS_API_URL` and `TEMPS_API_TOKEN` into every deployment. The
deployment token is what the mailer uses to call `POST /emails`.

### Try it

```bash
export APP=https://<your-app-url> KEY=<DEMO_API_KEY>

# Start the sequence (calling it again for the same user returns the same run)
curl -X POST $APP/signup -H "authorization: Bearer $KEY" \
  -d '{"userId":"user_42","email":"ada@example.com","name":"Ada"}'

# The user activates: the waiting run wakes up
curl -X POST $APP/users/user_42/activate -H "authorization: Bearer $KEY"

# Read the run
curl $APP/runs/<runId> -H "authorization: Bearer $KEY"
```

Keep personal data out of event keys and workflow names, because Temps stores
those in plaintext. The user id is the key here; the email address only
travels in the run input, which Temps encrypts.

### Short timings for demos

`/signup` accepts an optional `timing` object to replace the production delays
(`activationTimeout: "3d"`, `reminderTimeout: "4d"`, `tipsDelay: "1d"`):

```json
{ "userId": "user_42", "email": "ada@example.com", "name": "Ada",
  "timing": { "activationTimeout": "30s", "reminderTimeout": "30s", "tipsDelay": "10s" } }
```

## Tests

```bash
npm install
npm test        # the real workflow on the SDK's in-memory orchestrator: days pass instantly
```

The unit tests cover every branch of the sequence and check that replays never
resend an email, that a transient failure is retried with the same idempotency
key, and that a rejected email fails the run once.

### End to end against a deployment

```bash
APP_URL=https://<your-app-url> DEMO_API_KEY=<key> npm run e2e
```

`scripts/e2e.mjs` signs up two users with timings in seconds. One activates and
gets *welcome + tips*; the other never activates and gets *welcome + reminder*.
The script also checks that a repeated signup returns the same run, that the
event wakes exactly one run, and that every email went through Temps.

## The SDK package

`@temps-sdk/workflows` is not published to npm yet, so this example vendors
the SDK as `vendor/temps-sdk-workflows-0.1.0.tgz` (built from
[`sdks/node/packages/workflows`](https://github.com/gotempsh/temps/tree/main/sdks/node/packages/workflows),
the same way `temps workflows init --sdk-package` does). Once it is published,
replace the `file:` dependency in `package.json` with a version.

## Files

| File | |
|---|---|
| `src/workflows.mjs` | the workflow definition |
| `src/mailer.mjs` | Temps email API client with idempotency keys and retry classification |
| `src/templates.mjs` | the three emails |
| `src/server.mjs` | the HTTP API and the executor endpoints (`/.well-known/temps/workflows/*`) |
| `test/workflows.test.mjs` | unit tests on the in-memory orchestrator |
| `scripts/e2e.mjs` | end-to-end check against a deployment |
