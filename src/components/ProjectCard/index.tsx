import Link from 'next/link'
import type { Project } from '@/payload-types'

const categoryLabels: Record<string, string> = {
  'web-application': 'Web Application',
  'research-tool': 'Research Tool',
  wordpress: 'WordPress',
  'ai-full-stack': 'AI / Full Stack',
}

export function ProjectCard({ project }: { project: Project }) {
  const { title, slug, tagline, techStack, category } = project

  return (
    <Link
      href={`/projects/${slug}`}
      className="group block rounded-lg border border-[var(--brand-border)] bg-[var(--brand-card)] p-5 transition-colors hover:border-[var(--brand-clay)]"
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="rounded bg-[var(--brand-border)] px-2 py-0.5 text-xs text-[var(--brand-muted)]">
          {categoryLabels[category] || category}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-[var(--brand-platinum)] group-hover:text-[var(--brand-clay)] transition-colors">
        {title}
      </h3>

      {tagline && <p className="mt-1 text-sm text-[var(--brand-muted)]">{tagline}</p>}

      {techStack && techStack.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {techStack.map((item) => (
            <span
              key={item.id || item.tech}
              className="rounded-full border border-[var(--brand-border)] px-2 py-0.5 text-xs text-[var(--brand-muted)]"
            >
              {item.tech}
            </span>
          ))}
        </div>
      )}
    </Link>
  )
}
