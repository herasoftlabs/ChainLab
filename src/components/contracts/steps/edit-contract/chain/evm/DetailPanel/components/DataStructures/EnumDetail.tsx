// components/contracts/steps/edit-contract/chain/evm/DetailPanel/DataStructures/EnumDetail.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { DetailComponentProps } from '@/components/contracts/steps/edit-contract/chain/evm/DetailPanel/shared/DetailComponentProps';
import { EnumComponentData } from '@/types/evm/contractTypes';
import { Card } from '@/components/ui/card';

export const EnumDetail: React.FC<DetailComponentProps> = ({ data, onChange }) => {
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
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Name</label>
        <Input
          value={enumData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Status"
          className="font-mono"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Values</label>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddMember}
            className="h-8"
          >
            <Plus className="h-4 w-4 mr-2" /> Add
          </Button>
        </div>

        <div className="space-y-2">
          {(enumData.members || []).map((member, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder="enumValue"
                value={member}
                onChange={(e) => handleMemberChange(index, e.target.value)}
                className="font-mono"
              />
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleRemoveMember(index)}
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
          💡 Enums define a fixed set of named values. They're useful for 
          representing a finite set of options or states.
        </p>
        <pre className="mt-2 text-xs text-muted-foreground">
          {`// Example usage
Status currentStatus = Status.Active;`}
        </pre>
      </Card>
    </div>
  );
};