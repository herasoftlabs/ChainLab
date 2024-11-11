// components/contracts/steps/edit-contract/chain/evm/ComponentPalette/ComponentTooltip.tsx
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
  } from '@/components/ui/tooltip';
  
  interface ComponentTooltipProps {
    name: string;
    description: string;
    children: React.ReactNode;
  }
  
  export const ComponentTooltip: React.FC<ComponentTooltipProps> = ({
    name,
    description,
    children,
  }) => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{children}</TooltipTrigger>
          <TooltipContent side="right" align="center">
            <p className="font-medium">{name}</p>
            <p className="text-xs">{description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };