import type { CommandHandler, CommandOutput } from './types'

export function createRegistry(): Map<string, CommandHandler> {
  const registry = new Map<string, CommandHandler>()

  registry.set(
    'help',
    (): CommandOutput => ({
      lines: [
        { type: 'output', text: 'Available commands:' },
        { type: 'output', text: '' },
        { type: 'output', text: '  fetch <resource>   Navigate to a page' },
        { type: 'output', text: '    projects         View all projects' },
        { type: 'output', text: '    blog             Read blog posts' },
        { type: 'output', text: '    about            About Max Lemos' },
        { type: 'output', text: '    contact          Get in touch' },
        { type: 'output', text: '    status           Site status' },
        { type: 'output', text: '  whoami             Who are you?' },
        { type: 'output', text: '  pwd                Current location' },
        { type: 'output', text: '  clear              Clear terminal' },
        { type: 'output', text: '  help               Show this message' },
      ],
    }),
  )

  registry.set('fetch', (args): CommandOutput => {
    if (args.length === 0) {
      return {
        lines: [
          { type: 'info', text: 'Usage: fetch <resource>' },
          { type: 'info', text: 'Try: fetch projects, fetch blog, fetch about, fetch contact' },
        ],
      }
    }

    const resource = args[0].toLowerCase()
    const routes: Record<string, { path: string; message: string }> = {
      projects: { path: '/projects', message: 'Fetching projects...' },
      blog: { path: '/posts', message: 'Fetching blog posts...' },
      posts: { path: '/posts', message: 'Fetching blog posts...' },
      about: { path: '/about', message: 'Fetching about page...' },
      contact: { path: '/contact', message: 'Fetching contact page...' },
      status: { path: '/status', message: 'Fetching site status...' },
      home: { path: '/', message: 'Fetching homepage...' },
    }

    const route = routes[resource]
    if (route) {
      return {
        lines: [{ type: 'info', text: route.message }],
        navigate: route.path,
      }
    }

    return {
      lines: [
        { type: 'error', text: `Resource not found: ${args[0]}` },
        { type: 'info', text: 'Try: fetch projects, fetch blog, fetch about, fetch contact' },
      ],
    }
  })

  registry.set(
    'whoami',
    (): CommandOutput => ({
      lines: [
        { type: 'output', text: 'visitor@fetching.design' },
        { type: 'output', text: 'Welcome to fetching.design, the portfolio of Max Lemos.' },
      ],
    }),
  )

  registry.set(
    'pwd',
    (): CommandOutput => ({
      lines: [{ type: 'output', text: '/home/visitor/fetching.design' }],
    }),
  )

  registry.set(
    'clear',
    (): CommandOutput => ({
      lines: [],
      clear: true,
    }),
  )

  registry.set(
    'sudo',
    (): CommandOutput => ({
      lines: [{ type: 'error', text: 'Nice try. Permission denied.' }],
    }),
  )

  registry.set(
    'exit',
    (): CommandOutput => ({
      lines: [{ type: 'info', text: 'There is no escape. Try "fetch home" instead.' }],
    }),
  )

  registry.set(
    'npm',
    (): CommandOutput => ({
      lines: [
        { type: 'error', text: 'npm: command not found' },
        { type: 'info', text: 'We use bun here.' },
      ],
    }),
  )

  registry.set(
    'curl',
    (): CommandOutput => ({
      lines: [
        { type: 'output', text: 'HTTP/1.1 200 OK' },
        { type: 'output', text: 'Content-Type: text/html' },
        { type: 'output', text: 'X-Powered-By: fetching.design' },
        { type: 'output', text: '' },
        { type: 'info', text: 'Try "fetch" instead for navigation.' },
      ],
    }),
  )

  return registry
}

export const defaultCommands = createRegistry()
