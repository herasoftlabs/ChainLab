import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DetailComponentProps } from '@/components/contracts/steps/edit-contract/chain/evm/DetailPanel/shared/DetailComponentProps';
import { 
  StructComponentData, 
  BasicDataType, 
  StructMember 
} from '@/types/evm/contractTypes';
import { nanoid } from 'nanoid';

const basicDataTypes: BasicDataType[] = [
  'address', 'bool', 'string', 'bytes',
  'uint8', 'uint16', 'uint32', 'uint64', 'uint128', 'uint256',
  'int8', 'int16', 'int32', 'int64', 'int128', 'int256',
  'bytes1', 'bytes2', 'bytes3', 'bytes4', 'bytes8', 'bytes16', 'bytes32',
];

export const StructDetail: React.FC<DetailComponentProps> = ({ 
  data, 
  onChange 
}) => {
  const structData = data as StructComponentData;

  const handleChange = (field: keyof StructComponentData, value: any) => {
    onChange({ [field]: value });
  };

  const handleAddMember = () => {
    const newMember: StructMember = { 
      id: nanoid(), 
      name: '', 
      type: 'uint256' 
    };
    handleChange('members', [...(structData.members || []), newMember]);
  };

  const handleMemberChange = (
    index: number, 
    field: keyof StructMember, 
    value: string
  ) => {
    const updatedMembers = [...(structData.members || [])];
    updatedMembers[index] = { 
      ...updatedMembers[index], 
      [field]: value 
    };
    handleChange('members', updatedMembers);
  };

  const handleRemoveMember = (index: number) => {
    const updatedMembers = (structData.members || []).filter((_, i) => i !== index);
    handleChange('members', updatedMembers);
  };

  return (
    <div className="space-y-4">
      {/* Struct Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Struct Name</label>
        <Input
          value={structData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Enter struct name"
        />
      </div>

      {/* Struct Members */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Struct Members</label>
        <div className="space-y-2">
          {(structData.members || []).map((member, index) => (
            <div 
              key={member.id} 
              className="flex items-center gap-2 bg-gray-50 p-2 rounded"
            >
              <Input
                placeholder="Member Name"
                value={member.name}
                onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                className="flex-1"
              />
              <Select
                value={member.type}
                onValueChange={(value) => handleMemberChange(index, 'type', value)}
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
                onClick={() => handleRemoveMember(index)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddMember}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Member
          </Button>
        </div>
      </div>

      {/* Documentation */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Struct Description</label>
        <Input
          value={structData.documentation || ''}
          onChange={(e) => handleChange('documentation', e.target.value)}
          placeholder="Describe the purpose of this struct"
        />
      </div>

      {/* Struct Usage Hint */}
      <div className="text-sm text-gray-500 bg-gray-50 p-2 rounded">
        <p>💡 Tip: Structs allow you to create custom data types with multiple properties.</p>
        <p>Example: <code>struct User {'{ address wallet; uint balance; }'}</code></p>
      </div>

      {/* Struct Declaration Preview */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Struct Declaration Preview</label>
        <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
          {`struct ${structData.name || 'CustomStruct'} {\n${
            (structData.members || [])
              .map(m => `  ${m.type} ${m.name};`)
              .join('\n')
          }\n}`}
        </pre>
      </div>
    </div>
  );
};