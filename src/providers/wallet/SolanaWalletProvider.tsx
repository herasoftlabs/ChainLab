// src/providers/wallet/SolanaWalletProvider.tsx

'use client';
import { FC, ReactNode, useMemo, useEffect, useState } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { SOLANA_NETWORKS } from '@/utils/chains/solana/solana';
import dynamic from 'next/dynamic';
require('@solana/wallet-adapter-react-ui/styles.css');

interface Props {
  children: ReactNode;
}

const WalletModalProviderComponent = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then(mod => mod.WalletModalProvider),
  { ssr: false }
);

export const SolanaWalletProvider: FC<Props> = ({ children }) => {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // CSS'i dynamic olarak import et
    const loadStyles = async () => {
      try {
        await import('@solana/wallet-adapter-react-ui/styles.css');
      } catch (error) {
        console.error('Failed to load wallet styles:', error);
      }
    };
    loadStyles();
  }, []);

  useEffect(() => {
    const loadWalletAdapter = async () => {
      try {
        await import('@solana/wallet-adapter-react-ui/styles.css');
      } catch (error) {
        console.error('Failed to load wallet adapter styles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWalletAdapter();
  }, []);

  const endpoint = useMemo(() => SOLANA_NETWORKS[1].endpoint, []);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProviderComponent>
          {children}
        </WalletModalProviderComponent>
      </WalletProvider>
    </ConnectionProvider>
  );
};