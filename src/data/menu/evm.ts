// data/menu/evm.ts

import { BodyContent, ComponentType } from '@/types/evm/contractTypes';
import { IconName } from '@/components/ui/icons';

export type BasicComponentsSubCategories = 'StateVariables' | 'Constructor' | 'Modifiers' | 'CustomErrors';
export type FunctionsSubCategories = 'ReadFunctions' | 'WriteFunctions';
export type EventsSubCategories = 'TransferEvents' | 'StatusEvents' | 'CustomEvents';
export type DataStructuresSubCategories = 'Struct' | 'Enum' | 'Mapping' | 'Array';



export type SubCategoryType = 
  | 'StateVariables' 
  | 'Constructor' 
  | 'Modifiers' 
  | 'CustomErrors'
  | 'ReadFunctions' 
  | 'WriteFunctions'
  | 'TransferEvents' 
  | 'StatusEvents' 
  | 'CustomEvents'
  | 'Struct' 
  | 'Enum' 
  | 'Mapping' 
  | 'Array';


  export interface Template {
    id: string;
    type: ComponentType;
    name: string;
    description: string;
    body: BodyContent;
    dataType?: string; 
    stateMutability?: 'pure' | 'view' | 'payable' | 'nonpayable';
  }

  export interface CategoryItem {
    title: string;
    icon: IconName;
    description?: string;
    templates: Template[];
  }

export interface SubCategory {
  title: string;
  icon: IconName;
  description?: string;
  templates: Template[];
}

export interface BasicComponentsCategory {
  title: string;
  icon: IconName;
  subCategories: Record<BasicComponentsSubCategories, SubCategory>;
}

export interface FunctionsCategory {
  title: string;
  icon: IconName;
  subCategories: Record<FunctionsSubCategories, SubCategory>;
}

export interface EventsCategory {
  title: string;
  icon: IconName;
  subCategories: Record<EventsSubCategories, SubCategory>;
}

export interface DataStructuresCategory {
  title: string;
  icon: IconName;
  subCategories: Record<DataStructuresSubCategories, SubCategory>;
}

export interface CategoryType {
  StateVariables: CategoryItem;
  BasicComponents: CategoryItem;
  Functions: CategoryItem;
  DataStructures: CategoryItem;
  OracleIntegrations: CategoryItem;
}

export const evmCategories: CategoryType = {
  StateVariables: {
    title: 'State Variables',
    icon: 'Database',
    templates: [
      {
        id: 'var_address',
        type: 'variable',
        name: 'Address',
        description: 'Store Ethereum address',
        body: {
          content: 'address public {name};',
        },
        dataType: 'address'
      },
      {
        id: 'var_uint',
        type: 'variable',
        name: 'Integer',
        description: 'Store numeric value',
        body: {
          content: 'uint256 public {name};',
        },
        dataType: 'uint256'
      },
      {
        id: 'var_string',
        type: 'variable',
        name: 'String',
        description: 'Store text value',
        body: {
          content: 'string public {name};',
        },
        dataType: 'string'
      },
      {
        id: 'var_bool',
        type: 'variable',
        name: 'Boolean',
        description: 'Store boolean value',
        body: {
          content: 'bool public {name};',
        },
        dataType: 'bool'
      },
      {
        id: 'var_bytes',
        type: 'variable',
        name: 'Bytes',
        description: 'Store raw bytes',
        body: {
          content: 'bytes public {name};',
        },
        dataType: 'bytes'
      }
    ]
  },
  BasicComponents: {
    title: 'Basic Components',
    icon: 'Cube',
    templates: [
      {
        id: 'constructor',
        type: 'constructor',
        name: 'Constructor',
        description: 'Initialize contract state',
        body: {
          content: 'constructor() {\n    // Initialize contract\n}',
        }
      },
      {
        id: 'modifier',
        type: 'modifier',
        name: 'Modifier',
        description: 'Pre-Function Check',
        body: {
          content: 'modifier {name}() {\n    require(condition, "Condition not met");\n    _;\n}',
        }
      },
      {
        id: 'error',
        type: 'error',
        name: 'Custom Error',
        description: 'Define Custom Error',
        body: {
          content: 'error {name}(uint value);',
        }
      },
      {
        id: 'event_custom',
        type: 'event',
        name: 'Custom Event',
        description: 'Custom event logging',
        body: {
          content: 'event {name}(address indexed sender, uint value);',
        }
      }
    ]
  },
  Functions: {
    title: 'Functions',
    icon: 'Function',
    templates: [
      {
        id: 'view-function',
        type: 'function',
        name: 'Read Function',
        description: 'Read state variables',
        stateMutability: 'view', 
        body: {
          content: 'function {name}() public view returns (uint) {\n    // Read state variables\n    return value;\n}'
        }
      },
      {
        id: 'standard-function',
        type: 'function',
        name: 'Write Function',
        description: 'Modify state',
        stateMutability: 'nonpayable',
        body: {
          content: 'function {name}() public {\n    // Modify state variables\n}'
        }
      }
    ]
  },
  DataStructures: {
    title: 'Data Structures',
    icon: 'Database',
    templates: [
      {
        id: 'struct_custom',
        type: 'struct',
        name: 'Struct',
        description: 'Custom data structure',
        body: {
          content: 'struct {name} {\n    uint id;\n    string name;\n}'
        }
      },
      {
        id: 'enum_custom',
        type: 'enum',
        name: 'Enum',
        description: 'Custom enumeration',
        body: {
          content: 'enum {name} {\n    Pending,\n    Active,\n    Completed\n}'
        }
      },
      {
        id: 'mapping_custom',
        type: 'mapping',
        name: 'Mapping',
        description: 'Map address to value',
        body: {
          content: 'mapping(address => uint) public {name};'
        }
      },
      {
        id: 'array_dynamic',
        type: 'array',
        name: 'Array',
        description: 'Dynamic size array',
        body: {
          content: 'uint[] public {name};'
        }
      }
    ]
  },
  OracleIntegrations: {
    title: 'Oracle Integrations',
    icon: 'Link',
    templates: [
      {
        id: 'oracle_price_feed',
        type: 'oracle',
        name: 'Price Feed',
        description: 'Get real-time price data',
        body: {
          content: '// Chainlink Price Feed Integration'
        }
      },
      {
        id: 'oracle_random',
        type: 'oracle',
        name: 'Random Number',
        description: 'Generate verifiable random number',
        body: {
          content: '// Chainlink VRF Random Number'
        }
      },
      {
        id: 'external_call',
        type: 'externalCall',
        name: 'External Call',
        description: 'Call external contract method',
        body: {
          content: '// External Contract Call'
        }
      }
    ]
  }
};

