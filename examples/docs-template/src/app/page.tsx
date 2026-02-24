import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  Code2,
  Zap,
  Shield,
  Terminal,
  Layers,
  GitBranch,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeBlock } from "@/components/code-block"

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-muted/50 via-background to-muted/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">
              v2.0 &mdash; Now with streaming support
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Build faster with{" "}
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                YourProject
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              A modern, type-safe toolkit for building production-grade applications.
              Simple APIs, excellent defaults, and comprehensive documentation.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/docs">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/docs/api-reference">API Reference</Link>
              </Button>
            </div>
            <div className="mt-8">
              <CodeBlock lang="bash">npm install your-project</CodeBlock>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Built with developer experience in mind. Get up and running in minutes,
            not hours.
          </p>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Zap,
              title: "Lightning Fast",
              description:
                "Optimized for performance with tree-shaking, lazy loading, and minimal runtime overhead.",
            },
            {
              icon: Shield,
              title: "Type Safe",
              description:
                "Full TypeScript support with auto-generated types, generics, and strict type inference.",
            },
            {
              icon: Code2,
              title: "Developer First",
              description:
                "Intuitive APIs, helpful error messages, and extensive IDE integration for a great DX.",
            },
            {
              icon: Layers,
              title: "Modular Design",
              description:
                "Import only what you need. Each module is independent with zero cross-dependencies.",
            },
            {
              icon: GitBranch,
              title: "Version Control",
              description:
                "Built-in migration support, backward compatibility, and semantic versioning.",
            },
            {
              icon: Package,
              title: "Rich Ecosystem",
              description:
                "Official plugins for popular frameworks, community extensions, and a growing plugin registry.",
            },
          ].map((feature) => (
            <Card
              key={feature.title}
              className="group relative overflow-hidden transition-colors hover:border-foreground/20"
            >
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg border bg-muted/50 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Start / Code Example Section */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Up and running in minutes
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                A few lines of code is all it takes to get started. Our APIs are
                designed to be intuitive and familiar.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  {
                    step: "1",
                    title: "Install the package",
                    description: "Add YourProject to your project with your favorite package manager.",
                  },
                  {
                    step: "2",
                    title: "Configure your setup",
                    description: "Create a config file or use our sensible defaults.",
                  },
                  {
                    step: "3",
                    title: "Start building",
                    description: "Import what you need and build something great.",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-background text-sm font-semibold">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Button asChild>
                  <Link href="/docs/getting-started">
                    Read the full guide
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div>
              <Tabs defaultValue="typescript" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="typescript">TypeScript</TabsTrigger>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="config">Config</TabsTrigger>
                </TabsList>
                <TabsContent value="typescript">
                  <CodeBlock title="app.ts">{`import { createClient } from "your-project"

const client = createClient({
  apiKey: process.env.API_KEY,
  region: "us-east-1",
})

// Type-safe queries with auto-completion
const users = await client.users.list({
  limit: 10,
  orderBy: "createdAt",
})

// Streaming support
for await (const event of client.events.stream()) {
  console.log(event.type, event.data)
}`}</CodeBlock>
                </TabsContent>
                <TabsContent value="javascript">
                  <CodeBlock title="app.js">{`const { createClient } = require("your-project")

const client = createClient({
  apiKey: process.env.API_KEY,
  region: "us-east-1",
})

// Simple, promise-based API
const users = await client.users.list({
  limit: 10,
  orderBy: "createdAt",
})

// Streaming support
for await (const event of client.events.stream()) {
  console.log(event.type, event.data)
}`}</CodeBlock>
                </TabsContent>
                <TabsContent value="config">
                  <CodeBlock title="your-project.config.ts">{`import { defineConfig } from "your-project"

export default defineConfig({
  // API configuration
  apiKey: process.env.API_KEY,
  region: "us-east-1",

  // Enable plugins
  plugins: [
    "@your-project/plugin-auth",
    "@your-project/plugin-cache",
  ],

  // Custom settings
  retry: {
    attempts: 3,
    backoff: "exponential",
  },
})`}</CodeBlock>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      {/* API Reference Preview */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Comprehensive API Reference
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Every method, every parameter, every type &mdash; documented with examples.
          </p>
        </div>
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Client",
              description: "Core client initialization and configuration options.",
              methods: ["createClient()", "client.configure()", "client.destroy()"],
              href: "/docs/api-reference#client",
            },
            {
              title: "Users",
              description: "User management, authentication, and profile operations.",
              methods: ["users.list()", "users.get()", "users.create()"],
              href: "/docs/api-reference#users",
            },
            {
              title: "Events",
              description: "Real-time event streaming and webhook management.",
              methods: ["events.stream()", "events.on()", "events.emit()"],
              href: "/docs/api-reference#events",
            },
            {
              title: "Storage",
              description: "File storage, uploads, and asset management.",
              methods: ["storage.upload()", "storage.get()", "storage.delete()"],
              href: "/docs/api-reference#storage",
            },
            {
              title: "Auth",
              description: "Authentication flows, tokens, and session management.",
              methods: ["auth.signIn()", "auth.signUp()", "auth.verify()"],
              href: "/docs/api-reference#auth",
            },
            {
              title: "Plugins",
              description: "Extend functionality with the plugin system.",
              methods: ["plugins.register()", "plugins.use()", "plugins.list()"],
              href: "/docs/api-reference#plugins",
            },
          ].map((api) => (
            <Link key={api.title} href={api.href}>
              <Card className="h-full transition-colors hover:border-foreground/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Terminal className="h-4 w-4 text-muted-foreground" />
                    {api.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {api.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {api.methods.map((method) => (
                      <li
                        key={method}
                        className="font-mono text-xs text-muted-foreground"
                      >
                        {method}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Follow our quickstart guide and have your first integration running
              in under 5 minutes.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/docs">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Read the Docs
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a
                  href="https://github.com/your-org/your-project"
                  target="_blank"
                  rel="noreferrer"
                >
                  View on GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold">Documentation</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    href="/docs/getting-started"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Getting Started
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/installation"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Installation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/api-reference"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/examples"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Examples
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Community</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a
                    href="https://github.com/your-org/your-project"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://discord.gg/your-project"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Discord
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com/your-project"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Resources</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    href="/blog"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/changelog"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Changelog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/roadmap"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Roadmap
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/license"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    License
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8">
            <p className="text-center text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} YourProject. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
