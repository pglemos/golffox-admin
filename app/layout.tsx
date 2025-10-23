import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { AppProvider } from './providers'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Plus_Jakarta_Sans } from 'next/font/google'

const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800'] })

export const metadata: Metadata = {
  title: 'Golffox Experience Platform',
  description: 'Sistema de gestão, experiência e rastreamento de mobilidade executiva Golffox.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head />
      <body className={`${plusJakarta.className} bg-golffox-base text-golffox-foreground antialiased`}>
        <Script
          id="process-polyfill"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.process = window.process || { env: {} };
            `,
          }}
        />
        <AppProvider>
          <div className="relative flex min-h-screen flex-col overflow-hidden">
            <div className="pointer-events-none fixed inset-0 -z-10">
              <div className="absolute inset-x-0 top-[-30%] h-[60vh] bg-[radial-gradient(circle_at_center,_rgba(115,108,255,0.35),_transparent_65%)] blur-3xl" />
              <div className="absolute right-[-10%] top-[20%] h-[40vh] w-[40vw] rounded-full bg-[radial-gradient(circle,_rgba(0,180,255,0.25),_transparent_70%)] blur-3xl" />
              <div className="absolute bottom-[-25%] left-[-10%] h-[50vh] w-[50vw] rounded-full bg-[radial-gradient(circle,_rgba(255,70,84,0.28),_transparent_72%)] blur-3xl" />
            </div>
            {children}
          </div>
        </AppProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}
