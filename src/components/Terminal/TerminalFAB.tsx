'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useTerminal } from './TerminalProvider'
import { Terminal } from './Terminal'

export function TerminalFAB() {
  const { mode, toggleOverlay } = useTerminal()

  if (mode === 'hero') return null

  return (
    <>
      <AnimatePresence>
        {mode === 'overlay' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 z-50 w-[min(480px,calc(100vw-2rem))]"
          >
            <Terminal />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={toggleOverlay}
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--brand-border)] bg-[var(--brand-onyx)] text-[var(--brand-clay)] shadow-lg transition-colors hover:border-[var(--brand-clay)]"
        aria-label={mode === 'overlay' ? 'Close terminal' : 'Open terminal'}
      >
        <span className="font-mono text-sm font-bold">{mode === 'overlay' ? '×' : '>_'}</span>
      </button>
    </>
  )
}
