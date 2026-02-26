// @vitest-environment node
import { describe, it, expect, beforeAll } from 'vitest'

import { generateMeta } from '@/utilities/generateMeta'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

describe('SEO: generateMeta', () => {
  it('uses fetching.design branding in title when doc has meta title', async () => {
    const result = await generateMeta({
      doc: { meta: { title: 'My Post', description: 'A description', image: null } },
    })
    expect(result.title).toBe('My Post | fetching.design')
  })

  it('defaults to fetching.design when doc has no meta title', async () => {
    const result = await generateMeta({ doc: null })
    expect(result.title).toBe('fetching.design')
  })

  it('passes description through from doc meta', async () => {
    const result = await generateMeta({
      doc: { meta: { title: 'Test', description: 'Some description', image: null } },
    })
    expect(result.description).toBe('Some description')
  })

  it('includes openGraph with correct title', async () => {
    const result = await generateMeta({
      doc: { meta: { title: 'OG Test', description: 'desc', image: null } },
    })
    expect(result.openGraph?.title).toBe('OG Test | fetching.design')
  })
})

describe('SEO: mergeOpenGraph', () => {
  it('uses fetching.design as default site name', () => {
    const og = mergeOpenGraph()
    expect(og?.siteName).toBe('fetching.design')
  })

  it('uses fetching.design as default title', () => {
    const og = mergeOpenGraph()
    expect(og?.title).toBe('fetching.design')
  })

  it('uses fetching.design description', () => {
    const og = mergeOpenGraph()
    expect(og?.description).toBe('Custom web application development by Max Lemos.')
  })

  it('merges provided OG data over defaults', () => {
    const og = mergeOpenGraph({ title: 'Custom Title', description: 'Custom desc' })
    expect(og?.title).toBe('Custom Title')
    expect(og?.description).toBe('Custom desc')
    expect(og?.siteName).toBe('fetching.design')
  })

  it('uses provided images when available', () => {
    const og = mergeOpenGraph({
      images: [{ url: '/custom-image.webp' }],
    })
    expect(og?.images).toEqual([{ url: '/custom-image.webp' }])
  })
})

describe('SEO: Structured data components', () => {
  // Import after implementation
  let WebSiteSchema: typeof import('@/components/StructuredData/WebSiteSchema').WebSiteSchema
  let PersonSchema: typeof import('@/components/StructuredData/PersonSchema').PersonSchema
  let BlogPostingSchema: typeof import('@/components/StructuredData/BlogPostingSchema').BlogPostingSchema
  let BreadcrumbSchema: typeof import('@/components/StructuredData/BreadcrumbSchema').BreadcrumbSchema
  let ProjectSchema: typeof import('@/components/StructuredData/ProjectSchema').ProjectSchema

  // Use dynamic imports since files don't exist yet during test-first
  beforeAll(async () => {
    const ws = await import('@/components/StructuredData/WebSiteSchema')
    WebSiteSchema = ws.WebSiteSchema
    const ps = await import('@/components/StructuredData/PersonSchema')
    PersonSchema = ps.PersonSchema
    const bp = await import('@/components/StructuredData/BlogPostingSchema')
    BlogPostingSchema = bp.BlogPostingSchema
    const bc = await import('@/components/StructuredData/BreadcrumbSchema')
    BreadcrumbSchema = bc.BreadcrumbSchema
    const pj = await import('@/components/StructuredData/ProjectSchema')
    ProjectSchema = pj.ProjectSchema
  })

  it('WebSiteSchema returns valid JSON-LD object', () => {
    const data = WebSiteSchema()
    expect(data['@context']).toBe('https://schema.org')
    expect(data['@type']).toBe('WebSite')
    expect(data.name).toBe('fetching.design')
    expect(data.url).toBeDefined()
  })

  it('PersonSchema returns valid JSON-LD with Max Lemos info', () => {
    const data = PersonSchema()
    expect(data['@context']).toBe('https://schema.org')
    expect(data['@type']).toBe('Person')
    expect(data.name).toBe('Max Lemos')
    expect(data.url).toBeDefined()
    expect(data.jobTitle).toBeDefined()
  })

  it('BlogPostingSchema returns valid JSON-LD for a post', () => {
    const data = BlogPostingSchema({
      title: 'Test Post',
      description: 'A test post',
      slug: 'test-post',
      publishedAt: '2025-01-15T00:00:00Z',
      modifiedAt: '2025-01-16T00:00:00Z',
    })
    expect(data['@context']).toBe('https://schema.org')
    expect(data['@type']).toBe('BlogPosting')
    expect(data.headline).toBe('Test Post')
    expect(data.datePublished).toBe('2025-01-15T00:00:00Z')
    expect(data.dateModified).toBe('2025-01-16T00:00:00Z')
  })

  it('BreadcrumbSchema returns valid BreadcrumbList', () => {
    const data = BreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Blog', url: '/posts' },
      { name: 'Test Post', url: '/posts/test-post' },
    ])
    expect(data['@context']).toBe('https://schema.org')
    expect(data['@type']).toBe('BreadcrumbList')
    expect(data.itemListElement).toHaveLength(3)
    expect(data.itemListElement[0].position).toBe(1)
    expect(data.itemListElement[2].position).toBe(3)
    expect(data.itemListElement[2].item.name).toBe('Test Post')
  })

  it('ProjectSchema returns valid JSON-LD for a project', () => {
    const data = ProjectSchema({
      title: 'Team Builder',
      description: 'A team management tool',
      slug: 'team-builder',
      techStack: ['Next.js', 'TypeScript'],
      url: 'https://team-builder.fetching.design',
    })
    expect(data['@context']).toBe('https://schema.org')
    expect(data['@type']).toBe('SoftwareApplication')
    expect(data.name).toBe('Team Builder')
    expect(data.description).toBe('A team management tool')
    expect(data.url).toBe('https://team-builder.fetching.design')
  })
})
