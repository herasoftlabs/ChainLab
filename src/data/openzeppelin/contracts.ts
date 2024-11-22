// src/data/openzeppelin/contracts.ts
import { OpenZeppelinContract } from "@/types/evm/contractTypes";
import {
  EventComponentData,
  FunctionComponentData,
  ModifierComponentData,
  StateVariableComponentData,
} from "@/types/evm/contractTypes";

// Access Control Contracts
const accessControlContracts: OpenZeppelinContract[] = [
  {
    id: "oz_ownable",
    name: "Ownable",
    category: "access",
    version: "4.9.0",
    description:
      "Contract module which provides a basic access control mechanism",
    source: "openzeppelin",
    components: {
      constructor: {
        id: "ownable_constructor",
        name: "constructor",
        type: "constructor",
        parameters: [],
        category: "BasicComponents",
        documentation:
          "Initializes the contract setting the deployer as the initial owner.",
        body: {
          content:
            "_owner = msg.sender;\nemit OwnershipTransferred(address(0), msg.sender);",
        },
      },
      functions: [
        {
          id: "owner",
          name: "owner",
          type: "function",
          visibility: "public",
          stateMutability: "view",
          parameters: [],
          returnParameters: [
            {
              id: "owner_return",
              name: "",
              type: "address",
            },
          ],
          modifiers: [],
          category: "Functions",
          documentation: "Returns the address of the current owner.",
        },
        {
          id: "transferOwnership",
          name: "transferOwnership",
          type: "function",
          visibility: "public",
          stateMutability: "nonpayable",
          parameters: [
            {
              id: "newOwner",
              name: "newOwner",
              type: "address",
            },
          ],
          returnParameters: [],
          modifiers: ["onlyOwner"],
          category: "Functions",
          documentation: "Transfers ownership of the contract to a new account",
          body: {
            content:
              "require(newOwner != address(0), 'Ownable: new owner is the zero address');\nemit OwnershipTransferred(_owner, newOwner);\n_owner = newOwner;",
          },
        },
        {
          id: "renounceOwnership",
          name: "renounceOwnership",
          type: "function",
          visibility: "public",
          stateMutability: "nonpayable",
          parameters: [],
          returnParameters: [],
          modifiers: ["onlyOwner"],
          category: "Functions",
          documentation:
            "Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore.",
          body: {
            content:
              "emit OwnershipTransferred(_owner, address(0));\n_owner = address(0);",
          },
        },
      ],
      events: [
        {
          id: "OwnershipTransferred",
          name: "OwnershipTransferred",
          type: "event",
          parameters: [
            {
              id: "previousOwner",
              name: "previousOwner",
              type: "address",
              indexed: true,
            },
            {
              id: "newOwner",
              name: "newOwner",
              type: "address",
              indexed: true,
            },
          ],
          category: "BasicComponents",
          documentation: "Emitted when ownership is transferred",
        },
      ],
      modifiers: [
        {
          id: "onlyOwner",
          name: "onlyOwner",
          type: "modifier",
          parameters: [],
          category: "BasicComponents",
          documentation: "Throws if called by any account other than the owner",
          body: {
            content:
              "require(owner() == msg.sender, 'Ownable: caller is not the owner');\n_;",
          },
        },
      ],
      stateVariables: [
        {
          id: "_owner",
          name: "_owner",
          type: "variable",
          dataType: "address",
          visibility: "private",
          mutability: "mutable",
          category: "StateVariables",
          documentation: "Address of the current owner",
        },
      ],
    },
  },
];

