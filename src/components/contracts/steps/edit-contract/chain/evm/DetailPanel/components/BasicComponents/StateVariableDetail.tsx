// components/contracts/steps/edit-contract/chain/evm/DetailPanel/BasicComponents/StateVariableDetail.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DetailComponentProps } from '@/components/contracts/steps/edit-contract/chain/evm/DetailPanel/shared/DetailComponentProps';
import { StateVariableComponentData, BasicDataType } from '@/types/evm/contractTypes';

const basicDataTypes: BasicDataType[] = [
  'address', 'bool', 'string', 'bytes',
  'uint8', 'uint16', 'uint32', 'uint64', 'uint128', 'uint256',
  'int8', 'int16', 'int32', 'int64', 'int128', 'int256',
  'bytes1', 'bytes2', 'bytes3', 'bytes4', 'bytes8', 'bytes16', 'bytes32',
];

export const StateVariableDetail: React.FC<DetailComponentProps> = ({ 
  data, 
  onChange 
}) => {
  const variableData = data as StateVariableComponentData;

  const handleChange = (field: keyof StateVariableComponentData, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-4">
      {/* Variable Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Variable Name</label>
        <Input
          value={variableData.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
      </div>
      
      {/* Data Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Data Type</label>
        <Select
          value={typeof variableData.dataType === 'string' ? variableData.dataType : ''}
          onValueChange={(value) => handleChange('dataType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select data type" />
          </SelectTrigger>
          <SelectContent>
            {basicDataTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Visibility */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Visibility</label>
        <Select
          value={variableData.visibility}
          onValueChange={(value) => handleChange('visibility', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">public</SelectItem>
            <SelectItem value="private">private</SelectItem>
            <SelectItem value="internal">internal</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Mutability */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Mutability</label>
        <Select
          value={variableData.mutability}
          onValueChange={(value) => handleChange('mutability', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select mutability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mutable">mutable</SelectItem>
            <SelectItem value="immutable">immutable</SelectItem>
            <SelectItem value="constant">constant</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Initial Value */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Initial Value</label>
        <Input
          placeholder="Optional initial value"
          value={variableData.initialValue || ''}
          onChange={(e) => handleChange('initialValue', e.target.value)}
        />
      </div>
    </div>
  );
};