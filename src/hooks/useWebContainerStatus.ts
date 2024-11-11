/* import { useState, useEffect } from 'react';
import { useWebContainerStore } from '@/stores/useWebContainerStore';

export const useWebContainerStatus = () => {
  const isReady = useWebContainerStore((state) => state.isReady);
  const [error, setError] = useState<string | null>(null);
  const [isTimeout, setIsTimeout] = useState(false);

  useEffect(() => {
    if (!isReady) {
      const timeout = setTimeout(() => {
        setIsTimeout(true);
        setError('Web Container initialization timeout');
      }, 30000);

      return () => clearTimeout(timeout);
    } else {
      setError(null);
      setIsTimeout(false);
    }
  }, [isReady]);

  return { isReady, error, isTimeout };
}; */