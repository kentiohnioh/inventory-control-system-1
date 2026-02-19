import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Providers } from './providers'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Inventory Control System',
  description: 'Production-ready inventory management system for retail and warehouse operations',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/ICS Logo.png',
        type: 'image/png',
        sizes: '32x32',
      },
    ],
    apple: '/ICS Logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}