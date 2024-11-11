// components/contracts/steps/edit-contract/chain/evm/DetailPanel/ComponentForm.tsx
import React from 'react';
import { DraggableComponent, ComponentType } from '@/types/evm/contractTypes';
import { useComponentStore } from '@/stores/useComponentStore';

import { DynamicComponentForm } from './DynamicComponentForm';



interface ComponentFormProps {
  component: DraggableComponent;
}

export const ComponentForm: React.FC<ComponentFormProps> = ({ component }) => {
  
  const updateComponent = useComponentStore((state) => state.updateComponent);

  

  return (
    <div className="space-y-6">
      
      <DynamicComponentForm
        component={component}
        onSubmit={(data) => updateComponent(component.id, data)}
      />
    </div>
    
  );
};