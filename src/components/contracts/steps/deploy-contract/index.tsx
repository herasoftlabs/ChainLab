// src/components/contracts/steps/deploy-contract/index.tsx
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useProjectStore } from '@/stores/useProjectStore';
import { useWalletStore } from '@/stores/useWalletStore';
import { DeploymentOption, DeployStep, DeploymentStatus } from '@/types/deploy';
import { PlatformType } from '@/types/projectTypes';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Components
import { StepIndicator } from './StepIndicator';
import { DownloadOption } from './options/DownloadOption';
import { DeployOption } from './options/DeployOption';
import { ProjectFiles } from './download/ProjectFiles';
import { DownloadProgress } from './download/DownloadProgress';
import { WalletStep } from './steps/WalletStep';
import { NetworkStep } from './steps/NetworkStep';
import { SettingsStep } from './steps/SettingsStep';
import { DeployStep as DeployStepComponent } from './steps/DeployStep';

// Hooks
import { useDeployment } from '@/hooks/contracts/useDeployment';
import { useDownload } from '@/hooks/contracts/useDownload';
import { useNetworkSwitch } from '@/hooks/contracts/useNetworkSwitch';

export const DeployContract = () => {
  // Options state
  const [selectedOption, setSelectedOption] = useState<DeploymentOption>(null);

  // Store hooks
  const currentProject = useProjectStore((state) => state.currentProject);
  const { isConnected, platform } = useWalletStore();

  // Custom hooks
  const {
    currentStep,
    setCurrentStep,
    deploymentStatus,
    deploymentProgress,
    deployedAddress,
    deploySettings,
    setDeploySettings,
    handleDeploy
  } = useDeployment();

  const {
    isDownloading,
    downloadProgress,
    handleDownload
  } = useDownload();

  const {
    selectedNetwork,
    handleNetworkSelect
  } = useNetworkSwitch();

  // Effect for handling wallet connection
  useEffect(() => {
    if (isConnected && currentStep === 'wallet') {
      setCurrentStep('network');
    }
  }, [isConnected]);

  // Option selection handler
  const handleOptionSelect = (option: DeploymentOption) => {
    setSelectedOption(option);
    if (option === 'deploy') {
      setCurrentStep('wallet');
    }
  };

  // Reset deployment
  const handleReset = () => {
    setCurrentStep('wallet');
  };

  // Build frontend redirect
  const handleBuildFrontend = () => {
    // Frontend builder'a yönlendirme işlemi
  };
  const handleBack = () => {
    switch (currentStep) {
      case 'wallet':
        setSelectedOption(null);
        break;
      case 'network':
        setCurrentStep('wallet');
        break;
      case 'settings':
        setCurrentStep('network');
        break;
      case 'deploy':
        setCurrentStep('settings');
        break;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8 mt-5">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-xl font-bold">Deploy Contract</h1>
        <p className="text-muted-foreground">
          Choose how you want to deploy your smart contract
        </p>
      </div>

      {/* Option Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <DownloadOption
          isSelected={selectedOption === 'download'}
          onClick={() => handleOptionSelect('download')}
        />
        <DeployOption
          isSelected={selectedOption === 'deploy'}
          onClick={() => handleOptionSelect('deploy')}
        />
      </div>

      {/* Selected Option Details */}
      <AnimatePresence mode="wait">
        {selectedOption && (
          <motion.div
            key={selectedOption}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-8"
          >

            
            {selectedOption === 'download' ? (
              <section className="space-y-6">
                

                {isDownloading ? (
                  <DownloadProgress progress={downloadProgress} />
                ) : (
                    <ProjectFiles
                    isDownloading={isDownloading}
                    onDownload={() => handleDownload(currentProject?.id || '', currentProject?.name || '')}
                    onBack={() => setSelectedOption(null)}
                    fileTree={[]} 
                  />
                )}
              </section>
            ) : (
                <section className="space-y-">
                <Card className="w-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle>Deploy to Network</CardTitle>
                        <CardDescription>
                          Deploy your contract directly to blockchain
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBack}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Step Indicator */}
                    <div className="">
                      <StepIndicator 
                        currentStep={currentStep}
                        status={deploymentStatus}
                      />
                    </div>
            
                    {/* Deployment Steps */}
                    <div className="pt-4 border-t">
                    {currentStep === 'wallet' && currentProject?.chain && (
                      <WalletStep
                        isConnected={isConnected}
                        projectChain={currentProject?.chain}
                        onNetworkSelect={handleNetworkSelect}
                        onContinue={() => setCurrentStep('network')}
                      />
                    )}
                      {currentStep === 'network' && currentProject?.chain && (
                        <NetworkStep
                          platform={currentProject.platform as PlatformType}
                          projectChain={currentProject.chain}
                          selectedNetwork={selectedNetwork}
                          onNetworkSelect={handleNetworkSelect}
                          onContinue={() => setCurrentStep('settings')}
                        />
                      )}
                      {currentStep === 'settings' && (
                        <SettingsStep
                          deploySettings={deploySettings}
                          onSettingsChange={setDeploySettings}
                          onContinue={() => setCurrentStep('deploy')}
                        />
                      )}
                      {currentStep === 'deploy' && (
                        <DeployStepComponent
                          deploymentStatus={deploymentStatus}
                          deploymentProgress={deploymentProgress}
                          deployedAddress={deployedAddress}
                          selectedNetwork={selectedNetwork}
                          chainKey={currentProject?.chain?.key || ''}
                          deploySettings={deploySettings}
                          onDeploy={handleDeploy}
                          onReset={handleReset}
                          onBuildFrontend={handleBuildFrontend}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeployContract;