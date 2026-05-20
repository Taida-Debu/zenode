'use client';

import { ConnectKitProvider, createConfig } from '@particle-network/connectkit';
import { authWalletConnectors } from '@particle-network/connectkit/auth';
import { mainnet, solana } from '@particle-network/connectkit/chains';
import { evmWalletConnectors } from '@particle-network/connectkit/evm';
import { solanaWalletConnectors } from '@particle-network/connectkit/solana';
import { wallet, EntryPosition } from '@particle-network/connectkit/wallet';
import React from 'react';

// Retrieved from https://dashboard.particle.network
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string;
const clientKey = process.env.NEXT_PUBLIC_CLIENT_KEY as string;
const appId = process.env.NEXT_PUBLIC_APP_ID as string;
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string;

export const isConnectKitConfigured = Boolean(projectId && clientKey && appId);

const config = isConnectKitConfigured
   ? createConfig({
      projectId,
      clientKey,
      appId,
      appearance: {
         recommendedWallets: [
            { walletId: 'metaMask', label: 'Recommended' },
            { walletId: 'coinbaseWallet', label: 'popular' },
         ],
         splitEmailAndPhone: false,
         collapseWalletList: false,
         hideContinueButton: false,
         connectorsOrder: ['email', 'phone', 'social', 'wallet'],
         language: 'en-US',
         mode: 'light',
         theme: {
            '--pcm-primary-button-color': '#4ade80',
            '--pcm-secondary-button-bankground': 'rgba(0, 0, 0, 0.4)',
            '--pcm-secondary-button-hover-background': 'rgba(255, 255, 255, 0.05)',
         },
         logo: '/logo.png',
         filterCountryCallingCode: (countries) => {
            return countries.filter((item) => item === 'US');
         },
      },
      walletConnectors: [
         evmWalletConnectors({
            metadata: { name: 'LazyDev', icon: '/logo.png', description: 'Gamified Open Source Contributions', url: '' },
            walletConnectProjectId: walletConnectProjectId || '',
         }),
         authWalletConnectors({
            authTypes: ['github'],
            fiatCoin: 'USD',
            promptSettingConfig: {
               promptMasterPasswordSettingWhenLogin: 1,
               promptPaymentPasswordSettingWhenSign: 1,
            },
         }),
         solanaWalletConnectors(),
      ],
      plugins: [
         wallet({
            entryPosition: EntryPosition.BR,
            visible: true,
         }),
      ],
      chains: [mainnet, solana],
   })
   : null;

export const ParticleConnectkit = ({ children }: React.PropsWithChildren) => {
   if (!config) {
      return <>{children}</>;
   }
   return (
      <ConnectKitProvider config={config}>
         {children}
      </ConnectKitProvider>
   );
};