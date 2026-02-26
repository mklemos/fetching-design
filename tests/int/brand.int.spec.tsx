import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { PALETTE, BRAND_CSS_VARS, FONTS } from '@/lib/brand'
import { cn } from '@/utilities/ui'
import { Logo } from '@/components/Logo/Logo'

describe('Brand tokens', () => {
  it('exports all 9 CSS custom property values', () => {
    const vars = Object.keys(BRAND_CSS_VARS)
    expect(vars).toHaveLength(9)
    expect(vars).toContain('--brand-black')
    expect(vars).toContain('--brand-onyx')
    expect(vars).toContain('--brand-clay')
    expect(vars).toContain('--brand-grey')
    expect(vars).toContain('--brand-platinum')
    expect(vars).toContain('--brand-card')
    expect(vars).toContain('--brand-border')
    expect(vars).toContain('--brand-muted')
    expect(vars).toContain('--brand-success')
  })

  it('palette values are valid hex colors', () => {
    const hexRegex = /^#[0-9A-Fa-f]{6}$/
    for (const value of Object.values(PALETTE)) {
      expect(value).toMatch(hexRegex)
    }
  })

  it('CSS var values match palette', () => {
    expect(BRAND_CSS_VARS['--brand-black']).toBe(PALETTE.black)
    expect(BRAND_CSS_VARS['--brand-clay']).toBe(PALETTE.clay)
    expect(BRAND_CSS_VARS['--brand-platinum']).toBe(PALETTE.platinum)
  })

  it('fonts config specifies Inter and JetBrains Mono', () => {
    expect(FONTS.sans).toBe('Inter')
    expect(FONTS.mono).toBe('JetBrains Mono')
  })
})

describe('Logo component', () => {
  it('renders an SVG element', () => {
    const { container } = render(<Logo />)
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
  })

  it('contains the [) motif text', () => {
    const { container } = render(<Logo />)
    const textContent = container.textContent
    expect(textContent).toContain('fetching')
    expect(textContent).toContain('[)')
    expect(textContent).toContain('esign')
  })

  it('has a blinking cursor element', () => {
    const { container } = render(<Logo />)
    const cursor = container.querySelector('[data-cursor]')
    expect(cursor).toBeTruthy()
  })

  it('accepts className prop', () => {
    const { container } = render(<Logo className="custom-class" />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('class')).toContain('custom-class')
  })
})

describe('cn() utility', () => {
  it('merges Tailwind classes correctly', () => {
    const result = cn('px-4 py-2', 'px-8')
    expect(result).toContain('px-8')
    expect(result).toContain('py-2')
    expect(result).not.toContain('px-4')
  })

  it('handles conditional classes', () => {
    const result = cn('base', false && 'hidden', 'extra')
    expect(result).toBe('base extra')
  })

  it('handles undefined and null', () => {
    const result = cn('base', undefined, null, 'extra')
    expect(result).toBe('base extra')
  })
})
