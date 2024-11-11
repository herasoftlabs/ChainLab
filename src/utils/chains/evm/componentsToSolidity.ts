// src/utils/chains/evm/componentsToSolidity.ts

import {
    DraggableComponent,
    StateVariableComponentData,
    FunctionComponentData,
    StructComponentData,
    EnumComponentData,
    ConstructorComponentData,
    ModifierComponentData,
    EventComponentData,
    ErrorComponentData,
    isStateVariableComponentData,
    isFunctionComponentData,
    isStructComponentData,
    isEnumComponentData,
    isConstructorComponentData,
    isModifierComponentData,
    isEventComponentData,
    isErrorComponentData,
  } from '@/types/evm/contractTypes';
  
  export const componentsToSolidity = (
    contractName: string,
    components: DraggableComponent[],
  ): string => {
    let code = `pragma solidity ^0.8.0;\n\n`;
  

    const componentCodes = components.map((component) => {
      const { data } = component;
  
      if (isStateVariableComponentData(data)) {
        return generateVariableCode(data);
      } else if (isFunctionComponentData(data)) {
        return generateFunctionCode(data);
      } else if (isStructComponentData(data)) {
        return generateStructCode(data);
      } else if (isEnumComponentData(data)) {
        return generateEnumCode(data);
      } else if (isConstructorComponentData(data)) {
        return generateConstructorCode(data);
      } else if (isModifierComponentData(data)) {
        return generateModifierCode(data);
      } else if (isEventComponentData(data)) {
        return generateEventCode(data);
      } else if (isErrorComponentData(data)) {
        return generateErrorCode(data);
      } else {
        // Handle other types or return an empty string
        return '';
      }
    });
  
    // Combine component codes into the contract
    code += `contract ${contractName} {\n`;
    componentCodes.forEach((componentCode) => {
      code += `\n${indentCode(componentCode, 4)}\n`;
    });
    code += `}\n`;
  
    return code;
  };
  
  // Helper functions to generate code for each component type
  const generateVariableCode = (data: StateVariableComponentData): string => {
    const visibility = data.visibility || 'public';
    const mutability = data.mutability === 'immutable' || data.mutability === 'constant' ? data.mutability : '';
    const initialValue = data.initialValue ? ` = ${data.initialValue}` : '';
    return `${visibility} ${mutability} ${data.dataType} ${data.name}${initialValue};`;
  };
  
  const generateFunctionCode = (data: FunctionComponentData): string => {
    const visibility = data.visibility || 'public';
    const stateMutability = data.stateMutability || '';
    const parameters = data.parameters
      .map((param) => `${param.type} ${param.name}`)
      .join(', ');
    const returnParameters = data.returnParameters && data.returnParameters.length > 0
      ? ` returns (${data.returnParameters.map((param) => `${param.type} ${param.name}`).join(', ')})`
      : '';
    const body = data.body?.content || '';
    return `function ${data.name}(${parameters}) ${visibility} ${stateMutability}${returnParameters} {\n${indentCode(body, 4)}\n}`;
  };
  
  const generateConstructorCode = (data: ConstructorComponentData): string => {
    const parameters = data.parameters
      .map((param) => `${param.type} ${param.name}`)
      .join(', ');
    const modifiers = data.modifiers?.join(' ') || '';
    const body = data.body?.content || '';
    return `constructor(${parameters}) ${modifiers} {\n${indentCode(body, 4)}\n}`;
  };
  
  const generateStructCode = (data: StructComponentData): string => {
    const members = data.members
      .map((member) => `    ${member.type} ${member.name};`)
      .join('\n');
    return `struct ${data.name} {\n${members}\n}`;
  };
  
  const generateEnumCode = (data: EnumComponentData): string => {
    const members = data.members.join(', ');
    return `enum ${data.name} { ${members} }`;
  };
  
  const generateModifierCode = (data: ModifierComponentData): string => {
    const parameters = data.parameters
      .map((param) => `${param.type} ${param.name}`)
      .join(', ');
    const body = data.body?.content || '';
    return `modifier ${data.name}(${parameters}) {\n${indentCode(body, 4)}\n}`;
  };
  
  const generateEventCode = (data: EventComponentData): string => {
    const parameters = data.parameters
      .map((param) => `${param.type} ${param.name}`)
      .join(', ');
    return `event ${data.name}(${parameters});`;
  };
  
  const generateErrorCode = (data: ErrorComponentData): string => {
    const parameters = data.parameters
      .map((param) => `${param.type} ${param.name}`)
      .join(', ');
    return `error ${data.name}(${parameters});`;
  };
  
  // Utility function to indent code
  const indentCode = (code: string, spaces: number): string => {
    const indentation = ' '.repeat(spaces);
    return code
      .split('\n')
      .map((line) => (line.trim() ? `${indentation}${line}` : line))
      .join('\n');
  };
  