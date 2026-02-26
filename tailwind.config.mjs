/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
    extend: {
      colors: {
        brand: {
          black: 'var(--brand-black)',
          onyx: 'var(--brand-onyx)',
          clay: 'var(--brand-clay)',
          grey: 'var(--brand-grey)',
          platinum: 'var(--brand-platinum)',
          card: 'var(--brand-card)',
          border: 'var(--brand-border)',
          muted: 'var(--brand-muted)',
          success: 'var(--brand-success)',
        },
      },
      typography: () => ({
        DEFAULT: {
          css: [
            {
              '--tw-prose-body': 'var(--foreground)',
              '--tw-prose-headings': 'var(--foreground)',
              '--tw-prose-links': 'var(--brand-clay)',
              '--tw-prose-code': 'var(--brand-clay)',
              h1: {
                fontWeight: 'normal',
                marginBottom: '0.25em',
              },
            },
          ],
        },
        base: {
          css: [
            {
              h1: {
                fontSize: '2.5rem',
              },
              h2: {
                fontSize: '1.25rem',
                fontWeight: 600,
              },
            },
          ],
        },
        md: {
          css: [
            {
              h1: {
                fontSize: '3.5rem',
              },
              h2: {
                fontSize: '1.5rem',
              },
            },
          ],
        },
      }),
    },
  },
}

export default config
