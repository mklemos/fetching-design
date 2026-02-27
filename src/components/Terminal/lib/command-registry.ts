import type { CommandHandler, CommandOutput } from './types'

export function createRegistry(): Map<string, CommandHandler> {
  const registry = new Map<string, CommandHandler>()

  registry.set(
    'help',
    (): CommandOutput => ({
      lines: [
        { type: 'output', text: 'Available commands:' },
        { type: 'output', text: '' },
        {
          type: 'output',
          text: '  fetch projects       List all projects',
          segments: [
            { type: 'info', text: '  fetch projects' },
            { type: 'output', text: '       List all projects' },
          ],
        },
        {
          type: 'output',
          text: '  fetch <name>         View project details',
          segments: [
            { type: 'info', text: '  fetch <name>' },
            { type: 'output', text: '         View project details' },
          ],
        },
        {
          type: 'output',
          text: '  fetch status         System status',
          segments: [
            { type: 'info', text: '  fetch status' },
            { type: 'output', text: '         System status' },
          ],
        },
        {
          type: 'output',
          text: '  whoami               About me',
          segments: [
            { type: 'info', text: '  whoami' },
            { type: 'output', text: '               About me' },
          ],
        },
        {
          type: 'output',
          text: '  clear                Clear terminal',
          segments: [
            { type: 'info', text: '  clear' },
            { type: 'output', text: '                Clear terminal' },
          ],
        },
        { type: 'output', text: '' },
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
        lines: [
          {
            type: 'output',
            text: `GET ${route.path}  200 OK`,
            segments: [
              { type: 'output', text: `GET ${route.path}  ` },
              { type: 'success', text: '200 OK' },
            ],
          },
        ],
        navigate: route.path,
      }
    }

    return {
      lines: [
        {
          type: 'output',
          text: `GET /api/${args[0]}  404 Not Found`,
          segments: [
            { type: 'output', text: `GET /api/${args[0]}  ` },
            { type: 'error', text: '404 Not Found' },
          ],
        },
        { type: 'output', text: '' },
        {
          type: 'output',
          text: `No resource matching "${args[0]}". Try fetch projects to see all.`,
          segments: [
            { type: 'output', text: `No resource matching "${args[0]}". Try ` },
            { type: 'info', text: 'fetch projects' },
            { type: 'output', text: ' to see all.' },
          ],
        },
        { type: 'output', text: '' },
      ],
    }
  })

  registry.set(
    'whoami',
    (): CommandOutput => ({
      lines: [
        { type: 'output', text: '' },
        { type: 'input', text: '  Max Lemos' },
        { type: 'output', text: "  Full-stack developer. UCSB MTM '26." },
        { type: 'output', text: '  I build web applications that deliver.' },
        { type: 'output', text: '' },
        {
          type: 'output',
          text: '  Email:  max@fetching.design',
          segments: [
            { type: 'output', text: '  Email:  ' },
            { type: 'info', text: 'max@fetching.design' },
          ],
        },
        { type: 'output', text: '' },
      ],
    }),
  )

  registry.set(
    'pwd',
    (): CommandOutput => ({
      lines: [{ type: 'input', text: '/home/max/fetching.design' }],
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
      lines: [
        { type: 'output', text: 'You can check out any time you like,' },
        { type: 'output', text: 'but you can never leave.' },
        { type: 'output', text: '' },
      ],
    }),
  )

  registry.set(
    'npm',
    (): CommandOutput => ({
      lines: [{ type: 'info', text: 'We use bun here.' }],
    }),
  )

  registry.set(
    'curl',
    (): CommandOutput => ({
      lines: [
        {
          type: 'output',
          text: 'Why curl when you can fetch?',
          segments: [
            { type: 'output', text: 'Why curl when you can ' },
            { type: 'info', text: 'fetch' },
            { type: 'output', text: '?' },
          ],
        },
        { type: 'output', text: '' },
      ],
    }),
  )

  return registry
}

export const defaultCommands = createRegistry()
