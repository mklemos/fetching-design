import Link from 'next/link'
import React from 'react'

export default function NotFound() {
  return (
    <div className="container flex flex-1 items-center justify-center py-16">
      <div className="w-full max-w-lg rounded-lg border border-[var(--brand-border)] bg-[var(--brand-black)] font-mono text-sm">
        <div className="flex items-center gap-1.5 border-b border-[var(--brand-border)] px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
          <span className="ml-2 text-xs text-[var(--brand-muted)]">visitor@fetching.design</span>
        </div>
        <div className="space-y-2 px-4 py-4">
          <p className="text-[var(--brand-platinum)]">
            <span className="text-[var(--brand-clay)]">$</span> fetch this-page
          </p>
          <p className="text-red-400">Error 404: Resource not found</p>
          <p className="text-[var(--brand-muted)]">
            The requested path does not exist on this server.
          </p>
          <div className="pt-2">
            <p className="text-[var(--brand-platinum)]">
              <span className="text-[var(--brand-clay)]">$</span> fetch home
            </p>
            <p className="text-[var(--brand-muted)]">
              Redirecting...{' '}
              <Link
                href="/"
                className="text-[var(--brand-clay)] underline underline-offset-2 transition-colors hover:text-[var(--brand-platinum)]"
              >
                Go home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
