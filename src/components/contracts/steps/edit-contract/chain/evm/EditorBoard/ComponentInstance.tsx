// components/contracts/steps/edit-contract/chain/evm/EditorBoard/ComponentInstance.tsx

import React, {useState} from 'react';
import { useDraggable } from '@dnd-kit/core';
import { DraggableComponent } from '@/types/evm/contractTypes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'lucide-react';
import { Code, Wrench, Radio, Database, Box, ListOrdered, Shield, Component } from 'lucide-react';
import { ChevronDown,Trash2, ChevronUp } from 'lucide-react';
import { isFunctionComponentData, isStateVariableComponentData, 
        isEventComponentData, isArrayComponentData, isConstructorComponentData, 
        isEnumComponentData, isErrorComponentData, isModifierComponentData, isStructComponentData,
        isExternalCallComponentData, isIntegrationComponentData, isMappingComponentData, isOracleIntegrationComponentData, isSecurityComponentData } from '@/types/evm/contractTypes';
import { DataType } from '@/types/evm/contractTypes';
import { BasicDataType } from '@/types/evm/contractTypes';

interface Props {
  component: DraggableComponent;
  isSelected: boolean;
  isConnecting: boolean;
  isConnectionStart: boolean;
  onClick: () => void;
  expandedComponentId: string | null;
  onExpand: (id: string | null) => void; 
 
  gridSize?: number;
}

