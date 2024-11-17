// components/contracts/steps/publish-dapp/SetupModal.tsx

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle2, 
  AlertCircle,
  Globe,
  Code,
  Database,
  Server
} from "lucide-react";
import { Template } from '@/types/frontendTemplate';

interface SetupModalProps {
  template: Template;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SetupModal: React.FC<SetupModalProps> = ({
  template,
  open,
  onOpenChange,
}) => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [subdomain, setSubdomain] = useState('');

  const handleSetup = async () => {
    setIsProcessing(true);

    const steps = [
      { message: 'Preparing template files...', progress: 25 },
      { message: 'Configuring smart contract connections...', progress: 50 },
      { message: 'Compiling frontend files...', progress: 75 },
      { message: 'Deployment is being completed...', progress: 100 }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProgress(step.progress);
    }

    setIsProcessing(false);
    setStep(3); 
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Template Setup</DialogTitle>
          <DialogDescription>
            Configure {template.name} template for your project
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Configuration</CardTitle>
                  <CardDescription>
                    Settings for frontend access
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subdomain">Subdomain</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        id="subdomain"
                        placeholder="my-project"
                        value={subdomain}
                        onChange={(e) => setSubdomain(e.target.value)}
                      />
                      <span className="text-muted-foreground">.chainlab.space</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                The installation process may take some time. 
                <br />You can close this screen while we are installing.
                </AlertDescription>
              </Alert>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => setStep(2)} 
                disabled={!subdomain}
              >
                Continue
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-4">
              {isProcessing ? (
                <>
                  <Progress value={progress} className="w-full" />
                  <div className="space-y-4">
                    <SetupStep
                      icon={<Globe className="w-4 h-4" />}
                      title="Domain Preparation"
                      isDone={progress >= 25}
                    />
                    <SetupStep
                      icon={<Code className="w-4 h-4" />}
                      title="Template Configuration"
                      isDone={progress >= 50}
                    />
                    <SetupStep
                      icon={<Database className="w-4 h-4" />}
                      title="Contract Integration"
                      isDone={progress >= 75}
                    />
                    <SetupStep
                      icon={<Server className="w-4 h-4" />}
                      title="Deployment"
                      isDone={progress === 100}
                    />
                  </div>
                </>
              ) : (
                <div className="text-center space-y-4 py-4">
                  <h3 className="text-lg font-semibold">Ready to Setup</h3>
                  <p className="text-muted-foreground">
                    All settings are complete. Ready to start the setup.
                  </p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                disabled={isProcessing}
              >
                Geri
              </Button>
              <Button
                onClick={handleSetup}
                disabled={isProcessing}
              >
                {isProcessing ? 'Installing...' : 'Start the installation'}
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-6 py-6">
            <div className="flex justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Installation Completed!</h3>
              <p className="text-muted-foreground">
                Frontend has been successfully deployed.
              </p>
            </div>
            <div className="pt-4">
              <Button
                asChild
                className="w-full"
              >
                <a
                  href={`https://${subdomain}.xyz.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Frontend
                </a>
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Setup Step Component
const SetupStep: React.FC<{
  icon: React.ReactNode;
  title: string;
  isDone: boolean;
}> = ({ icon, title, isDone }) => (
  <div className={`flex items-center gap-3 p-3 rounded-lg border ${
    isDone ? 'border-green-500 bg-green-50' : 'border-muted'
  }`}>
    <div className={`${isDone ? 'text-green-500' : 'text-muted-foreground'}`}>
      {icon}
    </div>
    <span className={isDone ? 'text-green-700' : 'text-muted-foreground'}>
      {title}
    </span>
    {isDone && (
      <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />
    )}
  </div>
);