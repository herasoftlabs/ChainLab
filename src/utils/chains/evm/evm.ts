// src/utils/chains/evm.ts

import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected, metaMask, safe } from 'wagmi/connectors';
import { WalletInfo } from '@/types/wallet';
import { findChainByIdAndKey } from '@/utils/constants';

// Chain metadata interface
export interface ChainMetadata {
  name: string;
  icon: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorers: {
    default: {
      url: string;
    };
  };
}

// Chain metadata
export const CHAIN_METADATA: Record<string, ChainMetadata> = {
  '1': {
    name: 'Ethereum Mainnet',
    icon: '/icons/chains/ethereum.png',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.infura.io/v3/'],
    blockExplorers: {
      default: { url: 'https://etherscan.io' },
    },
  },
  '11155111': {
    name: 'Sepolia Testnet',
    icon: '/icons/chains/ethereum.png',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'SEP',
      decimals: 18,
    },
    rpcUrls: ['https://sepolia.infura.io/v3/'],
    blockExplorers: {
      default: { url: 'https://sepolia.etherscan.io' },
    },
  },
};

// Wagmi config
export const evmConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [
    injected(),
    metaMask(),
    safe(),
  ],
});

// Wallet configurations
export const EVM_WALLETS: WalletInfo[] = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: '/icons/wallets/metamask.png',
    description: 'Connect to your MetaMask Wallet',
    platforms: ['EVM']
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: '/icons/wallets/walletconnect.png',
    description: 'Connect with WalletConnect',
    platforms: ['EVM']
  },
];

// Chain switching function
export const switchToChain = async (chainId: string): Promise<boolean> => {
  if (!window.ethereum) return false;

  try {
    // Önce chain switch dene
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${parseInt(chainId).toString(16)}` }],
    });
    return true;
  } catch (error: any) {
    // Chain henüz eklenmemişse eklemeyi dene
    if (error.code === 4902) {
      const chainData = CHAIN_METADATA[chainId];
      if (!chainData) return false;

      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${parseInt(chainId).toString(16)}`,
            chainName: chainData.name,
            nativeCurrency: chainData.nativeCurrency,
            rpcUrls: chainData.rpcUrls,
            blockExplorerUrls: [chainData.blockExplorers.default.url],
          }],
        });
        return true;
      } catch (addError) {
        console.error('Error adding chain:', addError);
        return false;
      }
    }
    console.error('Error switching chain:', error);
    return false;
  }
};

// Explorer URL helper
export const getExplorerUrl = (chainId: string, chainKey: string, address: string): string => {
  const chain = findChainByIdAndKey(chainId, chainKey);
  if (!chain?.blockExplorers?.default?.url) return '#';
  return `${chain.blockExplorers.default.url}/address/${address}`;
};

// Type guard for checking if a chain is supported
export const isSupportedChain = (chainId: string): boolean => {
  return chainId in CHAIN_METADATA;
};

// Helper to get chain name
export const getChainName = (chainId: string): string => {
  return CHAIN_METADATA[chainId]?.name || 'Unknown Chain';
};