export const ComponentInstance: React.FC<Props> = ({
  component,
  isSelected,
  isConnecting,
  isConnectionStart,
  expandedComponentId,
  onExpand,
  onClick,
}) => {
  const isExpanded = expandedComponentId === component.id;
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: component.id,
    data: {
      type: 'existing-component',
      payload: {
        id: component.id,
        componentType: component.type,
      },
    },
  });


  const getComponentStyles = () => {
    switch (component.type) {
      case 'function':
        return {
          borderColor: 'border-blue-500',
          bgColor: 'bg-blue-50',
          iconColor: 'text-blue-500',
        };
      case 'event':
        return {
          borderColor: 'border-green-500',
          bgColor: 'bg-green-50',
          iconColor: 'text-green-500',
        };
      case 'variable':
        return {
          borderColor: 'border-purple-500',
          bgColor: 'bg-purple-50',
          iconColor: 'text-purple-500',
        };
      case 'struct':
        return {
          borderColor: 'border-yellow-500',
          bgColor: 'bg-yellow-50',
          iconColor: 'text-yellow-500',
        };
      case 'enum':
        return {
          borderColor: 'border-red-500',
          bgColor: 'bg-red-50',
          iconColor: 'text-red-500',
        };
      case 'modifier':
        return {
          borderColor: 'border-indigo-500',
          bgColor: 'bg-indigo-50',
          iconColor: 'text-indigo-500',
        };
      case 'error':
        return {
          borderColor: 'border-red-500',
          bgColor: 'bg-red-50',
          iconColor: 'text-red-500',
        };
      case 'array':
        return {
          borderColor: 'border-purple-500',
          bgColor: 'bg-purple-50',
          iconColor: 'text-purple-500',
        };
      case 'mapping':
        return {
          borderColor: 'border-yellow-500',
          bgColor: 'bg-yellow-50',
          iconColor: 'text-yellow-500',
        };
      case 'security':
        return {
          borderColor: 'border-indigo-500',
          bgColor: 'bg-indigo-50',
          iconColor: 'text-indigo-500',
        };
      case 'oracle':
        return {
          borderColor: 'border-blue-500',
          bgColor: 'bg-blue-50',
          iconColor: 'text-blue-500',
        };
      case 'integration':
        return {
          borderColor: 'border-gray-500',
          bgColor: 'bg-gray-50',
          iconColor: 'text-gray-500',
        };
      default:
        return {
          borderColor: 'border-gray-500',
          bgColor: 'bg-gray-50',
          iconColor: 'text-gray-500',
        };
    }
  };

 

  const getComponentIcon = () => {
    switch (component.type) {
      case 'function':
        return <Code className="h-4 w-4" />;
      case 'constructor':
        return <Box className="h-4 w-4" />;
      case 'event':
        return <Box className="h-4 w-4" />;
      case 'variable':
        return <Database className="h-4 w-4" />;
      case 'struct':
        return <Box className="h-4 w-4" />;
      case 'enum':
        return <ListOrdered className="h-4 w-4" />;
      case 'modifier':
        return <Box className="h-4 w-4" />;
      case 'error':
        return <Box className="h-4 w-4" />;
      case 'array':
        return <Component className="h-4 w-4" />;
      case 'mapping':
        return <Component className="h-4 w-4" />;
      case 'security':
        return <Component className="h-4 w-4" />;
      case 'oracle':
        return <Component className="h-4 w-4" />;
      case 'integration':
        return <Component className="h-4 w-4" />;
      default:
        return <Component className="h-4 w-4" />;
    }
  };

  const getExpandedContent = () => {
    // Function Components
    if (isFunctionComponentData(component.data)) {
      return (
        <div className="space-y-3">
          {/* Parameters */}
          {component.data.parameters.length > 0 && (
            <div>
              <div className="text-xs font-medium mb-1">Input Parameters</div>
              <div className="space-y-1">
                {component.data.parameters.map((param) => (
                  <div key={param.id} className="flex items-center justify-between text-xs bg-white/50 p-1 rounded">
                    <div className="flex items-center gap-2">
                      <span>{param.name}</span>
                      <Badge variant="secondary" className="text-[10px]">{param.type}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
    
          {/* Return Parameters */}
          {component.data.returnParameters.length > 0 && (
            <div>
              <div className="text-xs font-medium mb-1">Return Values</div>
              <div className="space-y-1">
                {component.data.returnParameters.map((param) => (
                  <div key={param.id} className="flex items-center justify-between text-xs bg-white/50 p-1 rounded">
                    <span>{param.name || 'unnamed'}</span>
                    <Badge variant="secondary" className="text-[10px]">{param.type}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
    
          {/* Function Details */}
          <div>
            <div className="text-xs font-medium mb-1">Function Details</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs bg-white/50 p-1 rounded">
                <span className="font-medium">Visibility:</span>
                <Badge variant="secondary" className="text-[10px] capitalize">{component.data.visibility}</Badge>
              </div>
              <div className="flex items-center gap-2 text-xs bg-white/50 p-1 rounded">
                <span className="font-medium">State Mutability:</span>
                <Badge variant="secondary" className="text-[10px] capitalize">{component.data.stateMutability}</Badge>
              </div>
            </div>
          </div>
    
          
          {/* Modifiers */}
          {component.data.modifiers && component.data.modifiers.length > 0 && (
            <div>
              <div className="text-xs font-medium mb-1">Modifiers</div>
              <div className="flex flex-wrap gap-1">
                {component.data.modifiers.map((modifier, index) => (
                  <Badge key={index} variant="outline" className="text-[10px]">
                    {typeof modifier === 'string' ? modifier : modifier.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
  
    // State Variables
    if (isStateVariableComponentData(component.data)) {
      return (
        <div className="space-y-3">
          {/* Variable Details */}
          <div>
            <div className="text-xs font-medium mb-1">Variable Details</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs bg-white/50 p-1 rounded">
                <span className="font-medium">Type:</span>
                <Badge variant="secondary" className="text-[10px]">
                  {typeof component.data.dataType === 'string' ? component.data.dataType : 'Complex Type'}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs bg-white/50 p-1 rounded">
                <span className="font-medium">Visibility:</span>
                <Badge variant="secondary" className="text-[10px] capitalize">{component.data.visibility}</Badge>
              </div>
              <div className="flex items-center gap-2 text-xs bg-white/50 p-1 rounded">
                <span className="font-medium">Mutability:</span>
                <Badge variant="secondary" className="text-[10px] capitalize">{component.data.mutability}</Badge>
              </div>
            </div>
          </div>
  
          {/* Initial Value */}
          {component.data.initialValue && (
            <div>
              <div className="text-xs font-medium mb-1">Initial Value</div>
              <code className="text-xs bg-white/50 p-1 rounded block">
                {component.data.initialValue}
              </code>
            </div>
          )}
        </div>
      );
    }
  
    // Events
    if (isEventComponentData(component.data)) {
      return (
        <div className="space-y-3">
          <div>
            <div className="text-xs font-medium mb-1">Event Parameters</div>
            <div className="space-y-1">
              {component.data.parameters.map((param) => (
                <div key={param.id} className="flex items-center justify-between text-xs bg-white/50 p-1 rounded">
                  <div className="flex items-center gap-2">
                    <span>{param.name}</span>
                    <Badge variant="secondary" className="text-[10px]">{param.type}</Badge>
                  </div>
                  {param.indexed && (
                    <Badge variant="outline" className="text-[10px]">indexed</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
  
          {/* Event Analytics */}
          <div>
            <div className="text-xs font-medium mb-1">Event Analytics</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs bg-white/50 p-1 rounded">
                <span className="font-medium">Indexed Parameters:</span>
                <Badge variant="secondary" className="text-[10px]">
                  {component.data.parameters.filter(p => p.indexed).length}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      );
    }
  
    // Constructor
    if (isConstructorComponentData(component.data)) {
      return (
        <div className="space-y-3">
          {/* Parameters */}
          {component.data.parameters.length > 0 && (
            <div>
              <div className="text-xs font-medium mb-1">Constructor Parameters</div>
              <div className="space-y-1">
                {component.data.parameters.map((param) => (
                  <div key={param.id} className="flex items-center justify-between text-xs bg-white/50 p-1 rounded">
                    <span>{param.name}</span>
                    <Badge variant="secondary" className="text-[10px]">{param.type}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
  
         
  
          {/* Implementation Status */}
          <div>
            <div className="text-xs font-medium mb-1">Implementation Status</div>
            <div className="flex items-center gap-2 text-xs bg-white/50 p-1 rounded">
              <span className="font-medium">Status:</span>
              <Badge 
                variant="secondary" 
                className="text-[10px]"
              >
                {component.data.body?.content ? 'Implemented' : 'Not Implemented'}
              </Badge>
            </div>
          </div>
        </div>
      );
    }
  
      // Modifier
  if (isModifierComponentData(component.data)) {
    return (
      <div className="space-y-3">
        {/* Parameters */}
        {component.data.parameters.length > 0 && (
          <div>
            <div className="text-xs font-medium mb-1">Modifier Parameters</div>
            <div className="space-y-1">
              {component.data.parameters.map((param) => (
                <div key={param.id} className="flex items-center justify-between text-xs bg-white/50 p-1 rounded">
                  <span>{param.name}</span>
                  <Badge variant="secondary" className="text-[10px]">{param.type}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Implementation Status */}
        <div>
          <div className="text-xs font-medium mb-1">Implementation Details</div>
          <div className="flex items-center gap-2 text-xs bg-white/50 p-1 rounded">
            <span className="font-medium">Status:</span>
            <Badge 
              variant="secondary" 
              className={cn(
                "text-[10px]",
                component.data.body?.content ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
              )}
            >
              {component.data.body?.content ? 'Logic Implemented' : 'No Logic'}
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  // Struct
  if (isStructComponentData(component.data)) {
    return (
      <div className="space-y-3">
        {/* Members */}
        <div>
          <div className="text-xs font-medium mb-1">Struct Members</div>
          <div className="space-y-1">
            {component.data.members.map((member) => (
              <div key={member.id} className="flex items-center justify-between text-xs bg-white/50 p-1 rounded">
                <div className="flex items-center gap-2">
                  <span>{member.name}</span>
                  <Badge variant="secondary" className="text-[10px]">
                    {getDataTypeString(member.type)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* Analytics */}
        <div>
          <div className="text-xs font-medium mb-1">Struct Analytics</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs bg-white/50 p-1 rounded">
              <span className="font-medium">Total Members:</span>
              <Badge variant="secondary" className="text-[10px]">
                {component.data.members.length}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs bg-white/50 p-1 rounded">
              <span className="font-medium">Memory Layout:</span>
              <Badge variant="secondary" className="text-[10px]">
                Packed
              </Badge>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enum
  if (isEnumComponentData(component.data)) {
    return (
      <div className="space-y-3">
        {/* Values */}
        <div>
          <div className="text-xs font-medium mb-1">Enum Values</div>
          <div className="space-y-1">
            {component.data.members.map((member, index) => (
              <div key={index} className="flex items-center justify-between text-xs bg-white/50 p-1 rounded">
                <span>{member}</span>
                <Badge variant="secondary" className="text-[10px]">{index}</Badge>
              </div>
            ))}
          </div>
        </div>
  
        {/* Analytics */}
        <div>
          <div className="text-xs font-medium mb-1">Enum Details</div>
          <div className="flex items-center gap-2 text-xs bg-white/50 p-1 rounded">
            <span className="font-medium">Total Values:</span>
            <Badge variant="secondary" className="text-[10px]">
              {component.data.members.length}
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  // Mapping
  if (isMappingComponentData(component.data)) {
    return (
      <div className="space-y-3">
        {/* Mapping Details */}
        <div>
          <div className="text-xs font-medium mb-1">Mapping Structure</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs bg-white/50 p-1 rounded">
              <span className="font-medium">Key Type:</span>
              <Badge variant="secondary" className="text-[10px]">{component.data.keyType}</Badge>
            </div>
            <div className="flex items-center gap-2 text-xs bg-white/50 p-1 rounded">
              <span className="font-medium">Value Type:</span>
              <Badge variant="secondary" className="text-[10px]">
                {typeof component.data.valueType === 'string' ? component.data.valueType : 'Complex Type'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Access Details */}
        <div>
          <div className="text-xs font-medium mb-1">Access Details</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs bg-white/50 p-1 rounded">
              <span className="font-medium">Visibility:</span>
              <Badge variant="secondary" className="text-[10px] capitalize">{component.data.visibility}</Badge>
            </div>
            <div className="flex items-center gap-2 text-xs bg-white/50 p-1 rounded">
              <span className="font-medium">Storage:</span>
              <Badge variant="secondary" className="text-[10px]">Dynamic</Badge>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Array
  if (isArrayComponentData(component.data)) {
    return (
      <div className="space-y-3">
        {/* Array Details */}
        <div>
          <div className="text-xs font-medium mb-1">Array Structure</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs bg-white/50 p-1 rounded">
              <span className="font-medium">Element Type:</span>
              <Badge variant="secondary" className="text-[10px]">
                {typeof component.data.dataType === 'string' ? component.data.dataType : 'Complex Type'}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs bg-white/50 p-1 rounded">
              <span className="font-medium">Array Type:</span>
              <Badge variant="secondary" className="text-[10px]">
                {component.data.length !== undefined ? 'Fixed Size' : 'Dynamic'}
              </Badge>
            </div>
            {component.data.length !== undefined && (
              <div className="flex items-center gap-2 text-xs bg-white/50 p-1 rounded">
                <span className="font-medium">Length:</span>
                <Badge variant="secondary" className="text-[10px]">{component.data.length}</Badge>
              </div>
            )}
          </div>
        </div>

        {/* Access Details */}
        <div>
          <div className="text-xs font-medium mb-1">Access Details</div>
          <div className="flex items-center gap-2 text-xs bg-white/50 p-1 rounded">
            <span className="font-medium">Visibility:</span>
            <Badge variant="secondary" className="text-[10px] capitalize">{component.data.visibility}</Badge>
          </div>
        </div>
      </div>
    );
  }

  // Oracle Integration
  if (isOracleIntegrationComponentData(component.data)) {
    return (
      <div className="space-y-3">
        <div>
          <div className="text-xs font-medium mb-1">Oracle Configuration</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs bg-white/50 p-1 rounded">
              <span className="font-medium">Provider:</span>
              <Badge variant="secondary" className="text-[10px] capitalize">{component.data.provider}</Badge>
            </div>
            <div className="flex items-center gap-2 text-xs bg-white/50 p-1 rounded">
              <span className="font-medium">Endpoint:</span>
              <code className="text-xs">{component.data.endpoint || 'Not Set'}</code>
            </div>
          </div>
        </div>
  
        {component.data.parameters && component.data.parameters.length > 0 && (
          <div>
            <div className="text-xs font-medium mb-1">Oracle Parameters</div>
            <div className="space-y-1">
              {component.data.parameters.map((param) => (
                <div key={param.id} className="flex items-center gap-2 text-xs bg-white/50 p-1 rounded">
                  <span>{param.name}</span>
                  <Badge variant="secondary" className="text-[10px]">{param.type}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Security Feature
  if (isSecurityComponentData(component.data)) {
    return (
      <div className="space-y-3">
        {/* Security Details */}
        <div>
          <div className="text-xs font-medium mb-1">Security Configuration</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs bg-white/50 p-1 rounded">
              <span className="font-medium">Feature Type:</span>
              <Badge variant="secondary" className="text-[10px] capitalize">{component.data.featureType}</Badge>
            </div>
            <div className="flex items-center gap-2 text-xs bg-white/50 p-1 rounded">
              <span className="font-medium">Implementation:</span>
              <Badge 
                variant="secondary" 
                className={cn(
                  "text-[10px]",
                  component.data.implementation ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                )}
              >
                {component.data.implementation ? 'Implemented' : 'Not Implemented'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Requirements */}
        {component.data.requirements && component.data.requirements.length > 0 && (
          <div>
            <div className="text-xs font-medium mb-1">Security Requirements</div>
            <div className="space-y-1">
              {component.data.requirements.map((req, index) => (
                <div key={index} className="text-xs bg-white/50 p-1 rounded">
                  {req}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

 
  const getComponentSummary = () => {
    // Function Components
    if (isFunctionComponentData(component.data)) {
      return (
        <div className="flex gap-2 items-center">
          <Badge variant="outline" className="capitalize">
            {component.data.visibility}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {component.data.stateMutability}
          </Badge>
          
        </div>
      );
    }
  
    // State Variables
    if (isStateVariableComponentData(component.data)) {
      return (
        <div className="flex gap-2 items-center text-xs">
          <Badge variant="outline">
            {typeof component.data.dataType === 'string'
              ? component.data.dataType
              : 'complex'}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {component.data.visibility}
          </Badge>
          
        </div>
      );
    }
  
    // Events
    if (isEventComponentData(component.data)) {
      return (
        <div className="flex gap-2 items-center text-xs">
          <Badge variant="outline">
            {component.data.parameters.length} params
          </Badge>
          {component.data.parameters.some(p => p.indexed) && (
            <Badge variant="secondary">indexed</Badge>
          )}
        </div>
      );
    }
  
    // Constructor
    if (isConstructorComponentData(component.data)) {
      return (
        <div className="flex gap-2 items-center text-xs">
          {component.data.parameters.length > 0 && (
            <Badge variant="outline">
              {component.data.parameters.length} params
            </Badge>
          )}
          {component.data.modifiers && component.data.modifiers.length > 0 && (
            <Badge variant="secondary">
              {component.data.modifiers.length} modifiers
            </Badge>
          )}
        </div>
      );
    }
  
    // Modifier
    if (isModifierComponentData(component.data)) {
      return (
        <div className="flex gap-2 items-center text-xs">
          {component.data.parameters.length > 0 && (
            <Badge variant="outline">
              {component.data.parameters.length} params
            </Badge>
          )}
          {component.data.body?.content && (
            <Badge variant="secondary">Has Logic</Badge>
          )}
        </div>
      );
    }
  
    // Struct
    if (isStructComponentData(component.data)) {
      return (
        <div className="flex gap-2 items-center text-xs">
          <Badge variant="outline">
            {component.data.members.length} fields
          </Badge>
        </div>
      );
    }
  
    // Enum
    if (isEnumComponentData(component.data)) {
      return (
        <div className="flex gap-2 items-center text-xs">
          <Badge variant="outline">
            {component.data.members.length} values
          </Badge>
        </div>
      );
    }
  
    // Array
    if (isArrayComponentData(component.data)) {
      return (
        <div className="flex gap-2 items-center text-xs">
          <Badge variant="outline">
            {getDataTypeString(component.data.dataType)}
          </Badge>
          {component.data.length !== undefined && (
            <Badge variant="secondary">
              Fixed: {component.data.length}
            </Badge>
          )}
        </div>
      );
    }
  
    // Mapping
    if (isMappingComponentData(component.data)) {
      return (
        <div className="flex gap-2 items-center text-xs">
          <Badge variant="outline">
            {`${component.data.keyType} ➔ ${
              typeof component.data.valueType === 'string' 
                ? component.data.valueType 
                : 'Complex Type'
            }`}
          </Badge>
        </div>
      );
    }
  
    // Error
    if (isErrorComponentData(component.data)) {
      return (
        <div className="flex gap-2 items-center text-xs">
          {component.data.parameters.length > 0 && (
            <Badge variant="outline">
              {component.data.parameters.length} params
            </Badge>
          )}
        </div>
      );
    }
  
    // Oracle Integration
    if (isOracleIntegrationComponentData(component.data)) {
      return (
        <div className="flex gap-2 items-center text-xs">
          <Badge variant="outline" className="capitalize">
            {component.data.provider}
          </Badge>
          {component.data.endpoint && (
            <Badge variant="secondary">Connected</Badge>
          )}
        </div>
      );
    }
  
    // External Call
    if (isExternalCallComponentData(component.data)) {
      return (
        <div className="flex gap-2 items-center text-xs">
          <Badge variant="outline">
            {component.data.target ? 'Target Set' : 'No Target'}
          </Badge>
          {component.data.parameters.length > 0 && (
            <Badge variant="secondary">
              {component.data.parameters.length} params
            </Badge>
          )}
        </div>
      );
    }
  
    // Security Feature
    if (isSecurityComponentData(component.data)) {
      return (
        <div className="flex gap-2 items-center text-xs">
          <Badge variant="outline" className="capitalize">
            {component.data.featureType}
          </Badge>
          {component.data.implementation && (
            <Badge variant="secondary">Implemented</Badge>
          )}
        </div>
      );
    }
  
    // Integration
    if (isIntegrationComponentData(component.data)) {
      return (
        <div className="flex gap-2 items-center text-xs">
          <Badge variant="outline">
            {component.data.standard}
          </Badge>
          {component.data.features.length > 0 && (
            <Badge variant="secondary">
              {component.data.features.length} features
            </Badge>
          )}
        </div>
      );
    }
  
    return null;
  };

// Position styles helper'ı ekleyelim
const getPositionStyles = (isDragging: boolean): React.CSSProperties => ({
  cursor: isDragging ? 'grabbing' : 'grab',
  transform: isDragging ? 'scale(1.05)' : undefined,
  transition: isDragging ? 'none' : 'all 0.2s ease',
  opacity: isDragging ? 0.3 : 1,
  zIndex: isDragging ? 1000 : 1,
  pointerEvents: isDragging ? 'none' : 'auto',
  touchAction: 'none',
});



const getDataTypeString = (dataType: DataType | BasicDataType | string): string => {
  if (typeof dataType === 'string') {
    return dataType;
  }
  
  if ('type' in dataType) {
    switch (dataType.type) {
      case 'array':
        return `${getDataTypeString(dataType.baseType)}[]${
          dataType.length !== undefined ? `[${dataType.length}]` : ''
        }`;
      case 'mapping':
        return `mapping(${dataType.keyType} => ${getDataTypeString(dataType.valueType)})`;
      case 'struct':
        return 'struct';
      case 'enum':
        return 'enum';
      default:
        return 'Complex Type';
    }
  }

  return String(dataType);
};

{/* Expanded Content */}
{isExpanded && (
  <div className="p-3 space-y-3 overflow-x-hidden">
    {/* Documentation */}
    {component.data.documentation && (
      <div className="text-xs text-muted-foreground">
        {component.data.documentation}
      </div>
    )}

    {/* Component Specific Details */}
    {getExpandedContent()}

    {/* Implementation indicator */}
    {component.data.body?.content && (
      <div className="flex items-center gap-1 pt-2 mt-2 border-t text-xs text-muted-foreground">
        <Code className="h-3 w-3" />
        <span>Has implementation</span>
      </div>
    )}
  </div>
)}

  const style: React.CSSProperties = {
    position: 'absolute',
    left: component.position.x,
    top: component.position.y,
    cursor: isDragging ? 'grabbing' : 'grab',
    transform: isDragging ? 'scale(1.05)' : undefined,
    transition: isDragging ? 'none' : 'all 0.2s ease',
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 1000 : 1,
    pointerEvents: isDragging ? 'none' : 'auto',
    touchAction: 'none',
  };

  const getZIndex = () => {
    if (isDragging) return 2000;
    if (isExpanded) return 1500;
    if (isSelected) return 1000;
    if (expandedComponentId) return 10;
    return 100;
  };

  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isExpanded) {
      onExpand(null); 
    } else {
      onExpand(component.id);
    }
  };

  return (
    <>

    {expandedComponentId && !isExpanded && (
      <div
        className="absolute inset-0 bg-white/10 backdrop-blur-[1px] pointer-events-none transition-all duration-200"
        style={{
          zIndex: getZIndex(),
          opacity: expandedComponentId ? 1 : 0,
        }}
      />
    )}
        
        <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        'absolute rounded-lg shadow-lg border w-[200px]',
        !isExpanded && 'max-w-[200px]',
        getComponentStyles().borderColor,
        getComponentStyles().bgColor,
        'transition-all duration-200',
        isSelected && 'ring-2 ring-blue-500',
        isConnectionStart && 'ring-2 ring-green-500',
        isDragging && 'opacity-60 scale-105 rotate-2 shadow-xl',
        isExpanded && 'shadow-xl ring-2 ring-blue-500/50',
        expandedComponentId && !isExpanded && 'opacity-50'
      )}
      style={{
        position: 'absolute',
        left: component.position.x,
        top: component.position.y,
        zIndex: getZIndex(),
        ...getPositionStyles(isDragging),
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Header */}
      <div className="p-2 border-b bg-white/50 backdrop-blur-sm rounded-t-lg">
        <div className="flex items-center justify-between gap-2">
          
          {/* Left side */}
          <div className="flex items-start gap-2 flex-grow min-w-0">
            <div className={cn('p-1 rounded flex-shrink-0', getComponentStyles().iconColor)}>
              {getComponentIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-medium text-sm break-words line-clamp-2 text-left">
                {component.data.name}
              </span>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-1 ">
          <Button
            variant={isExpanded ? "default" : "ghost"}
            size="icon"
            className={cn(
              "h-5 w-5 rounded-sm",
              isExpanded && "bg-blue-500 text-white hover:bg-blue-600"
            )}
            onClick={handleExpand}
          >
            {isExpanded ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </Button>
          </div>
        </div>

        {/* Summary Row */}
        <div className="mt-1">
          {getComponentSummary()}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-3 space-y-3 overflow-x-hidden">
          {component.data.documentation && (
            <div className="text-xs text-muted-foreground">
              {component.data.documentation}
            </div>
          )}
          {getExpandedContent()}
        </div>
      )}
    </div>
    </>
  );
};
