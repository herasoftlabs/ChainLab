// src/components/contracts/steps/deploy-contract/StepIndicator.tsx
import { Wallet, Network, Settings, Rocket } from 'lucide-react';
import { DeployStep, DeploymentStatus, StepConfig } from '@/types/deploy';

interface StepIndicatorProps {
  currentStep: DeployStep;
  status: DeploymentStatus;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, status }) => {
  const steps: StepConfig[] = [
    { id: 'wallet', title: 'Connect Wallet', icon: <Wallet className="h-4 w-4" /> },
    { id: 'network', title: 'Select Network', icon: <Network className="h-4 w-4" /> },
    { id: 'settings', title: 'Configure', icon: <Settings className="h-4 w-4" /> },
    { id: 'deploy', title: 'Deploy', icon: <Rocket className="h-4 w-4" /> },
  ];

  return (
    <div className="flex justify-around bg-gray-200 py-3 rounded-lg">
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={`flex flex-col items-center ${
            steps.findIndex(s => s.id === currentStep) >= index
              ? 'text-primary'
              : 'text-muted-foreground'
          }`}
        >
          <div className="relative">
            <div className={`
              w-8 h-8 rounded-full border-2 flex items-center justify-center
              ${step.id === currentStep ? 'border-primary bg-primary/10' : ''}
              ${steps.findIndex(s => s.id === currentStep) > index ? 'border-primary bg-primary/5' : ''}
            `}>
              {step.icon}
            </div>
            {index < steps.length - 1 && (
              <div className={`
                absolute top-1/2 left-8 w-[calc(100%-2rem)] h-[2px]
                ${steps.findIndex(s => s.id === currentStep) > index ? 'bg-primary' : 'bg-border'}
              `} />
            )}
          </div>
          <span className="text-xs mt-2">{step.title}</span>
        </div>
      ))}
    </div>
  );
};