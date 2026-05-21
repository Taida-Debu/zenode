import Link from 'next/link';
import { DocSection, DocSteps } from '@/components/docs-ui';
import { appPath } from '@zenode/ui/urls';

export default function GettingStartedPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-3">Getting started</h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          This guide walks you through using LazyDev as a contributor. No local setup required—you
          use the web app at{' '}
          <Link href={appPath('/dashboard')} className="text-green-400 underline">
            the product app
          </Link>
          .
        </p>
      </div>

      <DocSection title="Before you begin">
        <ul className="list-disc list-inside space-y-2">
          <li>A Web3 wallet (connected via Particle Network in the app)</li>
          <li>A GitHub account you use for open-source contributions</li>
          <li>Basic familiarity with pull requests and repository workflows</li>
        </ul>
      </DocSection>

      <DocSection title="1. Launch the app and connect">
        <DocSteps
          steps={[
            'Open LazyDev from the marketing site or docs header (Launch app).',
            'Connect your wallet when prompted—this becomes your on-platform identity.',
            'You land on the dashboard where XP, activity, and recommendations appear.',
          ]}
        />
      </DocSection>

      <DocSection title="2. Link your GitHub identity">
        <p>
          Go to <strong className="text-white">Settings → Profile</strong> and save your GitHub
          username. LazyDev uses this to attribute pull requests to your wallet and to show your
          contribution calendar on the dashboard.
        </p>
        <p>
          See <Link href="/github" className="text-green-400 underline">GitHub contributions</Link>{' '}
          for how PR sync and repo tracking work.
        </p>
      </DocSection>

      <DocSection title="3. Find work that fits you">
        <p>
          Use <strong className="text-white">Dashboard → Search</strong> to describe what you want to
          build (skills, interests, time). The AI surfaces repositories and issues aligned with your
          profile. You can also browse active{' '}
          <Link href="/challenges" className="text-green-400 underline">
            challenges
          </Link>{' '}
          curated by the community.
        </p>
      </DocSection>

      <DocSection title="4. Join a challenge and open a PR">
        <DocSteps
          steps={[
            'Pick a challenge and note the target repository URL.',
            'Fork or branch as you normally would on GitHub.',
            'Implement the task and open a pull request against the listed repo.',
            'Return to LazyDev → Contributions → My PRs and sync so your PR appears on the platform.',
          ]}
        />
      </DocSection>

      <DocSection title="5. Earn recognition and rewards">
        <p>
          When your PR is merged (or meets challenge rules), you earn XP and progress on
          leaderboards. Eligible challenges pay out in <strong className="text-white">USDC</strong>{' '}
          and <strong className="text-white">LZD</strong> according to challenge terms. Your
          dashboard analytics and profile reflect cumulative contribution history.
        </p>
      </DocSection>

      <DocSection title="Optional: Playground">
        <p>
          New to Web3 or smart contracts? Use the{' '}
          <Link href="/features" className="text-green-400 underline">
            Playground
          </Link>{' '}
          to practice in a sandbox before touching production challenge repos.
        </p>
      </DocSection>

      <DocSection title="Submit a project or challenge idea">
        <p>
          Maintainers and contributors can propose new work via{' '}
          <strong className="text-white">Dashboard → Submit proposal</strong>. Proposals are stored
          for community review and DAO governance (see{' '}
          <Link href="/how-it-works" className="text-green-400 underline">How it works</Link>).
        </p>
      </DocSection>
    </div>
  );
}
