'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, ChevronRight } from 'lucide-react';
import { appPath } from '@zenode/ui/urls';

const nav = [
  { href: '/', label: 'Introduction' },
  { href: '/getting-started', label: 'Getting started' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/features', label: 'Features' },
  { href: '/challenges', label: 'Challenges & rewards' },
  { href: '/github', label: 'GitHub contributions' },
  { href: '/faq', label: 'FAQ' },
] as const;

export function DocsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <header className="border-b border-white/10 bg-black/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold gradient-text">
            <BookOpen className="w-5 h-5 text-green-400" />
            LazyDev Docs
          </Link>
          <Link
            href={appPath('/dashboard')}
            className="text-sm text-green-400 hover:text-green-300 flex items-center gap-1"
          >
            Launch app <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </header>
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 flex gap-8">
        <aside className="w-56 shrink-0 hidden md:block">
          <nav className="space-y-1 sticky top-24">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-lg text-sm ${
                  pathname === item.href
                    ? 'bg-green-500/20 text-green-400'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <article className="flex-1 min-w-0 prose-docs">{children}</article>
      </div>
    </div>
  );
}
