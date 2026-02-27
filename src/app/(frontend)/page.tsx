import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

import { Hero } from '@/components/Homepage/Hero'
import { ProjectsSection } from '@/components/Homepage/ProjectsSection'
import { BlogPreviewSection } from '@/components/Homepage/BlogPreviewSection'

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })

  const [projectsResult, postsResult] = await Promise.all([
    payload.find({
      collection: 'projects',
      where: { featured: { equals: true } },
      sort: 'sortOrder',
      limit: 4,
      overrideAccess: false,
    }),
    payload.find({
      collection: 'posts',
      limit: 3,
      sort: '-publishedAt',
      overrideAccess: false,
      select: {
        title: true,
        slug: true,
        publishedAt: true,
      },
    }),
  ])

  return (
    <main>
      <Hero />

      {projectsResult.docs.length > 0 && <ProjectsSection projects={projectsResult.docs} />}

      {postsResult.docs.length > 0 && (
        <BlogPreviewSection
          posts={postsResult.docs.map((p) => ({
            title: p.title,
            slug: p.slug!,
            publishedAt: p.publishedAt,
          }))}
        />
      )}
    </main>
  )
}

export const metadata: Metadata = {
  title: 'fetching.design | Web Application Development',
  description:
    'Custom web application development by Max Lemos. Full-stack development with modern tools.',
}
