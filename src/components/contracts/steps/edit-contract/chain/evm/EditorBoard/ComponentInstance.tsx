// components/contracts/steps/edit-contract/chain/evm/EditorBoard/ComponentInstance.tsx

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { DraggableComponent } from '@/types/evm/contractTypes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'lucide-react';

interface Props {
  component: DraggableComponent;
  isSelected: boolean;
  isConnecting: boolean;
  isConnectionStart: boolean;
  onClick: () => void;
  onConnectionStart: () => void;
  gridSize?: number;
}

export const ComponentInstance: React.FC<Props> = ({
  component,
  isSelected,
  isConnecting,
  isConnectionStart,
  onClick,
  onConnectionStart,
  gridSize = 20,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: component.id,
    data: {
      type: 'existing-component',
      payload: {
        id: component.id,
        componentType: component.type,
      },
    },
  });


  const getComponentStyles = () => {
    switch (component.type) {
      case 'function':
        return {
          borderColor: 'border-blue-500',
          bgColor: 'bg-blue-50',
          iconColor: 'text-blue-500',
        };
      case 'event':
        return {
          borderColor: 'border-green-500',
          bgColor: 'bg-green-50',
          iconColor: 'text-green-500',
        };
      case 'variable':
        return {
          borderColor: 'border-purple-500',
          bgColor: 'bg-purple-50',
          iconColor: 'text-purple-500',
        };
      case 'struct':
        return {
          borderColor: 'border-yellow-500',
          bgColor: 'bg-yellow-50',
          iconColor: 'text-yellow-500',
        };
      case 'enum':
        return {
          borderColor: 'border-red-500',
          bgColor: 'bg-red-50',
          iconColor: 'text-red-500',
        };
      case 'modifier':
        return {
          borderColor: 'border-indigo-500',
          bgColor: 'bg-indigo-50',
          iconColor: 'text-indigo-500',
        };
      default:
        return {
          borderColor: 'border-gray-500',
          bgColor: 'bg-gray-50',
          iconColor: 'text-gray-500',
        };
    }
  };

  const { borderColor, bgColor, iconColor } = getComponentStyles();

  const style: React.CSSProperties = {
    position: 'absolute',
    left: component.position.x,
    top: component.position.y,
    cursor: isDragging ? 'grabbing' : 'grab',
    transform: isDragging ? 'scale(1.05)' : undefined,
    transition: isDragging ? 'none' : 'all 0.2s ease',
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 1000 : 1,
    pointerEvents: isDragging ? 'none' : 'auto',
    touchAction: 'none',
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        'absolute p-4 rounded-lg shadow-md border',
        borderColor,
        bgColor,
        'cursor-grab active:cursor-grabbing',
        'transition-all duration-200',
        isSelected && 'ring-2 ring-blue-500',
        isConnectionStart && 'ring-2 ring-green-500',
        isConnecting && 'cursor-crosshair',
        isDragging && 'opacity-60 scale-105 rotate-2 shadow-xl',
      )}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {/* Icon */}
          <div className={cn('w-5 h-5', iconColor)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {/* Example icon path */}
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          {/* Component Name */}
          <span className="text-sm font-medium truncate max-w-[150px]">
            {component.data.name}
          </span>
        </div>
        {/* Connection Button */}
        {!isConnecting && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 p-0 ml-2"
            onClick={(e) => {
              e.stopPropagation();
              onConnectionStart();
            }}
          >
            <Link className="h-4 w-4" />
          </Button>
        )}
      </div>
      {/* Body */}
      <div className="text-xs text-gray-600">
        {/* Component Type */}
        <Badge variant="secondary" className="capitalize">
          {component.type}
        </Badge>
      </div>
    </div>
  );
};
