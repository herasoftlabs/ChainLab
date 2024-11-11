// src/components/contracts/steps/deploy-contract/steps/WalletStep.tsx
import { DynamicWalletButton } from '@/components/wallet/DynamicWalletButton';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  SwitchCamera 
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useWalletStore } from '@/stores/useWalletStore';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'react-toastify';
import { switchToChain } from '@/utils/chains/evm/evm';
import { Chain } from '@/types/projectTypes';

interface WalletStepProps {
  isConnected: boolean;
  projectChain: Chain;
  onNetworkSelect: (networkId: string) => void;
  onContinue: () => void;
}

export const WalletStep: React.FC<WalletStepProps> = ({ 
  isConnected,
  projectChain,
  onNetworkSelect,
  onContinue 
}) => {
  const { chainId } = useWalletStore();
  const [showChainWarning, setShowChainWarning] = useState(false);

  useEffect(() => {
    if (projectChain && chainId && chainId !== projectChain.id) {
      setShowChainWarning(true);
    } else {
      setShowChainWarning(false);
    }
  }, [chainId, projectChain]);

  if (!projectChain) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No chain configuration found for this project.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  const handleSwitchChain = async () => {
    try {
      await switchToChain(projectChain.id);
      toast.success('Network switched successfully');
      setShowChainWarning(false);
    } catch (error) {
      console.error('Failed to switch network:', error);
      toast.error('Failed to switch network');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Connect Your Wallet</h3>
        <p className="text-sm text-muted-foreground">
          Connect your wallet to start the deployment process
        </p>
      </div>

      <div className="space-y-4">
        <DynamicWalletButton />
        
        {isConnected && (
          <>
            {showChainWarning && (
              <Alert variant="default" className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Wrong network detected. Please switch to {projectChain.name}
                  </AlertDescription>
                </div>
                {/* <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSwitchChain}
                  className="ml-4"
                >
                  <SwitchCamera className="mr-2 h-4 w-4" />
                  Switch Network
                </Button> */}
              </Alert>
            )}

            <div className="pt-4">
              <Button 
                className="w-full"
                onClick={() => {
                  onNetworkSelect(projectChain.id);
                  onContinue();
                }}
                disabled={showChainWarning}
              >
                Continue to Network Selection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};