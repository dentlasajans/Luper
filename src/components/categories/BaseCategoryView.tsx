import { Warning, ArrowLeft, Check, CaretRight, SpinnerGap, ArrowsClockwise, Gear } from '@phosphor-icons/react';
import { motion } from 'motion/react';
import { memo, useCallback, useMemo, useState } from 'react';
import { CATEGORY_META } from '../../data/categories';
import { useCategorySettings } from '../../hooks/useCategorySettings';
import { OptimizationSetting } from '../../types';
import { deepEqual } from '../../utils/equals';

const ImpactBadge = memo(function ImpactBadge({
  label,
  detail,
}: {
  label: string;
  detail: { level: string; description: string } | undefined;
}) {
  const level = detail?.level || 'none';

  const isPositive = level.startsWith('positive');
  const isNegative = level.startsWith('negative');
  const magnitude = level.replace('positive_', '').replace('negative_', '');

  const getTooltipText = () => {
    let labelPrefix = label;
    if (label === 'Perf') labelPrefix = 'Performansa';
    else if (label === 'Gecikme') labelPrefix = 'Gecikmeye';
    else if (label === 'İnput') labelPrefix = 'Girdi gecikmesine';
    else if (label === 'Güç') labelPrefix = 'Güç tüketimine';
    else if (label === 'Isı') labelPrefix = 'Isı değerlerine';

    if (level === 'none' || !level) return `${labelPrefix} doğrudan etkisi yoktur.`;

    const magnitudeText = magnitude === 'high' ? 'yüksek' : magnitude === 'medium' ? 'orta' : 'hafif';

    if (isPositive) {
       return `${labelPrefix} ${magnitudeText} oranda pozitif katkısı vardır.`;
    } else if (isNegative) {
       return `${labelPrefix} ${magnitudeText} oranda negatif etkisi vardır.`;
    }

    return `${labelPrefix} doğrudan etkisi yoktur.`;
  };

  const getMagnitudeText = () => {
    if (level === 'none' || !level) return 'Etkisiz';
    if (magnitude === 'high') return 'Yüksek';
    if (magnitude === 'medium') return 'Orta';
    return 'Hafif';
  };

  let style = 'bg-white/[0.015] border-white/[0.04] text-text-muted/40';
  
  if (isPositive) {
    if (magnitude === 'high') style = 'bg-[#81c784]/12 border-[#81c784]/35 text-[#81c784] shadow-[0_0_10px_rgba(129,199,132,0.1)]';
    else if (magnitude === 'medium') style = 'bg-[#81c784]/6 border-[#81c784]/22 text-[#81c784]';
    else style = 'bg-[#81c784]/3 border-[#81c784]/15 text-[#81c784]/80';
  } else if (isNegative) {
    if (magnitude === 'high') style = 'bg-[#e57373]/12 border-[#e57373]/35 text-[#e57373] shadow-[0_0_10px_rgba(229,115,115,0.1)]';
    else if (magnitude === 'medium') style = 'bg-[#e57373]/6 border-[#e57373]/22 text-[#e57373]';
    else style = 'bg-[#e57373]/3 border-[#e57373]/15 text-[#e57373]/80';
  }

  const fullLabel = label === 'Perf' ? 'PERF' : label.toUpperCase();

  return (
    <div className={`group/badge p-1 rounded-lg flex flex-col items-center justify-center select-none transition-colors cursor-default border min-w-0 ${style}`}>
      <div className="text-[10px] uppercase font-semibold tracking-tight opacity-80 mb-0.5 w-full text-center">
        {fullLabel}
      </div>
      <div className="text-[12px] font-medium tracking-tight w-full text-center">
        {getMagnitudeText()}
      </div>
      
      {/* Tooltip Description STRICTLY INSIDE OptimizationCard */}
      <div className="absolute inset-x-3 bottom-[56px] bg-[#1c1c1e] border border-white/15 rounded-xl p-2.5 text-[11.5px] text-[#f5f5f7] shadow-xl text-center z-30 pointer-events-none transition-all duration-200 opacity-0 group-hover/badge:opacity-100 scale-95 group-hover/badge:scale-100">
        {getTooltipText()}
      </div>
    </div>
  );
}, deepEqual);

