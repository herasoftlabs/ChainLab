// src/components/contracts/steps/deploy-contract/steps/DeployStep.tsx
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Rocket, 
  AlertCircle, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  Loader2, 
  ArrowRight,
  RefreshCw 
} from 'lucide-react';
import { toast } from 'react-toastify';
import { DeploymentStatus, DeploySettings } from '@/types/deploy';
import { CHAIN_METADATA } from '@/utils/chains/evm/evm';
import { getExplorerUrl } from '@/utils/chains/evm/evm';
import { findChainByIdAndKey } from '@/utils/constants';
import { ChainIcon } from '@/components/ui/ChainIcon';

interface DeployStepProps {
  deploymentStatus: DeploymentStatus;
  deploymentProgress: number;
  deployedAddress: string;
  selectedNetwork: string;
  chainKey: string;
  deploySettings: DeploySettings;
  onDeploy: (chainId: string, chainKey: string) => Promise<void>;
  onReset: () => void;
  onBuildFrontend: () => void;
}

export const DeployStep: React.FC<DeployStepProps> = ({
  deploymentStatus,
  deploymentProgress,
  deployedAddress,
  selectedNetwork,
  chainKey,
  deploySettings,
  onDeploy,
  onReset,
  onBuildFrontend
}) => {

  const chainData = findChainByIdAndKey(selectedNetwork, chainKey);

  const getExplorerUrl = () => {
    if (!chainData?.blockExplorers?.default?.url) return '#';
    return `${chainData.blockExplorers.default.url}/address/${deployedAddress}`;
  };

  return (
    <div className="space-y-6">
      {deploymentStatus === 'idle' && (
        <>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Review and Deploy</h3>
            <p className="text-sm text-muted-foreground">
              Review your deployment settings and deploy your contract
            </p>
          </div>

          <div className="rounded-lg border divide-y">
            <div className="p-4 space-y-4">
              <h4 className="text-sm font-medium">Deployment Summary</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Network</span>
                  <div className="flex items-center gap-2">
                    {chainData && (
                      <ChainIcon 
                        chainId={selectedNetwork}
                        chainKey={chainKey}
                        size={16}
                      />
                    )}
                    <span className="font-medium">
                      {chainData?.name || 'Unknown Network'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Optimizer Runs</span>
                  <span className="font-medium">{deploySettings.optimizeRuns}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Contract Verification</span>
                  <span className="font-medium">{deploySettings.verifyContract ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Auto-Publish Source</span>
                  <span className="font-medium">{deploySettings.autoPublishSource ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          </div>

          <Alert variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This action cannot be undone. Please review the settings carefully.
            </AlertDescription>
          </Alert>

          <Button 
            className="w-full"
            onClick={() => onDeploy(selectedNetwork, chainKey)}
          >
            Deploy Contract
            <Rocket className="ml-2 h-4 w-4" />
          </Button>
        </>
      )}

      {['compiling', 'deploying', 'verifying'].includes(deploymentStatus) && (
        <div className="space-y-8">
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {deploymentStatus === 'compiling' ? 'Compiling Contract' :
               deploymentStatus === 'deploying' ? 'Deploying Contract' :
               'Verifying Contract'}
            </h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              {deploymentStatus === 'compiling' ? 'Optimizing and preparing your contract...' :
               deploymentStatus === 'deploying' ? 'Deploying to the selected network...' :
               'Verifying contract on block explorer...'}
            </p>
          </div>

          <div className="space-y-2">
            <Progress value={deploymentProgress} className="w-full" />
            <div className="flex justify-end">
              <span className="text-sm text-muted-foreground">
                {Math.round(deploymentProgress)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {deploymentStatus === 'success' && (
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center py-6">
            <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Deployment Successful!
            </h3>
            <p className="text-sm text-muted-foreground text-center">
              Your contract has been deployed and verified
            </p>
          </div>

          <div className="rounded-lg border p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Contract Address</span>
              <div className="flex items-center gap-2">
              <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(deployedAddress);
                    toast.success('Address copied to clipboard');
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const url = getExplorerUrl();
                    if (url !== '#') {
                      window.open(url, '_blank');
                    }
                  }}
                  disabled={!chainData?.blockExplorers?.default?.url}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <code className="block w-full p-3 bg-muted rounded-md text-xs font-mono break-all">
              {deployedAddress}
            </code>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={onReset}
            >
              Deploy Another
              <RefreshCw className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              className="flex-1"
              onClick={onBuildFrontend}
            >
              Build Frontend
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {deploymentStatus === 'error' && (
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center py-6">
            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Deployment Failed
            </h3>
            <p className="text-sm text-muted-foreground text-center">
              There was an error during deployment
            </p>
          </div>

          <Button 
            variant="outline"
            className="w-full"
            onClick={onReset}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};