// components/contracts/steps/edit-contract/chain/evm/EditorBoard/ConnectionLine.tsx

import React from 'react';
import { useComponentStore } from '@/stores/useComponentStore';

interface Props {
    startId: string;
    endId: string;
  }

  export const ConnectionLine: React.FC<Props> = ({ startId, endId }) => {
    const components = useComponentStore((state) => state.components);
    const startComponent = components[startId];
    const endComponent = components[endId];
  
    if (!startComponent || !endComponent) return null;
  
    // Calculate line coordinates
    const start = {
      x: startComponent.position.x + 100, 
      y: startComponent.position.y + 30,  
    };
  
    const end = {
      x: endComponent.position.x + 100,
      y: endComponent.position.y + 30,
    };
  
    // Create a curved path
    const path = `
      M ${start.x} ${start.y}
      C ${start.x + 100} ${start.y},
        ${end.x - 100} ${end.y},
        ${end.x} ${end.y}
    `;
  
    return (
      <svg
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: -1 }}
      >
        <path
          d={path}
          stroke="rgb(99 102 241)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="4"
        />
      </svg>
    );
  };