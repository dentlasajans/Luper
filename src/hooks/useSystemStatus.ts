import { useCallback, useEffect, useState } from 'react';
import { getCachedSystemStatus, getSystemMetrics, getSystemStatus } from '../services/SystemEngine';
import { SystemMetricsData, SystemStatus } from '../types';

let globalStatus: SystemStatus | null = getCachedSystemStatus();
let globalMetrics: SystemMetricsData | null = null;
let globalError: Error | null = null;
let globalLoading: boolean = !globalStatus;
const subscribers = new Set<() => void>();
let pollingInterval: NodeJS.Timeout | null = null;

const notifySubscribers = () => {
  subscribers.forEach((sub) => sub());
};

const fetchTelemetry = async () => {
  if (document.hidden) return;
  try {
    const [data, metricsRes] = await Promise.all([
      getSystemStatus(),
      getSystemMetrics()
    ]);
    
    let changed = false;
    if (data) {
      const updatedStatus = { ...data };
      if (metricsRes?.success && metricsRes.data) {
        if (!globalMetrics || JSON.stringify(globalMetrics) !== JSON.stringify(metricsRes.data)) {
          globalMetrics = metricsRes.data ?? null;
          changed = true;
        }
        if (metricsRes.data.cpuUsage !== undefined) {
          updatedStatus.cpuUsage = metricsRes.data.cpuUsage;
        }
      }
      if (!globalStatus || JSON.stringify(globalStatus) !== JSON.stringify(updatedStatus)) {
        globalStatus = updatedStatus;
        changed = true;
      }
    }
    if (globalError !== null || globalLoading !== false) {
      globalError = null;
      globalLoading = false;
      changed = true;
    }
    
    if (changed) notifySubscribers();
  } catch (err) {
    const newError = err instanceof Error ? err : new Error(String(err));
    if (globalError?.message !== newError.message || globalLoading !== false) {
      globalError = newError;
      globalLoading = false;
      notifySubscribers();
    }
  }
};

const handleVisibilityChange = () => {
  if (!document.hidden) {
    fetchTelemetry();
  }
};

export function useSystemStatus(pollingIntervalMs: number = 3000) {
  const [state, setState] = useState({
    status: globalStatus,
    metrics: globalMetrics,
    error: globalError,
    loading: globalLoading
  });

  useEffect(() => {
    const subscriber = () => {
      setState({
        status: globalStatus,
        metrics: globalMetrics,
        error: globalError,
        loading: globalLoading
      });
    };
    
    subscribers.add(subscriber);
    
    if (subscribers.size === 1) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
      fetchTelemetry();
      pollingInterval = setInterval(fetchTelemetry, pollingIntervalMs);
    }
    
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        if (pollingInterval) {
          clearInterval(pollingInterval);
          pollingInterval = null;
        }
      }
    };
  }, [pollingIntervalMs]);

  const refreshStatus = useCallback(async () => {
    await fetchTelemetry();
  }, []);

  return { ...state, refreshStatus };
}

