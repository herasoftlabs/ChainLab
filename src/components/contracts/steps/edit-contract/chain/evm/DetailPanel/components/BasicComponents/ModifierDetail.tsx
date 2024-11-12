import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DetailComponentProps } from '@/components/contracts/steps/edit-contract/chain/evm/DetailPanel/shared/DetailComponentProps';
import { 
  ModifierComponentData, 
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

export const ModifierDetail: React.FC<DetailComponentProps> = ({ 
  data, 
  onChange 
}) => {
  const modifierData = data as ModifierComponentData;

  const handleChange = (field: keyof ModifierComponentData, value: any) => {
    onChange({ [field]: value });
  };

  const handleAddParameter = () => {
    const newParam: FunctionParameter = { 
      id: nanoid(), 
      name: '', 
      type: 'string' 
    };
    handleChange('parameters', [...(modifierData.parameters || []), newParam]);
  };

  const handleParameterChange = (
    index: number, 
    field: keyof FunctionParameter, 
    value: string
  ) => {
    const updatedParams = [...(modifierData.parameters || [])];
    updatedParams[index] = { 
      ...updatedParams[index], 
      [field]: value 
    };
    handleChange('parameters', updatedParams);
  };

  const handleRemoveParameter = (index: number) => {
    const updatedParams = (modifierData.parameters || []).filter((_, i) => i !== index);
    handleChange('parameters', updatedParams);
  };

  return (
    <div className="space-y-4">
      {/* Modifier Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Modifier Name</label>
        <Input
          value={modifierData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Enter modifier name"
        />
      </div>

      {/* Modifier Parameters */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Parameters</label>
        <div className="space-y-2">
          {(modifierData.parameters || []).map((param, index) => (
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

      {/* Modifier Body */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Modifier Body</label>
        <Textarea
          placeholder="Enter modifier implementation (e.g., require statements)..."
          value={modifierData.body?.content || ''}
          onChange={(e) => handleChange('body', { 
            ...modifierData.body, 
            content: e.target.value 
          })}
          className="min-h-[100px]"
        />
      </div>

      {/* Modifier Usage Hint */}
      <div className="text-sm text-gray-500 bg-gray-50 p-2 rounded">
        <p>💡 Tip: Modifiers are used to modify the behavior of functions.</p>
        <p>Example: <code>{`modifier onlyOwner() { require(msg.sender == owner, "Not owner"); _ }`}</code></p>
      </div>
    </div>
  );
};