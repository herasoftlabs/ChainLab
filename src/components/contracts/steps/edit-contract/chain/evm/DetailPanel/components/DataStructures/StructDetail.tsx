// components/contracts/steps/edit-contract/chain/evm/DetailPanel/DataStructures/StructDetail.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DetailComponentProps } from '@/components/contracts/steps/edit-contract/chain/evm/DetailPanel/shared/DetailComponentProps';
import { StructComponentData, BasicDataType, StructMember } from '@/types/evm/contractTypes';
import { nanoid } from 'nanoid';
import { Card } from '@/components/ui/card';

const basicDataTypes: BasicDataType[] = [
  'address', 'bool', 'string', 'bytes',
  'uint256', 'uint128', 'uint64', 'uint32',
  'int256', 'int128', 'int64', 'int32',
  'bytes32', 'bytes4'
];

export const StructDetail: React.FC<DetailComponentProps> = ({ data, onChange }) => {
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

  const handleMemberChange = (index: number, field: keyof StructMember, value: string) => {
    const updatedMembers = [...(structData.members || [])];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    handleChange('members', updatedMembers);
  };

  const handleRemoveMember = (index: number) => {
    const updatedMembers = (structData.members || []).filter((_, i) => i !== index);
    handleChange('members', updatedMembers);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Name</label>
        <Input
          value={structData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="UserInfo"
          className="font-mono"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Members</label>
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
          {(structData.members || []).map((member, index) => (
            <div key={member.id} className="flex items-center gap-2">
              <Input
                placeholder="memberName"
                value={member.name}
                onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                className="font-mono"
              />
              <Select
                value={member.type}
                onValueChange={(value) => handleMemberChange(index, 'type', value)}
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
          💡 Structs are custom data types that group related properties together.
        </p>
        <pre className="mt-2 text-xs text-muted-foreground">
          {`// Example usage
UserInfo memory user = UserInfo({
    wallet: msg.sender,
    balance: 1000
});`}
        </pre>
      </Card>
    </div>
  );
};