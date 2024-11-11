// src/types/deploy.ts
export type DeploymentOption = 'download' | 'deploy' | null;
export type DeployStep = 'wallet' | 'network' | 'settings' | 'deploy';
export type DeploymentStatus = 'idle' | 'compiling' | 'deploying' | 'verifying' | 'success' | 'error';

export interface DeploySettings {
  optimizeRuns: number;
  verifyContract: boolean;
  autoPublishSource: boolean;
}

export interface StepConfig {
  id: DeployStep;
  title: string;
  icon: React.ReactNode;
}