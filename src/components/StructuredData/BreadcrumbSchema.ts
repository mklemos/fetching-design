import { getServerSideURL } from '@/utilities/getURL'

type BreadcrumbItem = {
  name: string
  url: string
}

export function BreadcrumbSchema(items: BreadcrumbItem[]) {
  const siteUrl = getServerSideURL()

  return {
    '@context': 'https://schema.org' as const,
    '@type': 'BreadcrumbList' as const,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      item: {
        '@id': item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
        name: item.name,
      },
    })),
  }
}
