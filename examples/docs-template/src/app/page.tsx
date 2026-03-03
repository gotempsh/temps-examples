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
  Star,
  Download,
  Users,
  CheckCircle2,
  Sparkles,
  Github,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeBlock } from "@/components/code-block"

export default function HomePage() {
  return (
    <main>
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden border-b">
        {/* Animated gradient background */}
        <div className="absolute inset-0 animate-hero-gradient bg-gradient-to-br from-primary/5 via-background to-primary/10" />
        {/* Radial glow accent */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent" />
        {/* Dot grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern" />
        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 py-28 sm:px-6 sm:py-40 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {/* Announcement badge */}
            <div className="animate-fade-in">
              <Link href="/docs" className="group inline-flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="gap-1.5 border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium transition-colors group-hover:border-primary/40 group-hover:bg-primary/10"
                >
                  <Sparkles className="h-3 w-3 text-primary" />
                  v2.0 &mdash; Now with streaming support
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </Badge>
              </Link>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-in-up delay-100 mt-8 text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl">
              Build faster with{" "}
              <span className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground/50 bg-clip-text text-transparent">
                YourProject
              </span>
            </h1>

            {/* Subhead */}
            <p className="animate-fade-in-up delay-200 mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              The modern, type-safe toolkit for building production-grade
              applications. Ship faster with simple APIs, excellent defaults,
              and world-class documentation.
            </p>

            {/* CTA buttons */}
            <div className="animate-fade-in-up delay-300 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/20" asChild>
                <Link href="/docs">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 text-base"
                asChild
              >
                <Link href="/api-reference">API Reference</Link>
              </Button>
            </div>

            {/* Install command */}
            <div className="animate-fade-in-up delay-400 mt-8">
              <CodeBlock lang="bash">npm install your-project</CodeBlock>
            </div>

            {/* Social proof stats */}
            <div className="animate-fade-in-up delay-500 mt-10 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-semibold text-foreground">12.4k</span>{" "}
                GitHub stars
              </div>
              <div className="hidden h-4 w-px bg-border sm:block" />
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-green-500" />
                <span className="font-semibold text-foreground">2M+</span>{" "}
                weekly downloads
              </div>
              <div className="hidden h-4 w-px bg-border sm:block" />
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="font-semibold text-foreground">50k+</span>{" "}
                developers
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trusted By / Logo Cloud ── */}
      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Trusted by teams at
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {["Vercel", "Stripe", "Shopify", "Linear", "Raycast", "Supabase"].map(
              (company) => (
                <span
                  key={company}
                  className="text-lg font-semibold text-muted-foreground/50 transition-colors hover:text-muted-foreground"
                >
                  {company}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">
            Features
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Everything you need to ship
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Built with developer experience in mind. Get up and running in
            minutes, not hours.
          </p>
        </div>
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Zap,
              title: "Lightning Fast",
              description:
                "Optimized for performance with tree-shaking, lazy loading, and minimal runtime overhead.",
              color: "text-yellow-500",
              bg: "bg-yellow-500/10",
            },
            {
              icon: Shield,
              title: "Type Safe",
              description:
                "Full TypeScript support with auto-generated types, generics, and strict type inference.",
              color: "text-blue-500",
              bg: "bg-blue-500/10",
            },
            {
              icon: Code2,
              title: "Developer First",
              description:
                "Intuitive APIs, helpful error messages, and extensive IDE integration for a great DX.",
              color: "text-green-500",
              bg: "bg-green-500/10",
            },
            {
              icon: Layers,
              title: "Modular Design",
              description:
                "Import only what you need. Each module is independent with zero cross-dependencies.",
              color: "text-purple-500",
              bg: "bg-purple-500/10",
            },
            {
              icon: GitBranch,
              title: "Version Control",
              description:
                "Built-in migration support, backward compatibility, and semantic versioning.",
              color: "text-orange-500",
              bg: "bg-orange-500/10",
            },
            {
              icon: Package,
              title: "Rich Ecosystem",
              description:
                "Official plugins for popular frameworks, community extensions, and a growing plugin registry.",
              color: "text-pink-500",
              bg: "bg-pink-500/10",
            },
          ].map((feature) => (
            <Card
              key={feature.title}
              className="gradient-border group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              <CardHeader>
                <div
                  className={`mb-3 flex h-11 w-11 items-center justify-center rounded-lg ${feature.bg} transition-transform duration-300 group-hover:scale-110`}
                >
                  <feature.icon className={`h-5 w-5 ${feature.color}`} />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription className="leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Quick Start / Code Example Section ── */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge variant="secondary" className="mb-4">
                Quick Start
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
                Up and running in minutes
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                A few lines of code is all it takes. Our APIs are designed to be
                intuitive and familiar.
              </p>
              <div className="mt-10 space-y-6">
                {[
                  {
                    step: "1",
                    title: "Install the package",
                    description:
                      "Add YourProject to your project with your favorite package manager.",
                  },
                  {
                    step: "2",
                    title: "Configure your setup",
                    description:
                      "Create a config file or use our sensible defaults.",
                  },
                  {
                    step: "3",
                    title: "Start building",
                    description:
                      "Import what you need and build something great.",
                  },
                ].map((item) => (
                  <div key={item.step} className="group flex gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-sm transition-transform duration-300 group-hover:scale-110">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Button size="lg" className="h-11 px-6" asChild>
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

      {/* ── Testimonials / Social Proof ── */}
      <section className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">
            Loved by developers
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Don&apos;t take our word for it
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See what developers are saying about YourProject.
          </p>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              quote:
                "YourProject completely changed how we build APIs. What used to take days now takes hours.",
              author: "Sarah Chen",
              role: "Staff Engineer at Vercel",
            },
            {
              quote:
                "The type safety alone is worth it. We caught so many bugs before they reached production.",
              author: "Marcus Johnson",
              role: "CTO at Acme Corp",
            },
            {
              quote:
                "Best DX I've experienced in a library. The documentation is chef's kiss.",
              author: "Priya Patel",
              role: "Senior Developer at Stripe",
            },
          ].map((testimonial) => (
            <Card key={testimonial.author} className="relative overflow-hidden">
              <CardHeader>
                <div className="flex gap-1 mb-3">
                  {["s1", "s2", "s3", "s4", "s5"].map((id) => (
                    <Star
                      key={id}
                      className="h-4 w-4 fill-yellow-500 text-yellow-500"
                    />
                  ))}
                </div>
                <CardDescription className="text-base leading-relaxed text-foreground/80">
                  &ldquo;{testimonial.quote}&rdquo;
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="text-sm font-semibold">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── API Reference Preview ── */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">
              API Reference
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Comprehensive API docs
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Every method, every parameter, every type &mdash; documented with
              examples.
            </p>
          </div>
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Client",
                description:
                  "Core client initialization and configuration options.",
                methods: [
                  "createClient()",
                  "client.configure()",
                  "client.destroy()",
                ],
                href: "/api-reference/client",
              },
              {
                title: "Users",
                description:
                  "User management, authentication, and profile operations.",
                methods: ["users.list()", "users.get()", "users.create()"],
                href: "/api-reference/users",
              },
              {
                title: "Events",
                description:
                  "Real-time event streaming and webhook management.",
                methods: ["events.stream()", "events.on()", "events.emit()"],
                href: "/api-reference/events",
              },
              {
                title: "Storage",
                description: "File storage, uploads, and asset management.",
                methods: [
                  "storage.upload()",
                  "storage.get()",
                  "storage.delete()",
                ],
                href: "/api-reference/storage",
              },
              {
                title: "Auth",
                description:
                  "Authentication flows, tokens, and session management.",
                methods: ["auth.signIn()", "auth.signUp()", "auth.verify()"],
                href: "/api-reference/auth",
              },
              {
                title: "Plugins",
                description: "Extend functionality with the plugin system.",
                methods: [
                  "plugins.register()",
                  "plugins.use()",
                  "plugins.list()",
                ],
                href: "/api-reference",
              },
            ].map((api) => (
              <Link key={api.title} href={api.href}>
                <Card className="gradient-border group h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
                        <Terminal className="h-3.5 w-3.5 text-primary" />
                      </div>
                      {api.title}
                      <ExternalLink className="ml-auto h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {api.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5">
                      {api.methods.map((method) => (
                        <li
                          key={method}
                          className="flex items-center gap-2 font-mono text-xs text-muted-foreground"
                        >
                          <span className="h-1 w-1 rounded-full bg-primary/40" />
                          {method}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
        <div className="grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "npm downloads", value: "2M+", subtext: "per week" },
            { label: "GitHub stars", value: "12.4k", subtext: "and growing" },
            { label: "Contributors", value: "340+", subtext: "open source" },
            {
              label: "Uptime",
              value: "99.99%",
              subtext: "over the last year",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-background p-8 text-center transition-colors hover:bg-muted/30"
            >
              <p className="text-4xl font-bold tracking-tight">{stat.value}</p>
              <p className="mt-1 text-sm font-medium">{stat.label}</p>
              <p className="text-xs text-muted-foreground">{stat.subtext}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="relative overflow-hidden border-t">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
        <div className="absolute inset-0 bg-grid-pattern" />
        <div className="relative mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Ready to get started?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join{" "}
              <span className="font-semibold text-foreground">50,000+</span>{" "}
              developers already building with YourProject. Follow our
              quickstart guide and have your first integration running in under 5
              minutes.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/20" asChild>
                <Link href="/docs">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Read the Docs
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8 text-base" asChild>
                <a
                  href="https://github.com/your-org/your-project"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github className="mr-2 h-4 w-4" />
                  View on GitHub
                </a>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Free and open source
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                MIT licensed
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                No vendor lock-in
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-6">
            {/* Brand column */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <span className="text-lg font-bold">YourProject</span>
              </Link>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                A modern, type-safe toolkit for building production-grade
                applications. Simple APIs, excellent defaults, and comprehensive
                documentation.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                  <a
                    href="https://github.com/your-org/your-project"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Github className="h-4 w-4" />
                    <span className="sr-only">GitHub</span>
                  </a>
                </Button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Documentation</h3>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <Link
                    href="/docs/getting-started"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Getting Started
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/installation"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Installation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/api-reference"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link
                    href="/examples"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Examples
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Community</h3>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <a
                    href="https://github.com/your-org/your-project"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://discord.gg/your-project"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Discord
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com/your-project"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Resources</h3>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <Link
                    href="/blog"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/changelog"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Changelog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/roadmap"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Roadmap
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Legal</h3>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/license"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    License
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} YourProject. All rights
              reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Built with Next.js and open source
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
