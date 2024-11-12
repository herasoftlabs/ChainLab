// components/dashboard/CreateContractModal.tsx

'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { nanoid } from 'nanoid'
import { useCurrentProject, useProjectActions } from '@/stores/useProjectStore';
import { useWebContainerStore } from '@/stores/useWebContainerStore';
import { toast } from 'react-toastify';
import { EthereumContract } from '@/types/evm/contractTypes';
import { contractToComponents } from '@/utils/chains/evm/contractToComponents';
import { useComponentStore } from '@/stores/useComponentStore';

interface CreateContractModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled?: boolean;
}

const CreateContractModal: React.FC<CreateContractModalProps> = ({ 
  open, 
  setOpen,
  disabled 
}) => {
  const [contractName, setContractName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const currentProject = useCurrentProject();
  const { addContractToProject } = useProjectActions();
  const importComponents = useComponentStore((state) => state.importComponents);
  
  const { 
    isReady,
    writeFile,
    ensureProjectStructure,
    printProjectStructure 
  } = useWebContainerStore();

  const createEvmContract = async () => {
    const newContract: EthereumContract = {
      id: nanoid(3),
      name: contractName, 
      version: "0.8.19",
      license: "MIT",
      documentation: `Contract for ${contractName}`,
      createdAt: new Date().toISOString(),
      
      constructor: undefined,
      stateVariables: [],
      functions: [],
      events: [],
      errors: [],
      modifiers: [],
      structs: [],
      enums: [],
      mappings: [],
      arrays: [],
      integrations: [],
      
      abstract: false,
      inherits: [],
      securityFeatures: [],
      oracleIntegrations: [],
      externalCalls: [],
      usingFor: [],
      
      componentLayout: {
        positions: {},
        connections: []
      }
    };

    // Contract bileşenlerini ComponentStore'a aktar
    const components = contractToComponents(newContract);
    importComponents(Object.values(components));

    // Contract'ı Web Container'a yaz
    const contractPath = `/projects/${currentProject!.id}/contracts/${contractName}.sol`;
    const solidityCode = "// SPDX-License-Identifier: MIT\npragma solidity ^0.8.19;\n\ncontract " + contractName + " {\n\n}";
    await writeFile(contractPath, solidityCode);

    return newContract;
  };

  const createSolanaContract = async () => {
    // Solana contract oluşturma mantığı
    throw new Error('Solana contracts are not supported yet');
  };

  const handleCreateContract = async () => {
    if (!currentProject || !isReady) {
      toast.error('Project or system is not ready');
      return;
    }

    setIsLoading(true);

    try {
      await ensureProjectStructure(currentProject.id);
      
      let newContract;

      switch (currentProject.platform) {
        case 'EVM':
          newContract = await createEvmContract();
          break;
        case 'Solana':
          newContract = await createSolanaContract();
          break;
        default:
          throw new Error(`Unsupported platform: ${currentProject.platform}`);
      }

      addContractToProject(currentProject.id, newContract);
      
      const structure = await printProjectStructure(currentProject.id);
      console.log('File Structure:', structure);

      toast.success('Contract created successfully!');
    } catch (error) {
      console.error('Contract creation error:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred while creating the contract!');
    } finally {
      setIsLoading(false);
      setContractName('');
      setOpen(false);
    }
  };

  const getModalTitle = () => {
    switch (currentProject?.platform) {
      case 'EVM':
        return 'Create New Smart Contract';
      case 'Solana':
        return 'Create New Program';
      default:
        return 'Create New Contract';
    }
  };

  const getInputPlaceholder = () => {
    switch (currentProject?.platform) {
      case 'EVM':
        return 'MyContract';
      case 'Solana':
        return 'MyProgram';
      default:
        return 'Enter name';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{getModalTitle()}</DialogTitle>
          <DialogDescription>
            Please enter a name for your {currentProject?.platform === 'Solana' ? 'program' : 'contract'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block mb-2">
              {currentProject?.platform === 'Solana' ? 'Program Name:' : 'Contract Name:'}
            </label>
            <Input
              type="text"
              value={contractName}
              onChange={(e) => setContractName(e.target.value)}
              className="w-full"
              disabled={isLoading || disabled || !isReady}
              placeholder={getInputPlaceholder()}
            />
          </div>
          
          {!isReady && (
            <div className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
              System preparing, please wait...
            </div>
          )}

          {currentProject?.platform === 'Solana' && (
            <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
              Note: Solana program support is coming soon.
            </div>
          )}
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={isLoading || disabled}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateContract} 
            disabled={
              !contractName || 
              isLoading || 
              disabled || 
              !isReady || 
              currentProject?.platform === 'Solana'
            }
          >
            {isLoading ? 'Creating...' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateContractModal;