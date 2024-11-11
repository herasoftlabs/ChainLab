// src/providers/wallet/DynamicWalletProvider.tsx

'use client';
import { useCurrentProject } from '@/stores/useProjectStore';
import { EVMWalletProvider } from './EVMWalletProvider';
import { SolanaWalletProvider } from './SolanaWalletProvider';

export const DynamicWalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentProject = useCurrentProject();

  if (!currentProject) {
    return <>{children}</>;
  }

  switch (currentProject.platform) {
    case 'EVM':
      return <EVMWalletProvider>{children}</EVMWalletProvider>;
    case 'Solana':
      return <SolanaWalletProvider>{children}</SolanaWalletProvider>;
    default:
      return <>{children}</>;
  }
};