import type { Metadata } from 'next'
import { Cormorant_Garamond, Playfair_Display, Poppins } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-playfair',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | La Bella Infiní',
    default: 'La Bella Infiní — Clínica Estética Premium',
  },
  description:
    'Tratamentos estéticos de alto padrão com agendamento online 24h. Facial, cílios, sobrancelhas e muito mais. Agende agora!',
  keywords: ['clínica estética', 'agendamento online', 'facial', 'cílios', 'sobrancelhas', 'beleza'],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'La Bella Infiní',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${cormorant.variable} ${playfair.variable} ${poppins.variable}`}
    >
      <body className="bg-white antialiased">{children}</body>
    </html>
  )
}
