import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => c.json({ message: 'Hello from Hono on Temps!' }));
app.get('/health', (c) => c.json({ status: 'ok' }));

export default app;
