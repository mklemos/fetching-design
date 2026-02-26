import { describe, it, expect } from 'vitest'
import { parseCommand } from '@/components/Terminal/lib/command-parser'
import { createRegistry, defaultCommands } from '@/components/Terminal/lib/command-registry'

describe('Command parser', () => {
  it('parses a simple command', () => {
    const result = parseCommand('help')
    expect(result.command).toBe('help')
    expect(result.args).toEqual([])
    expect(result.raw).toBe('help')
  })

  it('parses command with arguments', () => {
    const result = parseCommand('fetch projects')
    expect(result.command).toBe('fetch')
    expect(result.args).toEqual(['projects'])
  })

  it('parses command with multiple arguments', () => {
    const result = parseCommand('fetch projects --featured')
    expect(result.command).toBe('fetch')
    expect(result.args).toEqual(['projects', '--featured'])
  })

  it('handles empty input', () => {
    const result = parseCommand('')
    expect(result.command).toBe('')
    expect(result.args).toEqual([])
  })

  it('handles whitespace-only input', () => {
    const result = parseCommand('   ')
    expect(result.command).toBe('')
    expect(result.args).toEqual([])
  })

  it('trims extra whitespace between arguments', () => {
    const result = parseCommand('fetch   projects   blog')
    expect(result.command).toBe('fetch')
    expect(result.args).toEqual(['projects', 'blog'])
  })

  it('is case-insensitive for command name', () => {
    const result = parseCommand('HELP')
    expect(result.command).toBe('help')
  })

  it('preserves case for arguments', () => {
    const result = parseCommand('fetch MyProject')
    expect(result.args).toEqual(['MyProject'])
  })

  it('escapes HTML in raw input', () => {
    const result = parseCommand('<script>alert("xss")</script>')
    expect(result.raw).not.toContain('<script>')
    expect(result.raw).toContain('&lt;script&gt;')
  })

  it('escapes HTML in command', () => {
    const result = parseCommand('<img src=x onerror=alert(1)>')
    expect(result.command).not.toContain('<img')
  })

  it('escapes HTML in arguments', () => {
    const result = parseCommand('fetch <b>bold</b>')
    expect(result.args[0]).not.toContain('<b>')
    expect(result.args[0]).toContain('&lt;b&gt;')
  })

  it('preserves the raw input with escaping', () => {
    const result = parseCommand('fetch projects')
    expect(result.raw).toBe('fetch projects')
  })
})

describe('Command registry', () => {
  const registry = createRegistry()

  it('registers all default commands', () => {
    const commands = ['help', 'fetch', 'whoami', 'clear', 'pwd']
    for (const cmd of commands) {
      expect(registry.has(cmd)).toBe(true)
    }
  })

  it('help command returns output lines', () => {
    const handler = registry.get('help')!
    const output = handler([])
    expect(output.lines.length).toBeGreaterThan(0)
    expect(output.lines.some((l) => l.type === 'output')).toBe(true)
  })

  it('fetch with no args shows usage', () => {
    const handler = registry.get('fetch')!
    const output = handler([])
    expect(output.lines.some((l) => l.type === 'info')).toBe(true)
  })

  it('fetch projects navigates to /projects', () => {
    const handler = registry.get('fetch')!
    const output = handler(['projects'])
    expect(output.navigate).toBe('/projects')
  })

  it('fetch blog navigates to /posts', () => {
    const handler = registry.get('fetch')!
    const output = handler(['blog'])
    expect(output.navigate).toBe('/posts')
  })

  it('fetch about navigates to /about', () => {
    const handler = registry.get('fetch')!
    const output = handler(['about'])
    expect(output.navigate).toBe('/about')
  })

  it('fetch contact navigates to /contact', () => {
    const handler = registry.get('fetch')!
    const output = handler(['contact'])
    expect(output.navigate).toBe('/contact')
  })

  it('clear command sets clear flag', () => {
    const handler = registry.get('clear')!
    const output = handler([])
    expect(output.clear).toBe(true)
  })

  it('whoami returns identifying info', () => {
    const handler = registry.get('whoami')!
    const output = handler([])
    expect(output.lines.length).toBeGreaterThan(0)
  })

  it('pwd returns current location', () => {
    const handler = registry.get('pwd')!
    const output = handler([])
    expect(output.lines.some((l) => l.text.includes('fetching.design'))).toBe(true)
  })

  it('unknown command returns error', () => {
    expect(registry.has('nonexistent')).toBe(false)
  })

  it('sudo returns easter egg', () => {
    expect(registry.has('sudo')).toBe(true)
    const handler = registry.get('sudo')!
    const output = handler([])
    expect(output.lines.some((l) => l.type === 'error')).toBe(true)
  })

  it('defaultCommands exports the registry', () => {
    expect(defaultCommands).toBeDefined()
    expect(defaultCommands.has('help')).toBe(true)
  })
})
