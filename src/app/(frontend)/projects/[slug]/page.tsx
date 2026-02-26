import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import RichText from '@/components/RichText'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const projects = await payload.find({
    collection: 'projects',
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })

  return projects.docs.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{ slug: string }>
}

export default async function ProjectDetailPage({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const project = await queryProjectBySlug({ slug })

  if (!project) notFound()

  const { title, tagline, description, techStack, category, liveUrl, repoUrl } = project

  const categoryLabels: Record<string, string> = {
    'web-application': 'Web Application',
    'research-tool': 'Research Tool',
    wordpress: 'WordPress',
    'ai-full-stack': 'AI / Full Stack',
  }

  return (
    <main className="container py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded bg-[var(--brand-border)] px-2 py-0.5 text-xs text-[var(--brand-muted)]">
            {categoryLabels[category] || category}
          </span>
        </div>

        <h1 className="mb-2 text-3xl font-bold text-[var(--brand-platinum)] md:text-4xl">
          {title}
        </h1>

        {tagline && <p className="mb-8 text-lg text-[var(--brand-muted)]">{tagline}</p>}

        {(liveUrl || repoUrl) && (
          <div className="mb-8 flex gap-4">
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-[var(--brand-clay)] px-4 py-2 text-sm font-medium text-[var(--brand-black)] transition-opacity hover:opacity-90"
              >
                Live Site &rarr;
              </a>
            )}
            {repoUrl && (
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-[var(--brand-border)] px-4 py-2 text-sm text-[var(--brand-platinum)] transition-colors hover:border-[var(--brand-clay)]"
              >
                Source Code
              </a>
            )}
          </div>
        )}

        {techStack && techStack.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {techStack.map((item) => (
              <span
                key={item.id || item.tech}
                className="rounded-full border border-[var(--brand-border)] px-3 py-1 text-xs text-[var(--brand-muted)]"
              >
                {item.tech}
              </span>
            ))}
          </div>
        )}

        {description && (
          <div className="prose prose-invert max-w-none">
            <RichText data={description} enableGutter={false} />
          </div>
        )}
      </div>
    </main>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const project = await queryProjectBySlug({ slug })

  return {
    title: project?.title || 'Project',
    description: project?.tagline || undefined,
  }
}

const queryProjectBySlug = cache(async ({ slug }: { slug: string }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'projects',
    limit: 1,
    overrideAccess: false,
    where: { slug: { equals: slug } },
  })

  return result.docs?.[0] || null
})
