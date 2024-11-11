// components/contracts/steps/edit-contract/chain/evm/EditorBoard/Grid.tsx

import React from 'react';

interface GridProps {
  isDragging: boolean;
  gridSize?: number;
  zoom: number;
}

export const Grid: React.FC<GridProps> = ({ isDragging, gridSize = 20, zoom }) => {
  return (
    <div
      className="absolute inset-0 pointer-events-none transition-opacity duration-200"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(0, 0, 0, ${isDragging ? 0.2 : 0.1}) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0, 0, 0, ${isDragging ? 0.2 : 0.1}) 1px, transparent 1px)
        `,
        backgroundSize: `${gridSize * zoom}px ${gridSize * zoom}px`,
        opacity: isDragging ? 1 : 0.7,
        transform: `scale(${1 / zoom})`,
        transformOrigin: '0 0'
      }}
    />
  );
};