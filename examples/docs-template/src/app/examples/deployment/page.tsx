import Link from "next/link"
import type { Metadata } from "next"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { TableOfContents } from "@/components/table-of-contents"
import { CodeBlock } from "@/components/code-block"

export const metadata: Metadata = {
  title: "Deployment",
  description: "Deploy your application with YourProject to any platform.",
}

const tocItems = [
  { title: "Docker", href: "#docker" },
  { title: "Vercel", href: "#vercel" },
  { title: "AWS Lambda", href: "#aws-lambda" },
  { title: "Environment Variables", href: "#environment-variables" },
]

export default function DeploymentPage() {
  return (
    <div className="flex gap-8">
      <article className="min-w-0 flex-1">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Deployment</h1>
          <p className="text-lg text-muted-foreground">
            Deploy your application with YourProject to any platform.
          </p>
        </div>

        <hr className="my-8" />

        <div className="space-y-12">
          <section id="docker">
            <h2 className="text-2xl font-semibold tracking-tight">Docker</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Containerize your application for consistent deployments across
              environments:
            </p>
            <div className="mt-4">
              <CodeBlock title="Dockerfile">{`FROM node:20-slim AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN npm install --production

# Copy source
COPY . .
RUN npm run build

# Run
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]`}</CodeBlock>
            </div>
            <div className="mt-4">
              <CodeBlock title="docker-compose.yml" lang="yaml">{`version: "3.8"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - YOUR_PROJECT_API_KEY=\${YOUR_PROJECT_API_KEY}
      - YOUR_PROJECT_REGION=us-east-1
      - NODE_ENV=production`}</CodeBlock>
            </div>
          </section>

          <section id="vercel">
            <h2 className="text-2xl font-semibold tracking-tight">Vercel</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Deploy to Vercel with zero configuration. Just connect your
              repository and add environment variables:
            </p>
            <div className="mt-4">
              <CodeBlock title="Terminal" lang="bash">{`# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add YOUR_PROJECT_API_KEY`}</CodeBlock>
            </div>
            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-950/30">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Tip
              </p>
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                YourProject automatically detects serverless environments and
                optimizes connection management accordingly.
              </p>
            </div>
          </section>

          <section id="aws-lambda">
            <h2 className="text-2xl font-semibold tracking-tight">
              AWS Lambda
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              For serverless deployments, use the singleton pattern to reuse the
              client across warm invocations:
            </p>
            <div className="mt-4">
              <CodeBlock title="handler.ts" lang="typescript">{`import { getClient } from "./client"

export async function handler(event: APIGatewayEvent) {
  const client = getClient()

  const users = await client.users.list({ limit: 10 })

  return {
    statusCode: 200,
    body: JSON.stringify(users),
  }
}`}</CodeBlock>
            </div>
          </section>

          <section id="environment-variables">
            <h2 className="text-2xl font-semibold tracking-tight">
              Environment Variables
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Required and optional environment variables for production:
            </p>
            <div className="mt-4 rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">
                      Variable
                    </th>
                    <th className="px-4 py-3 text-left font-medium">
                      Required
                    </th>
                    <th className="px-4 py-3 text-left font-medium">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "YOUR_PROJECT_API_KEY", required: "Yes", description: "Your API key" },
                    { name: "YOUR_PROJECT_REGION", required: "No", description: "Server region (default: us-east-1)" },
                    { name: "YOUR_PROJECT_LOG_LEVEL", required: "No", description: "Log verbosity (default: info)" },
                    { name: "YOUR_PROJECT_TIMEOUT", required: "No", description: "Request timeout in ms (default: 30000)" },
                  ].map((row, i, arr) => (
                    <tr key={row.name} className={i < arr.length - 1 ? "border-b" : ""}>
                      <td className="px-4 py-3">
                        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                          {row.name}
                        </code>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {row.required}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {row.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Pagination */}
        <hr className="my-8" />
        <div className="flex items-center justify-between">
          <Link
            href="/examples/patterns"
            className="group flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Common Patterns
          </Link>
          <Link
            href="/examples/testing"
            className="group flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground"
          >
            Testing
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </article>
      <TableOfContents items={tocItems} />
    </div>
  )
}
