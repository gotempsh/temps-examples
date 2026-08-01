import node from '@astrojs/node';
import { defineConfig } from 'astro/config';

// `output: 'server'` needs an adapter; without one `astro build` fails.
// The node adapter emits dist/server/entry.mjs, which is what `start` runs.
export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT ?? 4321),
  },
});
