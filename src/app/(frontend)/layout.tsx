import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React, { Suspense } from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
//import Navbar from '@/components/products/Navbar'
import { Footer } from '@/Footer/Component'
import { ReduxProviders } from './redux/providers'
import { Toaster } from 'sonner'
import { LoaderIcon } from 'lucide-react'
//import Footer from '@/components/products/Footer'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <ReduxProviders>
      <Suspense fallback={<LoaderIcon />}>
        <html
          className={cn(GeistSans.variable, GeistMono.variable)}
          lang="en"
          suppressHydrationWarning
        >
          <head>
            <InitTheme />
            <link href="/favicon.ico" rel="icon" sizes="32x32" />
            <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
          </head>
          <body>
            <Toaster />
            <Providers>
              <AdminBar
                adminBarProps={{
                  preview: isEnabled,
                }}
              />
              {/*<Navbar />*/}
              <Header />
              {children}
              <Footer />
              {/* <Footer /> */}
            </Providers>
          </body>
        </html>
      </Suspense>
    </ReduxProviders>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
