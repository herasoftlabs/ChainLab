// types/formConfig.ts
import { z, ZodSchema } from 'zod';
import { JSX } from 'react';
import { DraggableComponentData } from '@/types/evm/contractTypes';

export interface FormConfig {
  schema: ZodSchema<any>;
  defaultValues: (data: DraggableComponentData) => any;
  renderFields: (form: any) => JSX.Element;
}
