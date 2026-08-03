export const prerender = false;
export const ssr = true;

const message = 'Hello from SvelteKit on Temps!';

export function load() {
  return { message };
}
