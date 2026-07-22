import { useState, useEffect } from 'react';
import { SystemStatus } from '../types';
import { getSystemStatus } from '../services/SystemEngine';

let cachedStatus: SystemStatus | null = null;
let fetchPromise: Promise<SystemStatus> | null = null;

export function useSystemStatus() {
  const [status, setStatus] = useState<SystemStatus | null>(cachedStatus);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(!cachedStatus);

  useEffect(() => {
    if (cachedStatus) return;

    let isMounted = true;
    
    if (!fetchPromise) {
      fetchPromise = getSystemStatus();
    }

    fetchPromise
      .then(data => {
        cachedStatus = data;
        if (isMounted) {
          setStatus(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error("Dashboard veri çekme hatası:", err);
          setError(err);
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, []);

  return { status, error, loading };
}
