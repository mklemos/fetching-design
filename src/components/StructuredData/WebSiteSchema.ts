import { getServerSideURL } from '@/utilities/getURL'

export function WebSiteSchema() {
  const siteUrl = getServerSideURL()

  return {
    '@context': 'https://schema.org' as const,
    '@type': 'WebSite' as const,
    name: 'fetching.design',
    url: siteUrl,
    description: 'Custom web application development by Max Lemos.',
    author: {
      '@type': 'Person' as const,
      name: 'Max Lemos',
    },
  }
}
