/**
 * Vercel Warm palette and brand configuration for fetching.design
 */

export const PALETTE = {
  black: '#000000',
  onyx: '#141414',
  clay: '#D4A052',
  grey: '#666666',
  platinum: '#EBEBEB',
  // Derived values
  cardBg: '#1A1A1A',
  border: '#2A2A2A',
  mutedText: '#888888',
  success: '#4ADE80',
} as const

export const BRAND_CSS_VARS = {
  '--brand-black': PALETTE.black,
  '--brand-onyx': PALETTE.onyx,
  '--brand-clay': PALETTE.clay,
  '--brand-grey': PALETTE.grey,
  '--brand-platinum': PALETTE.platinum,
  '--brand-card': PALETTE.cardBg,
  '--brand-border': PALETTE.border,
  '--brand-muted': PALETTE.mutedText,
  '--brand-success': PALETTE.success,
} as const

export const FONTS = {
  sans: 'Inter',
  mono: 'JetBrains Mono',
} as const
