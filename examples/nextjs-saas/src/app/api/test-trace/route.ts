import { NextResponse } from "next/server";
import { trace, SpanKind, SpanStatusCode } from "@opentelemetry/api";

const tracer = trace.getTracer("nextjs-saas", "0.1.0");

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * GET /api/test-trace?scenario=simple|checkout|error|parallel
 *
 * Generates realistic, deeply-nested trace trees for visual testing.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const scenario = url.searchParams.get("scenario") || "checkout";

  const handlers: Record<string, () => Promise<Response>> = {
    simple: traceSimple,
    checkout: traceCheckoutFlow,
    error: traceWithErrors,
    parallel: traceParallelWork,
  };

  const handler = handlers[scenario];
  if (!handler) {
    return NextResponse.json(
      {
        error: `Unknown scenario: ${scenario}`,
        available: Object.keys(handlers),
      },
      { status: 400 }
    );
  }

  return handler();
}

// ---------------------------------------------------------------------------
// Scenario: simple — quick sanity check
// ---------------------------------------------------------------------------
async function traceSimple() {
  return tracer.startActiveSpan(
    "GET /api/test-trace",
    { kind: SpanKind.SERVER },
    async (root) => {
      root.setAttribute("http.method", "GET");
      root.setAttribute("http.route", "/api/test-trace");
      root.setAttribute("test.scenario", "simple");

      await tracer.startActiveSpan("db.query", async (span) => {
        span.setAttribute("db.system", "postgresql");
        span.setAttribute("db.statement", "SELECT 1");
        await sleep(15);
        span.end();
      });

      root.setStatus({ code: SpanStatusCode.OK });
      root.end();
      await flush();
      return json(root, "simple");
    }
  );
}

