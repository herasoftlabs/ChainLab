// src/utils/constants.ts
import { Platform, Chain, NetworkConfig } from '@/types/projectTypes';

// Chain Icons
export const CHAIN_ICONS = {
  ethereum: '/icons/chains/ethereum.png',
  bnb: '/icons/chains/bnb.png',
  arbitrum: '/icons/chains/arbitrum.png',
  taiko: '/icons/chains/taiko.png',
  solana: '/icons/chains/solana.png',
  educhain: '/icons/chains/educhain.png',
  default: '/icons/chains/defaultchain.png'
} as const;

// Chain Definitions
export const CHAINS: Record<string, Chain> = {
  ETHEREUM_MAINNET: {
    id: '1',
    key: 'ETHEREUM_MAINNET',
    name: 'Ethereum Mainnet',
    icon: CHAIN_ICONS.ethereum,
    platform: 'EVM',
    testnet: false,
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: [
      'https://mainnet.infura.io/v3/${INFURA_API_KEY}',
      'https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}',
      'https://cloudflare-eth.com'
    ] as const,
    blockExplorers: {
      default: {
        name: 'Etherscan',
        url: 'https://etherscan.io'
      }
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 14353601
      }
    }
  },
  SEPOLIA: {
    id: '11155111',
    key: 'SEPOLIA',
    name: 'Sepolia',
    icon: CHAIN_ICONS.ethereum,
    platform: 'EVM',
    testnet: true,
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'SEP',
      decimals: 18
    },
    rpcUrls: [
      'https://sepolia.infura.io/v3/${INFURA_API_KEY}',
      'https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}'
    ] as const,
    blockExplorers: {
      default: {
        name: 'Sepolia Etherscan',
        url: 'https://sepolia.etherscan.io'
      }
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 751532
      }
    },
    faucets: ['https://sepoliafaucet.com/']
  },
  ARBITRUM_ONE: {
    id: '41923',
    key: 'ARBITRUM_ONE',
    name: 'Arbitrum One OC',
    icon: CHAIN_ICONS.educhain,
    platform: 'EVM',
    testnet: false,
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: [
      'https://rpc.edu-chain.raas.gelato.cloud'
    ] as const,
    blockExplorers: {
      default: {
        name: 'Educhain Blockscout',
        url: 'https://educhain.blockscout.com'
      }
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 751532
      }
    }
  },
  ARBITRUM_SEPOLIA: {
    id: '656476',
    key: 'ARBITRUM_SEPOLIA',
    name: 'Arbitrum Sepolia OC',
    icon: CHAIN_ICONS.educhain,
    platform: 'EVM',
    testnet: true,
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: [
      'https://rpc.open-campus-codex.gelato.digital'
    ] as const,
    blockExplorers: {
      default: {
        name: 'Educhain Blockscout',
        url: 'https://opencampus-codex.blockscout.com/'
      }
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 751532
      }
    },
    faucets: ['https://www.alchemy.com/faucets/arbitrum-sepolia']
  },
  OPENCAMPUS_CODEX: {
    id: '656476',
    key: 'OPENCAMPUS_CODEX',
    name: 'Open Campus Codex',
    icon: CHAIN_ICONS.educhain,
    platform: 'EVM',
    testnet: true,
    nativeCurrency: {
      name: 'EDU Token',
      symbol: 'EDU',
      decimals: 18
    },
    rpcUrls: [
      'https://rpc.open-campus-codex.gelato.digital'
    ] as const,
    blockExplorers: {
      default: {
        name: 'Blockscout',
        url: 'https://opencampus-codex.blockscout.com/'
      }
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 751532
      }
    },
    faucets: ['https://drpc.org/faucet/open-campus-codex']
  },
  SOLANA_MAINNET: {
    id: 'mainnet-beta',
    key: 'SOLANA_MAINNET',
    name: 'Solana',
    platform: 'Solana',
    icon: CHAIN_ICONS.solana,
    testnet: false,
    nativeCurrency: {
      name: 'SOL',
      symbol: 'SOL',
      decimals: 9
    },
    rpcUrls: [
      'https://api.mainnet-beta.solana.com',
      'https://solana-api.projectserum.com'
    ] as const,
    blockExplorers: {
      default: {
        name: 'Solana Explorer',
        url: 'https://explorer.solana.com'
      },
      solscan: {
        name: 'Solscan',
        url: 'https://solscan.io'
      }
    }
  },
  SOLANA_DEVNET: {
    id: 'devnet',
    key: 'SOLANA_DEVNET',
    name: 'Solana Devnet',
    platform: 'Solana',
    icon: CHAIN_ICONS.solana,
    testnet: true,
    nativeCurrency: {
      name: 'SOL',
      symbol: 'SOL',
      decimals: 9
    },
    rpcUrls: [
      'https://api.devnet.solana.com'
    ] as const,
    blockExplorers: {
      default: {
        name: 'Solana Explorer',
        url: 'https://explorer.solana.com/?cluster=devnet'
      },
      solscan: {
        name: 'Solscan',
        url: 'https://solscan.io/?cluster=devnet'
      }
    },
    faucets: ['https://solfaucet.com']
  }
} as const;

// Supported Platforms
export const SUPPORTED_PLATFORMS: Platform[] = [
  {
    id: 'EVM',
    name: 'EVM Compatible',
    description: 'Ethereum Virtual Machine compatible blockchains',
    enabled: true,
    chains: Object.values(CHAINS).filter(chain => chain.platform === 'EVM')
  },
  {
    id: 'Solana',
    name: 'Solana',
    description: 'Solana blockchain platform',
    enabled: true,
    chains: Object.values(CHAINS).filter(chain => chain.platform === 'Solana')
  }
];

// Project Types
export const PROJECT_TYPES = {
  Evm: ['App', 'Game'],
  Solana: ['App', 'Game']
} as const;

export const PLATFORM_COLORS = {
  'EVM': 'bg-blue-100 text-blue-800',
  'Solana': 'bg-purple-100 text-purple-800'
} as const;

// Helper function to find chain by id and key
export const findChainByIdAndKey = (id: string, key: string) => {
  return SUPPORTED_PLATFORMS
    .flatMap(p => p.chains)
    .find(chain => chain.id === id && chain.key === key);
};

// Helper function to get chain by key
export const getChainByKey = (key: keyof typeof CHAINS) => CHAINS[key];