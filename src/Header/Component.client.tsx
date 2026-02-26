'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { Logo } from '@/components/Logo/Logo'

const navLinks = [
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/posts' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export const HeaderClient: React.FC = () => {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-colors ${
        scrolled
          ? 'border-b border-[var(--brand-border)] bg-[var(--brand-black)]/95 backdrop-blur-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="container flex items-center justify-between py-4">
        <Link href="/" aria-label="Home">
          <Logo className="w-[180px] h-[28px]" />
        </Link>

        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          {navLinks.map(({ label, href }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className={`text-sm transition-colors ${
                  isActive
                    ? 'text-[var(--brand-clay)]'
                    : 'text-[var(--brand-muted)] hover:text-[var(--brand-platinum)]'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          <span
            className={`block h-0.5 w-5 bg-[var(--brand-platinum)] transition-transform ${mobileOpen ? 'translate-y-2 rotate-45' : ''}`}
          />
          <span
            className={`block h-0.5 w-5 bg-[var(--brand-platinum)] transition-opacity ${mobileOpen ? 'opacity-0' : ''}`}
          />
          <span
            className={`block h-0.5 w-5 bg-[var(--brand-platinum)] transition-transform ${mobileOpen ? '-translate-y-2 -rotate-45' : ''}`}
          />
        </button>
      </div>

      {mobileOpen && (
        <nav
          className="md:hidden border-t border-[var(--brand-border)] bg-[var(--brand-black)]"
          aria-label="Mobile navigation"
        >
          <div className="container flex flex-col gap-4 py-4">
            {navLinks.map(({ label, href }) => {
              const isActive = pathname === href || pathname.startsWith(href + '/')
              return (
                <Link
                  key={href}
                  href={href}
                  className={`text-sm ${
                    isActive
                      ? 'text-[var(--brand-clay)]'
                      : 'text-[var(--brand-muted)] hover:text-[var(--brand-platinum)]'
                  }`}
                >
                  {label}
                </Link>
              )
            })}
          </div>
        </nav>
      )}
    </header>
  )
}
