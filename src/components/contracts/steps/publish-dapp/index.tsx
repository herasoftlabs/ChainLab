// components/contracts/steps/publish-dapp/index.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { TemplateCard } from '@/components/contracts/steps/publish-dapp/TemplateCard';
import { TemplatePreviewModal } from '@/components/contracts/steps/publish-dapp/TemplatePreviewModal';
import { SetupModal } from '@/components/contracts/steps/publish-dapp/SetupModal';
import { templateCategories } from '@/components/contracts/steps/publish-dapp/templates';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Sparkles } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  features: string[];
  demoUrl: string;
  isNew?: boolean;
  isPremium?: boolean;
}

const PublishDapp = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">
          dApp Template Gallery
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Choose from our collection of professional dApp templates and deploy your frontend in minutes
        </p>

        {/* Search Bar */}
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

      {/* Template Categories */}
      <Tabs defaultValue="all" className="space-y-8">
        <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 py-4">
          <TabsList className="w-full justify-start gap-2 overflow-x-auto flex-wrap h-auto p-2">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              All Templates
              <Badge variant="secondary" className="ml-2">
                {templateCategories.reduce((acc, cat) => acc + cat.templates.length, 0)}
              </Badge>
            </TabsTrigger>
            {templateCategories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center gap-2"
              >
                {category.icon}
                {category.name}
                <Badge variant="secondary" className="ml-2">
                  {category.templates.length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* All Templates Tab */}
        <TabsContent value="all" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templateCategories.map((category) => (
              <React.Fragment key={category.id}>
                {category.templates
                  .filter(template => 
                    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    template.description.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onPreview={() => {
                        setSelectedTemplate(template);
                        setIsPreviewOpen(true);
                      }}
                      onSetup={() => {
                        setSelectedTemplate(template);
                        setIsSetupOpen(true);
                      }}
                    />
                  ))}
              </React.Fragment>
            ))}
          </div>
        </TabsContent>

        {/* Category Tabs */}
        {templateCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.templates
                .filter(template =>
                  template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  template.description.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onPreview={() => {
                      setSelectedTemplate(template);
                      setIsPreviewOpen(true);
                    }}
                    onSetup={() => {
                      setSelectedTemplate(template);
                      setIsSetupOpen(true);
                    }}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Modals */}
      {selectedTemplate && (
        <>
          <TemplatePreviewModal
            template={selectedTemplate}
            open={isPreviewOpen}
            onOpenChange={setIsPreviewOpen}
          />
          <SetupModal
            template={selectedTemplate}
            open={isSetupOpen}
            onOpenChange={setIsSetupOpen}
          />
        </>
      )}
    </div>
  );
};

export default PublishDapp;