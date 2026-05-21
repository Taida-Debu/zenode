'use client';

import Link from 'next/link';
import { ArrowLeft, BookOpen, Compass, Home, Rocket } from 'lucide-react';

export type NotFoundPageProps = {
  homeHref: string;
  appHref: string;
  docsHref: string;
  /** e.g. "dashboard", "docs", "marketing" */
  context?: string;
};

export function NotFoundPage({ homeHref, appHref, docsHref, context }: NotFoundPageProps) {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden px-4 py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(74, 222, 128, 0.25), transparent), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(34, 211, 238, 0.12), transparent)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        aria-hidden
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 w-full max-w-2xl text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/15 border border-green-500/30 mb-8 floating">
          <Compass className="w-8 h-8 text-green-400" />
        </div>

        <p className="text-8xl md:text-9xl font-black tracking-tighter gradient-text leading-none mb-2">
          404
        </p>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
          This page drifted off-chain
        </h1>
        <p className="text-gray-400 text-lg mb-2 max-w-md mx-auto">
          {context
            ? `We couldn't find that route in the ${context} app.`
            : "The URL may be wrong, expired, or never minted."}
        </p>
        <p className="text-sm text-gray-500 mb-10">
          Pick a destination below and keep building.
        </p>

        <div className="glass-effect rounded-2xl p-6 md:p-8 border border-white/10 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href={homeHref}
              className="group flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-black/40 p-4 hover:border-green-500/40 hover:bg-green-500/5 transition-all"
            >
              <Home className="w-5 h-5 text-green-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-white">Home</span>
              <span className="text-xs text-gray-500">Marketing</span>
            </Link>
            <Link
              href={appHref}
              className="group flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-black/40 p-4 hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all"
            >
              <Rocket className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-white">App</span>
              <span className="text-xs text-gray-500">Dashboard</span>
            </Link>
            <Link
              href={docsHref}
              className="group flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-black/40 p-4 hover:border-green-500/40 hover:bg-green-500/5 transition-all"
            >
              <BookOpen className="w-5 h-5 text-green-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-white">Docs</span>
              <span className="text-xs text-gray-500">Guides</span>
            </Link>
          </div>

          <Link
            href={homeHref}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back to safety
          </Link>
        </div>
      </div>
    </div>
  );
}
