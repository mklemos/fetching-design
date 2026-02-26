import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'Custom web application development by Max Lemos.',
  images: [
    {
      url: `${getServerSideURL()}/og-image.webp`,
    },
  ],
  siteName: 'fetching.design',
  title: 'fetching.design',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
