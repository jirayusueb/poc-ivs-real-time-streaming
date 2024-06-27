import type { Metadata } from 'next'
import { IBM_Plex_Sans_Thai as FontSans } from 'next/font/google'
import './globals.css'

const fontSans = FontSans({ subsets: ['latin', 'thai'], weight: ['300', '400', '500', '600', '700'] })

export const metadata: Metadata = {
  title: 'IVS Web Broadcast Stages Example',
  description: 'IVS Web Broadcast Stages Example',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={fontSans.className}>{children}</body>
    </html>
  )
}
