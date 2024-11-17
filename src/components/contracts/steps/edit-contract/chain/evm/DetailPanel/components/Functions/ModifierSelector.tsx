// components/contracts/steps/edit-contract/chain/evm/DetailPanel/Functions/ModifierSelector.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ModifierReference } from '@/types/evm/contractTypes';
import { Badge } from '@/components/ui/badge';

interface ModifierSelectorProps {
  availableModifiers: ModifierReference[];
  selectedModifiers: Array<string | ModifierReference>;
  onModifierChange: (modifiers: Array<string | ModifierReference>) => void;
}

export const ModifierSelector: React.FC<ModifierSelectorProps> = ({
  availableModifiers,
  selectedModifiers,
  onModifierChange,
}) => {
  const handleAddModifier = (modifierId: string) => {
    const modifier = availableModifiers.find(m => m.id === modifierId);
    if (modifier) {
      onModifierChange([...selectedModifiers, modifier]);
    }
  };

  const handleRemoveModifier = (index: number) => {
    onModifierChange(selectedModifiers.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      
      <Select onValueChange={handleAddModifier}>
        <SelectTrigger>
          <SelectValue placeholder="Add modifier" />
        </SelectTrigger>
        <SelectContent>
          {availableModifiers.map((modifier) => (
            <SelectItem key={modifier.id} value={modifier.id}>
              {modifier.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex flex-wrap gap-2">
        {selectedModifiers.map((modifier, index) => (
          <Badge
            key={typeof modifier === 'string' ? modifier : modifier.id}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {typeof modifier === 'string' ? modifier : modifier.name}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => handleRemoveModifier(index)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
};