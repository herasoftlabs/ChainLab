// components/contracts/steps/edit-contract/chain/evm/DetailPanel/DynamicComponentForm.tsx

import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { nanoid } from 'nanoid';
import * as z from 'zod';
import {
  DraggableComponent,
  ComponentType,
  DraggableComponentData,
  Visibility,
  Mutability,
  VariableMutability,
  BasicDataType,
  StructMember,
  FunctionParameter,
  EventParameter,
  isStateVariableComponentData,
  isFunctionComponentData,
  isMappingComponentData
} from '@/types/evm/contractTypes';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface DynamicComponentFormProps {
  component: DraggableComponent;
  onSubmit: (data: Partial<DraggableComponent>) => void;
}

export const DynamicComponentForm: React.FC<DynamicComponentFormProps> = ({ component, onSubmit }) => {
  const { type, data } = component;

  const initialFormConfig = getFormConfiguration(type, data);

  const form = useForm({
    resolver: zodResolver(initialFormConfig.schema),
    defaultValues: initialFormConfig.defaultValues as any,
  });

  useEffect(() => {
    const newFormConfig = getFormConfiguration(type, data);
    form.reset(newFormConfig.defaultValues as any);
  }, [type, data, form]);

  const handleSubmit = (formData: any) => {
    const updatedData = { ...data, ...formData };
    onSubmit({
      data: updatedData,
    });
  };

  const currentFormConfig = getFormConfiguration(type, data);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {currentFormConfig.renderFields(form)}
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
};

