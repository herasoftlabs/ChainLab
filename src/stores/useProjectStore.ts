// src/stores/useProjectStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createProjectSlice, ProjectSlice } from './slices/projectSlice';


type StoreState = ProjectSlice;

export const useProjectStore = create<StoreState>()(
  persist(
    (...args) => ({
      ...createProjectSlice(...args),
    }),
    {
      name: 'project-storage',
      partialize: (state: ProjectSlice) => ({
        projects: state.projects,
        currentProject: state.currentProject,
        currentContract: state.currentContract,
      }),
      storage: createJSONStorage(() => 
        typeof window !== 'undefined'
          ? window.localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
      version: 1,
      onRehydrateStorage: (state) => {
        console.log('State hydrated:', state);
      },
    }
  )
);

// Helper functtions for Type-safe selectors 
export const useCurrentProject = () => useProjectStore((state) => state.currentProject);
export const useProjects = () => useProjectStore((state) => state.projects);

export const useProjectActions = () => {
  const addProject = useProjectStore((state) => state.addProject);
  const removeProject = useProjectStore((state) => state.removeProject);
  const setCurrentProject = useProjectStore((state) => state.setCurrentProject);
  const setCurrentContract = useProjectStore((state) => state.setCurrentContract);  
  const addContractToProject = useProjectStore((state) => state.addContractToProject);
  const removeContractFromProject = useProjectStore((state) => state.removeContractFromProject);
  const updateContract = useProjectStore((state) => state.updateContract);

  return {
    addProject,
    removeProject,
    setCurrentProject,
    setCurrentContract,  
    addContractToProject,
    removeContractFromProject,
    updateContract,
  };
};

// Type guard functions
export const isValidProject = (project: unknown): project is ProjectSlice['currentProject'] => {
  if (!project || typeof project !== 'object') return false;
  const p = project as ProjectSlice['currentProject'];
  return (
    typeof p?.id === 'string' &&
    typeof p?.name === 'string' &&
    typeof p?.createdAt === 'string' &&
    typeof p?.folderName === 'string' &&
    Array.isArray(p?.contracts)
  );
};

export const useCurrentContract = () => useProjectStore((state) => state.currentContract);