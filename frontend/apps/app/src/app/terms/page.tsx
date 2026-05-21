import { LegalDocumentLayout } from '@/components/layout/LegalDocumentLayout';

export default function TermsOfServicePage() {
  return (
    <LegalDocumentLayout title="Terms of Service">
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Agreement</h2>
        <p>
          By accessing or using LazyDev, you agree to these Terms of Service. If you do not agree,
          do not use the platform.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Eligibility</h2>
        <p>
          You must be able to form a binding contract in your jurisdiction and comply with applicable
          laws, including export and sanctions rules. You are responsible for your wallet and GitHub
          account security.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Platform role</h2>
        <p>
          LazyDev facilitates discovery of open-source work, challenge participation, and reward
          distribution. We are not your employer. Contributions happen on third-party repositories
          (e.g. GitHub) under their own licenses and policies. Maintainers retain control of their
          projects.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Challenges & rewards</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Each challenge defines its own rules, eligibility, and payout terms</li>
          <li>Rewards are not guaranteed until challenge criteria are met and verified</li>
          <li>Token values fluctuate; tax treatment is your responsibility</li>
          <li>We may modify, suspend, or cancel challenges to address fraud, abuse, or errors</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Acceptable use</h2>
        <p>You agree not to:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Submit false claims of work or misrepresent GitHub authorship</li>
          <li>Attack, scrape, or reverse-engineer the platform without permission</li>
          <li>Use the service for unlawful, harassing, or infringing activity</li>
          <li>Circumvent reward or attribution mechanisms</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Intellectual property</h2>
        <p>
          LazyDev branding, UI, and platform code are protected by applicable IP laws. Your
          contributions to upstream open-source projects remain governed by those projects&apos;
          licenses. Content you submit to LazyDev grants us a license to display and operate it on
          the platform.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Disclaimers & liability</h2>
        <p>
          The platform is provided &quot;as is&quot; without warranties. To the maximum extent permitted by
          law, LazyDev and its contributors are not liable for indirect, incidental, or consequential
          damages arising from use of the service, smart-contract interactions, or third-party
          services.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Termination</h2>
        <p>
          We may suspend or terminate access for violations of these terms or for risk to the
          community. You may stop using the service at any time.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Contact</h2>
        <p>
          For questions about these terms, use the in-app Support page or open an issue in the
          project repository.
        </p>
      </section>
    </LegalDocumentLayout>
  );
}
