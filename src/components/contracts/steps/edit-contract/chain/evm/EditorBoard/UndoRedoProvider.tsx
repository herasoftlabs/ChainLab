// components/contracts/steps/edit-contract/chain/evm/EditorBoard/UndoRedoProvider.tsx

import React, { createContext, useContext, useCallback, useRef } from 'react';
import { useComponentStore } from '@/stores/useComponentStore';

interface HistoryState {
  past: any[];
  present: any;
  future: any[];
}

interface UndoRedoContextType {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
}

const UndoRedoContext = createContext<UndoRedoContextType>({
  canUndo: false,
  canRedo: false,
  undo: () => {},
  redo: () => {},
});

export const UndoRedoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isUndoRedo = useRef(false);

  const [history, setHistory] = React.useState<HistoryState>({
    past: [],
    present: useComponentStore.getState().components,
    future: [],
  });

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  React.useEffect(() => {
    const unsubscribe = useComponentStore.subscribe((state) => {
      const components = state.components;
  
      if (isUndoRedo.current) {
        isUndoRedo.current = false;
        return;
      }
  
      setHistory((prev) => {
        if (prev.present === components) {
          return prev;
        }
  
        return {
          past: [...prev.past, prev.present],
          present: components,
          future: [],
        };
      });
    });
  
    return unsubscribe;
  }, []);
  
  

  const undo = useCallback(() => {
    if (!canUndo) return;

    setHistory((prev) => {
      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, prev.past.length - 1);

      isUndoRedo.current = true;
      useComponentStore.setState((state) => ({
        ...state,
        components: previous,
      }));

      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future],
      };
    });
  }, [canUndo]);

  const redo = useCallback(() => {
    if (!canRedo) return;

    setHistory((prev) => {
      const next = prev.future[0];
      const newFuture = prev.future.slice(1);

      isUndoRedo.current = true;
      useComponentStore.setState((state) => ({
        ...state,
        components: next,
      }));

      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture,
      };
    });
  }, [canRedo]);

  return (
    <UndoRedoContext.Provider value={{ canUndo, canRedo, undo, redo }}>
      {children}
    </UndoRedoContext.Provider>
  );
};

export const useUndoRedo = () => useContext(UndoRedoContext);
