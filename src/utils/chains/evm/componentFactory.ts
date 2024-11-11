// src/utils/chains/evm/componentFactory.ts

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
    category: {
      main: 'BasicComponents',
      sub: 'StateVariables',
    },
    defaultValues: {},
    body: { content: '' },
  };

  switch (componentType) {
    case 'function': {
      const functionData: FunctionComponentData = {
        ...baseData,
        type: 'function',
        category: {
          main: 'Functions',
          sub:
            dragData?.payload.stateMutability === 'view' ||
            dragData?.payload.stateMutability === 'pure'
              ? 'ReadFunctions'
              : 'WriteFunctions',
        },
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
        category: {
          main: 'BasicComponents',
          sub: 'StateVariables',
        },
        dataType: dragData?.payload.dataType || 'uint256',
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
        category: {
          main: 'BasicComponents',
          sub: 'Constructor',
        },
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
        category: {
          main: 'Events',
          sub: 'CustomEvents',
        },
        parameters: [],
      };
      return eventData;
    }

    case 'modifier': {
      const modifierData: ModifierComponentData = {
        ...baseData,
        type: 'modifier',
        category: {
          main: 'BasicComponents',
          sub: 'Modifiers',
        },
        parameters: [],
        body: { content: '' },
      };
      return modifierData;
    }

    case 'error': {
      const errorData: ErrorComponentData = {
        ...baseData,
        type: 'error',
        category: {
          main: 'BasicComponents',
          sub: 'CustomErrors',
        },
        parameters: [],
      };
      return errorData;
    }

    case 'struct': {
      const structData: StructComponentData = {
        ...baseData,
        type: 'struct',
        category: {
          main: 'DataStructures',
          sub: 'Struct',
        },
        members: [],
      };
      return structData;
    }

    case 'enum': {
      const enumData: EnumComponentData = {
        ...baseData,
        type: 'enum',
        category: {
          main: 'DataStructures',
          sub: 'Enum',
        },
        members: [],
      };
      return enumData;
    }

    case 'mapping': {
      const mappingData: MappingComponentData = {
        ...baseData,
        type: 'mapping',
        category: {
          main: 'DataStructures',
          sub: 'Mapping',
        },
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
        category: {
          main: 'DataStructures',
          sub: 'Array',
        },
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
          category: {
            main: 'Integrations',
            sub: 'TokenStandards',
          },
          standard: 'Custom',
          features: [],
        };
      }
      case 'security': {
        return {
          ...baseData,
          type: 'security',
          category: {
            main: 'Security',
            sub: 'AccessControl',
          },
          featureType: 'ownable',
          implementation: '',
          requirements: [],
        };
      }
      case 'oracle': {
        return {
          ...baseData,
          type: 'oracle',
          category: {
            main: 'Integrations',
            sub: 'OracleIntegration',
          },
          provider: 'chainlink',
          endpoint: '',
          parameters: [],
        };
      }
      case 'externalCall': {
        return {
          ...baseData,
          type: 'externalCall',
          category: {
            main: 'Integrations',
            sub: 'ExternalCalls',
          },
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

// DraggedItemType'dan DraggableComponent oluşturan fonksiyon
export const createDraggableComponentFromDragData = (
  draggedComponent: DraggableComponent,
  position: { x: number; y: number }
): DraggableComponent => {
  return {
    ...draggedComponent,
    position,
  };
};
