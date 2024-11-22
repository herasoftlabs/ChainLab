import React, { useState, useEffect } from "react";
import { X, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DraggableComponent } from "@/types/evm/contractTypes";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ConstructorDetail } from "./components/BasicComponents/ConstructorDetail";
import { ErrorDetail } from "./components/BasicComponents/ErrorDetail";
import { ModifierDetail } from "./components/BasicComponents/ModifierDetail";
import { StateVariableDetail } from "./components/BasicComponents/StateVariableDetail";
import { ArrayDetail } from "./components/DataStructures/ArrayDetail";
import { EnumDetail } from "./components/DataStructures/EnumDetail";
import { MappingDetail } from "./components/DataStructures/MappingDetail";
import { StructDetail } from "./components/DataStructures/StructDetail";
import { EventDetail } from "./components/Events/EventDetail";
import { FunctionDetail } from "./components/Functions/FunctionDetail";
import { DocumentationPanel } from "./Documentation";
import {
  isConstructorComponentData,
  isErrorComponentData,
  isModifierComponentData,
  isStateVariableComponentData,
  isArrayComponentData,
  isEnumComponentData,
  isMappingComponentData,
  isStructComponentData,
  isEventComponentData,
  isFunctionComponentData,
} from "@/types/evm/contractTypes";

interface DetailPanelProps {
  isOpen: boolean;
  component: DraggableComponent | null;
  onClose: () => void;
  onUpdate: (componentId: string, updates: Partial<DraggableComponent>) => void;
  onDelete: (componentId: string) => void;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({
  isOpen,
  component,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const [localComponentData, setLocalComponentData] = useState(component?.data);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] =
    useState(false);

  useEffect(() => {
    setLocalComponentData(component?.data);
    setHasUnsavedChanges(false);
  }, [component]);

  useEffect(() => {
    if (!component || !localComponentData) return;
    const isEqual =
      JSON.stringify(localComponentData) === JSON.stringify(component.data);
    setHasUnsavedChanges(!isEqual);
  }, [localComponentData, component?.data]);

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedChangesDialog(true);
    } else {
      onClose();
    }
  };

  const handleDelete = (componentId: string) => {
    if (!component || !localComponentData) return;
    onDelete(componentId);
    setHasUnsavedChanges(false);
  };

  const handleChange = (updates: Partial<any>) => {
    if (!localComponentData) return;
    setLocalComponentData({
      ...localComponentData,
      ...updates,
    });
  };

  const handleSave = () => {
    if (!component || !localComponentData) return;
    onUpdate(component.id, { data: localComponentData });
    setHasUnsavedChanges(false);
  };

  const renderComponentForm = () => {
    if (!localComponentData) return null;
    const commonProps = {
      data: localComponentData,
      onChange: handleChange,
    };

    switch (true) {
      case isConstructorComponentData(localComponentData):
        return <ConstructorDetail {...commonProps} />;
      case isErrorComponentData(localComponentData):
        return <ErrorDetail {...commonProps} />;
      case isModifierComponentData(localComponentData):
        return <ModifierDetail {...commonProps} />;
      case isStateVariableComponentData(localComponentData):
        return <StateVariableDetail {...commonProps} />;
      case isArrayComponentData(localComponentData):
        return <ArrayDetail {...commonProps} />;
      case isEnumComponentData(localComponentData):
        return <EnumDetail {...commonProps} />;
      case isMappingComponentData(localComponentData):
        return <MappingDetail {...commonProps} />;
      case isStructComponentData(localComponentData):
        return <StructDetail {...commonProps} />;
      case isEventComponentData(localComponentData):
        return <EventDetail {...commonProps} />;
      case isFunctionComponentData(localComponentData):
        return <FunctionDetail {...commonProps} />;
      default:
        return <p className="text-sm text-gray-500">Unknown component type.</p>;
    }
  };

  if (!component || !localComponentData) return null;

  return (
    <div
      className={cn(
        "w-96 border-l border-gray-200 bg-white h-full",
        "transition-all duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex flex-col gap-2 min-w-0 flex-1 mr-4">
            <div className="flex items-start gap-1 text-sm text-gray-500 flex-wrap">
              <p className="flex-shrink-0">Component Name:</p>
              <Badge
                className="text-xs shadow-sm break-all"
                variant="secondary"
              >
                {localComponentData.name}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <p className="flex-shrink-0">Type:</p>
              <Badge className="text-xs shadow-sm" variant="secondary">
                {localComponentData.type}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="properties" className="flex-1 flex flex-col">
          <TabsList className="w-full justify-start px-4 py-2 border-b">
            <TabsTrigger value="properties">
              Properties{" "}
              {hasUnsavedChanges && <span className="text-red-500">*</span>}
            </TabsTrigger>
            <TabsTrigger value="code">Preview</TabsTrigger>
            <TabsTrigger value="documentation">Docs</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="properties" className="h-full mt-0 border-0">
              <ScrollArea className="h-[calc(100vh-220px)]">
                {" "}
                <div className="p-4 space-y-4">{renderComponentForm()}</div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="code" className="h-full overflow-auto p-4">
              Coming soon.
            </TabsContent>

            <TabsContent value="documentation" className="h-full overflow-auto">
              <DocumentationPanel data={localComponentData} />
            </TabsContent>
          </div>

          <div className="flex-none p-4 border-t border-gray-200 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(component.id)}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Component
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" /> Save Component
              </Button>
            </div>
            {hasUnsavedChanges && (
              <div className="text-red-500 text-xs bg-red-200 p-3 rounded text-center">
                Warning: There are unsaved changes
              </div>
            )}
          </div>
        </Tabs>
      </div>

      <Dialog
        open={showUnsavedChangesDialog}
        onOpenChange={setShowUnsavedChangesDialog}
      >
        <DialogContent>
          <DialogTitle>Unsaved Changes</DialogTitle>
          <DialogDescription>
            You have unsaved changes. Do you want to save before closing?
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowUnsavedChangesDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowUnsavedChangesDialog(false);
                onClose();
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
    </div>
  );
};
