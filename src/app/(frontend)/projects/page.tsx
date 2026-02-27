import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { ProjectCard } from '@/components/ProjectCard'

export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'projects',
    sort: 'sortOrder',
    limit: 50,
    overrideAccess: false,
  })

  return (
    <main className="container py-16 md:py-24">
      <h1 className="mb-2 text-3xl font-bold text-[var(--brand-platinum)] md:text-4xl">Projects</h1>
      <p className="mb-12 text-[var(--brand-muted)]">Web applications, tools, and experiments.</p>

      {result.docs.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {result.docs.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <p className="text-[var(--brand-muted)]">No projects yet. Check back soon.</p>
      )}
    </main>
  )
}

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Web application projects by Max Lemos.',
}
