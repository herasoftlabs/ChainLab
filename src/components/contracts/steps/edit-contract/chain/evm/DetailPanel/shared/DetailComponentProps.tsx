import { 
    DraggableComponentData, 
    ComponentType 
  } from '@/types/evm/contractTypes';
  
  export interface DetailComponentProps {
    data: DraggableComponentData;
    onChange: (updates: Partial<DraggableComponentData>) => void;
  }