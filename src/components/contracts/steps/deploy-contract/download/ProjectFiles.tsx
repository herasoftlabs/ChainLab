// src/components/contracts/steps/deploy-contract/download/ProjectFiles.tsx
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';

interface ProjectFilesProps {
  isDownloading: boolean;
  onDownload: () => void;
  onBack: () => void;
  fileTree: any[];
}

export const ProjectFiles: React.FC<ProjectFilesProps> = ({
  isDownloading,
  onDownload,
}) => {
  return (
    <Card className="w-full bg-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Download Project Files</CardTitle>
            <CardDescription>
              Get your project files for manual deployment
            </CardDescription>
          </div>
         
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
      

        {/* Download Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Download Options</h3>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="rounded-md border border-gray-300 p-4 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Format:</span>
              <span className="font-medium">ZIP Archive</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Includes:</span>
              <span className="font-medium">All Project Files (Contract + Test + Migrate Files)</span>
            </div>
            <Button 
              className="w-full"
              onClick={onDownload}
              disabled={isDownloading}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Project
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};