import { LegalDocumentLayout } from '@/components/layout/LegalDocumentLayout';

export default function PrivacyPolicyPage() {
  return (
    <LegalDocumentLayout title="Privacy Policy">
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Overview</h2>
        <p>
          LazyDev (&quot;we&quot;, &quot;our&quot;, &quot;the platform&quot;) respects your privacy. This policy
          explains what information we collect when you use the product, why we collect it, and the
          choices you have.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Information we collect</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Wallet address and connection metadata from your Web3 wallet provider</li>
          <li>GitHub username and public contribution data you choose to sync</li>
          <li>Challenge participation, proposals, and reward history on the platform</li>
          <li>Usage data such as pages visited and features used (for reliability and improvement)</li>
          <li>Information you submit in forms (e.g. contact, proposals, profile settings)</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">How we use information</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Operate challenges, attribute pull requests, and distribute rewards</li>
          <li>Personalize AI-powered project recommendations</li>
          <li>Secure accounts and prevent abuse</li>
          <li>Communicate about challenges, payouts, and platform updates</li>
          <li>Comply with legal obligations</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Sharing</h2>
        <p>
          We do not sell your personal information. We may share data with service providers that
          help us run the platform (hosting, analytics, wallet infrastructure, GitHub APIs) under
          contracts that limit their use. Public blockchain transactions and public GitHub activity
          remain public by nature.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Retention & security</h2>
        <p>
          We retain data while your account is active and as needed for rewards, disputes, and legal
          requirements. We apply reasonable technical and organizational measures to protect data;
          no system is perfectly secure.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Your choices</h2>
        <p>
          You can update profile information in Settings, disconnect your wallet, and request
          deletion of platform-held data by contacting support. Some on-chain records cannot be
          erased after publication.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Changes</h2>
        <p>
          We may update this policy. Material changes will be reflected on this page with an updated
          date. Continued use of LazyDev after changes constitutes acceptance.
        </p>
      </section>
    </LegalDocumentLayout>
  );
}
