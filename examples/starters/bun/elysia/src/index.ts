import { Elysia, t } from 'elysia';

const port = parseInt(process.env.PORT || '3000');

const app = new Elysia()
  .get('/', () => ({ message: 'Hello from Elysia on Temps!' }))
  .get('/health', () => ({ status: 'ok' }))
  .listen(port);

console.log(`Listening on port ${app.server?.port}`);
