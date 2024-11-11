// src/stores/useWalletStore.ts

import { create } from 'zustand';
import { PlatformType, Chain } from '@/types/projectTypes';
import { 
  ethers,
  BrowserProvider,
  JsonRpcSigner,
  ContractFactory,
  Contract
} from 'ethers';
import { findChainByIdAndKey } from '@/utils/constants';

// Types for Event Handlers
type AccountsChangedHandler = (accounts: string[]) => void;
type ChainChangedHandler = () => void;

interface EventHandlers {
  accountsChanged: AccountsChangedHandler;
  chainChanged: ChainChangedHandler;
}

interface WalletState {
  address: string | null;
  isConnected: boolean;
  platform: PlatformType | null;
  chainId: string | null;
  chainKey: string | null; 
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  
  // Actions
  connect: (platform: PlatformType, chainKey?: string) => Promise<void>;
  disconnect: () => void;
  switchChain: (chainId: string, chainKey: string) => Promise<void>;
  
  // Platform specific actions
  signMessage: (message: string) => Promise<string>;
  signTransaction: (transaction: any) => Promise<string>;
  deployContract: (contractData: any, chainId: string, chainKey: string) => Promise<string>;
}

const getChainId = async (): Promise<string> => {
  try {
    const chainId = await window.ethereum.request({ 
      method: 'eth_chainId' 
    });
    return parseInt(chainId, 16).toString();
  } catch (error) {
    console.error('Error getting chain ID:', error);
    throw error;
  }
};

// Event Handlers
const handleAccountsChanged = (set: any, get: any): AccountsChangedHandler => (accounts: string[]) => {
  if (accounts.length === 0) {
    get().disconnect();
  } else {
    set({ address: accounts[0] });
  }
};

const handleChainChanged = (set: any): ChainChangedHandler => async () => {
  try {
    const chainId = await getChainId();
    set({ chainId });
  } catch (error) {
    console.error('Error handling chain change:', error);
  }
};

// Cleanup function
const cleanupListeners = (handlers: EventHandlers) => {
  if (window.ethereum) {
    window.ethereum.removeListener('accountsChanged', handlers.accountsChanged);
    window.ethereum.removeListener('chainChanged', handlers.chainChanged);
  }
};

export const useWalletStore = create<WalletState>((set, get) => {
  // Initialize event handlers
  const handlers = {
    accountsChanged: handleAccountsChanged(set, get),
    chainChanged: handleChainChanged(set)
  };

  return {
    address: null,
    isConnected: false,
    platform: null,
    chainId: null,
    chainKey: null,
    provider: null,
    signer: null,

    connect: async (platform, chainKey) => {
      try {
        switch (platform) {
          case 'EVM': {
            if (!window.ethereum) {
              throw new Error('Please install MetaMask');
            }

            const provider = new BrowserProvider(window.ethereum);
            await window.ethereum.request({ method: 'eth_requestAccounts' });
          
            const chainId = await getChainId();
            
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            
            // Cleanup old listeners
            cleanupListeners(handlers);
            
            // Add new listeners
            window.ethereum.on('accountsChanged', handlers.accountsChanged);
            window.ethereum.on('chainChanged', handlers.chainChanged);
            
            set({ 
              isConnected: true, 
              platform,
              address,
              chainId,
              chainKey: chainKey || null,
              provider,
              signer
            });

            break;
          }
          case 'Solana':
            // Solana implementation
            break;
          default:
            throw new Error('Unsupported platform');
        }
      } catch (error) {
        console.error('Wallet connection error:', error);
        throw error;
      }
    },

    disconnect: () => {
      cleanupListeners(handlers);
      
      set({ 
        address: null,
        isConnected: false,
        platform: null,
        chainId: null,
        chainKey: null,
        provider: null,
        signer: null
      });
    },

    switchChain: async (chainId, chainKey) => {
      const { platform } = get();
      try {
        const chain = findChainByIdAndKey(chainId, chainKey);
        if (!chain) throw new Error('Chain not found');

        switch (platform) {
          case 'EVM': {
            if (!window.ethereum) throw new Error('No crypto wallet found');
            
            const hexChainId = `0x${Number(chainId).toString(16)}`;
            
            try {
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: hexChainId }],
              });

              const newChainId = await getChainId();
              set({ chainId: newChainId, chainKey });

            } catch (error: any) {
              if (error.code === 4902) {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [{
                    chainId: hexChainId,
                    chainName: chain.name,
                    nativeCurrency: chain.nativeCurrency,
                    rpcUrls: chain.rpcUrls,
                    blockExplorerUrls: [chain.blockExplorers.default.url],
                  }],
                });

                const newChainId = await getChainId();
                set({ chainId: newChainId, chainKey });
              } else {
                throw error;
              }
            }
            break;
          }
          case 'Solana':
            // Solana implementation
            break;
          default:
            throw new Error('Unsupported platform');
        }
      } catch (error) {
        console.error('Chain switch error:', error);
        throw error;
      }
    },

    signMessage: async (message) => {
      const { platform, signer } = get();
      if (!signer) throw new Error('No signer available');
      
      try {
        switch (platform) {
          case 'EVM':
            return await signer.signMessage(message);
          case 'Solana':
            return '';
          default:
            throw new Error('Unsupported platform');
        }
      } catch (error) {
        console.error('Message signing error:', error);
        throw error;
      }
    },

    signTransaction: async (transaction) => {
      const { platform, signer } = get();
      if (!signer) throw new Error('No signer available');
      
      try {
        switch (platform) {
          case 'EVM':
            return await signer.signTransaction(transaction);
          case 'Solana':
            return '';
          default:
            throw new Error('Unsupported platform');
        }
      } catch (error) {
        console.error('Transaction signing error:', error);
        throw error;
      }
    },

    deployContract: async (contractData, chainId, chainKey) => {
      const { platform, signer } = get();
      if (!signer) throw new Error('No signer available');
      
      try {
        const chain = findChainByIdAndKey(chainId, chainKey);
        if (!chain) throw new Error('Chain not found');

        switch (platform) {
          case 'EVM': {
            const factory = new ContractFactory(
              contractData.abi,
              contractData.bytecode,
              signer
            );
            
            const contract = await factory.deploy(...(contractData.args || []));
            await contract.waitForDeployment();
            return await contract.getAddress();
          }
          case 'Solana':
            return '';
          default:
            throw new Error('Unsupported platform');
        }
      } catch (error) {
        console.error('Contract deployment error:', error);
        throw error;
      }
    }
  };
});