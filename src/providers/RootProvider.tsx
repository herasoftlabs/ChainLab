// src/providers/RootProvider.tsx

'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DynamicWalletProvider } from './wallet/DynamicWalletProvider';
import { ErrorBoundary } from './ErrorBoundary';
import { ToastContainer } from 'react-toastify';

const queryClient = new QueryClient();

export const RootProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <DynamicWalletProvider>
          {children}
          <ToastContainer />
        </DynamicWalletProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};