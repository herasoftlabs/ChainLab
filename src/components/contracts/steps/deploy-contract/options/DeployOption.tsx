// src/components/contracts/steps/deploy-contract/options/DeployOption.tsx
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Rocket, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface DeployOptionProps {
  isSelected: boolean;
  onClick: () => void;
}

export const DeployOption: React.FC<DeployOptionProps> = ({ isSelected, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card 
        className={`cursor-pointer transition-all ${
          isSelected ? 'ring-2 ring-primary' : 'hover:shadow-lg'
        }`}
        onClick={onClick}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="w-6 h-6" />
            Auto Deployment
          </CardTitle>
          <CardDescription>
            Deploy directly to blockchain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              One-click deployment
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Automatic verification
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Guided deployment process
            </li>
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
};