// utils/overrideHelpers.ts
import { DraggableComponent, FunctionComponentData } from '@/types/evm/contractTypes';
import { OverrideableFunction, OverrideImplementation } from '@/types/evm/contractTypes';
import { useProjectStore } from '@/stores/useProjectStore';

export const getOverridableFunctions = (component: DraggableComponent): OverrideableFunction[] => {
  const currentProject = useProjectStore.getState().currentProject;
  const currentContract = useProjectStore.getState().currentContract;

  if (!currentContract?.inherits) return [];

  return currentContract.inherits.flatMap(inherit => {
    const parentContract = currentProject?.contracts?.find(
      c => c.id === inherit.contractId
    );
  
    return parentContract?.functions
      .filter(f => f.isVirtual)
      .map(f => ({
        id: f.id,
        name: f.name,
        visibility: f.visibility,
        stateMutability: f.stateMutability,
        parameters: f.parameters,
        returnParameters: f.returnParameters,
        isVirtual: f.isVirtual || false,
        sourceContract: parentContract.name,
        body: f.body
      } as OverrideableFunction)) || [];
  });
  
};

export const getCurrentOverrides = (component: DraggableComponent): OverrideImplementation[] => {
  return component.data.type === 'function' && component.data.overrides 
    ? component.data.overrides 
    : [];
};

export const getConflictCount = (component: DraggableComponent): number => {
  const overridableFunctions = getOverridableFunctions(component);
  const currentOverrides = getCurrentOverrides(component);

  return currentOverrides.filter(override => {
    const parentFunc = overridableFunctions.find(f => f.id === override.functionId);
    return !isValidOverride(parentFunc, override);
  }).length;
};

export const generateFunctionSignature = (func: OverrideableFunction): string => {
  const params = func.parameters.map(p => `${p.type} ${p.name}`).join(', ');
  const returns = func.returnParameters.length 
    ? ` returns (${func.returnParameters.map(p => p.type).join(', ')})`
    : '';

  return `function ${func.name}(${params}) ${func.visibility} ${func.stateMutability}${returns}`;
};

export const isOverridden = (functionId: string, component: DraggableComponent): boolean => {
  return getCurrentOverrides(component).some(o => o.functionId === functionId);
};

export const handleOverrideToggle = (
  functionId: string, 
  checked: boolean,
  component: DraggableComponent,
  onChange: (updates: Partial<any>) => void
) => {
  const currentOverrides = getCurrentOverrides(component);
  
  if (checked) {
    const newOverride: OverrideImplementation = {
      functionId,
      content: '',
      superCall: true,
      hasModification: false
    };
    onChange({ overrides: [...currentOverrides, newOverride] });
  } else {
    onChange({ 
      overrides: currentOverrides.filter(o => o.functionId !== functionId) 
    });
  }
};

export const generateSuperCall = (func: OverrideableFunction): string => {
  const params = func.parameters.map(p => p.name).join(', ');
  return `super.${func.name}(${params});`;
};

export const getOverrideImplementation = (
  functionId: string, 
  component: DraggableComponent
): string => {
  return getCurrentOverrides(component)
    .find(o => o.functionId === functionId)?.content || '';
};

export const updateOverrideImplementation = (
  functionId: string,
  content: string,
  component: DraggableComponent,
  onChange: (updates: Partial<any>) => void
) => {
  const currentOverrides = getCurrentOverrides(component);
  const updatedOverrides = currentOverrides.map(o => 
    o.functionId === functionId 
      ? { ...o, content, hasModification: true }
      : o
  );
  
  onChange({ overrides: updatedOverrides });
};

const isValidOverride = (
  parentFunc: OverrideableFunction | undefined, 
  override: OverrideImplementation
): boolean => {
  if (!parentFunc) return false;
  
  return true;
};