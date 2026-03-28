export function load() {
  return {
    features: [
      {
        title: "Lightning Fast",
        description:
          "Built with SvelteKit for blazing performance and minimal JavaScript overhead.",
        icon: "zap",
      },
      {
        title: "Type Safe",
        description:
          "End-to-end TypeScript for confidence at scale with full editor support.",
        icon: "shield",
      },
      {
        title: "Beautiful UI",
        description:
          "Tailwind CSS v4 with a curated design system and oklch color palette.",
        icon: "palette",
      },
    ],
    testimonials: [
      {
        name: "Alex Rivera",
        role: "Frontend Lead",
        quote:
          "SvelteKit changed how we build web apps. The developer experience is truly incredible.",
        avatar: "/images/avatar-1.svg",
      },
      {
        name: "Sam Chen",
        role: "CTO at Launchpad",
        quote:
          "We shipped our MVP 3x faster using this stack. The SSR performance is unmatched.",
        avatar: "/images/avatar-2.svg",
      },
      {
        name: "Jordan Park",
        role: "Design Engineer",
        quote:
          "The styling system is clean and easy to maintain. Our design velocity doubled.",
        avatar: "/images/avatar-3.svg",
      },
    ],
    pricing: [
      {
        name: "Starter",
        price: "$0",
        period: "forever",
        description: "Perfect for side projects and experiments.",
        features: [
          "Up to 3 projects",
          "Community support",
          "Basic analytics",
          "1 GB storage",
        ],
        cta: "Get Started",
        highlighted: false,
      },
      {
        name: "Pro",
        price: "$29",
        period: "per month",
        description: "For growing teams shipping real products.",
        features: [
          "Unlimited projects",
          "Priority support",
          "Advanced analytics",
          "100 GB storage",
          "Custom domains",
          "Team collaboration",
        ],
        cta: "Start Free Trial",
        highlighted: true,
      },
      {
        name: "Enterprise",
        price: "$99",
        period: "per month",
        description: "For organizations that need control and scale.",
        features: [
          "Everything in Pro",
          "SSO & SAML",
          "Audit logs",
          "Unlimited storage",
          "Dedicated support",
          "SLA guarantee",
        ],
        cta: "Contact Sales",
        highlighted: false,
      },
    ],
  }
}
