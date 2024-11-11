// src/app/dashboard/layout.tsx
"use client";
import React, {useEffect} from 'react';
import { ReactNode } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

import { useWebContainerStore } from '@/stores/useWebContainerStore';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { initWebContainer, status, error } = useWebContainerStore();

  useEffect(() => {
    initWebContainer();
  }, [status, error]);

  return (
    <div className="flex min-h-screen w-full">
      <DashboardSidebar />
      <div className="flex flex-col flex-1">
        <DashboardHeader />
        {status === 'WebContainer başlatılıyor...' && (
          <div className="p-4 bg-primary text-white flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
              <span>System is being prepared...</span>
            </div>
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-50 text-red-700">
            <div className="flex items-center space-x-2">
              <span>⚠️</span>
              <span>Warning: {error}</span>
            </div>
          </div>
        )}
      
        {children}
      </div>
    </div>
  );
}
