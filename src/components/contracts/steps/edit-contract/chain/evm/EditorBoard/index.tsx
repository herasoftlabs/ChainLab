// components/contracts/steps/edit-contract/chain/evm/EditorBoard/index.tsx

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Grid } from './Grid';
import { ComponentInstance } from './ComponentInstance';
import { ConnectionLine } from './ConnectionLine';
import { DraggableComponent } from '@/types/evm/contractTypes';
import { cn } from '@/lib/utils';

interface Props {
  components: Record<string, DraggableComponent>;  
  selectedComponentId: string | null;              
  onComponentSelect: (id: string) => void;         
  zoom: number;                                    
  showGrid: boolean;                              
  isConnecting: boolean;                          
  connectionStart: string | null;                  
  onConnectionStart: (id: string) => void;         
  onConnectionEnd: (id: string) => void;           
}

export const EditorBoard: React.FC<Props> = ({
  components,
  selectedComponentId,
  onComponentSelect,
  zoom,
  showGrid,
  isConnecting,
  connectionStart,
  onConnectionStart,
  onConnectionEnd,
}) => {
 
  const { setNodeRef, isOver } = useDroppable({
    id: 'editor-board',
    data: {
      type: 'board'
    }
  });

  const [viewport, setViewport] = React.useState({ x: 0, y: 0 });
  const visibleComponents = React.useMemo(() => {
    if (!components || Object.keys(components).length === 0) {
      return [];
    }

    return Object.values(components).filter(component => {
      if (!component?.position) {
        console.warn(`Component ${component?.id} has no position`);
        return false;
      }

      const { x = 0, y = 0 } = component.position;

      return x >= viewport.x - 100 && 
             x <= viewport.x + window.innerWidth &&
             y >= viewport.y - 100 && 
             y <= viewport.y + window.innerHeight;
    });
  }, [components, viewport]);

  const handleScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setViewport({
      x: target.scrollLeft,
      y: target.scrollTop
    });
  }, []);

  // Bileşenler yoksa loading veya empty state göster
  /* if (!components || Object.keys(components).length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        No components to display
      </div>
    );
  } */

 
return (
  <div
    id="editor-board"
    ref={setNodeRef}
    className={cn(
      // Base styles
      "w-full h-full relative overflow-auto",
      // Conditional styles
      isOver && "bg-blue-50 transition-colors duration-200",
      isConnecting && "cursor-crosshair"
    )}
    style={{
      transform: `scale(${zoom})`,
      transformOrigin: '0 0',
      minWidth: '100px',
      minHeight: '100px',
    }}
    onScroll={handleScroll}
  >
    {/* Grid background */}
    {showGrid && <Grid isDragging={isOver} zoom={zoom} />}

    {/* Components and connections container */}
    <div className="relative p-4">
      {/* Connection lines */}
      <svg className="absolute inset-0 pointer-events-none">
        {visibleComponents.map((component) =>
          (component.connections || []).map((targetId) => (
            <ConnectionLine
              key={`${component.id}-${targetId}`}
              startId={component.id}
              endId={targetId}
            />
          ))
        )}
      </svg>

      {/* Component instances */}
      {visibleComponents.map((component) => (
        <ComponentInstance
          key={component.id}
          component={component}
          isSelected={component.id === selectedComponentId}
          isConnecting={isConnecting}
          isConnectionStart={component.id === connectionStart}
          onClick={() => {
            if (isConnecting) {
              onConnectionEnd(component.id);
            } else {
              onComponentSelect(component.id);
            }
          }}
          onConnectionStart={() => onConnectionStart(component.id)}
          gridSize={20}
        />
      ))}
    </div>
  </div>
);

};