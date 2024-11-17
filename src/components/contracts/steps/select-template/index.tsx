// components/contracts/steps/select-template/index.tsx
'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCurrentProject, useProjectActions, useCurrentContract } from '@/stores/useProjectStore';
import { ethTemplates } from '@/data/templates/evmTemplate';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Sparkles, Lock, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TemplateCard } from './TemplateCard';
import { EthereumContract } from '@/types/evm/contractTypes';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const templateCategories = [
  { id: 'defi', name: 'DeFi', icon: '💰' },
  { id: 'nft', name: 'NFT', icon: '🎨' },
  { id: 'dao', name: 'DAO', icon: '🏛️' },
  { id: 'gaming', name: 'Gaming', icon: '🎮' },
  { id: 'utility', name: 'Utility', icon: '🛠️' },
];

interface SelectTemplateProps {
  setCurrentTab: (tab: string) => void;
}

const SelectTemplate: React.FC<SelectTemplateProps> = ({ setCurrentTab }) => {
  const currentProject = useCurrentProject();
  const currentContract = useCurrentContract();
  const { updateContract, setCurrentContract } = useProjectActions();
  
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  

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

  const handleContinue = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!selectedTemplateId) return;
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

        stateVariables: selectedTemplate.contract.stateVariables,
        functions: selectedTemplate.contract.functions,
        events: selectedTemplate.contract.events,
        errors: selectedTemplate.contract.errors,
        modifiers: selectedTemplate.contract.modifiers,
        structs: selectedTemplate.contract.structs,
        enums: selectedTemplate.contract.enums,
        mappings: selectedTemplate.contract.mappings,
        arrays: selectedTemplate.contract.arrays,
        integrations: selectedTemplate.contract.integrations,
        securityFeatures: selectedTemplate.contract.securityFeatures || [],
        oracleIntegrations: selectedTemplate.contract.oracleIntegrations || [],
        externalCalls: selectedTemplate.contract.externalCalls || [],
        constructor: selectedTemplate.contract.constructor,
        
        componentLayout: selectedTemplate.contract.componentLayout || {
          positions: {},
          connections: [],
        },
        
      };
      updateContract(currentProject.id, updatedContract);
      setCurrentContract(updatedContract);
      setCurrentTab('editContract');
    }
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">
          Select Contract Template
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Choose a template for "{currentContract.name}" to kickstart your smart contract development
        </p>

        {disableTemplateSelection && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Template selection is disabled. Contract already has content or template.
            </AlertDescription>
          </Alert>
        )}

        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search templates..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </motion.div>

      <Tabs defaultValue="all" className="space-y-8">
        <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 py-4">
          <TabsList className="w-full justify-start gap-2 overflow-x-auto flex-wrap h-auto p-2">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              All Templates
              <Badge variant="secondary" className="ml-2">
                {templates.length}
              </Badge>
            </TabsTrigger>
            {templateCategories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center gap-2"
              >
                <span>{category.icon}</span>
                {category.name}
                <Badge variant="secondary" className="ml-2">
                  {templates.filter(t => t.category === category.id).length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="all" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplateId === template.id}
                isDisabled={disableTemplateSelection}
                onSelect={() => handleTemplateSelect(template.id)}
              />
            ))}
          </div>
        </TabsContent>

        {templateCategories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates
                .filter(t => t.category === category.id)
                .map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    isSelected={selectedTemplateId === template.id}
                    isDisabled={disableTemplateSelection}
                    onSelect={() => handleTemplateSelect(template.id)}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {selectedTemplateId && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-0 right-0 flex justify-center"
        >
          <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 rounded-lg shadow-lg border">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Template selected: {templates.find(t => t.id === selectedTemplateId)?.name}
              </span>
              <Button 
                onClick={handleContinue}
                className="px-8"
              >
                Continue to Editor
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SelectTemplate;