const OptimizationCard = memo(function OptimizationCard({
  setting,
  idx,
  isProcessing,
  processingResult,
  handleToggle
}: {
  setting: OptimizationSetting,
  idx: number,
  isProcessing: boolean,
  processingResult?: 'processing' | 'success' | 'error',
  handleToggle: (id: string, currentStatus: string) => void
}) {
  const isOptimized = setting.status === 'optimized';

  const impacts = [
    { label: 'Perf', detail: setting.impacts?.performance },
    { label: 'Gecikme', detail: setting.impacts?.latency },
    { label: 'İnput', detail: setting.impacts?.input },
    { label: 'Güç', detail: setting.impacts?.power },
    { label: 'Isı', detail: setting.impacts?.heat }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30, delay: Math.min(idx * 0.04, 0.2) }}
      style={{ transform: 'translateZ(0)', willChange: 'transform, opacity', contain: 'layout style' }}
      className={`bg-[#18181c] border ${isOptimized ? 'border-[#1a5efd]/35 bg-[#1a5efd]/[0.02]' : 'border-white/[0.06]'} shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] rounded-2xl p-5 flex flex-col group hover:bg-[#202024] hover:border-white/[0.12] transition-colors duration-300 min-h-[180px] relative z-10 hover:z-[50] focus-within:z-[50]`}
    >
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-start space-x-3 pr-2">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105 ${isOptimized ? 'bg-[#1a5efd]/15 border border-[#1a5efd]/30 text-[#1a5efd]' : 'bg-white/[0.04] border border-white/[0.06] text-text-muted group-hover:bg-[#1a5efd]/10 group-hover:border-[#1a5efd]/20 group-hover:text-[#1a5efd]'}`}>
            <Gear size={20} weight="duotone" className="transition-all duration-300" />
          </div>
          <div>
            <h3 className="text-[#f5f5f7] text-[14px] font-semibold leading-snug">{setting.name}</h3>
            <p className="text-text-muted text-[12px] mt-1 leading-relaxed">{setting.description}</p>
          </div>
        </div>
        <div className="shrink-0 mt-0.5 flex flex-col items-end space-y-1.5">
          <motion.button
            role="switch"
            aria-checked={isOptimized}
            whileTap={{ scale: 0.96 }}
            onClick={() => !processingResult && handleToggle(setting.id, setting.status)}
            disabled={!!processingResult}
            className={`relative w-[48px] h-[26px] rounded-full transition-all duration-200 flex items-center justify-center ${setting.status === 'optimized' ? 'bg-[#1a5efd]' : 'bg-white/[0.12] border border-white/[0.06]'} ${(isProcessing) ? 'opacity-80 cursor-not-allowed' : 'hover:opacity-90 active:scale-95'} focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:outline-none`}
          >
            {isProcessing && (
              <SpinnerGap size={12} weight="duotone" className={`absolute animate-spin ${setting.status === 'optimized' ? 'text-white left-[7px]' : 'text-text-muted right-[7px]'}`} />
            )}
            {processingResult === 'success' && (
              <Check size={12} weight="bold" className={`absolute ${setting.status === 'optimized' ? 'text-white left-[7px]' : 'text-[#81c784] right-[7px]'}`} />
            )}
            <motion.div
              className={`absolute top-0.5 bottom-0.5 w-[22px] rounded-full shadow-sm bg-white`}
              initial={false}
              animate={{
                left: setting.status === 'optimized' ? '23px' : '2px',
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </motion.button>
          <span className={`text-[12px] font-medium mr-0.5 ${setting.status === 'optimized' ? 'text-brand-primary font-semibold' : 'text-text-muted'}`}>
            {setting.status === 'optimized' ? 'Optimize Edildi' : 'Varsayılan'}
          </span>
        </div>
      </div>
      <div className="mt-auto grid grid-cols-5 gap-1.5 pt-3.5 border-t border-white/[0.04]">
        {impacts.map((impact, i) => (
          <ImpactBadge key={i} label={impact.label} detail={impact.detail} />
        ))}
      </div>
    </motion.div>
  );
});

