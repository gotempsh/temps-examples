// SPDX-FileCopyrightText: 2024-2026 Temps Contributors
// SPDX-License-Identifier: MIT OR Apache-2.0

import { OnboardingDemo } from '@/components/OnboardingDemo.tsx';

export default function Page() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6">
      <header className="flex flex-col gap-3">
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Temps workflows example</p>
        <h1 className="text-3xl font-semibold tracking-tight">Onboarding emails that survive restarts</h1>
        <p className="max-w-3xl text-zinc-600 dark:text-zinc-400">
          Sign someone up and watch a durable workflow run: a welcome email, a wait for the user to activate,
          a reminder if they don&apos;t, and a tips email once they do. Temps keeps the run&apos;s state between
          steps, so the app can restart or be redeployed mid-sequence. Each email is sent exactly once.
        </p>
      </header>
      <OnboardingDemo />
    </main>
  );
}
