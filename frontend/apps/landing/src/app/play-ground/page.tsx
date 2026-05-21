import Link from 'next/link';
import {
  Code,
  ChevronRight,
  GitPullRequest,
  Network,
  Trophy,
  Sparkles,
  Terminal,
  Zap,
  Shield,
  LucideIcon,
} from 'lucide-react';
import { FeatureCard } from '@zenode/ui/cards';
import { appPath } from '@zenode/ui/urls';

interface PlaygroundZoneProps {
  icon: LucideIcon;
  title: string;
  description: string;
  stats: string;
  href: string;
}

function PlaygroundZoneCard({ icon: Icon, title, description, stats, href }: PlaygroundZoneProps) {
  return (
    <Link
      href={href}
      className="glass-effect p-6 sm:p-8 rounded-xl hover:bg-white/5 transition-all duration-300 group block h-full"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-green-500/20 rounded-lg shrink-0">
          <Icon className="w-6 h-6 text-green-400" />
        </div>
        <div className="min-w-0">
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-green-300 transition-colors">
            {title}
          </h3>
          <p className="text-gray-400 text-sm sm:text-base">{description}</p>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-green-400/90 font-medium">{stats}</span>
        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}

const playgroundZones: PlaygroundZoneProps[] = [
  {
    icon: Code,
    title: 'Code Editor',
    description: 'Write, run, and iterate on Solidity and TypeScript in a live sandbox.',
    stats: 'Live environment',
    href: appPath('/playground/editor'),
  },
  {
    icon: GitPullRequest,
    title: 'Smart Contracts',
    description: 'Deploy templates, test on local chains, and inspect contract state.',
    stats: '24 templates',
    href: appPath('/playground/smart-contracts'),
  },
  {
    icon: Network,
    title: 'Web3 Integration',
    description: 'Connect wallets, call RPCs, and prototype dApp flows safely.',
    stats: '18 integration tools',
    href: appPath('/playground/web3'),
  },
  {
    icon: Trophy,
    title: 'Challenges',
    description: 'Timed coding missions with XP rewards tied to real repo skills.',
    stats: '12 active challenges',
    href: appPath('/playground/challenges'),
  },
];

const highlights = [
  {
    icon: Terminal,
    title: 'No setup friction',
    description: 'Open the app playground and start coding—no local Foundry install required to try basics.',
  },
  {
    icon: Shield,
    title: 'Safe to experiment',
    description: 'Sandboxed environments so you can break things, learn, and reset without touching mainnet.',
  },
  {
    icon: Zap,
    title: 'Ship to real repos',
    description: 'Skills you practice here map to LazyDev challenges and open-source contributions.',
  },
];

export default function PlayGroundPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 sm:pt-32 px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/10 text-green-400 mb-6">
              <Sparkles className="w-4 h-4 mr-2 shrink-0" />
              <span className="text-sm sm:text-base">Practice before you contribute</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
              Code <span className="gradient-text green-glow">Playground</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto px-2">
              Experiment with smart contracts, Web3 APIs, and daily challenges in one place—then
              take what you learn straight into paid open-source work on LazyDev.
            </p>
          </div>

          {/* Zones grid */}
          <div className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-center sm:text-left">
              Choose your zone
            </h2>
            <p className="text-gray-400 mb-8 text-center sm:text-left">
              Each area opens inside the app with tools tuned for that workflow.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {playgroundZones.map((zone) => (
                <PlaygroundZoneCard key={zone.title} {...zone} />
              ))}
            </div>
          </div>

          {/* Mock editor preview */}
          <div className="glass-effect rounded-xl overflow-hidden mb-12 sm:mb-16 border border-green-500/10">
            <div className="flex items-center gap-2 px-4 py-3 bg-black/40 border-b border-white/5">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-xs text-gray-500 font-mono">playground/editor</span>
            </div>
            <pre className="p-4 sm:p-6 text-xs sm:text-sm text-gray-400 font-mono overflow-x-auto leading-relaxed">
{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract LazyDevBadge {
    mapping(address => bool) public contributors;

    function mint(address dev) external {
        contributors[dev] = true;
        // Deploy & test in the playground → earn on mainnet repos
    }
}`}
            </pre>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 sm:mb-16">
            {highlights.map((item) => (
              <FeatureCard key={item.title} {...item} />
            ))}
          </div>

          {/* CTA */}
          <div className="text-center glass-effect p-8 sm:p-12 rounded-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to build?</h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Launch the full playground in the app—connect your wallet when you are ready to
              earn from real contributions.
            </p>
            <Link
              href={appPath('/playground')}
              className="magical-border text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 inline-flex items-center group"
            >
              <span className="relative z-10 flex items-center">
                Open Playground
                <ChevronRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
