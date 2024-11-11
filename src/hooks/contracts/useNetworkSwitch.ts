// src/hooks/contracts/useNetworkSwitch.ts

import { useState } from 'react';
import { toast } from 'react-toastify';
import { switchToChain } from '@/utils/chains/evm/evm';

export const useNetworkSwitch = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<string>('');

  const handleNetworkSelect = async (networkId: string) => {  
    try {
      setSelectedNetwork(networkId);
      await switchToChain(networkId);
      toast.success('Network switched successfully');
    } catch (error) {
      console.error('Network switch error:', error);
      toast.error('Failed to switch network');
    }
  };

  return {
    selectedNetwork,
    handleNetworkSelect,
  };
};