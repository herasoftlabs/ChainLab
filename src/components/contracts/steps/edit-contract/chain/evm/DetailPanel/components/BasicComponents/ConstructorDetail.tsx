// components/contracts/steps/edit-contract/chain/evm/DetailPanel/BasicComponents/ConstructorDetail.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DetailComponentProps } from "@/components/contracts/steps/edit-contract/chain/evm/DetailPanel/shared/DetailComponentProps";
import {
  ConstructorComponentData,
  BasicDataType,
  FunctionParameter,
} from "@/types/evm/contractTypes";
import { nanoid } from "nanoid";
import { useProjectStore } from "@/stores/useProjectStore";
import { GitBranch, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface InheritedConstructorParam extends FunctionParameter {
  value: string;
}

interface InheritedConstructor {
  id: string;
  contractName: string;
  parameters: InheritedConstructorParam[];
  source: "project" | "openzeppelin"; // undefined olamaz
  version?: string; // optional olarak işaretledik
  isEnabled: boolean;
}

const basicDataTypes: BasicDataType[] = [
  "address",
  "bool",
  "string",
  "bytes",
  "uint8",
  "uint16",
  "uint32",
  "uint64",
  "uint128",
  "uint256",
  "int8",
  "int16",
  "int32",
  "int64",
  "int128",
  "int256",
  "bytes1",
  "bytes2",
  "bytes3",
  "bytes4",
  "bytes8",
  "bytes16",
  "bytes32",
];

export const ConstructorDetail: React.FC<DetailComponentProps> = ({
  data,
  onChange,
}) => {
  const constructorData = data as ConstructorComponentData;
  const currentContract = useProjectStore((state) => state.currentContract);
  const currentProject = useProjectStore((state) => state.currentProject);
  const updateContractInheritance = useProjectStore(
    (state) => state.updateContractInheritance
  );

  // Miras alınan constructor'ları tutacak state
  const [inheritedConstructors, setInheritedConstructors] = useState<
    InheritedConstructor[]
  >([]);

  useEffect(() => {
    if (currentContract?.inherits && currentProject) {
      const inherited = currentContract.inherits
        .filter(
          (
            inherit
          ): inherit is typeof inherit & {
            source: "project" | "openzeppelin";
          } => inherit.source === "project" || inherit.source === "openzeppelin"
        )
        .map((inherit) => {
          let parameters: InheritedConstructorParam[] = [];

          if (inherit.source === "project") {
            const parentContract = currentProject.contracts?.find(
              (c) => c.id === inherit.contractId
            );
            parameters =
              parentContract?.constructor?.parameters?.map((param) => ({
                ...param,
                value:
                  inherit.constructorParams?.find((p) => p.id === param.id)
                    ?.value || "",
              })) || [];
          } else {
            // Bu noktada inherit.source kesinlikle "openzeppelin"
            parameters =
              inherit.constructorParams?.map((param) => ({
                ...param,
                value: param.value || "",
              })) || [];
          }

          // Artık source kesinlikle "project" veya "openzeppelin"
          const constructorData: InheritedConstructor = {
            id: inherit.id,
            contractName: inherit.contractName,
            parameters,
            source: inherit.source,
            version: inherit.version,
            isEnabled: true,
          };

          return constructorData;
        });

      setInheritedConstructors(inherited);
    }
  }, [currentContract, currentProject]);

  const handleChange = (field: keyof ConstructorComponentData, value: any) => {
    const updatedData = { ...constructorData, [field]: value };

    // Body güncellenirken parent constructor çağrılarını da ekle
    if (field === "body") {
      updatedData.body = {
        content: value.content,
        dependencies: [...inheritedConstructors.map((c) => c.contractName)],
      };
    }

    onChange(updatedData);
  };

  const handleAddParameter = () => {
    const newParam: FunctionParameter = {
      id: nanoid(),
      name: "",
      type: "string",
    };
    handleChange("parameters", [
      ...(constructorData.parameters || []),
      newParam,
    ]);
  };

  const handleParameterChange = (
    index: number,
    field: keyof FunctionParameter,
    value: string
  ) => {
    const updatedParams = [...(constructorData.parameters || [])];
    updatedParams[index] = {
      ...updatedParams[index],
      [field]: value,
    };
    handleChange("parameters", updatedParams);
  };

  const handleRemoveParameter = (index: number) => {
    const updatedParams = (constructorData.parameters || []).filter(
      (_, i) => i !== index
    );
    handleChange("parameters", updatedParams);
  };

  const handleParentParamChange = (
    constructorId: string,
    paramId: string,
    value: string
  ) => {
    const updatedConstructors = inheritedConstructors.map((constructor) => {
      if (constructor.id === constructorId) {
        return {
          ...constructor,
          parameters: constructor.parameters.map((param) =>
            param.id === paramId ? { ...param, value } : param
          ),
        };
      }
      return constructor;
    });

    setInheritedConstructors(updatedConstructors);

    // Store'u güncelle
    if (currentContract && currentProject) {
      const updatedInheritance = currentContract.inherits?.map((inherit) => {
        if (inherit.id === constructorId) {
          return {
            ...inherit,
            constructorParams: inherit.constructorParams?.map((param) =>
              param.id === paramId ? { ...param, value } : param
            ),
          };
        }
        return inherit;
      });

      updateContractInheritance(
        currentProject.id,
        currentContract.id,
        updatedInheritance || []
      );
    }
  };

  const handleToggleConstructor = (constructorId: string) => {
    setInheritedConstructors((prev) =>
      prev.map((constructor) =>
        constructor.id === constructorId
          ? { ...constructor, isEnabled: !constructor.isEnabled }
          : constructor
      )
    );
  };

  const generateConstructorBody = () => {
    let body = "";

    inheritedConstructors
      .filter((constructor) => constructor.isEnabled)
      .forEach((constructor) => {
        const params = constructor.parameters
          .map((param) => param.value || `/* ${param.name} */`)
          .join(", ");
        body += `${constructor.contractName}(${params})\n`;
      });

    // Mevcut constructor parametreleri
    if (constructorData.parameters && constructorData.parameters.length > 0) {
      const params = constructorData.parameters
        .map((param) => `${param.name}: ${param.type}`)
        .join(", ");
      body += `\n// Current constructor parameters:\n// (${params})\n`;
    }

    // Kullanıcının yazdığı implementation
    if (constructorData.body?.content) {
      body += "\n" + constructorData.body.content;
    }

    return body;
  };

  return (
    <div className="space-y-6">
      {/* Inherited Constructors Section */}
      {inheritedConstructors.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-700">
              Parent Constructors
            </h3>
          </div>
          <div className="space-y-3">
            {inheritedConstructors.map((inherited) => (
              <Card
                key={inherited.id}
                className={cn("p-4", !inherited.isEnabled && "opacity-50")}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={inherited.isEnabled}
                      onCheckedChange={() =>
                        handleToggleConstructor(inherited.id)
                      }
                    />
                    <span className="text-sm font-medium">
                      {inherited.contractName}
                    </span>
                    <Badge variant="outline">Constructor</Badge>
                  </div>
                  {inherited.source === "openzeppelin" && (
                    <Badge variant="secondary">
                      OpenZeppelin v{inherited.version}
                    </Badge>
                  )}
                </div>
                {inherited.isEnabled && inherited.parameters.length > 0 && (
                  <div className="space-y-2">
                    {inherited.parameters.map((param) => (
                      <div key={param.id} className="flex items-center gap-2">
                        <Input
                          placeholder={`${param.name} (${param.type})`}
                          value={param.value}
                          onChange={(e) =>
                            handleParentParamChange(
                              inherited.id,
                              param.id,
                              e.target.value
                            )
                          }
                          disabled={!inherited.isEnabled}
                          className="text-sm"
                        />
                        <span className="text-xs text-gray-500 min-w-[80px]">
                          {param.type}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
          <Separator />
        </div>
      )}

      {/* Current Constructor Implementation */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ArrowRight className="h-4 w-4 text-gray-500" />
          <h3 className="text-sm font-medium text-gray-700">
            Constructor Implementation
          </h3>
        </div>

        {/* Parameters Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Parameters
          </label>
          <div className="space-y-2">
            {(constructorData.parameters || []).map((param, index) => (
              <div key={param.id} className="flex items-center gap-2">
                <Input
                  placeholder="Parameter Name"
                  value={param.name}
                  onChange={(e) =>
                    handleParameterChange(index, "name", e.target.value)
                  }
                />
                <Select
                  value={param.type}
                  onValueChange={(value) =>
                    handleParameterChange(index, "type", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {basicDataTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveParameter(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={handleAddParameter}>
              <Plus className="h-4 w-4 mr-2" /> Add Parameter
            </Button>
          </div>
        </div>

        {/* Implementation Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Implementation Body
          </label>
          <Textarea
            placeholder="Enter constructor implementation..."
            value={constructorData.body?.content || ""}
            onChange={(e) =>
              handleChange("body", {
                ...constructorData.body,
                content: e.target.value,
              })
            }
            className="min-h-[200px] font-mono text-sm"
          />
        </div>
      </div>
    </div>
  );
};
