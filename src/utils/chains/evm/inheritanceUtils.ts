// utils/chains/evm/inheritanceUtils.ts
import { 
    EthereumContract, 
    ContractInheritance, 
    ComponentType,
    FunctionParameter 
  } from '@/types/evm/contractTypes';
  
  interface InheritedComponentInfo {
    id: string;
    name: string;
    type: ComponentType;
    inheritedFrom: {
      contractId: string;
      contractName: string;
    };
    isOverridden?: boolean;
    data: any;
  }
  
  export interface InheritanceAnalysis {
    components: {
      functions: Map<string, InheritedComponentInfo>;
      stateVariables: Map<string, InheritedComponentInfo>;
      events: Map<string, InheritedComponentInfo>;
      modifiers: Map<string, InheritedComponentInfo>;
    };
    constructorParams: Map<string, FunctionParameter[]>;
    circularDependency: boolean;
    inheritanceChain: string[];
  }
  
  export const analyzeInheritance = (
    contract: EthereumContract,
    allContracts: EthereumContract[]
  ): InheritanceAnalysis => {
    const analysis: InheritanceAnalysis = {
      components: {
        functions: new Map(),
        stateVariables: new Map(),
        events: new Map(),
        modifiers: new Map(),
      },
      constructorParams: new Map(),
      circularDependency: false,
      inheritanceChain: [],
    };
  
    const processedContracts = new Set<string>();
    const inheritanceStack = new Set<string>();
  
    const processContract = (
      currentContract: EthereumContract,
      depth: number = 0
    ): void => {
      if (inheritanceStack.has(currentContract.id)) {
        analysis.circularDependency = true;
        return;
      }
  
      if (processedContracts.has(currentContract.id)) {
        return;
      }
  
      inheritanceStack.add(currentContract.id);
      analysis.inheritanceChain.push(currentContract.name);
  
      currentContract.inherits?.forEach(inherit => {
        const baseContract = allContracts.find(c => c.id === inherit.contractId);
        if (baseContract) {
          processContract(baseContract, depth + 1);
          
          if (baseContract.constructor?.parameters) {
            analysis.constructorParams.set(
              baseContract.id,
              baseContract.constructor.parameters
            );
          }
        }
      });
  
      processComponents(currentContract, analysis, depth);
  
      inheritanceStack.delete(currentContract.id);
      processedContracts.add(currentContract.id);
    };
  
    processContract(contract);
    return analysis;
  };
  
  const processComponents = (
    contract: EthereumContract,
    analysis: InheritanceAnalysis,
    depth: number
  ) => {

    contract.functions.forEach(func => {
      if (func.visibility === 'public' || func.visibility === 'internal') {
        const existingFunc = analysis.components.functions.get(func.name);
        
        analysis.components.functions.set(func.name, {
          id: func.id,
          name: func.name,
          type: 'function',
          inheritedFrom: {
            contractId: contract.id,
            contractName: contract.name,
          },
          isOverridden: !!existingFunc,
          data: func,
        });
      }
    });
  
    contract.stateVariables.forEach(variable => {
      if (variable.visibility === 'public' || variable.visibility === 'internal') {
        analysis.components.stateVariables.set(variable.name, {
          id: variable.id,
          name: variable.name,
          type: 'variable',
          inheritedFrom: {
            contractId: contract.id,
            contractName: contract.name,
          },
          data: variable,
        });
      }
    });
  
    contract.events.forEach(event => {
      analysis.components.events.set(event.name, {
        id: event.id,
        name: event.name,
        type: 'event',
        inheritedFrom: {
          contractId: contract.id,
          contractName: contract.name,
        },
        data: event,
      });
    });
  
    contract.modifiers.forEach(modifier => {
      analysis.components.modifiers.set(modifier.name, {
        id: modifier.id,
        name: modifier.name,
        type: 'modifier',
        inheritedFrom: {
          contractId: contract.id,
          contractName: contract.name,
        },
        data: modifier,
      });
    });
  };
  
  export const getInheritedComponents = (
    contract: EthereumContract,
    allContracts: EthereumContract[]
  ): InheritanceAnalysis => {
    return analyzeInheritance(contract, allContracts);
  };
  
  export const validateInheritance = (
    contract: EthereumContract,
    allContracts: EthereumContract[]
  ): { valid: boolean; errors: string[] } => {
    const analysis = analyzeInheritance(contract, allContracts);
    const errors: string[] = [];
  
    if (analysis.circularDependency) {
      errors.push('Circular inheritance detected');
    }
  
    contract.inherits?.forEach(inherit => {
      const requiredParams = analysis.constructorParams.get(inherit.contractId);
      if (requiredParams && (!inherit.constructorParams || 
          inherit.constructorParams.length !== requiredParams.length)) {
        errors.push(
          `Missing constructor parameters for ${inherit.contractName}`
        );
      }
    });
  
  
    return {
      valid: errors.length === 0,
      errors,
    };
  };