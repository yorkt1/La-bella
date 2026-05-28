import type { Metadata } from 'next'
import { Poppins, Playfair_Display, Cormorant_Garamond } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-poppins',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-playfair',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | La Bella Infiní Admin',
    default: 'Painel Admin | La Bella Infiní',
  },
  description: 'Painel administrativo da La Bella Infiní',
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${poppins.variable} ${playfair.variable} ${cormorant.variable}`}
    >
      <body className="bg-[#FDFAF8] antialiased">{children}</body>
    </html>
  )
}