// Token Contracts
const tokenContracts: OpenZeppelinContract[] = [
  {
    id: "oz_erc20",
    name: "ERC20",
    category: "token",
    version: "4.9.0",
    description: "Implementation of the ERC20 Token Standard",
    source: "openzeppelin",
    components: {
      constructor: {
        id: "erc20_constructor",
        name: "constructor",
        type: "constructor",
        parameters: [
          {
            id: "name_param",
            name: "name_",
            type: "string",
          },
          {
            id: "symbol_param",
            name: "symbol_",
            type: "string",
          },
        ],
        category: "BasicComponents",
        documentation: "Sets the values for name and symbol",
        body: {
          content: "_name = name_;\n_symbol = symbol_;",
        },
      },
      functions: [
        // Existing transfer function
        {
          id: "transfer",
          name: "transfer",
          type: "function",
          visibility: "public",
          stateMutability: "nonpayable",
          parameters: [
            {
              id: "to",
              name: "to",
              type: "address",
            },
            {
              id: "amount",
              name: "amount",
              type: "uint256",
            },
          ],
          returnParameters: [
            {
              id: "success",
              name: "",
              type: "bool",
            },
          ],
          modifiers: [],
          category: "Functions",
          documentation: "Transfer tokens to a specified address",
        },
        // Additional core functions
        {
          id: "name",
          name: "name",
          type: "function",
          visibility: "public",
          stateMutability: "view",
          parameters: [],
          returnParameters: [
            {
              id: "name_return",
              name: "",
              type: "string",
            },
          ],
          modifiers: [],
          category: "Functions",
          documentation: "Returns the name of the token",
        },
        {
          id: "symbol",
          name: "symbol",
          type: "function",
          visibility: "public",
          stateMutability: "view",
          parameters: [],
          returnParameters: [
            {
              id: "symbol_return",
              name: "",
              type: "string",
            },
          ],
          modifiers: [],
          category: "Functions",
          documentation: "Returns the symbol of the token",
        },
        {
          id: "decimals",
          name: "decimals",
          type: "function",
          visibility: "public",
          stateMutability: "view",
          parameters: [],
          returnParameters: [
            {
              id: "decimals_return",
              name: "",
              type: "uint8",
            },
          ],
          modifiers: [],
          category: "Functions",
          documentation: "Returns the number of decimals used for token",
        },
        {
          id: "totalSupply",
          name: "totalSupply",
          type: "function",
          visibility: "public",
          stateMutability: "view",
          parameters: [],
          returnParameters: [
            {
              id: "supply_return",
              name: "",
              type: "uint256",
            },
          ],
          modifiers: [],
          category: "Functions",
          documentation: "Returns the total supply of tokens",
        },
        {
          id: "balanceOf",
          name: "balanceOf",
          type: "function",
          visibility: "public",
          stateMutability: "view",
          parameters: [
            {
              id: "account",
              name: "account",
              type: "address",
            },
          ],
          returnParameters: [
            {
              id: "balance_return",
              name: "",
              type: "uint256",
            },
          ],
          modifiers: [],
          category: "Functions",
          documentation: "Returns the balance of the specified address",
        },
        {
          id: "approve",
          name: "approve",
          type: "function",
          visibility: "public",
          stateMutability: "nonpayable",
          parameters: [
            {
              id: "spender",
              name: "spender",
              type: "address",
            },
            {
              id: "amount",
              name: "amount",
              type: "uint256",
            },
          ],
          returnParameters: [
            {
              id: "success",
              name: "",
              type: "bool",
            },
          ],
          modifiers: [],
          category: "Functions",
          documentation:
            "Approve the passed address to spend the specified amount of tokens",
        },
        {
          id: "transferFrom",
          name: "transferFrom",
          type: "function",
          visibility: "public",
          stateMutability: "nonpayable",
          parameters: [
            {
              id: "from",
              name: "from",
              type: "address",
            },
            {
              id: "to",
              name: "to",
              type: "address",
            },
            {
              id: "amount",
              name: "amount",
              type: "uint256",
            },
          ],
          returnParameters: [
            {
              id: "success",
              name: "",
              type: "bool",
            },
          ],
          modifiers: [],
          category: "Functions",
          documentation: "Transfer tokens from one address to another",
        },
      ],
      events: [
        // Existing Transfer event
        {
          id: "Transfer",
          name: "Transfer",
          type: "event",
          parameters: [
            {
              id: "from",
              name: "from",
              type: "address",
              indexed: true,
            },
            {
              id: "to",
              name: "to",
              type: "address",
              indexed: true,
            },
            {
              id: "value",
              name: "value",
              type: "uint256",
              indexed: false,
            },
          ],
          category: "BasicComponents",
          documentation: "Emitted when tokens are transferred",
        },
        // Additional Approval event
        {
          id: "Approval",
          name: "Approval",
          type: "event",
          parameters: [
            {
              id: "owner",
              name: "owner",
              type: "address",
              indexed: true,
            },
            {
              id: "spender",
              name: "spender",
              type: "address",
              indexed: true,
            },
            {
              id: "value",
              name: "value",
              type: "uint256",
              indexed: false,
            },
          ],
          category: "BasicComponents",
          documentation: "Emitted when allowance is set",
        },
      ],
      stateVariables: [
        // Existing balances mapping
        {
          id: "_balances",
          name: "_balances",
          type: "variable",
          dataType: {
            type: "mapping",
            keyType: "address",
            valueType: "uint256",
          },
          visibility: "private",
          mutability: "mutable",
          category: "StateVariables",
          documentation: "Maps addresses to token balances",
        },
        // Additional state variables
        {
          id: "_name",
          name: "_name",
          type: "variable",
          dataType: "string",
          visibility: "private",
          mutability: "immutable",
          category: "StateVariables",
          documentation: "Token name",
        },
        {
          id: "_symbol",
          name: "_symbol",
          type: "variable",
          dataType: "string",
          visibility: "private",
          mutability: "immutable",
          category: "StateVariables",
          documentation: "Token symbol",
        },
        {
          id: "_totalSupply",
          name: "_totalSupply",
          type: "variable",
          dataType: "uint256",
          visibility: "private",
          mutability: "mutable",
          category: "StateVariables",
          documentation: "Total supply of tokens",
        },
        {
          id: "_allowances",
          name: "_allowances",
          type: "variable",
          dataType: {
            type: "mapping",
            keyType: "address",
            valueType: {
              type: "mapping",
              keyType: "address",
              valueType: "uint256",
            },
          },
          visibility: "private",
          mutability: "mutable",
          category: "StateVariables",
          documentation: "Maps owner addresses to spender allowances",
        },
      ],
      modifiers: [
        {
          id: "nonZeroAddress",
          name: "nonZeroAddress",
          type: "modifier",
          parameters: [
            {
              id: "account",
              name: "account",
              type: "address",
            },
          ],
          category: "BasicComponents",
          documentation: "Validates that the address is not zero",
          body: {
            content:
              "require(account != address(0), 'ERC20: address zero is not a valid owner');\n_;",
          },
        },
      ],
    },
  },
];

