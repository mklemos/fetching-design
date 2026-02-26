import { getServerSideURL } from '@/utilities/getURL'

export function PersonSchema() {
  const siteUrl = getServerSideURL()

  return {
    '@context': 'https://schema.org' as const,
    '@type': 'Person' as const,
    name: 'Max Lemos',
    url: siteUrl,
    jobTitle: 'Full-Stack Developer',
    sameAs: ['https://github.com/maxlemos'],
    worksFor: {
      '@type': 'Organization' as const,
      name: 'fetching.design',
      url: siteUrl,
    },
  }
}
