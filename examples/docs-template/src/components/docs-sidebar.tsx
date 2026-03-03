"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

interface NavItem {
  title: string
  href: string
}

interface NavSection {
  title: string
  items: NavItem[]
}

const docsNavigation: NavSection[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Installation", href: "/docs/installation" },
      { title: "Quick Start", href: "/docs/getting-started" },
      { title: "Configuration", href: "/docs/configuration" },
    ],
  },
  {
    title: "Core Concepts",
    items: [
      { title: "Client", href: "/docs/configuration#configuration-file" },
      { title: "Authentication", href: "/docs/getting-started#handle-errors" },
      { title: "Error Handling", href: "/docs/getting-started#handle-errors" },
      { title: "Streaming", href: "/docs/getting-started#stream-events" },
    ],
  },
]

const apiNavigation: NavSection[] = [
  {
    title: "API Reference",
    items: [
      { title: "Overview", href: "/api-reference" },
      { title: "Client", href: "/api-reference/client" },
      { title: "Users", href: "/api-reference/users" },
      { title: "Events", href: "/api-reference/events" },
      { title: "Storage", href: "/api-reference/storage" },
      { title: "Auth", href: "/api-reference/auth" },
    ],
  },
]

const examplesNavigation: NavSection[] = [
  {
    title: "Guides",
    items: [
      { title: "Overview", href: "/examples" },
      { title: "Starter Templates", href: "/examples/starter-templates" },
      { title: "Common Patterns", href: "/examples/patterns" },
      { title: "Deployment", href: "/examples/deployment" },
      { title: "Testing", href: "/examples/testing" },
    ],
  },
]

function getNavigation(pathname: string): NavSection[] {
  if (pathname.startsWith("/api-reference")) return apiNavigation
  if (pathname.startsWith("/examples")) return examplesNavigation
  return docsNavigation
}

export function DocsSidebar() {
  const pathname = usePathname()
  const navigation = getNavigation(pathname)

  return (
    <aside className="hidden w-64 shrink-0 md:block">
      <div className="sticky top-14 h-[calc(100vh-3.5rem)]">
        <ScrollArea className="h-full py-6 pr-6">
          <nav className="space-y-6">
            {navigation.map((section) => (
              <div key={section.title}>
                <h4 className="mb-2 text-sm font-semibold">{section.title}</h4>
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const hasHash = item.href.includes("#")
                    const itemPath = item.href.split("#")[0]
                    const isActive = hasHash
                      ? false
                      : pathname === itemPath
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "block rounded-md px-3 py-1.5 text-sm transition-colors",
                            isActive
                              ? "bg-muted font-medium text-foreground"
                              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                          )}
                        >
                          {item.title}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </aside>
  )
}
