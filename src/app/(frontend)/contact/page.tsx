import type { Metadata } from 'next'

export default function ContactPage() {
  return (
    <main className="container py-16 md:py-24">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-4 text-3xl font-bold text-[var(--brand-platinum)] md:text-4xl">
          Get in Touch
        </h1>
        <p className="mb-12 text-[var(--brand-muted)]">
          Have a project in mind? I&apos;d love to hear about it.
        </p>

        <div className="space-y-6">
          <a
            href="mailto:max@fetching.design"
            className="group flex items-center justify-between rounded-lg border border-[var(--brand-border)] bg-[var(--brand-card)] p-6 transition-colors hover:border-[var(--brand-clay)]"
          >
            <div>
              <p className="font-medium text-[var(--brand-platinum)]">Email</p>
              <p className="text-sm text-[var(--brand-muted)]">max@fetching.design</p>
            </div>
            <span className="text-[var(--brand-muted)] group-hover:text-[var(--brand-clay)] transition-colors">
              &rarr;
            </span>
          </a>

          <a
            href="https://github.com/mklemos"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between rounded-lg border border-[var(--brand-border)] bg-[var(--brand-card)] p-6 transition-colors hover:border-[var(--brand-clay)]"
          >
            <div>
              <p className="font-medium text-[var(--brand-platinum)]">GitHub</p>
              <p className="text-sm text-[var(--brand-muted)]">@mklemos</p>
            </div>
            <span className="text-[var(--brand-muted)] group-hover:text-[var(--brand-clay)] transition-colors">
              &rarr;
            </span>
          </a>
        </div>
      </div>
    </main>
  )
}

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Max Lemos for web application development.',
}
