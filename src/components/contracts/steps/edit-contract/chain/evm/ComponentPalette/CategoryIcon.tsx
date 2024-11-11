// components/contracts/steps/edit-contract/chain/evm/ComponentPalette/CategoryIcon.tsx
import { Icons, IconName } from '@/components/ui/icons';

interface CategoryIconProps {
  icon: IconName;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ icon, className }) => {
  const Icon = Icons[icon];
  return <Icon className={className || "h-4 w-4"} />;
};