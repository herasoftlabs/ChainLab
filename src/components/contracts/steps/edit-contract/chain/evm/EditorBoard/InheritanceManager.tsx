import React, { useState } from 'react';
import { GitBranch, Save, Info, Code, Package, Braces, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { useProjectStore } from '@/stores/useProjectStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ContractInheritance, EthereumContract } from '@/types/evm/contractTypes';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card } from '@/components/ui/card';
import { Radio, Shield, Wrench } from 'lucide-react';
interface InheritanceManagerProps {
  onInheritanceChange: (inheritances: ContractInheritance[]) => void;
  currentInheritance?: ContractInheritance[];
  currentContractId: string;
}

interface ContractSummary {
  functions: number;
  stateVariables: number;
  events: number;
  modifiers: number;
}

export const InheritanceManager: React.FC<InheritanceManagerProps> = ({
  onInheritanceChange,
  currentInheritance = [],
  currentContractId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempInheritance, setTempInheritance] = useState<ContractInheritance[]>(currentInheritance);
  
  const currentProject = useProjectStore((state) => state.currentProject);
  const availableContracts = currentProject?.contracts?.filter(
    (c) => c.id !== currentContractId && !tempInheritance.some(i => i.contractId === c.id)
  ) || [];

  

  const handleContractSelect = (contract: EthereumContract) => {
    const newInheritance: ContractInheritance = {
      id: `inherit_${Date.now()}`,
      contractId: contract.id,
      contractName: contract.name,
    };
    
    setTempInheritance([...tempInheritance, newInheritance]);
  };

  

  const handleRemoveInheritance = (inheritanceId: string) => {
    setTempInheritance(
      tempInheritance.filter((inherit) => inherit.id !== inheritanceId)
    );
  };

  const handleSave = () => {
    onInheritanceChange(tempInheritance);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempInheritance(currentInheritance);
    setIsOpen(false);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2"
            >
              <GitBranch className="h-4 w-4" />
              Manage Inheritance
              {currentInheritance.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {currentInheritance.length}
                </Badge>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Manage contract inheritance relationships</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Manage Contract Inheritance</DialogTitle>
            <DialogDescription>
              Select contracts to inherit from and manage inheritance relationships
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            {/* Left Panel - Available Contracts */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Package className="h-4 w-4" />
                Available Contracts
              </h4>
              <ScrollArea className="h-[400px] border rounded-md p-2">
              
              {availableContracts.length > 0 ? (
                availableContracts.map((contract) => (
                  <Card
                    key={contract.id}
                    className="p-4 mb-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleContractSelect(contract)}
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-3">
                      <h5 className="font-medium">{contract.name}</h5>
                      {contract.abstract && (
                        <Badge variant="secondary">Abstract</Badge>
                      )}
                    </div>
                    
                    {/* Contract Components */}
                    <div className="space-y-3">

                      {/* Constructor */}
                      {contract.constructor && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                            <Wrench className="h-3 w-3" />
                            Constructor
                          </div>
                          <div className="text-xs px-2 py-1 bg-secondary rounded">
                            constructor
                            {contract.constructor.parameters && contract.constructor.parameters.length > 0 && (
                              <span className="text-muted-foreground ml-1">
                                ({contract.constructor.parameters.length} params)
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Functions */}
                      {contract.functions.length > 0 && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                            <Braces className="h-3 w-3" />
                            Functions
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            {contract.functions.slice(0, 4).map(func => (
                              <div key={func.id} className="text-xs px-2 py-1 bg-secondary rounded">
                                {func.name}
                              </div>
                            ))}
                            {contract.functions.length > 4 && (
                              <div className="text-xs text-muted-foreground px-2 py-1">
                                +{contract.functions.length - 4} more
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* State Variables */}
                      {contract.stateVariables.length > 0 && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                            <Database className="h-3 w-3" />
                            State Variables
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            {contract.stateVariables.slice(0, 4).map(variable => (
                              <div key={variable.id} className="text-xs px-2 py-1 bg-secondary rounded">
                                {variable.name}
                              </div>
                            ))}
                            {contract.stateVariables.length > 4 && (
                              <div className="text-xs text-muted-foreground px-2 py-1">
                                +{contract.stateVariables.length - 4} more
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Events */}
                      {contract.events.length > 0 && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                            <Radio className="h-3 w-3" />
                            Events
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            {contract.events.slice(0, 2).map(event => (
                              <div key={event.id} className="text-xs px-2 py-1 bg-secondary rounded">
                                {event.name}
                              </div>
                            ))}
                            {contract.events.length > 2 && (
                              <div className="text-xs text-muted-foreground px-2 py-1">
                                +{contract.events.length - 2} more
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Modifiers */}
                      {contract.modifiers.length > 0 && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                            <Shield className="h-3 w-3" />
                            Modifiers
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            {contract.modifiers.slice(0, 2).map(modifier => (
                              <div key={modifier.id} className="text-xs px-2 py-1 bg-secondary rounded">
                                {modifier.name}
                              </div>
                            ))}
                            {contract.modifiers.length > 2 && (
                              <div className="text-xs text-muted-foreground px-2 py-1">
                                +{contract.modifiers.length - 2} more
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer Stats */}
                    <div className="flex gap-4 mt-3 pt-3 border-t text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Braces className="h-3 w-3" />
                        {contract.functions.length}
                      </div>
                      <div className="flex items-center gap-1">
                        <Database className="h-3 w-3" />
                        {contract.stateVariables.length}
                      </div>
                      <div className="flex items-center gap-1">
                        <Radio className="h-3 w-3" />
                        {contract.events.length}
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        {contract.modifiers.length}
                      </div>
                    </div>
                  </Card>
                ))
                ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Package className="h-8 w-8 mb-2" />
                  <p className="text-sm">No available contracts to inherit from</p>
                </div>
                )}

              </ScrollArea>
            </div>

            {/* Right Panel - Inheritance Chain */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                Added Inheritance Contracts
              </h4>
              <ScrollArea className="h-[400px] border rounded-md p-2">
                {tempInheritance.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <GitBranch className="h-8 w-8 mb-2" />
                    <p className="text-sm">No inheritance selected</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {tempInheritance.map((inherit, index) => (
                      <Card key={inherit.id} className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {inherit.contractName}
                            </span>
                            {index === 0 && (
                              <Badge variant="secondary">Direct Parent</Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveInheritance(inherit.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};