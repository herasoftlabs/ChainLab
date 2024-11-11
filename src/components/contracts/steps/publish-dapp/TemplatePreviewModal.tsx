// components/contracts/steps/publish-dapp/TemplatePreviewModal.tsx

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ExternalLink, 
  Monitor, 
  Smartphone, 
  Tablet 
} from "lucide-react";
import { Template } from '@/types/frontendTemplate';

interface TemplatePreviewModalProps {
  template: Template;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  template,
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{template.name}</span>
            <div className="flex items-center gap-2 mr-5">
              {template.isNew && (
                <Badge variant="default" className="bg-green-500">New</Badge>
              )}
              {template.isPremium && (
                <Badge variant="default" className="bg-yellow-500">Premium</Badge>
              )}
            </div>
          </DialogTitle>
          <DialogDescription>{template.description}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="desktop" className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="desktop" className="flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                Desktop
              </TabsTrigger>
              <TabsTrigger value="tablet" className="flex items-center gap-2">
                <Tablet className="w-4 h-4" />
                Tablet
              </TabsTrigger>
              <TabsTrigger value="mobile" className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" /> {/* Mobile yerine Smartphone kullanıyoruz */}
                Mobile
              </TabsTrigger>
            </TabsList>

            <Button variant="outline" asChild>
              <a 
                href={template.demoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Open in New Tab
              </a>
            </Button>
          </div>

          <TabsContent value="desktop" className="h-full">
            <div className="rounded-lg border bg-background h-[calc(80vh-12rem)] overflow-hidden">
              <iframe
                src={template.demoUrl}
                className="w-full h-full"
                title={`${template.name} Preview`}
              />
            </div>
          </TabsContent>

          <TabsContent value="tablet" className="h-full">
            <div className="rounded-lg border bg-background h-[calc(80vh-12rem)] overflow-hidden flex items-center justify-center">
              <div className="w-[768px] h-full border-x">
                <iframe
                  src={template.demoUrl}
                  className="w-full h-full"
                  title={`${template.name} Tablet Preview`}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mobile" className="h-full">
            <div className="rounded-lg border bg-background h-[calc(80vh-12rem)] overflow-hidden flex items-center justify-center">
              <div className="w-[375px] h-full border-x">
                <iframe
                  src={template.demoUrl}
                  className="w-full h-full"
                  title={`${template.name} Mobile Preview`}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};