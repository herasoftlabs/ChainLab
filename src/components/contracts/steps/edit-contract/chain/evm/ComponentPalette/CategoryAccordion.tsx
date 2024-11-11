// components/contracts/steps/edit-contract/chain/evm/ComponentPalette/CategoryAccordion.tsx
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ComponentItem } from './ComponentItem';
import { 
  ComponentCategory, 
  ComponentCategoryMain, 
  SubCategoryType, 
  ComponentType,
  BodyContent,
  Mutability
} from '@/types/evm/contractTypes'; 
import { CategoryHeader } from './CategoryHeader';
import { evmCategories } from '@/data/menu/evm';

interface Props {
  activeCategory: ComponentCategory['main'] | null;
  onCategoryChange: (category: ComponentCategory['main']) => void;
}

export interface Template {
  id: string;
  type: ComponentType;
  name: string;
  description: string;
  body: BodyContent;
  dataType?: string;
  stateMutability?: Mutability;
}

export const CategoryAccordion: React.FC<Props> = ({
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      value={activeCategory || undefined}
      onValueChange={(value) => onCategoryChange(value as ComponentCategory['main'])}
    >
      {Object.entries(evmCategories).map(([key, category]) => (
        <AccordionItem key={key} value={key}>
          <AccordionTrigger className="text-sm font-medium px-2">
            <CategoryHeader title={category.title} icon={category.icon} />
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {Object.entries(category.subCategories).map(([subKey, subCategory]) => (
                <div key={subKey} className="mb-4">
                  <div className="text-sm font-medium mt-2 mb-1">
                    {subCategory.title}
                  </div>
                  <div className="space-y-1">
                    {subCategory.templates.map((template: Template) => (
                      <ComponentItem 
                        key={template.id}
                        id={template.id}
                        type={template.type}
                        name={template.name}
                        description={template.description}
                        category={key as ComponentCategoryMain}
                        subcategory={subKey as SubCategoryType}
                        dataType={template.dataType}
                        stateMutability={template.stateMutability}
                        icon={category.icon} 
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};