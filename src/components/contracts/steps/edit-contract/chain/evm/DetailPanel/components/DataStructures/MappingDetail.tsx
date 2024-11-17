// components/contracts/steps/edit-contract/chain/evm/DetailPanel/DataStructures/MappingDetail.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DetailComponentProps } from '@/components/contracts/steps/edit-contract/chain/evm/DetailPanel/shared/DetailComponentProps';
import { MappingComponentData, BasicDataType } from '@/types/evm/contractTypes';
import { Card } from '@/components/ui/card';

const basicDataTypes: BasicDataType[] = [
  'address', 'bool', 'string', 'bytes',
  'uint256', 'uint128', 'uint64', 'uint32',
  'int256', 'int128', 'int64', 'int32',
  'bytes32', 'bytes4'
];

export const MappingDetail: React.FC<DetailComponentProps> = ({ data, onChange }) => {
  const mappingData = data as MappingComponentData;

  const handleChange = (field: keyof MappingComponentData, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Name</label>
        <Input
          value={mappingData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="balances"
          className="font-mono"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Key Type</label>
          <Select
            value={mappingData.keyType}
            onValueChange={(value) => handleChange('keyType', value)}
          >
            <SelectTrigger className="font-mono">
              <SelectValue placeholder="Select key type" />
            </SelectTrigger>
            <SelectContent>
              {basicDataTypes.map((type) => (
                <SelectItem key={type} value={type} className="font-mono">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Value Type</label>
          <Select
            value={typeof mappingData.valueType === 'string' ? mappingData.valueType : ''}
            onValueChange={(value) => handleChange('valueType', value)}
          >
            <SelectTrigger className="font-mono">
              <SelectValue placeholder="Select value type" />
            </SelectTrigger>
            <SelectContent>
              {basicDataTypes.map((type) => (
                <SelectItem key={type} value={type} className="font-mono">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Visibility</label>
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

      

      <Card className="p-4 bg-muted/50">
        <p className="text-sm text-muted-foreground">
          💡 Mappings are hash tables that store key-value pairs. They're commonly used 
          for storing balances, ownership, and other relationships.
        </p>
        <pre className="mt-2 text-xs text-muted-foreground">
          {`// Example usage
balances[msg.sender] = 1000;
uint balance = balances[address];`}
        </pre>
      </Card>
    </div>
  );
};