import { DocSection, DocSteps } from '@/components/docs-ui';

export default function HowItWorksPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-3">How it works</h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          LazyDev connects identity, discovery, contribution proof, and rewards in one loop—so
          open-source work feels structured and fairly compensated instead of invisible volunteer
          labor.
        </p>
      </div>

      <DocSection title="The contributor journey">
        <DocSteps
          steps={[
            'Sign in with a wallet—your primary account key on the platform.',
            'Receive AI-suggested repositories and issues based on skills you add in Search.',
            'Join a challenge scoped to a real GitHub repository.',
            'Ship a pull request on GitHub as you normally would.',
            'Sync PRs in LazyDev so attribution links your GitHub user to your wallet.',
            'Earn XP, badges, and token rewards when work is accepted or merged.',
            'Build a portfolio of verifiable contributions visible on your profile and analytics.',
          ]}
        />
      </DocSection>

      <DocSection title="Challenges and governance">
        <p>
          Challenges are time-bound tasks with clear repos, acceptance criteria, and reward pools.
          Anyone can <strong className="text-white">submit proposals</strong> for new challenges or
          projects; the community and DAO curate what goes live so rewards stay transparent and
          merit-based.
        </p>
      </DocSection>

      <DocSection title="AI matching (Verida ecosystem)">
        <p>
          Instead of manually hunting issues, you describe goals in natural language. LazyDev’s AI
          layer (powered by Groq and LangGraph in the product app) ranks GitHub opportunities by fit,
          difficulty, and relevance to your stated skills—then refines suggestions as you contribute.
        </p>
        <p>
          Verida’s identity model supports privacy-preserving participation: you control what
          profile data is shared while still proving contribution history on-chain or via
          credentials where configured.
        </p>
      </DocSection>

      <DocSection title="Rewards: XP, USDC, and LZD">
        <p>
          <strong className="text-white">XP</strong> gamifies progress—streaks, leaderboards, and
          unlocks. <strong className="text-white">USDC</strong> and{' '}
          <strong className="text-white">LZD</strong> tokens fund real payouts on qualifying
          challenges. Exact amounts and eligibility are defined per challenge, not globally.
        </p>
      </DocSection>

      <DocSection title="Smart contracts (on-chain layer)">
        <p>
          LazyDev’s Solidity contracts (in the project’s <code className="text-green-400">contract/</code>{' '}
          repo) handle token logic and cross-chain concerns where deployed. Day-to-day contribution
          tracking and challenge state live in the app and database; contracts settle rewards and
          governance when those features are enabled in your environment.
        </p>
      </DocSection>
    </div>
  );
}
