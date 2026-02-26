import { getServerSideURL } from '@/utilities/getURL'

type ProjectSchemaProps = {
  title: string
  description: string
  slug: string
  techStack?: string[]
  url?: string
}

export function ProjectSchema({ title, description, slug, techStack, url }: ProjectSchemaProps) {
  const siteUrl = getServerSideURL()

  return {
    '@context': 'https://schema.org' as const,
    '@type': 'SoftwareApplication' as const,
    name: title,
    description,
    url: url || `${siteUrl}/projects/${slug}`,
    applicationCategory: 'WebApplication',
    ...(techStack && techStack.length > 0 ? { keywords: techStack.join(', ') } : {}),
    author: {
      '@type': 'Person' as const,
      name: 'Max Lemos',
    },
  }
}