// Security Contracts
const securityContracts: OpenZeppelinContract[] = [
  {
    id: "oz_pausable",
    name: "Pausable",
    category: "security",
    version: "4.9.0",
    description:
      "Contract module which allows children to implement an emergency stop mechanism",
    source: "openzeppelin",
    components: {
      constructor: {
        id: "pausable_constructor",
        name: "constructor",
        type: "constructor",
        parameters: [],
        category: "BasicComponents",
        documentation: "Initializes the contract in unpaused state.",
        body: {
          content: "_paused = false;",
        },
      },
      functions: [
        {
          id: "paused",
          name: "paused",
          type: "function",
          visibility: "public",
          stateMutability: "view",
          parameters: [],
          returnParameters: [
            {
              id: "paused_return",
              name: "",
              type: "bool",
            },
          ],
          modifiers: [],
          category: "Functions",
          documentation:
            "Returns true if the contract is paused, and false otherwise",
        },
        {
          id: "pause",
          name: "pause",
          type: "function",
          visibility: "public",
          stateMutability: "nonpayable",
          parameters: [],
          returnParameters: [],
          modifiers: ["whenNotPaused"],
          category: "Functions",
          documentation: "Triggers stopped state",
          body: {
            content: "_paused = true;\nemit Paused(msg.sender);",
          },
        },
        {
          id: "unpause",
          name: "unpause",
          type: "function",
          visibility: "public",
          stateMutability: "nonpayable",
          parameters: [],
          returnParameters: [],
          modifiers: ["whenPaused"],
          category: "Functions",
          documentation: "Returns to normal state",
          body: {
            content: "_paused = false;\nemit Unpaused(msg.sender);",
          },
        },
      ],
      events: [
        {
          id: "Paused",
          name: "Paused",
          type: "event",
          parameters: [
            {
              id: "account",
              name: "account",
              type: "address",
              indexed: false,
            },
          ],
          category: "BasicComponents",
          documentation: "Emitted when the pause is triggered",
        },
        {
          id: "Unpaused",
          name: "Unpaused",
          type: "event",
          parameters: [
            {
              id: "account",
              name: "account",
              type: "address",
              indexed: false,
            },
          ],
          category: "BasicComponents",
          documentation: "Emitted when the pause is lifted",
        },
      ],
      modifiers: [
        {
          id: "whenNotPaused",
          name: "whenNotPaused",
          type: "modifier",
          parameters: [],
          category: "BasicComponents",
          documentation:
            "Modifier to make a function callable only when the contract is not paused",
          body: {
            content: "require(!paused(), 'Pausable: paused');\n_;",
          },
        },
        {
          id: "whenPaused",
          name: "whenPaused",
          type: "modifier",
          parameters: [],
          category: "BasicComponents",
          documentation:
            "Modifier to make a function callable only when the contract is paused",
          body: {
            content: "require(paused(), 'Pausable: not paused');\n_;",
          },
        },
      ],
      stateVariables: [
        {
          id: "_paused",
          name: "_paused",
          type: "variable",
          dataType: "bool",
          visibility: "private",
          mutability: "mutable",
          category: "StateVariables",
          documentation: "Indicates if the contract is paused",
        },
      ],
    },
  },
];

// Export statements remain the same
export const openZeppelinContracts = [
  ...accessControlContracts,
  ...tokenContracts,
  ...securityContracts,
];
export const getContractsByCategory = (category: string) =>
  openZeppelinContracts.filter((contract) => contract.category === category);
export const getContractsByVersion = (version: string) =>
  openZeppelinContracts.filter((contract) => contract.version === version);
export const findContractById = (id: string) =>
  openZeppelinContracts.find((contract) => contract.id === id);
