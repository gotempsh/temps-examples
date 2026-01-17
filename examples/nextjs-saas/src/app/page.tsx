import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import {
  Shield,
  CreditCard,
  Database,
  Mail,
  BarChart3,
  AlertTriangle,
  ArrowRight,
  Check,
  Zap,
  Globe,
  Lock,
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />

          <div className="container flex flex-col items-center justify-center gap-8 py-24 text-center md:py-32 lg:py-40">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/50 backdrop-blur-sm px-4 py-1.5 text-sm font-medium">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span>Ship faster with Temps</span>
            </div>

            <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Build your SaaS
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                in record time
              </span>
            </h1>

            <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
              A production-ready Next.js boilerplate with authentication, payments,
              database, email, and everything you need to launch your SaaS.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gap-2 text-base px-8" asChild>
                <Link href="/register">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8" asChild>
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>

            {/* Social proof */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="hidden sm:block h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>14-day free trial</span>
              </div>
              <div className="hidden sm:block h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t bg-muted/30">
          <div className="container py-24 lg:py-32">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Everything you need to launch
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Stop reinventing the wheel. Start with a solid foundation that includes
                all the essential features your SaaS needs.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<Shield className="h-6 w-6" />}
                title="Authentication"
                description="Email/password and OAuth login with better-auth. Secure session management, password reset, and email verification."
                gradient="from-blue-500 to-cyan-500"
              />
              <FeatureCard
                icon={<CreditCard className="h-6 w-6" />}
                title="Payments"
                description="Stripe integration for subscriptions and one-time purchases. Webhooks, customer portal, and invoice management."
                gradient="from-purple-500 to-pink-500"
              />
              <FeatureCard
                icon={<Database className="h-6 w-6" />}
                title="Database"
                description="PostgreSQL with Drizzle ORM. Type-safe queries, automatic migrations, and a beautiful studio UI."
                gradient="from-orange-500 to-red-500"
              />
              <FeatureCard
                icon={<Mail className="h-6 w-6" />}
                title="Transactional Email"
                description="Send beautiful emails with Temps SDK. Welcome emails, receipts, password resets, and custom templates."
                gradient="from-green-500 to-emerald-500"
              />
              <FeatureCard
                icon={<BarChart3 className="h-6 w-6" />}
                title="Analytics"
                description="Built-in analytics with Temps. Track events, page views, conversions, and user behavior."
                gradient="from-yellow-500 to-orange-500"
              />
              <FeatureCard
                icon={<AlertTriangle className="h-6 w-6" />}
                title="Error Monitoring"
                description="Sentry integration for error tracking. Know when things break before your users do."
                gradient="from-red-500 to-rose-500"
              />
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="border-t">
          <div className="container py-24 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                  Focus on what makes your product unique
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Stop spending weeks on boilerplate code. Our template handles the boring stuff
                  so you can focus on building features that matter to your users.
                </p>

                <ul className="space-y-4">
                  <BenefitItem
                    icon={<Zap className="h-5 w-5" />}
                    title="Launch in days, not months"
                    description="Everything is pre-configured and ready to go. Just add your business logic."
                  />
                  <BenefitItem
                    icon={<Lock className="h-5 w-5" />}
                    title="Production-ready security"
                    description="Authentication, rate limiting, and secure defaults built-in."
                  />
                  <BenefitItem
                    icon={<Globe className="h-5 w-5" />}
                    title="Scale with confidence"
                    description="Built on proven technologies that power millions of applications."
                  />
                </ul>
              </div>

              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 dark:from-purple-950/50 dark:via-pink-950/50 dark:to-blue-950/50 p-8 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                    <StatCard value="10x" label="Faster launch" />
                    <StatCard value="$0" label="Upfront cost" />
                    <StatCard value="100%" label="Customizable" />
                    <StatCard value="24/7" label="Community support" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t bg-muted/30">
          <div className="container py-24 lg:py-32">
            <div className="relative rounded-3xl bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 p-px">
              <div className="rounded-[calc(1.5rem-1px)] bg-background p-8 md:p-12 lg:p-16 text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                  Ready to ship your SaaS?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                  Join thousands of developers who have already launched their products
                  with our battle-tested boilerplate.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="gap-2 text-base px-8" asChild>
                    <Link href="/register">
                      Start Building Today
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="text-base px-8" asChild>
                    <Link href="https://github.com" target="_blank">
                      View on GitHub
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl">YourSaaS</span>
            </div>
            <nav className="flex flex-wrap justify-center gap-6">
              <Link
                href="/pricing"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/docs"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Docs
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms
              </Link>
            </nav>
            <p className="text-sm text-muted-foreground">
              Built with Next.js, Tailwind CSS, and Temps
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  gradient,
}: {
  icon: React.ReactNode
  title: string
  description: string
  gradient: string
}) {
  return (
    <div className="group relative rounded-2xl border bg-background p-6 transition-all hover:shadow-lg hover:shadow-purple-500/5 hover:border-purple-500/20">
      <div className={`inline-flex rounded-xl bg-gradient-to-br ${gradient} p-3 text-white mb-4`}>
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}

function BenefitItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <li className="flex gap-4">
      <div className="flex-shrink-0 rounded-lg bg-primary/10 p-2 text-primary">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </li>
  )
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-background/80 backdrop-blur-sm border p-6 text-center">
      <div className="text-3xl font-bold bg-gradient-to-br from-purple-600 to-pink-600 bg-clip-text text-transparent">
        {value}
      </div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  )
}
