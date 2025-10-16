import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { AppProvider } from './providers'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Roboto } from 'next/font/google'

const roboto = Roboto({ subsets: ['latin'], weight: ['300', '400', '500', '700'] })

export const metadata: Metadata = {
  title: 'Golffox Management Panel',
  description: 'Sistema de gestão e rastreamento de veículos Golffox',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Removido link externo de fontes, usando next/font */}
      </head>
      <body className={`${roboto.className} font-sans antialiased`}>
        <Script
          id="process-polyfill"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Polyfill for process.env to prevent app crash on load
              window.process = window.process || { env: {} };
            `,
          }}
        />
        <AppProvider>
          {children}
        </AppProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}