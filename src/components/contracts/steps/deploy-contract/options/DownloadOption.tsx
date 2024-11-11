// src/components/contracts/steps/deploy-contract/options/DownloadOption.tsx
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Download, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface DownloadOptionProps {
  isSelected: boolean;
  onClick: () => void;
}

export const DownloadOption: React.FC<DownloadOptionProps> = ({ isSelected, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        className={`cursor-pointer transition-all ${
          isSelected ? 'ring-2 ring-primary' : 'hover:shadow-lg'
        }`}
        onClick={onClick}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-6 h-6" />
            Manual Deployment
          </CardTitle>
          <CardDescription>
            Download project files and deploy manually
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Complete project structure
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              All contract files included
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Deploy at your own pace
            </li>
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
};