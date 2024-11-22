// src/types/projectTypes.ts
import { EthereumContract } from "@/types/evm/contractTypes";

// Platform Types
export type PlatformType = "EVM" | "Solana";
export type ProjectType = "App" | "Game";

// Chain Related Types
export interface NativeCurrency {
  name: string;
  symbol: string;
  decimals: number;
}

export interface BlockExplorer {
  name: string;
  url: string;
}

export interface BlockExplorers {
  default: BlockExplorer;
  [key: string]: BlockExplorer;
}

export interface ContractAddress {
  address: string;
  blockCreated?: number;
}

export interface ChainContracts {
  multicall3?: ContractAddress;
  [key: string]: ContractAddress | undefined;
}

export interface Chain {
  id: string;
  key: string;
  name: string;
  platform: PlatformType;
  icon?: string;
  testnet: boolean;
  nativeCurrency: NativeCurrency;
  rpcUrls: readonly string[];
  blockExplorers: BlockExplorers;
  contracts?: ChainContracts;
  faucets?: string[];
}

// Platform Interface
export interface Platform {
  id: PlatformType;
  name: string;
  description: string;
  chains: Chain[];
  enabled: boolean;
}

// Project Related Types
export interface Project {
  id: string;
  name: string;
  createdAt: string;
  folderName: string;
  platform: PlatformType;
  chain: Chain;
  projectType: ProjectType;
  contracts?: EthereumContract[];
  description?: string;
  repository?: string;
  website?: string;
}

// Template Types
export interface Template<TContract> {
  id: string;
  name: string;
  description: string;
  image?: string;
  contract: TContract;
  category?: string;
  tags?: string[];
  complexity?: "Beginner" | "Intermediate" | "Advanced";
}

// Chain Metadata Types (for deployment)
export interface ChainMetadata {
  name: string;
  icon: string;
  nativeCurrency: NativeCurrency;
  blockExplorers: BlockExplorers;
  rpcUrls: string[];
  testnet: boolean;
  contracts?: ChainContracts;
  faucets?: string[];
}

// Deployment Related Types
export interface DeploymentConfig {
  chain: Chain;
  rpcUrl: string;
  explorerUrl: string;
  verifyApiKey?: string;
  gasPrice?: string;
  gasLimit?: string;
}

// Network Configuration Types
export interface NetworkConfig {
  chainId: string;
  name: string;
  nativeCurrency: NativeCurrency;
  rpcUrls: string[];
  blockExplorers: BlockExplorers;
  testnet: boolean;
}

// Project Status Types
export type ProjectStatus = "draft" | "deployed" | "verified";

// Extended Project Interface with Status
export interface ProjectWithStatus extends Project {
  status: ProjectStatus;
  deployedAddresses?: {
    [chainId: string]: string;
  };
  verificationStatus?: {
    [chainId: string]: boolean;
  };
}
