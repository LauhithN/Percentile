import './globals.css'
import type { Metadata } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans'
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
})

export const metadata: Metadata = {
  title: 'Percentile ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Cognitive Tests',
  description: 'Viral cognitive tests that rank your reaction, memory, and focus.'
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} min-h-screen bg-ink text-white antialiased`}>
        {children}
      </body>
    </html>
  )
}

