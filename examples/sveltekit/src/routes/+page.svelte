<script lang="ts">
  let { data } = $props()

  let dark = $state(false)

  function toggleDark() {
    dark = !dark
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", dark)
    }
  }

  let mobileMenuOpen = $state(false)
</script>

<svelte:head>
  <title>RoseKit - Build Beautiful Apps Faster</title>
  <meta
    name="description"
    content="RoseKit is a modern SaaS platform built with SvelteKit, Tailwind CSS v4, and full-stack TypeScript."
  />
</svelte:head>

<!-- Header -->
<header
  class="animate-slide-down fixed top-0 right-0 left-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg"
>
  <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
    <a href="/" class="flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" class="h-8 w-8" fill="none">
        <defs>
          <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#e11d63" />
            <stop offset="100%" stop-color="#f472b6" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="8" fill="url(#logo-grad)" />
        <path
          d="M9 10 L16 6 L23 10 L23 18 L16 22 L9 18 Z"
          fill="none"
          stroke="white"
          stroke-width="1.5"
          stroke-linejoin="round"
        />
        <circle cx="16" cy="14" r="2.5" fill="white" />
      </svg>
      <span class="text-lg font-bold text-foreground">RoseKit</span>
    </a>

    <nav class="hidden items-center gap-8 md:flex">
      <a
        href="#features"
        class="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >Features</a
      >
      <a
        href="#testimonials"
        class="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >Testimonials</a
      >
      <a
        href="#pricing"
        class="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >Pricing</a
      >
    </nav>

    <div class="flex items-center gap-3">
      <button
        onclick={toggleDark}
        class="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        aria-label="Toggle dark mode"
      >
        {#if dark}
          <!-- Sun icon -->
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        {:else}
          <!-- Moon icon -->
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        {/if}
      </button>

      <!-- Mobile menu button -->
      <button
        onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
        class="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
        aria-label="Toggle menu"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          {#if mobileMenuOpen}
            <path d="M6 18L18 6M6 6l12 12" />
          {:else}
            <path d="M4 6h16M4 12h16M4 18h16" />
          {/if}
        </svg>
      </button>

      <a
        href="#pricing"
        class="hidden rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 md:inline-flex"
        >Get Started</a
      >
    </div>
  </div>

  <!-- Mobile menu -->
  {#if mobileMenuOpen}
    <div class="animate-slide-down border-t border-border bg-background px-6 py-4 md:hidden">
      <nav class="flex flex-col gap-3">
        <a href="#features" class="text-sm text-muted-foreground" onclick={() => (mobileMenuOpen = false)}>Features</a>
        <a href="#testimonials" class="text-sm text-muted-foreground" onclick={() => (mobileMenuOpen = false)}>Testimonials</a>
        <a href="#pricing" class="text-sm text-muted-foreground" onclick={() => (mobileMenuOpen = false)}>Pricing</a>
        <a href="#pricing" class="mt-2 inline-flex rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground" onclick={() => (mobileMenuOpen = false)}>Get Started</a>
      </nav>
    </div>
  {/if}
</header>

<main>
  <!-- Hero Section -->
  <section class="relative overflow-hidden pt-32 pb-20 lg:pt-44 lg:pb-32">
    <!-- Background decoration -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        class="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full opacity-20"
        style="background: radial-gradient(circle, oklch(0.65 0.22 350) 0%, transparent 70%)"
      ></div>
      <div
        class="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full opacity-15"
        style="background: radial-gradient(circle, oklch(0.55 0.2 350) 0%, transparent 70%)"
      ></div>
    </div>

    <div class="relative mx-auto max-w-7xl px-6">
      <div class="mx-auto max-w-3xl text-center">
        <div class="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
          <span class="inline-block h-2 w-2 rounded-full bg-primary"></span>
          Now in public beta
        </div>

        <h1 class="animate-slide-up text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
          Build beautiful apps
          <span
            class="bg-gradient-to-r from-primary to-pink-400 bg-clip-text text-transparent dark:from-primary dark:to-pink-300"
            >faster than ever</span
          >
        </h1>

        <p class="animate-slide-up delay-100 mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          RoseKit gives your team the tools to ship polished products at startup
          speed. Built on SvelteKit with end-to-end type safety and a beautiful
          design system.
        </p>

        <div class="animate-slide-up delay-200 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#pricing"
            class="inline-flex w-full items-center justify-center rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 sm:w-auto"
            >Start Building Free</a
          >
          <a
            href="#features"
            class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-8 py-3.5 text-base font-semibold text-foreground transition-colors hover:bg-secondary sm:w-auto"
          >
            See How It Works
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </div>

      <!-- Hero image -->
      <div class="animate-scale-in delay-300 mt-16 sm:mt-20">
        <div class="relative mx-auto max-w-5xl">
          <div
            class="absolute -inset-4 rounded-2xl opacity-50 blur-2xl"
            style="background: linear-gradient(135deg, oklch(0.65 0.22 350 / 0.15), oklch(0.55 0.2 350 / 0.1))"
          ></div>
          <img
            src="/images/hero-app.svg"
            alt="RoseKit dashboard application screenshot"
            class="relative w-full rounded-xl border border-border shadow-2xl"
          />
        </div>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section id="features" class="py-24 lg:py-32">
    <div class="mx-auto max-w-7xl px-6">
      <div class="mx-auto max-w-2xl text-center">
        <p class="text-sm font-semibold tracking-wider text-primary uppercase">Features</p>
        <h2 class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Everything you need to ship
        </h2>
        <p class="mt-4 text-lg text-muted-foreground">
          A carefully crafted toolkit so your team can focus on what matters
          most — building great products.
        </p>
      </div>

      <div class="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {#each data.features as feature, i}
          <div
            class="animate-slide-up group rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            style="animation-delay: {(i + 1) * 100}ms"
          >
            <div class="mb-5 inline-flex rounded-xl bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary/15">
              {#if feature.icon === "zap"}
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              {:else if feature.icon === "shield"}
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              {:else if feature.icon === "palette"}
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.4c3.1 0 5.6-2.5 5.6-5.6C23 6.4 18 2 12 2z" />
                  <circle cx="8" cy="10" r="1.5" fill="currentColor" />
                  <circle cx="12" cy="7" r="1.5" fill="currentColor" />
                  <circle cx="16" cy="10" r="1.5" fill="currentColor" />
                </svg>
              {/if}
            </div>

            <h3 class="text-lg font-semibold text-card-foreground">
              {feature.title}
            </h3>
            <p class="mt-2 text-sm leading-relaxed text-muted-foreground">
              {feature.description}
            </p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Testimonials Section -->
  <section id="testimonials" class="border-y border-border bg-secondary/50 py-24 lg:py-32">
    <div class="mx-auto max-w-7xl px-6">
      <div class="mx-auto max-w-2xl text-center">
        <p class="text-sm font-semibold tracking-wider text-primary uppercase">
          Testimonials
        </p>
        <h2 class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Loved by developers
        </h2>
        <p class="mt-4 text-lg text-muted-foreground">
          Hear from the teams already building with RoseKit.
        </p>
      </div>

      <div class="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {#each data.testimonials as testimonial, i}
          <div
            class="animate-slide-up rounded-2xl border border-border bg-card p-8"
            style="animation-delay: {(i + 1) * 100}ms"
          >
            <!-- Stars -->
            <div class="mb-4 flex gap-1 text-primary">
              {#each Array(5) as _}
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              {/each}
            </div>

            <blockquote class="text-sm leading-relaxed text-card-foreground">
              "{testimonial.quote}"
            </blockquote>

            <div class="mt-6 flex items-center gap-3">
              <img
                src={testimonial.avatar}
                alt="Avatar of {testimonial.name}"
                class="h-10 w-10 rounded-full"
              />
              <div>
                <p class="text-sm font-semibold text-card-foreground">
                  {testimonial.name}
                </p>
                <p class="text-xs text-muted-foreground">
                  {testimonial.role}
                </p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Pricing Section -->
  <section id="pricing" class="py-24 lg:py-32">
    <div class="mx-auto max-w-7xl px-6">
      <div class="mx-auto max-w-2xl text-center">
        <p class="text-sm font-semibold tracking-wider text-primary uppercase">
          Pricing
        </p>
        <h2 class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Simple, transparent pricing
        </h2>
        <p class="mt-4 text-lg text-muted-foreground">
          Start free, scale when you're ready. No hidden fees.
        </p>
      </div>

      <div class="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-3">
        {#each data.pricing as plan, i}
          <div
            class="animate-slide-up relative flex flex-col rounded-2xl border bg-card p-8 {plan.highlighted
              ? 'border-primary shadow-xl shadow-primary/10'
              : 'border-border'}"
            style="animation-delay: {(i + 1) * 100}ms"
          >
            {#if plan.highlighted}
              <div class="absolute -top-3.5 right-6 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                Most Popular
              </div>
            {/if}

            <div class="mb-6">
              <h3 class="text-lg font-semibold text-card-foreground">
                {plan.name}
              </h3>
              <p class="mt-1 text-sm text-muted-foreground">
                {plan.description}
              </p>
            </div>

            <div class="mb-8">
              <span class="text-4xl font-extrabold text-card-foreground">{plan.price}</span>
              <span class="ml-1 text-sm text-muted-foreground">/{plan.period}</span>
            </div>

            <ul class="mb-8 flex-1 space-y-3">
              {#each plan.features as feat}
                <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <svg class="mt-0.5 h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {feat}
                </li>
              {/each}
            </ul>

            <a
              href="#"
              class="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-all {plan.highlighted
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30'
                : 'border border-border bg-secondary text-secondary-foreground hover:bg-accent'}"
            >
              {plan.cta}
            </a>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="border-t border-border py-24 lg:py-32">
    <div class="mx-auto max-w-7xl px-6">
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-pink-400 px-8 py-16 text-center sm:px-16 dark:from-primary dark:to-pink-500">
        <!-- Decorative shapes -->
        <div class="pointer-events-none absolute inset-0 overflow-hidden">
          <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-white/10"></div>
          <div class="absolute -right-8 -bottom-8 h-56 w-56 rounded-full bg-white/5"></div>
          <div class="absolute top-1/2 left-1/3 h-24 w-24 rounded-full bg-white/5"></div>
        </div>

        <div class="relative">
          <h2 class="text-3xl font-bold text-white sm:text-4xl">
            Ready to build something amazing?
          </h2>
          <p class="mx-auto mt-4 max-w-xl text-lg text-white/80">
            Join thousands of developers who ship faster with RoseKit. Start
            your free trial today — no credit card required.
          </p>
          <div class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#"
              class="inline-flex w-full items-center justify-center rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-primary shadow-lg transition-all hover:bg-white/95 sm:w-auto"
              >Start Free Trial</a
            >
            <a
              href="#"
              class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/30 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
            >
              Talk to Sales
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>

<!-- Footer -->
<footer class="border-t border-border py-12">
  <div class="mx-auto max-w-7xl px-6">
    <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <a href="/" class="flex items-center gap-2">
          <svg viewBox="0 0 32 32" class="h-7 w-7" fill="none">
            <defs>
              <linearGradient id="flogo" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#e11d63" />
                <stop offset="100%" stop-color="#f472b6" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="8" fill="url(#flogo)" />
            <path
              d="M9 10 L16 6 L23 10 L23 18 L16 22 L9 18 Z"
              fill="none"
              stroke="white"
              stroke-width="1.5"
              stroke-linejoin="round"
            />
            <circle cx="16" cy="14" r="2.5" fill="white" />
          </svg>
          <span class="text-base font-bold text-foreground">RoseKit</span>
        </a>
        <p class="mt-3 text-sm text-muted-foreground">
          Build beautiful, performant web applications with modern tools and
          best practices.
        </p>
      </div>

      <div>
        <h4 class="text-sm font-semibold text-foreground">Product</h4>
        <ul class="mt-3 space-y-2">
          <li><a href="#features" class="text-sm text-muted-foreground hover:text-foreground">Features</a></li>
          <li><a href="#pricing" class="text-sm text-muted-foreground hover:text-foreground">Pricing</a></li>
          <li><a href="#" class="text-sm text-muted-foreground hover:text-foreground">Changelog</a></li>
          <li><a href="#" class="text-sm text-muted-foreground hover:text-foreground">Documentation</a></li>
        </ul>
      </div>

      <div>
        <h4 class="text-sm font-semibold text-foreground">Company</h4>
        <ul class="mt-3 space-y-2">
          <li><a href="#" class="text-sm text-muted-foreground hover:text-foreground">About</a></li>
          <li><a href="#" class="text-sm text-muted-foreground hover:text-foreground">Blog</a></li>
          <li><a href="#" class="text-sm text-muted-foreground hover:text-foreground">Careers</a></li>
          <li><a href="#" class="text-sm text-muted-foreground hover:text-foreground">Contact</a></li>
        </ul>
      </div>

      <div>
        <h4 class="text-sm font-semibold text-foreground">Legal</h4>
        <ul class="mt-3 space-y-2">
          <li><a href="#" class="text-sm text-muted-foreground hover:text-foreground">Privacy</a></li>
          <li><a href="#" class="text-sm text-muted-foreground hover:text-foreground">Terms</a></li>
          <li><a href="#" class="text-sm text-muted-foreground hover:text-foreground">Cookies</a></li>
        </ul>
      </div>
    </div>

    <div class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
      <p class="text-sm text-muted-foreground">
        &copy; 2026 RoseKit. All rights reserved.
      </p>
      <div class="flex gap-4">
        <!-- GitHub -->
        <a href="#" class="text-muted-foreground transition-colors hover:text-foreground" aria-label="GitHub">
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>
        <!-- X / Twitter -->
        <a href="#" class="text-muted-foreground transition-colors hover:text-foreground" aria-label="X">
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
      </div>
    </div>
  </div>
</footer>
