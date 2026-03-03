import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy",
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-4 text-muted-foreground">
        Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
      </p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground">1. Information We Collect</h2>
          <p className="mt-3">
            YourProject collects minimal information necessary to provide our services.
            This may include usage analytics, error reports, and information you provide
            when contacting support.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">2. How We Use Your Information</h2>
          <p className="mt-3">
            We use collected information to improve our services, fix bugs, and provide
            support. We do not sell your personal information to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">3. Data Storage</h2>
          <p className="mt-3">
            Your data is stored securely using industry-standard encryption. We retain
            data only as long as necessary to provide our services.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">4. Third-Party Services</h2>
          <p className="mt-3">
            We may use third-party services for analytics and error tracking. These
            services have their own privacy policies governing the use of your information.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">5. Contact</h2>
          <p className="mt-3">
            If you have questions about this privacy policy, please open an issue on our{" "}
            <a
              href="https://github.com/your-org/your-project"
              className="text-foreground underline underline-offset-4 hover:text-foreground/80"
            >
              GitHub repository
            </a>.
          </p>
        </section>
      </div>
    </div>
  )
}
