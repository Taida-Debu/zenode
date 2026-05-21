import Link from 'next/link';
import { appPath } from '@zenode/ui/urls';

export default function LandingTermsPage() {
  return (
    <div className="pt-24 sm:pt-32 px-4 pb-24 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
      <p className="text-gray-400 mb-8 leading-relaxed">
        Rules for using challenges, rewards, and the LazyDev platform. The complete terms are in the
        product app.
      </p>
      <Link
        href={appPath('/terms')}
        className="text-green-400 underline hover:text-green-300"
      >
        Read full Terms of Service in the app
      </Link>
    </div>
  );
}
