// SPDX-FileCopyrightText: 2024-2026 Temps Contributors
// SPDX-License-Identifier: MIT OR Apache-2.0

import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { once } from 'node:events';
import net from 'node:net';
import { fileURLToPath } from 'node:url';

const cwd = fileURLToPath(new URL('../examples/sveltekit/', import.meta.url));
for (const args of [['install', '--frozen-lockfile'], ['run', 'build']]) {
  const result = spawnSync('bun', args, { cwd, stdio: 'inherit' });
  assert.equal(result.status, 0, `bun ${args.join(' ')} failed`);
}

const reservation = net.createServer();
reservation.listen(0, '127.0.0.1');
await once(reservation, 'listening');
const port = reservation.address().port;
await new Promise(resolve => reservation.close(resolve));
const server = spawn('node', ['build'], {
  cwd,
  env: { ...process.env, PORT: String(port), HOST: '127.0.0.1' },
  stdio: 'inherit',
});
const base = `http://127.0.0.1:${port}`;
try {
  let response;
  for (let attempt = 0; attempt < 60; attempt++) {
    assert.equal(server.exitCode, null, 'Production server exited before answering');
    try {
      response = await fetch(base, { signal: AbortSignal.timeout(2000) });
      break;
    } catch {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  assert(response, 'Production server did not answer within 30 seconds');
  assert.equal(response.status, 200);
  const html = await response.text();
  // These values are returned by +page.server.ts and must be present in SSR.
  assert(html.includes('Lightning Fast'), 'Missing server-loaded feature');
  assert(html.includes('Enterprise'), 'Missing server-loaded pricing');
  const asset = html.match(/(?:href|src)="([^" ]*\/_app\/immutable\/[^" ]+)"/);
  assert(asset, 'No compiled application asset in production HTML');
  assert.equal((await fetch(new URL(asset[1], base))).status, 200);
  const image = await fetch(base + '/images/hero-app.svg');
  assert.equal(image.status, 200);
  assert((await image.text()).includes('<svg'), 'Static asset was not served');
  console.log('PASS SvelteKit production: SSR data, compiled asset, static image, and configured PORT');
} finally {
  server.kill('SIGTERM');
  if (server.exitCode === null) await once(server, 'exit');
}
