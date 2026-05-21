import Link from 'next/link';
import { appPath } from '@zenode/ui/urls';

export default function LandingPrivacyPage() {
  return (
    <div className="pt-24 sm:pt-32 px-4 pb-24 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
      <p className="text-gray-400 mb-8 leading-relaxed">
        LazyDev handles wallet and GitHub data to run challenges and rewards. The full policy lives
        in the product app.
      </p>
      <Link
        href={appPath('/privacy')}
        className="text-green-400 underline hover:text-green-300"
      >
        Read full Privacy Policy in the app
      </Link>
    </div>
  );
}
