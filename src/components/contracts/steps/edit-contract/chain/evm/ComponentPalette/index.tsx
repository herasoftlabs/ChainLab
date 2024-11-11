// components/contracts/steps/edit-contract/chain/evm/ComponentPalette/index.tsx

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
/* import { SearchBar } from './SearchBar'; */
import { CategoryAccordion } from './CategoryAccordion';
import { useComponentStore } from '@/stores/useComponentStore';

export const ComponentPalette: React.FC = () => {
  const activeCategory = useComponentStore((state) => state.activeCategory);
  const setActiveCategory = useComponentStore((state) => state.setActiveCategory);

  return (
    <div className="w-80 border-r border-gray-200 bg-white flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold mb-3">Components</h2>
        {/* <SearchBar /> */}
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4">
          <CategoryAccordion
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
      </ScrollArea>
    </div>
  );
};