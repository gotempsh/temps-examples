import Link from "next/link"
import type { Metadata } from "next"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TableOfContents } from "@/components/table-of-contents"
import { CodeBlock } from "@/components/code-block"

export const metadata: Metadata = {
  title: "Examples",
  description: "Real-world examples and use cases for YourProject.",
}

const tocItems = [
  { title: "Starter Templates", href: "#starter-templates" },
  { title: "Common Patterns", href: "#common-patterns" },
  { title: "Deployment", href: "#deployment" },
  { title: "Testing", href: "#testing" },
]

export default function ExamplesPage() {
  return (
    <div className="flex gap-8">
      <article className="min-w-0 flex-1">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Examples</h1>
          <p className="text-lg text-muted-foreground">
            Real-world examples, starter templates, and common patterns.
          </p>
        </div>

        <hr className="my-8" />

        <div className="space-y-12">
          {/* Starter Templates */}
          <section id="starter-templates">
            <h2 className="text-2xl font-semibold tracking-tight">
              Starter Templates
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Clone a starter template to get up and running quickly with your
              preferred framework:
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Next.js Starter",
                  description: "Full-stack Next.js app with App Router, server actions, and auth.",
                  tags: ["Next.js", "React", "TypeScript"],
                  href: "#",
                },
                {
                  title: "Express API",
                  description: "REST API with Express, middleware setup, and error handling.",
                  tags: ["Express", "Node.js", "REST"],
                  href: "#",
                },
                {
                  title: "CLI Tool",
                  description: "Command-line tool template with argument parsing and prompts.",
                  tags: ["CLI", "Node.js", "TypeScript"],
                  href: "#",
                },
                {
                  title: "Serverless Functions",
                  description: "Deploy as serverless functions on AWS Lambda or Vercel.",
                  tags: ["Serverless", "AWS", "Vercel"],
                  href: "#",
                },
              ].map((template) => (
                <a key={template.title} href={template.href}>
                  <Card className="h-full transition-colors hover:border-foreground/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        {template.title}
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                      </CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1.5">
                        {template.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </section>

          {/* Common Patterns */}
          <section id="common-patterns">
            <h2 className="text-2xl font-semibold tracking-tight">
              Common Patterns
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Frequently used patterns and best practices:
            </p>

            <h3 className="mt-6 text-lg font-semibold">
              Middleware Pattern
            </h3>
            <div className="mt-3">
              <CodeBlock title="middleware.ts">{`import { client } from "./client"

// Create a reusable middleware
export function withAuth(handler) {
  return async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    try {
      const session = await client.auth.verify(token)
      req.user = session.user
      return handler(req, res)
    } catch {
      return res.status(401).json({ error: "Invalid token" })
    }
  }
}`}</CodeBlock>
            </div>

            <h3 className="mt-8 text-lg font-semibold">
              Batch Operations
            </h3>
            <div className="mt-3">
              <CodeBlock title="batch.ts">{`import { client } from "./client"

// Process items in batches
async function batchCreateUsers(users: CreateUserInput[]) {
  const batchSize = 50
  const results = []

  for (let i = 0; i < users.length; i += batchSize) {
    const batch = users.slice(i, i + batchSize)
    const created = await Promise.all(
      batch.map(user => client.users.create(user))
    )
    results.push(...created)
  }

  return results
}`}</CodeBlock>
            </div>
          </section>

          {/* Deployment */}
          <section id="deployment">
            <h2 className="text-2xl font-semibold tracking-tight">
              Deployment
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Deploy your application with YourProject to any platform:
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
          </section>

          {/* Testing */}
          <section id="testing">
            <h2 className="text-2xl font-semibold tracking-tight">
              Testing
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              YourProject includes a test helper that makes it easy to mock API
              calls in your tests:
            </p>
            <div className="mt-4">
              <CodeBlock title="__tests__/users.test.ts">{`import { createTestClient } from "your-project/test"

const client = createTestClient()

describe("users", () => {
  it("should create a user", async () => {
    // Mock the response
    client.mock("users.create", {
      id: "usr_test",
      name: "Test User",
      email: "test@example.com",
    })

    const user = await client.users.create({
      name: "Test User",
      email: "test@example.com",
    })

    expect(user.id).toBe("usr_test")
    expect(client.calls("users.create")).toHaveLength(1)
  })
})`}</CodeBlock>
            </div>
          </section>
        </div>

        {/* Pagination */}
        <hr className="my-8" />
        <div className="flex items-center justify-between">
          <Link
            href="/docs/api-reference"
            className="group flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            API Reference
          </Link>
          <div />
        </div>
      </article>
      <TableOfContents items={tocItems} />
    </div>
  )
}
