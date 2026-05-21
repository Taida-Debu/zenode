'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { Code } from 'lucide-react';
import { useEffect, useState } from 'react';
import { isConnectKitConfigured } from '@/context/connect';

const WalletConnectButton = dynamic(
  () => import('./WalletConnectButton').then((m) => m.WalletConnectButton),
  { ssr: false }
);

function FallbackWalletSection() {
  return (
    <Link
      href="/dashboard"
      className="bg-gradient-to-r from-green-400 to-cyan-400 text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
    >
      Dashboard
    </Link>
  );
}

export function Navbar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showWallet = mounted && isConnectKitConfigured;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <nav className="bg-black/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 h-20">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/logo.png"
              alt="LazyDev"
              width={40}
              height={40}
              className="rounded-lg h-10 w-auto object-contain"
              style={{ height: 'auto', maxHeight: 40 }}
              priority
            />
            <span className="text-2xl font-bold gradient-text">LazyDev</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/how-it-works" className="text-gray-300 hover:text-white transition-colors">
              How it Works
            </Link>
            <Link href="/learn-to-earn" className="text-gray-300 hover:text-white transition-colors">
              Learn to Earn
            </Link>
            <Link href="/play-ground" className="text-gray-300 hover:text-white transition-colors flex items-center">
              <Code className="w-4 h-4 mr-2" />
              Playground
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {showWallet ? <WalletConnectButton /> : <FallbackWalletSection />}
          </div>
        </div>
      </nav>
    </div>
  );
}
