import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ParticleConnectkit } from '@/components/ParticleConnectkit'
import { ClientLayout } from '@/components/layout/ClientLayout'
import ReduxProvider from '@/context/redux/provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
   title: 'LazyDev - Gamified Open Source Contributions',
   description: 'Earn USDC and LZD tokens by contributing to open source projects through challenges and competitions.',
   icons: {
      icon: [
         { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
         { url: '/logo.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: '/logo.png',
   },
}

export default function RootLayout({
   children,
}: {
   children: React.ReactNode
}) {
   return (
      <html lang="en">
         <body className={inter.className}>
            <ReduxProvider>
               <ParticleConnectkit>
                  <ClientLayout>
                     {children}
                  </ClientLayout>
               </ParticleConnectkit>
            </ReduxProvider>
         </body>
      </html>
   )
} 