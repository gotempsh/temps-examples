import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Blog",
}

const posts = [
  {
    title: "Introducing YourProject v2.0",
    description:
      "Streaming support, a new plugin system, and improved type inference. Here's everything new in v2.0.",
    date: "2025-12-01",
    tag: "Release",
    slug: "#",
  },
  {
    title: "Building Real-Time Apps with Streaming",
    description:
      "Learn how to use the new streaming API to build real-time features like live dashboards and notifications.",
    date: "2025-12-10",
    tag: "Tutorial",
    slug: "#",
  },
  {
    title: "How We Achieved 99.99% Uptime",
    description:
      "A deep dive into our infrastructure, redundancy strategies, and the tools we use to stay reliable.",
    date: "2025-11-15",
    tag: "Engineering",
    slug: "#",
  },
  {
    title: "Migrating from v1 to v2",
    description:
      "A step-by-step migration guide covering breaking changes, codemods, and best practices.",
    date: "2025-12-05",
    tag: "Guide",
    slug: "#",
  },
  {
    title: "Why We Chose TypeScript-First",
    description:
      "The trade-offs and benefits of building a TypeScript-first library from day one.",
    date: "2025-10-20",
    tag: "Engineering",
    slug: "#",
  },
]

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
      <p className="mt-4 text-muted-foreground">
        News, tutorials, and engineering deep dives from the YourProject team.
      </p>

      <div className="mt-12 space-y-4">
        {posts.map((post) => (
          <Link key={post.title} href={post.slug}>
            <Card className="transition-colors hover:border-foreground/20">
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <CardTitle className="text-base">{post.title}</CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {post.description}
                    </CardDescription>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {post.tag}
                    </Badge>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {post.date}
                    </span>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
