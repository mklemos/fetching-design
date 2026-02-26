// @vitest-environment node
import { describe, it, expect, beforeAll } from 'vitest'
import { getPayload } from 'payload'
import config from '@/payload.config'

let payload: Awaited<ReturnType<typeof getPayload>>
const uid = Date.now()

beforeAll(async () => {
  payload = await getPayload({ config })
})

describe('Projects pages - data layer', () => {
  beforeAll(async () => {
    await payload.create({
      collection: 'projects',
      data: {
        title: `Listed Project ${uid}`,
        slug: `listed-project-${uid}`,
        tagline: 'A project for listing tests',
        techStack: [{ tech: 'React' }],
        category: 'web-application',
        featured: true,
        sortOrder: 1,
      },
    })
  })

  it('finds projects for listing page', async () => {
    const result = await payload.find({
      collection: 'projects',
      overrideAccess: false,
      limit: 10,
    })
    expect(result.docs.length).toBeGreaterThan(0)
    expect(result.docs.some((p) => p.slug === `listed-project-${uid}`)).toBe(true)
  })

  it('finds a project by slug', async () => {
    const result = await payload.find({
      collection: 'projects',
      where: { slug: { equals: `listed-project-${uid}` } },
      limit: 1,
    })
    expect(result.docs).toHaveLength(1)
    expect(result.docs[0].title).toBe(`Listed Project ${uid}`)
  })

  it('returns empty for non-existent slug', async () => {
    const result = await payload.find({
      collection: 'projects',
      where: { slug: { equals: 'this-does-not-exist-ever' } },
      limit: 1,
    })
    expect(result.docs).toHaveLength(0)
  })
})

describe('Blog post dual-content rendering', () => {
  it('retrieves post with richText contentSource', async () => {
    const post = await payload.create({
      collection: 'posts',
      context: { disableRevalidate: true },
      data: {
        title: `RichText Render ${uid}`,
        contentSource: 'richText',
        content: {
          root: {
            type: 'root' as const,
            children: [
              { type: 'paragraph', children: [{ type: 'text', text: 'Rich text content here' }] },
            ],
            direction: 'ltr' as const,
            format: '' as const,
            indent: 0,
            version: 1,
          },
        },
        _status: 'published',
      },
    })

    expect(post.contentSource).toBe('richText')
    expect(post.content).toBeDefined()
  })

  it('retrieves post with markdown contentSource and markdown field', async () => {
    const post = await payload.create({
      collection: 'posts',
      context: { disableRevalidate: true },
      data: {
        title: `Markdown Render ${uid}`,
        contentSource: 'markdown',
        markdown: '# Heading\n\nParagraph with **bold** text.\n\n```js\nconsole.log("hello")\n```',
        content: {
          root: {
            type: 'root' as const,
            children: [{ type: 'paragraph', children: [{ type: 'text', text: 'placeholder' }] }],
            direction: 'ltr' as const,
            format: '' as const,
            indent: 0,
            version: 1,
          },
        },
        _status: 'published',
      },
    })

    expect(post.contentSource).toBe('markdown')
    expect(post.markdown).toContain('# Heading')
    expect(post.markdown).toContain('**bold**')
  })
})
