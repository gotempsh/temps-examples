// SPDX-FileCopyrightText: 2024-2026 Temps Contributors
// SPDX-License-Identifier: MIT OR Apache-2.0

'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';

import { buildTimeline, type RunSnapshot, type StepState, type Timeline, type TrackedSignup } from '@/lib/timeline.ts';
import { DEFAULT_TIMING, DEMO_TIMING, type Timing } from '@/lib/timing.ts';

interface SetupStatus {
  workflow: string;
  tempsApi: boolean;
  workflowCredential: boolean;
  deploymentToken: boolean;
  emailFrom: string | null;
  demoEnabled: boolean;
}

const KEY_STORAGE = 'workflows-email:access-key';
const SIGNUPS_STORAGE = 'workflows-email:signups';
const POLL_MS = 1500;

interface Problem {
  title?: string;
  detail?: string;
}

async function api<T>(path: string, accessKey: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: { authorization: `Bearer ${accessKey}`, 'content-type': 'application/json', ...(init.headers ?? {}) },
  });
  if (response.ok) return (await response.json()) as T;
  let problem: Problem = {};
  try {
    problem = (await response.json()) as Problem;
  } catch {
    // not JSON
  }
  throw new Error(problem.detail ?? problem.title ?? `HTTP ${response.status}`);
}

function loadSignups(): TrackedSignup[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(SIGNUPS_STORAGE) ?? '[]') as TrackedSignup[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function newUserId(): string {
  return `user_${crypto.randomUUID().replace(/-/g, '').slice(0, 10)}`;
}

function timingLabel(timing: Timing): string {
  return `activation ${timing.activationTimeout} · reminder ${timing.reminderTimeout} · tips after ${timing.tipsDelay}`;
}

export function OnboardingDemo() {
  const [setup, setSetup] = useState<SetupStatus | null>(null);
  const [accessKey, setAccessKey] = useState('');
  const [signups, setSignups] = useState<TrackedSignup[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setAccessKey(localStorage.getItem(KEY_STORAGE) ?? '');
    setSignups(loadSignups());
    setHydrated(true);
    fetch('/api/status')
      .then((r) => r.json() as Promise<SetupStatus>)
      .then(setSetup)
      .catch(() => setSetup(null));
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(SIGNUPS_STORAGE, JSON.stringify(signups));
  }, [signups, hydrated]);

  const saveKey = (value: string) => {
    setAccessKey(value);
    localStorage.setItem(KEY_STORAGE, value);
  };

  const update = useCallback((runId: string, change: Partial<TrackedSignup>) => {
    setSignups((all) => all.map((s) => (s.runId === runId ? { ...s, ...change } : s)));
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
      <div className="flex flex-col gap-6">
        <SetupCard setup={setup} />
        <SignupCard
          accessKey={accessKey}
          onAccessKey={saveKey}
          demoEnabled={setup?.demoEnabled ?? true}
          onStarted={(signup) => setSignups((all) => [signup, ...all.filter((s) => s.runId !== signup.runId)])}
        />
      </div>
      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Runs</h2>
          {signups.length > 0 && (
            <button
              type="button"
              className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              onClick={() => setSignups([])}
            >
              Clear list
            </button>
          )}
        </div>
        {hydrated && signups.length === 0 && (
          <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
            No runs yet. Sign someone up, for example <span className="font-mono">ada@example.com</span>, to start the
            sequence and follow it here.
          </div>
        )}
        {signups.map((signup) => (
          <RunCard
            key={signup.runId}
            signup={signup}
            accessKey={accessKey}
            onActivated={(at) => update(signup.runId, { activatedAt: at })}
            onRemove={() => setSignups((all) => all.filter((s) => s.runId !== signup.runId))}
          />
        ))}
      </section>
    </div>
  );
}

function SetupCard({ setup }: { setup: SetupStatus | null }) {
  if (!setup) return null;
  const items = [
    { ok: setup.tempsApi && setup.deploymentToken, label: 'Deployed on Temps', fix: 'TEMPS_API_URL and TEMPS_API_TOKEN are injected by Temps on every deployment.' },
    { ok: setup.workflowCredential, label: 'Workflow credential', fix: 'Console → project → Workflows → create a credential, then set it as TEMPS_WORKFLOWS_TOKEN.' },
    { ok: Boolean(setup.emailFrom), label: setup.emailFrom ? `Sender ${setup.emailFrom}` : 'Sender address', fix: 'Set EMAIL_FROM, and allow its domain for this project under Email → Domains.' },
    { ok: setup.demoEnabled, label: 'Demo enabled', fix: 'Set DEMO_API_KEY on the deployment. The form below asks for it.' },
  ];
  const ready = items.every((i) => i.ok);
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-3 text-sm font-semibold">{ready ? 'Ready' : 'Setup needed'}</h2>
      <ul className="flex flex-col gap-2 text-sm">
        {items.map((item) => (
          <li key={item.label} className="flex gap-2">
            <span className={item.ok ? 'text-emerald-600' : 'text-amber-600'}>{item.ok ? '✓' : '!'}</span>
            <span>
              <span className="font-medium">{item.label}</span>
              {!item.ok && <span className="block text-zinc-500">{item.fix}</span>}
            </span>
          </li>
        ))}
      </ul>
      {ready && (
        <p className="mt-3 text-xs text-zinc-500">
          Emails show up in the Temps console under Email. Until the sender domain is verified they are captured
          there instead of delivered.
        </p>
      )}
    </section>
  );
}

