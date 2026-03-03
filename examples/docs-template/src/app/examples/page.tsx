import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight, Code2, Rocket, TestTube, FileBox } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TableOfContents } from "@/components/table-of-contents"

export const metadata: Metadata = {
  title: "Examples",
  description: "Real-world examples and use cases for YourProject.",
}

const tocItems = [
  { title: "Overview", href: "#overview" },
  { title: "Guides", href: "#guides" },
]

const guides = [
  {
    icon: FileBox,
    title: "Starter Templates",
    description: "Clone a ready-made template for Next.js, Express, CLI tools, or serverless functions.",
    href: "/examples/starter-templates",
  },
  {
    icon: Code2,
    title: "Common Patterns",
    description: "Middleware, batch operations, error boundaries, and singleton client patterns.",
    href: "/examples/patterns",
  },
  {
    icon: Rocket,
    title: "Deployment",
    description: "Deploy with Docker, Vercel, or AWS Lambda with environment variable configuration.",
    href: "/examples/deployment",
  },
  {
    icon: TestTube,
    title: "Testing",
    description: "Mock API calls, assert method invocations, and run integration tests.",
    href: "/examples/testing",
  },
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
          <section id="overview">
            <h2 className="text-2xl font-semibold tracking-tight">Overview</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Learn by example with production-ready code snippets, starter
              templates, and deployment guides. Each guide includes complete,
              copy-pasteable code that you can adapt to your own projects.
            </p>
          </section>

          <section id="guides">
            <h2 className="text-2xl font-semibold tracking-tight">Guides</h2>
            <div className="mt-4 grid gap-4">
              {guides.map((guide) => (
                <Link key={guide.title} href={guide.href}>
                  <Card className="group transition-colors hover:border-foreground/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <guide.icon className="h-4 w-4 text-muted-foreground" />
                        {guide.title}
                        <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </CardTitle>
                      <CardDescription>{guide.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </article>
      <TableOfContents items={tocItems} />
    </div>
  )
}
