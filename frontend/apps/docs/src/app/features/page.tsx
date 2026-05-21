import { DocSection } from '@/components/docs-ui';

export default function FeaturesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-3">Features</h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          An overview of what you get inside the LazyDev product app after you connect your wallet.
        </p>
      </div>

      <DocSection title="Dashboard">
        <p>
          Your home base: overview cards, quick links into challenges and search, and high-level
          stats. Sub-pages include <strong className="text-white">Analytics</strong> (charts for
          activity and outcomes), <strong className="text-white">Projects</strong> you follow,
          <strong className="text-white"> Profile</strong>, and{' '}
          <strong className="text-white">Submit proposal</strong> for new community work.
        </p>
      </DocSection>

      <DocSection title="AI project search">
        <p>
          Under <strong className="text-white">Dashboard → Search</strong>, describe what you want to
          work on—language, domain (DeFi, NFTs, infra), difficulty, time budget. The system returns
          ranked repositories and issues plus short rationales. A built-in chat assistant can refine
          queries and explain why a repo is a good match.
        </p>
      </DocSection>

      <DocSection title="Contributions">
        <p>
          Track open-source output in one place:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong className="text-white">My PRs</strong> — synced pull requests tied to your GitHub user</li>
          <li><strong className="text-white">Issues</strong> — work items you are addressing</li>
          <li><strong className="text-white">Rewards</strong> — payouts and XP tied to completed challenges</li>
        </ul>
      </DocSection>

      <DocSection title="Learn">
        <p>
          Curated paths for Web3 fundamentals, smart contract development, and DeFi engineering—with
          XP and badges on completion. Use this when you are ramping before joining paid challenges.
        </p>
      </DocSection>

      <DocSection title="Playground">
        <p>
          Sandboxed areas to experiment without risking production repos:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong className="text-white">Code editor</strong> — write and iterate on code</li>
          <li><strong className="text-white">Smart contracts</strong> — templates and deploy flows</li>
          <li><strong className="text-white">Web3 integration</strong> — wallet and RPC experiments</li>
          <li><strong className="text-white">Challenges</strong> — practice missions with XP</li>
        </ul>
      </DocSection>

      <DocSection title="Projects hub">
        <p>
          Explore themed tracks—DeFi, NFTs, smart contracts, token bridges—with example repos and
          challenge ideas. Useful when you know the domain but not the exact repository yet.
        </p>
      </DocSection>

      <DocSection title="Settings">
        <p>
          Manage <strong className="text-white">account</strong>,{' '}
          <strong className="text-white">profile</strong> (including GitHub username),{' '}
          <strong className="text-white">notifications</strong>,{' '}
          <strong className="text-white">security</strong>, and{' '}
          <strong className="text-white">preferences</strong>. Accurate GitHub linkage is required
          for PR attribution.
        </p>
      </DocSection>
    </div>
  );
}
