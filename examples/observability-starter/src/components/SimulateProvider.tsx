"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { useTempsAnalytics } from "@temps-sdk/react-analytics";
import { saveAccount, signOutAccount } from "@/lib/account";

/**
 * The Simulate engine.
 *
 * Clicking "Simulate a user journey" runs a scripted, front-end navigation
 * through the funnel (`/` -> `/pricing` -> `/signup` -> `/dashboard`). Because
 * the analytics provider has `autoTrackPageviews` on, each real route change
 * emits a pageview — so Temps Analytics fills with a Pages sequence, a session,
 * and a session replay. Alongside those we fire custom funnel events, POST to
 * `/api/subscribe` (a DB write => trace + span + log + metric), and trigger one
 * *caught* error (=> Error Tracking) without aborting the journey.
 *
 * This provider lives above the page tree in the root layout, so it stays
 * mounted while the journey navigates and the progress overlay persists across
 * route changes.
 */

type SimulateContextValue = {
  running: boolean;
  step: number;
  start: () => void;
};

const SimulateContext = createContext<SimulateContextValue | null>(null);

export function useSimulate(): SimulateContextValue {
  const ctx = useContext(SimulateContext);
  if (!ctx) {
    throw new Error("useSimulate must be used within <SimulateProvider>");
  }
  return ctx;
}

const STEPS = [
  "New visitor lands on the homepage",
  "Reads the pricing page",
  "Picks the Pro plan",
  "Creates an account",
  "Subscribes — $29/mo MRR",
  "Live in the product dashboard",
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Swallow the promise the SDK returns so a failed beacon (e.g. running locally
// with no Temps ingest) never rejects into the journey.
const fire = (result: unknown) => {
  if (result instanceof Promise) result.catch(() => {});
};

export function SimulateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { trackEvent } = useTempsAnalytics();
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(-1);
  const [done, setDone] = useState(false);
  const busy = useRef(false);

  const start = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    setDone(false);
    setRunning(true);
    // Begin as a fresh, logged-out visitor so the nav visibly signs in later.
    signOutAccount();

    // 0 — visitor lands
    setStep(0);
    router.push("/");
    await sleep(1000);

    // 1 — pricing
    setStep(1);
    fire(trackEvent("viewed_pricing"));
    router.push("/pricing");
    await sleep(1100);

    // 2 — plan chosen
    setStep(2);
    fire(trackEvent("plan_selected", { plan: "pro", price: 29 }));
    await sleep(900);

    // 3 — signup
    setStep(3);
    fire(trackEvent("signup_started", { plan: "pro" }));
    router.push("/signup?plan=pro");
    await sleep(1100);

    // account created -> real API write (trace + DB span + log + metric)
    fire(trackEvent("account_created"));
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: "pro",
          name: "Ada Lovelace",
          email: "ada@analyticalengines.dev",
          company: "Analytical Engines",
        }),
      });
    } catch {
      // no DB attached locally is fine — the journey continues
    }

    // one caught error -> Error Tracking + session replay, journey still finishes
    try {
      await fetch("/api/error-test");
    } catch {
      // expected
    }
    await sleep(300);

    // 4 — subscribed
    setStep(4);
    fire(trackEvent("subscribed", { plan: "pro", mrr: 29 }));
    // Sign the simulated visitor in so the nav reflects the account.
    saveAccount({
      name: "Ada Lovelace",
      email: "ada@analyticalengines.dev",
      plan: "pro",
    });
    await sleep(900);

    // 5 — land in dashboard
    setStep(5);
    router.push("/dashboard");
    await sleep(900);
    setDone(true);

    await sleep(2600);
    setRunning(false);
    setStep(-1);
    setDone(false);
    busy.current = false;
  }, [router, trackEvent]);

  return (
    <SimulateContext.Provider value={{ running, step, start }}>
      {children}
      {running ? <SimulateOverlay step={step} done={done} /> : null}
    </SimulateContext.Provider>
  );
}

function SimulateOverlay({ step, done }: { step: number; done: boolean }) {
  return (
    <div className="cds-rise pointer-events-none fixed inset-x-4 bottom-4 z-50 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[340px]">
      <div className="rounded-xl border border-line-strong bg-paper-2/95 p-4 shadow-2xl shadow-black/50 backdrop-blur">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${done ? "bg-accent" : "bg-accent cds-pulse"}`}
          />
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">
            {done ? "Journey complete" : "Simulating a user journey"}
          </span>
        </div>

        <ol className="mt-3 space-y-2">
          {STEPS.map((label, i) => {
            const state = done || i < step ? "done" : i === step ? "active" : "todo";
            return (
              <li key={label} className="flex items-center gap-2.5 text-sm">
                <span
                  className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border font-mono text-[9px] ${
                    state === "done"
                      ? "border-accent bg-accent text-accent-ink"
                      : state === "active"
                        ? "border-accent text-accent"
                        : "border-line text-ink-faint"
                  }`}
                >
                  {state === "done" ? "✓" : i + 1}
                </span>
                <span
                  className={
                    state === "todo"
                      ? "text-ink-faint"
                      : state === "active"
                        ? "text-ink"
                        : "text-ink-muted"
                  }
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ol>

        <p className="mt-3 border-t border-line pt-2.5 font-mono text-[11px] leading-relaxed text-ink-faint">
          Streaming to Temps: pageviews · funnel events · a trace · logs · a
          caught error.
        </p>
      </div>
    </div>
  );
}
