// src/components/contracts/ContractTopBar.tsx

import React from 'react';
import { Button } from '@/components/ui/button';

interface ContractTopBarProps {
  currentTab: string;
  tabLabels: Record<string, string>;
  projectName?: string;
  contractName?: string;
  onPreview?: () => void;
}

const ContractTopBar: React.FC<ContractTopBarProps> = ({
  currentTab,
  tabLabels,
  projectName,
  contractName,
  onPreview,
}) => {
  return (
    <header className="sticky top-0 z-10 flex justify-between h-14 items-center gap-1 border-b bg-background px-4">
      <h1 className="text-xl font-semibold">{tabLabels[currentTab]}</h1>
      <div className="flex gap-3 text-center">
        {projectName && (
          <small className="px-3 bg-gray-100 rounded-sm">{`Project Name : ${projectName}`}</small>
        )}
        {contractName && (
          <small className="px-3 bg-gray-100 rounded-sm">{`Contract Name : ${contractName}`}</small>
        )}
      </div>
      {/* Share Button */}
      <div>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto gap-1.5 text-sm hidden md:flex"
          onClick={onPreview}
        >
          Preview on Simulation
        </Button>
      </div>
    </header>
  );
};

export default ContractTopBar;
