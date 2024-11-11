// stores/useComponentStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DraggedItemType } from '@/types/evm/contractTypes';
import { 
  DraggableComponent, 
  ComponentCategory,
  StateVariableComponentData,
  FunctionComponentData, 
  EventComponentData, 

  
  DraggableComponentData,
  isStateVariableComponentData,
  isFunctionComponentData,
  isEventComponentData,
  isModifierComponentData,
  
  isStructComponentData,
  isEnumComponentData,
  isMappingComponentData,
  isArrayComponentData,
  isIntegrationComponentData,
  
  isOracleIntegrationComponentData,
  isExternalCallComponentData
} from '@/types/evm/contractTypes';
import { ComponentPosition } from '@/types/evm/contractTypes';

const defaultPosition: ComponentPosition = {
  x: 0,
  y: 0
};

// Component Error Type
interface ComponentError {
  code: string;
  message: string;
  severity: 'error' | 'warning';
  field?: string;
}
// Component Relation Type
interface ComponentRelation {
  targetId: string;
  type: string;
}
interface ComponentState {
  // UI States
  activeCategory: ComponentCategory['main'] | null;
  activeSubcategory: string | null;
  components: Record<string, DraggableComponent>;
  hasUnsavedChanges: boolean;
  selectedComponentId: string | null;
  draggedComponent: DraggedItemType | null;
  componentOrder: string[];
  
  // Actions
  setSelectedComponentId: (id: string | null) => void;
  setDraggedComponent: (component: DraggedItemType | null) => void;
  setActiveCategory: (category: ComponentCategory['main']) => void;
  setActiveSubcategory: (subcategory: string) => void;
  
  // Component CRUD
  addComponent: (component: DraggableComponent) => void;
  updateComponent: (componentId: string, updates: Partial<DraggableComponent>) => void;
  resetUnsavedChanges: () => void;
  removeComponent: (componentId: string) => void;
  reorderComponents: (startIndex: number, endIndex: number) => void;
  
  // Component Validation
  validateComponent: (componentId: string) => ComponentError[];
  
  // Component Relations
  addComponentRelation: (sourceId: string, targetId: string, relationType: string) => void;
  removeComponentRelation: (sourceId: string, targetId: string) => void;
  getRelatedComponents: (componentId: string) => DraggableComponent[];
  
  // Position Management
  updateComponentPosition: (
    componentId: string, 
    position: ComponentPosition
  ) => void;
  
