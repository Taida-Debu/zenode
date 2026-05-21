'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect } from 'react';
import { useAccount } from '@particle-network/connectkit';
import { useSelector } from 'react-redux';
import { Wallet } from 'lucide-react';
import { NavUser } from '@/components/nav/NavUser';
import { isConnectKitConfigured } from '@/context/connect';
import { RootState } from '@/context/redux/store';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const WalletConnectButton = dynamic(
  () => import('./WalletConnectButton').then((m) => m.WalletConnectButton),
  { ssr: false }
);

export function SidebarAuthFooter() {
  const { address, isConnected } = useAccount();
  const githubUser = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    if (!address) return;
    localStorage.setItem('wallet_address', address);
  }, [address]);

  if (!isConnectKitConfigured) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild size="lg" className="text-muted-foreground">
            <Link href="/settings/profile">
              <Wallet className="size-4" />
              <span className="text-xs">Wallet — add Particle env vars</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!isConnected || !address) {
    return (
      <SidebarMenu>
        <SidebarMenuItem className="px-2 pb-2">
          <div className="flex w-full flex-col gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent/30 p-3">
            <p className="text-xs text-muted-foreground">Connect your wallet to join challenges and track contributions.</p>
            <WalletConnectButton />
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const displayUser = githubUser
    ? {
        name: githubUser.name ?? githubUser.login,
        email: githubUser.email ?? `${address.slice(0, 6)}…${address.slice(-4)}`,
        avatar_url: githubUser.avatar_url,
        login: githubUser.login,
      }
    : {
        name: `${address.slice(0, 6)}…${address.slice(-4)}`,
        email: 'Wallet connected',
        login: address,
      };

  return <NavUser user={displayUser} />;
}
