/* // utils/solidity/contractGenerator.ts

import { EthereumContract } from '../../types/evm/contractTypes';
import { generateComponent } from './componentGenerator';

export class SolidityGenerator {
  private contract: EthereumContract;
  private indentLevel: number = 0;
  
  constructor(contract: EthereumContract) {
    this.contract = contract;
  }

  private indent(): string {
    return '    '.repeat(this.indentLevel);
  }

  private generatePragma(): string {
    return `// SPDX-License-Identifier: ${this.contract.license}\npragma solidity ${this.contract.version};\n`;
  }

  private generateImports(): string {
    const imports: string[] = [];
    
    // Inheritance imports
    if (this.contract.inherits?.length) {
      this.contract.inherits.forEach(inherit => {
        imports.push(`import "@openzeppelin/contracts/${inherit}.sol";`);
      });
    }

    // Using for directives
    if (this.contract.usingFor?.length) {
      this.contract.usingFor.forEach(lib => {
        imports.push(`import "@openzeppelin/contracts/utils/${lib.library}.sol";`);
      });
    }

    return imports.join('\n') + (imports.length ? '\n\n' : '');
  }

  private generateUsingFor(): string {
    if (!this.contract.usingFor?.length) return '';
    
    return this.contract.usingFor
      .map(lib => `using ${lib.library} for ${lib.type || '*'};`)
      .join('\n') + '\n\n';
  }

  private generateContractDeclaration(): string {
    const inheritance = this.contract.inherits?.length 
      ? ` is ${this.contract.inherits.join(', ')}` 
      : '';

    return `contract ${this.contract.name}${inheritance} {`;
  }

  public generate(): string {
    const sections: string[] = [
      this.generatePragma(),
      this.generateImports(),
      this.generateContractDeclaration()
    ];

    this.indentLevel++;

    // Generate all components
    const components = [
      // Enums
      ...this.contract.enums.map(e => generateComponent('enum', e)),
      
      // Structs
      ...this.contract.structs.map(s => generateComponent('struct', s)),
      
      // Events
      ...this.contract.events.map(e => generateComponent('event', e)),
      
      // Errors
      ...this.contract.errors.map(e => generateComponent('error', e)),
      
      // State Variables
      ...this.contract.stateVariables.map(v => generateComponent('variable', v)),
      
      // Modifiers
      ...this.contract.modifiers.map(m => generateComponent('modifier', m)),
      
      // Constructor
      this.contract.constructor && generateComponent('constructor', this.contract.constructor),
      
      // Functions
      ...this.contract.functions.map(f => generateComponent('function', f))
    ]
      .filter(Boolean)
      .map(component => this.indent() + component);

    sections.push(components.join('\n\n'));
    
    this.indentLevel--;
    sections.push('}');

    return sections.join('\n');
  }
}

/* 
Tam Contract Üretmi:

const generator = new SolidityGenerator(contractData);
const fullCode = generator.generate();
*/