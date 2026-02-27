'use client'

import { useRef, useCallback, useState } from 'react'
import { useTerminal } from './TerminalProvider'

const lineColors: Record<string, string> = {
  input: 'text-[var(--brand-platinum)]',
  output: 'text-[var(--brand-muted)]',
  error: 'text-red-400',
  info: 'text-[var(--brand-clay)]',
  success: 'text-green-400',
  accent: 'text-blue-400',
}

export function Terminal() {
  const { output, executeCommand, history, historyIndex, setHistoryIndex } = useTerminal()
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const [inputValue, setInputValue] = useState('')

  const scrollToBottom = useCallback(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const input = inputRef.current
      if (!input) return

      if (e.key === 'Enter') {
        const value = input.value
        if (value.trim()) {
          executeCommand(value)
          input.value = ''
          setInputValue('')
          setTimeout(scrollToBottom, 0)
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (history.length > 0) {
          const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
          setHistoryIndex(newIndex)
          input.value = history[newIndex]
          setInputValue(history[newIndex])
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (historyIndex !== -1) {
          const newIndex = historyIndex + 1
          if (newIndex >= history.length) {
            setHistoryIndex(-1)
            input.value = ''
            setInputValue('')
          } else {
            setHistoryIndex(newIndex)
            input.value = history[newIndex]
            setInputValue(history[newIndex])
          }
        }
      }
    },
    [executeCommand, history, historyIndex, setHistoryIndex, scrollToBottom],
  )

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }, [])

  const handleContainerClick = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div
      data-testid="terminal"
      className="flex h-full flex-col rounded-lg border border-[var(--brand-clay)]/15 bg-[var(--brand-black)] shadow-[0_0_40px_rgba(212,160,82,0.08)] font-mono text-sm"
      onClick={handleContainerClick}
    >
      <div className="flex items-center gap-1.5 border-b border-[var(--brand-border)] px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
        <span className="ml-2 text-xs text-[var(--brand-muted)]">visitor@fetching.design</span>
      </div>

      <div
        ref={outputRef}
        data-testid="terminal-output"
        aria-live="polite"
        className="min-h-0 flex-1 overflow-y-auto px-3 py-2"
      >
        {output.map((line, i) => (
          <div key={i} className={lineColors[line.type] ?? 'text-[var(--brand-muted)]'}>
            {line.text || '\u00A0'}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 border-t border-[var(--brand-border)] px-3 py-2">
        <span className="text-[var(--brand-clay)]">$</span>
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent text-[var(--brand-platinum)] outline-none placeholder:text-[var(--brand-muted)]"
            style={{ caretColor: 'transparent' }}
            placeholder="type 'help' for commands..."
            onKeyDown={handleKeyDown}
            onChange={handleInput}
            autoComplete="off"
            spellCheck={false}
            aria-label="Terminal input"
          />
          <span className="pointer-events-none absolute inset-0 flex items-center">
            <span className="invisible whitespace-pre font-mono text-sm">{inputValue}</span>
            <span className="terminal-cursor">_</span>
          </span>
        </div>
      </div>
    </div>
  )
}
