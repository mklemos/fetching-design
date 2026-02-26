import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react'
import React from 'react'
import { parseCommand } from '@/components/Terminal/lib/command-parser'
import { createRegistry, defaultCommands } from '@/components/Terminal/lib/command-registry'
import { Terminal } from '@/components/Terminal/Terminal'
import { TerminalProvider, useTerminal } from '@/components/Terminal/TerminalProvider'

const mockPush = vi.fn()
let mockPathname = '/'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => mockPathname,
}))

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

describe('Terminal UI component', () => {
  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    mockPush.mockClear()
    mockPathname = '/'
  })

  function renderTerminal() {
    return render(
      <TerminalProvider>
        <Terminal />
      </TerminalProvider>,
    )
  }

  it('renders terminal chrome elements', () => {
    renderTerminal()
    expect(screen.getByLabelText('Terminal input')).toBeDefined()
    expect(screen.getByTestId('terminal')).toBeDefined()
  })

  it('renders with prompt indicator', () => {
    renderTerminal()
    const prompt = screen.getByTestId('terminal').querySelector('[class*="brand-clay"]')
    expect(prompt).not.toBeNull()
    expect(prompt!.textContent).toBe('$')
  })

  it('submits command on Enter', async () => {
    renderTerminal()
    const input = screen.getByLabelText('Terminal input')
    await act(async () => {
      fireEvent.change(input, { target: { value: 'help' } })
      fireEvent.keyDown(input, { key: 'Enter' })
    })
    expect(screen.getByText('Available commands:')).toBeDefined()
  })

  it('echoes submitted commands in output', async () => {
    renderTerminal()
    const input = screen.getByLabelText('Terminal input')
    await act(async () => {
      fireEvent.change(input, { target: { value: 'whoami' } })
      fireEvent.keyDown(input, { key: 'Enter' })
    })
    expect(screen.getByText('$ whoami')).toBeDefined()
  })

  it('clears input after submission', async () => {
    renderTerminal()
    const input = screen.getByLabelText('Terminal input') as HTMLInputElement
    await act(async () => {
      fireEvent.change(input, { target: { value: 'help' } })
      fireEvent.keyDown(input, { key: 'Enter' })
    })
    expect(input.value).toBe('')
  })

  it('shows error for unknown commands', async () => {
    renderTerminal()
    const input = screen.getByLabelText('Terminal input')
    await act(async () => {
      fireEvent.change(input, { target: { value: 'foobar' } })
      fireEvent.keyDown(input, { key: 'Enter' })
    })
    expect(screen.getByText(/command not found: foobar/)).toBeDefined()
  })

  it('navigates via router on fetch commands', async () => {
    renderTerminal()
    const input = screen.getByLabelText('Terminal input')
    await act(async () => {
      fireEvent.change(input, { target: { value: 'fetch projects' } })
      fireEvent.keyDown(input, { key: 'Enter' })
    })
    expect(mockPush).toHaveBeenCalledWith('/projects')
  })

  it('supports command history with ArrowUp', async () => {
    renderTerminal()
    const input = screen.getByLabelText('Terminal input') as HTMLInputElement
    await act(async () => {
      fireEvent.change(input, { target: { value: 'whoami' } })
      fireEvent.keyDown(input, { key: 'Enter' })
      fireEvent.change(input, { target: { value: 'help' } })
      fireEvent.keyDown(input, { key: 'Enter' })
    })
    await act(async () => {
      fireEvent.keyDown(input, { key: 'ArrowUp' })
    })
    expect(input.value).toBe('help')
    await act(async () => {
      fireEvent.keyDown(input, { key: 'ArrowUp' })
    })
    expect(input.value).toBe('whoami')
  })

  it('supports command history with ArrowDown', async () => {
    renderTerminal()
    const input = screen.getByLabelText('Terminal input') as HTMLInputElement
    await act(async () => {
      fireEvent.change(input, { target: { value: 'whoami' } })
      fireEvent.keyDown(input, { key: 'Enter' })
      fireEvent.change(input, { target: { value: 'help' } })
      fireEvent.keyDown(input, { key: 'Enter' })
    })
    await act(async () => {
      fireEvent.keyDown(input, { key: 'ArrowUp' })
    })
    await act(async () => {
      fireEvent.keyDown(input, { key: 'ArrowUp' })
    })
    expect(input.value).toBe('whoami')
    await act(async () => {
      fireEvent.keyDown(input, { key: 'ArrowDown' })
    })
    expect(input.value).toBe('help')
  })

  it('has an aria-live region for output', () => {
    renderTerminal()
    const output = screen.getByTestId('terminal-output')
    expect(output.getAttribute('aria-live')).toBe('polite')
  })
})

describe('Terminal state machine', () => {
  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    mockPush.mockClear()
    mockPathname = '/'
  })

  function StateInspector() {
    const { mode } = useTerminal()
    return <div data-testid="mode">{mode}</div>
  }

  it('starts in hero mode on homepage', () => {
    mockPathname = '/'
    render(
      <TerminalProvider>
        <StateInspector />
      </TerminalProvider>,
    )
    expect(screen.getByTestId('mode').textContent).toBe('hero')
  })

  it('switches to fab mode on non-homepage', () => {
    mockPathname = '/projects'
    render(
      <TerminalProvider>
        <StateInspector />
      </TerminalProvider>,
    )
    expect(screen.getByTestId('mode').textContent).toBe('fab')
  })

  it('returns to hero mode when navigating back to homepage', () => {
    mockPathname = '/projects'
    const { rerender } = render(
      <TerminalProvider>
        <StateInspector />
      </TerminalProvider>,
    )
    expect(screen.getByTestId('mode').textContent).toBe('fab')

    mockPathname = '/'
    rerender(
      <TerminalProvider>
        <StateInspector />
      </TerminalProvider>,
    )
    expect(screen.getByTestId('mode').textContent).toBe('hero')
  })

  it('transitions to overlay mode when toggled', () => {
    mockPathname = '/projects'

    function OverlayToggler() {
      const { mode, toggleOverlay } = useTerminal()
      return (
        <div>
          <div data-testid="mode">{mode}</div>
          <button onClick={toggleOverlay}>toggle</button>
        </div>
      )
    }

    render(
      <TerminalProvider>
        <OverlayToggler />
      </TerminalProvider>,
    )

    expect(screen.getByTestId('mode').textContent).toBe('fab')
    fireEvent.click(screen.getByText('toggle'))
    expect(screen.getByTestId('mode').textContent).toBe('overlay')
    fireEvent.click(screen.getByText('toggle'))
    expect(screen.getByTestId('mode').textContent).toBe('fab')
  })

  it('preserves output across mode changes', async () => {
    mockPathname = '/'

    function TerminalWithInspector() {
      const { output } = useTerminal()
      return (
        <div>
          <Terminal />
          <div data-testid="output-count">{output.length}</div>
        </div>
      )
    }

    const { rerender } = render(
      <TerminalProvider>
        <TerminalWithInspector />
      </TerminalProvider>,
    )

    const input = screen.getByLabelText('Terminal input')
    await act(async () => {
      fireEvent.change(input, { target: { value: 'help' } })
      fireEvent.keyDown(input, { key: 'Enter' })
    })

    const countBefore = Number(screen.getByTestId('output-count').textContent)
    expect(countBefore).toBeGreaterThan(0)

    mockPathname = '/projects'
    rerender(
      <TerminalProvider>
        <TerminalWithInspector />
      </TerminalProvider>,
    )

    const countAfter = Number(screen.getByTestId('output-count').textContent)
    expect(countAfter).toBe(countBefore)
  })
})
