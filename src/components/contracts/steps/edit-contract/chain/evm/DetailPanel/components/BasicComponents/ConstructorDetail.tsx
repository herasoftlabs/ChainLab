// components/contracts/steps/edit-contract/chain/evm/DetailPanel/BasicComponents/ConstructorDetail.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DetailComponentProps } from '@/components/contracts/steps/edit-contract/chain/evm/DetailPanel/shared/DetailComponentProps';
import { 
  ConstructorComponentData, 
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



export const ConstructorDetail: React.FC<DetailComponentProps> = ({ 
  data, 
  onChange 
}) => {
  const constructorData = data as ConstructorComponentData;

  const handleChange = (field: keyof ConstructorComponentData, value: any) => {
    onChange({ [field]: value });
  };

  const handleAddParameter = () => {
    const newParam: FunctionParameter = { 
      id: nanoid(), 
      name: '', 
      type: 'string' 
    };
    handleChange('parameters', [...(constructorData.parameters || []), newParam]);
  };

  const handleParameterChange = (
    index: number, 
    field: keyof FunctionParameter, 
    value: string
  ) => {
    const updatedParams = [...(constructorData.parameters || [])];
    updatedParams[index] = { 
      ...updatedParams[index], 
      [field]: value 
    };
    handleChange('parameters', updatedParams);
  };

  const handleRemoveParameter = (index: number) => {
    const updatedParams = (constructorData.parameters || []).filter((_, i) => i !== index);
    handleChange('parameters', updatedParams);
  };

  

  return (
    <div className="space-y-4">
      {/* Constructor Parameters */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Parameters</label>
        <div className="space-y-2">
          {(constructorData.parameters || []).map((param, index) => (
            <div key={param.id} className="flex items-center gap-2">
              <Input
                placeholder="Parameter Name"
                value={param.name}
                onChange={(e) => handleParameterChange(index, 'name', e.target.value)}
              />
              <Select
                value={param.type}
                onValueChange={(value) => handleParameterChange(index, 'type', value)}
              >
                <SelectTrigger>
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

      

      {/* Constructor Body */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Constructor Body</label>
        <Textarea
          placeholder="Enter constructor implementation..."
          value={constructorData.body?.content || ''}
          onChange={(e) => handleChange('body', { 
            ...constructorData.body, 
            content: e.target.value 
          })}
        />
      </div>
    </div>
  );
};