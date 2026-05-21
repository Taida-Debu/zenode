'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Code, Menu, X } from 'lucide-react';
import { appPath, docsPath, landingPath } from '../urls';

const navLinks = [
  { href: landingPath('/how-it-works'), label: 'How it Works' },
  { href: landingPath('/learn-to-earn'), label: 'Learn to Earn' },
  { href: landingPath('/play-ground'), label: 'Playground', icon: Code },
  { href: docsPath('/'), label: 'Docs' },
] as const;

export function MarketingNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <nav className="bg-black/5 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-3 px-4 sm:px-6 lg:px-8 h-16 sm:h-20 min-w-0">
          <Link
            href={landingPath('/')}
            className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0"
            onClick={() => setMenuOpen(false)}
          >
            <Image
              src="/logo.png"
              alt="LazyDev"
              width={40}
              height={40}
              className="rounded-lg h-8 w-8 sm:h-10 sm:w-10 object-contain shrink-0"
              priority
            />
            <span className="text-lg sm:text-2xl font-bold gradient-text truncate">LazyDev</span>
          </Link>

          {/* Desktop nav — lg+ avoids cramped tablet layouts */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-8 min-w-0">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-white transition-colors text-sm xl:text-base whitespace-nowrap flex items-center shrink-0"
              >
                {'icon' in link && link.icon && (
                  <link.icon className="w-4 h-4 mr-1.5 shrink-0" aria-hidden />
                )}
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href={appPath('/dashboard')}
              className="bg-gradient-to-r from-green-400 to-cyan-400 text-white px-3 py-2 sm:px-5 sm:py-2.5 lg:px-6 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105 whitespace-nowrap"
            >
              Launch App
            </Link>
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile / tablet menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-black/90 backdrop-blur-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 px-3 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-base"
                  onClick={() => setMenuOpen(false)}
                >
                  {'icon' in link && link.icon && <link.icon className="w-4 h-4 shrink-0" aria-hidden />}
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
