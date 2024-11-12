import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DetailComponentProps } from '@/components/contracts/steps/edit-contract/chain/evm/DetailPanel/shared/DetailComponentProps';
import { 
  ArrayComponentData, 
  BasicDataType 
} from '@/types/evm/contractTypes';

const basicDataTypes: BasicDataType[] = [
  'address', 'bool', 'string', 'bytes',
  'uint8', 'uint16', 'uint32', 'uint64', 'uint128', 'uint256',
  'int8', 'int16', 'int32', 'int64', 'int128', 'int256',
  'bytes1', 'bytes2', 'bytes3', 'bytes4', 'bytes8', 'bytes16', 'bytes32',
];

export const ArrayDetail: React.FC<DetailComponentProps> = ({ 
  data, 
  onChange 
}) => {
  const arrayData = data as ArrayComponentData;

  const handleChange = (field: keyof ArrayComponentData, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-4">
      {/* Array Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Array Name</label>
        <Input
          value={arrayData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Enter array name"
        />
      </div>

      {/* Array Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Array Type</label>
        <Select
          value={typeof arrayData.dataType === 'string' ? arrayData.dataType : ''}
          onValueChange={(value) => handleChange('dataType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select array type" />
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

      {/* Array Length */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Array Length</label>
        <Input
          type="number"
          value={arrayData.length || ''}
          onChange={(e) => handleChange('length', e.target.value ? parseInt(e.target.value) : undefined)}
          placeholder="Leave blank for dynamic array"
        />
      </div>

      {/* Visibility */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Visibility</label>
        <Select
          value={arrayData.visibility}
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

      {/* Documentation */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Array Description</label>
        <Input
          value={arrayData.documentation || ''}
          onChange={(e) => handleChange('documentation', e.target.value)}
          placeholder="Describe the purpose of this array"
        />
      </div>

      {/* Array Usage Hint */}
      <div className="text-sm text-gray-500 bg-gray-50 p-2 rounded">
        <p>💡 Tip: Arrays can be fixed or dynamic in Solidity.</p>
        <p>Examples:</p>
        <p><code>uint[] public dynamicArray; // Dynamic array</code></p>
        <p><code>uint[5] public fixedArray; // Fixed-size array</code></p>
      </div>

      {/* Array Declaration Preview */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Array Declaration Preview</label>
        <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
          {`${typeof arrayData.dataType === 'string' ? arrayData.dataType : 'uint'}${
            arrayData.length ? `[${arrayData.length}]` : '[]'
          } ${arrayData.visibility || 'public'} ${arrayData.name || 'myArray'};`}
        </pre>
      </div>
    </div>
  );
};