// ---------------------------------------------------------------------------
// Scenario: checkout — realistic e-commerce checkout with deep nesting
//
//  checkout.handler
//  ├── auth.validate-session
//  │   └── db.query (SELECT session)
//  ├── cart.load
//  │   ├── db.query (SELECT cart items)
//  │   ├── cache.get (product prices)
//  │   └── cart.compute-totals
//  │       └── tax.calculate
//  │           └── http.request (tax-service)
//  ├── inventory.reserve
//  │   ├── db.query (SELECT stock)
//  │   └── db.query (UPDATE stock)
//  ├── payment.process
//  │   ├── stripe.create-payment-intent
//  │   │   └── http.request (api.stripe.com)
//  │   └── stripe.confirm-payment
//  │       └── http.request (api.stripe.com)
//  ├── order.create
//  │   ├── db.transaction
//  │   │   ├── db.query (INSERT order)
//  │   │   ├── db.query (INSERT order_items)
//  │   │   └── db.query (UPDATE cart)
//  │   └── cache.invalidate
//  ├── notifications.send
//  │   ├── email.send (order confirmation)
//  │   │   └── http.request (temps email API)
//  │   └── analytics.track (purchase event)
//  │       └── http.request (temps analytics API)
//  └── response.serialize
// ---------------------------------------------------------------------------
async function traceCheckoutFlow() {
  return tracer.startActiveSpan(
    "POST /api/checkout",
    { kind: SpanKind.SERVER },
    async (root) => {
      root.setAttribute("http.method", "POST");
      root.setAttribute("http.route", "/api/checkout");
      root.setAttribute("test.scenario", "checkout");
      root.setAttribute("user.id", "usr_abc123");
      root.setAttribute("cart.id", "cart_xyz789");

      // 1. Auth
      await tracer.startActiveSpan("auth.validate-session", async (auth) => {
        auth.setAttribute("auth.method", "bearer-token");
        await tracer.startActiveSpan("db.query", async (db) => {
          db.setAttribute("db.system", "postgresql");
          db.setAttribute("db.statement", "SELECT * FROM sessions WHERE token = $1 AND expires_at > NOW()");
          db.setAttribute("db.operation", "SELECT");
          db.setAttribute("db.sql.table", "sessions");
          await sleep(8);
          db.end();
        });
        auth.setAttribute("auth.user_id", "usr_abc123");
        auth.end();
      });

      // 2. Load cart
      await tracer.startActiveSpan("cart.load", async (cart) => {
        cart.setAttribute("cart.id", "cart_xyz789");

        await tracer.startActiveSpan("db.query", async (db) => {
          db.setAttribute("db.system", "postgresql");
          db.setAttribute("db.statement", "SELECT ci.*, p.name, p.price FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.cart_id = $1");
          db.setAttribute("db.operation", "SELECT");
          db.setAttribute("db.sql.table", "cart_items");
          await sleep(12);
          db.end();
        });

        await tracer.startActiveSpan("cache.get", async (cache) => {
          cache.setAttribute("cache.system", "redis");
          cache.setAttribute("cache.key", "product_prices:v3");
          cache.setAttribute("cache.hit", true);
          await sleep(2);
          cache.end();
        });

        await tracer.startActiveSpan("cart.compute-totals", async (totals) => {
          totals.setAttribute("cart.items_count", 3);

          await tracer.startActiveSpan("tax.calculate", async (tax) => {
            tax.setAttribute("tax.jurisdiction", "US-CA");
            tax.setAttribute("tax.rate", 0.0875);

            await tracer.startActiveSpan(
              "http.request",
              { kind: SpanKind.CLIENT },
              async (http) => {
                http.setAttribute("http.method", "POST");
                http.setAttribute("http.url", "https://tax-service.internal/api/v1/calculate");
                http.setAttribute("http.status_code", 200);
                http.setAttribute("http.response_content_length", 256);
                await sleep(25);
                http.end();
              }
            );

            tax.setAttribute("tax.amount", 12.47);
            tax.end();
          });

          totals.setAttribute("cart.subtotal", 142.50);
          totals.setAttribute("cart.tax", 12.47);
          totals.setAttribute("cart.total", 154.97);
          totals.end();
        });

        cart.setAttribute("cart.total_items", 3);
        cart.end();
      });

      // 3. Reserve inventory
      await tracer.startActiveSpan("inventory.reserve", async (inv) => {
        inv.setAttribute("inventory.items_count", 3);

        await tracer.startActiveSpan("db.query", async (db) => {
          db.setAttribute("db.system", "postgresql");
          db.setAttribute("db.statement", "SELECT id, stock_count FROM products WHERE id = ANY($1) FOR UPDATE");
          db.setAttribute("db.operation", "SELECT");
          await sleep(6);
          db.end();
        });

        await tracer.startActiveSpan("db.query", async (db) => {
          db.setAttribute("db.system", "postgresql");
          db.setAttribute("db.statement", "UPDATE products SET stock_count = stock_count - $1 WHERE id = $2");
          db.setAttribute("db.operation", "UPDATE");
          db.setAttribute("db.sql.table", "products");
          await sleep(5);
          db.end();
        });

        inv.setAttribute("inventory.reserved", true);
        inv.end();
      });

      // 4. Process payment
      await tracer.startActiveSpan("payment.process", async (pay) => {
        pay.setAttribute("payment.provider", "stripe");
        pay.setAttribute("payment.amount", 154.97);
        pay.setAttribute("payment.currency", "usd");

        await tracer.startActiveSpan("stripe.create-payment-intent", async (intent) => {
          intent.setAttribute("stripe.operation", "payment_intents.create");

          await tracer.startActiveSpan(
            "http.request",
            { kind: SpanKind.CLIENT },
            async (http) => {
              http.setAttribute("http.method", "POST");
              http.setAttribute("http.url", "https://api.stripe.com/v1/payment_intents");
              http.setAttribute("http.status_code", 200);
              http.setAttribute("net.peer.name", "api.stripe.com");
              http.setAttribute("net.peer.port", 443);
              await sleep(120);
              http.end();
            }
          );

          intent.setAttribute("stripe.payment_intent_id", "pi_test_abc123");
          intent.end();
        });

        await tracer.startActiveSpan("stripe.confirm-payment", async (confirm) => {
          confirm.setAttribute("stripe.operation", "payment_intents.confirm");

          await tracer.startActiveSpan(
            "http.request",
            { kind: SpanKind.CLIENT },
            async (http) => {
              http.setAttribute("http.method", "POST");
              http.setAttribute("http.url", "https://api.stripe.com/v1/payment_intents/pi_test_abc123/confirm");
              http.setAttribute("http.status_code", 200);
              http.setAttribute("net.peer.name", "api.stripe.com");
              await sleep(95);
              http.end();
            }
          );

          confirm.setAttribute("stripe.status", "succeeded");
          confirm.end();
        });

        pay.setAttribute("payment.status", "succeeded");
        pay.end();
      });

      // 5. Create order
      await tracer.startActiveSpan("order.create", async (order) => {
        order.setAttribute("order.id", "ord_test_456");

        await tracer.startActiveSpan("db.transaction", async (tx) => {
          tx.setAttribute("db.system", "postgresql");
          tx.setAttribute("db.operation", "TRANSACTION");

          await tracer.startActiveSpan("db.query", async (db) => {
            db.setAttribute("db.system", "postgresql");
            db.setAttribute("db.statement", "INSERT INTO orders (id, user_id, total, status) VALUES ($1, $2, $3, 'confirmed')");
            db.setAttribute("db.operation", "INSERT");
            db.setAttribute("db.sql.table", "orders");
            await sleep(7);
            db.end();
          });

          await tracer.startActiveSpan("db.query", async (db) => {
            db.setAttribute("db.system", "postgresql");
            db.setAttribute("db.statement", "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)");
            db.setAttribute("db.operation", "INSERT");
            db.setAttribute("db.sql.table", "order_items");
            await sleep(5);
            db.end();
          });

          await tracer.startActiveSpan("db.query", async (db) => {
            db.setAttribute("db.system", "postgresql");
            db.setAttribute("db.statement", "UPDATE carts SET status = 'completed' WHERE id = $1");
            db.setAttribute("db.operation", "UPDATE");
            db.setAttribute("db.sql.table", "carts");
            await sleep(3);
            db.end();
          });

          tx.end();
        });

        await tracer.startActiveSpan("cache.invalidate", async (cache) => {
          cache.setAttribute("cache.system", "redis");
          cache.setAttribute("cache.operation", "DEL");
          cache.setAttribute("cache.keys", "cart:xyz789,user_orders:abc123");
          await sleep(2);
          cache.end();
        });

        order.end();
      });

      // 6. Notifications (email + analytics in parallel)
      await tracer.startActiveSpan("notifications.send", async (notif) => {
        const emailPromise = tracer.startActiveSpan(
          "email.send",
          async (email) => {
            email.setAttribute("email.template", "order-confirmation");
            email.setAttribute("email.to", "user@example.com");

            await tracer.startActiveSpan(
              "http.request",
              { kind: SpanKind.CLIENT },
              async (http) => {
                http.setAttribute("http.method", "POST");
                http.setAttribute("http.url", "https://temps-api.internal/api/v1/email/send");
                http.setAttribute("http.status_code", 202);
                await sleep(45);
                http.end();
              }
            );

            email.setAttribute("email.message_id", "msg_test_789");
            email.end();
          }
        );

        const analyticsPromise = tracer.startActiveSpan(
          "analytics.track",
          async (analytics) => {
            analytics.setAttribute("analytics.event", "purchase");
            analytics.setAttribute("analytics.revenue", 154.97);

            await tracer.startActiveSpan(
              "http.request",
              { kind: SpanKind.CLIENT },
              async (http) => {
                http.setAttribute("http.method", "POST");
                http.setAttribute("http.url", "https://temps-api.internal/api/v1/analytics/events");
                http.setAttribute("http.status_code", 200);
                await sleep(18);
                http.end();
              }
            );

            analytics.end();
          }
        );

        await Promise.all([emailPromise, analyticsPromise]);
        notif.end();
      });

      // 7. Serialize response
      await tracer.startActiveSpan("response.serialize", async (resp) => {
        resp.setAttribute("response.format", "json");
        resp.setAttribute("response.size_bytes", 512);
        await sleep(1);
        resp.end();
      });

      root.setAttribute("http.status_code", 200);
      root.setStatus({ code: SpanStatusCode.OK });
      root.end();
      await flush();
      return json(root, "checkout");
    }
  );
}

