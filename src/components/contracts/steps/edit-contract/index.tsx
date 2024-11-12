// components/contracts/steps/edit-contract/chain/evm/index.tsx

import React, { useState, useEffect, useRef } from 'react';
import { 
  DndContext, DragEndEvent, DragStartEvent, DragMoveEvent,
  useSensor, useSensors, PointerSensor, MouseSensor, DragOverlay
} from '@dnd-kit/core';
import { useProjectStore } from '@/stores/useProjectStore';
import { DraggedItemType, DragData } from '@/types/evm/contractTypes';
import { useComponentStore } from '@/stores/useComponentStore';
import { useWebContainerStore } from '@/stores/useWebContainerStore';
import { nanoid } from 'nanoid';
import { ComponentPalette } from '@/components/contracts/steps/edit-contract/chain/evm/ComponentPalette';
import { EditorBoard } from '@/components/contracts/steps/edit-contract/chain/evm/EditorBoard';
import { DetailPanel } from '@/components/contracts/steps/edit-contract/chain/evm/DetailPanel';
import { Toolbar } from '@/components/contracts/steps/edit-contract/chain/evm/EditorBoard/Toolbar';
import { UndoRedoProvider } from '@/components/contracts/steps/edit-contract/chain/evm/EditorBoard/UndoRedoProvider';
import { toast } from 'react-toastify';
import { contractToComponents } from '@/utils/chains/evm/contractToComponents';
import { DraggableComponent, ComponentCategoryMain} from '@/types/evm/contractTypes';
import { ComponentInstance } from '@/components/contracts/steps/edit-contract/chain/evm/EditorBoard/ComponentInstance';
import { createComponentData } from '@/utils/chains/evm/componentFactory';
/* import { generateSolidityCode } from '@/utils/chain-specific//componentsToSolidity'; */
import { EthereumContract,FunctionComponentData, StateVariableComponentData, EventComponentData, ErrorComponentData, ModifierComponentData, StructComponentData, EnumComponentData, MappingComponentData, ArrayComponentData, IntegrationComponentData, SecurityComponentData, OracleIntegrationComponentData, ExternalCallComponentData, ConstructorComponentData } from '@/types/evm/contractTypes';
const EditContract: React.FC = () => {

  const currentProject = useProjectStore((state) => state.currentProject);
  const currentContract = useProjectStore((state) => state.currentContract);
  const resetUnsavedChanges = useComponentStore((state) => state.resetUnsavedChanges);
  const hasUnsavedChanges = useComponentStore((state) => state.hasUnsavedChanges);

  const {
    components,
    selectedComponentId,
    draggedComponent,
    addComponent,
    updateComponent,
    setSelectedComponentId,
    setDraggedComponent,
    updateComponentPosition,
    importComponents
  } = useComponentStore();
  /* const { writeFile } = useWebContainerStore(); */

  // Local state
  const [zoom, setZoom] = useState(1);                                    
  const [showGrid, setShowGrid] = useState(true);                       
  const [isConnecting, setIsConnecting] = useState(false);              
  const [connectionStart, setConnectionStart] = useState<string | null>(null); 
  const updateContract = useProjectStore((state) => state.updateContract);

  const pointerPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 10 },
    }),
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    })
  );

  // Convert components when the contract changes
  useEffect(() => {
    if (currentContract) {
      const convertedComponents = contractToComponents(currentContract);
      // Convert record to array
      const componentsArray = Object.values(convertedComponents);
      importComponents(componentsArray);

      // Debug information
      console.group('🔄 Contract to Components Conversion');
      console.log('📄 Current Contract:', currentContract);
      console.log('🧩 Converted Components:', convertedComponents);
      console.log('🗺️ Component Layout:', currentContract.componentLayout);
      console.groupEnd();
    }
  }, [currentContract?.id, importComponents]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
  
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);
  

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    console.group('🎯 Drag Start');
    console.log('⚡ Active Element:', active);
    console.log('📦 Active Data:', active.data.current);
    
    // Dragging a new template
    if (active.data.current?.type === 'new-template') {
      const dragData = active.data.current as DragData;
      console.log('🆕 New Template Drag:', dragData);
      
      const componentData: DraggedItemType = {
        id: nanoid(),
        type: dragData.payload.componentType,
        data: {
          type: dragData.payload.componentType,
          visibility: 'public',
          parameters: [],
          returnParameters: [],
          modifiers: [],
          category: dragData.payload.category || 'Functions', 
          stateMutability: dragData.payload.stateMutability,
          dataType: dragData.payload.dataType,
          body: { content: '' },
          defaultValues: {}
        },
        position: { x: 0, y: 0 },
        connections: [],
        width: 200,
        height: 100,
        documentation: ''
      };
      
      setDraggedComponent(componentData);
      console.log('✨ Created Template Data:', componentData);
    }
    // Dragging an existing component
    else if (active.data.current?.component) {
      const draggedComponent = active.data.current.component;
      console.log('🔄 Dragged Component:', draggedComponent);
      
      const componentData: DraggedItemType = {
        id: draggedComponent.id || nanoid(),
        type: draggedComponent.type,
        data: draggedComponent.data || {},
        position: draggedComponent.position || { x: 0, y: 0 },
        connections: [],
        width: 200,
        height: 100,
        documentation: ''
      };
      
      setDraggedComponent(componentData);
      console.log('✨ Created Component Data:', componentData);
    }
    
    // Reset pointer position
    pointerPositionRef.current = { x: 0, y: 0 };
    console.groupEnd();
  };
  

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {

    console.group('🎯 Drag End');
    const { active, over } = event;
    console.log('⚡ Active Element:', active);
    console.log('🎯 Over Element:', over);

    // If there's no valid drop target, cancel the operation
    if (!over || over.id !== 'editor-board') {
      console.log('❌ Invalid drop target');
      setDraggedComponent(null);
      console.groupEnd();
      return;
    }

    const dragData = active.data.current as DragData;
    if (!dragData) return;

    try {
      const boardElement = document.getElementById('editor-board');
      if (!boardElement) return;

      const boardRect = boardElement.getBoundingClientRect();
      const activeRect = active.rect.current?.translated;
      if (!activeRect) return;

      const relativeX = activeRect.left - boardRect.left + boardElement.scrollLeft;
      const relativeY = activeRect.top - boardRect.top + boardElement.scrollTop;
      const position = {
        x: Math.round((relativeX / zoom) / 20) * 20,
        y: Math.round((relativeY / zoom) / 20) * 20
      };

      console.log('📍 Calculated Position:', position);

      if (dragData.type === 'new-template') {
        const componentId = nanoid();

       

        /* const createComponentData = (
          componentId: string,
          componentType: ComponentType,
          dragData: DragData
        ): DraggableComponentData => {
          
          const baseData: ComponentDataFields = {
            id: componentId,
            type: componentType,
            name: `New ${componentType}`,
            documentation: '',
            category: {
              main: 'BasicComponents',
              sub: 'StateVariables',
            },
            defaultValues: {},
            body: { content: '' },
          };

          switch (componentType) {
            case 'function': {
              const functionData: FunctionComponentData = {
                ...baseData,
                type: 'function',
                category: {
                  main: 'Functions',
                  sub:
                    dragData.payload.stateMutability === 'view' ||
                    dragData.payload.stateMutability === 'pure'
                      ? 'ReadFunctions'
                      : 'WriteFunctions',
                },
                visibility: 'public',
                stateMutability: dragData.payload.stateMutability || 'nonpayable',
                parameters: [],
                returnParameters: [],
                modifiers: [],
                body: { content: '' },
              };
              return functionData;
            }

            case 'variable': {
              const variableData: StateVariableComponentData = {
                ...baseData,
                type: 'variable',
                category: {
                  main: 'BasicComponents',
                  sub: 'StateVariables',
                },
                dataType: dragData.payload.dataType || 'uint256',
                visibility: 'public',
                mutability: 'mutable',
                initialValue: '',
              };
              return variableData;
            }

            case 'constructor': {
              const constructorData: ConstructorComponentData = {
                ...baseData,
                type: 'constructor',
                name: 'Constructor',
                category: {
                  main: 'BasicComponents',
                  sub: 'Constructor',
                },
                parameters: [],
                modifiers: [],
                body: { content: '' },
              };
              return constructorData;
            }

            case 'event': {
              const eventData: EventComponentData = {
                ...baseData,
                type: 'event',
                category: {
                  main: 'Events',
                  sub: 'CustomEvents',
                },
                parameters: [],
              };
              return eventData;
            }           
            case 'modifier': {
              const modifierData: ModifierComponentData = {
                ...baseData,
                type: 'modifier',
                category: {
                  main: 'BasicComponents',
                  sub: 'Modifiers',
                },
                parameters: [],
                body: { content: '' },
              };
              return modifierData;
            }
            case 'error': {
              const errorData: ErrorComponentData = {
                ...baseData,
                type: 'error',
                category: {
                  main: 'BasicComponents',
                  sub: 'CustomErrors',
                },
                parameters: [],
              };
              return errorData;
            }
            case 'struct': {
              const structData: StructComponentData = {
                ...baseData,
                type: 'struct',
                category: {
                  main: 'DataStructures',
                  sub: 'Struct',
                },
                members: [],
              };
              return structData;
            }
            case 'enum': {
              const enumData: EnumComponentData = {
                ...baseData,
                type: 'enum',
                category: {
                  main: 'DataStructures',
                  sub: 'Enum',
                },
                members: [],
              };
              return enumData;
            }
            case 'mapping': {
              const mappingData: MappingComponentData = {
                ...baseData,
                type: 'mapping',
                category: {
                  main: 'DataStructures',
                  sub: 'Mapping',
                },
                keyType: 'uint256',
                valueType: 'uint256',
                visibility: 'public',
              };
              return mappingData;
            }
            case 'array': {
              const arrayData: ArrayComponentData = {
                ...baseData,
                type: 'array',
                category: {
                  main: 'DataStructures',
                  sub: 'Array',
                },
                dataType: 'uint256',
                length: undefined,
                visibility: 'public',
              };
              return arrayData;
            }
            case 'integration': {
              return {
                ...baseData,
                type: 'integration',
                category: {
                  main: 'Integrations',
                  sub: 'TokenStandards',
                },
                standard: 'Custom',
                features: [],
              };
            }
            case 'security': {
              return {
                ...baseData,
                type: 'security',
                category: {
                  main: 'Security',
                  sub: 'AccessControl',
                },
                featureType: 'ownable',
                implementation: '',
                requirements: [],
              };
            }
            case 'oracle': {
              return {
                ...baseData,
                type: 'oracle',
                category: {
                  main: 'Integrations',
                  sub: 'OracleIntegration',
                },
                provider: 'chainlink',
                endpoint: '',
                parameters: [],
              };
            }
            case 'externalCall': {
              return {
                ...baseData,
                type: 'externalCall',
                category: {
                  main: 'Integrations',
                  sub: 'ExternalCalls',
                },
                target: '',
                method: '',
                parameters: [],
                safetyChecks: [],
              };
            }
            

            default:
              throw new Error(`Unsupported component type: ${componentType}`);
          }
        }; */

        const newComponentData = createComponentData(
          componentId,
          dragData.payload.componentType,
          dragData
        );

        // Create New Component
        const newComponent: DraggableComponent = {
          id: componentId,
          type: dragData.payload.componentType,
          data: newComponentData,
          position,
          connections: [],
          width: 200,
          height: 100,
          documentation: newComponentData.documentation,
          isNew: true,
        };

        // Add the component and select it
        addComponent(newComponent);
        setSelectedComponentId(componentId);

        console.log('✨ New Component Created:', {
          id: componentId,
          type: dragData.payload.componentType,
          data: newComponent.data,
          position,
          connections: [],
          width: 200,
          height: 100,
          documentation: newComponent.documentation,
          isNew: true,
        });

      } else {
        // Move existing component
        if (dragData.payload.id) {
          updateComponentPosition(dragData.payload.id, position);
        }

        console.log('🔄 Component Moved:', {
          id: dragData.payload.id,
          newPosition: position
        });
      }
      
    } catch (error) {
      console.error('❌ Drag End Error:', error);
      toast.error('Failed to handle component drag');
    } finally {
      setDraggedComponent(null);
      console.groupEnd();
    }
  };

  // Update position during dragging
  const handleDragMove = (event: DragMoveEvent) => {
    const { active, delta } = event;

    if (active.data.current?.type === 'existing-component') {
      const prevPosition = { ...pointerPositionRef.current };
      pointerPositionRef.current = {
        x: pointerPositionRef.current.x + delta.x,
        y: pointerPositionRef.current.y + delta.y
      };

      console.log('📍 Component Move:', {
        componentId: active.data.current?.payload?.id,
        delta,
        previousPosition: prevPosition,
        newPosition: pointerPositionRef.current
      });
    }
  };

  // Handle contract save
  const handleSaveContract = async () => {
    
    console.log('handleSave called');
    console.log('currentProject:', currentProject);
    console.log('currentContract:', currentContract);

    if (!currentContract || !currentProject) return;
    const projectId = currentProject.id;

    console.group('💾 Saving Contract');
    console.log('Current Components:', components);
    console.log('Component Order:', Object.keys(components));
    console.log('Connections:', Object.values(components).map(c => ({ id: c.id, connections: c.connections })));

    try {

    const functions: FunctionComponentData[] = [];
    const stateVariables: StateVariableComponentData[] = [];
    const events: EventComponentData[] = [];
    const errors: ErrorComponentData[] = [];
    const modifiers: ModifierComponentData[] = [];
    const structs: StructComponentData[] = [];
    const enums: EnumComponentData[] = [];
    const mappings: MappingComponentData[] = [];
    const arrays: ArrayComponentData[] = [];
    const integrations: IntegrationComponentData[] = [];
    const securityFeatures: SecurityComponentData[] = [];
    const oracleIntegrations: OracleIntegrationComponentData[] = [];
    const externalCalls: ExternalCallComponentData[] = [];
    let constructorData: ConstructorComponentData | undefined

    Object.values(components).forEach((component) => {
      const data = component.data;

      switch (data.type) {
        case 'function':
          functions.push(data as FunctionComponentData);
          break;
        case 'variable':
          stateVariables.push(data as StateVariableComponentData);
          break;
        case 'event':
          events.push(data as EventComponentData);
          break;
        case 'error':
          errors.push(data as ErrorComponentData);
          break;
        case 'modifier':
          modifiers.push(data as ModifierComponentData);
          break;
        case 'struct':
          structs.push(data as StructComponentData);
          break;
        case 'enum':
          enums.push(data as EnumComponentData);
          break;
        case 'mapping':
          mappings.push(data as MappingComponentData);
          break;
        case 'array':
          arrays.push(data as ArrayComponentData);
          break;
        case 'integration':
          integrations.push(data as IntegrationComponentData);
          break;
        case 'security':
          securityFeatures.push(data as SecurityComponentData);
          break;
        case 'oracle':
          oracleIntegrations.push(
            data as OracleIntegrationComponentData
          );
          break;
        case 'externalCall':
          externalCalls.push(
            data as ExternalCallComponentData
          );
          break;
        case 'constructor':
          constructorData = data as ConstructorComponentData;
          break;
        
      }
    });

      // Build the updated contract
    const updatedContract: EthereumContract = {
      ...currentContract,
      constructor: constructorData,
      stateVariables,
      functions,
      events,
      errors,
      modifiers,
      structs,
      enums,
      mappings,
      arrays,
      integrations,
      securityFeatures,
      oracleIntegrations,
      externalCalls,
      componentLayout: {
        positions: Object.values(components).reduce(
          (acc, component) => {
            acc[component.id] = component.position;
            return acc;
          },
          {} as Record<
            string,
            { x: number; y: number }
          >
        ),
        connections: Object.values(components).flatMap(
          (component) =>
            component.connections.map((targetId) => ({
              source: component.id,
              target: targetId,
            }))
        ),
      },
    };
  
      updateContract(projectId, updatedContract);
      resetUnsavedChanges();
      /* const solidityCode = generateSolidityCode(updatedContract); */
  
      // Save to WebContainer
      /* await writeFile(
        `/contracts/${currentContract.name}.sol`,
        solidityCode
      ); */
  
      console.log('Updated Contract:', updatedContract);
      toast.success('Contract saved successfully');
    } catch (error) {
      console.error('Save Error:', error);
      toast.error('Error saving contract');
    } finally {
      console.groupEnd();
    }
  };

  // Handle connections
  const handleConnectionStart = (componentId: string) => {
    console.log('🔗 Connection Start:', {
      componentId,
      component: components[componentId]
    });
    setIsConnecting(true);
    setConnectionStart(componentId);
  };

  const handleConnectionEnd = (componentId: string) => {

    console.group('🔗 Connection End');
    console.log('Start Component:', connectionStart);
    console.log('End Component:', componentId);

    if (connectionStart && connectionStart !== componentId) {

      const startComponent = components[connectionStart];
      const endComponent = components[componentId];

      console.log('Connection Details:', {
        from: {
          id: connectionStart,
          type: startComponent.type,
          name: startComponent.data.name
        },
        to: {
          id: componentId,
          type: endComponent.type,
          name: endComponent.data.name
        }
      });

      updateComponent(connectionStart, {
        connections: [...components[connectionStart].connections, componentId]
      });
      toast.success('Connection created successfully');
    }
    setIsConnecting(false);
    setConnectionStart(null);
    console.groupEnd();
  };

  const createDraggableComponentFromDragData = (
    draggedComponent: DraggedItemType,
    position: { x: number; y: number }
  ): DraggableComponent => {
    const baseComponent = {
      id: draggedComponent.id,
      type: draggedComponent.type,
      position,
      connections: [],
      width: 200,
      height: 100,
      documentation: '',
      isNew: true,
    };
  
    switch (draggedComponent.type) {
      case 'function': {
        return {
          ...baseComponent,
          data: {
            id: draggedComponent.id,
            type: 'function',
            name: `New Function`,
            category: 'Functions',
            visibility: 'public',
            stateMutability:
              draggedComponent.data.stateMutability || 'nonpayable',
            parameters: [],
            returnParameters: [],
            modifiers: [],
            body: { content: '' },
            defaultValues: {},
          },
        } as DraggableComponent;
      }
  
      case 'variable': {
        return {
          ...baseComponent,
          data: {
            id: draggedComponent.id,
            type: 'variable',
            name: `New Variable`,
            category: 'StateVariables',
            dataType: draggedComponent.data.dataType || 'uint256',
            visibility: 'public',
            mutability: 'mutable',
            initialValue: '',
            defaultValues: {},
          },
        } as DraggableComponent;
      }
  
      case 'constructor': {
        return {
          ...baseComponent,
          data: {
            id: draggedComponent.id,
            type: 'constructor',
            name: 'Constructor',
            category: 'BasicComponents',
            parameters: [],
            modifiers: [],
            body: { content: '' },
            defaultValues: {},
          },
        } as DraggableComponent;
      }
  
      case 'event': {
        return {
          ...baseComponent,
          data: {
            id: draggedComponent.id,
            type: 'event',
            name: `New Event`,
            category: 'BasicComponents',
            parameters: [],
            defaultValues: {},
          },
        } as DraggableComponent;
      }
  
      case 'modifier': {
        return {
          ...baseComponent,
          data: {
            id: draggedComponent.id,
            type: 'modifier',
            name: `New Modifier`,
            category: 'BasicComponents',
            parameters: [],
            body: { content: '' },
            defaultValues: {},
          },
        } as DraggableComponent;
      }
  
      case 'error': {
        return {
          ...baseComponent,
          data: {
            id: draggedComponent.id,
            type: 'error',
            name: `New Error`,
            category: 'BasicComponents',
            parameters: [],
            defaultValues: {},
          },
        } as DraggableComponent;
      }
  
      case 'struct': {
        return {
          ...baseComponent,
          data: {
            id: draggedComponent.id,
            type: 'struct',
            name: `New Struct`,
            category: 'DataStructures',
            members: [],
            defaultValues: {},
          },
        } as DraggableComponent;
      }
  
      case 'enum': {
        return {
          ...baseComponent,
          data: {
            id: draggedComponent.id,
            type: 'enum',
            name: `New Enum`,
            category: 'DataStructures',
            members: [],
            defaultValues: {},
          },
        } as DraggableComponent;
      }
  
      case 'mapping': {
        return {
          ...baseComponent,
          data: {
            id: draggedComponent.id,
            type: 'mapping',
            name: `New Mapping`,
            category: 'DataStructures',
            keyType: 'uint256', 
            valueType: 'uint256', 
            visibility: 'public',
            defaultValues: {},
          },
        } as DraggableComponent;
      }
  
      case 'array': {
        return {
          ...baseComponent,
          data: {
            id: draggedComponent.id,
            type: 'array',
            name: `New Array`,
            category: 'DataStructures',
            dataType: 'uint256', 
            length: undefined, 
            visibility: 'public',
            defaultValues: {},
          },
        } as DraggableComponent;
      }
  
      case 'integration': {
        return {
          ...baseComponent,
          data: {
            id: draggedComponent.id,
            type: 'integration',
            name: `New Integration`,
            category: 'OracleIntegrations',
            standard: 'Custom',
            features: [],
            defaultValues: {},
          },
        } as DraggableComponent;
      }
  
      case 'security': {
        return {
          ...baseComponent,
          data: {
            id: draggedComponent.id,
            type: 'security',
            name: `New Security Feature`,
            category: 'BasicComponents',
            featureType: 'ownable',
            implementation: '',
            requirements: [],
            defaultValues: {},
          },
        } as DraggableComponent;
      }
  
      case 'oracle': {
        return {
          ...baseComponent,
          data: {
            id: draggedComponent.id,
            type: 'oracle',
            name: `New Oracle Integration`,
            category: 'OracleIntegrations',
            provider: 'chainlink',
            endpoint: '',
            parameters: [],
            defaultValues: {},
          },
        } as DraggableComponent;
      }
  
      case 'externalCall': {
        return {
          ...baseComponent,
          data: {
            id: draggedComponent.id,
            type: 'externalCall',
            name: `New External Call`,
            category: 'OracleIntegrations',
            target: '',
            method: '',
            parameters: [],
            safetyChecks: [],
            defaultValues: {},
          },
        } as DraggableComponent;
      }
  
      default:
        throw new Error(`Unsupported component type: ${draggedComponent.type}`);
    }
  };
  
  if (!currentContract) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700">No Contract Selected</h2>
          <p className="mt-2 text-gray-500">Please select or create a contract to start editing</p>
        </div>
      </div>
    );
  }

  return (
    <UndoRedoProvider>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onDragOver={(event) => {
          console.log('🔍 Drag Over:', event.over);
        }}
        autoScroll={true}
      >
        {/* Main editing area */}
        <div className="h-screen flex overflow-hidden bg-gray-50">
          {/* Left panel - Component palette */}
          <ComponentPalette />

          {/* Middle panel - Editor area */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            <Toolbar
              onSave={handleSaveContract}
              onToggleGrid={() => setShowGrid(!showGrid)}
              showGrid={showGrid}
              zoom={zoom}
              onZoomChange={setZoom}
              onAutoArrange={() => {}}
            />
            <EditorBoard
              components={components}
              selectedComponentId={selectedComponentId}
              onComponentSelect={setSelectedComponentId}
              zoom={zoom}
              showGrid={showGrid}
              isConnecting={isConnecting}
              connectionStart={connectionStart}
              onConnectionStart={handleConnectionStart}
              onConnectionEnd={handleConnectionEnd}
            />
          </div>

          {/* Right panel - Detail panel */}
          <DetailPanel
            isOpen={!!selectedComponentId}
            component={selectedComponentId ? components[selectedComponentId] : null}
            onClose={() => setSelectedComponentId(null)}
            onUpdate={updateComponent}
          />
        </div>

        {/* Drag overlay */}
        <DragOverlay>
          {draggedComponent && (
            <ComponentInstance
              component={createDraggableComponentFromDragData(
                draggedComponent,
                { x: 0, y: 0 } 
              )}
              isSelected={false}
              isConnecting={false}
              isConnectionStart={false}
              onClick={() => {}}
              onConnectionStart={() => {}}
            />
          )}
        </DragOverlay>

      </DndContext>
    </UndoRedoProvider>
  );
};

export default EditContract;
