'use client';

import { ConnectButton } from '@particle-network/connectkit';

/** Connect only — no auto-redirect so users can stay on any app route while connected. */
export function WalletConnectButton() {
  return <ConnectButton />;
}
