import { 
  EthereumContract,
  StateVariableComponentData,
  FunctionComponentData,
  EventComponentData,
  MappingComponentData,
  ConstructorComponentData,
  ArrayComponentData,
  StructComponentData,
  EnumComponentData,
  ModifierComponentData,
  IntegrationComponentData,
  SecurityComponentData,
  OracleIntegrationComponentData,
  ExternalCallComponentData,
  ErrorComponentData,
} from '@/types/evm/contractTypes';
import { nanoid } from 'nanoid';

interface Template {
  id: string;
  name: string;
  description: string;
  contract: EthereumContract;
}

const calculateGridPosition = (
  index: number, 
  columns: number = 4, 
  startX: number = 50,
  startY: number = 100,
  horizontalSpacing: number = 150,
  verticalSpacing: number = 120
) => {
  const row = Math.floor(index / columns);
  const col = index % columns;
  return {
    x: startX + (col * horizontalSpacing),
    y: startY + (row * verticalSpacing)
  };
};

export const ethTemplates: Template[] = [
  {
    id: 'blank',
    name: 'Blank Solidity Contract',
    description: 'An empty Solidity contract.',
    contract: {
      id: nanoid(),
      name: "BlankSolidityContract",
      version: "0.8.19",
      license: "MIT",
      documentation: `Blank Solidity Contract`,
      createdAt: new Date().toISOString(),
      constructor: undefined,
      stateVariables: [],
      functions: [],
      events: [],
      errors: [],
      modifiers: [],
      structs: [],
      enums: [],
      mappings: [],
      arrays: [],
      integrations: [],
      abstract: false,
      inherits: [],
      securityFeatures: [],
      oracleIntegrations: [],
      externalCalls: [],
      usingFor: []
    }
  },
  {
    id: 'erc20',
    name: 'ERC-20 Token',
    description: 'Standard ERC-20 token template.',
    contract: {
      id: nanoid(),
      name: "ERC20Token",
      version: "0.8.19",
      license: "MIT",
      documentation: `Standard ERC-20 Token Implementation`,
      createdAt: new Date().toISOString(),

      componentLayout: {
        positions: {
          'constructor': calculateGridPosition(0),
          'name': calculateGridPosition(1),
          'symbol': calculateGridPosition(2),
          'decimals': calculateGridPosition(3),
          'totalSupply': calculateGridPosition(4),
          'transfer': calculateGridPosition(5),
          'Transfer': calculateGridPosition(6),
          'balanceOf': calculateGridPosition(7),
        },
        connections: []
      },

      constructor: {
        id: nanoid(),
        type: 'constructor',
        documentation: 'Contract initializer',
        parameters: [
          { id: nanoid(), name: 'name_', type: 'string' },
          { id: nanoid(), name: 'symbol_', type: 'string' }
        ],
        category: { main: 'BasicComponents', sub: 'Constructor' },
        name: 'Constructor',
        body: { content: 'name = name_; symbol = symbol_;' }
      } as ConstructorComponentData,

      stateVariables: [
        {
          id: nanoid(),
          type: 'variable',
          documentation: 'Token name',
          dataType: 'string',
          visibility: 'public',
          mutability: 'immutable',
          category: { main: 'BasicComponents', sub: 'StateVariables' },
          name: 'name',
        } as StateVariableComponentData,
        {
          id: nanoid(),
          type: 'variable',
          documentation: 'Token symbol',
          dataType: 'string',
          visibility: 'public',
          mutability: 'immutable',
          category: { main: 'BasicComponents', sub: 'StateVariables' },
          name: 'symbol',
        } as StateVariableComponentData,
        {
          id: nanoid(),
          type: 'variable',
          name: 'decimals',
          documentation: 'Token decimals',
          dataType: 'uint8',
          visibility: 'public',
          mutability: 'immutable',
          initialValue: '18',
          category: { main: 'BasicComponents', sub: 'StateVariables' },
        } as StateVariableComponentData
      ],

      functions: [
        {
          id: nanoid(),
          type: 'function',
          name: 'totalSupply',
          documentation: 'Returns total token supply',
          visibility: 'public',
          stateMutability: 'view',
          parameters: [],
          returnParameters: [
            { id: nanoid(), name: '', type: 'uint256' }
          ],
          modifiers: [],
          category: { main: 'Functions', sub: 'ReadFunctions' },
          body: { content: 'return _totalSupply;' }
        } as FunctionComponentData,

        {
          id: nanoid(),
          type: 'function',
          name: 'transfer',
          documentation: 'Transfers tokens to a specified address',
          visibility: 'public',
          stateMutability: 'nonpayable',
          parameters: [
            { id: nanoid(), name: 'recipient', type: 'address' },
            { id: nanoid(), name: 'amount', type: 'uint256' }
          ],
          returnParameters: [
            { id: nanoid(), name: '', type: 'bool' }
          ],
          modifiers: [],
          category: { main: 'Functions', sub: 'WriteFunctions' },
          body: { content: '_transfer(msg.sender, recipient, amount); return true;' }
        } as FunctionComponentData,
      ],

      events: [
        {
          id: nanoid(),
          type: 'event',
          name: 'Transfer',
          documentation: 'Emitted when tokens are transferred',
          parameters: [
            { id: nanoid(), name: 'from', type: 'address', indexed: true },
            { id: nanoid(), name: 'to', type: 'address', indexed: true },
            { id: nanoid(), name: 'value', type: 'uint256', indexed: false }
          ],
          category: { main: 'Events', sub: 'TransferEvents' },
        } as EventComponentData
      ],

      mappings: [
        {
          id: nanoid(),
          type: 'mapping',
          name: 'balanceOf',
          documentation: 'Account balances',
          keyType: 'address',
          valueType: 'uint256',
          visibility: 'public',
          category: { main: 'DataStructures', sub: 'Mapping' },
        } as MappingComponentData
      ],

      errors: [],
      modifiers: [],
      structs: [],
      enums: [],
      arrays: [],
      integrations: [],
      abstract: false,
      inherits: ['IERC20'],
      securityFeatures: [],
      oracleIntegrations: [],
      externalCalls: [],
      usingFor: []
    }
  },
  /* Full Feature Example */
  {
    id: 'full_feature',
    name: 'Full Feature Solidity Contract',
    description: 'A comprehensive Solidity contract template with all components included.',
    contract: {
      id: nanoid(),
      name: "FullFeatureContract",
      version: "0.8.19",
      license: "MIT",
      documentation: `A comprehensive Solidity contract that includes all components and features.`,
      createdAt: new Date().toISOString(),

      componentLayout: {
        positions: {
          'constructor': calculateGridPosition(0),
          'name': calculateGridPosition(1),
          'symbol': calculateGridPosition(2),
          'decimals': calculateGridPosition(3),
          'totalSupply': calculateGridPosition(4),
          'transfer': calculateGridPosition(5),
          'approve': calculateGridPosition(6),
          'allowance': calculateGridPosition(7),
          'Transfer': calculateGridPosition(8),
          'Approval': calculateGridPosition(9),
          'balanceOf': calculateGridPosition(10),
          'owner': calculateGridPosition(11),
          'setPaused': calculateGridPosition(12),
          'onlyOwner': calculateGridPosition(13),
          'User': calculateGridPosition(14),
          'Status': calculateGridPosition(15),
          'balances': calculateGridPosition(16),
          'userArray': calculateGridPosition(17),
          'ERC20Integration': calculateGridPosition(18),
          'OwnableFeature': calculateGridPosition(19),
          'ChainlinkPriceFeed': calculateGridPosition(20),
          'ExternalContractCall': calculateGridPosition(21),
          'InsufficientBalance': calculateGridPosition(22),
        },
        connections: []
      },

      // Constructor
      constructor: {
        id: nanoid(),
        type: 'constructor',
        name: 'Constructor',
        documentation: 'Contract initializer with parameters.',
        parameters: [
          { id: nanoid(), name: 'name_', type: 'string' },
          { id: nanoid(), name: 'symbol_', type: 'string' }
        ],
        category: { main: 'BasicComponents', sub: 'Constructor' },
        body: { content: 'name = name_; symbol = symbol_; owner = msg.sender;' }
      } as ConstructorComponentData,

      // State Variables
      stateVariables: [
        {
          id: nanoid(),
          type: 'variable',
          name: 'name',
          documentation: 'Token name',
          dataType: 'string',
          visibility: 'public',
          mutability: 'immutable',
          category: { main: 'BasicComponents', sub: 'StateVariables' },
        } as StateVariableComponentData,
        {
          id: nanoid(),
          type: 'variable',
          name: 'symbol',
          documentation: 'Token symbol',
          dataType: 'string',
          visibility: 'public',
          mutability: 'immutable',
          category: { main: 'BasicComponents', sub: 'StateVariables' },
        } as StateVariableComponentData,
        {
          id: nanoid(),
          type: 'variable',
          name: 'decimals',
          documentation: 'Token decimals',
          dataType: 'uint8',
          visibility: 'public',
          mutability: 'immutable',
          initialValue: '18',
          category: { main: 'BasicComponents', sub: 'StateVariables' },
        } as StateVariableComponentData,
        {
          id: nanoid(),
          type: 'variable',
          name: 'owner',
          documentation: 'Owner of the contract',
          dataType: 'address',
          visibility: 'public',
          mutability: 'mutable',
          category: { main: 'BasicComponents', sub: 'StateVariables' },
        } as StateVariableComponentData,
        {
          id: nanoid(),
          type: 'variable',
          name: 'paused',
          documentation: 'Pause state of the contract',
          dataType: 'bool',
          visibility: 'public',
          mutability: 'mutable',
          initialValue: 'false',
          category: { main: 'BasicComponents', sub: 'StateVariables' },
        } as StateVariableComponentData,
      ],

      // Functions
      functions: [
        {
          id: nanoid(),
          type: 'function',
          name: 'totalSupply',
          documentation: 'Returns total token supply',
          visibility: 'public',
          stateMutability: 'view',
          parameters: [],
          returnParameters: [
            { id: nanoid(), name: '', type: 'uint256' }
          ],
          modifiers: [],
          category: { main: 'Functions', sub: 'ReadFunctions' },
          body: { content: 'return _totalSupply;' }
        } as FunctionComponentData,

        {
          id: nanoid(),
          type: 'function',
          name: 'transfer',
          documentation: 'Transfers tokens to a specified address',
          visibility: 'public',
          stateMutability: 'nonpayable',
          parameters: [
            { id: nanoid(), name: 'recipient', type: 'address' },
            { id: nanoid(), name: 'amount', type: 'uint256' }
          ],
          returnParameters: [
            { id: nanoid(), name: '', type: 'bool' }
          ],
          modifiers: ['whenNotPaused'],
          category: { main: 'Functions', sub: 'WriteFunctions' },
          body: { content: '_transfer(msg.sender, recipient, amount); return true;' }
        } as FunctionComponentData,

        {
          id: nanoid(),
          type: 'function',
          name: 'approve',
          documentation: 'Approves an allowance for a spender',
          visibility: 'public',
          stateMutability: 'nonpayable',
          parameters: [
            { id: nanoid(), name: 'spender', type: 'address' },
            { id: nanoid(), name: 'amount', type: 'uint256' }
          ],
          returnParameters: [
            { id: nanoid(), name: '', type: 'bool' }
          ],
          modifiers: [],
          category: { main: 'Functions', sub: 'WriteFunctions' },
          body: { content: '_approve(msg.sender, spender, amount); return true;' }
        } as FunctionComponentData,

        {
          id: nanoid(),
          type: 'function',
          name: 'allowance',
          documentation: 'Returns the allowance of a spender',
          visibility: 'public',
          stateMutability: 'view',
          parameters: [
            { id: nanoid(), name: 'owner', type: 'address' },
            { id: nanoid(), name: 'spender', type: 'address' }
          ],
          returnParameters: [
            { id: nanoid(), name: '', type: 'uint256' }
          ],
          modifiers: [],
          category: { main: 'Functions', sub: 'ReadFunctions' },
          body: { content: 'return _allowances[owner][spender];' }
        } as FunctionComponentData,

        {
          id: nanoid(),
          type: 'function',
          name: 'setPaused',
          documentation: 'Pauses or unpauses the contract',
          visibility: 'public',
          stateMutability: 'nonpayable',
          parameters: [
            { id: nanoid(), name: '_paused', type: 'bool' }
          ],
          returnParameters: [],
          modifiers: ['onlyOwner'],
          category: { main: 'Functions', sub: 'WriteFunctions' },
          body: { content: 'paused = _paused;' }
        } as FunctionComponentData,

        {
          id: nanoid(),
          type: 'function',
          name: 'updatePrice',
          documentation: 'Updates price using oracle',
          visibility: 'public',
          stateMutability: 'nonpayable',
          parameters: [],
          returnParameters: [],
          modifiers: [],
          category: { main: 'Functions', sub: 'WriteFunctions' },
          body: { content: 'price = oracle.getLatestPrice();' }
        } as FunctionComponentData,

        {
          id: nanoid(),
          type: 'function',
          name: 'makeExternalCall',
          documentation: 'Calls an external contract',
          visibility: 'public',
          stateMutability: 'nonpayable',
          parameters: [
            { id: nanoid(), name: '_param', type: 'uint256' }
          ],
          returnParameters: [],
          modifiers: [],
          category: { main: 'Functions', sub: 'WriteFunctions' },
          body: { content: 'externalContract.externalMethod(_param);' }
        } as FunctionComponentData,
      ],

      // Events
      events: [
        {
          id: nanoid(),
          type: 'event',
          name: 'Transfer',
          documentation: 'Emitted when tokens are transferred',
          parameters: [
            { id: nanoid(), name: 'from', type: 'address', indexed: true },
            { id: nanoid(), name: 'to', type: 'address', indexed: true },
            { id: nanoid(), name: 'value', type: 'uint256', indexed: false }
          ],
          category: { main: 'Events', sub: 'TransferEvents' },
        } as EventComponentData,

       /*  {
          id: nanoid(),
          type: 'event',
          name: 'Approval',
          documentation: 'Emitted when an approval is made',
          parameters: [
            { id: nanoid(), name: 'owner', type: 'address', indexed: true },
            { id: nanoid(), name: 'spender', type: 'address', indexed: true },
            { id: nanoid(), name: 'value', type: 'uint256', indexed: false }
          ],
          category: { main: 'Events', sub: 'ApprovalEvents' },
        } as EventComponentData, */
      ],

      // Mappings
      mappings: [
        {
          id: nanoid(),
          type: 'mapping',
          name: 'balances',
          documentation: 'Account balances',
          keyType: 'address',
          valueType: 'uint256',
          visibility: 'public',
          category: { main: 'DataStructures', sub: 'Mapping' },
        } as MappingComponentData,

        /* {
          id: nanoid(),
          type: 'mapping',
          name: 'allowances',
          documentation: 'Allowed allowances for accounts',
          keyType: 'address',
          valueType: 'mapping(address => uint256)',
          visibility: 'public',
          category: { main: 'DataStructures', sub: 'Mapping' },
        } as MappingComponentData, */
      ],

      // Arrays
      arrays: [
        {
          id: nanoid(),
          type: 'array',
          name: 'userArray',
          dataType: 'address',
          length: undefined, // Dynamic array
          visibility: 'public',
          category: { main: 'DataStructures', sub: 'Array' },
        } as ArrayComponentData
      ],

      // Structs
      structs: [
        {
          id: nanoid(),
          type: 'struct',
          name: 'User',
          members: [
            { id: nanoid(), name: 'id', type: 'uint256' },
            { id: nanoid(), name: 'balance', type: 'uint256' },
            { id: nanoid(), name: 'status', type: 'Status' }
          ],
          category: { main: 'DataStructures', sub: 'Struct' },
        } as StructComponentData
      ],

      // Enums
      enums: [
        {
          id: nanoid(),
          type: 'enum',
          name: 'Status',
          members: ['Active', 'Inactive', 'Suspended'],
          category: { main: 'DataStructures', sub: 'Enum' },
        } as EnumComponentData
      ],

      // Modifiers
      modifiers: [
        {
          id: nanoid(),
          type: 'modifier',
          name: 'onlyOwner',
          parameters: [],
          body: { content: 'require(msg.sender == owner, "Not owner");' },
          category: { main: 'BasicComponents', sub: 'Modifiers' },
        } as ModifierComponentData,

        {
          id: nanoid(),
          type: 'modifier',
          name: 'whenNotPaused',
          parameters: [],
          body: { content: 'require(!paused, "Contract is paused");' },
          category: { main: 'BasicComponents', sub: 'Modifiers' },
        } as ModifierComponentData,
      ],

      // Integrations
      integrations: [
        {
          id: nanoid(),
          type: 'integration',
          standard: 'ERC20',
          features: ['burn', 'mint', 'approve', 'transferFrom'],
          category: { main: 'Integrations', sub: 'TokenStandards' },
          name: 'ERC20Integration',
        } as IntegrationComponentData
      ],

      // Security Features
      securityFeatures: [
        {
          id: nanoid(),
          type: 'security',
          featureType: 'ownable',
          implementation: 'Ownable',
          requirements: ['Only owner can call'],
          category: { main: 'Security', sub: 'AccessControl' },
          name: 'OwnableFeature',
        } as SecurityComponentData,

        {
          id: nanoid(),
          type: 'security',
          featureType: 'pausable',
          implementation: 'Pausable',
          requirements: ['Contract can be paused'],
          category: { main: 'Security', sub: 'AccessControl' },
          name: 'PausableFeature',
        } as SecurityComponentData,
      ],

      // Oracle Integrations
      oracleIntegrations: [
        {
          id: nanoid(),
          type: 'oracle',
          provider: 'chainlink',
          endpoint: 'priceFeed',
          parameters: [
            { id: nanoid(), name: 'asset', type: 'string' }
          ],
          category: { main: 'Integrations', sub: 'OracleIntegration' },
          name: 'ChainlinkPriceFeed',
        } as OracleIntegrationComponentData
      ],

      // External Calls
      externalCalls: [
        {
          id: nanoid(),
          type: 'externalCall',
          target: '0xContractAddress',
          method: 'externalMethod',
          parameters: [
            { id: nanoid(), name: '_param', type: 'uint256' }
          ],
          safetyChecks: ['Ensure contract exists', 'Handle reverts'],
          category: { main: 'Integrations', sub: 'ExternalCalls' },
          name: 'ExternalContractCall',
        } as ExternalCallComponentData
      ],

      // Errors
      errors: [
        {
          id: nanoid(),
          type: 'error',
          name: 'InsufficientBalance',
          parameters: [
            { id: nanoid(), name: 'required', type: 'uint256' },
            { id: nanoid(), name: 'available', type: 'uint256' }
          ],
          documentation: 'Triggered when a transfer has insufficient balance.',
          category: { main: 'BasicComponents', sub: 'CustomErrors' },
        } as ErrorComponentData,

        {
          id: nanoid(),
          type: 'error',
          name: 'ContractPaused',
          parameters: [],
          documentation: 'Triggered when the contract is paused.',
          category: { main: 'BasicComponents', sub: 'CustomErrors' },
        } as ErrorComponentData,
      ],

      // Abstract and Inheritance
      abstract: false,
      inherits: ['ERC20', 'Ownable', 'Pausable'],
      usingFor: []
    }
  }
];
