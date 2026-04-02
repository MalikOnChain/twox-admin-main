import { Viewport } from 'next'
import { Outfit } from 'next/font/google'
import { Suspense } from 'react'
import { Toaster } from 'sonner'

import './globals.css'

import { AuthProvider } from '@/context/AuthContext'
import { PermissionProvider } from '@/context/PermissionContext'
import { SidebarProvider } from '@/context/SidebarContext'
import { ThemeProvider } from '@/context/ThemeContext'

const outfit = Outfit({
  variable: '--font-outfit-sans',
  subsets: ['latin'],
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' className='dark'>
      <body className={`${outfit.variable} dark:bg-gray-900`}>
        <Suspense>
          <AuthProvider>
            <PermissionProvider>
              <ThemeProvider>
                <SidebarProvider>{children}</SidebarProvider>
              </ThemeProvider>
            </PermissionProvider>
          </AuthProvider>
        </Suspense>
        <Toaster richColors position='top-right' />
      </body>
    </html>
  )
}
