// components/contracts/steps/publish-dapp/templates.tsx

import React from 'react';
import { 
  Coins, 
  Image as ImageIcon, 
  Users, 
  ShoppingCart, 
  Vote,
  Gamepad
} from "lucide-react";
import { Template } from '@/types/frontendTemplate';

interface TemplateCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  templates: Template[];
}

export const templateCategories: TemplateCategory[] = [
  {
    id: 'tokens',
    name: 'Token Projects',
    icon: <Coins className="w-4 h-4" />,
    templates: [
      {
        id: 'erc20-dashboard',
        name: 'ERC20 Token Dashboard',
        description: 'Professional dashboard for ERC20 token management',
        thumbnail: '/images/templates/erc20-dashboard.jpg',
        category: 'tokens',
        features: ['Token Transfers', 'Holder Analytics', 'Supply Management'],
        demoUrl: '/demos/erc20-dashboard',
        isNew: true
      },
      {
        id: 'token-swap',
        name: 'Token Swap Interface',
        description: 'Simple and elegant token swap interface',
        thumbnail: '/images/templates/token-swap.jpg',
        category: 'tokens',
        features: ['Token Swapping', 'Liquidity Pools', 'Price Charts'],
        demoUrl: '/demos/token-swap',
        isPremium: true
      }
    ]
  },
  {
    id: 'nft',
    name: 'NFT Projects',
    icon: <ImageIcon className="w-4 h-4" />,
    templates: [
      {
        id: 'nft-marketplace',
        name: 'NFT Marketplace',
        description: 'Modern NFT marketplace with advanced features',
        thumbnail: '/images/templates/nft-marketplace.jpg',
        category: 'nft',
        features: ['Listing', 'Bidding', 'Collection Management'],
        demoUrl: '/demos/nft-marketplace',
        isPremium: true
      },
      {
        id: 'nft-gallery',
        name: 'NFT Gallery',
        description: 'Showcase your NFT collection with style',
        thumbnail: '/images/templates/nft-gallery.jpg',
        category: 'nft',
        features: ['Gallery View', 'NFT Details', 'Filtering'],
        demoUrl: '/demos/nft-gallery',
        isNew: true
      }
    ]
  },
  {
    id: 'dao',
    name: 'DAO Projects',
    icon: <Users className="w-4 h-4" />,
    templates: [
      {
        id: 'dao-governance',
        name: 'DAO Governance Portal',
        description: 'Complete governance solution for DAOs',
        thumbnail: '/images/templates/dao-governance.jpg',
        category: 'dao',
        features: ['Proposal Creation', 'Voting System', 'Member Management'],
        demoUrl: '/demos/dao-governance',
        isPremium: true
      }
    ]
  },
  {
    id: 'defi',
    name: 'DeFi Projects',
    icon: <ShoppingCart className="w-4 h-4" />,
    templates: [
      {
        id: 'defi-dashboard',
        name: 'DeFi Dashboard',
        description: 'All-in-one DeFi management dashboard',
        thumbnail: '/images/templates/defi-dashboard.jpg',
        category: 'defi',
        features: ['Portfolio Tracking', 'Yield Farming', 'Analytics'],
        demoUrl: '/demos/defi-dashboard',
        isNew: true
      }
    ]
  },
  {
    id: 'gaming',
    name: 'Gaming Projects',
    icon: <Gamepad className="w-4 h-4" />,
    templates: [
      {
        id: 'game-inventory',
        name: 'Game Inventory System',
        description: 'Blockchain-based gaming inventory management',
        thumbnail: '/images/templates/game-inventory.jpg',
        category: 'gaming',
        features: ['Item Management', 'Trading System', 'Player Profiles'],
        demoUrl: '/demos/game-inventory',
        isPremium: true
      }
    ]
  }
];