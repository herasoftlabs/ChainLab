// components/contracts/steps/edit-contract/chain/evm/DetailPanel/Events/EventDetail.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DetailComponentProps } from '@/components/contracts/steps/edit-contract/chain/evm/DetailPanel/shared/DetailComponentProps';
import { EventComponentData, BasicDataType, EventParameter } from '@/types/evm/contractTypes';
import { nanoid } from 'nanoid';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';

const basicDataTypes: BasicDataType[] = [
  'address', 'bool', 'string', 'bytes',
  'uint256', 'uint128', 'uint64', 'uint32',
  'int256', 'int128', 'int64', 'int32',
  'bytes32', 'bytes4'
];

export const EventDetail: React.FC<DetailComponentProps> = ({ data, onChange }) => {
  const eventData = data as EventComponentData;

  const handleChange = (field: keyof EventComponentData, value: any) => {
    onChange({ [field]: value });
  };

  const handleAddParameter = () => {
    const newParam: EventParameter = { 
      id: nanoid(), 
      name: '', 
      type: 'address',
      indexed: false
    };
    handleChange('parameters', [...(eventData.parameters || []), newParam]);
  };

  const handleParameterChange = (index: number, field: keyof EventParameter, value: any) => {
    const updatedParams = [...(eventData.parameters || [])];
    updatedParams[index] = { ...updatedParams[index], [field]: value };
    handleChange('parameters', updatedParams);
  };

  const handleRemoveParameter = (index: number) => {
    const updatedParams = (eventData.parameters || []).filter((_, i) => i !== index);
    handleChange('parameters', updatedParams);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Name</label>
        <Input
          value={eventData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Transfer"
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
          {(eventData.parameters || []).map((param, index) => (
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
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`indexed-${param.id}`}
                  checked={param.indexed}
                  onCheckedChange={(checked) => 
                    handleParameterChange(index, 'indexed', checked)
                  }
                  className="h-4 w-4"
                />
                <label 
                  htmlFor={`indexed-${param.id}`}
                  className="text-xs text-muted-foreground cursor-pointer"
                >
                  Indexed
                </label>
              </div>
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
          💡 Events are used to log important state changes in your contract. 
          Indexed parameters can be efficiently filtered in event logs.
        </p>
        <pre className="mt-2 text-xs text-muted-foreground">
          {`// Example usage
emit Transfer(msg.sender, recipient, amount);`}
        </pre>
      </Card>
    </div>
  );
};