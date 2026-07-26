import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { getAppliedOptimizationIds, syncAppliedOptimizationsFromElectron } from '../services/SystemEngine';

interface OptimizationContextType {
  appliedIds: string[];
  isApplied: (id: string) => boolean;
  refreshAppliedIds: () => Promise<void>;
}

const OptimizationContext = createContext<OptimizationContextType | undefined>(undefined);

export function OptimizationProvider({ children }: { children: ReactNode }) {
  const [appliedIds, setAppliedIds] = useState<string[]>(getAppliedOptimizationIds());

  const refreshAppliedIds = async () => {
    try {
      await syncAppliedOptimizationsFromElectron();
      setAppliedIds(getAppliedOptimizationIds());
    } catch (e) {
      console.error('Failed to fetch applied optimizations:', e);
    }
  };

  useEffect(() => {
    refreshAppliedIds();
    const handleStorageChange = () => {
      setAppliedIds(getAppliedOptimizationIds());
    };
    window.addEventListener('applied_optimizations_changed', handleStorageChange);
    return () => window.removeEventListener('applied_optimizations_changed', handleStorageChange);
  }, []);

  const isApplied = (id: string) => appliedIds.includes(id);

  const value = useMemo(() => ({
    appliedIds,
    isApplied,
    refreshAppliedIds
  }), [appliedIds]);

  return (
    <OptimizationContext.Provider value={value}>
      {children}
    </OptimizationContext.Provider>
  );
}

export function useOptimizationContext() {
  const context = useContext(OptimizationContext);
  if (!context) {
    throw new Error('useOptimizationContext must be used within an OptimizationProvider');
  }
  return context;
}
