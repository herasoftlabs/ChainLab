import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { DetailComponentProps } from '@/components/contracts/steps/edit-contract/chain/evm/DetailPanel/shared/DetailComponentProps';
import { 
  EnumComponentData 
} from '@/types/evm/contractTypes';

export const EnumDetail: React.FC<DetailComponentProps> = ({ 
  data, 
  onChange 
}) => {
  const enumData = data as EnumComponentData;

  const handleChange = (field: keyof EnumComponentData, value: any) => {
    onChange({ [field]: value });
  };

  const handleAddMember = () => {
    const newMember = `Value${(enumData.members || []).length + 1}`;
    handleChange('members', [...(enumData.members || []), newMember]);
  };

  const handleMemberChange = (index: number, value: string) => {
    const updatedMembers = [...(enumData.members || [])];
    updatedMembers[index] = value;
    handleChange('members', updatedMembers);
  };

  const handleRemoveMember = (index: number) => {
    const updatedMembers = (enumData.members || []).filter((_, i) => i !== index);
    handleChange('members', updatedMembers);
  };

  return (
    <div className="space-y-4">
      {/* Enum Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Enum Name</label>
        <Input
          value={enumData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Enter enum name"
        />
      </div>

      {/* Enum Members */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Enum Values</label>
        <div className="space-y-2">
          {(enumData.members || []).map((member, index) => (
            <div 
              key={index} 
              className="flex items-center gap-2 bg-gray-50 p-2 rounded"
            >
              <Input
                placeholder="Enum Value"
                value={member}
                onChange={(e) => handleMemberChange(index, e.target.value)}
                className="flex-1"
              />
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
            <Plus className="h-4 w-4 mr-2" /> Add Value
          </Button>
        </div>
      </div>

      {/* Documentation */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Enum Description</label>
        <Input
          value={enumData.documentation || ''}
          onChange={(e) => handleChange('documentation', e.target.value)}
          placeholder="Describe the purpose of this enum"
        />
      </div>

      {/* Enum Usage Hint */}
      <div className="text-sm text-gray-500 bg-gray-50 p-2 rounded">
        <p>💡 Tip: Enums are user-defined types with a fixed set of named values.</p>
        <p>Example: <code>enum Status {'{ Pending, Active, Completed }'}</code></p>
      </div>

      {/* Enum Declaration Preview */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Enum Declaration Preview</label>
        <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
          {`enum ${enumData.name || 'CustomEnum'} {\n${
            (enumData.members || [])
              .map((m, i) => `  ${m || `Value${i + 1}`}`)
              .join(',\n')
          }\n}`}
        </pre>
      </div>
    </div>
  );
};