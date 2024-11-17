// components/contracts/ContractSteps.tsx

import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import ContractSidebar from './ContractSidebar';
import SelectTemplate from './steps/select-template/index';
import EditContract from './steps/edit-contract';
import TestContract from './steps/test-contract/TestContract';
import DeployContract from './steps/deploy-contract/index';
import PublishDapp from './steps/publish-dapp';
import { useProjectStore } from '@/stores/useProjectStore';
import ContractTopBar from './ContractTopBar'; 

const tabLabels: Record<string, string> = {
  selectTemplate: 'Select Template',
  editContract: 'Edit Contract',
  testContract: 'Test Contract',
  deployContract: 'Deploy Contract',
  publishDapp: 'Publish DApp',
};

const ContractSteps: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('selectTemplate');
  const currentContract = useProjectStore((state) => state.currentContract);
  const currentContractName = useProjectStore((state) => currentContract?.name);
  const currentProject = useProjectStore((state) => state.currentProject);

  const handlePreview = () => {
    console.log('Preview on Simulation clicked');
  };

  return (
    <div className="flex w-full overflow-hidden">
     
      <ContractSidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
      />

      <div className="flex flex-1 flex-col ml-16 h-full overflow-hidden">
        <ContractTopBar
          currentTab={currentTab}
          tabLabels={tabLabels}
          projectName={currentProject?.name}
          contractName={currentContractName}
          onPreview={handlePreview}
        />

     
        <div className="flex-1 overflow-hidden h-full">
          <Tabs value={currentTab}>
            
            <TabsContent value="selectTemplate">
            {currentContract ? <SelectTemplate setCurrentTab={setCurrentTab} /> : <div>Please create a contract.</div>}          
            </TabsContent>

            <TabsContent value="editContract" className="bg-white">
              {currentContract ? <EditContract /> : <div>Please create a contract.</div>}
            </TabsContent>

            <TabsContent value="testContract">
              {currentContract ? <TestContract /> : <div>Please create a contract.</div>}
            </TabsContent>

            <TabsContent value="deployContract">
              {currentContract && currentProject?.id ? (
                <DeployContract />
              ) : (
                <div className="p-4 text-center">
                  <p className="text-muted-foreground">
                    Please create a contract and project to deploy.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="publishDapp">
              {currentContract ? <PublishDapp /> : <div>Please create a contract.</div>}
            </TabsContent>

          </Tabs>
        </div>
      </div>

    </div>
  );
};

export default ContractSteps;
