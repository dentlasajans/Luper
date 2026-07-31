import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { applyOptimization, getCategorySettings, restoreOptimization } from '../services/SystemEngine';
import { OptimizationSetting } from '../types';
import { notifyError, notifyInfo, notifySuccess } from '../utils/notify';

export function useCategorySettings(categoryId: string, retryCount: number) {
  const [settings, setSettings] = useState<OptimizationSetting[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingState, setProcessingState] = useState<Record<string, 'processing' | 'success' | 'error'>>({});
  const [error, setError] = useState<Error | null>(null);

  const defaultSettings = useMemo<OptimizationSetting[]>(() => [], [categoryId]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    
    getCategorySettings(categoryId)
      .then((data) => {
        if (isMounted) {
          try {
            const stored = JSON.parse(localStorage.getItem('applied_optimizations') || '[]');
            const storedValues = JSON.parse(localStorage.getItem('applied_optimization_values') || '{}');
            const appliedIds = Array.isArray(stored) ? stored : [];
            const hydratedData = data.map((item: OptimizationSetting) => {
              if (item.uiType === 'select') {
                 return { ...item, status: storedValues[item.id] || item.status || 'default' };
              }
              return {
                ...item,
                status: (appliedIds.includes(item.id) ? 'optimized' : 'default') as "optimized" | "default"
              };
            });
            setSettings(hydratedData);
          } catch (e) {
            console.error('Failed to parse applied_optimizations:', e);
            setSettings(data);
          }
          setLoading(false);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Ayarlar çekilemedi:", err);
          setSettings(defaultSettings);
          setLoading(false);
          setError(err);
        }
      });
      
    return () => { isMounted = false; };
  }, [categoryId, retryCount, defaultSettings]);

  const settingsRef = React.useRef<OptimizationSetting[] | null>(null);
  React.useEffect(() => { settingsRef.current = settings; }, [settings]);

  const timeoutsRef = React.useRef<Set<NodeJS.Timeout>>(new Set());

  React.useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach((t) => clearTimeout(t));
      timeouts.clear();
    };
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setSettings((prevSettings) => {
        if (!prevSettings) return prevSettings;
        try {
          const stored = JSON.parse(localStorage.getItem('applied_optimizations') || '[]');
          const storedValues = JSON.parse(localStorage.getItem('applied_optimization_values') || '{}');
          const appliedIds = Array.isArray(stored) ? stored : [];
          let changed = false;
          const newSettings = prevSettings.map((item) => {
            if (item.uiType === 'select') {
               const expectedStatus = storedValues[item.id] || item.status || 'default';
               if (item.status !== expectedStatus) {
                 changed = true;
                 return { ...item, status: expectedStatus };
               }
               return item;
            }
            const isApplied = appliedIds.includes(item.id);
            const expectedStatus = isApplied ? 'optimized' : 'default';
            if (item.status !== expectedStatus) {
              changed = true;
              return { ...item, status: expectedStatus as "optimized" | "default" };
            }
            return item;
          });
          return changed ? newSettings : prevSettings;
        } catch (e) {
          return prevSettings;
        }
      });
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('applied_optimizations_changed', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('applied_optimizations_changed', handleStorageChange);
    };
  }, []);

  const handleToggle = useCallback(async (id: string, currentStatus: string) => {
    if (!settingsRef.current) return;
    const setting = settingsRef.current.find((s) => s.id === id);
    if (!setting) return;
    
    // 1. Visual processing feedback
    setProcessingState((prev) => ({ ...prev, [id]: 'processing' }));

    try {
      const startTime = Date.now();

      let ipcSuccess = true;
      if (setting.uiType === 'select') {
        // currentStatus holds the NEW value because it's passed from handleToggle(id, newValue)
        if (typeof window !== 'undefined' && 'electronAPI' in window) {
           ipcSuccess = await (window as any).electronAPI.invoke('apply-optimization', { id, status: currentStatus });
        }
      } else {
        if (currentStatus === 'optimized') {
          if (setting.restoreCode) {
             const res = await restoreOptimization(id, setting.restoreCode);
             if (res && res.success === false) ipcSuccess = false;
          }
        } else {
          if (setting.applyCode) {
             const res = await applyOptimization(id, setting.applyCode);
             if (res && res.success === false) ipcSuccess = false;
          }
        }
      }

      if (!ipcSuccess) {
         throw new Error("PowerShell optimizasyon işlemi başarısız oldu veya reddedildi.");
      }

      let result: any = { success: true };
      if (window.electron && window.electron.executeOptimization) {
        result = await window.electron.executeOptimization(id, currentStatus !== 'optimized');
      } else {
        await new Promise((r) => setTimeout(r, Math.max(0, 500 - (Date.now() - startTime))));
      }

      if (!result || result.success === false) {
        throw new Error(result?.error || "Çekirdek motor işlemi reddetti veya Native Modül bulunamadı.");
      }

      const newStatus = setting.uiType === 'select' ? currentStatus : (currentStatus === 'optimized' ? 'default' : 'optimized');
      
      // Sync applied optimizations in localStorage for System Score calculation
      try {
        if (setting.uiType === 'select') {
           const storedValues = JSON.parse(localStorage.getItem('applied_optimization_values') || '{}');
           storedValues[id] = newStatus;
           localStorage.setItem('applied_optimization_values', JSON.stringify(storedValues));
        } else {
           const stored = JSON.parse(localStorage.getItem('applied_optimizations') || '[]');
           let updated = Array.isArray(stored) ? stored : [];
           if (newStatus === 'optimized') {
             if (!updated.includes(id)) updated.push(id);
           } else {
             updated = updated.filter((item: string) => item !== id);
           }
           localStorage.setItem('applied_optimizations', JSON.stringify(updated));
        }
        window.dispatchEvent(new Event('applied_optimizations_changed'));
      } catch (e) {
        console.error('Failed to sync applied_optimizations:', e);
      }

      setSettings((prevSettings) => 
        prevSettings ? prevSettings.map((s) => s.id === id ? { ...s, status: newStatus as any } : s) : null
      );
      setProcessingState((prev) => ({ ...prev, [id]: 'success' }));

      if (setting.uiType === 'select') {
        notifySuccess('Ayar Değiştirildi', setting.name);
      } else {
        if (newStatus === 'optimized') {
          notifySuccess('Optimizasyon Uygulandı', setting.name);
        } else {
          notifyInfo('Varsayılana Döndürüldü', setting.name);
        }
      }

      const timer1 = setTimeout(() => {
        setProcessingState((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
        timeoutsRef.current.delete(timer1);
      }, 1500);
      timeoutsRef.current.add(timer1);

    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      console.error(`Error toggling optimization ${id}:`, errorObj);
      
      setSettings((prevSettings) => 
        prevSettings ? prevSettings.map((s) => s.id === id ? { ...s, status: currentStatus as "optimized" | "default" } : s) : null
      );
      setProcessingState((prev) => ({ ...prev, [id]: 'error' }));

      const actionName = currentStatus === 'optimized' ? 'Geri yükleme' : 'Optimizasyon';
      notifyError(`${actionName} Başarısız`, errorObj.message || 'Optimizasyon uygulanamadı.');
    }
  }, []);


  return { settings, defaultSettings, loading, error, processingState, handleToggle };
}
