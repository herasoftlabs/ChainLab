// components/contracts/steps/edit-contract/chain/evm/DetailPanel/BasicComponents/ErrorDetail.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DetailComponentProps } from '@/components/contracts/steps/edit-contract/chain/evm/DetailPanel/shared/DetailComponentProps';
import { ErrorComponentData, BasicDataType, FunctionParameter } from '@/types/evm/contractTypes';
import { nanoid } from 'nanoid';
import { Card } from '@/components/ui/card';

const basicDataTypes: BasicDataType[] = [
  'address', 'bool', 'string', 'bytes',
  'uint256', 'uint128', 'uint64', 'uint32',
  'int256', 'int128', 'int64', 'int32',
  'bytes32', 'bytes4'
];

export const ErrorDetail: React.FC<DetailComponentProps> = ({ data, onChange }) => {
  const errorData = data as ErrorComponentData;

  const handleChange = (field: keyof ErrorComponentData, value: any) => {
    onChange({ [field]: value });
  };

  const handleAddParameter = () => {
    const newParam: FunctionParameter = { 
      id: nanoid(), 
      name: '', 
      type: 'uint256' 
    };
    handleChange('parameters', [...(errorData.parameters || []), newParam]);
  };

  const handleParameterChange = (index: number, field: keyof FunctionParameter, value: string) => {
    const updatedParams = [...(errorData.parameters || [])];
    updatedParams[index] = { ...updatedParams[index], [field]: value };
    handleChange('parameters', updatedParams);
  };

  const handleRemoveParameter = (index: number) => {
    const updatedParams = (errorData.parameters || []).filter((_, i) => i !== index);
    handleChange('parameters', updatedParams);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Name</label>
        <Input
          value={errorData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="InsufficientBalance"
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
          {(errorData.parameters || []).map((param, index) => (
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

      

      <Card className="p-4 bg-muted/50">
        <p className="text-sm text-muted-foreground">
          💡 Custom errors are gas-efficient alternatives to require statements with strings. 
          They can include parameters to provide more context about the error condition.
        </p>
        <pre className="mt-2 text-xs text-muted-foreground">
          {`if (balance < amount) {
    revert InsufficientBalance(amount, balance);
}`}
        </pre>
      </Card>
    </div>
  );
};