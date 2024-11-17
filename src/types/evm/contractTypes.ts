// evm/contractType.ts Dosyası

// -------------------------
// 1. Ethereum Smart Contract 
// -------------------------
export interface EthereumContract {
  id: string;
  name: string;
  version: string;
  license: string;
  documentation?: string;
  createdAt: string;
  abstract?: boolean;
  inherits?: ContractInheritance[];
  templateId?: string;
  templateName?: string;
  templateType?: string;
  componentLayout?: {
    positions: Record<string, { x: number, y: number }>;
    connections: Array<{ source: string, target: string }>;
  };
  constructor?: ConstructorComponentData;
  stateVariables: StateVariableComponentData[];
  functions: FunctionComponentData[];
  events: EventComponentData[];
  errors: ErrorComponentData[];
  modifiers: ModifierComponentData[];
  structs: StructComponentData[];
  enums: EnumComponentData[];
  mappings: MappingComponentData[];
  arrays: ArrayComponentData[];
  integrations: IntegrationComponentData[];
  securityFeatures?: SecurityComponentData[];
  oracleIntegrations?: OracleIntegrationComponentData[];
  externalCalls?: ExternalCallComponentData[];
  usingFor?: {
    library: string;
    type?: string;
  }[];
}

// -------------------------
// 1. Inheritance and Security
// -------------------------

export interface ContractInheritance {
  id: string;
  contractId: string;
  contractName: string;
  constructorParams?: FunctionParameter[];
  accessibleComponents?: {
    functions: string[];      
    stateVariables: string[]; 
    events: string[];        
    modifiers: string[];    
  };
}

export interface SecurityCheck {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'inheritance' | 'access' | 'override' | 'general';
}

export interface SecurityIssue {
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  component: string;
  suggestion?: string;
  code?: string;
}

export interface OverrideableFunction {
  id: string;
  name: string;
  visibility: Visibility;
  stateMutability: Mutability;
  parameters: FunctionParameter[];
  returnParameters: FunctionParameter[];
  isVirtual: boolean;
  sourceContract: string;
  body?: BodyContent;
}

export interface OverrideImplementation {
  functionId: string;
  content: string;
  superCall: boolean;
  hasModification: boolean;
}

// -------------------------
// 2. Basic Types (Visibility ve Mutability)
// -------------------------
export type Visibility = 'public' | 'private' | 'internal' | 'external';
export type Mutability = 'pure' | 'view' | 'payable' | 'nonpayable';
export type VariableMutability = 'mutable' | 'immutable' | 'constant';

// -------------------------
// 3. Data Types
// -------------------------
export type BasicDataType =
  | 'address'
  | 'bool'
  | 'string'
  | 'bytes'
  | `uint${8 | 16 | 32 | 64 | 128 | 256}`
  | `int${8 | 16 | 32 | 64 | 128 | 256}`
  | `bytes${1 | 2 | 3 | 4 | 8 | 16 | 32}`;



  export type ComplexDataType =
  | {
      type: 'array';
      baseType: BasicDataType | ComplexDataType;
      isFixed?: boolean;
      length?: number;
    }
  | {
      type: 'mapping';
      keyType: BasicDataType;
      valueType: BasicDataType | ComplexDataType;
    }
  | {
      type: 'struct';
      members: StructMember[];
    }
  | {
      type: 'enum';
      members: string[];
    };

    export type DataType = BasicDataType | ComplexDataType;

    

// -------------------------
// 4. Component Category and Types
// -------------------------


