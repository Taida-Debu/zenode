import { NotFoundPage } from '@zenode/ui/not-found-page';
import { appPath, docsPath, landingPath } from '@zenode/ui/urls';

export default function NotFound() {
  return (
    <NotFoundPage
      homeHref={landingPath('/')}
      appHref={appPath('/dashboard')}
      docsHref={docsPath('/')}
      context="documentation"
    />
  );
}
