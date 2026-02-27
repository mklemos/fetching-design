import type { Metadata } from 'next'

export default function AboutPage() {
  return (
    <main className="container py-16 md:py-24">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold text-[var(--brand-platinum)] md:text-4xl">About</h1>

        <div className="space-y-6 text-[var(--brand-muted)] leading-relaxed">
          <p>
            I&apos;m Max Lemos, a full-stack developer specializing in custom web applications. I
            work with modern tools like Next.js, TypeScript, and PostgreSQL to build software that
            solves real problems.
          </p>

          <p>
            fetching.design is my portfolio and development studio. I take projects from concept
            through deployment, handling everything from database architecture to frontend polish.
          </p>

          <p>
            When I&apos;m not writing code, I&apos;m probably reading about distributed systems,
            tinkering with AI tooling, or exploring the Santa Barbara coastline.
          </p>
        </div>

        <div className="mt-12 rounded-lg border border-[var(--brand-border)] bg-[var(--brand-card)] p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[var(--brand-muted)]">
            Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              'TypeScript',
              'Python',
              'Go',
              'React',
              'Next.js',
              'FastAPI',
              'Node.js',
              'PostgreSQL',
              'Redis',
              'Docker',
              'Nginx',
              'AWS',
              'Tailwind CSS',
              'Playwright',
              'GraphQL',
              'Payload CMS',
              'WordPress',
              'scikit-learn',
            ].map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-[var(--brand-border)] px-3 py-1 text-xs text-[var(--brand-muted)]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

export const metadata: Metadata = {
  title: 'About',
  description: 'About Max Lemos, full-stack developer at fetching.design.',
}
