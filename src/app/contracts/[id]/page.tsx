// pages/contracts/[id]/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useProjectStore } from '@/stores/useProjectStore';
import ContractSteps from '@/components/contracts';

const ContractPage = () => {
  const params = useParams();
  const currentProject = useProjectStore((state) => state.currentProject);
  const currentContract = useProjectStore((state) => state.currentContract);
  const setCurrentContract = useProjectStore((state) => state.setCurrentContract);

  useEffect(() => {
    if (currentProject && params.id) {
      const contract = currentProject.contracts?.find(c => c.id === params.id);
      if (contract) {
        setCurrentContract(contract);
      }
    }
  }, [currentProject, params.id, setCurrentContract]);

  if (!currentContract) {
    return <div>Contract not found!</div>;
  }

  return <ContractSteps />;
};

export default ContractPage;