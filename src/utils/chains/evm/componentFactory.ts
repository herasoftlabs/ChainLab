import { nanoid } from 'nanoid';
import {
  ComponentType,
  DraggableComponentData,
  FunctionComponentData,
  StateVariableComponentData,
  ConstructorComponentData,
  EventComponentData,
  ModifierComponentData,
  ErrorComponentData,
  StructComponentData,
  EnumComponentData,
  MappingComponentData,
  ArrayComponentData,
  ComponentDataFields,
  DragData,
  DraggableComponent,
} from '@/types/evm/contractTypes';

export const createComponentData = (
  componentId: string,
  componentType: ComponentType,
  dragData?: DragData
): DraggableComponentData => {
  const baseData: ComponentDataFields = {
    id: componentId,
    type: componentType,
    name: `New ${componentType}`,
    documentation: '',
    category: 'BasicComponents',
    defaultValues: {},
    body: { content: '' },
  };

  switch (componentType) {
    case 'function': {
      const functionData: FunctionComponentData = {
        ...baseData,
        type: 'function',
        category: 'Functions',
        visibility: 'public',
        stateMutability: dragData?.payload.stateMutability || 'nonpayable',
        parameters: [],
        returnParameters: [],
        modifiers: [],
        body: { content: '' },
      };
      return functionData;
    }
    case 'variable': {
      const variableData: StateVariableComponentData = {
        ...baseData,
        type: 'variable',
        category: 'StateVariables',
        dataType: dragData?.payload?.dataType || 'uint256',
        visibility: 'public',
        mutability: 'mutable',
        initialValue: '',
      };
      return variableData;
    }
    case 'constructor': {
      const constructorData: ConstructorComponentData = {
        ...baseData,
        type: 'constructor',
        name: 'Constructor',
        category: 'BasicComponents',
        parameters: [],
        modifiers: [],
        body: { content: '' },
      };
      return constructorData;
    }
    case 'event': {
      const eventData: EventComponentData = {
        ...baseData,
        type: 'event',
        category: 'BasicComponents',
        parameters: [],
      };
      return eventData;
    }
    case 'modifier': {
      const modifierData: ModifierComponentData = {
        ...baseData,
        type: 'modifier',
        category: 'BasicComponents',
        parameters: [],
        body: { content: '' },
      };
      return modifierData;
    }
    case 'error': {
      const errorData: ErrorComponentData = {
        ...baseData,
        type: 'error',
        category: 'BasicComponents',
        parameters: [],
      };
      return errorData;
    }
    case 'struct': {
      const structData: StructComponentData = {
        ...baseData,
        type: 'struct',
        category: 'DataStructures',
        members: [],
      };
      return structData;
    }
    case 'enum': {
      const enumData: EnumComponentData = {
        ...baseData,
        type: 'enum',
        category: 'DataStructures',
        members: [],
      };
      return enumData;
    }
    case 'mapping': {
      const mappingData: MappingComponentData = {
        ...baseData,
        type: 'mapping',
        category: 'DataStructures',
        keyType: 'uint256',
        valueType: 'uint256',
        visibility: 'public',
      };
      return mappingData;
    }
    case 'array': {
      const arrayData: ArrayComponentData = {
        ...baseData,
        type: 'array',
        category: 'DataStructures',
        dataType: 'uint256',
        length: undefined,
        visibility: 'public',
      };
      return arrayData;
    }
    case 'integration': {
      return {
        ...baseData,
        type: 'integration',
        category: 'OracleIntegrations',
        standard: 'Custom',
        features: [],
      };
    }
    case 'security': {
      return {
        ...baseData,
        type: 'security',
        category: 'BasicComponents',
        featureType: 'ownable',
        implementation: '',
        requirements: [],
      };
    }
    case 'oracle': {
      return {
        ...baseData,
        type: 'oracle',
        category: 'OracleIntegrations',
        provider: 'chainlink',
        endpoint: '',
        parameters: [],
      };
    }
    case 'externalCall': {
      return {
        ...baseData,
        type: 'externalCall',
        category: 'OracleIntegrations',
        target: '',
        method: '',
        parameters: [],
        safetyChecks: [],
      };
    }
    default:
      throw new Error(`Unsupported component type: ${componentType}`);
  }
};

export const createDraggableComponentFromDragData = (
  draggedComponent: DraggableComponent,
  position: { x: number; y: number }
): DraggableComponent => {
  return {
    ...draggedComponent,
    position,
  };
};