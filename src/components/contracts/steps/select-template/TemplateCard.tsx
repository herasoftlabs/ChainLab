// components/contracts/steps/select-template/TemplateCard.tsx
import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, CheckCircle } from "lucide-react";

interface TemplateCardProps {
  template: any;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: () => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected,
  isDisabled,
  onSelect,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`
          relative cursor-pointer transition-all duration-200
          hover:shadow-lg hover:border-primary/50
          h-[280px] flex flex-col
          ${isSelected ? 'border-primary ring-2 ring-primary/20' : ''}
          ${isDisabled ? 'opacity-50 pointer-events-none' : ''}
        `}
        onClick={onSelect}
      >
        {isDisabled && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <Lock className="h-6 w-6 text-muted-foreground" />
          </div>
        )}

        <CardHeader className="flex-none pb-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold line-clamp-1">{template.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {template.description}
              </p>
            </div>
            {isSelected && (
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 ml-2" />
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-grow pb-3">
          <div className="flex flex-wrap gap-1.5">
            {template.features?.slice(0, 4).map((feature: string, index: number) => (
              <Badge 
                key={index} 
                variant="secondary"
                className="text-xs"
              >
                {feature}
              </Badge>
            ))}
            {template.features?.length > 4 && (
              <Badge 
                variant="secondary"
                className="text-xs"
              >
                +{template.features.length - 4} more
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex-none pt-3 border-t">
          <div className="w-full flex items-center justify-between">
            {template.complexity && (
              <Badge 
                variant="outline" 
                className="text-xs"
              >
                {template.complexity}
              </Badge>
            )}
            {template.category && (
              <Badge 
                variant="secondary"
                className="text-xs"
              >
                {template.category}
              </Badge>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};