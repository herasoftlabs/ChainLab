// components/contracts/steps/edit-contract/chain/evm/DetailPanel/index.tsx

import React, { useState } from 'react';
import { X, Trash2, Plus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DraggableComponent,
  ConstructorComponentData,
  SubCategoryType,
  ComponentCategoryMain,
  StructComponentData,
  ModifierComponentData,
  EventComponentData,
  ErrorComponentData,
  EnumComponentData,
  StructMember,
  isConstructorComponentData,
} from '@/types/evm/contractTypes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  isFunctionComponentData,
  isStateVariableComponentData,
  isStructComponentData,
  isEnumComponentData,
  isArrayComponentData,
  isMappingComponentData,
  isEventComponentData,
  isModifierComponentData,
  isErrorComponentData,
  FunctionComponentData,
  StateVariableComponentData,
  VariableMutability,
  BasicDataType,
  FunctionParameter,
} from '@/types/evm/contractTypes';
import { nanoid } from 'nanoid';


import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog'; 




interface DetailPanelProps {
  isOpen: boolean;
  component: DraggableComponent | null;
  onClose: () => void;
  onUpdate: (componentId: string, updates: Partial<DraggableComponent>) => void;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({
  isOpen,
  component,
  onClose,
  onUpdate,
}) => {
  const [localComponentData, setLocalComponentData] = useState(component?.data);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] = useState(false);

  React.useEffect(() => {
    setLocalComponentData(component?.data);
    setHasUnsavedChanges(false);
  }, [component, component?.data]);

