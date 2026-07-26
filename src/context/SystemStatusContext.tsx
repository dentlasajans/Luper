import { createContext, ReactNode, useContext, useMemo } from 'react';
import { useSystemStatus } from '../hooks/useSystemStatus';
import { SystemMetricsData, SystemStatus } from '../types';

interface SystemStatusContextType {
  status: SystemStatus | null;
  metrics: SystemMetricsData | null;
  error: Error | null;
  loading: boolean;
  refreshStatus: () => Promise<void>;
}

const SystemStatusContext = createContext<SystemStatusContextType | undefined>(undefined);

export function SystemStatusProvider({ children }: { children: ReactNode }) {
  const { status, metrics, error, loading, refreshStatus } = useSystemStatus();

  const value = useMemo(() => ({
    status,
    metrics,
    error,
    loading,
    refreshStatus
  }), [status, metrics, error, loading, refreshStatus]);

  return (
    <SystemStatusContext.Provider value={value}>
      {children}
    </SystemStatusContext.Provider>
  );
}

export function useSystemStatusContext() {
  const context = useContext(SystemStatusContext);
  if (!context) {
    throw new Error('useSystemStatusContext must be used within a SystemStatusProvider');
  }
  return context;
}
