// components/contracts/steps/test-contract/TestContract.tsx
'use client';

import React from 'react';
import { useProjectStore } from '@/stores/useProjectStore';



const TestContract = () => {
  const currentContract = useProjectStore((state) => state.currentContract);
 
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold text-gray-800">
        Contract Test feature is under construction
      </h2>
    </div>
  );
};

export default TestContract;
