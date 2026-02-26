'use client'

import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { parseCommand } from './lib/command-parser'
import { defaultCommands } from './lib/command-registry'
import type { OutputLine, TerminalMode } from './lib/types'

interface TerminalContextValue {
  mode: TerminalMode
  output: OutputLine[]
  history: string[]
  historyIndex: number
  setHistoryIndex: (index: number) => void
  executeCommand: (input: string) => void
  toggleOverlay: () => void
}

const TerminalContext = createContext<TerminalContextValue | null>(null)

export function useTerminal(): TerminalContextValue {
  const ctx = useContext(TerminalContext)
  if (!ctx) throw new Error('useTerminal must be used within a TerminalProvider')
  return ctx
}

export function TerminalProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [output, setOutput] = useState<OutputLine[]>([])
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [overlayOpen, setOverlayOpen] = useState(false)

  const isHomepage = pathname === '/'

  const mode: TerminalMode = useMemo(() => {
    if (isHomepage) return 'hero'
    if (overlayOpen) return 'overlay'
    return 'fab'
  }, [isHomepage, overlayOpen])

  useEffect(() => {
    if (isHomepage) {
      setOverlayOpen(false)
    }
  }, [isHomepage])

  const toggleOverlay = useCallback(() => {
    setOverlayOpen((prev) => !prev)
  }, [])

  const executeCommand = useCallback(
    (input: string) => {
      const parsed = parseCommand(input)
      setHistory((prev) => [...prev, input])
      setHistoryIndex(-1)

      const inputLine: OutputLine = { type: 'input', text: `$ ${parsed.raw}` }

      if (!parsed.command) return

      const handler = defaultCommands.get(parsed.command)
      if (!handler) {
        setOutput((prev) => [
          ...prev,
          inputLine,
          { type: 'error', text: `command not found: ${parsed.command}` },
        ])
        return
      }

      const result = handler(parsed.args)

      if (result.clear) {
        setOutput([])
        return
      }

      setOutput((prev) => [...prev, inputLine, ...result.lines])

      if (result.navigate) {
        router.push(result.navigate)
      }
    },
    [router],
  )

  const value = useMemo(
    () => ({
      mode,
      output,
      history,
      historyIndex,
      setHistoryIndex,
      executeCommand,
      toggleOverlay,
    }),
    [mode, output, history, historyIndex, executeCommand, toggleOverlay],
  )

  return <TerminalContext.Provider value={value}>{children}</TerminalContext.Provider>
}
