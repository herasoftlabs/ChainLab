// src/components/wallet/SolanaWalletButton.tsx

'use client';
import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export const SolanaWalletButton: FC = () => {
  const { connected, connecting, publicKey, wallet } = useWallet();

  if (!wallet) {
    return <WalletMultiButton className="wallet-adapter-button" />;
  }

  return (
    <Button 
      variant={connected ? "outline" : "default"}
      disabled={connecting}
    >
      {connecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : connected && publicKey ? (
        `${publicKey.toBase58().slice(0, 6)}...${publicKey.toBase58().slice(-4)}`
      ) : (
        "Connect Wallet"
      )}
    </Button>
  );
};