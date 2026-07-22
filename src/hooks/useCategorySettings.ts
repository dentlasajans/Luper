import { useState, useEffect, useCallback } from 'react';
import { OptimizationSetting } from '../types';
import { subscribeToCategorySettings } from '../services/SystemEngine';

export function useCategorySettings(categoryId: string, retryCount: number) {
  const [settings, setSettings] = useState<OptimizationSetting[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingState, setProcessingState] = useState<Record<string, 'processing' | 'success'>>({});
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    
    const unsubscribe = subscribeToCategorySettings(
      categoryId,
      (data) => {
        // Merge the new data with current status state because real-time updates will reset 'status' to 'default'
        // Ideally we would want to preserve the 'optimized' status if the user toggled it.
        // For now, since Firebase only has static metadata, we accept the new data but preserve the user's toggle state if possible.
        setSettings(current => {
          if (!current) return data;
          return data.map(newItem => {
            const existing = current.find(s => s.id === newItem.id);
            if (existing) {
              return { ...newItem, status: existing.status };
            }
            return newItem;
          });
        });
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Ayarlar çekilemedi:", err);
        setSettings([]);
        setLoading(false);
        setError(err);
      }
    );
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [categoryId, retryCount]);

  const handleToggle = useCallback(async (id: string, currentStatus: string) => {
    if (!settings) return;
    
    setProcessingState(prev => ({ ...prev, [id]: 'processing' }));
    
    // Simulate delay
    if (currentStatus === 'optimized') {
      await new Promise(r => setTimeout(r, 1500));
    } else {
      await new Promise(r => setTimeout(r, 1500));
    }
    
    setProcessingState(prev => ({ ...prev, [id]: 'success' }));
    const newStatus = currentStatus === 'optimized' ? 'default' : 'optimized';
    
    setSettings(prevSettings => 
      prevSettings ? prevSettings.map(s => s.id === id ? { ...s, status: newStatus as any } : s) : null
    );
    
    setTimeout(() => {
      setProcessingState(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }, 1500);
  }, [settings]);

  return { settings, loading, error, processingState, handleToggle };
}
