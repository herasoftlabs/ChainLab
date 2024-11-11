// src/app/dashboard/page.tsx
'use client';

import React from 'react';
import { useProjectStore } from '@/stores/useProjectStore';
import Dashboard from '@/components/dashboard/Dashboard';

const DashboardPage = () => {
  const projects = useProjectStore((state) => state.projects);
  

  return <Dashboard/>;
};

export default DashboardPage;
