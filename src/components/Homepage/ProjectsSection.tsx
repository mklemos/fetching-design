import Link from 'next/link'
import type { Project } from '@/payload-types'
import { ProjectCard } from '@/components/ProjectCard'

export function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section className="container py-16">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--brand-muted)]">
          PROJECTS
        </h2>
        <Link
          href="/projects"
          className="text-xs text-[var(--brand-muted)] hover:text-[var(--brand-clay)] transition-colors"
        >
          View All &rarr;
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}
