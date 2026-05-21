import { redirect } from 'next/navigation';

/** @deprecated Use /features */
export default function PlatformRedirectPage() {
  redirect('/features');
}
