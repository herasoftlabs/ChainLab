// src/components/wallet/EVMWalletButton.tsx

'use client';
import { useEffect } from 'react';
import { ConnectKitButton } from "connectkit";
import { useAccount, useChainId } from 'wagmi'; 
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useWalletStore } from '@/stores/useWalletStore';
import { useCurrentProject } from '@/stores/useProjectStore';
import { findChainByIdAndKey } from '@/utils/constants';

export const EVMWalletButton = () => {
  const { isConnected: isWagmiConnected, address } = useAccount();
  const chainId = useChainId(); 
  const currentProject = useCurrentProject();
  const { connect, disconnect, isConnected: isStoreConnected } = useWalletStore();

  const projectChain = currentProject 
    ? findChainByIdAndKey(currentProject.chain.id, currentProject.chain.key)
    : null;

  useEffect(() => {
    if (isWagmiConnected && address && !isStoreConnected) {
      connect('EVM');
    } else if (!isWagmiConnected && isStoreConnected) {
      disconnect();
    }
  }, [isWagmiConnected, address, isStoreConnected]);

  const isWrongNetwork = chainId !== parseInt(projectChain?.id || '0');

  return (
    <ConnectKitButton.Custom>
      {({ isConnecting, show }) => {
        return (
          <Button 
            onClick={show}
            disabled={isConnecting}
            variant={isWagmiConnected ? (isWrongNetwork ? "destructive" : "outline") : "default"}
            className="w-full"
          >
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : isWagmiConnected ? (
              isWrongNetwork ? (
                "Wrong Network"
              ) : (
                `${address?.slice(0, 6)}...${address?.slice(-4)}`
              )
            ) : (
              "Connect Wallet"
            )}
          </Button>
        );
      }}
    </ConnectKitButton.Custom>
  );
};