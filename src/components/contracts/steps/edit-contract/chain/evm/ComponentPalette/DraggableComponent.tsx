import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { 
  ComponentType, 
  ComponentCategoryMain,
  Mutability,
  DataType
} from '@/types/evm/contractTypes';

interface Props {
  id: string;
  type: ComponentType;
  category: ComponentCategoryMain;
  stateMutability?: Mutability;
  dataType?: DataType;
  children: React.ReactNode;
}

export const DraggableComponent: React.FC<Props> = ({
  id,
  type,
  category,
  stateMutability,
  dataType,
  children
}) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `palette-${id}`, 
    data: {
      type: 'new-template',
      payload: {
        componentType: type,
        category: category,
        stateMutability,
        dataType
      }
    }
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="cursor-move"
    >
      {children}
    </div>
  );
};