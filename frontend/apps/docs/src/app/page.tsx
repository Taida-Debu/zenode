import Link from 'next/link';
import { DocCard, DocCardGrid, DocSection } from '@/components/docs-ui';

export default function DocsHomePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">LazyDev documentation</h1>
        <p className="text-gray-400 text-lg leading-relaxed max-w-3xl">
          Learn how LazyDev works and how to contribute to open source with structure, visibility,
          and rewards. These guides are for <strong className="text-white">contributors</strong> and{' '}
          <strong className="text-white">maintainers</strong> using the platform—not internal
          engineering runbooks.
        </p>
      </div>

      <DocSection title="What is LazyDev?">
        <p>
          LazyDev turns open-source work into gamified <strong className="text-white">challenges</strong>{' '}
          on real GitHub repositories. You connect a wallet, link GitHub, find work (including via
          AI recommendations), open pull requests as usual, and get credit—XP, portfolio proof, and
          token rewards where a challenge offers them.
        </p>
      </DocSection>

      <DocSection title="What you will learn here">
        <ul className="list-disc list-inside space-y-2">
          <li>How to sign up and make your first contribution</li>
          <li>How challenges, rewards, and proposals work</li>
          <li>How dashboard features (search, analytics, playground) help you</li>
          <li>How GitHub PRs are linked to your LazyDev profile</li>
          <li>Answers to common questions in the FAQ</li>
        </ul>
      </DocSection>

      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Guides</h2>
        <DocCardGrid>
          <DocCard href="/getting-started" title="Getting started">
            Wallet, GitHub profile, first challenge, and syncing your first PR.
          </DocCard>
          <DocCard href="/how-it-works" title="How it works">
            The full contributor journey and how rewards fit in.
          </DocCard>
          <DocCard href="/features" title="Features">
            Dashboard, AI search, contributions, learn paths, and playground.
          </DocCard>
          <DocCard href="/challenges" title="Challenges & rewards">
            Joining challenges, XP, USDC, LZD, and submitting proposals.
          </DocCard>
          <DocCard href="/github" title="GitHub contributions">
            Username, tracked repos, and PR sync explained plainly.
          </DocCard>
          <DocCard href="/faq" title="FAQ">
            Common questions about wallets, payouts, and attribution.
          </DocCard>
        </DocCardGrid>
      </div>

      <p className="text-gray-500 text-sm">
        Want to contribute on GitHub today?{' '}
        <Link href="/getting-started" className="text-green-400 underline hover:text-green-300">
          Start with Getting started
        </Link>{' '}
        or use <strong className="text-gray-400">Launch app</strong> in the header.
      </p>
    </div>
  );
}