export type ComponentCategoryMain =
  | 'StateVariables'
  | 'BasicComponents'
  | 'Functions'
  | 'DataStructures'
  | 'OracleIntegrations';

 


  export type ComponentType =
  | 'variable'
  | 'constructor'
  | 'modifier'
  | 'error'
  | 'function'
  | 'struct'
  | 'enum'
  | 'mapping'
  | 'array'
  | 'event'
  | 'integration'
  | 'security'
  | 'oracle'
  | 'externalCall';


  export type DraggableComponentData =
  | (StateVariableComponentData & ComponentDataFields)
  | (ConstructorComponentData & ComponentDataFields)
  | (FunctionComponentData & ComponentDataFields)
  | (EventComponentData & ComponentDataFields)
  | (ModifierComponentData & ComponentDataFields)
  | (ErrorComponentData & ComponentDataFields)
  | (StructComponentData & ComponentDataFields)
  | (EnumComponentData & ComponentDataFields)
  | (MappingComponentData & ComponentDataFields)
  | (ArrayComponentData & ComponentDataFields)
  | (IntegrationComponentData & ComponentDataFields)
  | (SecurityComponentData & ComponentDataFields)
  | (OracleIntegrationComponentData & ComponentDataFields)
  | (ExternalCallComponentData & ComponentDataFields);

  
export interface ComponentDataFields {
  id: string;
  type: ComponentType;
  name: string;
  documentation?: string;
  category: ComponentCategoryMain;
  defaultValues?: Record<string, any>;
  body?: BodyContent;
  inherits?: ContractInheritance[];
}


export interface DraggableComponent {
  id: string;
  type: ComponentType;
  data: DraggableComponentData;
  position: ComponentPosition;
  connections: string[];
  documentation?: string;
  width: number;
  height: number;
  isNew?: boolean;
}

export interface ComponentPosition {
  x: number;
  y: number;
}

/* Drag Actions */

export type DragSourceType = 'new-template' | 'existing-component';
export interface DragTemplateMetadata {
  componentType: ComponentType;
}

export type DraggedItemType = {
  id: string;
  type: ComponentType;
  data: {
    type: ComponentType;
    category?: ComponentCategoryMain;
    stateMutability?: Mutability;
    dataType?: DataType;
    [key: string]: any;
  };
  position: { x: number; y: number };
  connections: string[];
  width: number;
  height: number;
  documentation: string;
};

export interface DragData {
  type: 'new-template' | 'existing-component';
  payload: {
    id?: string;
    componentType: ComponentType;
    category?: ComponentCategoryMain;
    stateMutability?: Mutability;
    dataType?: DataType;
  };
}

export interface PreviewDataPayload {
  componentType: ComponentType;
  metadata: {
    displayName: string;
    description: string;
  };
}

// -------------------------
// 5. Component Interfaces
// -------------------------
export interface BaseComponent {
  id: string;
  type: ComponentType;
  name: string;
}
/* State Variables */
export interface StateVariableComponentData extends BaseComponent, ComponentDataFields {
  type: 'variable';
  dataType: DataType; 
  visibility: Visibility;
  mutability: VariableMutability;
  initialValue?: string;
}
// Constructor
export interface ConstructorComponentData extends BaseComponent, ComponentDataFields {
  type: 'constructor';
  parameters: FunctionParameter[];
  modifiers?: Array<string | ModifierReference>;
  inheritance?: {
    baseContract: string;
    parameters: FunctionParameter[];
  }[];
  body?: BodyContent;
}
/* Struct */
export interface StructComponentData extends BaseComponent, ComponentDataFields {
  type: 'struct';
  members: StructMember[];
}
export interface StructMember {
  id: string;
  name: string;
  type: BasicDataType | string;
}

/* Enum */
export interface EnumComponentData extends BaseComponent, ComponentDataFields {
  type: 'enum';
  members: string[];
}
/* Function */
export interface FunctionComponentData extends BaseComponent, ComponentDataFields {
  type: 'function';
  visibility: Visibility;
  stateMutability: Mutability;
  parameters: FunctionParameter[];
  returnParameters: FunctionParameter[];
  modifiers: Array<string | ModifierReference>;
  isVirtual?: boolean;
  body?: BodyContent; 
  overrides?: OverrideImplementation[];
}
export interface ModifierReference {
  id: string;
  name: string;
}

