import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DetailComponentProps } from '@/components/contracts/steps/edit-contract/chain/evm/DetailPanel/shared/DetailComponentProps';
import { 
  ErrorComponentData, 
  BasicDataType, 
  FunctionParameter 
} from '@/types/evm/contractTypes';
import { nanoid } from 'nanoid';

const basicDataTypes: BasicDataType[] = [
  'address', 'bool', 'string', 'bytes',
  'uint8', 'uint16', 'uint32', 'uint64', 'uint128', 'uint256',
  'int8', 'int16', 'int32', 'int64', 'int128', 'int256',
  'bytes1', 'bytes2', 'bytes3', 'bytes4', 'bytes8', 'bytes16', 'bytes32',
];

export const ErrorDetail: React.FC<DetailComponentProps> = ({ 
  data, 
  onChange 
}) => {
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

  const handleParameterChange = (
    index: number, 
    field: keyof FunctionParameter, 
    value: string
  ) => {
    const updatedParams = [...(errorData.parameters || [])];
    updatedParams[index] = { 
      ...updatedParams[index], 
      [field]: value 
    };
    handleChange('parameters', updatedParams);
  };

  const handleRemoveParameter = (index: number) => {
    const updatedParams = (errorData.parameters || []).filter((_, i) => i !== index);
    handleChange('parameters', updatedParams);
  };

  return (
    <div className="space-y-4">
      {/* Error Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Error Name</label>
        <Input
          value={errorData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Enter custom error name"
        />
      </div>

      {/* Error Parameters */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Error Parameters</label>
        <div className="space-y-2">
          {(errorData.parameters || []).map((param, index) => (
            <div 
              key={param.id} 
              className="flex items-center gap-2 bg-gray-50 p-2 rounded"
            >
              <Input
                placeholder="Parameter Name"
                value={param.name}
                onChange={(e) => handleParameterChange(index, 'name', e.target.value)}
                className="flex-1"
              />
              <Select
                value={param.type}
                onValueChange={(value) => handleParameterChange(index, 'type', value)}
              >
                <SelectTrigger className="w-[180px]">
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
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddParameter}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Parameter
          </Button>
        </div>
      </div>

      {/* Documentation */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Error Description</label>
        <Input
          value={errorData.documentation || ''}
          onChange={(e) => handleChange('documentation', e.target.value)}
          placeholder="Describe the purpose of this custom error"
        />
      </div>

      {/* Error Usage Hint */}
      <div className="text-sm text-gray-500 bg-gray-50 p-2 rounded">
        <p>💡 Tip: Custom errors provide more gas-efficient error handling in Solidity.</p>
        <p>Example: <code>{`error InsufficientBalance(uint required, uint available);`}</code></p>
        <p>Can be used like: <code>{`if (balance < amount) revert InsufficientBalance(amount, balance);`}</code></p>
      </div>

      {/* Error Example Preview */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Error Declaration Preview</label>
        <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
          {`error ${errorData.name || 'CustomError'}(${
            (errorData.parameters || [])
              .map(p => `${p.type} ${p.name}`)
              .join(', ')
          });`}
        </pre>
      </div>
    </div>
  );
};