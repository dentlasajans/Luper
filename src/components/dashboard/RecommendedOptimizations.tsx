import { LuperButton } from '../ui/LuperButton';
import { ArrowUpRight, ShieldCheck, Sparkle, CheckCircle } from '@/src/components/ui/Icons';
import { motion } from 'motion/react';
import { memo, useCallback, useEffect, useState } from 'react';
import { getAllOptimizationSettings } from '../../services/FirebaseService';
import { applyOptimization, getAppliedOptimizationIds } from '../../services/SystemEngine';
import { OptimizationSetting } from '../../types';
import { notifyError, notifySuccess } from '../../utils/notify';
import { useAutoAnimate } from '@formkit/auto-animate/react';

import { deepEqual } from '../../utils/equals';

interface Props {
  lowQualityMode: boolean;
}

function calculateSettingPriorityScore(setting: OptimizationSetting): number {
  let score = 0;
  const impacts = setting.impacts;

  // 1. Performance Impact (Highest Priority)
  if (impacts?.performance?.level === 'positive_high') score += 1000;
  else if (impacts?.performance?.level === 'positive_medium') score += 600;
  else if (impacts?.performance?.level === 'positive_low') score += 300;

  // 2. Latency Impact (Second Priority)
  if (impacts?.latency?.level === 'positive_high') score += 100;
  else if (impacts?.latency?.level === 'positive_medium') score += 60;
  else if (impacts?.latency?.level === 'positive_low') score += 30;

  // 3. Network/Internet Bonus (Third Priority)
  const isNetwork = setting.id.toLowerCase().includes('network') || 
                    setting.id.toLowerCase().includes('tcp') || 
                    setting.id.toLowerCase().includes('dns') || 
                    setting.id.toLowerCase().includes('internet');
  if (isNetwork) {
    score += 10;
  }

  return score;
}

function getPrimaryImpactLabel(setting: OptimizationSetting): string {
  const impacts = setting.impacts;
  if (impacts?.performance?.level === 'positive_high') return 'Performans: Y?ksek Pozitif';
  if (impacts?.performance?.level === 'positive_medium') return 'Performans: Orta Pozitif';
  if (impacts?.performance?.level === 'positive_low') return 'Performans: Hafif Pozitif';
  if (impacts?.latency?.level === 'positive_high') return 'Gecikme: Y?ksek Iyilesme';
  if (impacts?.latency?.level === 'positive_medium') return 'Gecikme: Orta Iyilesme';
  if (impacts?.latency?.level === 'positive_low') return 'Gecikme: D?s?k Iyilesme';
  return 'Genel Kararlilik Artisi';
}

