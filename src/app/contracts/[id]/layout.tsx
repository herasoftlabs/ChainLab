import React from 'react';
import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full h-full overflow-hidden">
      <div className="flex flex-col flex-1 h-full overflow-auto">
        {children}
      </div>
    </div>
  );
}
