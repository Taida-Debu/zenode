import { DocSection, DocSteps } from '@/components/docs-ui';

export default function GitHubPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-3">GitHub contributions</h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          LazyDev does not replace GitHub—you still open PRs there. The platform links your GitHub
          identity to your wallet so contributions count toward challenges, XP, and rewards.
        </p>
      </div>

      <DocSection title="Link your GitHub username">
        <p>
          In <strong className="text-white">Settings → Profile</strong>, enter the same username you
          use on GitHub (not email). This must match the author on pull requests you want credited.
          Without it, sync cannot attribute work to your account.
        </p>
      </DocSection>

      <DocSection title="Tracked repositories">
        <p>
          When you join a challenge, the challenge’s repository is added to your profile’s tracked
          list. Only PRs against those repos (for your GitHub user) appear in LazyDev after sync—this
          prevents unrelated PRs from counting toward a bounty you did not sign up for.
        </p>
      </DocSection>

      <DocSection title="Syncing pull requests">
        <DocSteps
          steps={[
            'Complete or update PRs on GitHub as usual.',
            'Open Contributions → My PRs in the app.',
            'Run sync (the app calls the platform with your username and wallet).',
            'Review the list—state, repo, and links back to GitHub should match.',
          ]}
        />
        <p className="mt-3">
          Sync may take a few seconds. If nothing appears, confirm your profile username, that you
          joined the challenge for that repo, and that the PR author matches your GitHub account.
        </p>
      </DocSection>

      <DocSection title="Contribution calendar & analytics">
        <p>
          The dashboard can show a GitHub-style contribution calendar and charts derived from synced
          activity—useful for portfolio proof and seeing streaks over time.
        </p>
      </DocSection>

      <DocSection title="For maintainers">
        <p>
          Maintainers define challenge scope on LazyDev and point contributors at the right
          repositories. Contributors prove work through merged or accepted PRs on those repos. You can
          propose new challenges from the dashboard when you want the community to sponsor work on
          your project.
        </p>
      </DocSection>
    </div>
  );
}
