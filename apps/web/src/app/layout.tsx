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
    template: '%s | La Belle Infini',
    default: 'La Belle Infini — Beleza & Estética em Florianópolis',
  },
  description:
    'Espaço completo de beleza em Ingleses, Florianópolis. Maquiagem profissional, unhas, bronzeamento, estética e muito mais. Agende online!',
  keywords: ['clínica estética', 'agendamento online', 'facial', 'cílios', 'sobrancelhas', 'beleza'],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'La Belle Infini',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${cormorant.variable} ${playfair.variable} ${poppins.variable}`}
    >
      <body className="bg-white antialiased overflow-x-hidden">{children}</body>
    </html>
  )
}
