import type { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Circle, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Roadmap",
}

const roadmapSections = [
  {
    title: "Completed",
    icon: CheckCircle2,
    iconColor: "text-green-500",
    items: [
      {
        title: "Streaming Support",
        description: "Real-time event streaming with async iterators.",
        tag: "v2.0",
      },
      {
        title: "Plugin System",
        description: "Extensible plugin architecture with official registry.",
        tag: "v2.0",
      },
      {
        title: "Multi-Region Support",
        description: "Deploy to multiple regions with automatic failover.",
        tag: "v1.5",
      },
    ],
  },
  {
    title: "In Progress",
    icon: Clock,
    iconColor: "text-yellow-500",
    items: [
      {
        title: "GraphQL Support",
        description: "Native GraphQL integration alongside the REST API.",
        tag: "v2.1",
      },
      {
        title: "Edge Runtime",
        description: "First-class support for edge computing environments.",
        tag: "v2.1",
      },
      {
        title: "Dashboard UI",
        description: "A web-based dashboard for managing resources and monitoring.",
        tag: "v2.2",
      },
    ],
  },
  {
    title: "Planned",
    icon: Circle,
    iconColor: "text-muted-foreground",
    items: [
      {
        title: "AI/ML Integrations",
        description: "Built-in support for popular AI model providers.",
        tag: "v3.0",
      },
      {
        title: "Webhooks v2",
        description: "Improved webhook delivery with retry queues and signing.",
        tag: "v3.0",
      },
      {
        title: "CLI Tool",
        description: "Command-line interface for project scaffolding and management.",
        tag: "v3.0",
      },
      {
        title: "Self-Hosted Option",
        description: "Run YourProject on your own infrastructure.",
        tag: "v3.x",
      },
    ],
  },
]

export default function RoadmapPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight">Roadmap</h1>
      <p className="mt-4 text-muted-foreground">
        See what we&apos;re working on and what&apos;s coming next for
        YourProject.
      </p>

      <div className="mt-12 space-y-12">
        {roadmapSections.map((section) => (
          <div key={section.title}>
            <div className="flex items-center gap-2">
              <section.icon className={`h-5 w-5 ${section.iconColor}`} />
              <h2 className="text-xl font-bold">{section.title}</h2>
            </div>
            <div className="mt-4 space-y-3">
              {section.items.map((item) => (
                <Card key={item.title}>
                  <CardHeader className="py-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{item.title}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {item.tag}
                      </Badge>
                    </div>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
