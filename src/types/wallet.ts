// src/types/wallet.ts
import { PlatformType } from '@/types/projectTypes';

export interface WalletInfo {
  id: string;
  name: string;
  icon: string;
  description: string;
  platforms: PlatformType[];
}

export interface EVMTransaction {
  to: string;
  value?: string;
  data?: string;
  gasLimit?: string;
}

export interface SolanaTransaction {
  // Solana transaction types
}

export type Transaction = EVMTransaction | SolanaTransaction;

// Provider types
export interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, callback: (params?: any) => void) => void;
  removeListener: (event: string, callback: (params?: any) => void) => void;
}

// Window type extension
declare global {
  interface Window {
    Ethereum?: EthereumProvider;
    phantom?: {
      solana?: {
        connect: () => Promise<void>;
        disconnect: () => Promise<void>;
        request: (args: { method: string; params: any }) => Promise<any>;
      };
    };
  }
}