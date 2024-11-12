// components/contracts/steps/edit-contract/chain/evm/EditorBoard/ContextMenu.tsx

import React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { useComponentStore } from '@/stores/useComponentStore';
import { DraggableComponent } from '@/types/evm/contractTypes';

interface Props {
  component: DraggableComponent;
  children: React.ReactNode;
}

export const ComponentContextMenu: React.FC<Props> = ({ component, children }) => {
  const {
    removeComponent,
    /* addComponentRelation,
    removeComponentRelation */
  } = useComponentStore();

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        {/* <ContextMenuItem
          onClick={() => updateComponentUIState(component.id, { isEditing: true })}
        >
          Edit
        </ContextMenuItem> */}
        <ContextMenuItem
          onClick={() => {
            
          }}
        >
          Duplicate
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={() => {
            
          }}
        >
          Add Connection
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            
          }}
        >
          Remove All Connections
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          className="text-red-600"
          onClick={() => removeComponent(component.id)}
        >
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};