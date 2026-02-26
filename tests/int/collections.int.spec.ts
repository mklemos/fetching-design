import { describe, it, expect, beforeAll } from 'vitest'
import { getPayload } from 'payload'
import config from '@/payload.config'

let payload: Awaited<ReturnType<typeof getPayload>>
const uid = Date.now()

beforeAll(async () => {
  payload = await getPayload({ config })
})

describe('Projects collection', () => {
  it('creates a project with all fields', async () => {
    const slug = `test-project-${uid}`
    const project = await payload.create({
      collection: 'projects',
      data: {
        title: 'Test Project',
        slug,
        tagline: 'A test project for unit testing',
        techStack: [{ tech: 'Next.js' }, { tech: 'TypeScript' }],
        category: 'web-application',
        featured: true,
        sortOrder: 1,
      },
    })

    expect(project.id).toBeDefined()
    expect(project.title).toBe('Test Project')
    expect(project.slug).toBe(slug)
    expect(project.tagline).toBe('A test project for unit testing')
    expect(project.techStack).toHaveLength(2)
    expect(project.category).toBe('web-application')
    expect(project.featured).toBe(true)
    expect(project.sortOrder).toBe(1)
  })

  it('enforces unique slugs', async () => {
    const slug = `unique-slug-${uid}`
    await payload.create({
      collection: 'projects',
      data: {
        title: 'Unique Slug Test',
        slug,
        category: 'web-application',
      },
    })

    await expect(
      payload.create({
        collection: 'projects',
        data: {
          title: 'Duplicate Slug Test',
          slug,
          category: 'web-application',
        },
      }),
    ).rejects.toThrow()
  })

  it('allows public read access', async () => {
    const result = await payload.find({
      collection: 'projects',
      overrideAccess: false,
    })

    expect(result.docs).toBeDefined()
    expect(Array.isArray(result.docs)).toBe(true)
  })
})

describe('Posts collection - dual content', () => {
  const richTextContent = {
    root: {
      type: 'root' as const,
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', text: 'Hello world' }],
        },
      ],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }

  it('creates a post with richText content source', async () => {
    const post = await payload.create({
      collection: 'posts',
      context: { disableRevalidate: true },
      data: {
        title: `Rich Text Post ${uid}`,
        contentSource: 'richText',
        content: richTextContent,
        _status: 'published',
      },
    })

    expect(post.contentSource).toBe('richText')
    expect(post.content).toBeDefined()
  })

  it('creates a post with markdown content source', async () => {
    const post = await payload.create({
      collection: 'posts',
      context: { disableRevalidate: true },
      data: {
        title: `Markdown Post ${uid}`,
        contentSource: 'markdown',
        markdown: '# Hello\n\nThis is a markdown post.',
        content: richTextContent,
        _status: 'published',
      },
    })

    expect(post.contentSource).toBe('markdown')
    expect(post.markdown).toContain('# Hello')
  })

  it('defaults contentSource to richText', async () => {
    const post = await payload.create({
      collection: 'posts',
      context: { disableRevalidate: true },
      data: {
        title: `Default Content Source Post ${uid}`,
        content: richTextContent,
        _status: 'published',
      },
    })

    expect(post.contentSource).toBe('richText')
  })
})

describe('Users collection - API key auth', () => {
  it('creates a user with role field', async () => {
    const user = await payload.create({
      collection: 'users',
      data: {
        email: `test-role-${uid}@example.com`,
        password: 'test-password-123',
        name: 'Test User',
        role: 'admin',
      },
    })

    expect(user.role).toBe('admin')
  })

  it('defaults role to admin', async () => {
    const user = await payload.create({
      collection: 'users',
      data: {
        email: `test-default-${uid}@example.com`,
        password: 'test-password-123',
        name: 'Default Role User',
      },
    })

    expect(user.role).toBe('admin')
  })
})