function SignupCard({
  accessKey,
  onAccessKey,
  demoEnabled,
  onStarted,
}: {
  accessKey: string;
  onAccessKey: (value: string) => void;
  demoEnabled: boolean;
  onStarted: (signup: TrackedSignup) => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [demoSpeed, setDemoSpeed] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    const userId = newUserId();
    const timing = demoSpeed ? DEMO_TIMING : DEFAULT_TIMING;
    try {
      const started = await api<{ runId: string; createdAt: string }>('/api/signup', accessKey, {
        method: 'POST',
        body: JSON.stringify({ userId, name, email, timing }),
      });
      onStarted({ runId: started.runId, userId, name, email, timing: { ...timing } });
      setName('');
      setEmail('');
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : String(failure));
    } finally {
      setPending(false);
    }
  };

  const input =
    'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-950';
  return (
    <form onSubmit={submit} className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-sm font-semibold">Sign up a user</h2>
      <label className="flex flex-col gap-1 text-sm">
        Name
        <input className={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada" required />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Email
        <input
          className={input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ada@example.com"
          required
        />
      </label>
      <div className="flex items-start gap-2 text-sm">
        <input
          id="demo-speed"
          type="checkbox"
          className="mt-1"
          checked={demoSpeed}
          onChange={(e) => setDemoSpeed(e.target.checked)}
          aria-describedby="demo-speed-hint"
        />
        <div>
          <label htmlFor="demo-speed">Demo speed</label>
          <p id="demo-speed-hint" className="text-xs text-zinc-500">
            {timingLabel(demoSpeed ? DEMO_TIMING : DEFAULT_TIMING)}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-1 text-sm">
        <label htmlFor="access-key">Access key</label>
        <input
          id="access-key"
          className={input}
          type="password"
          value={accessKey}
          onChange={(e) => onAccessKey(e.target.value)}
          placeholder="DEMO_API_KEY"
          aria-describedby="access-key-hint"
          required
        />
        <p id="access-key-hint" className="text-xs text-zinc-500">
          {demoEnabled
            ? 'The DEMO_API_KEY set on this deployment. It keeps strangers from emailing through your demo.'
            : 'The demo is off: set DEMO_API_KEY on the deployment first.'}
        </p>
      </div>
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
      >
        {pending ? 'Starting…' : 'Sign up and start the sequence'}
      </button>
    </form>
  );
}

const STATE_STYLES: Record<StepState, { dot: string; text: string }> = {
  done: { dot: 'bg-emerald-500 text-white', text: '' },
  active: { dot: 'bg-indigo-500 text-white animate-pulse', text: 'font-medium' },
  pending: { dot: 'bg-zinc-200 dark:bg-zinc-800', text: 'text-zinc-400' },
  skipped: { dot: 'bg-zinc-200 dark:bg-zinc-800', text: 'text-zinc-400 line-through' },
  failed: { dot: 'bg-red-500 text-white', text: 'text-red-600' },
};

function countdown(until: string, now: number): string {
  const seconds = Math.max(0, Math.round((Date.parse(until) - now) / 1000));
  if (seconds >= 86_400) return `${Math.round(seconds / 86_400)}d left`;
  if (seconds >= 3600) return `${Math.round(seconds / 3600)}h left`;
  if (seconds >= 60) return `${Math.floor(seconds / 60)}m ${seconds % 60}s left`;
  return seconds > 0 ? `${seconds}s left` : 'due now';
}

function RunCard({
  signup,
  accessKey,
  onActivated,
  onRemove,
}: {
  signup: TrackedSignup;
  accessKey: string;
  onActivated: (at: string) => void;
  onRemove: () => void;
}) {
  const [run, setRun] = useState<RunSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [activating, setActivating] = useState(false);

  const timeline: Timeline | null = run ? buildTimeline(run, signup, now) : null;
  const finished = timeline?.finished ?? false;

  useEffect(() => {
    if (finished) return;
    let cancelled = false;
    const poll = async () => {
      try {
        const next = await api<RunSnapshot>(`/api/runs/${signup.runId}`, accessKey);
        if (!cancelled) {
          setRun(next);
          setError(null);
        }
      } catch (failure) {
        if (!cancelled) setError(failure instanceof Error ? failure.message : String(failure));
      }
    };
    void poll();
    const timer = setInterval(poll, POLL_MS);
    const clock = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      cancelled = true;
      clearInterval(timer);
      clearInterval(clock);
    };
  }, [signup.runId, accessKey, finished]);

  const activate = async () => {
    setActivating(true);
    try {
      const result = await api<{ delivered: number }>(`/api/users/${signup.userId}/activate`, accessKey, { method: 'POST' });
      if (result.delivered === 0) setError('No run was waiting for this user any more.');
      else onActivated(new Date().toISOString());
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : String(failure));
    } finally {
      setActivating(false);
    }
  };

  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-semibold">
            {signup.name} <span className="font-normal text-zinc-500">&lt;{signup.email}&gt;</span>
          </h3>
          <p className="font-mono text-xs text-zinc-500">run {signup.runId}</p>
        </div>
        <div className="flex items-center gap-2">
          {run && (
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 font-mono text-xs dark:bg-zinc-800">{run.status}</span>
          )}
          <button type="button" onClick={onRemove} className="text-xs text-zinc-400 hover:text-zinc-700" aria-label="Remove from list">
            ✕
          </button>
        </div>
      </div>

      <p className="mt-3 text-sm">{timeline?.headline ?? 'Loading…'}</p>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {timeline && (
        <ol className="mt-4 flex flex-col gap-3">
          {timeline.steps.map((step) => (
            <li key={step.key} className="flex items-start gap-3">
              <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] ${STATE_STYLES[step.state].dot}`}>
                {step.state === 'done' ? '✓' : step.state === 'failed' ? '✕' : ''}
              </span>
              <div className={`flex flex-1 flex-col text-sm ${STATE_STYLES[step.state].text}`}>
                <span>
                  {step.label}
                  {step.detail && step.state !== 'failed' && <span className="text-zinc-500"> · {step.detail}</span>}
                  {step.state === 'active' && step.until && (
                    <span className="ml-2 font-mono text-xs text-indigo-600 dark:text-indigo-400">{countdown(step.until, now)}</span>
                  )}
                </span>
                {step.state === 'failed' && step.detail && <span className="text-xs">{step.detail}</span>}
                {step.email && (
                  <span className="font-mono text-xs text-zinc-500">
                    {step.email.status} · {step.email.id}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}

      {timeline?.canActivate && (
        <button
          type="button"
          onClick={activate}
          disabled={activating}
          className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
        >
          {activating ? 'Activating…' : `Activate ${signup.name}'s account`}
        </button>
      )}
      <p className="mt-3 text-xs text-zinc-500">{timingLabel(signup.timing)}</p>
    </article>
  );
}
