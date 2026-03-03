import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight, BookOpen, Code2, Zap, Package } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TableOfContents } from "@/components/table-of-contents"
import { CodeBlock } from "@/components/code-block"

export const metadata: Metadata = {
  title: "Documentation",
  description: "Learn how to use YourProject with comprehensive guides and API references.",
}

const tocItems = [
  { title: "What is YourProject?", href: "#what-is-yourproject" },
  { title: "Architecture", href: "#architecture" },
  { title: "Key Features", href: "#key-features" },
  { title: "Quick Links", href: "#quick-links" },
  { title: "System Requirements", href: "#system-requirements" },
]

export default function DocsPage() {
  return (
    <div className="flex gap-8">
      <article className="min-w-0 flex-1">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
          <p className="text-lg text-muted-foreground">
            Everything you need to build with YourProject.
          </p>
        </div>

        <hr className="my-8" />

        <div className="space-y-12">
          {/* What is YourProject */}
          <section id="what-is-yourproject">
            <h2 className="text-2xl font-semibold tracking-tight">
              What is YourProject?
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              YourProject is a modern, type-safe toolkit for building
              production-grade applications. It provides a unified API for
              common backend operations including user management,
              authentication, event streaming, and file storage.
            </p>
            <p className="mt-3 leading-7 text-muted-foreground">
              Designed with developer experience as a top priority, YourProject
              offers intuitive APIs, comprehensive TypeScript support, and
              excellent documentation to help you ship faster.
            </p>
          </section>

          {/* Architecture */}
          <section id="architecture">
            <h2 className="text-2xl font-semibold tracking-tight">
              Architecture
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              YourProject follows a modular architecture where the core client
              delegates to specialized service modules:
            </p>
            <div className="mt-4">
              <CodeBlock lang="mermaid" title="Architecture Overview">{`graph TD
    A[Your Application] --> B[YourProject Client]
    B --> C[Users Module]
    B --> D[Events Module]
    B --> E[Storage Module]
    B --> F[Auth Module]
    C --> G[REST API]
    D --> H[WebSocket API]
    E --> I[Storage API]
    F --> G
    G --> J[(Database)]
    H --> K[Event Bus]
    I --> L[Object Store]`}</CodeBlock>
            </div>
          </section>

          {/* Key Features */}
          <section id="key-features">
            <h2 className="text-2xl font-semibold tracking-tight">
              Key Features
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: Zap,
                  title: "High Performance",
                  description:
                    "Connection pooling, request batching, and automatic retries ensure optimal performance.",
                },
                {
                  icon: Code2,
                  title: "Type Safe",
                  description:
                    "Full TypeScript support with auto-generated types from your schema.",
                },
                {
                  icon: BookOpen,
                  title: "Well Documented",
                  description:
                    "Comprehensive guides, API references, and real-world examples.",
                },
                {
                  icon: Package,
                  title: "Extensible",
                  description:
                    "Plugin system lets you extend functionality with official and community plugins.",
                },
              ].map((feature) => (
                <Card key={feature.title}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <feature.icon className="h-4 w-4 text-muted-foreground" />
                      {feature.title}
                    </CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>

          {/* Quick Links */}
          <section id="quick-links">
            <h2 className="text-2xl font-semibold tracking-tight">
              Quick Links
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                {
                  title: "Installation",
                  description: "Install and configure YourProject in your app",
                  href: "/docs/installation",
                },
                {
                  title: "Quick Start",
                  description: "Build your first integration in 5 minutes",
                  href: "/docs/getting-started",
                },
                {
                  title: "API Reference",
                  description: "Complete API documentation with examples",
                  href: "/api-reference",
                },
                {
                  title: "Examples",
                  description: "Real-world examples and use cases",
                  href: "/examples",
                },
              ].map((link) => (
                <Link key={link.href} href={link.href}>
                  <div className="group flex items-start gap-3 rounded-lg border p-4 transition-colors hover:border-foreground/20 hover:bg-muted/50">
                    <div className="flex-1">
                      <h3 className="font-medium group-hover:text-foreground">
                        {link.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {link.description}
                      </p>
                    </div>
                    <ArrowRight className="mt-0.5 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* System Requirements */}
          <section id="system-requirements">
            <h2 className="text-2xl font-semibold tracking-tight">
              System Requirements
            </h2>
            <div className="mt-4 rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">
                      Requirement
                    </th>
                    <th className="px-4 py-3 text-left font-medium">
                      Minimum
                    </th>
                    <th className="px-4 py-3 text-left font-medium">
                      Recommended
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3 font-medium">Node.js</td>
                    <td className="px-4 py-3 text-muted-foreground">18.0+</td>
                    <td className="px-4 py-3 text-muted-foreground">20.0+</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 font-medium">TypeScript</td>
                    <td className="px-4 py-3 text-muted-foreground">5.0+</td>
                    <td className="px-4 py-3 text-muted-foreground">5.3+</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Package Manager</td>
                    <td className="px-4 py-3 text-muted-foreground">npm, yarn, pnpm, or bun</td>
                    <td className="px-4 py-3 text-muted-foreground">bun or pnpm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Pagination */}
        <hr className="my-8" />
        <div className="flex justify-end">
          <Link
            href="/docs/installation"
            className="group flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground"
          >
            Installation
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </article>
      <TableOfContents items={tocItems} />
    </div>
  )
}
