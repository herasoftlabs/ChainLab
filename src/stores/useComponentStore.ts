import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DraggedItemType } from '@/types/evm/contractTypes';
import { 
  DraggableComponent, 
  ComponentCategoryMain,
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

interface ComponentState {
  // UI States
  activeCategory: ComponentCategoryMain | null;
  components: Record<string, DraggableComponent>;
  hasUnsavedChanges: boolean;
  selectedComponentId: string | null;
  draggedComponent: DraggedItemType | null;
  componentOrder: string[];
  zoom: number;
  
  
  // Actions
  setSelectedComponentId: (id: string | null) => void;
  setDraggedComponent: (component: DraggedItemType | null) => void;
  setActiveCategory: (category: ComponentCategoryMain) => void;
  
  // Component CRUD
  addComponent: (component: DraggableComponent) => void;
  updateComponent: (componentId: string, updates: Partial<DraggableComponent>) => void;
  resetUnsavedChanges: () => void;
  removeComponent: (componentId: string) => void;
  reorderComponents: (startIndex: number, endIndex: number) => void;
  
  // Component Validation
  validateComponent: (componentId: string) => ComponentError[];
  
  // Position Management
  updateComponentPosition: (
    componentId: string, 
    position: ComponentPosition
  ) => void;

  //Zoom
  setZoom: (zoom: number) => void;
  
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
      components: {},
      componentOrder: [],
      hasUnsavedChanges: false,
      zoom: 1,
  
      // Basic Actions
      setSelectedComponentId: (id) => set((state) => ({ 
        selectedComponentId: id 
      })),
      
      setDraggedComponent: (component) => set((state) => ({ 
        draggedComponent: component 
      })),
      
      setActiveCategory: (category) => set((state) => ({ 
        activeCategory: category 
      })),

      setZoom: (zoom) => set({ zoom }),
      
      // Component CRUD
      addComponent: (component) => set((state) => ({
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
      
      updateComponent: (componentId: string, updates: Partial<DraggableComponent>) => {
        set((state) => {
          const updatedComponent = {
            ...state.components[componentId],
            ...updates,
            data: {
              ...state.components[componentId].data,
              ...(updates.data || {}),
            },
          } as DraggableComponent;
      
          return {
            components: {
              ...state.components,
              [componentId]: updatedComponent,
            },
            hasUnsavedChanges: true,
          } as ComponentState;
        });
      },

      resetUnsavedChanges: () => {
        set({ hasUnsavedChanges: false });
      },  

      removeComponent: (componentId) => set((state) => {
        const { [componentId]: removed, ...remainingComponents } = state.components;
        return {
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
        
        if (!component.position) {
          errors.push({
            code: 'NO_POSITION',
            message: 'Component position is not set',
            severity: 'warning'
          });
        }

        // Specific validations for different component types
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

      // Position Management 
      updateComponentPosition: (componentId, position) => set((state) => {
        const component = state.components[componentId];
        if (!component) return state;
      
        return {
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
        hasUnsavedChanges: false
      }),

      importComponents: (components) => set((state) => ({
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
      name: 'component-storage',
      partialize: (state) => ({
        components: state.components,
        componentOrder: state.componentOrder,
        zoom: state.zoom, 
      })
    }
  )
);

export default useComponentStore;