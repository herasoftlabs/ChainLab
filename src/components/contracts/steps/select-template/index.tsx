// components/contracts/steps/select-template/index.tsx

'use client';
import React, { useState } from 'react';
import { useCurrentProject, useProjectActions } from '@/stores/useProjectStore';
import { ethTemplates } from '@/data/templates/evmTemplate';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { useCurrentContract } from '@/stores/useProjectStore';
import { EthereumContract } from '@/types/evm/contractTypes';

interface SelectTemplateProps {
  setCurrentTab: (tab: string) => void;
}

const SelectTemplate: React.FC<SelectTemplateProps> = ({ setCurrentTab }) => {

  const currentProject = useCurrentProject();
  const currentContract = useCurrentContract();  
  const { updateContract, setCurrentContract } = useProjectActions();  

  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  if (!currentProject || !currentContract) {
    return <div>No project or contract found!</div>;
  }

 
  const isTemplateSelected = Boolean(currentContract.templateId);
  const isContractFilled = 
    currentContract.stateVariables.length > 0 || 
    currentContract.functions.length > 0;

  const disableTemplateSelection = isTemplateSelected || isContractFilled;
  const templates = currentProject.platform === 'EVM' ? ethTemplates : [];

  const handleTemplateSelect = (templateId: string) => {
    if (disableTemplateSelection) return;
    setSelectedTemplateId(templateId);
  };

  const handleContinue = () => {
    if (selectedTemplateId) {
      const selectedTemplate = templates.find(t => t.id === selectedTemplateId);
      
      if (selectedTemplate && currentContract) {
        
        const updatedContract: EthereumContract = {
          ...currentContract,
          ...selectedTemplate.contract,
          id: currentContract.id,
          name: currentContract.name,
          createdAt: currentContract.createdAt,
          templateId: selectedTemplate.id,
          templateName: selectedTemplate.name,
          documentation: `${currentContract.name} - Based on ${selectedTemplate.name} template\n${selectedTemplate.description}`,
          stateVariables: selectedTemplate.contract.stateVariables.map(sv => ({
            ...sv,
            type: 'variable' as const 
          })),
          constructor: undefined, 
          
          functions: [],
          events: [],
          errors: [],
          modifiers: [],
          structs: [],
          enums: [],
          mappings: [],
          arrays: [],
          integrations: [],
          securityFeatures: [],
          oracleIntegrations: [],
          externalCalls: [],
          componentLayout: {
            positions: {},
            connections: [],
          },
          
        };

        updateContract(currentProject.id, updatedContract);
        setCurrentContract(updatedContract);
      }
    }
    setCurrentTab('editContract');
  };


  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Select a template for "{currentContract.name}"
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={`
                relative cursor-pointer transition-all duration-200
                hover:shadow-md hover:border-primary/50
                ${selectedTemplateId === template.id ? 'border-primary ring-2 ring-primary/20' : ''}
                ${disableTemplateSelection ? 'opacity-50 pointer-events-none' : ''}
              `}
              onClick={() => handleTemplateSelect(template.id)}
            >
              {disableTemplateSelection && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm 
                  flex items-center justify-center rounded-lg">
                  <Lock className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <CardHeader>
                <CardTitle>{template.name}</CardTitle>
                <CardDescription className="mt-2">{template.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {disableTemplateSelection && (
          <p className="text-destructive text-center mt-4">
            Template selection is disabled. Contract already has content or template.
          </p>
        )}

        <div className="flex justify-center mt-6">
          <Button
            disabled={!selectedTemplateId && !disableTemplateSelection}
            onClick={handleContinue}
            size="lg"
          >
            Continue to Editor
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectTemplate;
