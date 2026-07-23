import React, { useState, useEffect, useCallback } from 'react';
import { OptimizationSetting } from '../types';
import { getCategorySettings, applyOptimization, restoreOptimization } from '../services/SystemEngine';

export function useCategorySettings(categoryId: string, retryCount: number) {
  const [settings, setSettings] = useState<OptimizationSetting[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingState, setProcessingState] = useState<Record<string, 'processing' | 'success' | 'error'>>({});
  const [error, setError] = useState<Error | null>(null);
  const [toastMessage, setToastMessage] = useState<{message: string, type: 'error' | 'success'} | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    
    getCategorySettings(categoryId)
      .then(data => {
        if (isMounted) {
          setSettings(data);
          setLoading(false);
          setError(null);
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error("Ayarlar çekilemedi:", err);
          setSettings([]);
          setLoading(false);
          setError(err);
        }
      });
      
    return () => { isMounted = false; };
  }, [categoryId, retryCount]);

  const settingsRef = React.useRef<OptimizationSetting[] | null>(null);
  React.useEffect(() => { settingsRef.current = settings; }, [settings]);

  const handleToggle = useCallback((id: string, currentStatus: string) => {
    if (!settingsRef.current) return;
    const setting = settingsRef.current.find(s => s.id === id);
    if (!setting) return;
    
    // 1. Visual processing feedback
    setProcessingState(prev => ({ ...prev, [id]: 'processing' }));

    // 2. Fire-and-forget background execution (System process runs non-blocking)
    const bgTask = (async () => {
      if (currentStatus === 'optimized') {
        if (setting.restoreCode) await restoreOptimization(id, setting.restoreCode);
      } else {
        if (setting.applyCode) await applyOptimization(id, setting.applyCode);
      }
    })();

    bgTask.catch((err: any) => {
      console.error(`Background error toggling optimization ${id}:`, err);
      setSettings(prevSettings => 
        prevSettings ? prevSettings.map(s => s.id === id ? { ...s, status: currentStatus as any } : s) : null
      );
      setProcessingState(prev => ({ ...prev, [id]: 'error' }));

      const actionName = currentStatus === 'optimized' ? 'Geri yükleme' : 'Optimizasyon';
      setToastMessage({
        message: `${actionName} başarısız oldu: ${err.message || 'Kod uygulanamadı.'}`,
        type: 'error'
      });
      setTimeout(() => setToastMessage(null), 5000);
    });

    // 3. UI state transitions in exactly 0.5 seconds (500ms)
    setTimeout(() => {
      const newStatus = currentStatus === 'optimized' ? 'default' : 'optimized';
      
      // Sync applied optimizations in localStorage for System Score calculation
      try {
        const stored = JSON.parse(localStorage.getItem('applied_optimizations') || '[]');
        let updated = Array.isArray(stored) ? stored : [];
        if (newStatus === 'optimized') {
          if (!updated.includes(id)) updated.push(id);
        } else {
          updated = updated.filter((item: string) => item !== id);
        }
        localStorage.setItem('applied_optimizations', JSON.stringify(updated));
        window.dispatchEvent(new Event('applied_optimizations_changed'));
      } catch (e) {
        console.error('Failed to sync applied_optimizations:', e);
      }

      setSettings(prevSettings => 
        prevSettings ? prevSettings.map(s => s.id === id ? { ...s, status: newStatus as any } : s) : null
      );
      setProcessingState(prev => ({ ...prev, [id]: 'success' }));

      setTimeout(() => {
        setProcessingState(prev => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }, 300);
    }, 500);
  }, []);

  return { settings, loading, error, processingState, handleToggle, toastMessage, setToastMessage };
}
