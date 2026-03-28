import { useState, useEffect } from "react"
import {
  ArrowRight,
  Code2,
  Moon,
  Sun,
  Zap,
  Blocks,
  ShieldCheck,
  ExternalLink,
  Heart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import reactLogo from "@/assets/react.svg"
import typescriptLogo from "@/assets/typescript.svg"

// ── Theme toggle ──

function useTheme() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark")
    }
    return false
  })

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [dark])

  return { dark, toggle: () => setDark((d) => !d) }
}

// ── Header ──

function Header({ dark, toggle }: { dark: boolean; toggle: () => void }) {
  return (
    <header className="glass sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#" className="flex items-center gap-2 font-bold text-lg">
          <img src="/vite.svg" alt="Vite" className="size-7" />
          <span className="hidden sm:inline">Vite + React</span>
        </a>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#showcase" className="hover:text-foreground transition-colors">
            Showcase
          </a>
          <a href="#stack" className="hover:text-foreground transition-colors">
            Stack
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a
              href="https://github.com/vitejs/vite"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Code2 className="size-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}

// ── Hero ──

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="bg-grid-pattern pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-purple-500/20 via-cyan-500/10 to-transparent blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-24 sm:px-6 sm:pt-32 lg:pt-40">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Text */}
          <div className="flex flex-col items-start gap-6">
            <Badge variant="secondary" className="animate-fade-in gap-1.5">
              <Zap className="size-3" />
              Vite + React + shadcn/ui
            </Badge>

            <h1 className="animate-fade-in-up text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Build{" "}
              <span className="bg-gradient-to-r from-purple-600 via-cyan-500 to-orange-400 bg-clip-text text-transparent animate-hero-gradient">
                beautiful
              </span>{" "}
              apps at lightning speed
            </h1>

            <p className="animate-fade-in-up delay-200 max-w-lg text-lg text-muted-foreground">
              A modern starter template combining Vite's blazing-fast HMR with
              React, Tailwind CSS v4, and shadcn/ui components. Production-ready
              from day one.
            </p>

            <div className="animate-fade-in-up delay-300 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <a href="#features">
                  Explore Features
                  <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a
                  href="https://vite.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Documentation
                  <ExternalLink className="size-4" />
                </a>
              </Button>
            </div>

            {/* Tech logos row */}
            <div className="animate-fade-in-up delay-400 flex items-center gap-4 pt-2">
              <span className="text-xs text-muted-foreground">Powered by</span>
              <div className="flex items-center gap-3">
                <img
                  src={reactLogo}
                  alt="React"
                  className="size-7 animate-spin-slow"
                />
                <img src={typescriptLogo} alt="TypeScript" className="size-7 rounded" />
                <img src="/vite.svg" alt="Vite" className="size-7" />
              </div>
            </div>
          </div>

          {/* Illustration */}
          <div className="animate-fade-in-up delay-300 flex items-center justify-center lg:justify-end">
            <div className="relative">
              <div className="animate-pulse-glow absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 via-cyan-500/10 to-orange-400/10 blur-2xl" />
              <img
                src="/images/hero-illustration.svg"
                alt="Hero illustration"
                className="animate-float relative z-10 w-full max-w-[400px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Features ──

const features = [
  {
    icon: Zap,
    image: "/images/feature-1.svg",
    title: "Lightning Fast HMR",
    description:
      "Vite's native ES module dev server delivers instant hot module replacement. See your changes reflected in the browser before you can blink.",
  },
  {
    icon: Blocks,
    image: "/images/feature-2.svg",
    title: "Beautiful Components",
    description:
      "Pre-built, accessible UI components from shadcn/ui styled with Tailwind CSS v4. Customizable, composable, and ready for production.",
  },
  {
    icon: ShieldCheck,
    image: "/images/feature-3.svg",
    title: "Type-Safe by Default",
    description:
      "Full TypeScript support with strict mode, path aliases, and seamless IDE integration. Catch bugs before they ship.",
  },
]

function Features() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="animate-fade-in text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to build faster
          </h2>
          <p className="animate-fade-in delay-100 mt-4 text-muted-foreground">
            A thoughtfully curated stack so you can focus on what matters:
            building great products.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Card
              key={f.title}
              className={`animate-fade-in-up gradient-border group transition-shadow hover:shadow-lg delay-${(i + 1) * 100}`}
            >
              <CardHeader>
                <div className="mb-3 flex items-center gap-3">
                  <img
                    src={f.image}
                    alt={f.title}
                    className="size-12 transition-transform group-hover:scale-110"
                  />
                  <f.icon className="size-5 text-muted-foreground" />
                </div>
                <CardTitle className="text-lg">{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {f.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Showcase / Gallery ──

function Showcase() {
  return (
    <section id="showcase" className="bg-muted/40 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="animate-fade-in text-3xl font-bold tracking-tight sm:text-4xl">
            Asset Handling Showcase
          </h2>
          <p className="animate-fade-in delay-100 mt-4 text-muted-foreground">
            Vite handles static assets from both the{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">
              public/
            </code>{" "}
            directory and{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">
              src/assets/
            </code>{" "}
            imports seamlessly.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Public dir images */}
          <Card className="animate-fade-in-up group overflow-hidden">
            <div className="flex h-40 items-center justify-center bg-gradient-to-br from-purple-500/5 to-cyan-500/5 transition-colors group-hover:from-purple-500/10 group-hover:to-cyan-500/10">
              <img
                src="/images/hero-illustration.svg"
                alt="Hero illustration"
                className="h-32 w-auto transition-transform group-hover:scale-105"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Public Directory
              </CardTitle>
              <CardDescription className="font-mono text-xs">
                /images/hero-illustration.svg
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Src asset import */}
          <Card className="animate-fade-in-up delay-100 group overflow-hidden">
            <div className="flex h-40 items-center justify-center gap-6 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 transition-colors group-hover:from-cyan-500/10 group-hover:to-blue-500/10">
              <img
                src={reactLogo}
                alt="React logo"
                className="h-20 w-auto animate-spin-slow"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Imported Asset
              </CardTitle>
              <CardDescription className="font-mono text-xs">
                import reactLogo from "@/assets/react.svg"
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Another src import */}
          <Card className="animate-fade-in-up delay-200 group overflow-hidden">
            <div className="flex h-40 items-center justify-center bg-gradient-to-br from-blue-500/5 to-orange-500/5 transition-colors group-hover:from-blue-500/10 group-hover:to-orange-500/10">
              <img
                src={typescriptLogo}
                alt="TypeScript logo"
                className="h-20 w-auto rounded-lg transition-transform group-hover:scale-105"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Imported Asset
              </CardTitle>
              <CardDescription className="font-mono text-xs">
                import tsLogo from "@/assets/typescript.svg"
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature SVGs from public */}
          {[1, 2, 3].map((n) => (
            <Card
              key={n}
              className={`animate-fade-in-up delay-${(n + 2) * 100} group overflow-hidden`}
            >
              <div className="flex h-40 items-center justify-center bg-gradient-to-br from-muted/50 to-muted transition-colors group-hover:from-muted group-hover:to-accent">
                <img
                  src={`/images/feature-${n}.svg`}
                  alt={`Feature ${n} icon`}
                  className="h-16 w-auto transition-transform group-hover:scale-110"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Public Directory
                </CardTitle>
                <CardDescription className="font-mono text-xs">
                  /images/feature-{n}.svg
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Tech Stack ──

const techStack = [
  { name: "Vite", url: "https://vite.dev" },
  { name: "React 19", url: "https://react.dev" },
  { name: "TypeScript", url: "https://www.typescriptlang.org" },
  { name: "Tailwind CSS v4", url: "https://tailwindcss.com" },
  { name: "shadcn/ui", url: "https://ui.shadcn.com" },
  { name: "Radix UI", url: "https://www.radix-ui.com" },
  { name: "Lucide Icons", url: "https://lucide.dev" },
  { name: "CVA", url: "https://cva.style" },
]

function TechStack() {
  return (
    <section id="stack" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="animate-fade-in text-3xl font-bold tracking-tight sm:text-4xl">
            The Modern Stack
          </h2>
          <p className="animate-fade-in delay-100 mt-4 text-muted-foreground">
            Every tool in this template was chosen for developer experience,
            performance, and production readiness.
          </p>
        </div>

        <div className="animate-fade-in-up delay-200 flex flex-wrap items-center justify-center gap-3">
          {techStack.map((tech) => (
            <a
              key={tech.name}
              href={tech.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Badge
                variant="outline"
                className="cursor-pointer px-4 py-2 text-sm transition-colors hover:bg-accent"
              >
                {tech.name}
              </Badge>
            </a>
          ))}
        </div>

        <div className="mt-12 rounded-xl border bg-card p-6 sm:p-8">
          <h3 className="mb-4 text-lg font-semibold">Quick Start</h3>
          <div className="space-y-2 font-mono text-sm text-muted-foreground">
            <p>
              <span className="text-foreground">$</span> bun install
            </p>
            <p>
              <span className="text-foreground">$</span> bun run dev
            </p>
          </div>
          <Separator className="my-5" />
          <h3 className="mb-4 text-lg font-semibold">Production Build</h3>
          <div className="space-y-2 font-mono text-sm text-muted-foreground">
            <p>
              <span className="text-foreground">$</span> bun run build
            </p>
            <p>
              <span className="text-foreground">$</span> bun run preview
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Footer ──

function Footer() {
  return (
    <footer className="border-t py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 sm:flex-row sm:justify-between sm:px-6">
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          Built with <Heart className="size-3.5 fill-red-500 text-red-500" />{" "}
          using Vite, React &amp; shadcn/ui
        </p>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <a
            href="https://vite.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Vite
          </a>
          <a
            href="https://react.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            React
          </a>
          <a
            href="https://ui.shadcn.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            shadcn/ui
          </a>
          <a
            href="https://tailwindcss.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Tailwind
          </a>
        </div>
      </div>
    </footer>
  )
}

// ── App ──

export default function App() {
  const { dark, toggle } = useTheme()

  return (
    <div className="min-h-screen">
      <Header dark={dark} toggle={toggle} />
      <main>
        <Hero />
        <Features />
        <Showcase />
        <TechStack />
      </main>
      <Footer />
    </div>
  )
}
