// src/components/contracts/steps/deploy-contract/steps/SettingsStep.tsx
import { Button } from '@/components/ui/button';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { DeploySettings } from '@/types/deploy';

interface SettingsStepProps {
  deploySettings: DeploySettings;
  onSettingsChange: (settings: DeploySettings) => void;
  onContinue: () => void;
}

export const SettingsStep: React.FC<SettingsStepProps> = ({
  deploySettings,
  onSettingsChange,
  onContinue
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Deployment Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure optimization and verification settings for your contract
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">Optimizer Runs</h4>
              <p className="text-sm text-muted-foreground">
                Higher values optimize for high-frequency usage
              </p>
            </div>
            <Select
              value={deploySettings.optimizeRuns.toString()}
              onValueChange={(value) => 
                onSettingsChange({
                  ...deploySettings,
                  optimizeRuns: parseInt(value)
                })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select optimizer runs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="200">200 (Recommended)</SelectItem>
                <SelectItem value="1000">1000 (Advanced)</SelectItem>
                <SelectItem value="10000">10000 (Maximum)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">Contract Verification</h4>
              <p className="text-sm text-muted-foreground">
                Automatically verify contract on explorer
              </p>
            </div>
            <Button
              variant={deploySettings.verifyContract ? "default" : "outline"}
              size="sm"
              onClick={() => 
                onSettingsChange({
                  ...deploySettings,
                  verifyContract: !deploySettings.verifyContract
                })
              }
            >
              {deploySettings.verifyContract ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">Auto-Publish Source</h4>
              <p className="text-sm text-muted-foreground">
                Publish source code to IPFS
              </p>
            </div>
            <Button
              variant={deploySettings.autoPublishSource ? "default" : "outline"}
              size="sm"
              onClick={() => 
                onSettingsChange({
                  ...deploySettings,
                  autoPublishSource: !deploySettings.autoPublishSource
                })
              }
            >
              {deploySettings.autoPublishSource ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          These settings affect deployment cost and contract interaction.
        </AlertDescription>
      </Alert>

      <div className="pt-4">
        <Button 
          className="w-full"
          onClick={onContinue}
        >
          Continue to Deploy
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};