// components/dashboard/CreateProjectModal.tsx

import React, { useState } from 'react';
import { useWebContainerStore } from '@/stores/useWebContainerStore';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { nanoid } from 'nanoid';
import { toast } from 'react-toastify';
import { Project, PlatformType } from '@/types/projectTypes';
import { useProjectStore } from '@/stores/useProjectStore';
import { SUPPORTED_PLATFORMS } from '@/utils/constants';

interface CreateProjectModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled?: boolean;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ 
  open, 
  setOpen, 
  disabled 
}) => {
  const { addProject, setCurrentProject } = useProjectStore();
  const { initializeProject, isReady } = useWebContainerStore();

  const [projectName, setProjectName] = useState('');
  const [selectedPlatformId, setSelectedPlatformId] = useState<PlatformType | ''>('');
  const [selectedChainId, setSelectedChainId] = useState<string>('');
  const [projectType, setProjectType] = useState<'App' | 'Game'>('App');
  const [isLoading, setIsLoading] = useState(false);
  const [initializationStatus, setInitializationStatus] = useState('');

  const [selectedChainKey, setSelectedChainKey] = useState<string>(''); 

  const enabledPlatforms = SUPPORTED_PLATFORMS.filter(p => p.enabled);
  const selectedPlatform = enabledPlatforms.find(p => p.id === selectedPlatformId);
  const availableChains = selectedPlatform?.chains || [];
  const selectedChain = availableChains.find(c => c.key === selectedChainKey);

  const handleCreateProject = async () => {
    if (!isReady) {
      toast.error('System not ready. Please wait.');
      return;
    }

    if (!selectedPlatform || !selectedChain) {
      toast.error('Select both a platform and chain.');
      return;
    }

    setIsLoading(true);
    setInitializationStatus('Creating project...');

    try {
      const projectId = nanoid(4);
      const folderName = projectName.toLowerCase().replace(/\s+/g, '-');
      
      if (!selectedChain) {
        throw new Error('Selected chain not found');
      }

      const newProject: Project = {
        id: projectId,
        name: projectName,
        createdAt: new Date().toISOString(),
        folderName,
        platform: selectedPlatform.id,
        chain: selectedChain,
        projectType,
        contracts: [],
      };

      setInitializationStatus('Preparing project files...');
      await initializeProject(projectId, projectName);

      setInitializationStatus('Saving project...');
      addProject(newProject);
      setCurrentProject(newProject);

      toast.success('Project created successfully!');
      setProjectName('');
      setSelectedPlatformId('');
      setSelectedChainId('');
      setProjectType('App');
      setOpen(false);
    } catch (error) {
      console.error('Project creation error:', error);
      toast.error(error instanceof Error ? error.message : 'Project creation error.');
    } finally {
      setIsLoading(false);
      setInitializationStatus('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>Enter project details</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Project Name */}
          <div>
            <label className="block mb-2">Project Name:</label>
            <Input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full"
              disabled={isLoading || disabled}
              placeholder="Enter project name"
            />
          </div>

          {/* Platform Selection */}
          <div>
            <label className="block mb-2">Select Platform:</label>
            <Select 
              value={selectedPlatformId} 
              onValueChange={(value: PlatformType) => {
                setSelectedPlatformId(value);
                setSelectedChainKey(''); 
              }}
              disabled={isLoading || disabled}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Platform" />
              </SelectTrigger>
              <SelectContent>
                {enabledPlatforms.map((platform) => (
                  <SelectItem key={platform.id} value={platform.id}>
                    {platform.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Chain Selection */}
          <div>
            <label className="block mb-2">Select Chain:</label>
            <Select 
              value={selectedChainKey}
              onValueChange={setSelectedChainKey}
              disabled={!selectedPlatformId || isLoading || disabled}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Chain" />
              </SelectTrigger>
              <SelectContent>
                {/* Mainnet Chains */}
                <div className="px-2 py-1.5 text-sm font-semibold">Mainnet</div>
                {availableChains
                  .filter(chain => !chain.testnet)
                  .map((chain) => (
                    <SelectItem key={chain.key} value={chain.key}>
                      <div className="flex items-center gap-2">
                        <img 
                          src={chain.icon || '/icons/chains/defaultchain.png'} 
                          alt={chain.name}
                          className="w-4 h-4"
                        />
                        <span>{chain.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                
                {/* Testnet Chains */}
                <div className="px-2 py-1.5 text-sm font-semibold mt-2">Testnet</div>
                {availableChains
                  .filter(chain => chain.testnet)
                  .map((chain) => (
                    <SelectItem key={chain.key} value={chain.key}>
                      <div className="flex items-center gap-2">
                        <img 
                          src={chain.icon || '/icons/chains/defaultchain.png'} 
                          alt={chain.name}
                          className="w-4 h-4"
                        />
                        <span>{chain.name}</span>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Project Type */}
          <div>
            <label className="block mb-2">Project Type:</label>
            <Select 
              value={projectType} 
              onValueChange={(value: 'App' | 'Game') => setProjectType(value)}
              disabled={!selectedChainKey || isLoading || disabled}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Project Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="App">Application</SelectItem>
                <SelectItem value="Game">Game</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Message */}
          {initializationStatus && (
            <div className="text-sm text-muted-foreground mt-2 p-2 border rounded-md bg-secondary">
              <div className="flex items-center space-x-2">
                {isLoading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                )}
                <span>{initializationStatus}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={isLoading || disabled}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateProject}
            disabled={
              !projectName || 
              !selectedPlatformId || 
              !selectedChainKey || 
              !projectType || 
              isLoading || 
              disabled || 
              !isReady
            }
          >
            {isLoading ? 'Creating...' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;
