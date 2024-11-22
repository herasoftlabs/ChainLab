// components/contracts/ContractSidebar.tsx

import React from "react";
import { useRouter } from "next/navigation";

import {
  ChevronLeft,
  FilePlus,
  Edit,
  TestTube,
  Upload,
  Rocket,
} from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface ContractSidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const tabs = [
  { value: "selectTemplate", label: "Select Template", icon: FilePlus },
  { value: "editContract", label: "Edit Contract", icon: Edit },
  { value: "testContract", label: "Test Contract", icon: TestTube },
  { value: "deployContract", label: "Deploy Contract", icon: Upload },
  { value: "publishDapp", label: "Publish DApp", icon: Rocket },
];

const ContractSidebar: React.FC<ContractSidebarProps> = ({
  currentTab,
  setCurrentTab,
}) => {
  const router = useRouter();

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex h-full w-16 flex-col border-r bg-white">
      {/* Top Icon - Back to Project Details */}
      <div className="border-b p-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="Back to Project"
                onClick={() => router.push("/dashboard")}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Back to Project
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Tab Icons */}
      <nav className="flex flex-1 flex-col items-center p-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.value;

          return (
            <TooltipProvider key={tab.value}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "rounded-lg mb-2",
                      isActive
                        ? "bg-primary text-white"
                        : "hover:bg-primary hover:text-white",
                      "transition-colors duration-200"
                    )}
                    aria-label={tab.label}
                    onClick={() => setCurrentTab(tab.value)}
                  >
                    <Icon className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={5}>
                  {tab.label}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </nav>
    </aside>
  );
};

export default ContractSidebar;