export const RecommendedOptimizations = memo(({ lowQualityMode }: Props) => {
  const [recommendations, setRecommendations] = useState<OptimizationSetting[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [parent] = useAutoAnimate<HTMLDivElement>();

  const loadRecommendations = useCallback(() => {
    let appliedIds: string[] = getAppliedOptimizationIds();
    
    // Check local storage directly in case SystemEngine is out of sync
    try {
      const stored = localStorage.getItem('applied_optimizations');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) appliedIds = Array.from(new Set([...appliedIds, ...parsed]));
      }
    } catch (e) {}

    const allSettings = getAllOptimizationSettings();
    const unapplied = allSettings.filter((s) => !appliedIds.includes(s.id));

    unapplied.sort((a, b) => calculateSettingPriorityScore(b) - calculateSettingPriorityScore(a));

    // Show top 2 unapplied recommendations
    setRecommendations(unapplied.slice(0, 2));
  }, []);

  useEffect(() => {
    loadRecommendations();

    const handleUpdate = () => loadRecommendations();
    window.addEventListener('settings_cache_updated', handleUpdate);
    window.addEventListener('applied_optimizations_changed', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('settings_cache_updated', handleUpdate);
      window.removeEventListener('applied_optimizations_changed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [loadRecommendations]);

  const handleApply = useCallback(async (setting: OptimizationSetting) => {
    if (processingId || successId) return;

    setProcessingId(setting.id);
    try {
      await applyOptimization(setting.id, setting.applyCode || '');
      
      // Update LocalStorage applied optimizations array
      let localArray: string[] = [];
      try {
        const stored = localStorage.getItem('applied_optimizations');
        if (stored) localArray = JSON.parse(stored);
      } catch (e) {}

      if (!localArray.includes(setting.id)) {
        localArray.push(setting.id);
        localStorage.setItem('applied_optimizations', JSON.stringify(localArray));
      }

      window.dispatchEvent(new CustomEvent('applied_optimizations_changed', { detail: { id: setting.id, status: 'optimized' } }));

      notifySuccess('Optimizasyon Uygulandi', `${setting.name} basariyla uygulandi.`);


      setProcessingId(null);
      setSuccessId(setting.id);

      // Keep checkmark visible for 1 second before updating list
      setTimeout(() => {
        setSuccessId(null);
        loadRecommendations();

      }, 1000);

    } catch (err) {
      console.error('Optimizasyon uygulanamadi:', err);
      notifyError('Optimizasyon Uygulanamadi', setting.name);
      setProcessingId(null);
    }
  }, [processingId, successId, loadRecommendations]);

  return (
    <div style={{ transform: 'translateZ(0)', willChange: 'transform, opacity', contain: 'layout style' }} className={`flex flex-col justify-between w-full h-full bg-[#1a1a1d] ${lowQualityMode ? '' : ''} border border-white/[0.08] rounded-3xl p-7 transition-colors duration-500 hover:bg-[#1a1a1d] hover:border-white/[0.12]`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#1a1a1d] border border-white/[0.06] flex items-center justify-center shrink-0 transition-all duration-300">
            <Sparkle size={20} weight="duotone" className="text-luper-primary" />
          </div>
          <div>
            <h3 className="text-[#f5f5f7] font-semibold tracking-tight text-[16px]">?nerilen Optimizasyonlar</h3>
            <p className="text-[#a1a1a6] text-[13px] font-medium tracking-tight mt-0.5">Sistem donaniminiza ?zel olarak eslesen ?neriler</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-start overflow-y-auto px-1.5 py-2 -mx-1.5 -mt-2 custom-scrollbar">
        {recommendations.length === 0 ? (
          <div className="w-full h-full min-h-[160px] bg-[#1a1a1d] border border-white/[0.06] rounded-xl flex flex-col items-center justify-center p-6 text-center mt-2">
            <CheckCircle size={64} weight="duotone" className="text-[#86868b] mb-2 opacity-50" />
            <h4 className="text-white font-medium mb-1">T?m optimizasyonlar aktif!</h4>
            <p className="text-[#86868b] text-[13px] max-w-[250px]">Sisteminiz maksimum performansta ?alisiyor.</p>
          </div>
        ) : (
          <div ref={parent} className="grid grid-cols-1 w-full gap-3">
            {recommendations.map((item) => {
              const isProcessing = processingId === item.id;
              const isSuccess = successId === item.id;
              const impactLabel = getPrimaryImpactLabel(item);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  whileHover={{ scale: 1.015, y: -2 }}
                  style={{ transform: 'translateZ(0)', willChange: 'transform, opacity', contain: 'layout style' }}
                  className="w-full p-4.5 bg-[#1a1a1d] border border-white/[0.06] rounded-2xl hover:border-luper-primary/40 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[14px] font-semibold text-white tracking-tight">{item.name}</span>
                      <span className="px-3 py-1 rounded-full bg-luper-primary/15 text-[#64d2ff] text-[12px] font-medium tracking-tight whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]" title={impactLabel}>
                        {impactLabel}
                      </span>
                    </div>
                    <p className="text-[#a1a1a6] text-[13px] leading-relaxed mb-3" title={item.description}>{item.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.04]">
                    <div className="flex items-center space-x-2 text-[12px] text-[#86868b]">
                      <ShieldCheck size={14} weight="duotone" className="text-[#34c759]" />
                      <span className="text-[#34c759] font-medium">G?venli Optimizasyon</span>
                    </div>
                    <LuperButton variant="primary" status={isProcessing ? "loading" : isSuccess ? "success" : "idle"} onClick={() => handleApply(item)} icon={<ArrowUpRight size={14} weight="duotone" />} loadingText="Uygulaniyor..." successText="Uygulandi">Uygula</LuperButton>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}, deepEqual);

