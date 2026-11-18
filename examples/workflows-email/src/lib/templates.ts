// SPDX-FileCopyrightText: 2024-2026 Temps Contributors
// SPDX-License-Identifier: MIT OR Apache-2.0

// The emails of the onboarding sequence. Plain functions of the run input, so
// a replayed run renders exactly what the first invocation rendered.

import type { EmailMessage } from './mailer.ts';

type Content = Omit<EmailMessage, 'to'>;

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escape = (value: string) => value.replace(/[&<>"']/g, (c) => ESCAPES[c] ?? c);

function layout(title: string, paragraphs: string[]): Pick<Content, 'html' | 'text'> {
  const html = `<!doctype html><html><body style="font-family:system-ui,sans-serif;max-width:560px;margin:auto">
<h1 style="font-size:20px">${escape(title)}</h1>
${paragraphs.map((p) => `<p>${escape(p)}</p>`).join('\n')}
</body></html>`;
  return { html, text: [title, '', ...paragraphs].join('\n') };
}

export function welcomeEmail({ name, appUrl }: { name: string; appUrl: string }): Content {
  return {
    subject: `Welcome aboard, ${name}!`,
    tags: ['onboarding', 'welcome'],
    ...layout(`Welcome, ${name}`, [
      'Thanks for signing up. One last step: activate your account to get started.',
      `Activate it here: ${appUrl}`,
    ]),
  };
}

export function reminderEmail({ name, appUrl }: { name: string; appUrl: string }): Content {
  return {
    subject: `${name}, your account is still waiting`,
    tags: ['onboarding', 'reminder'],
    ...layout('Still there?', [
      `Hi ${name}, you signed up but have not activated your account yet.`,
      `It takes ten seconds: ${appUrl}`,
    ]),
  };
}

export function tipsEmail({ name }: { name: string }): Content {
  return {
    subject: 'Three tips to get the most out of your account',
    tags: ['onboarding', 'tips'],
    ...layout(`Nice work, ${name}`, [
      'Your account is active. Here are three things worth trying first:',
      '1. Invite a teammate. 2. Connect your first integration. 3. Turn on weekly reports.',
    ]),
  };
}
