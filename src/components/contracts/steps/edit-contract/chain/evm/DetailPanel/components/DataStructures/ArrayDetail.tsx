// components/contracts/steps/edit-contract/chain/evm/DetailPanel/DataStructures/ArrayDetail.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DetailComponentProps } from '@/components/contracts/steps/edit-contract/chain/evm/DetailPanel/shared/DetailComponentProps';
import { ArrayComponentData, BasicDataType } from '@/types/evm/contractTypes';
import { Card } from '@/components/ui/card';

const basicDataTypes: BasicDataType[] = [
  'address', 'bool', 'string', 'bytes',
  'uint256', 'uint128', 'uint64', 'uint32',
  'int256', 'int128', 'int64', 'int32',
  'bytes32', 'bytes4'
];

export const ArrayDetail: React.FC<DetailComponentProps> = ({ data, onChange }) => {
  const arrayData = data as ArrayComponentData;

  const handleChange = (field: keyof ArrayComponentData, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Name</label>
        <Input
          value={arrayData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="tokenHolders"
          className="font-mono"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Element Type</label>
        <Select
          value={typeof arrayData.dataType === 'string' ? arrayData.dataType : ''}
          onValueChange={(value) => handleChange('dataType', value)}
        >
          <SelectTrigger className="font-mono">
            <SelectValue placeholder="Select element type" />
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
        <label className="text-sm font-medium">Fixed Length (Optional)</label>
        <Input
          type="number"
          value={arrayData.length || ''}
          onChange={(e) => handleChange('length', e.target.value ? parseInt(e.target.value) : undefined)}
          placeholder="Leave empty for dynamic array"
          className="font-mono"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Visibility</label>
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

      

      <Card className="p-4 bg-muted/50">
        <p className="text-sm text-muted-foreground">
          💡 Arrays can be fixed-size or dynamic. Fixed-size arrays are more 
          gas-efficient but cannot be resized after creation.
        </p>
        <pre className="mt-2 text-xs text-muted-foreground">
          {`// Example usage
tokenHolders.push(newHolder);
address holder = tokenHolders[0];`}
        </pre>
      </Card>
    </div>
  );
};