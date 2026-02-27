'use client'

import { useRef, useCallback } from 'react'
import { useTerminal } from './TerminalProvider'
import type { OutputLine } from './lib/types'

const lineColors: Record<string, string> = {
  input: 'text-[var(--brand-platinum)]',
  output: 'text-[#999]',
  error: 'text-[#ff5f57]',
  info: 'text-[var(--brand-clay)]',
  success: 'text-[#8bb88a]',
  accent: 'text-[var(--brand-clay)]',
}

function OutputLineContent({ line }: { line: OutputLine }) {
  if (line.segments) {
    return (
      <>
        {line.segments.map((seg, j) => (
          <span key={j} className={lineColors[seg.type] ?? 'text-[#999]'}>
            {seg.text}
          </span>
        ))}
      </>
    )
  }
  return <>{line.text || '\u00A0'}</>
}

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
      className="flex h-full flex-col rounded-lg border border-[#222220] bg-[#111110] font-mono text-[13px]"
      onClick={handleContainerClick}
    >
      <div className="flex items-center gap-2 border-b border-[#222220] bg-[#151513] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-xs text-[var(--brand-muted)]">visitor@fetching.design</span>
      </div>

      <div
        ref={outputRef}
        data-testid="terminal-output"
        aria-live="polite"
        className="min-h-0 flex-1 overflow-y-auto px-5 py-5 leading-[1.8]"
      >
        {output.map((line, i) => (
          <div key={i} className={line.segments ? '' : (lineColors[line.type] ?? 'text-[#999]')}>
            <OutputLineContent line={line} />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 border-t border-[#222220] px-5 py-3">
        <span className="text-[var(--brand-clay)]">~ $</span>
        <input
          ref={inputRef}
          type="text"
          className="flex-1 bg-transparent text-[var(--brand-platinum)] caret-[var(--brand-clay)] outline-none placeholder:text-[var(--brand-muted)]"
          placeholder=""
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck={false}
          aria-label="Terminal input"
        />
      </div>
    </div>
  )
}
