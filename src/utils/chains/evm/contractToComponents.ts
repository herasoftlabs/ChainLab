import { nanoid } from 'nanoid';
import {
  EthereumContract,
  DraggableComponent,
  ComponentType,
  ComponentCategoryMain,
  DraggableComponentData,
  StateVariableComponentData,
  FunctionComponentData,
  EventComponentData,
  ModifierComponentData,
  ErrorComponentData,
  StructComponentData,
  EnumComponentData,
  MappingComponentData,
  ArrayComponentData,
  IntegrationComponentData,
  SecurityComponentData,
  OracleIntegrationComponentData,
  ExternalCallComponentData,
  ConstructorComponentData,
} from '@/types/evm/contractTypes';

type ComponentProcessor<T = any> = {
  key: keyof EthereumContract;
  process: (items: T | T[]) => void;
};

export const contractToComponents = (contract: EthereumContract): Record<string, DraggableComponent> => {
  const components: Record<string, DraggableComponent> = {};

  function createDraggableComponent<T extends DraggableComponentData>(
    item: T,
  ): DraggableComponent {
    return {
      id: item.id,
      type: item.type,
      data: {
        ...item,
        category: item.category,
      },
      position: { x: 0, y: 0 },
      connections: [],
      width: 200,
      height: 100,
    };
  }

  const componentProcessors: ComponentProcessor[] = [
    {
      key: 'constructor',
      process: (item: ConstructorComponentData | null) => {
        if (item) {
          const component = createDraggableComponent(item);
          components[component.id] = component;
        }
      }
    },
    {
      key: 'stateVariables',
      process: (items: StateVariableComponentData[]) => {
        items.forEach(item => {
          const component = createDraggableComponent(item);
          components[component.id] = component;
        });
      }
    },
    {
      key: 'functions',
      process: (items: FunctionComponentData[]) => {
        items.forEach(item => {
          const component = createDraggableComponent(item );
          components[component.id] = component;
        });
      }
    },
    {
      key: 'events',
      process: (items: EventComponentData[]) => {
        items.forEach(item => {
          const component = createDraggableComponent(item );
          components[component.id] = component;
        });
      }
    },
    {
      key: 'modifiers',
      process: (items: ModifierComponentData[]) => {
        items.forEach(item => {
          const component = createDraggableComponent(item );
          components[component.id] = component;
        });
      }
    },
    {
      key: 'errors',
      process: (items: ErrorComponentData[]) => {
        items.forEach(item => {
          const component = createDraggableComponent(item );
          components[component.id] = component;
        });
      }
    },
    {
      key: 'structs',
      process: (items: StructComponentData[]) => {
        items.forEach(item => {
          const component = createDraggableComponent(item );
          components[component.id] = component;
        });
      }
    },
    {
      key: 'enums',
      process: (items: EnumComponentData[]) => {
        items.forEach(item => {
          const component = createDraggableComponent(item );
          components[component.id] = component;
        });
      }
    },
    {
      key: 'mappings',
      process: (items: MappingComponentData[]) => {
        items.forEach(item => {
          const component = createDraggableComponent(item );
          components[component.id] = component;
        });
      }
    },
    {
      key: 'arrays',
      process: (items: ArrayComponentData[]) => {
        items.forEach(item => {
          const component = createDraggableComponent(item );
          components[component.id] = component;
        });
      }
    },
    {
      key: 'integrations',
      process: (items: IntegrationComponentData[]) => {
        items.forEach(item => {
          const component = createDraggableComponent(item );
          components[component.id] = component;
        });
      }
    },
    {
      key: 'securityFeatures',
      process: (items: SecurityComponentData[]) => {
        items?.forEach(item => {
          const component = createDraggableComponent(item );
          components[component.id] = component;
        });
      }
    },
    {
      key: 'oracleIntegrations',
      process: (items: OracleIntegrationComponentData[]) => {
        items?.forEach(item => {
          const component = createDraggableComponent(item );
          components[component.id] = component;
        });
      }
    },
    {
      key: 'externalCalls',
      process: (items: ExternalCallComponentData[]) => {
        items?.forEach(item => {
          const component = createDraggableComponent(item );
          components[component.id] = component;
        });
      }
    },
  ];

  componentProcessors.forEach(processor => {
    const items = contract[processor.key];
    if (items) {
      processor.process(items);
    }
  });

  if (contract.componentLayout?.connections) {
    contract.componentLayout.connections.forEach(({ source, target }) => {
      if (components[source] && !components[source].connections.includes(target)) {
        components[source].connections.push(target);
      }
    });
  }

  return components;
};