// components/contracts/steps/edit-contract/chain/evm/EditorBoard/Toolbar.tsx

import React from 'react';
import { Button } from '@/components/ui/button';
import { useUndoRedo } from './UndoRedoProvider';
import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Grid,
  Save,
} from 'lucide-react';
import { LayoutGrid } from 'lucide-react';
import { useComponentStore } from '@/stores/useComponentStore';

interface Props {
  onSave: () => void;
  onToggleGrid: () => void;
  showGrid: boolean;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onAutoArrange: () => void;
}

export const Toolbar: React.FC<Props> = ({
  onSave,
  onToggleGrid,
  showGrid,
  zoom,
  onZoomChange,
  onAutoArrange,
}) => {
  const { canUndo, canRedo, undo, redo } = useUndoRedo();
  const hasUnsavedChanges = useComponentStore((state) => state.hasUnsavedChanges);

  return (
    <div className="absolute top-4 left-4 z-50 flex items-center space-x-2 bg-white rounded-lg shadow-lg p-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={undo}
        disabled={!canUndo}
        title="Undo"
      >
        <Undo2 className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={redo}
        disabled={!canRedo}
        title="Redo"
      >
        <Redo2 className="h-4 w-4" />
      </Button>

      <div className="w-px h-4 bg-gray-200" />

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onZoomChange(zoom + 0.1)}
        title="Zoom In"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onZoomChange(zoom - 0.1)}
        title="Zoom Out"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>

      <div className="w-px h-4 bg-gray-200" />

      <Button
        variant="ghost"
        size="sm"
        onClick={onAutoArrange}
        title="Auto Arrange"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        onClick={onSave}
        title="Save Changes"
        disabled={!hasUnsavedChanges}
        variant={hasUnsavedChanges ? 'destructive' : 'default'}
      >
        <Save className="h-4 w-4 mr-1" />
        {hasUnsavedChanges ? 'Save*' : 'Save'}
      </Button>

    </div>
  );
};