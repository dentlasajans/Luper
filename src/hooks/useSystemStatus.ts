import { useState, useEffect } from 'react';
import { SystemStatus } from '../types';
import { getSystemStatus, getCachedSystemStatus } from '../services/SystemEngine';

export function useSystemStatus(pollingIntervalMs: number = 3000) {
  const initialData = getCachedSystemStatus();
  const [status, setStatus] = useState<SystemStatus | null>(initialData);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(!initialData);

  useEffect(() => {
    let isMounted = true;
    
    const fetchStatus = async () => {
      if (document.hidden) return;
      try {
        const data = await getSystemStatus();
        if (isMounted) {
          setStatus(data);
          setError(null);
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Dashboard status error:", err);
          setError(err);
          setLoading(false);
        }
      }
    };

    if (!initialData) {
      fetchStatus();
    } else {
      setLoading(false);
    }

    const interval = setInterval(fetchStatus, pollingIntervalMs);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [pollingIntervalMs, initialData]);

  return { status, error, loading };
}
