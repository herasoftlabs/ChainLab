// src/components/dashboard/DashboardSidebar.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import {
  Home,
  Package,
  Settings,
  FileText,
  PieChart,
} from 'lucide-react';

import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import ProjectSwitcher from './ProjectSwitcher';

const DashboardSidebar = () => {
  return (
    <aside className="w-20 flex flex-col border-r bg-background">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
        {/* Proje Değiştirici */}
        <ProjectSwitcher />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Home className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Dashboard</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/settings"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Ayarlar</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Ayarlar</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