  React.useEffect(() => {
    if (!component || !localComponentData) return;

    // Compare localComponentData with component.data to check for changes
    const isEqual = JSON.stringify(localComponentData) === JSON.stringify(component.data);
    setHasUnsavedChanges(!isEqual);
  }, [localComponentData, component?.data]);
  

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedChangesDialog(true);
    } else {
      onClose();
    }
  };

  const handleChange = (field: string, value: any) => {
    if (!localComponentData) return;
    setLocalComponentData({
      ...localComponentData,
      [field]: value,
    });
  };

  const handleSave = () => {
    if (!component || !localComponentData) return;
    onUpdate(component.id, { data: localComponentData });
  };

  if (!component || !localComponentData) return null;

  const renderComponentForm = () => {
    if (isFunctionComponentData(localComponentData)) {
      return renderFunctionForm(localComponentData);
    } else if (isStateVariableComponentData(localComponentData)) {
      return renderVariableForm(localComponentData);
    } else if (isStructComponentData(localComponentData)) {
      return renderStructForm(localComponentData);
    } else if (isEnumComponentData(localComponentData)) {
      return renderEnumForm(localComponentData);
    } else if (isMappingComponentData(localComponentData)) {
      return <p className="text-sm text-gray-500">Mapping does not have editable properties.</p>;
    } else if (isEventComponentData(localComponentData)) {
      return renderEventForm(localComponentData);
    } else if (isModifierComponentData(localComponentData)) {
      return renderModifierForm(localComponentData);
    } else if (isErrorComponentData(localComponentData)) {
      return renderErrorForm(localComponentData);
    } else if (isArrayComponentData(localComponentData)) {
      return <p className="text-sm text-gray-500">Array does not have editable properties.</p>;
    } else if (isConstructorComponentData(localComponentData)) {
      return renderConstructorForm(localComponentData);
    } else {
      return <p className="text-sm text-gray-500">This component does not have editable properties.</p>;
    }
  };

  const basicDataTypes: BasicDataType[] = [
    'address', 'bool', 'string', 'bytes',
    'uint8', 'uint16', 'uint32', 'uint64', 'uint128', 'uint256',
    'int8', 'int16', 'int32', 'int64', 'int128', 'int256',
    'bytes1', 'bytes2', 'bytes3', 'bytes4', 'bytes8', 'bytes16', 'bytes32',
  ];

  // Constructor Component Form
  const renderConstructorForm = (data: ConstructorComponentData) => {
    const handleConstructorChange = (field: keyof ConstructorComponentData, value: any) => {
      handleChange(field, value);
    };

    const handleAddParameter = () => {
      const newParam: FunctionParameter = { id: nanoid(), name: '', type: 'string' };
      handleConstructorChange('parameters', [...(data.parameters || []), newParam]);
    };

    const handleParameterChange = (index: number, field: keyof FunctionParameter, value: any) => {
      const updatedParams = [...(data.parameters || [])];
      updatedParams[index] = { ...updatedParams[index], [field]: value };
      handleConstructorChange('parameters', updatedParams);
    };

    const handleRemoveParameter = (index: number) => {
      const updatedParams = data.parameters?.filter((_, i) => i !== index) || [];
      handleConstructorChange('parameters', updatedParams);
    };

    return (
      <div className="space-y-4">
        {/* Constructor Parameters */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Parameters</label>
          <div className="space-y-2">
            {(data.parameters || []).map((param, index) => (
              <div key={param.id} className="flex items-center gap-2">
                <Input
                  placeholder="Name"
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
                <Button variant="ghost" size="icon" onClick={() => handleRemoveParameter(index)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={handleAddParameter}>
              <Plus className="h-4 w-4 mr-2" /> Add Parameter
            </Button>
          </div>
        </div>

        {/* Body */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Constructor Body</label>
          <Textarea
            placeholder="Enter constructor body..."
            value={data.body?.content || ''}
            onChange={(e) =>
              handleConstructorChange('body', { ...data.body, content: e.target.value })
            }
          />
        </div>
      </div>
    );
  };

  // Function Component Form
  const renderFunctionForm = (data: FunctionComponentData) => {
    const handleFunctionChange = (field: keyof FunctionComponentData, value: any) => {
      handleChange(field, value);
    };

    const handleAddParameter = () => {
      const newParam: FunctionParameter = { id: nanoid(), name: '', type: 'string' };
      handleFunctionChange('parameters', [...data.parameters, newParam]);
    };

    const handleParameterChange = (index: number, field: keyof FunctionParameter, value: any) => {
      const updatedParams = [...data.parameters];
      updatedParams[index] = { ...updatedParams[index], [field]: value };
      handleFunctionChange('parameters', updatedParams);
    };

    const handleRemoveParameter = (index: number) => {
      const updatedParams = data.parameters.filter((_, i) => i !== index);
      handleFunctionChange('parameters', updatedParams);
    };

    return (
      <div className="space-y-4">
        {/* Function Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Function Name</label>
          <Input
            value={data.name}
            onChange={(e) => handleFunctionChange('name', e.target.value)}
          />
        </div>

        {/* Visibility */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Visibility</label>
          <Select
            value={data.visibility}
            onValueChange={(value) => handleFunctionChange('visibility', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">public</SelectItem>
              <SelectItem value="private">private</SelectItem>
              <SelectItem value="internal">internal</SelectItem>
              <SelectItem value="external">external</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* State Mutability */}
        <div>
          <label className="block text-sm font-medium text-gray-700">State Mutability</label>
          <Select
            value={data.stateMutability}
            onValueChange={(value) => handleFunctionChange('stateMutability', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select state mutability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pure">pure</SelectItem>
              <SelectItem value="view">view</SelectItem>
              <SelectItem value="payable">payable</SelectItem>
              <SelectItem value="nonpayable">nonpayable</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Parameters */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Parameters</label>
          <div className="space-y-2">
            {data.parameters.map((param, index) => (
              <div key={param.id} className="flex items-center gap-2">
                <Input
                  placeholder="Name"
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
                <Button variant="ghost" size="icon" onClick={() => handleRemoveParameter(index)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={handleAddParameter}>
              <Plus className="h-4 w-4 mr-2" /> Add Parameter
            </Button>
          </div>
        </div>

        {/* Body */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Function Body</label>
          <Textarea
            placeholder="Enter function body..."
            value={data.body?.content || ''}
            onChange={(e) =>
              handleFunctionChange('body', { ...data.body, content: e.target.value })
            }
          />
        </div>
      </div>
    );
  };

  // Variable Component Form
  const renderVariableForm = (data: StateVariableComponentData) => {
    const handleVariableChange = (field: keyof StateVariableComponentData, value: any) => {
      if (!isStateVariableComponentData(localComponentData)) return;

      setLocalComponentData({
        ...localComponentData,
        [field]: value,
      });
    };

    return (
      <div className="space-y-4">
        {/* Variable Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Variable Name</label>
          <Input
            value={data.name}
            onChange={(e) => handleVariableChange('name', e.target.value)}
          />
        </div>

        {/* Data Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Data Type</label>
          <Select
            value={typeof data.dataType === 'string' ? data.dataType : ''}
            onValueChange={(value) => handleVariableChange('dataType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select data type" />
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
            value={data.visibility}
            onValueChange={(value) => handleVariableChange('visibility', value)}
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

        {/* Mutability */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Mutability</label>
          <Select
            value={data.mutability}
            onValueChange={(value) =>
              handleVariableChange('mutability', value as VariableMutability)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select mutability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mutable">mutable</SelectItem>
              <SelectItem value="immutable">immutable</SelectItem>
              <SelectItem value="constant">constant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Initial Value */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Initial Value</label>
          <Input
            placeholder="Optional initial value"
            value={data.initialValue || ''}
            onChange={(e) => handleVariableChange('initialValue', e.target.value)}
          />
        </div>
      </div>
    );
  };

  // Struct Component Form
  const renderStructForm = (data: StructComponentData) => {
    const handleStructChange = (field: keyof StructComponentData, value: any) => {
      if (!isStructComponentData(localComponentData)) return;

      setLocalComponentData({
        ...localComponentData,
        [field]: value,
      });
    };

    const handleMemberChange = (
      index: number,
      field: 'name' | 'type',
      value: string
    ) => {
      if (!isStructComponentData(localComponentData)) return;

      const updatedMembers = [...localComponentData.members];

      if (field === 'type') {
        updatedMembers[index] = { ...updatedMembers[index], type: value as BasicDataType };
      } else {
        updatedMembers[index] = { ...updatedMembers[index], name: value };
      }

      setLocalComponentData({
        ...localComponentData,
        members: updatedMembers,
      });
    };

    const handleAddMember = () => {
      if (!isStructComponentData(localComponentData)) return;

      const newMember: StructMember = { id: nanoid(), name: '', type: 'string' };
      setLocalComponentData({
        ...localComponentData,
        members: [...localComponentData.members, newMember],
      });
    };

    const handleRemoveMember = (index: number) => {
      if (!isStructComponentData(localComponentData)) return;

      const updatedMembers = localComponentData.members.filter((_, i) => i !== index);
      setLocalComponentData({
        ...localComponentData,
        members: updatedMembers,
      });
    };

    return (
      <div className="space-y-4">
        {/* Struct Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Struct Name</label>
          <Input
            value={data.name}
            onChange={(e) => handleStructChange('name', e.target.value)}
          />
        </div>

        {/* Members */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Members</label>
          <div className="space-y-2">
            {data.members.map((member, index) => (
              <div key={member.id} className="flex items-center gap-2">
                <Input
                  placeholder="Name"
                  value={member.name}
                  onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                />
                <Select
                  value={member.type}
                  onValueChange={(value) => handleMemberChange(index, 'type', value)}
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
                <Button variant="ghost" size="icon" onClick={() => handleRemoveMember(index)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={handleAddMember}>
              <Plus className="h-4 w-4 mr-2" /> Add Member
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Enum Component Form
  const renderEnumForm = (data: EnumComponentData) => {
    const handleEnumChange = (field: keyof EnumComponentData, value: any) => {
      if (!isEnumComponentData(localComponentData)) return;

      setLocalComponentData({
        ...localComponentData,
        [field]: value,
      });
    };

    const handleEnumMemberChange = (index: number, value: string) => {
      if (!isEnumComponentData(localComponentData)) return;

      const updatedMembers = [...localComponentData.members];
      updatedMembers[index] = value;

      setLocalComponentData({
        ...localComponentData,
        members: updatedMembers,
      });
    };

    const handleAddEnumMember = () => {
      if (!isEnumComponentData(localComponentData)) return;

      setLocalComponentData({
        ...localComponentData,
        members: [...localComponentData.members, ''],
      });
    };

    const handleRemoveEnumMember = (index: number) => {
      if (!isEnumComponentData(localComponentData)) return;

      const updatedMembers = localComponentData.members.filter((_, i) => i !== index);
      setLocalComponentData({
        ...localComponentData,
        members: updatedMembers,
      });
    };

    return (
      <div className="space-y-4">
        {/* Enum Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Enum Name</label>
          <Input
            value={data.name}
            onChange={(e) => handleEnumChange('name', e.target.value)}
          />
        </div>

        {/* Members */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Values</label>
          <div className="space-y-2">
            {data.members.map((member, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder="Enum Value"
                  value={member}
                  onChange={(e) => handleEnumMemberChange(index, e.target.value)}
                />
                <Button variant="ghost" size="icon" onClick={() => handleRemoveEnumMember(index)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={handleAddEnumMember}>
              <Plus className="h-4 w-4 mr-2" /> Add Value
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Event Component Form
  const renderEventForm = (data: EventComponentData) => {
    const handleEventChange = (field: keyof EventComponentData, value: any) => {
      if (!isEventComponentData(localComponentData)) return;

      setLocalComponentData({
        ...localComponentData,
        [field]: value,
      });
    };

    return (
      <div className="space-y-4">
        {/* Event Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Event Name</label>
          <Input
            value={data.name}
            onChange={(e) => handleEventChange('name', e.target.value)}
          />
        </div>
        {/* Implement event parameters similar to function parameters */}
        <p className="text-sm text-gray-500">Event parameters can be added here.</p>
      </div>
    );
  };

  // Modifier Component Form
  const renderModifierForm = (data: ModifierComponentData) => {
    const handleModifierChange = (field: keyof ModifierComponentData, value: any) => {
      if (!isModifierComponentData(localComponentData)) return;

      setLocalComponentData({
        ...localComponentData,
        [field]: value,
      });
    };

    return (
      <div className="space-y-4">
        {/* Modifier Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Modifier Name</label>
          <Input
            value={data.name}
            onChange={(e) => handleModifierChange('name', e.target.value)}
          />
        </div>
        {/* Implement modifier-specific fields */}
        <p className="text-sm text-gray-500">Modifier body can be edited here.</p>
        <Textarea
          placeholder="Enter modifier body..."
          value={data.body?.content || ''}
          onChange={(e) =>
            handleModifierChange('body', { ...data.body, content: e.target.value })
          }
        />
      </div>
    );
  };

  // Error Component Form
  const renderErrorForm = (data: ErrorComponentData) => {
    const handleErrorChange = (field: keyof ErrorComponentData, value: any) => {
      if (!isErrorComponentData(localComponentData)) return;

      setLocalComponentData({
        ...localComponentData,
        [field]: value,
      });
    };

    return (
      <div className="space-y-4">
        {/* Error Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Error Name</label>
          <Input
            value={data.name}
            onChange={(e) => handleErrorChange('name', e.target.value)}
          />
        </div>
        {/* Implement error-specific fields */}
        <p className="text-sm text-gray-500">Error parameters can be added here.</p>
      </div>
    );
  };

  return (
    <div
      className={cn(
        'w-96 border-l border-gray-200 bg-white',
        'transition-all duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : 'translate-x-full',
      )}
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <p>Component Name:</p>
              <Badge className="text-xs shadow-sm" variant="secondary">
                {localComponentData.name}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <p>Type:</p>
              <Badge className="text-xs shadow-sm" variant="secondary">
                {localComponentData.type}
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="properties" className="flex-1">
          <TabsList className="w-full justify-start px-4 py-2 border-b">
          <TabsTrigger value="properties">
            Properties {hasUnsavedChanges && <span className="text-red-500">*</span>}
          </TabsTrigger>
            <TabsTrigger value="documentation">Docs</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1">
            <TabsContent value="properties" className="p-4 space-y-4">
              {renderComponentForm()}
            </TabsContent>

            <TabsContent value="documentation" className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Documentation</label>
                  <Textarea
                    placeholder="Add documentation here..."
                    value={localComponentData.documentation || ''}
                    onChange={(e) => handleChange('documentation', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Component JSON</label>
                  <pre className="overflow-auto p-2 bg-gray-100 rounded text-xs">
                    {JSON.stringify(localComponentData, null, 2)}
                  </pre>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>

            
          {/* Save Button */}
          <div className="p-4 border-t border-gray-200 flex justify-end gap-3 items-center">
            
          {hasUnsavedChanges && <span className="text-red-500 text-xs bg-red-200 p-3 rounded">Warning: There are unsaved changes</span>}
            
            <Button onClick={handleSave}>            
              <Save className="h-4 w-4 mr-2" /> Save 
            </Button>
          </div>
          
        </Tabs>
      </div>

      {/* Unsaved Changes Dialog */}
    {showUnsavedChangesDialog && (
      <Dialog open={showUnsavedChangesDialog} onOpenChange={setShowUnsavedChangesDialog}>
        <DialogContent>
          <DialogTitle>Unsaved Changes</DialogTitle>
          <DialogDescription>
            You have unsaved changes. Do you want to save before closing?
          </DialogDescription>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowUnsavedChangesDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowUnsavedChangesDialog(false);
                onClose(); // Close without saving
              }}
            >
              Discard Changes
            </Button>
            <Button
              onClick={() => {
                handleSave();
                setShowUnsavedChangesDialog(false);
                onClose();
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )}

    </div>
  );
};
