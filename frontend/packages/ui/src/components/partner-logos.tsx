'use client';

import { AppImage } from './app-image';

const PARTNER_LOGOS = [
  { src: 'https://cryptologos.cc/logos/solana-sol-logo.png', alt: 'Solana' },
  { src: 'https://cryptologos.cc/logos/avalanche-avax-logo.png', alt: 'Avalanche' },
  { src: 'https://cryptologos.cc/logos/aragon-ant-logo.png', alt: 'Aragon' },
  { src: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png', alt: 'BNB' },
  { src: 'https://cryptologos.cc/logos/balancer-bal-logo.png', alt: 'Balancer' },
  { src: 'https://cryptologos.cc/logos/ethereum-classic-etc-logo.png', alt: 'Ethereum' },
  { src: 'https://cryptologos.cc/logos/polygon-matic-logo.png', alt: 'Polygon' },
  { src: 'https://cryptologos.cc/logos/chainlink-link-logo.png', alt: 'Chainlink' },
  { src: 'https://cryptologos.cc/logos/uniswap-uni-logo.png', alt: 'Uniswap' },
  { src: 'https://cryptologos.cc/logos/aave-aave-logo.png', alt: 'Aave' },
] as const;

function LogoRow() {
  return (
    <div className="flex items-center space-x-8 shrink-0">
      {PARTNER_LOGOS.map((logo) => (
        <AppImage
          key={logo.alt}
          src={logo.src}
          alt={logo.alt}
          width={32}
          height={32}
          className="h-8 w-auto object-contain"
        />
      ))}
    </div>
  );
}

export function PartnerLogos() {
  return (
    <div className="relative overflow-hidden">
      <div className="flex items-center space-x-8">
        {[0, 1].map((i) => (
          <div key={i} className="flex items-center space-x-8 shrink-0 animate-scroll">
            {[0, 1, 2].map((j) => (
              <LogoRow key={`${i}-${j}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
