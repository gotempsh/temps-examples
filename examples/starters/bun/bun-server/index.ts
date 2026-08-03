const port = parseInt(process.env.PORT || '3000');

const server = Bun.serve({
  port,
  fetch(req) {
    const url = new URL(req.url);
    
    if (url.pathname === '/') {
      return Response.json({ message: 'Hello from Bun on Temps!' });
    }
    
    if (url.pathname === '/health') {
      return Response.json({ status: 'ok' });
    }
    
    return new Response('Not Found', { status: 404 });
  },
});

console.log(`Listening on port ${server.port}`);
