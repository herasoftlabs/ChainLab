import { nanoid } from 'nanoid';
import {
  EthereumContract,
  DraggableComponent,
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

  /* const getCategoryForComponent = (type: string): string => {
    switch (type) {
      case 'constructor':
      case 'variable':
      case 'modifier':
      case 'error':
        return 'BasicComponents';
      case 'function':
        return 'Functions';
      case 'event':
        return 'BasicComponents';
      case 'struct':
      case 'enum':
      case 'mapping':
      case 'array':
        return 'DataStructures';
      case 'integration':
      case 'oracle':
      case 'externalCall':
        return 'OracleIntegrations';
      default:
        return 'BasicComponents';
    }
  }; */

  // Constructor
  if (contract.constructor && contract.constructor.id) {
    components[contract.constructor.id] = {
      id: contract.constructor.id,
      type: 'constructor',
      data: {
        ...contract.constructor,
        category: 'BasicComponents',
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
        category: 'StateVariables',
        name: variable.name,
        dataType: variable.dataType,
      },
      position: calculatePosition(variable.name, componentIndex++),
      connections: [],
      width: 200,
      height: 100,
    };
  });

  // Functions
  contract.functions.forEach((func) => {
    components[func.id] = {
      id: func.id,
      type: 'function',
      data: {
        ...func,
        category: 'Functions',
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
        category: 'BasicComponents',
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
        category: 'BasicComponents',
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
        category: 'DataStructures',
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
        category: 'DataStructures',
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
        category: 'DataStructures',
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
        category: 'DataStructures',
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
        category: 'BasicComponents',
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