'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Terminal } from '@/components/Terminal/Terminal'

export function Hero() {
  const shimmerRef = useRef<HTMLSpanElement>(null)
  const [shimmerActive, setShimmerActive] = useState(false)

  useEffect(() => {
    const el = shimmerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShimmerActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="container py-16 md:py-24">
      <div className="grid gap-10 md:grid-cols-2 md:items-stretch">
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-bold tracking-tight text-[var(--brand-platinum)] md:text-5xl lg:text-6xl">
            I build{' '}
            <span
              ref={shimmerRef}
              className={`hero-shimmer ${shimmerActive ? 'hero-shimmer--active' : ''}`}
            >
              web applications
            </span>{' '}
            that deliver.
          </h1>
          <p className="mt-4 text-lg text-[var(--brand-muted)] md:text-xl">
            Full-stack development with modern tools. From concept to deployment.
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              href="/projects"
              className="rounded-lg bg-[var(--brand-clay)] px-5 py-2.5 text-sm font-medium text-[var(--brand-black)] transition-opacity hover:opacity-90"
            >
              View Projects
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-[var(--brand-border)] px-5 py-2.5 text-sm font-medium text-[var(--brand-platinum)] transition-colors hover:border-[var(--brand-clay)]"
            >
              Get in Touch
            </Link>
          </div>
        </div>

        <div className="hidden md:block">
          <Terminal />
        </div>
      </div>
    </section>
  )
}
