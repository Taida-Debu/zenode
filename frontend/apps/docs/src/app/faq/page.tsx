import { DocSection } from '@/components/docs-ui';

const faqs = [
  {
    q: 'Do I need to install anything locally?',
    a: 'No. LazyDev runs in the browser. You need a compatible wallet and a GitHub account. All coding happens in your normal GitHub workflow.',
  },
  {
    q: 'Why do I need a wallet?',
    a: 'Your wallet is your LazyDev identity—it ties together rewards, challenge participation, and your contribution history on the platform.',
  },
  {
    q: 'Why must I set a GitHub username in settings?',
    a: 'LazyDev attributes pull requests to you by matching the PR author on GitHub to the username on your profile. If they differ, sync will not credit your work.',
  },
  {
    q: 'Where do I actually write code?',
    a: 'On GitHub (or your local machine pushing to GitHub). LazyDev does not replace your editor—it tracks and rewards work you already do in open source.',
  },
  {
    q: 'What are USDC and LZD?',
    a: 'USDC is a dollar-stable token used for challenge payouts where configured. LZD is LazyDev’s incentive token for platform-aligned rewards. Each challenge defines what it pays.',
  },
  {
    q: 'How is XP different from token rewards?',
    a: 'XP is always-on gamification—streaks, levels, badges, leaderboards. Tokens are optional per challenge and depend on sponsor pools and merge rules.',
  },
  {
    q: 'My PR does not show after sync—what should I check?',
    a: 'Confirm your profile GitHub username, that you joined the challenge for that repository, and that you are the PR author. Only tracked repos for challenges you joined are included.',
  },
  {
    q: 'Can maintainers list their projects?',
    a: 'Yes. Submit a proposal from the dashboard describing the repo, scope, and suggested rewards. Community review and governance decide what goes live.',
  },
  {
    q: 'What is the Playground for?',
    a: 'A safe place to practice Web3 and smart-contract skills before touching production challenge repositories. It does not replace real challenge PRs.',
  },
  {
    q: 'Is LazyDev the same as Verida?',
    a: 'LazyDev is the product. Verida provides identity and data capabilities where integrated—anonymous participation and verifiable credentials when those features are enabled.',
  },
];

export default function FaqPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-3">FAQ</h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          Quick answers for developers using LazyDev. For step-by-step flows, see{' '}
          <strong className="text-white">Getting started</strong> and{' '}
          <strong className="text-white">How it works</strong>.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((item) => (
          <DocSection key={item.q} title={item.q}>
            <p>{item.a}</p>
          </DocSection>
        ))}
      </div>
    </div>
  );
}
