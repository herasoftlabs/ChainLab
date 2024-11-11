// data/menu/evm.ts

import { BodyContent, ComponentType } from '@/types/evm/contractTypes';
import { IconName } from '@/components/ui/icons';

export type BasicComponentsSubCategories = 'StateVariables' | 'Constructor' | 'Modifiers' | 'CustomErrors';
export type FunctionsSubCategories = 'ReadFunctions' | 'WriteFunctions';
export type EventsSubCategories = 'TransferEvents' | 'StatusEvents' | 'CustomEvents';
export type DataStructuresSubCategories = 'Struct' | 'Enum' | 'Mapping' | 'Array';
export type SecuritySubCategories = 'AccessControl' | 'Pausable' | 'Guards';
export type IntegrationsSubCategories = 'TokenStandards' | 'OracleIntegration' | 'ExternalCalls';


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
  | 'Array'
  | 'AccessControl' 
  | 'Pausable' 
  | 'Guards'
  | 'TokenStandards' 
  | 'OracleIntegration' 
  | 'ExternalCalls';


export interface Template {
  id: string;
  type: ComponentType;
  name: string;
  description: string;
  body: BodyContent;
  dataType?: string; 
  stateMutability?: 'pure' | 'view' | 'payable' | 'nonpayable';
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

export interface SecurityCategory {
  title: string;
  icon: IconName;
  subCategories: Record<SecuritySubCategories, SubCategory>;
}

export interface IntegrationsCategory {
  title: string;
  icon: IconName;
  subCategories: Record<IntegrationsSubCategories, SubCategory>;
}
export type CategoryType = {
  BasicComponents: {
    title: string;
    icon: IconName;
    subCategories: Record<BasicComponentsSubCategories, SubCategory>;
  };
  Functions: {
    title: string;
    icon: IconName;
    subCategories: Record<FunctionsSubCategories, SubCategory>;
  };
  Events: {
    title: string;
    icon: IconName;
    subCategories: Record<EventsSubCategories, SubCategory>;
  };
  DataStructures: {
    title: string;
    icon: IconName;
    subCategories: Record<DataStructuresSubCategories, SubCategory>;
  };
  Security: {
    title: string;
    icon: IconName;
    subCategories: Record<SecuritySubCategories, SubCategory>;
  };
  Integrations: {
    title: string;
    icon: IconName;
    subCategories: Record<IntegrationsSubCategories, SubCategory>;
  };
};

export const evmCategories: CategoryType = {
    BasicComponents: {
      title: 'Basic Components',
      icon: 'Cube',
      subCategories: {
        StateVariables: {
          title: 'State Variables',
          icon: 'Database',
          description: 'Contract state storage variables',
          templates: [
            {
              id: 'var_address',
              type: 'variable',
              name: 'Address',
              description: 'Store Ethereum address',
              body: {
                content: 'address public {name};',
                
              }
            },
            {
              id: 'var_uint',
              type: 'variable',
              name: 'Integer',
              description: 'Store numeric value',
              body: {
                content: 'address public {name};',
                
              }
            },
            {
              id: 'var_string',
              type: 'variable',
              name: 'String',
              description: 'Store text value',
              body: {
                content: 'address public {name};',
                
              }
            },
            {
              id: 'var_bool',
              type: 'variable',
              name: 'Boolean',
              description: 'Store boolean value',
              body: {
                content: 'address public {name};',
                
              }
            },
            {
              id: 'var_bytes',
              type: 'variable',
              name: 'Bytes',
              description: 'Store raw bytes',
              body: {
                content: 'address public {name};',
                
              }
            }
          ]
        },
        Constructor: {
          title: 'Constructor',
          icon: 'Power',
          description: 'Contract initialization',
          templates: [
            {
              id: 'constructor_basic',
              type: 'constructor',
              name: 'Basic Constructor',
              description: 'Simple initialization',
              body: {
                content: 'address public {name};',
                
              }
            },
            {
              id: 'constructor_inheritance',
              type: 'constructor',
              name: 'Inheritance Constructor',
              description: 'Constructor with inheritance',
              body: {
                content: 'address public {name};',
                
              }
            }
          ]
        },
        Modifiers: {
          title: 'Modifiers',
          icon: 'Shield',
          description: 'Function modifiers',
          templates: [
            {
              id: 'modifier_basic',
              type: 'modifier',
              name: 'Basic Modifier',
              description: 'Simple function modifier',
              body: {
                content: 'address public {name};',
                
              }
            },
            {
              id: 'modifier_params',
              type: 'modifier',
              name: 'Parameter Modifier',
              description: 'Modifier with parameters',
              body: {
                content: 'address public {name};',
                
              }
            }
          ]
        },
        CustomErrors: {
          title: 'Custom Errors',
          icon: 'AlertTriangle',
          description: 'Custom error definitions',
          templates: [
            {
              id: 'error_basic',
              type: 'error',
              name: 'Basic Error',
              description: 'Simple custom error',
              body: {
                content: 'address public {name};',
                
              }
            },
            {
              id: 'error_params',
              type: 'error',
              name: 'Parameter Error',
              description: 'Error with parameters',
              body: {
                content: 'address public {name};',
                
              }
            }
          ]
        }
      }
    },
    Functions: {
      title: 'Functions',
      icon: 'Function',
      subCategories: {
        ReadFunctions: {
          title: 'Read Functions',
          icon: 'Eye',
          description: 'Functions that read contract state',
          templates: [
            {
              id: 'view-function',
              type: 'function',
              name: 'View Function',
              description: 'Read state variables',
              stateMutability: 'view', 
              body: {
                content: '// Read state variables here\nreturn value;'
              }
            },
            {
              id: 'pure-function',
              type: 'function',
              name: 'Pure Function',
              description: 'Pure calculation',
              stateMutability: 'pure',
              body: {
                content: '// Perform calculations here\nreturn result;'
              }
            }
          ]
        },
        WriteFunctions: {
          title: 'Write Functions',
          icon: 'Edit',
          description: 'Functions that modify contract state',
          templates: [
            {
              id: 'standard-function',
              type: 'function',
              name: 'Standard Function',
              description: 'Modify state',
              stateMutability: 'nonpayable',
              body: {
                content: '// Modify state variables here'
              }
            },
            {
              id: 'payable-function',
              type: 'function',
              name: 'Payable Function',
              description: 'Accept ETH payments',
              stateMutability: 'payable',
              body: {
                content: '// Handle received ETH here\n// msg.value contains the sent ETH amount'
              }
            }
          ]
        }
      }
    },
    Events: {
      title: 'Events',
      icon: 'Bell',
      subCategories: {
        TransferEvents: {
          title: 'Transfer Events',
          icon: 'ArrowRightLeft',
          description: 'Token transfer events',
          templates: [
            {
              id: 'event_transfer',
              type: 'event',
              name: 'Transfer Event',
              description: 'Token transfer logging',
              body: {
                content: 'address public {name};',
                
              }
            }
          ]
        },
        StatusEvents: {
          title: 'Status Events',
          icon: 'Activity',
          description: 'Status change events',
          templates: [
            {
              id: 'event_status',
              type: 'event',
              name: 'Status Event',
              description: 'Status change logging',
              body: {
                content: 'address public {name};',
                
              }
            }
          ]
        },
        CustomEvents: {
          title: 'Custom Events',
          icon: 'Bell',
          description: 'Custom event definitions',
          templates: [
            {
              id: 'event_custom',
              type: 'event',
              name: 'Custom Event',
              description: 'Custom event logging',
              body: {
                content: 'address public {name};',
                
              }
            }
          ]
        }
      }
    },
    DataStructures: {
        title: 'Data Structures',
        icon: 'Database',
        subCategories: {
        Struct: {
            title: 'Struct',
            icon: 'Box',
            description: 'Custom data structures',
            templates: [
            {
                id: 'struct_user',
                type: 'struct',
                name: 'User Struct',
                description: 'User data structure',
                body: {
                  content: 'address public {name};',
                  
                }
            },
            {
                id: 'struct_token',
                type: 'struct',
                name: 'Token Struct',
                description: 'Token data structure',
                body: {
                  content: 'address public {name};',
                  
                }
            },
            {
                id: 'struct_custom',
                type: 'struct',
                name: 'Custom Struct',
                description: 'Custom data structure',
                body: {
                  content: 'address public {name};',
                  
                }
            }
            ]
        },
        Enum: {
            title: 'Enum',
            icon: 'List',
            description: 'Enumerated types',
            templates: [
            {
                id: 'enum_status',
                type: 'enum',
                name: 'Status Enum',
                description: 'Status enumeration',
                body: {
                  content: 'address public {name};',
                  
                }
            },
            {
                id: 'enum_role',
                type: 'enum',
                name: 'Role Enum',
                description: 'Role enumeration',
                body: {
                  content: 'address public {name};',
                  
                }
            },
            {
                id: 'enum_custom',
                type: 'enum',
                name: 'Custom Enum',
                description: 'Custom enumeration',
                body: {
                  content: 'address public {name};',
                  
                }
            }
            ]
        },
        Mapping: {
            title: 'Mapping',
            icon: 'Map',
            description: 'Key-value pair structures',
            templates: [
            {
                id: 'mapping_address_value',
                type: 'mapping',
                name: 'Address to Value',
                description: 'Map address to value',
                body: {
                  content: 'address public {name};',
                  
                }
            },
            {
                id: 'mapping_double',
                type: 'mapping',
                name: 'Double Mapping',
                description: 'Nested mapping',
                body: {
                  content: 'address public {name};',
                  
                }
            },
            {
                id: 'mapping_struct',
                type: 'mapping',
                name: 'Struct Mapping',
                description: 'Map to struct',
                body: {
                  content: 'address public {name};',
                  
                }
            }
            ]
        },
        Array: {
            title: 'Array',
            icon: 'List',
            description: 'Array data structures',
            templates: [
            {
                id: 'array_fixed',
                type: 'array',
                name: 'Fixed Array',
                description: 'Fixed size array',
                body: {
                  content: 'address public {name};',
                  
                }
            },
            {
                id: 'array_dynamic',
                type: 'array',
                name: 'Dynamic Array',
                description: 'Dynamic size array',
                body: {
                  content: 'address public {name};',
                  
                }
            },
            {
                id: 'array_nested',
                type: 'array',
                name: 'Nested Array',
                description: 'Multi-dimensional array',
                body: {
                  content: 'address public {name};',
                  
                }
            },
            {
                id: 'array_struct',
                type: 'array',
                name: 'Struct Array',
                description: 'Array of structs',
                body: {
                  content: 'address public {name};',
                  
                }
            },
            {
                id: 'array_mapping',
                type: 'array',
                name: 'Mapping Array',
                description: 'Array of mappings',
                body: {
                  content: 'address public {name};',
                  
                }
            }
            ]
        }
        }
    },
    Security: {
        title: 'Security',
        icon: 'Shield',
        subCategories: {
        AccessControl: {
            title: 'Access Control',
            icon: 'Lock',
            description: 'Access control mechanisms',
            templates: [
            {
                id: 'security_ownable',
                type: 'security',
                name: 'Ownable',
                description: 'Basic access control',
                body: {
                  content: 'address public {name};',
                  
                }
            },
            {
                id: 'security_roles',
                type: 'security',
                name: 'Role Based Access',
                description: 'Role-based permissions',
                body: {
                  content: 'address public {name};',
                  
                }
            },
            {
                id: 'security_whitelist',
                type: 'security',
                name: 'Whitelist',
                description: 'Whitelist access control',
                body: {
                  content: 'address public {name};',
                  
                }
            },
            {
                id: 'security_blacklist',
                type: 'security',
                name: 'Blacklist',
                description: 'Blacklist access control',
                body: {
                  content: 'address public {name};',
                  
                }
            }
            ]
        },
        Pausable: {
            title: 'Pausable',
            icon: 'Pause',
            description: 'Contract pause mechanisms',
            templates: [
            {
                id: 'security_pause',
                type: 'security',
                name: 'Pause Contract',
                description: 'Pause contract operations',
                body: {
                  content: 'address public {name};',
                  
                }
            },
            {
                id: 'security_emergency',
                type: 'security',
                name: 'Emergency Stop',
                description: 'Emergency stop mechanism',
                body: {
                  content: 'address public {name};',
                  
                }
            }
            ]
        },
        Guards: {
            title: 'Guards',
            icon: 'Shield',
            description: 'Security guard mechanisms',
            templates: [
            {
                id: 'security_reentrancy',
                type: 'security',
                name: 'Reentrancy Guard',
                description: 'Prevent reentrancy attacks',
                body: {
                  content: 'address public {name};',
                  
                }
            },
            {
                id: 'security_amount',
                type: 'security',
                name: 'Amount Guard',
                description: 'Amount validation guard',
                body: {
                  content: 'address public {name};',
                  
                }
            },
            {
                id: 'security_time',
                type: 'security',
                name: 'Time Guard',
                description: 'Time-based guard',
                body: {
                  content: 'address public {name};',
                  
                }
            }
            ]
        }
        }
    },
    Integrations: {
        title: 'Integrations',
        icon: 'Puzzle',
        subCategories: {
        TokenStandards: {
            title: 'Token Standards',
            icon: 'Coins',
            description: 'Token standard implementations',
            templates: [
            {
                id: 'integration_erc20',
                type: 'integration',
                name: 'ERC20 Base',
                description: 'Standard token interface',
                body: {
                  content: 'address public {name};',
                  
                }
            },
            {
                id: 'integration_erc721',
                type: 'integration',
                name: 'ERC721 Base',
                description: 'NFT standard interface',
                body: {
                  content: 'address public {name};',
                  
                }
            },
            {
                id: 'integration_erc1155',
                type: 'integration',
                name: 'ERC1155 Base',
                description: 'Multi-token standard',
                body: {
                  content: 'address public {name};',
                  
                }
            }
            ]
        },
        OracleIntegration: {
            title: 'Oracle Integration',
            icon: 'Link',
            description: 'Oracle integrations',
            templates: [
            {
                id: 'oracle_price',
                type: 'oracle',
                name: 'Price Feed',
                description: 'Chainlink price oracle',
                body: {
                  content: 'address public {name};',
                  
                }
            },
            {
                id: 'oracle_random',
                type: 'oracle',
                name: 'Random Number',
                description: 'Random number generator',
                body: {
                  content: 'address public {name};',
                  
                }
            },
            {
                id: 'oracle_external',
                type: 'oracle',
                name: 'External Data',
                description: 'External data feed',
                body: {
                  content: 'address public {name};',
                  
                }
            }
            ]
        },
        ExternalCalls: {
            title: 'External Calls',
            icon: 'Globe',
            description: 'External contract interactions',
            templates: [
            {
                id: 'external_call',
                type: 'externalCall',
                name: 'Contract Call',
                description: 'External contract call',
                body: {
                  content: 'address public {name};',
                  
                }
            },
            {
                id: 'external_safe',
                type: 'externalCall',
                name: 'Safe Transfer',
                description: 'Safe token transfer',
                body: {
                  content: 'address public {name};',
                  
                }
            },
            {
                id: 'external_batch',
                type: 'externalCall',
                name: 'Batch Operation',
                description: 'Batch contract calls',
                body: {
                  content: 'address public {name};',
                  
                }
            }
            ]
        }
        }
    }    
};