import { useState, useEffect } from "react"
import {
  Sun,
  Moon,
  ArrowRight,
  Github,
  Zap,
  Package,
  Timer,
  ExternalLink,
  Layers,
  Flame,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import rsbuildLogo from "@/assets/rsbuild-logo.svg"
import reactLogo from "@/assets/react.svg"

function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches
    setDark(prefersDark)
    if (prefersDark) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  function toggle() {
    setDark((prev) => {
      const next = !prev
      if (next) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
      return next
    })
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
      {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </Button>
  )
}

const showcaseItems = [
  {
    image: "/images/showcase-1.svg",
    title: "Analytics Dashboard",
    description:
      "Real-time metrics with interactive charts, built with blazing-fast HMR and optimized bundles.",
    tags: ["Dashboard", "Charts"],
  },
  {
    image: "/images/showcase-2.svg",
    title: "Mobile Experience",
    description:
      "Responsive mobile-first design with touch-optimized components and smooth transitions.",
    tags: ["Mobile", "Responsive"],
  },
  {
    image: "/images/showcase-3.svg",
    title: "Developer Tools",
    description:
      "Rich code editing experience with syntax highlighting and intelligent autocompletion.",
    tags: ["Editor", "DX"],
  },
]

const stats = [
  { value: "200ms", label: "Dev startup", icon: Timer },
  { value: "~80KB", label: "Bundle size", icon: Package },
  { value: "10x", label: "Faster builds", icon: Zap },
  { value: "100%", label: "Type-safe", icon: Layers },
]

const techStack = [
  "Rsbuild",
  "React 19",
  "Rspack",
  "TypeScript",
  "Tailwind CSS v4",
  "shadcn/ui",
  "Radix UI",
  "Lucide Icons",
]

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={rsbuildLogo} alt="Rsbuild" className="size-8" />
            <span className="text-lg font-bold tracking-tight">
              Rsbuild<span className="text-orange-500">Studio</span>
            </span>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <a
              href="#showcase"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Showcase
            </a>
            <a
              href="#stats"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Performance
            </a>
            <a
              href="#tech"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Tech Stack
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" asChild>
              <a
                href="https://github.com/nicepkg/temps"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="size-4" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background pattern */}
        <div className="pointer-events-none absolute inset-0">
          <img
            src="/images/hero-pattern.svg"
            alt=""
            className="h-full w-full object-cover opacity-60 dark:opacity-30"
          />
        </div>
        {/* Warm glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 size-[600px] -translate-x-1/2 rounded-full bg-gradient-to-br from-orange-400/20 via-amber-300/10 to-transparent blur-3xl animate-glow-pulse" />

        <div className="container relative flex flex-col items-center gap-8 pb-20 pt-24 text-center md:pt-32 md:pb-28">
          {/* Logos */}
          <div className="flex items-center gap-4 animate-fade-up">
            <img
              src={rsbuildLogo}
              alt="Rsbuild"
              className="size-14 drop-shadow-lg animate-float"
            />
            <span className="text-3xl font-light text-muted-foreground">+</span>
            <img
              src={reactLogo}
              alt="React"
              className="size-14 drop-shadow-lg animate-float"
              style={{ animationDelay: "1s" }}
            />
          </div>

          <Badge
            variant="secondary"
            className="animate-fade-up border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950/50 dark:text-orange-300"
            style={{ animationDelay: "0.1s" }}
          >
            <Flame className="size-3" />
            Powered by Rsbuild
          </Badge>

          <h1
            className="animate-fade-up text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ animationDelay: "0.2s" }}
          >
            Build at the
            <br />
            <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-red-500 bg-clip-text text-transparent dark:from-orange-400 dark:via-amber-300 dark:to-red-400">
              Speed of Rust
            </span>
          </h1>

          <p
            className="animate-fade-up max-w-2xl text-lg text-muted-foreground md:text-xl"
            style={{ animationDelay: "0.3s" }}
          >
            A showcase built with Rsbuild, React 19, Tailwind CSS v4, and
            shadcn/ui. Experience blazing-fast builds powered by Rspack with
            beautiful, accessible components.
          </p>

          <div
            className="animate-fade-up flex flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "0.4s" }}
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-lg shadow-orange-500/25 hover:from-orange-500 hover:to-amber-400 dark:shadow-orange-900/30"
            >
              Get Started
              <ArrowRight className="size-4" />
            </Button>
            <Button variant="outline" size="lg">
              <ExternalLink className="size-4" />
              Documentation
            </Button>
          </div>
        </div>
      </section>

      <Separator />

      {/* Showcase / Gallery Section */}
      <section id="showcase" className="py-20 md:py-28">
        <div className="container">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">
              <Eye className="size-3" />
              Showcase
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Built for{" "}
              <span className="text-orange-500 dark:text-orange-400">
                Every Screen
              </span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              From dashboards to mobile apps to developer tools — Rsbuild
              delivers production-ready bundles for any use case.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {showcaseItems.map((item, i) => (
              <Card
                key={item.title}
                className="group animate-scale-in overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/5 dark:hover:shadow-orange-900/10"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="overflow-hidden border-b">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="group/btn text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
                  >
                    View Project
                    <ArrowRight className="size-3 transition-transform group-hover/btn:translate-x-0.5" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        id="stats"
        className="border-y bg-gradient-to-br from-orange-50/50 via-background to-amber-50/50 py-20 dark:from-orange-950/10 dark:to-amber-950/10 md:py-28"
      >
        <div className="container">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">
              <Zap className="size-3" />
              Performance
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Unmatched{" "}
              <span className="text-orange-500 dark:text-orange-400">
                Build Speed
              </span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Rspack-powered builds that make waiting a thing of the past.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="animate-fade-up flex flex-col items-center gap-3 rounded-xl border bg-card p-6 text-center shadow-sm transition-all duration-300 hover:shadow-md"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30">
                    <Icon className="size-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech" className="py-20 md:py-28">
        <div className="container">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">
              <Layers className="size-3" />
              Stack
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Modern{" "}
              <span className="text-orange-500 dark:text-orange-400">
                Tech Stack
              </span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Every tool carefully chosen for developer experience and production
              performance.
            </p>
          </div>

          <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-3">
            {techStack.map((tech, i) => (
              <Badge
                key={tech}
                variant="outline"
                className="animate-scale-in px-4 py-2 text-sm transition-all duration-200 hover:border-orange-300 hover:bg-orange-50 dark:hover:border-orange-700 dark:hover:bg-orange-950/30"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {tech}
              </Badge>
            ))}
          </div>

          <div className="mx-auto mt-12 max-w-xl rounded-xl border bg-card p-6 shadow-sm">
            <p className="text-center text-sm text-muted-foreground">
              This example demonstrates static asset handling in Rsbuild. SVGs in{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                public/
              </code>{" "}
              are served as-is, while assets in{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                src/assets/
              </code>{" "}
              are processed and hashed by the bundler for optimal caching.
            </p>
          </div>
        </div>
      </section>

      <Separator />

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <img src={rsbuildLogo} alt="Rsbuild" className="size-6" />
              <span className="text-sm font-semibold">
                Rsbuild<span className="text-orange-500">Studio</span>
              </span>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <a
                href="https://rsbuild.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
              >
                Rsbuild Docs
              </a>
              <a
                href="https://react.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
              >
                React
              </a>
              <a
                href="https://tailwindcss.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
              >
                Tailwind CSS
              </a>
              <a
                href="https://ui.shadcn.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
              >
                shadcn/ui
              </a>
            </nav>
            <p className="text-xs text-muted-foreground">
              Built with Rsbuild + React + Tailwind v4
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
