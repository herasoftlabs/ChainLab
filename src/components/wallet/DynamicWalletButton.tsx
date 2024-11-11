// src/components/wallet/DynamicWalletButton.tsx

'use client';
import { useCurrentProject } from '@/stores/useProjectStore';
import { EVMWalletButton } from './EVMWalletButton';
import { SolanaWalletButton } from './SolanaWalletButton';
import { useWalletStore } from '@/stores/useWalletStore';
import { Button } from '@/components/ui/button';

export const DynamicWalletButton = () => {
  const currentProject = useCurrentProject();
  const { isConnected, connect, disconnect } = useWalletStore();

  if (!currentProject) {
    return (
      <Button disabled variant="outline">
        Select Project First
      </Button>
    );
  }

  switch (currentProject.platform) {
    case 'EVM':
      return <EVMWalletButton />;
    case 'Solana':
      return <SolanaWalletButton />;
    default:
      return (
        <Button disabled variant="outline">
          Unsupported Platform
        </Button>
      );
  }
};