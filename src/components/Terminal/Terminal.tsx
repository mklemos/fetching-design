'use client'

import { useRef, useCallback } from 'react'
import { useTerminal } from './TerminalProvider'

export function Terminal() {
  const { output, executeCommand, history, historyIndex, setHistoryIndex } = useTerminal()
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

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
          setTimeout(scrollToBottom, 0)
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (history.length > 0) {
          const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
          setHistoryIndex(newIndex)
          input.value = history[newIndex]
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (historyIndex !== -1) {
          const newIndex = historyIndex + 1
          if (newIndex >= history.length) {
            setHistoryIndex(-1)
            input.value = ''
          } else {
            setHistoryIndex(newIndex)
            input.value = history[newIndex]
          }
        }
      }
    },
    [executeCommand, history, historyIndex, setHistoryIndex, scrollToBottom],
  )

  const handleContainerClick = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div
      data-testid="terminal"
      className="flex flex-col rounded-lg border border-[var(--brand-border)] bg-[var(--brand-black)] font-mono text-sm"
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
        className="max-h-[300px] overflow-y-auto px-3 py-2"
      >
        {output.map((line, i) => (
          <div
            key={i}
            className={
              line.type === 'input'
                ? 'text-[var(--brand-platinum)]'
                : line.type === 'error'
                  ? 'text-red-400'
                  : line.type === 'info'
                    ? 'text-[var(--brand-clay)]'
                    : 'text-[var(--brand-muted)]'
            }
          >
            {line.text || '\u00A0'}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 border-t border-[var(--brand-border)] px-3 py-2">
        <span className="text-[var(--brand-clay)]">$</span>
        <input
          ref={inputRef}
          type="text"
          className="flex-1 bg-transparent text-[var(--brand-platinum)] outline-none placeholder:text-[var(--brand-muted)]"
          placeholder="type 'help' for commands..."
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck={false}
          aria-label="Terminal input"
        />
      </div>
    </div>
  )
}
