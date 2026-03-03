"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Github } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

const navLinks = [
  { title: "Docs", href: "/docs" },
  { title: "API", href: "/api-reference" },
  { title: "Examples", href: "/examples" },
]

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <BookOpen className="h-5 w-5" />
          <span className="font-bold">YourProject</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-foreground",
                  isActive
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                )}
              >
                {link.title}
              </Link>
            )
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://github.com/your-org/your-project"
              target="_blank"
              rel="noreferrer"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>
          <ThemeToggle />
          <Button size="sm" className="ml-2 hidden sm:inline-flex" asChild>
            <Link href="/docs">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
