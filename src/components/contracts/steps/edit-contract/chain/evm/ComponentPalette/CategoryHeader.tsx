// components/contracts/steps/edit-contract/chain/evm/ComponentPalette/CategoryHeader.tsx
import { CategoryIcon } from './CategoryIcon';
import { IconName } from '@/components/ui/icons';

interface CategoryHeaderProps {
  title: string;
  icon: IconName;
}

export const CategoryHeader: React.FC<CategoryHeaderProps> = ({ title, icon }) => {
  return (
    <div className="flex items-center gap-2 py-1">
      <CategoryIcon icon={icon} />
      <span className='no-underline'>{title}</span>
    </div>
  );
};