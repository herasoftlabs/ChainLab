import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DetailComponentProps } from '@/components/contracts/steps/edit-contract/chain/evm/DetailPanel/shared/DetailComponentProps';
import { 
  MappingComponentData, 
  BasicDataType 
} from '@/types/evm/contractTypes';

const basicDataTypes: BasicDataType[] = [
  'address', 'bool', 'string', 'bytes',
  'uint8', 'uint16', 'uint32', 'uint64', 'uint128', 'uint256',
  'int8', 'int16', 'int32', 'int64', 'int128', 'int256',
  'bytes1', 'bytes2', 'bytes3', 'bytes4', 'bytes8', 'bytes16', 'bytes32',
];

export const MappingDetail: React.FC<DetailComponentProps> = ({ 
  data, 
  onChange 
}) => {
  const mappingData = data as MappingComponentData;

  const handleChange = (field: keyof MappingComponentData, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-4">
      {/* Mapping Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Mapping Name</label>
        <Input
          value={mappingData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Enter mapping name"
        />
      </div>

      {/* Key Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Key Type</label>
        <Select
          value={mappingData.keyType}
          onValueChange={(value) => handleChange('keyType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select key type" />
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

      {/* Value Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Value Type</label>
        <Select
          value={typeof mappingData.valueType === 'string' ? mappingData.valueType : ''}
          onValueChange={(value) => handleChange('valueType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select value type" />
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
          value={mappingData.visibility}
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
        <label className="block text-sm font-medium text-gray-700">Mapping Description</label>
        <Input
          value={mappingData.documentation || ''}
          onChange={(e) => handleChange('documentation', e.target.value)}
          placeholder="Describe the purpose of this mapping"
        />
      </div>

      {/* Mapping Usage Hint */}
      <div className="text-sm text-gray-500 bg-gray-50 p-2 rounded">
        <p>💡 Tip: Mappings are key-value stores in Solidity.</p>
        <p>Example: <code>{`mapping(address => uint) public balances;`}</code></p>
      </div>

      {/* Mapping Declaration Preview */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Mapping Declaration Preview</label>
        <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
          {`mapping(${mappingData.keyType || 'address'} => ${
            typeof mappingData.valueType === 'string' ? mappingData.valueType : 'uint256'
          }) ${mappingData.visibility || 'public'} ${mappingData.name || 'myMapping'};`}
        </pre>
      </div>
    </div>
  );
};