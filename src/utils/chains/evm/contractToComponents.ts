// src/utils/chains/evm/contractToComponents.ts

import { nanoid } from 'nanoid';
import {
  EthereumContract,
  DraggableComponent,
  SubCategoryType,
} from '@/types/evm/contractTypes';
import { createComponentData } from '@/utils/chains/evm/componentFactory'; 

export const contractToComponents = (contract: EthereumContract): Record<string, DraggableComponent> => {
  const components: Record<string, DraggableComponent> = {};
  let componentIndex = 0;

  const calculatePosition = (name: string, index: number) => {
    if (contract.componentLayout?.positions?.[name]) {
      return contract.componentLayout.positions[name];
    }
    return {
      x: 40 + (index % 3) * 120,
      y: 100 + Math.floor(index / 3) * 120,
    };
  };

  // Constructor
  if (contract.constructor && contract.constructor.id) {
    components[contract.constructor.id] = {
      id: contract.constructor.id,
      type: 'constructor',
      data: {
        ...contract.constructor,
        category: { main: 'BasicComponents', sub: 'Constructor' },
        name: 'Constructor',
      },
      position: calculatePosition('constructor', 0),
      connections: [],
      width: 200,
      height: 100,
    };
  }

  // State Variables
  contract.stateVariables.forEach((variable) => {
    components[variable.id] = {
      id: variable.id,
      type: 'variable',
      data: {
        ...variable,
        category: { main: 'BasicComponents', sub: 'StateVariables' },
        name: variable.name,
      },
      position: calculatePosition(variable.name, componentIndex++),
      connections: [],
      width: 200,
      height: 100,
    };
  });

  // Functions
  contract.functions.forEach((func) => {
    const subCategory: SubCategoryType = func.category?.sub || (
      func.stateMutability === 'view' || func.stateMutability === 'pure' ? 'ReadFunctions' : 'WriteFunctions'
    );

    components[func.id] = {
      id: func.id,
      type: 'function',
      data: {
        ...func,
        category: {
          main: 'Functions',
          sub: subCategory,
        },
        name: func.name,
      },
      position: calculatePosition(func.name, componentIndex++),
      connections: [],
      width: 200,
      height: 100,
    };
  });

  // Events
  contract.events.forEach((event) => {
    components[event.id] = {
      id: event.id,
      type: 'event',
      data: {
        ...event,
        category: { main: 'Events', sub: 'CustomEvents' },
        name: event.name,
      },
      position: calculatePosition(event.name, componentIndex++),
      connections: [],
      width: 200,
      height: 100,
    };
  });

  // Modifiers
  contract.modifiers.forEach((modifier) => {
    components[modifier.id] = {
      id: modifier.id,
      type: 'modifier',
      data: {
        ...modifier,
        category: { main: 'BasicComponents', sub: 'Modifiers' },
        name: modifier.name,
      },
      position: calculatePosition(modifier.name, componentIndex++),
      connections: [],
      width: 200,
      height: 100,
    };
  });

  // Structs
  contract.structs.forEach((struct) => {
    components[struct.id] = {
      id: struct.id,
      type: 'struct',
      data: {
        ...struct,
        category: { main: 'DataStructures', sub: 'Struct' },
        name: struct.name,
      },
      position: calculatePosition(struct.name, componentIndex++),
      connections: [],
      width: 200,
      height: 100,
    };
  });

  // Enums
  contract.enums.forEach((enumType) => {
    components[enumType.id] = {
      id: enumType.id,
      type: 'enum',
      data: {
        ...enumType,
        category: { main: 'DataStructures', sub: 'Enum' },
        name: enumType.name,
      },
      position: calculatePosition(enumType.name, componentIndex++),
      connections: [],
      width: 200,
      height: 100,
    };
  });

  // Mappings
  contract.mappings.forEach((mapping) => {
    components[mapping.id] = {
      id: mapping.id,
      type: 'mapping',
      data: {
        ...mapping,
        category: { main: 'DataStructures', sub: 'Mapping' },
        name: mapping.name,
      },
      position: calculatePosition(mapping.name, componentIndex++),
      connections: [],
      width: 200,
      height: 100,
    };
  });

  // Arrays
  contract.arrays.forEach((array) => {
    components[array.id] = {
      id: array.id,
      type: 'array',
      data: {
        ...array,
        category: { main: 'DataStructures', sub: 'Array' },
        name: array.name,
      },
      position: calculatePosition(array.name, componentIndex++),
      connections: [],
      width: 200,
      height: 100,
    };
  });

  // Errors
  contract.errors.forEach((error) => {
    components[error.id] = {
      id: error.id,
      type: 'error',
      data: {
        ...error,
        category: { main: 'BasicComponents', sub: 'CustomErrors' },
        name: error.name,
      },
      position: calculatePosition(error.name, componentIndex++),
      connections: [],
      width: 200,
      height: 100,
    };
  });

  // Bağlantıları ekleme
  if (contract.componentLayout?.connections) {
    contract.componentLayout.connections.forEach(({ source, target }) => {
      if (components[source]) {
        components[source].connections.push(target);
      }
    });
  }

  // Pozisyonları güncelleme
  if (contract.componentLayout?.positions) {
    Object.entries(contract.componentLayout.positions).forEach(([id, position]) => {
      if (components[id]) {
        components[id].position = position;
      }
    });
  }

  return components;
};
