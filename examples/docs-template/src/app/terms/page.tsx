import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service",
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
      <p className="mt-4 text-muted-foreground">
        Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
      </p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p className="mt-3">
            By using YourProject, you agree to these terms. If you do not agree,
            please do not use our software or services.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">2. Use License</h2>
          <p className="mt-3">
            YourProject is released under the MIT License. You are free to use, modify,
            and distribute the software in accordance with the license terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">3. Disclaimer</h2>
          <p className="mt-3">
            The software is provided &ldquo;as is&rdquo;, without warranty of any kind,
            express or implied. In no event shall the authors be liable for any claim,
            damages, or other liability.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">4. Modifications</h2>
          <p className="mt-3">
            We reserve the right to modify these terms at any time. Changes will be
            posted on this page with an updated revision date.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">5. Contact</h2>
          <p className="mt-3">
            Questions about these terms? Open an issue on our{" "}
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
