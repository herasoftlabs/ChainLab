// src/types/template.ts
export interface Template {
    id: string;
    name: string;
    description: string;
    thumbnail: string;
    category: string;
    features: string[];
    demoUrl: string;
    isNew?: boolean;
    isPremium?: boolean;
  }