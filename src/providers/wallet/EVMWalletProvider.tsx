// src/providers/wallet/EVMWalletProvider.tsx

'use client';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { ConnectKitProvider } from 'connectkit';
import { mainnet, sepolia,taiko,taikoHekla,holesky } from 'wagmi/chains';
import { injected, metaMask } from 'wagmi/connectors';
import { useCurrentProject } from '@/stores/useProjectStore';
import { findChainByIdAndKey } from '@/utils/constants';

export const EVMWalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentProject = useCurrentProject();
  const chainData = currentProject 
    ? findChainByIdAndKey(currentProject.chain.id, currentProject.chain.key)
    : null;

  const config = createConfig({
    chains: [mainnet, sepolia],
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
      [taiko.id]: http(),
      [taikoHekla.id]: http(),
      [holesky.id]: http(),
    },
    connectors: [
      injected(),
      metaMask(),
    ],
  });

  return (
    <WagmiProvider config={config}>
      <ConnectKitProvider
        customTheme="auto"
        options={{
          initialChainId: chainData ? parseInt(chainData.id) : undefined,
        }}
      >
        {children}
      </ConnectKitProvider>
    </WagmiProvider>
  );
};