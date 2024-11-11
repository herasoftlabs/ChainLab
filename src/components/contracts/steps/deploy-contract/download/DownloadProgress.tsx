// src/components/contracts/steps/deploy-contract/download/DownloadProgress.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

interface DownloadProgressProps {
  progress: number;
}

export const DownloadProgress: React.FC<DownloadProgressProps> = ({ progress }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {progress < 90 ? 'Preparing files...' : 
                 progress < 100 ? 'Creating ZIP file...' : 
                 'Download completed!'}
              </span>
              <span className="font-medium">%{Math.round(progress)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};