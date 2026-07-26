import { useCallback, useEffect, useState } from 'react';
import { getCachedSystemStatus, getSystemMetrics, getSystemStatus } from '../services/SystemEngine';
import { SystemMetricsData, SystemStatus } from '../types';

export function useSystemStatus(pollingIntervalMs: number = 3000) {
  const [status, setStatus] = useState<SystemStatus | null>(() => getCachedSystemStatus());
  const [metrics, setMetrics] = useState<SystemMetricsData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(() => !getCachedSystemStatus());

  const refreshStatus = useCallback(async () => {
    try {
      const [data, metricsRes] = await Promise.all([
        getSystemStatus(),
        getSystemMetrics()
      ]);

      if (data) {
        const updatedStatus = { ...data };
        if (metricsRes?.success && metricsRes.data) {
          setMetrics(prev => {
            if (prev && JSON.stringify(prev) === JSON.stringify(metricsRes.data)) {
              return prev;
            }
            return metricsRes.data ?? null;
          });
          if (metricsRes.data.cpuUsage !== undefined) {
            updatedStatus.cpuUsage = metricsRes.data.cpuUsage;
          }
        }
        setStatus(prev => {
          if (prev && JSON.stringify(prev) === JSON.stringify(updatedStatus)) {
            return prev;
          }
          return updatedStatus;
        });
      }
      setError(null);
      setLoading(false);
    } catch (err: unknown) {
      console.error("Dashboard status/telemetry error:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const fetchTelemetry = async () => {
      if (document.hidden) return;
      try {
        const [data, metricsRes] = await Promise.all([
          getSystemStatus(),
          getSystemMetrics()
        ]);

        if (isMounted) {
          if (data) {
            const updatedStatus = { ...data };
            if (metricsRes?.success && metricsRes.data) {
              setMetrics(prev => {
                if (prev && JSON.stringify(prev) === JSON.stringify(metricsRes.data)) {
                  return prev;
                }
                return metricsRes.data ?? null;
              });
              if (metricsRes.data.cpuUsage !== undefined) {
                updatedStatus.cpuUsage = metricsRes.data.cpuUsage;
              }
            }
            setStatus(prev => {
              if (prev && JSON.stringify(prev) === JSON.stringify(updatedStatus)) {
                return prev;
              }
              return updatedStatus;
            });
          }
          setError(null);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (isMounted) {
          console.error("Dashboard status/telemetry error:", err);
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      }
    };

    fetchTelemetry();

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchTelemetry();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    const interval = setInterval(fetchTelemetry, pollingIntervalMs);

    return () => {
      isMounted = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, [pollingIntervalMs]);

  return { status, metrics, error, loading, refreshStatus };
}