export const BaseCategoryView = memo(function BaseCategoryView({ categoryId, onBack }: { categoryId: string; onBack: () => void }) {
  const meta = useMemo(() => CATEGORY_META[categoryId] || { title: 'Optimizasyon', description: 'Bu kategori ayarlarını yönetin.' }, [categoryId]);
  const [retryCount, setRetryCount] = useState(0);
  const { settings, loading, error, processingState, handleToggle } = useCategorySettings(categoryId, retryCount);

  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
  }, []);

  return (
    <div className="p-6 w-full h-full flex flex-col relative" style={{ WebkitAppRegion: 'no-drag' } as any}>

      {/* Header */}
      <div className="flex items-start space-x-5 mb-8 pt-1 shrink-0">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl shrink-0 mt-1 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.12] text-text-muted hover:text-white flex items-center justify-center transition-all duration-300 group"
        >
          <ArrowLeft size={18} weight="duotone" className="group-hover:-translate-x-0.5 group-hover:scale-105 transition-all duration-300" />
        </button>

        <div>
          <div className="flex items-center space-x-2 text-[12px] font-medium tracking-tight text-[#a1a1a6] mb-3">
            <span>Optimizasyon</span>
            <CaretRight size={14} weight="duotone" className="opacity-70" />
            <span className="text-[#f5f5f7]">{meta.title}</span>
          </div>
          <h1 className="text-[32px] font-bold text-[#f5f5f7] tracking-tight leading-tight mb-3">{meta.title}</h1>
          <p className="text-[#a1a1a6] text-[14px] font-medium leading-relaxed max-w-3xl">{meta.description}</p>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="flex-1 min-h-0 relative flex flex-col w-full">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-hidden pt-8 pr-2 pb-4 content-start w-full">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#18181c] border border-white/[0.06] rounded-2xl p-5 flex flex-col min-h-[180px] relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3 w-full">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.05] shrink-0 animate-pulse" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-white/[0.08] rounded-md w-3/4 animate-pulse" />
                      <div className="h-3 bg-white/[0.04] rounded-md w-full animate-pulse" />
                      <div className="h-3 bg-white/[0.04] rounded-md w-2/3 animate-pulse" />
                    </div>
                  </div>
                  <div className="w-12 h-6 bg-white/[0.08] rounded-full shrink-0 ml-2 animate-pulse" />
                </div>
                <div className="mt-auto pt-3.5 border-t border-white/[0.04]">
                  <div className="grid grid-cols-5 gap-1.5 w-full">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="bg-white/[0.02] border border-white/[0.06] rounded-xl h-[42px] animate-pulse" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 max-w-md">
              <Warning size={36} weight="duotone" className="text-[#e57373] mx-auto mb-4" />
              <h3 className="text-white text-[16px] font-semibold mb-2">Ayarlar Yüklenemedi</h3>
              <p className="text-text-muted text-[14px] mb-5">{error instanceof Error ? error.message : String(error)}</p>
              <button 
                onClick={handleRetry}
                className="flex items-center space-x-2 mx-auto px-5 py-2.5 bg-white/[0.05] hover:bg-white/[0.08] text-white rounded-xl border border-white/[0.05] hover:border-white/[0.1] transition-all"
              >
                <ArrowsClockwise size={14} weight="duotone" className="text-text-muted" />
                <span className="text-[14px] font-medium">Yeniden Dene</span>
              </button>
            </div>
          </div>
        ) : settings && settings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pt-8 pr-2 pb-4 content-start w-full">
            {settings.map((setting, idx) => (
              <OptimizationCard
                key={setting.id}
                setting={setting}
                idx={idx}
                isProcessing={processingState[setting.id] === 'processing'}
                processingResult={processingState[setting.id]}
                handleToggle={handleToggle}
              />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center bg-white/[0.04] border border-white/[0.08] rounded-2xl p-10 max-w-md">
              <Gear size={36} weight="duotone" className="text-text-muted mx-auto mb-5 opacity-60" />
              <h3 className="text-[#f5f5f7] text-[16px] font-medium leading-tight mb-3">Henüz Ayar Bulunmuyor</h3>
              <p className="text-text-muted text-[14px] leading-relaxed">Bu kategori için tanımlanmış optimizasyon ayarı bulunamadı.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});


