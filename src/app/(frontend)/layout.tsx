import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { Inter, JetBrains_Mono } from 'next/font/google'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Providers } from '@/providers'
import { TerminalProvider } from '@/components/Terminal/TerminalProvider'
import { TerminalFAB } from '@/components/Terminal/TerminalFAB'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { JsonLd } from '@/components/StructuredData/JsonLd'
import { WebSiteSchema } from '@/components/StructuredData/WebSiteSchema'
import { PersonSchema } from '@/components/StructuredData/PersonSchema'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html
      className={cn(inter.variable, jetbrainsMono.variable)}
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <JsonLd data={WebSiteSchema()} />
        <JsonLd data={PersonSchema()} />
      </head>
      <body className="bg-[var(--brand-black)] text-[var(--brand-platinum)]">
        <Providers>
          <TerminalProvider>
            <AdminBar
              adminBarProps={{
                preview: isEnabled,
              }}
            />
            <LivePreviewListener />

            <Header />
            {children}
            <Footer />

            <TerminalFAB />
          </TerminalProvider>
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: {
    default: 'fetching.design',
    template: '%s | fetching.design',
  },
  description: 'Custom web application development by Max Lemos.',
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@maxlemos',
  },
}
