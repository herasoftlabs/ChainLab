/* 
// utils/solidity/componentGenerator.ts

import { 
    ComponentType, 
    StateVariable, 
    Function, 
    Event, 
    CustomError,
    Modifier,
    Struct,
    Enum,
    DataType,
    CodeBlock,
    EventParameter
} from '../../types/evm/contractTypes';
  
export function generateComponent(type: ComponentType, component: any): string {
    switch (type) {
        case 'variable':
            return generateStateVariable(component as StateVariable);
        case 'function':
            return generateFunction(component as Function);
        case 'constructor': // Eklendi
            return generateConstructor(component as Function);
        case 'event':
            return generateEvent(component as Event);
        case 'error':
            return generateError(component as CustomError);
        case 'modifier':
            return generateModifier(component as Modifier);
        case 'struct':
            return generateStruct(component as Struct);
        case 'enum':
            return generateEnum(component as Enum);
        default:
            throw new Error(`Unknown component type: ${type}`);
    }
}
  
  function generateDataType(type: DataType): string {
    if (typeof type === 'string') return type;
    
    switch (type.type) {
      case 'array':
        return `${generateDataType(type.baseType)}${type.isFixed ? `[${type.length}]` : '[]'}`;
      case 'mapping':
        return `mapping(${generateDataType(type.keyType!)} => ${generateDataType(type.baseType)})`;
      case 'struct':
        return type.baseType as string;
      case 'enum':
        return type.baseType as string;
      default:
        throw new Error(`Unknown data type: ${type}`);
    }
  }
  
  function generateStateVariable(variable: StateVariable): string {
    const parts = [
      variable.visibility,
      variable.mutability !== 'mutable' ? variable.mutability : '',
      generateDataType(variable.dataType),
      variable.name
    ];
  
    if (variable.initialValue) {
      parts.push(`= ${variable.initialValue}`);
    }
  
    return parts.filter(Boolean).join(' ') + ';';
  }
  
  function generateFunction(func: Function): string {
    const params = func.parameters
      .map(p => `${generateDataType(p.type)} ${p.name}`)
      .join(', ');
  
    const returns = func.returnParameters.length
      ? ` returns (${func.returnParameters
          .map(p => `${generateDataType(p.type)}${p.name ? ' ' + p.name : ''}`)
          .join(', ')})`
      : '';
  
    const modifiers = func.modifiers?.length
      ? ' ' + func.modifiers.join(' ')
      : '';
  
    const header = `function ${func.name}(${params}) ${func.visibility} ${func.mutability}${returns}${modifiers}`;
  
    if (!func.body.length) return header + ';';
  
    return `${header} {\n${
      func.body.map(block => '    ' + generateCodeBlock(block)).join('\n')
    }\n}`;
  }

  // Constructor generator fonksiyonunu ekleyelim
function generateConstructor(constructor: Function): string {
    const params = constructor.parameters
        .map(p => `${generateDataType(p.type)} ${p.name}`)
        .join(', ');

    return `constructor(${params}) ${constructor.visibility} ${constructor.mutability} {\n${
        constructor.body.map(block => '    ' + generateCodeBlock(block)).join('\n')
    }\n}`;
}

  function generateEvent(event: Event): string {
    const parameters = event.parameters
        .map(p => generateEventParameter(p))
        .join(', ');

    return `event ${event.name}(${parameters});`;
   }

    function generateEventParameter(param: EventParameter): string {
        return `${generateDataType(param.type)}${param.indexed ? ' indexed' : ''} ${param.name}`;
    }

function generateError(error: CustomError): string {
    const parameters = error.parameters
        .map(p => `${generateDataType(p.type)} ${p.name}`)
        .join(', ');

    return `error ${error.name}(${parameters});`;
}

function generateModifier(modifier: Modifier): string {
    const params = modifier.parameters
        .map(p => `${generateDataType(p.type)} ${p.name}`)
        .join(', ');

    const header = `modifier ${modifier.name}(${params})`;

    return `${header} {\n${
        modifier.body.map(block => '    ' + generateCodeBlock(block)).join('\n')
    }\n}`;
}

function generateStruct(struct: Struct): string {
    const members = struct.members
        .map(m => `    ${generateDataType(m.type)} ${m.name};`)
        .join('\n');

    return `struct ${struct.name} {\n${members}\n}`;
}

function generateEnum(enum_: Enum): string {
    const values = enum_.values
        .map(v => `    ${v}`)
        .join(',\n');

    return `enum ${enum_.name} {\n${values}\n}`;
}
  

  
function generateCodeBlock(block: CodeBlock): string {
    let code = block.content;

    // Alt bloklar varsa onları da işle
    if (block.children?.length) {
        const childCode = block.children
            .map(child => '    ' + generateCodeBlock(child))
            .join('\n');

        switch (block.type) {
            case 'condition':
                code += ` {\n${childCode}\n}`;
                break;
            case 'loop':
                code += ` {\n${childCode}\n}`;
                break;
            case 'custom':
                code += `\n${childCode}`;
                break;
            default:
                code += childCode;
        }
    }

    return code;
}
 
  /* Tam Bileşen Üretimi:
  
  const functionCode = generateComponent('function', functionData);
  */

  // Örnek kullanımlar:

/*
// Event örneği
const eventData: Event = {
    id: "evt-1",
    type: "event",
    name: "Transfer",
    parameters: [
        { id: "p1", name: "from", type: "address", indexed: true },
        { id: "p2", name: "to", type: "address", indexed: true },
        { id: "p3", name: "value", type: "uint256", indexed: false }
    ]
};
const eventCode = generateComponent('event', eventData);
// Çıktı: event Transfer(address indexed from, address indexed to, uint256 value);

// Struct örneği
const structData: Struct = {
    id: "str-1",
    type: "struct",
    name: "User",
    members: [
        { name: "id", type: "uint256" },
        { name: "addr", type: "address" },
        { name: "active", type: "bool" }
    ]
};
const structCode = generateComponent('struct', structData);
// Çıktı:
// struct User {
//     uint256 id;
//     address addr;
//     bool active;
// }

// Function örneği
const functionData: Function = {
    id: "func-1",
    type: "function",
    name: "transfer",
    parameters: [
        { id: "p1", name: "to", type: "address" },
        { id: "p2", name: "amount", type: "uint256" }
    ],
    returnParameters: [],
    visibility: "public",
    mutability: "nonpayable",
    body: [
        {
            id: "b1",
            type: "condition",
            content: "if (amount > balance)",
            children: [
                {
                    id: "b2",
                    type: "revert",
                    content: "revert InsufficientBalance(amount, balance);"
                }
            ]
        }
    ]
};
const functionCode = generateComponent('function', functionData);
*/ 