// src/components/contracts/steps/deploy-contract/steps/NetworkStep.tsx
import { Button } from '@/components/ui/button';
import { ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PlatformType, Chain } from '@/types/projectTypes';
import { SUPPORTED_PLATFORMS } from '@/utils/constants';
import { ChainIcon } from '@/components/ui/ChainIcon';

interface NetworkStepProps {
  platform: PlatformType;
  projectChain: Chain | undefined;
  selectedNetwork: string;
  onNetworkSelect: (networkId: string) => void;
  onContinue: () => void;
}

export const NetworkStep: React.FC<NetworkStepProps> = ({
  platform,
  projectChain,
  selectedNetwork,
  onNetworkSelect,
  onContinue
}) => {
  
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

  const platformData = SUPPORTED_PLATFORMS.find(p => p.id === platform);
  const chainData = platformData?.chains.find(c => c.id === projectChain.id);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Network Configuration</h3>
        <p className="text-sm text-muted-foreground">
          Your contract will be deployed to {projectChain.name} network
        </p>
      </div>

      <div className="space-y-4">

        <div className="p-4 rounded-lg border bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ChainIcon 
                chainId={projectChain.id}
                chainKey={projectChain.key}
                size={32}
              />
              <div>
                <p className="font-medium">{projectChain.name}</p>
                <p className="text-sm text-muted-foreground">
                  {projectChain.testnet ? 'Testnet' : 'Mainnet'}
                </p>
              </div>
            </div>
            {projectChain.testnet ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            )}
          </div>
        </div>
        <Alert variant={"default"} className='flex items-center'>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {projectChain.testnet
              ? "This is a testnet deployment. Perfect for testing your contract."
              : "This is a mainnet deployment. Make sure you have enough funds."}
          </AlertDescription>
        </Alert>
      </div>

      <div className="pt-4">
        <Button 
          className="w-full"
          onClick={() => {
            onNetworkSelect(projectChain.id);
            onContinue();
          }}
        >
          Continue to Settings
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};