// ---------------------------------------------------------------------------
// Scenario: error — trace with failures, retries, and partial success
//
//  process-webhook.handler
//  ├── auth.verify-signature
//  ├── db.query (find subscription)
//  ├── external.sync-crm (FAILS, retries 3x)
//  │   ├── http.request (attempt 1 — 500)
//  │   ├── http.request (attempt 2 — timeout)
//  │   └── http.request (attempt 3 — 200 OK)
//  ├── db.transaction
//  │   ├── db.query (UPDATE subscription)
//  │   └── db.query (INSERT audit_log)
//  └── notifications.send
//      ├── email.send (succeeds)
//      └── slack.notify (FAILS — non-critical)
// ---------------------------------------------------------------------------
async function traceWithErrors() {
  return tracer.startActiveSpan(
    "POST /api/webhooks/stripe",
    { kind: SpanKind.SERVER },
    async (root) => {
      root.setAttribute("http.method", "POST");
      root.setAttribute("http.route", "/api/webhooks/stripe");
      root.setAttribute("test.scenario", "error");
      root.setAttribute("stripe.event_type", "customer.subscription.updated");

      // Verify signature
      await tracer.startActiveSpan("auth.verify-signature", async (auth) => {
        auth.setAttribute("auth.method", "stripe-webhook-signature");
        await sleep(2);
        auth.end();
      });

      // Find subscription
      await tracer.startActiveSpan("db.query", async (db) => {
        db.setAttribute("db.system", "postgresql");
        db.setAttribute("db.statement", "SELECT * FROM subscriptions WHERE stripe_subscription_id = $1");
        db.setAttribute("db.operation", "SELECT");
        db.setAttribute("db.sql.table", "subscriptions");
        await sleep(10);
        db.end();
      });

      // CRM sync with retries
      await tracer.startActiveSpan("external.sync-crm", async (crm) => {
        crm.setAttribute("crm.provider", "hubspot");
        crm.setAttribute("crm.operation", "update-contact");

        // Attempt 1 — 500
        await tracer.startActiveSpan(
          "http.request",
          { kind: SpanKind.CLIENT },
          async (http) => {
            http.setAttribute("http.method", "PUT");
            http.setAttribute("http.url", "https://api.hubspot.com/crm/v3/objects/contacts/123");
            http.setAttribute("http.attempt", 1);
            await sleep(80);
            http.setAttribute("http.status_code", 500);
            http.setStatus({
              code: SpanStatusCode.ERROR,
              message: "Internal Server Error",
            });
            http.recordException(new Error("HTTP 500: CRM service returned Internal Server Error"));
            http.end();
          }
        );

        // Attempt 2 — timeout
        await tracer.startActiveSpan(
          "http.request",
          { kind: SpanKind.CLIENT },
          async (http) => {
            http.setAttribute("http.method", "PUT");
            http.setAttribute("http.url", "https://api.hubspot.com/crm/v3/objects/contacts/123");
            http.setAttribute("http.attempt", 2);
            await sleep(3000); // 3s timeout
            http.setStatus({
              code: SpanStatusCode.ERROR,
              message: "Request timeout after 3000ms",
            });
            http.recordException(new Error("ETIMEDOUT: Connection timed out after 3000ms"));
            http.end();
          }
        );

        // Attempt 3 — success
        await tracer.startActiveSpan(
          "http.request",
          { kind: SpanKind.CLIENT },
          async (http) => {
            http.setAttribute("http.method", "PUT");
            http.setAttribute("http.url", "https://api.hubspot.com/crm/v3/objects/contacts/123");
            http.setAttribute("http.attempt", 3);
            await sleep(65);
            http.setAttribute("http.status_code", 200);
            http.end();
          }
        );

        crm.setAttribute("crm.retries", 2);
        crm.setAttribute("crm.final_status", "success");
        crm.end();
      });

      // DB transaction
      await tracer.startActiveSpan("db.transaction", async (tx) => {
        tx.setAttribute("db.system", "postgresql");

        await tracer.startActiveSpan("db.query", async (db) => {
          db.setAttribute("db.system", "postgresql");
          db.setAttribute("db.statement", "UPDATE subscriptions SET status = $1, current_period_end = $2 WHERE id = $3");
          db.setAttribute("db.operation", "UPDATE");
          db.setAttribute("db.sql.table", "subscriptions");
          await sleep(6);
          db.end();
        });

        await tracer.startActiveSpan("db.query", async (db) => {
          db.setAttribute("db.system", "postgresql");
          db.setAttribute("db.statement", "INSERT INTO audit_log (entity_type, entity_id, action, metadata) VALUES ($1, $2, $3, $4)");
          db.setAttribute("db.operation", "INSERT");
          db.setAttribute("db.sql.table", "audit_log");
          await sleep(4);
          db.end();
        });

        tx.end();
      });

      // Notifications — email succeeds, slack fails
      await tracer.startActiveSpan("notifications.send", async (notif) => {
        const emailPromise = tracer.startActiveSpan("email.send", async (email) => {
          email.setAttribute("email.template", "subscription-updated");
          email.setAttribute("email.to", "user@example.com");
          await sleep(35);
          email.setAttribute("email.status", "sent");
          email.end();
        });

        const slackPromise = tracer.startActiveSpan("slack.notify", async (slack) => {
          slack.setAttribute("slack.channel", "#billing-alerts");
          slack.setAttribute("slack.webhook", "https://hooks.slack.com/services/T.../B.../xxx");
          await sleep(40);
          slack.setStatus({
            code: SpanStatusCode.ERROR,
            message: "Slack webhook returned 403 Forbidden",
          });
          slack.recordException(
            new Error("SlackAPIError: 403 Forbidden — webhook token revoked")
          );
          slack.setAttribute("slack.status", "failed");
          slack.end();
        });

        await Promise.all([emailPromise, slackPromise]);
        notif.setAttribute("notifications.partial_failure", true);
        notif.end();
      });

      root.setAttribute("http.status_code", 200);
      root.setStatus({ code: SpanStatusCode.OK });
      root.end();
      await flush();
      return json(root, "error");
    }
  );
}

