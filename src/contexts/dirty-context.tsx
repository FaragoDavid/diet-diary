import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface DirtyContextValue {
  dirty: boolean;
  markDirty: () => void;
  clearDirty: () => void;
}

const DirtyContext = createContext<DirtyContextValue | null>(null);

let registeredMarkDirty: (() => void) | null = null;

export function notifyDirty(): void {
  registeredMarkDirty?.();
}

export function DirtyProvider({ children }: { children: ReactNode }) {
  const [dirty, setDirty] = useState(false);

  const markDirty = () => setDirty(true);
  const clearDirty = () => setDirty(false);

  useEffect(() => {
    registeredMarkDirty = markDirty;
    return () => {
      registeredMarkDirty = null;
    };
  }, []);

  return <DirtyContext.Provider value={{ dirty, markDirty, clearDirty }}>{children}</DirtyContext.Provider>;
}

export function useDirty(): DirtyContextValue {
  const context = useContext(DirtyContext);
  if (!context) throw new Error('useDirty must be used within DirtyProvider');
  return context;
}
