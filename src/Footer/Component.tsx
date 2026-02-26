import Link from 'next/link'
import React from 'react'

import { Logo } from '@/components/Logo/Logo'

export async function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-[var(--brand-border)]">
      <div className="container flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" aria-label="Home">
            <Logo className="w-[140px] h-[22px]" />
          </Link>
          <span className="text-xs text-[var(--brand-muted)]">&copy; {year} Max Lemos</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-xs text-[var(--brand-muted)]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--brand-success)]" />
            All systems operational
          </span>
          <a
            href="mailto:max@fetching.design"
            className="text-xs text-[var(--brand-muted)] hover:text-[var(--brand-clay)] transition-colors"
          >
            max@fetching.design
          </a>
        </div>
      </div>
    </footer>
  )
}
