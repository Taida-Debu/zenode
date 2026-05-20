'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Award, Code } from 'lucide-react';
import { useEffect, useState } from 'react';

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const clientKey = process.env.NEXT_PUBLIC_CLIENT_KEY;
const appId = process.env.NEXT_PUBLIC_APP_ID;
const isWalletConfigured = Boolean(projectId && clientKey && appId);

function ConnectedWalletSection() {
   const { ConnectButton, useAccount } = require('@particle-network/connectkit');
   const router = useRouter();
   const account = useAccount();

   useEffect(() => {
      if (account.isConnected) {
         router.push("/dashboard");
      }
   }, [account.isConnected, router]);

   return <ConnectButton />;
}

function FallbackWalletSection() {
   return (
      <Link
         href="/dashboard"
         className="bg-gradient-to-r from-green-400 to-cyan-400 text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
      >
         Dashboard
      </Link>
   );
}

export function Navbar() {
   const [mounted, setMounted] = useState(false);

   useEffect(() => {
      setMounted(true);
   }, []);

   return (
      <div className="fixed top-0 left-0 right-0 z-50">
         <nav className="bg-black/5 backdrop-blur-md">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 h-20">
               <Link href="/" className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg">
                     <Award className="w-6 h-6 text-green-400" />
                  </div>
                  <span className="text-2xl font-bold gradient-text">LazyDev</span>
               </Link>
               <div className="hidden md:flex items-center space-x-8">
                  <Link href="/how-it-works" className="text-gray-300 hover:text-white transition-colors">
                     How it Works
                  </Link>
                  <Link href="/learn-to-earn" className="text-gray-300 hover:text-white transition-colors">
                     Learn to Earn
                  </Link>
                  <Link href="/play-ground" className="text-gray-300 hover:text-white transition-colors flex items-center">
                     <Code className="w-4 h-4 mr-2" />
                     Playground
                  </Link>
               </div>
               <div className="flex items-center space-x-4">
                  {mounted && isWalletConfigured
                     ? <ConnectedWalletSection />
                     : <FallbackWalletSection />
                  }
               </div>
            </div>
         </nav>
      </div>
   );
} 
