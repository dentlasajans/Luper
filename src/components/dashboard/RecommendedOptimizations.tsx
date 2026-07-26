import { ArrowUpRight, SpinnerGap, ShieldCheck, Sparkle, Check, CheckCircle } from '@phosphor-icons/react';
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
  if (impacts?.performance?.level === 'positive_high') return 'Performans: Yüksek Pozitif';
  if (impacts?.performance?.level === 'positive_medium') return 'Performans: Orta Pozitif';
  if (impacts?.performance?.level === 'positive_low') return 'Performans: Hafif Pozitif';
  if (impacts?.latency?.level === 'positive_high') return 'Gecikme: Yüksek İyileşme';
  if (impacts?.latency?.level === 'positive_medium') return 'Gecikme: Orta İyileşme';
  if (impacts?.latency?.level === 'positive_low') return 'Gecikme: Düşük İyileşme';
  return 'Genel Kararlılık Artışı';
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
    const unapplied = allSettings.filter(s => !appliedIds.includes(s.id));

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

      notifySuccess('Optimizasyon Uygulandı', `${setting.name} başarıyla uygulandı.`);


      setProcessingId(null);
      setSuccessId(setting.id);

      // Keep checkmark visible for 1 second before updating list
      setTimeout(() => {
        setSuccessId(null);
        loadRecommendations();

      }, 1000);

    } catch (err) {
      console.error('Optimizasyon uygulanamadı:', err);
      notifyError('Optimizasyon Uygulanamadı', setting.name);
      setProcessingId(null);
    }
  }, [processingId, successId, loadRecommendations]);

  return (
    <div style={{ transform: 'translateZ(0)', willChange: 'transform, opacity', contain: 'layout style' }} className={`flex flex-col justify-between w-full h-full bg-white/[0.02] ${lowQualityMode ? '' : 'backdrop-blur-xl'} border border-white/[0.08] rounded-3xl p-7 transition-colors duration-500 hover:bg-white/[0.03] hover:border-white/[0.12]`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0 transition-all duration-300">
            <Sparkle size={20} weight="duotone" className="text-[#1a5efd]" />
          </div>
          <div>
            <h3 className="text-[#f5f5f7] font-semibold tracking-tight text-[16px]">Önerilen Optimizasyonlar</h3>
            <p className="text-[#a1a1a6] text-[13px] font-medium tracking-tight mt-0.5">Sistem donanımınıza özel olarak eşleşen öneriler</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-start overflow-y-auto px-1.5 py-2 -mx-1.5 -mt-2 custom-scrollbar">
        {recommendations.length === 0 ? (
          <div className="w-full h-full min-h-[160px] bg-white/[0.02] border border-white/[0.06] rounded-xl flex flex-col items-center justify-center p-6 text-center mt-2">
            <CheckCircle size={64} weight="duotone" className="text-[#86868b] mb-2 opacity-50" />
            <h4 className="text-white font-medium mb-1">Tüm optimizasyonlar aktif!</h4>
            <p className="text-[#86868b] text-[13px] max-w-[250px]">Sisteminiz maksimum performansta çalışıyor.</p>
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
                  className="w-full p-4.5 bg-white/[0.02] border border-white/[0.06] rounded-2xl hover:border-[#1a5efd]/40 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[14px] font-semibold text-white tracking-tight">{item.name}</span>
                      <span className="px-3 py-1 rounded-full bg-[#1a5efd]/15 text-[#64d2ff] text-[12px] font-medium tracking-tight whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]" title={impactLabel}>
                        {impactLabel}
                      </span>
                    </div>
                    <p className="text-[#a1a1a6] text-[13px] leading-relaxed mb-3" title={item.description}>{item.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.04]">
                    <div className="flex items-center space-x-2 text-[12px] text-[#86868b]">
                      <ShieldCheck size={14} weight="duotone" className="text-[#34c759]" />
                      <span className="text-[#34c759] font-medium">Güvenli Optimizasyon</span>
                    </div>
                    <button
                      onClick={() => handleApply(item)}
                      disabled={isProcessing || isSuccess}
                      className={`px-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 flex items-center space-x-1.5 ${
                        isSuccess
                          ? 'bg-[#34c759]/20 text-[#34c759] border border-[#34c759]/30'
                          : isProcessing
                          ? 'bg-white/[0.05] text-[#86868b] border border-white/[0.05] cursor-not-allowed'
                          : 'bg-[#1a5efd] text-white hover:bg-[#1a5efd]/85 active:scale-95 shadow-[0_0_12px_rgba(26,94,253,0.3)]'
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <SpinnerGap size={14} weight="duotone" className="animate-spin text-[#1a5efd]" />
                          <span>Uygulanıyor...</span>
                        </>
                      ) : isSuccess ? (
                        <>
                          <Check size={16} weight="bold" />
                          <span>Uygulandı</span>
                        </>
                      ) : (
                        <>
                          <span>Uygula</span>
                          <ArrowUpRight size={14} weight="duotone" />
                        </>
                      )}
                    </button>
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
