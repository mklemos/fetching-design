import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import React from 'react'
import { ProjectCard } from '@/components/ProjectCard'
import { Hero } from '@/components/Homepage/Hero'
import { ProjectsSection } from '@/components/Homepage/ProjectsSection'
import { BlogPreviewSection } from '@/components/Homepage/BlogPreviewSection'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/',
}))

vi.mock('@/components/Terminal/TerminalProvider', () => ({
  TerminalProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useTerminal: () => ({
    mode: 'hero' as const,
    output: [],
    history: [],
    historyIndex: -1,
    setHistoryIndex: vi.fn(),
    executeCommand: vi.fn(),
    toggleOverlay: vi.fn(),
  }),
}))

afterEach(() => {
  cleanup()
})

describe('Hero section', () => {
  it('renders heading text', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1 })).toBeDefined()
  })

  it('renders subheading text', () => {
    render(<Hero />)
    expect(screen.getByText(/web applications/i)).toBeDefined()
  })

  it('renders CTA links', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: /projects/i })).toBeDefined()
    expect(screen.getByRole('link', { name: /get in touch/i })).toBeDefined()
  })

  it('renders terminal component in hero mode', () => {
    render(<Hero />)
    expect(screen.getByTestId('terminal')).toBeDefined()
  })
})

describe('ProjectCard', () => {
  const project = {
    id: 1,
    title: 'Test Project',
    slug: 'test-project',
    tagline: 'A test project',
    techStack: [
      { tech: 'React', id: '1' },
      { tech: 'Node.js', id: '2' },
    ],
    category: 'web-application' as const,
    featured: true,
    sortOrder: 1,
    updatedAt: '2024-01-01',
    createdAt: '2024-01-01',
  }

  it('renders project title', () => {
    render(<ProjectCard project={project} />)
    expect(screen.getByText('Test Project')).toBeDefined()
  })

  it('renders tagline', () => {
    render(<ProjectCard project={project} />)
    expect(screen.getByText('A test project')).toBeDefined()
  })

  it('renders tech stack tags', () => {
    render(<ProjectCard project={project} />)
    expect(screen.getByText('React')).toBeDefined()
    expect(screen.getByText('Node.js')).toBeDefined()
  })

  it('renders category badge', () => {
    render(<ProjectCard project={project} />)
    expect(screen.getByText('Web Application')).toBeDefined()
  })

  it('links to project detail page', () => {
    render(<ProjectCard project={project} />)
    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toBe('/projects/test-project')
  })
})

describe('ProjectsSection', () => {
  const projects = [
    {
      id: 1,
      title: 'Project One',
      slug: 'project-one',
      tagline: 'First project',
      techStack: [{ tech: 'React', id: '1' }],
      category: 'web-application' as const,
      featured: true,
      sortOrder: 1,
      updatedAt: '2024-01-01',
      createdAt: '2024-01-01',
    },
    {
      id: 2,
      title: 'Project Two',
      slug: 'project-two',
      tagline: 'Second project',
      techStack: [{ tech: 'Vue', id: '1' }],
      category: 'research-tool' as const,
      featured: true,
      sortOrder: 2,
      updatedAt: '2024-01-01',
      createdAt: '2024-01-01',
    },
  ]

  it('renders section heading', () => {
    render(<ProjectsSection projects={projects} />)
    expect(screen.getByText('PROJECTS')).toBeDefined()
  })

  it('renders all project cards', () => {
    render(<ProjectsSection projects={projects} />)
    expect(screen.getByText('Project One')).toBeDefined()
    expect(screen.getByText('Project Two')).toBeDefined()
  })

  it('renders view all link', () => {
    render(<ProjectsSection projects={projects} />)
    const link = screen.getByRole('link', { name: /view all/i })
    expect(link.getAttribute('href')).toBe('/projects')
  })
})

describe('BlogPreviewSection', () => {
  const posts = [
    { title: 'Post One', slug: 'post-one', publishedAt: '2024-06-15T00:00:00Z' },
    { title: 'Post Two', slug: 'post-two', publishedAt: '2024-06-10T00:00:00Z' },
    { title: 'Post Three', slug: 'post-three', publishedAt: '2024-06-05T00:00:00Z' },
  ]

  it('renders section heading', () => {
    render(<BlogPreviewSection posts={posts} />)
    expect(screen.getByText('RECENT WRITING')).toBeDefined()
  })

  it('renders post titles', () => {
    render(<BlogPreviewSection posts={posts} />)
    expect(screen.getByText('Post One')).toBeDefined()
    expect(screen.getByText('Post Two')).toBeDefined()
    expect(screen.getByText('Post Three')).toBeDefined()
  })

  it('links posts to their detail pages', () => {
    render(<BlogPreviewSection posts={posts} />)
    const links = screen
      .getAllByRole('link')
      .filter((l) => l.getAttribute('href')?.startsWith('/posts/'))
    expect(links).toHaveLength(3)
    expect(links[0].getAttribute('href')).toBe('/posts/post-one')
  })

  it('renders view all link', () => {
    render(<BlogPreviewSection posts={posts} />)
    const link = screen.getByRole('link', { name: /view all/i })
    expect(link.getAttribute('href')).toBe('/posts')
  })
})
