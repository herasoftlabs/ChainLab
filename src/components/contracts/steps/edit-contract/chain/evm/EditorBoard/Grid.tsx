// components/contracts/steps/edit-contract/chain/evm/EditorBoard/Grid.tsx
import React from 'react';

interface GridProps {
  isDragging: boolean;
  zoom: number;
}

export const Grid: React.FC<GridProps> = ({ isDragging, zoom }) => {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(to right, #e5e7eb 1px, transparent 1px),
          linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
        `,
        backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
        opacity: isDragging ? 0.7 : 0.5,
        width: '100%',
        height: '100%',
      }}
    />
  );
};