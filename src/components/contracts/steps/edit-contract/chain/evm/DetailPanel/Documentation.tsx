// components/contracts/steps/edit-contract/chain/evm/DetailPanel/Documentation.tsx
import React from 'react';
import { DraggableComponentData } from '@/types/evm/contractTypes';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from "@/components/ui/alert";

import { 
 
  BookOpen, 
  Code, 
  Shield, 
  Lightbulb,
  AlertCircle
} from 'lucide-react';

interface DocumentationPanelProps {
  data: DraggableComponentData;
}

export const DocumentationPanel: React.FC<DocumentationPanelProps> = ({ data }) => {
 

  const getSecurityTips = (data: DraggableComponentData): string[] => {
    switch (data.type) {
      case 'constructor':
        return [
          'Validate all constructor parameters',
          'Set critical initial values',
          'Consider using immutable variables for gas optimization',
          'Avoid complex logic in constructor'
        ];
      case 'function':
        return [
          'Implement proper access control',
          'Check for integer overflow/underflow',
          'Use ReentrancyGuard for external calls',
          'Validate all parameters',
          'Consider gas optimization'
        ];
      case 'event':
        return [
          'Index important parameters for efficient filtering',
          'Avoid storing sensitive information',
          'Use events for state change notifications',
          'Keep event parameters minimal'
        ];
      case 'modifier':
        return [
          'Use the check-effects-interaction pattern',
          'Keep modifiers simple and focused',
          'Remember to include the underscore (_)',
          'Avoid complex logic in modifiers'
        ];
      case 'variable':
        return [
          'Choose appropriate visibility',
          'Consider using immutable for constants',
          'Be careful with public variables',
          'Use appropriate data types'
        ];
      case 'mapping':
        return [
          'Initialize values properly',
          'Consider using EnumerableMap when needed',
          'Be careful with nested mappings',
          'Check for existing entries'
        ];
      default:
        return ['Follow Solidity best practices', 'Implement proper validation'];
    }
  };

  const getUsageExample = (data: DraggableComponentData): string => {
    switch (data.type) {
      case 'constructor':
        return `constructor(string memory name_, uint256 initialSupply_) {
    name = name_;
    totalSupply = initialSupply_;
}`;
      case 'function':
        return `function ${data.name}(${(data as any).parameters?.map((p: any) => 
          `${p.type} ${p.name}`).join(', ') || ''}) 
    ${(data as any).visibility} 
    ${(data as any).stateMutability} 
    returns (${(data as any).returnParameters?.map((p: any) => p.type).join(', ') || ''}) {
    // Function implementation
}`;
      case 'event':
        return `event ${data.name}(
    ${(data as any).parameters?.map((p: any) => 
      `${p.type} ${p.indexed ? 'indexed ' : ''}${p.name}`
    ).join(',\n    ') || ''}
);`;
      case 'modifier':
        return `modifier ${data.name}(${(data as any).parameters?.map((p: any) => 
          `${p.type} ${p.name}`).join(', ') || ''}) {
    // Modifier checks
    _;
}`;
      case 'error':
        return `error ${data.name}(${(data as any).parameters?.map((p: any) => 
          `${p.type} ${p.name}`).join(', ') || ''});`;
      case 'struct':
        return `struct ${data.name} {
    ${(data as any).members?.map((m: any) => 
      `${m.type} ${m.name};`
    ).join('\n    ') || ''}
}`;
      case 'enum':
        return `enum ${data.name} {
    ${(data as any).members?.join(',\n    ') || ''}
}`;
      case 'mapping':
        return `mapping(${(data as any).keyType} => ${(data as any).valueType}) ${(data as any).visibility} ${data.name};`;
      case 'array':
        return `${(data as any).dataType}[] ${(data as any).visibility} ${data.name};`;
      default:
        return '// Implementation example';
    }
  };

  return (
      <div className="space-y-6 p-4">
        
       

        {/* Documentation */}
        {data.documentation && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="text-sm font-semibold">Documentation</h2>
            </div>
            <p className="text-sm whitespace-pre-wrap">{data.documentation}</p>
          </div>
        )}


        {/* Usage Example */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            <h2 className="text-sm font-semibold">Usage Example</h2>
          </div>
          <Card className="bg-card/50">
            <pre className="p-4 text-sm overflow-x-auto">
              <code className="text-primary text-xs">{getUsageExample(data)}</code>
            </pre>
          </Card>
        </div>

      
      {/* Security Tips */}
      <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-sm font-semibold">Security Considerations</h2>
          </div>
          <Card className="p-4 bg-card/50">
            <ul className="space-y-2">
              {getSecurityTips(data).map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Best Practices */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <h2 className="text-sm font-semibold">Tips & Best Practices</h2>
          </div>
          <Alert>
            <AlertDescription className="text-sm">
              <ul className="list-disc list-inside space-y-1">
                <li>Follow consistent naming conventions</li>
                <li>Add comprehensive documentation</li>
                <li>Consider gas optimization</li>
                <li>Implement proper error handling</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </div>

  );
};