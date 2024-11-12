// src/app/contracts/[id]/page.tsx
'use client';
import React, { Suspense, useEffect } from 'react';
import ContractSteps from '@/components/contracts';
import { useProjectStore } from '@/stores/useProjectStore';

// Ana sayfa komponenti
export default function ContractPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContractContent contractId={params.id} />
    </Suspense>
  );
}

// İç komponent
function ContractContent({ contractId }: { contractId: string }) {
  const currentProject = useProjectStore((state) => state.currentProject);
  const currentContract = useProjectStore((state) => state.currentContract);
  const setCurrentContract = useProjectStore((state) => state.setCurrentContract);

  useEffect(() => {
    if (currentProject && contractId) {
      const contract = currentProject.contracts?.find(c => c.id === contractId);
      if (contract) {
        setCurrentContract(contract);
      }
    }
  }, [currentProject, contractId, setCurrentContract]);

  if (!currentContract) {
    return <div>Contract not found!</div>;
  }

  return <ContractSteps />;
}