  // Bulk Operations
  clearAllComponents: () => void;
  importComponents: (components: DraggableComponent[]) => void;
}
export const useComponentStore = create<ComponentState>()(
  persist(
    (set, get) => ({
      // Initial States
      selectedComponentId: null,
      draggedComponent: null,
      activeCategory: null,
      activeSubcategory: null,
      components: {},
      componentOrder: [],
      hasUnsavedChanges: false,
  
      // Basic Actions
      setSelectedComponentId: (id) => set((state) => ({ 
        ...state, 
        selectedComponentId: id 
      })),
      
      setDraggedComponent: (component) => set((state) => ({ 
        ...state, 
        draggedComponent: component 
      })),
      
      setActiveCategory: (category) => set((state) => ({ 
        ...state, 
        activeCategory: category 
      })),
      
      setActiveSubcategory: (subcategory) => set((state) => ({ 
        ...state, 
        activeSubcategory: subcategory 
      })),
      
      // Component CRUD
      addComponent: (component) => set((state) => ({
        ...state,
        components: {
          ...state.components,
          [component.id]: {
            ...component,
            isNew: true, 
            position: component.position || defaultPosition,
            connections: component.connections || [],
            
          } as DraggableComponent
        },
        hasUnsavedChanges: true,
        componentOrder: [...state.componentOrder, component.id]
      })),
      
      updateComponent: (componentId, updates) => {
        set((state) => ({
          components: {
            ...state.components,
            [componentId]: {
              ...state.components[componentId],
              ...updates,
              data: {
                ...state.components[componentId].data,
                ...updates.data,
              },
            },
          },
          hasUnsavedChanges: true, 
        }));
      },
      resetUnsavedChanges: () => {
        set({ hasUnsavedChanges: false });
      },  

      removeComponent: (componentId) => set((state) => {
        const { [componentId]: removed, ...remainingComponents } = state.components;
        return {
          ...state,
          components: remainingComponents,
          componentOrder: state.componentOrder.filter(id => id !== componentId),
          selectedComponentId: state.selectedComponentId === componentId ? null : state.selectedComponentId
        };
        
      }),
      // Component Ordering
      reorderComponents: (startIndex, endIndex) => set((state) => {
        const newOrder = [...state.componentOrder];
        const [removed] = newOrder.splice(startIndex, 1);
        newOrder.splice(endIndex, 0, removed);
        return {
          ...state,
          componentOrder: newOrder
        };
      }),
      // Validation
      validateComponent: (componentId) => {
        const component = get().components[componentId];
        if (!component) return [{ 
          code: 'NOT_FOUND', 
          message: 'Component not found',
          severity: 'error' 
        }];
        
        const errors: ComponentError[] = [];
        
      /*   if (!component.metadata) {
          errors.push({
            code: 'NO_METADATA',
            message: 'Component metadata is missing',
            severity: 'error'
          });
        } */
        
        if (!component.position) {
          errors.push({
            code: 'NO_POSITION',
            message: 'Component position is not set',
            severity: 'warning'
          });
        }
        // Other Validations
        if (isStateVariableComponentData(component.data)) {
          const varData = component.data as StateVariableComponentData;
          if (!varData.dataType) {
            errors.push({
              code: 'NO_DATA_TYPE',
              message: 'Variable data type is missing',
              severity: 'error'
            });
          }
        }
        if (isFunctionComponentData(component.data)) {
          const funcData = component.data as FunctionComponentData;
          if (!funcData.name) {
            errors.push({
              code: 'NO_NAME',
              message: 'Function name is missing',
              severity: 'error'
            });
          }

        }
        if (isEventComponentData(component.data)) {
          const eventData = component.data as EventComponentData;
          if (!eventData.name) {
            errors.push({
              code: 'NO_NAME',
              message: 'Event name is missing',
              severity: 'error'
            });
          }
    
        }

        return errors;
      },
      // Relations
      addComponentRelation: (sourceId, targetId, relationType) => set((state) => ({
        ...state,
        components: {
          ...state.components,
          [sourceId]: {
            ...state.components[sourceId],
            connections: [...state.components[sourceId].connections, targetId]
          }
        },
        hasUnsavedChanges: false,
      })),
      removeComponentRelation: (sourceId, targetId) => set((state) => ({
        ...state,
        components: {
          ...state.components,
          [sourceId]: {
            ...state.components[sourceId],
            connections: state.components[sourceId].connections.filter(
              id => id !== targetId
            )
          }
        }
      })),
      getRelatedComponents: (componentId) => {
        const { components } = get();
        const component = components[componentId];
        if (!component?.connections) return [];
        
        return component.connections
          .map(id => components[id])
          .filter(Boolean);
      },
 
      // Position Management 
      updateComponentPosition: (componentId, position) => set((state) => {
        const component = state.components[componentId];
        if (!component) return state;
      
        return {
          ...state,
          components: {
            ...state.components,
            [componentId]: {
              ...component,
              position: {
                x: Math.max(0, Math.round(position.x)),
                y: Math.max(0, Math.round(position.y))
              }
            }
          }
        };
      }),
      // Bulk Operations
      clearAllComponents: () => set({
        components: {},
        componentOrder: [],
        selectedComponentId: null,
        draggedComponent: null,
        activeCategory: null,
        activeSubcategory: null,
        hasUnsavedChanges: false
      }),

      importComponents: (components) => set((state) => ({
        ...state,
        components: components.reduce((acc, component) => ({
          ...acc,
          [component.id]: {
            ...component,
            position: component.position || defaultPosition,
            connections: component.connections || [],
            
          } as DraggableComponent
        }), {}),
        componentOrder: components.map(c => c.id)
      }))
    }),
    {
      name: 'component-storage'
    }
  )
);
export default useComponentStore;