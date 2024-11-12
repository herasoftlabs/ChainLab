import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DetailComponentProps } from '@/components/contracts/steps/edit-contract/chain/evm/DetailPanel/shared/DetailComponentProps';
import { 
  EventComponentData, 
  BasicDataType, 
  EventParameter 
} from '@/types/evm/contractTypes';
import { nanoid } from 'nanoid';
import { Checkbox } from '@/components/ui/checkbox';

const basicDataTypes: BasicDataType[] = [
  'address', 'bool', 'string', 'bytes',
  'uint8', 'uint16', 'uint32', 'uint64', 'uint128', 'uint256',
  'int8', 'int16', 'int32', 'int64', 'int128', 'int256',
  'bytes1', 'bytes2', 'bytes3', 'bytes4', 'bytes8', 'bytes16', 'bytes32',
];

export const EventDetail: React.FC<DetailComponentProps> = ({ 
  data, 
  onChange 
}) => {
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

  const handleParameterChange = (
    index: number, 
    field: keyof EventParameter, 
    value: any
  ) => {
    const updatedParams = [...(eventData.parameters || [])];
    updatedParams[index] = { 
      ...updatedParams[index], 
      [field]: value 
    };
    handleChange('parameters', updatedParams);
  };

  const handleRemoveParameter = (index: number) => {
    const updatedParams = (eventData.parameters || []).filter((_, i) => i !== index);
    handleChange('parameters', updatedParams);
  };

  return (
    <div className="space-y-4">
      {/* Event Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Event Name</label>
        <Input
          value={eventData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Enter event name"
        />
      </div>

      {/* Event Parameters */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Parameters</label>
        <div className="space-y-2">
          {(eventData.parameters || []).map((param, index) => (
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
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={param.indexed}
                  onCheckedChange={(checked) => 
                    handleParameterChange(index, 'indexed', checked)
                  }
                />
                <label className="text-sm">Indexed</label>
              </div>
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

      {/* Event Usage Hint */}
      <div className="text-sm text-gray-500 bg-gray-50 p-2 rounded">
        <p>💡 Tip: Events are used to log and emit specific actions in your contract.</p>
        <p>Indexed parameters allow easier filtering in event logs.</p>
        <p>Example: <code>event Transfer(address indexed from, address indexed to, uint amount);</code></p>
      </div>

      {/* Documentation */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Event Description</label>
        <Input
          value={eventData.documentation || ''}
          onChange={(e) => handleChange('documentation', e.target.value)}
          placeholder="Describe the purpose of this event"
        />
      </div>
    </div>
  );
};