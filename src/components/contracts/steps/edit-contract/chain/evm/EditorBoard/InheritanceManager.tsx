import React, { useState } from "react";
import {
  GitBranch,
  Save,
  Package,
  Braces,
  Database,
  Radio,
  Shield,
  Wrench,
  Library,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useProjectStore } from "@/stores/useProjectStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ContractInheritance,
  EthereumContract,
  OpenZeppelinContract,
} from "@/types/evm/contractTypes";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  openZeppelinContracts,
  getContractsByCategory,
} from "@/data/openzeppelin/contracts";
import { contractLibraries } from "@/data/contractLibraries";
import { cn } from "@/lib/utils";

type OpenZeppelinCategory =
  | "access"
  | "token"
  | "security"
  | "governance"
  | "utils";

interface InheritanceManagerProps {
  onInheritanceChange: (inheritances: ContractInheritance[]) => void;
  currentInheritance?: ContractInheritance[];
  currentContractId: string;
}

export const InheritanceManager: React.FC<InheritanceManagerProps> = ({
  onInheritanceChange,
  currentInheritance = [],
  currentContractId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showOpenZeppelin, setShowOpenZeppelin] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    OpenZeppelinCategory | "all"
  >("all");
  const [tempInheritance, setTempInheritance] =
    useState<ContractInheritance[]>(currentInheritance);
  const [selectedLibrary, setSelectedLibrary] =
    useState<string>("openzeppelin");

  const currentProject = useProjectStore((state) => state.currentProject);
  const availableContracts =
    currentProject?.contracts?.filter(
      (c) =>
        c.id !== currentContractId &&
        !tempInheritance.some((i) => i.contractId === c.id)
    ) || [];

  const filteredOpenZeppelinContracts = openZeppelinContracts.filter(
    (contract): contract is OpenZeppelinContract =>
      // Seçili kütüphaneye ait contract'ları göster
      selectedLibrary === "openzeppelin" &&
      // Zaten eklenmiş contract'ları filtrele
      !tempInheritance.some((inherit) => inherit.contractId === contract.id)
  );

  const ContractSourceSegment = () => {
    return (
      <div className="flex p-1 bg-gray-100 rounded-lg mb-4">
        <button
          onClick={() => setShowOpenZeppelin(false)}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all",
            !showOpenZeppelin
              ? "bg-white shadow-sm text-gray-900"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          <Package className="h-4 w-4" />
          Project
        </button>
        <button
          onClick={() => setShowOpenZeppelin(true)}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all",
            showOpenZeppelin
              ? "bg-white shadow-sm text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          <Library className="h-4 w-4" />
          Library
        </button>
      </div>
    );
  };

  const EmptyState = ({
    icon: Icon,
    message,
    description,
  }: {
    icon: LucideIcon;
    message: string;
    description?: string;
  }) => (
    <div className="flex flex-col items-center justify-center h-[360px] text-gray-500">
      <Icon className="h-8 w-8 mb-2" />
      <p className="text-sm font-medium">{message}</p>
      {description && (
        <p className="text-xs text-gray-400 mt-1">{description}</p>
      )}
    </div>
  );

  const LibrarySelector = () => {
    return (
      <div className="space-y-4">
        {/* Library Selection */}
        <div className="flex gap-2">
          {contractLibraries.map((library) => (
            <button
              key={library.id}
              onClick={() => setSelectedLibrary(library.id)}
              className={cn(
                "flex-1 px-4 py-3 rounded-lg border transition-all",
                selectedLibrary === library.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <div className="flex items-center gap-2">
                <Library
                  className={cn(
                    "h-4 w-4",
                    selectedLibrary === library.id
                      ? "text-blue-500"
                      : "text-gray-500"
                  )}
                />
                <span
                  className={cn(
                    "text-sm font-medium",
                    selectedLibrary === library.id
                      ? "text-blue-700"
                      : "text-gray-700"
                  )}
                >
                  {library.name}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">v{library.version}</p>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const handleContractSelect = (
    contract: EthereumContract | OpenZeppelinContract,
    source: "project" | "openzeppelin"
  ) => {
    const newInheritance: ContractInheritance = {
      id: `inherit_${Date.now()}`,
      contractId: contract.id,
      contractName: contract.name,
      source: source,
      version: source === "openzeppelin" ? contract.version : undefined,
      constructorParams:
        source === "project"
          ? (contract as EthereumContract).constructor?.parameters
          : source === "openzeppelin" && "components" in contract
          ? contract.components.constructor?.parameters
          : undefined,
    };
    setTempInheritance([...tempInheritance, newInheritance]);
  };

  const handleRemoveInheritance = (inheritanceId: string) => {
    setTempInheritance(
      tempInheritance.filter((inherit) => inherit.id !== inheritanceId)
    );
  };

  const updateContractInheritance = useProjectStore(
    (state) => state.updateContractInheritance
  );

  const handleSave = () => {
    if (currentProject?.id) {
      updateContractInheritance(
        currentProject.id,
        currentContractId,
        tempInheritance
      );
      onInheritanceChange(tempInheritance);
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempInheritance(currentInheritance);
    setIsOpen(false);
  };

  const renderContractCard = (
    contract: EthereumContract | OpenZeppelinContract,
    source: "project" | "openzeppelin"
  ) => {
    if (source === "project" && "functions" in contract) {
      return (
        <Card
          key={contract.id}
          className="p-4 mb-3 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => handleContractSelect(contract, "project")}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <h5 className="font-medium">{contract.name}</h5>
            {contract.abstract && <Badge variant="secondary">Abstract</Badge>}
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
                  {contract.constructor.parameters &&
                    contract.constructor.parameters.length > 0 && (
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
                  {contract.functions.slice(0, 4).map((func) => (
                    <div
                      key={func.id}
                      className="text-xs px-2 py-1 bg-secondary rounded"
                    >
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
                  {contract.stateVariables.slice(0, 4).map((variable) => (
                    <div
                      key={variable.id}
                      className="text-xs px-2 py-1 bg-secondary rounded"
                    >
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
                  {contract.events.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className="text-xs px-2 py-1 bg-secondary rounded"
                    >
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
                  {contract.modifiers.slice(0, 2).map((modifier) => (
                    <div
                      key={modifier.id}
                      className="text-xs px-2 py-1 bg-secondary rounded"
                    >
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
      );
    }

    if (source === "openzeppelin" && "components" in contract) {
      return (
        <Card
          key={contract.id}
          className="p-4 cursor-pointer hover:bg-gray-50 transition-all duration-200 border-l-4 border-l-blue-500"
          onClick={() => handleContractSelect(contract, "openzeppelin")}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="space-y-1">
              <h5 className="font-medium flex items-center gap-2">
                {contract.name}
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700"
                >
                  {contract.category}
                </Badge>
              </h5>
              <p className="text-sm text-gray-600">{contract.description}</p>
            </div>
            <Badge variant="outline" className="text-blue-600">
              v{contract.version}
            </Badge>
          </div>

          {/* Constructor Information */}
          {contract.components.constructor && (
            <div className="mt-3 p-2 bg-gray-50 rounded-md">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                <Wrench className="h-3 w-3" />
                Constructor
              </div>
              {contract.components.constructor.parameters.length > 0 && (
                <div className="mt-1 text-xs text-gray-600">
                  Parameters:{" "}
                  {contract.components.constructor.parameters
                    .map((p) => p.name)
                    .join(", ")}
                </div>
              )}
            </div>
          )}

          {/* Components Summary */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            {contract.components.functions.length > 0 && (
              <div className="flex items-center gap-2 text-xs bg-gray-50 p-2 rounded">
                <Braces className="h-3 w-3 text-gray-500" />
                <span className="font-medium">
                  {contract.components.functions.length}
                </span>
                <span className="text-gray-600">Functions</span>
              </div>
            )}
            {contract.components.events.length > 0 && (
              <div className="flex items-center gap-2 text-xs bg-gray-50 p-2 rounded">
                <Radio className="h-3 w-3 text-gray-500" />
                <span className="font-medium">
                  {contract.components.events.length}
                </span>
                <span className="text-gray-600">Events</span>
              </div>
            )}
            {contract.components.modifiers.length > 0 && (
              <div className="flex items-center gap-2 text-xs bg-gray-50 p-2 rounded">
                <Shield className="h-3 w-3 text-gray-500" />
                <span className="font-medium">
                  {contract.components.modifiers.length}
                </span>
                <span className="text-gray-600">Modifiers</span>
                {/* Modifier listesi */}
                <div className="mt-1 text-xs text-gray-500">
                  {contract.components.modifiers.map((m) => m.name).join(", ")}
                </div>
              </div>
            )}
            {contract.components.stateVariables.length > 0 && (
              <div className="flex items-center gap-2 text-xs bg-gray-50 p-2 rounded">
                <Database className="h-3 w-3 text-gray-500" />
                <span className="font-medium">
                  {contract.components.stateVariables.length}
                </span>
                <span className="text-gray-600">State Variables</span>
              </div>
            )}
          </div>
        </Card>
      );
    }
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
              Select contracts to inherit from and manage inheritance
              relationships
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            {/* Left Panel */}
            <div className="space-y-4">
              <ContractSourceSegment />
              <ScrollArea className="h-[400px]">
                {showOpenZeppelin ? (
                  <>
                    <LibrarySelector />
                    <div className="mt-4 space-y-3">
                      {filteredOpenZeppelinContracts.map((contract) =>
                        renderContractCard(contract, "openzeppelin")
                      )}
                      {filteredOpenZeppelinContracts.length === 0 && (
                        <EmptyState
                          icon={Library}
                          message="No contracts found"
                          description={
                            selectedCategory !== "all"
                              ? "Try changing the category filter"
                              : "No contracts available in this library"
                          }
                        />
                      )}
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    {availableContracts.map((contract) =>
                      renderContractCard(contract, "project")
                    )}
                    {availableContracts.length === 0 && (
                      <EmptyState
                        icon={Package}
                        message="No available contracts to inherit from"
                      />
                    )}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Right Panel */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                Added Inheritance Contracts
              </h4>
              <ScrollArea className="h-[400px] border rounded-md p-2">
                {tempInheritance.length === 0 ? (
                  <EmptyState
                    icon={GitBranch}
                    message="No inheritance selected"
                  />
                ) : (
                  <div className="space-y-2">
                    {tempInheritance.map((inherit, index) => (
                      <Card key={inherit.id} className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {inherit.contractName}
                            </span>
                            {inherit.source === "openzeppelin" && (
                              <Badge variant="secondary">
                                OpenZeppelin v{inherit.version}
                              </Badge>
                            )}
                            {index === 0 && (
                              <Badge variant="outline">Direct Parent</Badge>
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
