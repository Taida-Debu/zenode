import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@zenode/ui/globals.css';
import { MarketingNavbar } from '@zenode/ui/navbar';
import { MarketingFooter } from '@zenode/ui/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LazyDev — Gamified Open Source in Web3',
  description:
    'Turn open-source contributions into rewards. Join challenges, earn XP, and ship with LazyDev.',
  icons: {
    icon: [{ url: '/favicon.png', sizes: '32x32', type: 'image/png' }],
    apple: '/logo.png',
  },
};

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-black`}>
        <MarketingNavbar />
        <main className="flex-grow">{children}</main>
        <MarketingFooter />
      </body>
    </html>
  );
}