export interface FunctionParameter {
  id: string;
  name: string;
  type: BasicDataType;
  value?: string;
}
export interface BodyContent {
  content?: string; 
  dependencies?: string[]; 
}
/* Event */
export interface EventComponentData extends BaseComponent, ComponentDataFields {
  type: 'event';
  parameters: EventParameter[];
}
export interface EventParameter {
  id: string;
  name: string;
  type: BasicDataType;
  indexed: boolean;
}
/* Error */
export interface ErrorComponentData extends BaseComponent, ComponentDataFields {
  type: 'error';
  parameters: FunctionParameter[];
}
/* Modifier */
export interface ModifierComponentData extends BaseComponent, ComponentDataFields {
  type: 'modifier';
  parameters: FunctionParameter[];
}
/* Mapping */
export interface MappingComponentData extends BaseComponent, ComponentDataFields {
  type: 'mapping';
  keyType: BasicDataType;
  valueType: DataType;
  visibility: Visibility;
}
/* Array */
export interface ArrayComponentData extends BaseComponent, ComponentDataFields {
  type: 'array';
  dataType: DataType;
  length?: number;
  visibility: Visibility;
}
/* Integration */
export interface IntegrationComponentData extends BaseComponent, ComponentDataFields {
  type: 'integration';
  standard: 'ERC20' | 'ERC721' | 'ERC1155' | 'Custom';
  features: string[];
}
/* Security */
export interface SecurityComponentData extends BaseComponent, ComponentDataFields {
  type: 'security';
  featureType: 'ownable' | 'pausable' | 'guard';
  implementation: string;
  requirements?: string[];
}
/* OracleIntegration */
export interface OracleIntegrationComponentData extends BaseComponent, ComponentDataFields {
  type: 'oracle';
  provider: 'chainlink' | 'band' | 'custom';
  endpoint?: string;
  parameters?: FunctionParameter[];
}
/* ExternalCall */
export interface ExternalCallComponentData extends BaseComponent, ComponentDataFields {
  type: 'externalCall';
  target: string;
  method: string;
  parameters: FunctionParameter[];
  safetyChecks: string[];
}


// -------------------------
// 6. Type Guards
// -------------------------
export function isStateVariableComponentData(data: DraggableComponentData): data is StateVariableComponentData {
  return data.type === 'variable';
}
export function isFunctionComponentData(data: DraggableComponentData ): data is FunctionComponentData {
  return data.type === 'function';
}
export function isEventComponentData(data: DraggableComponentData): data is EventComponentData {
  return data.type === 'event';
}
export function isModifierComponentData(data: DraggableComponentData): data is ModifierComponentData {
  return data.type === 'modifier';
}
export function isErrorComponentData(data: DraggableComponentData): data is ErrorComponentData {
  return data.type === 'error';
}
export function isStructComponentData(data: DraggableComponentData): data is StructComponentData {
  return data.type === 'struct';
}
export function isEnumComponentData(data: DraggableComponentData): data is EnumComponentData {
  return data.type === 'enum';
}
export function isMappingComponentData(data: DraggableComponentData): data is MappingComponentData {
  return data.type === 'mapping';
}
export function isArrayComponentData(data: DraggableComponentData): data is ArrayComponentData {
  return data.type === 'array';
}
export function isIntegrationComponentData(data: DraggableComponentData): data is IntegrationComponentData {
  return data.type === 'integration';
}
export function isSecurityComponentData(data: DraggableComponentData): data is SecurityComponentData {
  return data.type === 'security';
}
export function isOracleIntegrationComponentData(data: DraggableComponentData): data is OracleIntegrationComponentData {
  return data.type === 'oracle';
}
export function isExternalCallComponentData(data: DraggableComponentData): data is ExternalCallComponentData {
  return data.type === 'externalCall';
}
export function isConstructorComponentData(
  data: DraggableComponentData
): data is ConstructorComponentData {
  return data.type === 'constructor';
}