function getFormConfiguration(type: ComponentType, data: DraggableComponentData) {
  const dataTypes = [
    'address', 'bool', 'string', 'bytes', 'uint256', 'int256', 'bytes32'
  ] as const;

  const visibilityOptions = ['public', 'private', 'internal', 'external'] as const;
  const mutabilityOptions = ['pure', 'view', 'payable', 'nonpayable'] as const;

  switch (type) {
    case 'variable':
      return {
        schema: z.object({
          name: z.string().min(1),
          visibility: z.enum(visibilityOptions),
          mutability: z.enum(['mutable', 'immutable', 'constant'] as const),
          initialValue: z.string().optional(),
        }),
        defaultValues: {
          name: data.name || '',
          visibility: isStateVariableComponentData(data) ? data.visibility : 'private',
          mutability: isStateVariableComponentData(data) ? data.mutability : 'mutable',
          initialValue: isStateVariableComponentData(data) ? data.initialValue : '',
        },
        renderFields: (form: any) => (
          <>
            <FormField control={form.control} name="name" render={({ field }: any) => (
              <FormItem>
                <FormLabel>Variable Name</FormLabel>
                <FormControl>
                <Input {...field} placeholder="myVariable" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}/>
            <FormItem>
              <FormLabel>Data Type</FormLabel>
              <FormControl>
              <div className="text-sm text-gray-700">
                {isStateVariableComponentData(data) 
                ? typeof data.dataType === 'string'
                  ? data.dataType 
                  : JSON.stringify(data.dataType) 
                : 'N/A'}
                </div>
              </FormControl>
            </FormItem>
            <FormField control={form.control} name="visibility" render={({ field }: any) => (
              <FormItem>
                <FormLabel>Visibility</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select visibility" /></SelectTrigger></FormControl>
                  <SelectContent>{visibilityOptions.map((visibility) => (
                    <SelectItem key={visibility} value={visibility}>{visibility}</SelectItem>
                  ))}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}/>
            <FormField control={form.control} name="mutability" render={({ field }: any) => (
              <FormItem>
                <FormLabel>Mutability</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select mutability" /></SelectTrigger></FormControl>
                  <SelectContent>{['mutable', 'immutable', 'constant'].map((mutability) => (
                    <SelectItem key={mutability} value={mutability}>{mutability}</SelectItem>
                  ))}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}/>
            <FormField control={form.control} name="initialValue" render={({ field }: any) => (
              <FormItem>
                <FormLabel>Initial Value (Optional)</FormLabel>
                <FormControl><Input {...field} placeholder="e.g., 100" /></FormControl>
                <FormMessage />
              </FormItem>
            )}/>
          </>
        ),
      };
      
    case 'function':
      return {
        schema: z.object({
          name: z.string().min(1),
          visibility: z.enum(visibilityOptions),
          stateMutability: z.enum(mutabilityOptions),
          parameters: z.array(z.object({ id: z.string(), name: z.string().min(1), type: z.string() })),
          returnParameters: z.array(z.object({ id: z.string(), name: z.string().min(1), type: z.string() })),
          modifiers: z.array(z.string()),
        }),
        defaultValues: {
          name: data.name || '',
          visibility: (data as any).visibility || 'public',
          stateMutability: (data as any).stateMutability || 'nonpayable',
          parameters: (data as any).parameters || [],
          returnParameters: (data as any).returnParameters || [],
          modifiers: (data as any).modifiers || [],
        },
        renderFields: (form: any) => (
          <>
            <FormField control={form.control} name="name" render={({ field }: any) => (
              <FormItem>
                <FormLabel>Function Name</FormLabel>
                <FormControl><Input {...field} placeholder="myFunction" /></FormControl>
                <FormMessage />
              </FormItem>
            )}/>
            {/* Visibility */}
            <FormField control={form.control} name="visibility" render={({ field }: any) => (
              <FormItem>
                <FormLabel>Visibility</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select visibility" /></SelectTrigger></FormControl>
                  <SelectContent>{visibilityOptions.map((visibility) => (
                    <SelectItem key={visibility} value={visibility}>{visibility}</SelectItem>
                  ))}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}/>
            <FormItem>
              <FormLabel>State Mutability</FormLabel>
              <FormControl>
                <div className="text-sm text-gray-700">
                {isFunctionComponentData(data) ? data.stateMutability : "Not specified"} 
                </div>
              </FormControl>
            </FormItem>
            {/* Parameters and Return Parameters */}
            <DynamicParameterFields form={form} fieldName="parameters" title="Parameters" dataTypes={dataTypes} />
            <DynamicParameterFields form={form} fieldName="returnParameters" title="Return Parameters" dataTypes={dataTypes} />
          </>
        ),
      };

    case 'constructor':
      return {
        schema: z.object({
          name: z.string().min(1),
          parameters: z.array(z.object({
            id: z.string(),
            name: z.string().min(1),
            type: z.enum(dataTypes),
          })),
          modifiers: z.array(z.string()),
        }),
        defaultValues: {
          name: data.name || '',
          parameters: 'parameters' in data ? data.parameters : [],
          modifiers: 'modifiers' in data ? data.modifiers : [],
        },
        renderFields: (form: any) => (
          <>
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Constructor Name</FormLabel>
                <FormControl><Input {...field} placeholder="Constructor Name" /></FormControl>
                <FormMessage />
              </FormItem>
            )}/>
            <DynamicParameterFields form={form} fieldName="parameters" title="Parameters" dataTypes={dataTypes} />
            <DynamicParameterFields form={form} fieldName="modifiers" title="Modifiers" dataTypes={[]} />
          </>
        ),
      };

    case 'event':
      return {
        schema: z.object({
          name: z.string().min(1),
          parameters: z.array(z.object({
            id: z.string(),
            name: z.string().min(1),
            type: z.enum(dataTypes),
            indexed: z.boolean().optional(),
          })),
        }),
        defaultValues: {
          name: data.name || '',
          parameters: 'parameters' in data ? data.parameters : [],
        },
        renderFields: (form: any) => (
          <>
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Event Name</FormLabel>
                <FormControl><Input {...field} placeholder="Event Name" /></FormControl>
                <FormMessage />
              </FormItem>
            )}/>
            <DynamicParameterFields form={form} fieldName="parameters" title="Event Parameters" dataTypes={dataTypes} />
          </>
        ),
      };

      case 'mapping':
        if (isMappingComponentData(data)) {
          return {
            schema: z.object({
              keyType: z.enum(dataTypes),
              valueType: z.string(),
              visibility: z.enum(visibilityOptions),
            }),
            defaultValues: {
              keyType: data.keyType || 'address',
              valueType: typeof data.valueType === 'string' ? data.valueType : '',
              visibility: data.visibility || 'public',
            },
            renderFields: (form: any) => (
              <>
                <FormField control={form.control} name="keyType" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select key type" /></SelectTrigger></FormControl>
                      <SelectContent>{dataTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}/>
                <FormField control={form.control} name="valueType" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select value type" /></SelectTrigger></FormControl>
                      <SelectContent>{dataTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}/>

                <FormField control={form.control} name="visibility" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select visibility" /></SelectTrigger></FormControl>
                      <SelectContent>{visibilityOptions.map((visibility) => (
                        <SelectItem key={visibility} value={visibility}>{visibility}</SelectItem>
                      ))}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}/>
              </>
            ),
          };
        }
    
    case 'modifier':
      return {
        schema: z.object({
          name: z.string().min(1),
          parameters: z.array(z.object({
            id: z.string(),
            name: z.string().min(1),
            type: z.enum(dataTypes),
          })),
        }),
        defaultValues: {
          name: data.name || '',
          parameters: 'parameters' in data ? data.parameters : [],
        },
        renderFields: (form: any) => (
          <>
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Modifier Name</FormLabel>
                <FormControl><Input {...field} placeholder="Modifier Name" /></FormControl>
                <FormMessage />
              </FormItem>
            )}/>
            <DynamicParameterFields form={form} fieldName="parameters" title="Modifier Parameters" dataTypes={dataTypes} />
          </>
        ),
      };

      default:
        return {
          schema: z.object({}),
          defaultValues: {},
          renderFields: (form: any) => (
            <div className="p-4 text-sm text-gray-500">
              No editor available for this component type.
            </div>
          ),
        };
  }
}

interface DynamicParameterFieldsProps {
  form: any;
  fieldName: string;
  title: string;
  dataTypes: readonly BasicDataType[];
}

const DynamicParameterFields: React.FC<DynamicParameterFieldsProps> = ({ form, fieldName, title, dataTypes }) => {
  const { fields, append, remove } = useFieldArray({ control: form.control, name: fieldName });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel>{title}</FormLabel>
        <Button type="button" variant="outline" size="sm" onClick={() => append({ id: nanoid(), name: '', type: '' })}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center space-x-2">
          <input type="hidden" {...form.register(`${fieldName}.${index}.id`)} />
          <FormField control={form.control} name={`${fieldName}.${index}.name`} render={({ field }) => (
            <FormItem className="flex-1"><FormControl><Input {...field} placeholder="Name" /></FormControl><FormMessage /></FormItem>
          )}/>
          <FormField control={form.control} name={`${fieldName}.${index}.type`} render={({ field }) => (
            <FormItem className="flex-1">
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger></FormControl>
                <SelectContent>{dataTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}</SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}/>
          <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>
        </div>
      ))}
    </div>
  );
};
