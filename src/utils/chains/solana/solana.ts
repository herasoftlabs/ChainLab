// src/utils//solana/solana.ts

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import { WalletInfo } from '@/types/wallet';

export const SOLANA_NETWORKS = [
  {
    id: 'mainnet',
    name: 'Mainnet Beta',
    endpoint: clusterApiUrl('mainnet-beta'),
    network: WalletAdapterNetwork.Mainnet,
  },
  {
    id: 'devnet',
    name: 'Devnet',
    endpoint: clusterApiUrl('devnet'),
    network: WalletAdapterNetwork.Devnet,
  },
];

export const SOLANA_WALLETS: WalletInfo[] = [
  {
    id: 'phantom',
    name: 'Phantom',
    icon: '/icons/wallets/phantom.png',
    description: 'Connect to Phantom Wallet',
    platforms: ['Solana']
  },
  {
    id: 'solflare',
    name: 'Solflare',
    icon: '/icons/wallets/solflare.png',
    description: 'Connect to Solflare Wallet',
    platforms: ['Solana']
  },
];

export const switchSolanaNetwork = async (network: string): Promise<boolean> => {
  if (!window.phantom?.solana) return false;

  try {
    await window.phantom.solana.request({
      method: 'switchNetwork',
      params: { network },
    });
    return true;
  } catch (error) {
    console.error('Error switching Solana network:', error);
    return false;
  }
};