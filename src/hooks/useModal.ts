/* import { useState, useCallback } from 'react';

interface ModalData {
  [key: string]: any;
}

export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [data, setData] = useState<ModalData | null>(null);

  const open = useCallback((modalData?: ModalData) => {
    setData(modalData || null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setData(null);
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return { 
    isOpen, 
    open, 
    close, 
    toggle,
    data 
  };
}; */