// components/contracts/steps/edit-contract/chain/evm/DetailPanel/Functions/FunctionDetail.tsx
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Code,Settings, Box, Info } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { DetailComponentProps } from '../../shared/DetailComponentProps';
import { FunctionComponentData, BasicDataType, FunctionParameter } from '@/types/evm/contractTypes';
import { nanoid } from 'nanoid';
import { FunctionBody } from './FunctionBody';
import { ModifierSelector } from './ModifierSelector';
import { Tooltip,TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useProjectStore } from '@/stores/useProjectStore';

const basicDataTypes: BasicDataType[] = [
  'address', 'bool', 'string', 'bytes',
  'uint256', 'uint128', 'uint64', 'uint32',
  'int256', 'int128', 'int64', 'int32',
  'bytes32', 'bytes4'
];

export const FunctionDetail: React.FC<DetailComponentProps> = ({ data, onChange }) => {
  const currentContract = useProjectStore((state) => state.currentContract);

  const contractData = currentContract ? {
    events: currentContract.events.map(event => ({
      name: event.name,
      parameters: event.parameters.map(param => ({
        name: param.name,
        type: param.type,
        indexed: param.indexed
      }))
    })),
    stateVariables: currentContract.stateVariables.map(variable => ({
      name: variable.name,
      type: typeof variable.dataType === 'string' ? variable.dataType : 'unknown'
    })),
    modifiers: currentContract.modifiers.map(modifier => ({
      name: modifier.name,
      parameters: modifier.parameters?.map(param => ({
        name: param.name,
        type: param.type
      }))
    })),
    mappings: currentContract.mappings.map(mapping => ({
      name: mapping.name,
      keyType: mapping.keyType,
      valueType: typeof mapping.valueType === 'string' ? mapping.valueType : 'unknown'
    })),
    functions: currentContract.functions.map(func => ({
      name: func.name,
      parameters: func.parameters.map(param => ({
        name: param.name,
        type: param.type
      }))
    }))
  } : undefined;

  const functionData = {
    ...data as FunctionComponentData,
    parameters: (data as FunctionComponentData).parameters || [],
    returnParameters: (data as FunctionComponentData).returnParameters || [],
    modifiers: (data as FunctionComponentData).modifiers || []
  };

  const handleChange = (field: keyof FunctionComponentData, value: any) => {
    onChange({ [field]: value });
  };

  const handleAddParameter = (isReturn: boolean = false) => {
    const newParam: FunctionParameter = { 
      id: nanoid(), 
      name: '', 
      type: 'uint256' 
    };
    if (isReturn) {
      handleChange('returnParameters', [...(functionData.returnParameters || []), newParam]);
    } else {
      handleChange('parameters', [...(functionData.parameters || []), newParam]);
    }
  };

  const handleParameterChange = (
    index: number,
    field: keyof FunctionParameter,
    value: string,
    isReturn: boolean = false
  ) => {
    const parameterType = isReturn ? 'returnParameters' : 'parameters';
    const updatedParams = [...(functionData[parameterType] || [])];
    updatedParams[index] = {
      ...updatedParams[index],
      [field]: value
    };
    handleChange(parameterType, updatedParams);
  };
  
  const handleRemoveParameter = (index: number, isReturn: boolean = false) => {
    const parameterType = isReturn ? 'returnParameters' : 'parameters';
    const updatedParams = (functionData[parameterType] || []).filter((_, i) => i !== index);
    handleChange(parameterType, updatedParams);
  };

  const renderParameterInputs = (
    parameters: FunctionParameter[],
    isReturn: boolean = false
  ) => (
    <div className="space-y-2">
      {parameters.map((param, index) => (
        <div key={param.id} className="flex items-center gap-2">
          <Input
            placeholder={isReturn ? "Return name (optional)" : "Parameter name"}
            value={param.name}
            onChange={(e) => handleParameterChange(index, 'name', e.target.value, isReturn)}
            className="font-mono"
          />
          <Select
            value={param.type}
            onValueChange={(value) => handleParameterChange(index, 'type', value, isReturn)}
          >
            <SelectTrigger className="w-[140px] font-mono">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {basicDataTypes.map((type) => (
                <SelectItem key={type} value={type} className="font-mono">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => handleRemoveParameter(index, isReturn)}
            className="h-8 w-8"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => handleAddParameter(isReturn)}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" /> 
        Add {isReturn ? "Return" : "Parameter"}
      </Button>
    </div>
  );

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="grid grid-cols-2 w-full">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Overview
        </TabsTrigger>
        <TabsTrigger value="implementation" className="flex items-center gap-2">
          <Code className="h-4 w-4" />
          Implementation
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <div className="space-y-4">
        <div className="flex items-start gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={functionData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="transferTokens"
                className="font-mono"
              />
            </div>
            <div className="space-y-2 min-w-[150px]">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Virtual</label>
                <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">Make this function overrideable</p>
                  </TooltipContent>
                </Tooltip>
                </TooltipProvider>
              </div>
              <Switch
                checked={functionData.isVirtual}
                onCheckedChange={(checked) => handleChange('isVirtual', checked)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Visibility</label>
              <Select
                value={functionData.visibility}
                onValueChange={(value) => handleChange('visibility', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">public</SelectItem>
                  <SelectItem value="private">private</SelectItem>
                  <SelectItem value="internal">internal</SelectItem>
                  <SelectItem value="external">external</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">State Mutability</label>
              <Select
                value={functionData.stateMutability}
                onValueChange={(value) => handleChange('stateMutability', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select mutability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pure">pure</SelectItem>
                  <SelectItem value="view">view</SelectItem>
                  <SelectItem value="payable">payable</SelectItem>
                  <SelectItem value="nonpayable">nonpayable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>


          <h3 className="text-sm font-medium">Parameters</h3>
            {renderParameterInputs(functionData.parameters)}

          <h3 className="text-sm font-medium">Return Values</h3>
          {renderParameterInputs(functionData.returnParameters, true)}
        </div>
      </TabsContent>

      <TabsContent value="implementation" className="space-y-6">
        <div className="space-y-4 flex flex-col gap-6">
          
          <div>
            <h3 className="text-sm font-medium">Function Modifiers</h3>
            <ModifierSelector
              availableModifiers={[]}
              selectedModifiers={functionData.modifiers}
              onModifierChange={(modifiers) => handleChange('modifiers', modifiers)}
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Function Body</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Box className="h-4 w-4 mr-2" />
                    Visual Editor
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Visual Function Editor</DialogTitle>
                  </DialogHeader>
                  <div className="min-h-[500px] p-4">
                    <p className="text-muted-foreground">
                      Visual editor will be here asap..
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <FunctionBody
              body={functionData.body}
              onChange={(body) => handleChange('body', body)}
              contractData={contractData}
            />

          </div>

        </div>
      </TabsContent>

      
    </Tabs>
  );
};