'use client';

import Link from 'next/link';
import { Award } from 'lucide-react';
import { appPath, docsPath, landingPath } from '../urls';

const legal = {
  privacy: appPath('/privacy'),
  terms: appPath('/terms'),
};

export function MarketingFooter() {
  return (
    <footer className="w-full border-t border-white/10 bg-black/30 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href={landingPath('/')} className="flex items-center space-x-2">
              <div className="p-2 rounded-lg">
                <Award className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-xl font-bold">LazyDev</span>
            </Link>
            <p className="text-sm text-gray-400">
              Gamified open-source contributions with real rewards.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href={landingPath('/how-it-works')} className="text-sm text-gray-400 hover:text-white">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href={landingPath('/learn-to-earn')} className="text-sm text-gray-400 hover:text-white">
                  Learn to Earn
                </Link>
              </li>
              <li>
                <Link href={appPath('/dashboard')} className="text-sm text-gray-400 hover:text-white">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href={docsPath('/')} className="text-sm text-gray-400 hover:text-white">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href={landingPath('/contact')} className="text-sm text-gray-400 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href={legal.privacy} className="text-sm text-gray-400 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href={legal.terms} className="text-sm text-gray-400 hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div
          className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-gray-400"
          suppressHydrationWarning
        >
          © {new Date().getFullYear()} LazyDev. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
