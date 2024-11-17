// components/contracts/steps/edit-contract/chain/evm/DetailPanel/BasicComponents/ModifierDetail.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DetailComponentProps } from '@/components/contracts/steps/edit-contract/chain/evm/DetailPanel/shared/DetailComponentProps';
import { ModifierComponentData, BasicDataType, FunctionParameter } from '@/types/evm/contractTypes';
import { nanoid } from 'nanoid';
import { Card } from '@/components/ui/card';

const basicDataTypes: BasicDataType[] = [
  'address', 'bool', 'string', 'bytes',
  'uint256', 'uint128', 'uint64', 'uint32',
  'int256', 'int128', 'int64', 'int32',
  'bytes32', 'bytes4'
];

export const ModifierDetail: React.FC<DetailComponentProps> = ({ data, onChange }) => {
  const modifierData = data as ModifierComponentData;

  const handleChange = (field: keyof ModifierComponentData, value: any) => {
    onChange({ [field]: value });
  };

  const handleAddParameter = () => {
    const newParam: FunctionParameter = { 
      id: nanoid(), 
      name: '', 
      type: 'address' 
    };
    handleChange('parameters', [...(modifierData.parameters || []), newParam]);
  };

  const handleParameterChange = (index: number, field: keyof FunctionParameter, value: string) => {
    const updatedParams = [...(modifierData.parameters || [])];
    updatedParams[index] = { ...updatedParams[index], [field]: value };
    handleChange('parameters', updatedParams);
  };

  const handleRemoveParameter = (index: number) => {
    const updatedParams = (modifierData.parameters || []).filter((_, i) => i !== index);
    handleChange('parameters', updatedParams);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Name</label>
        <Input
          value={modifierData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="onlyOwner"
          className="font-mono"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Parameters</label>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddParameter}
            className="h-8"
          >
            <Plus className="h-4 w-4 mr-2" /> Add
          </Button>
        </div>

        <div className="space-y-2">
          {(modifierData.parameters || []).map((param, index) => (
            <div key={param.id} className="flex items-center gap-2">
              <Input
                placeholder="parameterName"
                value={param.name}
                onChange={(e) => handleParameterChange(index, 'name', e.target.value)}
                className="font-mono"
              />
              <Select
                value={param.type}
                onValueChange={(value) => handleParameterChange(index, 'type', value)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {basicDataTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleRemoveParameter(index)}
                className="h-8 w-8"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Implementation</label>
        <Textarea
          placeholder="require(msg.sender == owner, 'Not owner');
_;"
          value={modifierData.body?.content || ''}
          onChange={(e) => handleChange('body', { content: e.target.value })}
          className="min-h-[120px] font-mono"
        />
      </div>

      <Card className="p-4 bg-muted/50">
        <p className="text-sm text-muted-foreground">
          💡 Modifiers are used to add pre-conditions to functions. Remember to include the 
          underscore (_) to indicate where the modified function's code should be inserted.
        </p>
      </Card>
    </div>
  );
};