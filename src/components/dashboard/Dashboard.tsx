// components/dashboard/Dashboard.tsx

'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ReloadIcon } from "@radix-ui/react-icons";
import DashboardCard from './DashboardCard';
import CreateContractModal from './CreateContractModal';
import CreateProjectModal from './CreateProjectModal';
import { useCurrentProject, useProjectActions } from '@/stores/useProjectStore';
import { useWebContainerStore } from '@/stores/useWebContainerStore';
import { FileTreeView } from './FileTreeView';
import { toast } from 'react-toastify';
import { ChainIcon } from '@/components/ui/ChainIcon';
import { 
  CalendarIcon, 
  LinkIcon, 
  LayersIcon, 
  BoxIcon,
  ExternalLinkIcon,
  GitBranchIcon,
  ActivityIcon,
  CodeIcon
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { PlatformType, Chain } from '@/types/projectTypes';
import { findChainByIdAndKey, PLATFORM_COLORS } from '@/utils/constants';
interface FileTreeItem {
  name: string;
  type: 'file' | 'directory';
  children?: FileTreeItem[];
}

const Dashboard = () => {
  const currentProject = useCurrentProject();
  const { removeContractFromProject } = useProjectActions();
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [fileStructure, setFileStructure] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const {  
    isReady, 
    printProjectStructure,
    deleteFile  
  } = useWebContainerStore();

  const getPlatformBadge = (platform: PlatformType) => {
    return (
      <Badge 
        className={`${PLATFORM_COLORS[platform]} text-xs`}
        variant="secondary"
      >
        {platform}
      </Badge>
    );
  };

  
  const getChainInfo = (chain: Chain) => {
    return (
      <span className="flex flex-row space-x-1 items-center"> 
        <ChainIcon 
          chainId={chain.id}
          chainKey={chain.key}
          size={16} 
          className="shrink-0"
        />
        <span>{chain.name}</span>
        {chain.testnet && (
          <Badge variant="outline" className="text-xs">
            Testnet
          </Badge>
        )}
      </span>
    );
  };

  const parseFileStructure = (structure: string): FileTreeItem[] => {
    const lines = structure.split('\n').filter(line => line.trim());
    const root: FileTreeItem[] = [];
    const stack: { item: FileTreeItem; level: number }[] = [];
    
    lines.forEach(line => {
      const level = line.search(/\S/) / 2;
      const content = line.trim();
      
      const item: FileTreeItem = {
        name: content.substring(4),
        type: content.startsWith('[D]') ? 'directory' : 'file',
        children: content.startsWith('[D]') ? [] : undefined
      };
      
      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }
      
      if (stack.length === 0) {
        root.push(item);
      } else {
        const parent = stack[stack.length - 1].item;
        if (parent.children) {
          parent.children.push(item);
        }
      }
      
      if (item.type === 'directory') {
        stack.push({ item, level });
      }
    });
    
    return root;
  };
  
  const loadFileStructure = async () => {
    if (!currentProject || !isReady) return;
    setIsLoading(true);
    try {
      const structure = await printProjectStructure(currentProject.id);
      setFileStructure(structure);
    } catch (error) {
      console.error('Error loading file structure:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isReady && currentProject) {
      loadFileStructure();
    }
  }, [isReady, currentProject]);
  
  const handleDeleteContract = async (contractId: string) => {
    if (!currentProject) return;
    try {
      const contractToDelete = currentProject.contracts?.find(c => c.id === contractId);
      if (!contractToDelete) {
        throw new Error('Contract not found!');
      }
      const contractPath = `/projects/${currentProject.id}/contracts/${contractToDelete.name}.sol`;
      await deleteFile(contractPath);
      removeContractFromProject(currentProject.id, contractId);
      await loadFileStructure();
      toast.success('Contract deleted successfully!');
    } catch (error) {
      console.error('Contract deletion error:', error);
      toast.error('An error occurred while deleting the contract');
    }
  };

  if (!currentProject) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-xl mb-4">You don't have any projects yet.</h2>
        <CreateProjectModal 
          open={isProjectModalOpen} 
          setOpen={setIsProjectModalOpen}
          disabled={!isReady}
        />
        <Button 
          onClick={() => setIsProjectModalOpen(true)}
          disabled={!isReady}
        >
          {!isReady ? 'System Preparing...' : 'Create New Project'}
        </Button>
      </div>
    );
  }
  return (
    <div className="flex flex-col sm:gap-4 sm:py-4">
      <CreateContractModal 
        open={isContractModalOpen} 
        setOpen={setIsContractModalOpen}
        disabled={!isReady}
      />
  
      <main className="flex flex-col items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      
        {currentProject.contracts?.length === 0 && (
          <div className="w-full">
            <DashboardCard
              title={`Create Your First ${currentProject.platform === 'Solana' ? 'Program' : 'Contract'}`}
              description={`Click the button below to create your first ${currentProject.platform === 'Solana' ? 'program' : 'contract'}.`}
              content={
                <Button 
                  onClick={() => setIsContractModalOpen(true)}
                  disabled={!isReady}
                >
                  {!isReady ? 'System Preparing...' : `Create New ${currentProject.platform === 'Solana' ? 'Program' : 'Contract'}`}
                </Button>
              }
              className="overflow-hidden"
            />
          </div>
        )}
  
        {/* Ana Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
          {/* Sol Kolon: Proje Detayları ve Contracts */}
          <div className="lg:col-span-2 space-y-4">
            {/* Proje Detayları Card'ı */}
            <DashboardCard
              title={
                <div className="flex flex-row justify-around items-center gap-1">
                  
                  <div className='flex items-center justify-between gap-3'>
                    <div className="flex items-center space-x-2">
                      <BoxIcon className="w-14 h-14 text-primary" />
                      <span className="text-2xl font-medium">{currentProject.name}</span>
                    </div>
                    
                    <Badge variant="outline" className="text-xs">
                      ID: {currentProject.id}
                    </Badge>
                  </div>

                  <div className='text-xs'>
                    {getPlatformBadge(currentProject.platform)}
                  </div>
                </div>
              }
              description={
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <LayersIcon className="w-4 h-4" />
                  <small>Project Type: {currentProject.projectType}</small>
                </div>
              }
              content={
                <div className="space-y-4">
                  <Separator className="my-2" />
                  <div className="grid grid-cols-2 gap-4">
                    
                    {/* Platform & Chain Info */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <LinkIcon className="w-[2rem] h-[2rem] text-primary border border-primary rounded-full p-2" />
                        
                        <div className="space-y-1">
                          
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-medium">Chain:</span>
                          <span className="text-xs">{getChainInfo(currentProject.chain)}</span>
                        </div>

                        </div>
                      </div>
                    </div>

                    {/* Date Info */}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="w-[2rem] h-[2rem] text-primary border border-primary rounded-full p-2" />
                        <div>
                          <div className="text-sm font-medium">Created Date:</div>
                          <code className="text-xs bg-secondary px-2 py-1 rounded">
                            {new Date(currentProject.createdAt).toLocaleDateString('en-EN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric'
                            })}
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Explorer Link */}
                  {currentProject.chain && (
                    <div className="mt-2">
                      {findChainByIdAndKey(currentProject.chain.id, currentProject.chain.key)?.blockExplorers?.default && (
                        <a
                          href={findChainByIdAndKey(currentProject.chain.id, currentProject.chain.key)?.blockExplorers.default.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center space-x-1"
                        >
                          <span>View in Explorer</span>
                          <ExternalLinkIcon className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              }
              className="hover:shadow-md transition-shadow duration-200"
            />
  
            {/* Contracts Tablosu */}
            {currentProject.contracts && currentProject.contracts.length > 0 ? (
              <DashboardCard
                title={currentProject.platform === 'Solana' ? 'Programs' : 'Contracts'}
                description={`All ${currentProject.platform === 'Solana' ? 'programs' : 'smart contracts'} for ${currentProject.name}`}
                headerAction={
                  <Button 
                    onClick={() => setIsContractModalOpen(true)}
                    disabled={!isReady}
                  >
                    {!isReady ? 'Preparing...' : `Create New ${currentProject.platform === 'Solana' ? 'Program' : 'Contract'}`}
                  </Button>
                }
                content={
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden sm:table-cell">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Template</TableHead>
                        <TableHead className="hidden sm:table-cell">Version</TableHead>
                        <TableHead className="hidden sm:table-cell">Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentProject.contracts.map((contract) => (
                        <TableRow key={contract.id}>
                          <TableCell>
                            <div className="font-medium">{contract.id}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{contract.name}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{contract.templateName || 'Custom'}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{contract.version}</div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge className="text-xs" variant="secondary">
                              {new Date(contract.createdAt).toLocaleString()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right flex items-center justify-end gap-2">
                            <Link href={`/contracts/${contract.id}`}>
                              <Button size="sm">Open</Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteContract(contract.id)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                }
                className="col-span-2"
              />
            ) : (
              <DashboardCard
                title={currentProject.platform === 'Solana' ? 'Programs' : 'Contracts'}
                description={`${currentProject.platform === 'Solana' ? 'Programs' : 'Smart contracts'} of ${currentProject.name} project`}
                headerAction={
                  <Button 
                    onClick={() => setIsContractModalOpen(true)}
                    disabled={!isReady}
                  >
                    {!isReady ? 'System Preparing...' : `Create New ${currentProject.platform === 'Solana' ? 'Program' : 'Contract'}`}
                  </Button>
                }
                content={<small>There is no {currentProject.platform === 'Solana' ? 'program' : 'contract'} for this project yet!</small>}
              />
            )}
          </div>
  
          {/* Sağ Kolon: Dosya Yapısı */}
          <div className="lg:col-span-1">
            <DashboardCard
              title="Project Structure"
              description={
                <div className="flex items-center space-x-2">
                  <span>Project Name: {currentProject.name}</span>
                  
                </div>
              }
              headerAction={
                <Button 
                  onClick={() => loadFileStructure()} 
                  disabled={isLoading || !isReady}
                  size="sm"
                >
                  {isLoading ? (
                    <>
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      Loading..
                    </>
                  ) : (
                    'Reload the Preview'
                  )}
                </Button>
              }
              content={
                <div className="bg-secondary p-4 rounded-md overflow-auto max-h-[600px]">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <ReloadIcon className="h-8 w-8 animate-spin" />
                    </div>
                  ) : fileStructure ? (
                    <FileTreeView data={parseFileStructure(fileStructure)} />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      File structure not found.
                    </div>
                  )}
                </div>
              }
            />
          </div>
        </div>
  
        {/* Alt Grid: Diğer Kartlar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {/* Analytics */}
          <DashboardCard
            title="Analytics"
            description="Project analytics and metrics"
            content={
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ActivityIcon className="w-4 h-4 text-primary" />
                    <span>Contract Activity</span>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <Progress value={75} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  Last updated: {new Date().toLocaleDateString()}
                </div>
              </div>
            }
          />
  
          {/* Development Status */}
          <DashboardCard
            title="Development Status"
            description="Current development phase"
            content={
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <GitBranchIcon className="w-4 h-4 text-primary" />
                    <span>Development Phase</span>
                  </div>
                  <Badge variant="outline">In Progress</Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between">
                      <span>Network:</span>
                      <span className="font-medium">
                        {findChainByIdAndKey(currentProject.chain.id, currentProject.chain.key)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Environment:</span>
                      <span className="font-medium">
                        {findChainByIdAndKey(currentProject.chain.id, currentProject.chain.key)?.testnet 
                          ? 'Testnet' 
                          : 'Mainnet'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            }
          />
  
          {/* Contract Status */}
          <DashboardCard
            title={currentProject.platform === 'Solana' ? 'Program Status' : 'Contract Status'}
            description="Deployment and verification status"
            content={
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CodeIcon className="w-4 h-4 text-primary" />
                    <span>Status</span>
                  </div>
                  <Badge variant="outline">Not Deployed</Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Ready for deployment
                </div>
              </div>
            }
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;