"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

interface NavItem {
  title: string
  href: string
  items?: NavItem[]
}

const navigation: { title: string; items: NavItem[] }[] = [
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
      { title: "Client", href: "/docs/api-reference#client" },
      { title: "Authentication", href: "/docs/api-reference#auth" },
      { title: "Error Handling", href: "/docs/api-reference#errors" },
      { title: "Streaming", href: "/docs/api-reference#streaming" },
    ],
  },
  {
    title: "API Reference",
    items: [
      { title: "Overview", href: "/docs/api-reference" },
      { title: "Users", href: "/docs/api-reference#users" },
      { title: "Events", href: "/docs/api-reference#events" },
      { title: "Storage", href: "/docs/api-reference#storage" },
      { title: "Plugins", href: "/docs/api-reference#plugins" },
    ],
  },
  {
    title: "Guides",
    items: [
      { title: "Examples", href: "/docs/examples" },
      { title: "Deployment", href: "/docs/examples#deployment" },
      { title: "Testing", href: "/docs/examples#testing" },
      { title: "Migration Guide", href: "/docs/examples#migration" },
    ],
  },
]

export function DocsSidebar() {
  const pathname = usePathname()

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
                    const isActive = pathname === item.href || 
                      (item.href !== "/docs" && pathname.startsWith(item.href.split("#")[0]) && item.href.split("#")[0] === pathname)
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
