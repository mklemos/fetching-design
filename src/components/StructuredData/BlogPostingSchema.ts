import { getServerSideURL } from '@/utilities/getURL'

type BlogPostingProps = {
  title: string
  description: string
  slug: string
  publishedAt: string
  modifiedAt?: string
  imageUrl?: string
}

export function BlogPostingSchema({
  title,
  description,
  slug,
  publishedAt,
  modifiedAt,
  imageUrl,
}: BlogPostingProps) {
  const siteUrl = getServerSideURL()

  return {
    '@context': 'https://schema.org' as const,
    '@type': 'BlogPosting' as const,
    headline: title,
    description,
    url: `${siteUrl}/posts/${slug}`,
    datePublished: publishedAt,
    dateModified: modifiedAt || publishedAt,
    ...(imageUrl ? { image: imageUrl } : {}),
    author: {
      '@type': 'Person' as const,
      name: 'Max Lemos',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization' as const,
      name: 'fetching.design',
      url: siteUrl,
    },
  }
}
