import Link from 'next/link';
import { DocSection } from '@/components/docs-ui';

export default function ChallengesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-3">Challenges & rewards</h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          Challenges are the unit of work on LazyDev: bounded tasks on real repositories with clear
          rules and explicit rewards.
        </p>
      </div>

      <DocSection title="What is a challenge?">
        <p>
          Each challenge specifies a repository (or org), description, difficulty, timeline, and what
          “done” means—usually a merged PR or accepted deliverable. Challenges may offer XP only or
          include <strong className="text-white">USDC</strong> /{' '}
          <strong className="text-white">LZD</strong> pools for winners.
        </p>
      </DocSection>

      <DocSection title="Joining a challenge">
        <p>
          When you join, LazyDev records your wallet as a participant and adds the challenge’s repo
          to your <strong className="text-white">tracked repositories</strong> list. That list drives
          which pull requests count toward the challenge when you sync—see{' '}
          <Link href="/github" className="text-green-400 underline">GitHub contributions</Link>.
        </p>
      </DocSection>

      <DocSection title="XP, badges, and leaderboards">
        <p>
          XP rewards consistent participation: completing tasks, maintaining streaks, and finishing
          learn paths. Badges mark milestones (e.g. first merged PR, challenge series completion).
          Leaderboards compare contributors fairly within the same challenge or season.
        </p>
      </DocSection>

      <DocSection title="Token rewards">
        <p>
          Token payouts depend on challenge configuration and DAO-approved budgets. USDC typically
          funds stable compensation; LZD is the platform’s incentive token for governance-aligned
          rewards. Always read the challenge detail page before starting work.
        </p>
      </DocSection>

      <DocSection title="Proposing new challenges">
        <p>
          Use <strong className="text-white">Submit proposal</strong> on the dashboard to suggest new
          repos, bounties, or learning missions. Proposals enter review so maintainers and the
          community can approve scope and reward pools before they go live.
        </p>
      </DocSection>
    </div>
  );
}
