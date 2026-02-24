# Temps Examples

Production-ready example applications showcasing [Temps](https://temps.sh) SDK integrations. Each example is a self-contained project you can clone and deploy.

## Examples

| Example | Stack | Description |
|---------|-------|-------------|
| [nextjs-saas](./examples/nextjs-saas) | Next.js 16, React 19, Stripe, PostgreSQL | Full-featured SaaS boilerplate with authentication, subscription billing, one-time purchases, and dashboard |

## Getting Started

Each example lives in its own directory under `examples/` with its own README and setup instructions.

```bash
# Clone the repo
git clone https://github.com/gotempsh/temps-examples.git

# Navigate to the example you want
cd temps-examples/examples/nextjs-saas

# Install dependencies
bun install

# Follow the example's README for environment setup
```

## What's Included

Every example demonstrates core Temps SDK capabilities:

- **Analytics** — Event tracking, page views, and purchase analytics
- **Transactional Email** — Pre-built templates for common SaaS emails (welcome, purchase confirmation, subscription lifecycle)
- **Blob Storage** — File upload, deletion, and URL generation
- **KV Store** — Key-value storage with expiry and rate limiting

## Contributing

1. Fork the repository
2. Create a new example under `examples/`
3. Include a `README.md` with setup instructions and a `.env.example`
4. Open a pull request

## License

MIT
