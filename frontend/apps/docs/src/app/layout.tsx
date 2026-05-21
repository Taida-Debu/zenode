import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@zenode/ui/globals.css';
import { DocsShell } from '@/components/DocsShell';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LazyDev Documentation',
  description: 'High-level and detailed documentation for the LazyDev platform.',
};

export default function DocsRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DocsShell>{children}</DocsShell>
      </body>
    </html>
  );
}
