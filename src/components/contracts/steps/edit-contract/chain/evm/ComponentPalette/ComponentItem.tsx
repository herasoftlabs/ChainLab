// components/contracts/steps/edit-contract/chain/evm/ComponentPalette/ComponentItem.tsx

import React from 'react';
import {
  ComponentType,
  ComponentCategoryMain,
  SubCategoryType,
  Mutability,
} from '@/types/evm/contractTypes';
import { Icons } from '@/components/ui/icons';
import { CategoryIcon } from './CategoryIcon';
import { DraggableComponent } from './DraggableComponent';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Props {
  id: string;
  type: ComponentType;
  name: string;
  description: string;
  category: ComponentCategoryMain;
  subcategory: SubCategoryType;
  icon: keyof typeof Icons;
  dataType?: string;
  stateMutability?: Mutability;
}

export const ComponentItem: React.FC<Props> = ({
  id,
  type,
  name,
  description,
  category,
  subcategory,
  icon,
  dataType,
  stateMutability,
}) => {
  const getComponentStyles = () => {
    switch (type) {
      case 'function':
        return {
          borderColor: 'border-blue-200',
          hoverBgColor: 'hover:bg-blue-50',
          iconColor: stateMutability === 'view' || stateMutability === 'pure' ? 'text-blue-500' : 'text-green-500',
        };
      case 'variable':
        return {
          borderColor: 'border-purple-200',
          hoverBgColor: 'hover:bg-purple-50',
          iconColor: 'text-purple-500',
        };
      case 'event':
        return {
          borderColor: 'border-green-200',
          hoverBgColor: 'hover:bg-green-50',
          iconColor: 'text-green-500',
        };
      case 'struct':
        return {
          borderColor: 'border-yellow-200',
          hoverBgColor: 'hover:bg-yellow-50',
          iconColor: 'text-yellow-500',
        };
      case 'enum':
        return {
          borderColor: 'border-red-200',
          hoverBgColor: 'hover:bg-red-50',
          iconColor: 'text-red-500',
        };
      case 'modifier':
        return {
          borderColor: 'border-indigo-200',
          hoverBgColor: 'hover:bg-indigo-50',
          iconColor: 'text-indigo-500',
        };
      default:
        return {
          borderColor: 'border-gray-200',
          hoverBgColor: 'hover:bg-gray-50',
          iconColor: 'text-gray-500',
        };
    }
  };

  const { borderColor, hoverBgColor, iconColor } = getComponentStyles();

  const getFunctionBadge = () => {
    if (type === 'function' && stateMutability) {
      const badgeColor =
        stateMutability === 'view' || stateMutability === 'pure'
          ? 'bg-blue-100 text-blue-800'
          : stateMutability === 'payable'
          ? 'bg-purple-100 text-purple-800'
          : 'bg-green-100 text-green-800';
      return (
        <Badge className={badgeColor}>
          {stateMutability}
        </Badge>
      );
    }
    return null;
  };

  return (
    <DraggableComponent
      id={id}
      type={type}
      category={category}
      subcategory={subcategory}
      stateMutability={stateMutability}
    >
      <div
        className={cn(
          'm-1 p-3 bg-white rounded-lg border',
          borderColor,
          hoverBgColor,
          'transition-colors duration-200 cursor-pointer',
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <CategoryIcon
              icon={icon}
              className={cn('w-6 h-6', iconColor)}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 truncate">
                {name}
              </span>
              {getFunctionBadge()}
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-gray-500 truncate">
                {description}
              </p>
              {dataType && (
                <span className="text-xs text-gray-400 ml-2">
                  {dataType}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </DraggableComponent>
  );
};