// ---------------------------------------------------------------------------
// Scenario: parallel — concurrent fan-out work (dashboard data aggregation)
//
//  dashboard.load
//  ├── auth.get-user
//  ├── [parallel fan-out]
//  │   ├── metrics.revenue
//  │   │   └── db.query (aggregate revenue)
//  │   ├── metrics.users
//  │   │   ├── db.query (count users)
//  │   │   └── cache.set
//  │   ├── metrics.subscriptions
//  │   │   └── db.query (subscription breakdown)
//  │   ├── chart.revenue-over-time
//  │   │   └── db.query (time-series)
//  │   └── external.fetch-stripe-balance
//  │       └── http.request (api.stripe.com)
//  └── response.render
//      └── template.compile
// ---------------------------------------------------------------------------
async function traceParallelWork() {
  return tracer.startActiveSpan(
    "GET /dashboard",
    { kind: SpanKind.SERVER },
    async (root) => {
      root.setAttribute("http.method", "GET");
      root.setAttribute("http.route", "/dashboard");
      root.setAttribute("test.scenario", "parallel");
      root.setAttribute("user.id", "usr_abc123");

      // Auth
      await tracer.startActiveSpan("auth.get-user", async (auth) => {
        auth.setAttribute("auth.method", "session-cookie");
        await sleep(5);
        auth.setAttribute("auth.user_id", "usr_abc123");
        auth.end();
      });

      // Parallel fan-out — all data fetches at once
      await tracer.startActiveSpan("dashboard.fetch-data", async (fetchAll) => {
        fetchAll.setAttribute("dashboard.parallel_queries", 5);

        const revenue = tracer.startActiveSpan(
          "metrics.revenue",
          async (span) => {
            await tracer.startActiveSpan("db.query", async (db) => {
              db.setAttribute("db.system", "postgresql");
              db.setAttribute("db.statement", "SELECT SUM(amount) as total, COUNT(*) as count FROM payments WHERE created_at >= $1 AND status = 'succeeded'");
              db.setAttribute("db.operation", "SELECT");
              db.setAttribute("db.sql.table", "payments");
              await sleep(45);
              db.end();
            });
            span.setAttribute("metrics.revenue.total", 48250.0);
            span.setAttribute("metrics.revenue.count", 312);
            span.end();
          }
        );

        const users = tracer.startActiveSpan(
          "metrics.users",
          async (span) => {
            await tracer.startActiveSpan("db.query", async (db) => {
              db.setAttribute("db.system", "postgresql");
              db.setAttribute("db.statement", "SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE created_at >= $1) as new_this_month FROM users");
              db.setAttribute("db.operation", "SELECT");
              db.setAttribute("db.sql.table", "users");
              await sleep(20);
              db.end();
            });

            await tracer.startActiveSpan("cache.set", async (cache) => {
              cache.setAttribute("cache.system", "redis");
              cache.setAttribute("cache.key", "dashboard:user_count");
              cache.setAttribute("cache.ttl_seconds", 300);
              await sleep(2);
              cache.end();
            });

            span.setAttribute("metrics.users.total", 1847);
            span.setAttribute("metrics.users.new_this_month", 156);
            span.end();
          }
        );

        const subscriptions = tracer.startActiveSpan(
          "metrics.subscriptions",
          async (span) => {
            await tracer.startActiveSpan("db.query", async (db) => {
              db.setAttribute("db.system", "postgresql");
              db.setAttribute("db.statement", "SELECT plan, status, COUNT(*) FROM subscriptions GROUP BY plan, status");
              db.setAttribute("db.operation", "SELECT");
              db.setAttribute("db.sql.table", "subscriptions");
              await sleep(35);
              db.end();
            });
            span.setAttribute("metrics.subscriptions.active", 892);
            span.setAttribute("metrics.subscriptions.churned", 67);
            span.end();
          }
        );

        const chart = tracer.startActiveSpan(
          "chart.revenue-over-time",
          async (span) => {
            await tracer.startActiveSpan("db.query", async (db) => {
              db.setAttribute("db.system", "postgresql");
              db.setAttribute("db.statement", "SELECT date_trunc('day', created_at) as day, SUM(amount) FROM payments WHERE created_at >= $1 GROUP BY 1 ORDER BY 1");
              db.setAttribute("db.operation", "SELECT");
              db.setAttribute("db.sql.table", "payments");
              db.setAttribute("db.rows_returned", 30);
              await sleep(55);
              db.end();
            });
            span.setAttribute("chart.data_points", 30);
            span.end();
          }
        );

        const stripeBalance = tracer.startActiveSpan(
          "external.fetch-stripe-balance",
          async (span) => {
            span.setAttribute("stripe.operation", "balance.retrieve");

            await tracer.startActiveSpan(
              "http.request",
              { kind: SpanKind.CLIENT },
              async (http) => {
                http.setAttribute("http.method", "GET");
                http.setAttribute("http.url", "https://api.stripe.com/v1/balance");
                http.setAttribute("net.peer.name", "api.stripe.com");
                await sleep(70);
                http.setAttribute("http.status_code", 200);
                http.end();
              }
            );

            span.setAttribute("stripe.balance.available", 32150.0);
            span.setAttribute("stripe.balance.pending", 4800.0);
            span.end();
          }
        );

        await Promise.all([
          revenue,
          users,
          subscriptions,
          chart,
          stripeBalance,
        ]);

        fetchAll.end();
      });

      // Render
      await tracer.startActiveSpan("response.render", async (render) => {
        await tracer.startActiveSpan("template.compile", async (tpl) => {
          tpl.setAttribute("template.name", "dashboard");
          tpl.setAttribute("template.components", 12);
          await sleep(15);
          tpl.end();
        });

        render.setAttribute("response.format", "html");
        render.setAttribute("response.size_bytes", 28400);
        render.end();
      });

      root.setAttribute("http.status_code", 200);
      root.setStatus({ code: SpanStatusCode.OK });
      root.end();
      await flush();
      return json(root, "parallel");
    }
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
async function flush() {
  try {
    const provider = globalThis.__otelTracerProvider;
    if (provider) {
      await provider.forceFlush();
    }
  } catch (e) {
    console.error("[test-trace] forceFlush failed:", e);
  }
}

function json(
  span: { spanContext(): { traceId: string; spanId: string }; isRecording(): boolean },
  scenario: string
) {
  return NextResponse.json({
    ok: true,
    scenario,
    traceId: span.spanContext().traceId,
    spanId: span.spanContext().spanId,
    isRecording: span.isRecording(),
  });
}
