'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ConnectButton, useAccount } from '@particle-network/connectkit';

export function WalletConnectButton() {
  const router = useRouter();
  const account = useAccount();

  useEffect(() => {
    if (account.isConnected) {
      router.push('/dashboard');
    }
  }, [account.isConnected, router]);

  return <ConnectButton />;
}
