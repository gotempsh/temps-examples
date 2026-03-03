import Link from "next/link"
import type { Metadata } from "next"
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TableOfContents } from "@/components/table-of-contents"
import { CodeBlock } from "@/components/code-block"

export const metadata: Metadata = {
  title: "Starter Templates",
  description: "Clone a starter template to get up and running quickly.",
}

const tocItems = [
  { title: "Templates", href: "#templates" },
  { title: "Using a Template", href: "#using-a-template" },
  { title: "Template Structure", href: "#template-structure" },
]

export default function StarterTemplatesPage() {
  return (
    <div className="flex gap-8">
      <article className="min-w-0 flex-1">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Starter Templates
          </h1>
          <p className="text-lg text-muted-foreground">
            Clone a starter template to get up and running quickly with your
            preferred framework.
          </p>
        </div>

        <hr className="my-8" />

        <div className="space-y-12">
          <section id="templates">
            <h2 className="text-2xl font-semibold tracking-tight">Templates</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Next.js Starter",
                  description:
                    "Full-stack Next.js app with App Router, server actions, and auth.",
                  tags: ["Next.js", "React", "TypeScript"],
                  href: "#",
                },
                {
                  title: "Express API",
                  description:
                    "REST API with Express, middleware setup, and error handling.",
                  tags: ["Express", "Node.js", "REST"],
                  href: "#",
                },
                {
                  title: "CLI Tool",
                  description:
                    "Command-line tool template with argument parsing and prompts.",
                  tags: ["CLI", "Node.js", "TypeScript"],
                  href: "#",
                },
                {
                  title: "Serverless Functions",
                  description:
                    "Deploy as serverless functions on AWS Lambda or Vercel.",
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
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
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

          <section id="using-a-template">
            <h2 className="text-2xl font-semibold tracking-tight">
              Using a Template
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              The fastest way to start a new project is with{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
                create-your-project
              </code>
              :
            </p>
            <div className="mt-4">
              <CodeBlock title="Terminal" lang="bash">{`npx create-your-project my-app --template nextjs

cd my-app
npm install
npm run dev`}</CodeBlock>
            </div>
            <p className="mt-4 leading-7 text-muted-foreground">
              Or clone directly from GitHub:
            </p>
            <div className="mt-4">
              <CodeBlock title="Terminal" lang="bash">{`git clone https://github.com/your-org/your-project-starter-nextjs my-app
cd my-app
npm install
cp .env.example .env.local
npm run dev`}</CodeBlock>
            </div>
          </section>

          <section id="template-structure">
            <h2 className="text-2xl font-semibold tracking-tight">
              Template Structure
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              All templates follow a consistent structure:
            </p>
            <div className="mt-4">
              <CodeBlock title="Project structure" lang="bash">{`my-app/
├── src/
│   ├── client.ts          # YourProject client setup
│   ├── app/               # Application code
│   └── lib/               # Shared utilities
├── .env.example           # Environment variables template
├── your-project.config.ts # YourProject configuration
├── package.json
└── tsconfig.json`}</CodeBlock>
            </div>
          </section>
        </div>

        {/* Pagination */}
        <hr className="my-8" />
        <div className="flex items-center justify-between">
          <Link
            href="/examples"
            className="group flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Overview
          </Link>
          <Link
            href="/examples/patterns"
            className="group flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground"
          >
            Common Patterns
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </article>
      <TableOfContents items={tocItems} />
    </div>
  )
}
