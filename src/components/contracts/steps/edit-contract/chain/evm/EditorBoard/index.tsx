// components/contracts/steps/edit-contract/chain/evm/EditorBoard/index.tsx

import React, {useState} from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Grid } from './Grid';
import { ComponentInstance } from './ComponentInstance';
import { ConnectionLine } from './ConnectionLine';
import { DraggableComponent } from '@/types/evm/contractTypes';
import { cn } from '@/lib/utils';
import { ComponentCategoryMain } from '@/types/evm/contractTypes';

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
  expandedComponentId: string | null; 
  onExpand: (id: string | null) => void;     
}

interface CategoryConfig {
  column: number;
  order: number;
}

interface LayoutConfig {
  COLUMN_WIDTH: number;
  COMPONENT_SPACING: number;
  CATEGORY_SPACING: number;
  START_X: number;
  START_Y: number;
  CATEGORIES: Record<ComponentCategoryMain, CategoryConfig>;
}

const LAYOUT_CONFIG: LayoutConfig = {
  COLUMN_WIDTH: 200,         
  COMPONENT_SPACING: 0,     
  CATEGORY_SPACING: 5,      
  START_X: 20,
  START_Y: 130,
  CATEGORIES: {
    'BasicComponents': { column: 0, order: 0 },  
    'StateVariables': { column: 1, order: 0 },   
    'Functions': { column: 2, order: 0 },        
    'DataStructures': { column: 3, order: 0 },   
    'OracleIntegrations': { column: 4, order: 0 } 
  }
};

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
  const [expandedComponentId, setExpandedComponentId] = useState<string | null>(null);
  const [boardSize, setBoardSize] = React.useState({ width: 0, height: 0 });


  const handleScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setViewport({
      x: target.scrollLeft,
      y: target.scrollTop
    });
  }, []);

  const calculateBoardDimensions = React.useCallback(() => {
    if (!components || Object.keys(components).length === 0) {
      return {
        width: window.innerWidth,
        height: window.innerHeight
      };
    }

    const MARGIN = 100; 
    
    
    const dimensions = Object.values(components).reduce(
      (acc, component) => {
        const rightEdge = (component.position.x + LAYOUT_CONFIG.COLUMN_WIDTH) * zoom;
        const bottomEdge = (component.position.y + (component.height || 100)) * zoom;

        return {
          width: Math.max(acc.width, rightEdge),
          height: Math.max(acc.height, bottomEdge)
        };
      },
      { width: 0, height: 0 }
    );
    return {
      width: Math.max(window.innerWidth, dimensions.width + MARGIN),
      height: Math.max(window.innerHeight, dimensions.height + MARGIN)
    };
  }, [components, zoom]);

  React.useEffect(() => {
    const dimensions = calculateBoardDimensions();
    setBoardSize(dimensions);
  }, [components, zoom, calculateBoardDimensions]);
  
  const organizedComponents = React.useMemo(() => {
    if (!components || Object.keys(components).length === 0) {
      return [];
    }
  
    const groupedComponents = Object.values(components).reduce((acc, component) => {
      const category = component.data.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(component);
      return acc;
    }, {} as Record<ComponentCategoryMain, DraggableComponent[]>);
 
    return Object.entries(groupedComponents).flatMap(([category, categoryComponents]) => {
      const categoryConfig = LAYOUT_CONFIG.CATEGORIES[category as ComponentCategoryMain];
      if (!categoryConfig) return [];
  
      const categoryX = LAYOUT_CONFIG.START_X + 
                       (categoryConfig.column * (LAYOUT_CONFIG.COLUMN_WIDTH + LAYOUT_CONFIG.CATEGORY_SPACING));
  
      return categoryComponents.map((component, index) => {
        if (component.position.x !== 0 || component.position.y !== 0) {
          return component;
        }
  
        return {
          ...component,
          position: {
            x: categoryX,
            y: LAYOUT_CONFIG.START_Y + (index * (component.height + LAYOUT_CONFIG.COMPONENT_SPACING))
          }
        };
      });
    });
  }, [components]);

  React.useEffect(() => {
    const board = document.getElementById('editor-board');
    if (board) {
      const updateViewport = () => {
        setViewport({
          x: board.scrollLeft,
          y: board.scrollTop
        });
      };

      board.addEventListener('scroll', updateViewport);
      return () => board.removeEventListener('scroll', updateViewport);
    }
  }, []);

  const visibleComponents = React.useMemo(() => {
    return organizedComponents.filter(component => {
      const { x = 0, y = 0 } = component.position;
      const buffer = 200; 
      return x >= viewport.x - buffer && 
             x <= viewport.x + window.innerWidth + buffer &&
             y >= viewport.y - buffer && 
             y <= viewport.y + window.innerHeight + buffer;
    });
  }, [organizedComponents, viewport]);



  const sortedComponents = React.useMemo(() => {
    return visibleComponents.sort((a, b) => {
      if (a.id === expandedComponentId) return 1;
      if (b.id === expandedComponentId) return -1;
      if (a.id === selectedComponentId) return 1;
      if (b.id === selectedComponentId) return -1;
      return 0;
    });
  }, [visibleComponents, expandedComponentId, selectedComponentId]);
 
  return (
    <div
      id="editor-board"
      ref={setNodeRef}
      className={cn(
        "w-full h-full relative overflow-auto",
        isOver && "bg-blue-50 transition-colors duration-200",
        isConnecting && "cursor-crosshair"
      )}
      style={{
        width: '100%',
        height: '100%',
        minWidth: `${boardSize.width}px`,
        minHeight: `${boardSize.height}px`,
      }}
      onScroll={handleScroll}
    >
      {showGrid && (
        <div 
          style={{ 
            width: `${boardSize.width}px`, 
            height: `${boardSize.height}px`,
            position: 'absolute',
            top: 0,
            left: 0
          }}
        >
          <Grid isDragging={isOver} zoom={zoom} />
        </div>
      )}
      
      <div 
        className="absolute inset-0"
        style={{ 
          transform: `scale(${zoom})`,
          transformOrigin: '0 0',
          width: `${boardSize.width / zoom}px`,
          height: `${boardSize.height / zoom}px`
        }}
      >
       

        {/* Components */}
        <div className="relative">
          {sortedComponents.map((component) => (
            <ComponentInstance
              key={component.id}
              component={component}
              isSelected={component.id === selectedComponentId}
              isConnecting={isConnecting}
              isConnectionStart={component.id === connectionStart}
              expandedComponentId={expandedComponentId}
              onExpand={setExpandedComponentId}
              onClick={() => {
                if (isConnecting) {
                  onConnectionEnd(component.id);
                } else {
                  onComponentSelect(component.id);
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );

};