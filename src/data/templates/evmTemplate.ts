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
  category?: string; 
  features?: string[]; 
  complexity?: string; 
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
    category: 'utility',
    features: ['Empty contract', 'Basic structure'],
    complexity: 'Beginner',
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
      usingFor: [],
      componentLayout: {
        positions: {},
        connections: []
      }
    }
  },
  {
    id: 'erc20',
    name: 'ERC-20 Token',
    description: 'Standard ERC-20 token template.',
    category: 'defi',
    features: ['Transfer', 'Balance tracking', 'Standard compliance'],
    complexity: 'Intermediate',
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
        category: 'BasicComponents',
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
          category: 'StateVariables',
          name: 'name',
        } as StateVariableComponentData,
        {
          id: nanoid(),
          type: 'variable',
          documentation: 'Token symbol',
          dataType: 'string',
          visibility: 'public',
          mutability: 'immutable',
          category: 'StateVariables',
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
          category: 'StateVariables',
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
          category: 'Functions',
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
          modifiers: [{ id: nanoid(), name: 'whenNotPaused' }],
          category: 'Functions',
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
          category: 'BasicComponents',
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
          category: 'DataStructures',
        } as MappingComponentData
      ],
      errors: [],
      modifiers: [],
      structs: [],
      enums: [],
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
  /* Full Feature Example */
  {
    id: 'full_feature',
    name: 'Full Feature Solidity Contract',
    description: 'A comprehensive Solidity contract template with all components included.',
    category: 'utility',
    features: [
      'Complete implementation',
      'Security features',
      'Oracle integration',
      'External calls'
    ],
    complexity: 'Advanced',
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
      constructor: {
        id: nanoid(),
        type: 'constructor',
        name: 'Constructor',
        documentation: 'Contract initializer with parameters.',
        parameters: [
          { id: nanoid(), name: 'name_', type: 'string' },
          { id: nanoid(), name: 'symbol_', type: 'string' }
        ],
        category: 'BasicComponents',
        body: { content: 'name = name_; symbol = symbol_; owner = msg.sender;' }
      } as ConstructorComponentData,
      stateVariables: [
        {
          id: nanoid(),
          type: 'variable',
          name: 'name',
          documentation: 'Token name',
          dataType: 'string',
          visibility: 'public',
          mutability: 'immutable',
          category: 'StateVariables',
        } as StateVariableComponentData,
        {
          id: nanoid(),
          type: 'variable',
          name: 'owner',
          documentation: 'Owner of the contract',
          dataType: 'address',
          visibility: 'public',
          mutability: 'mutable',
          category: 'StateVariables',
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
          category: 'StateVariables',
        } as StateVariableComponentData,
      ],
      functions: [
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
          modifiers: [{ id: nanoid(), name: 'whenNotPaused' }],
          category: 'Functions',
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
          category: 'BasicComponents',
        } as EventComponentData,
      ],
      mappings: [
        {
          id: nanoid(),
          type: 'mapping',
          name: 'balances',
          documentation: 'Account balances',
          keyType: 'address',
          valueType: 'uint256',
          visibility: 'public',
          category: 'DataStructures',
        } as MappingComponentData,
      ],
      arrays: [
        {
          id: nanoid(),
          type: 'array',
          name: 'userArray',
          dataType: 'address',
          length: undefined,
          visibility: 'public',
          category: 'DataStructures',
        } as ArrayComponentData
      ],
      structs: [
        {
          id: nanoid(),
          type: 'struct',
          name: 'User',
          members: [
            { id: nanoid(), name: 'id', type: 'uint256' },
            { id: nanoid(), name: 'balance', type: 'uint256' }
          ],
          category: 'DataStructures',
        } as StructComponentData
      ],
      enums: [
        {
          id: nanoid(),
          type: 'enum',
          name: 'Status',
          members: ['Active', 'Inactive', 'Suspended'],
          category: 'DataStructures',
        } as EnumComponentData
      ],
      modifiers: [
        {
          id: nanoid(),
          type: 'modifier',
          name: 'onlyOwner',
          parameters: [],
          body: { content: 'require(msg.sender == owner, "Not owner");' },
          category: 'BasicComponents',
        } as ModifierComponentData,
      ],
      integrations: [
        {
          id: nanoid(),
          type: 'integration',
          name: 'ERC20Integration',
          standard: 'ERC20',
          features: ['burn', 'mint', 'approve', 'transferFrom'],
          category: 'OracleIntegrations',
        } as IntegrationComponentData
      ],
      securityFeatures: [
        {
          id: nanoid(),
          type: 'security',
          name: 'OwnableFeature',
          featureType: 'ownable',
          implementation: 'Ownable',
          requirements: ['Only owner can call'],
          category: 'BasicComponents',
        } as SecurityComponentData,
      ],
      oracleIntegrations: [
        {
          id: nanoid(),
          type: 'oracle',
          name: 'ChainlinkPriceFeed',
          provider: 'chainlink',
          endpoint: 'priceFeed',
          parameters: [
            { id: nanoid(), name: 'asset', type: 'string' }
          ],
          category: 'OracleIntegrations',
        } as OracleIntegrationComponentData
      ],
      externalCalls: [
        {
          id: nanoid(),
          type: 'externalCall',
          name: 'ExternalContractCall',
          target: '0xContractAddress',
          method: 'externalMethod',
          parameters: [
            { id: nanoid(), name: '_param', type: 'uint256' }
          ],
          safetyChecks: ['Ensure contract exists', 'Handle reverts'],
          category: 'OracleIntegrations',
        } as ExternalCallComponentData
      ],
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
          category: 'BasicComponents',
        } as ErrorComponentData,
      ],
      abstract: false,
      inherits: [],
      usingFor: []
    }
  }
];
