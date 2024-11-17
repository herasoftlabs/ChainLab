// stores/slices/projectSlice.ts

import { StateCreator } from 'zustand';
import { Project } from '@/types/projectTypes';
import { EthereumContract, ContractInheritance } from '@/types/evm/contractTypes';
import { Platform, Chain } from '@/types/projectTypes';
import { SUPPORTED_PLATFORMS } from '@/utils/constants';

export interface ProjectSlice {
  projects: Project[];
  currentProject: Project | null;
  currentContract: EthereumContract | null;
  
  platforms: Platform[];
  selectedPlatform: Platform | null;
  selectedChain: Chain | null;

  // Platform/Chain Actions
  setPlatforms: (platforms: Platform[]) => void;
  selectPlatform: (platformId: string) => void;
  selectChain: (chainId: string) => void;
  getEnabledPlatforms: () => Platform[];
  getPlatformChains: (platformId: string) => Chain[];

  addProject: (project: Project) => void;
  removeProject: (projectId: string) => void;
  setCurrentProject: (project: Project | null) => void;
  setCurrentContract: (contract: EthereumContract | null) => void;  // Eklendi
  addContractToProject: (projectId: string, contract: EthereumContract) => void;
  removeContractFromProject: (projectId: string, contractId: string) => void;
  updateContract: (projectId: string, contract: EthereumContract) => void;

  updateContractInheritance: (
    projectId: string,
    contractId: string,
    inheritance: ContractInheritance[]
  ) => void;
}
export const createProjectSlice: StateCreator<ProjectSlice> = (set, get) => ({
  projects: [],
  currentProject: null,
  currentContract: null,
  platforms: SUPPORTED_PLATFORMS,
  selectedPlatform: null,
  selectedChain: null,

  // Platform/Chain Actions
  setPlatforms: (platforms) => set({ platforms }),
  
  selectPlatform: (platformId) => {
    const platform = get().platforms.find(p => p.id === platformId);
    set({ 
      selectedPlatform: platform || null,
      selectedChain: null 
    });
  },

  selectChain: (chainId) => {
    const platform = get().selectedPlatform;
    if (!platform) return;
    
    const chain = platform.chains.find(c => c.id === chainId);
    set({ selectedChain: chain || null });
  },

  getEnabledPlatforms: () => {
    return get().platforms.filter(p => p.enabled);
  },

  getPlatformChains: (platformId) => {
    const platform = get().platforms.find(p => p.id === platformId);
    return platform?.chains || [];
  },

  addProject: (project) => 
    set((state) => ({
      projects: [...state.projects, project],
      currentProject: project
    })),
  removeProject: (projectId) =>
    set((state) => ({
      projects: state.projects.filter(p => p.id !== projectId),
      currentProject: state.currentProject?.id === projectId ? null : state.currentProject,
      currentContract: null 
    })),
  setCurrentProject: (project) => 
    set({ 
      currentProject: project,
      currentContract: null 
    }),
  setCurrentContract: (contract) =>  
    set({ currentContract: contract }),
  addContractToProject: (projectId, contract) =>
    set((state) => ({
      projects: state.projects.map(project =>
        project.id === projectId
          ? { ...project, contracts: [...(project.contracts || []), contract] }
          : project
      ),
      currentProject: state.currentProject?.id === projectId
        ? { ...state.currentProject, contracts: [...(state.currentProject.contracts || []), contract] }
        : state.currentProject,
      currentContract: contract 
    })),
  removeContractFromProject: (projectId, contractId) =>
    set((state) => ({
      projects: state.projects.map(project =>
        project.id === projectId
          ? { 
              ...project, 
              contracts: project.contracts?.filter(c => c.id !== contractId) 
            }
          : project
      ),
      currentProject: state.currentProject?.id === projectId
        ? { 
            ...state.currentProject, 
            contracts: state.currentProject.contracts?.filter(c => c.id !== contractId)
          }
        : state.currentProject,
      currentContract: state.currentContract?.id === contractId ? null : state.currentContract
    })),
  updateContract: (projectId, updatedContract) =>
    set((state) => ({
      projects: state.projects.map(project =>
        project.id === projectId
          ? {
              ...project,
              contracts: project.contracts?.map(contract =>
                contract.id === updatedContract.id
                  ? updatedContract
                  : contract
              )
            }
          : project
      ),
      currentProject: state.currentProject?.id === projectId
        ? {
            ...state.currentProject,
            contracts: state.currentProject.contracts?.map(contract =>
              contract.id === updatedContract.id
                ? updatedContract
                : contract
            )
          }
        : state.currentProject,
      currentContract: state.currentContract?.id === updatedContract.id
        ? updatedContract
        : state.currentContract
    })),

  updateContractInheritance: (projectId, contractId, inheritance) =>
    set((state) => {
      const updatedProjects = state.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              contracts: project.contracts?.map((contract) =>
                contract.id === contractId
                  ? { ...contract, inherits: inheritance }
                  : contract
              ),
            }
          : project
      );

      return {
        ...state,
        projects: updatedProjects,
        currentContract:
          state.currentContract?.id === contractId
            ? { ...state.currentContract, inherits: inheritance }
            : state.currentContract,
      };
    }),

});