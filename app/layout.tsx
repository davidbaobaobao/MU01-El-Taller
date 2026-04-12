import type { Metadata } from 'next'
import { Noto_Serif, Be_Vietnam_Pro } from 'next/font/google'
import './globals.css'

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'El Taller — Estudio de Cerámica Barcelona',
    template: '%s — El Taller Barcelona',
  },
  description:
    'Talleres de cerámica en el corazón de Gràcia, Barcelona. Sesiones para grupos, parejas y artistas en solitario. Sin experiencia previa necesaria.',
  keywords: ['cerámica barcelona', 'taller cerámica', 'gracia barcelona', 'pottery barcelona', 'taller alfarería'],
  openGraph: {
    siteName: 'El Taller Barcelona',
    locale: 'es_ES',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${notoSerif.variable} ${beVietnamPro.variable}`}>
      <body>
        {/* Grain overlay — "The Tactile Archivist" texture */}
        <div className="grain-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  )
}
