import { Warning, ArrowLeft, CaretRight, ArrowsClockwise, Gear, CheckCircle } from '@/src/components/ui/Icons';
import { motion, AnimatePresence } from 'motion/react';
import { memo, useCallback, useMemo, useState } from 'react';
import { CATEGORY_META } from '../../data/categories';
import { useCategorySettings } from '../../hooks/useCategorySettings';
import { OptimizationSetting } from '../../types';
import { deepEqual } from '../../utils/equals';
import { LuperToggle } from '../ui/LuperToggle';

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
    if (level === 'none' || !level) {
      if (label === 'Performans') return 'Genel sistem performansına doğrudan etkisi yoktur.';
      if (label === 'Gecikme') return 'Ağ (ping) bağlantı gecikmesine doğrudan etkisi yoktur.';
      if (label === 'Input') return 'Cihaz ve donanım tepkime sürelerine etkisi yoktur.';
      if (label === 'Güç') return 'Güç tüketimine doğrudan bir etkisi yoktur.';
      if (label === 'Isı') return 'Sistem ısı değerlerine doğrudan etkisi yoktur.';
      return 'Doğrudan etkisi yoktur.';
    }

    const mag = magnitude === 'high' ? 'yüksek' : magnitude === 'medium' ? 'orta' : 'hafif';

    if (label === 'Performans') {
      return isPositive 
        ? `Sistem performansına ${mag} oranda pozitif katkı sağlar.` 
        : `Sistem performansını ${mag} oranda olumsuz etkileyebilir.`;
    }
    if (label === 'Gecikme') {
      return isPositive 
        ? `Ağ ve internet (ping) gecikmelerini ${mag} oranda düşürerek bağlantıyı iyileştirir.` 
        : `Ağ gecikmelerini (ping) ${mag} oranda artırarak olumsuz etkileyebilir.`;
    }
    if (label === 'Input') {
      return isPositive 
        ? `Donanım (klavye/fare vb.) tepkime süresini ${mag} oranda hızlandırarak girdi (input) gecikmesini azaltır.` 
        : `Cihaz girdi (input) gecikmesini ${mag} oranda artırarak akıcılığı bozabilir.`;
    }
    if (label === 'Güç') {
      return isPositive 
        ? `Güç tüketimini ${mag} oranda düşürerek enerji tasarrufu sağlar.` 
        : `Güç tüketimini ${mag} oranda artırabilir.`;
    }
    if (label === 'Isı') {
      return isPositive 
        ? `Sistem ısı değerlerini ${mag} oranda düşürmeye yardımcı olur.` 
        : `Sistem ısı değerlerini ${mag} oranda artırabilir.`;
    }

    return '';
  };

  const getMagnitudeText = () => {
    if (level === 'none' || !level) return 'Etkisiz';
    if (magnitude === 'high') return 'Yüksek';
    if (magnitude === 'medium') return 'Orta';
    return 'Hafif';
  };

  let style = 'bg-transparent border-white/[0.04] text-[#86868b]';
  
  if (isPositive) {
    if (magnitude === 'high') style = 'bg-transparent border-luper-success text-white shadow-[0_0_10px_rgba(52,199,89,0.15)]';
    else if (magnitude === 'medium') style = 'bg-transparent border-luper-success/50 text-white';
    else style = 'bg-transparent border-luper-success/25 text-white';
  } else if (isNegative) {
    if (magnitude === 'high') style = 'bg-transparent border-[#e57373] text-white shadow-[0_0_10px_rgba(229,115,115,0.15)]';
    else if (magnitude === 'medium') style = 'bg-transparent border-[#e57373]/50 text-white';
    else style = 'bg-transparent border-[#e57373]/25 text-white';
  }

  const fullLabel = label.toUpperCase();

  return (
    <div className={`group/badge px-1 py-0.5 rounded flex flex-col items-center justify-center select-none transition-colors cursor-default border min-w-0 ${style}`}>
      <div className="text-[9px] uppercase font-medium tracking-wider opacity-60 pb-[2px] mb-[2px] border-b border-white/[0.06] w-full text-center">
        {fullLabel}
      </div>
      <div className="text-[11px] font-medium tracking-tight w-full text-center">
        {getMagnitudeText()}
      </div>
      
      {/* Tooltip Description STRICTLY INSIDE OptimizationCard */}
      <div className="absolute inset-x-3 bottom-[56px] bg-[#161618] border border-white/15 rounded-xl p-2.5 text-[13px] text-[#f5f5f7] shadow-xl text-center z-30 pointer-events-none transition-all duration-200 opacity-0 group-hover/badge:opacity-100 scale-95 group-hover/badge:scale-100">
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

  const svgAnimate = isProcessing
    ? {
        pathLength: 0.85,
        pathOffset: 0.15,
        opacity: 1,
      }
    : isOptimized
    ? {
        pathLength: 1,
        pathOffset: 0,
        opacity: 1,
      }
    : {
        pathLength: 0,
        pathOffset: 1,
        opacity: 0,
      };

  const svgTransition = isProcessing
    ? {
        pathLength: { duration: 1.5, ease: "easeOut" },
        pathOffset: { duration: 1.5, ease: "easeOut" },
        opacity: { duration: 0.2 },
      }
    : isOptimized
    ? {
        pathLength: { type: "spring", bounce: 0, duration: 0.4 },
        pathOffset: { type: "spring", bounce: 0, duration: 0.4 },
        opacity: { duration: 0.3 },
      }
    : {
        pathLength: { duration: 0.4, ease: "easeIn" },
        pathOffset: { duration: 0.4, ease: "easeIn" },
        opacity: { duration: 0.4, delay: 0.1 },
      };

  const impacts = [
    { label: 'Performans', detail: setting.impacts?.performance },
    { label: 'Gecikme', detail: setting.impacts?.latency },
    { label: 'Input', detail: setting.impacts?.input },
    { label: 'Güç', detail: setting.impacts?.power },
    { label: 'Isı', detail: setting.impacts?.heat }
  ];

  return (
      <motion.div
        style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
        className={`bg-[#1a1a1d] border border-white/15 ${isOptimized ? 'bg-luper-primary/[0.02]' : ''} shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] rounded-xl p-5 flex flex-col h-full group hover:bg-[#222226] hover:border-white/30 transition-colors duration-300 min-h-[180px] relative z-10 hover:z-[50] focus-within:z-[50]`}
      >
        {/* SVG Animated Border */}
        <div className="absolute inset-0 pointer-events-none z-20">
          <svg className="w-full h-full">
            <motion.rect
              x="0.5" y="0.5" width="calc(100% - 1px)" height="calc(100% - 1px)" rx="11.5" ry="11.5"
              fill="none"
              stroke="#1a5efd"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: isOptimized ? 1 : 0, opacity: isOptimized ? 1 : 0 }}
              animate={svgAnimate}
              transition={svgTransition as any}
            />
          </svg>
        </div>
  
        {/* Success Checkmark Overlay */}
        <AnimatePresence>
          {processingResult === 'success' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 z-30 flex items-center justify-center bg-[#1a1a1d]/80 rounded-xl pointer-events-none"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="text-luper-success drop-shadow-[0_0_20px_rgba(52,199,89,0.5)] flex flex-col items-center gap-2.5"
              >
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <motion.circle
                    cx="32" cy="32" r="28"
                    stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                  <motion.path
                    d="M 21 33 L 29 41 L 45 23"
                    stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3, delay: 0.25, ease: "easeOut" }}
                  />
                </svg>
                <motion.span
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="text-[13px] font-medium tracking-wide text-white drop-shadow-md"
                >
                  {isOptimized ? 'Optimizasyon Başarılı' : 'Geri Alma Başarılı'}
                </motion.span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
  
        <div className="flex items-start justify-between mb-4 relative z-10 w-full gap-3">
          <div className="flex items-start space-x-3 min-w-0 flex-1">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105 ${isOptimized ? 'bg-luper-primary/15 border border-luper-primary/30 text-luper-primary' : 'bg-white/[0.04] border border-white/[0.06] text-text-muted group-hover:bg-luper-primary/10 group-hover:border-luper-primary/20 group-hover:text-luper-primary'}`}>
              <Gear size={20} weight="duotone" className="transition-all duration-300" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-[#f5f5f7] text-[15px] font-semibold leading-snug break-words whitespace-normal">{setting.name}</h3>
              <p className="text-text-muted text-[13px] mt-1.5 leading-relaxed break-words whitespace-normal">{setting.description}</p>
            </div>
          </div>
        <div className="shrink-0 mt-0.5 flex flex-col items-end space-y-1.5">
          {setting.uiType === 'select' ? (
             <select
               value={setting.status}
               onChange={(e) => handleToggle(setting.id, e.target.value)}
               disabled={!!processingResult}
               className="bg-[#1a1a1d] border border-white/10 text-white text-sm rounded-lg focus:ring-luper-primary focus:border-luper-primary block w-48 p-2 disabled:opacity-50"
             >
               {setting.options?.map((opt) => (
                 <option key={opt.value} value={opt.value}>
                   {opt.label}
                 </option>
               ))}
             </select>
          ) : (
            <>
              <LuperToggle
                checked={setting.status === 'optimized'}
                onChange={() => handleToggle(setting.id, setting.status)}
                disabled={!!processingResult}
                isProcessing={isProcessing}
                isSuccess={processingResult === 'success'}
              />
              <span className={`text-[12px] font-medium mr-0.5 ${setting.status === 'optimized' ? 'text-brand-primary font-semibold' : 'text-text-muted'}`}>
                {setting.status === 'optimized' ? 'Optimize Edildi' : 'Varsayılan'}
              </span>
            </>
          )}
        </div>
      </div>
      <div className="mt-auto grid grid-cols-5 gap-1.5 pt-3.5 border-t border-white/[0.04]">
        {impacts.map((impact, i) => (
          <ImpactBadge key={i} label={impact.label} detail={impact.detail} />
        ))}
      </div>
    </motion.div>
  );
}, deepEqual);

export const BaseCategoryView = memo(function BaseCategoryView({ categoryId, onBack }: { categoryId: string; onBack: () => void }) {
  const meta = useMemo(() => CATEGORY_META[categoryId] || { title: 'Optimizasyon', description: 'Bu kategori ayarlarını yönetin.' }, [categoryId]);
  const [retryCount, setRetryCount] = useState(0);
  const { settings, loading, error, processingState, handleToggle } = useCategorySettings(categoryId, retryCount);

  const handleRetry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
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
          <div className="flex flex-col w-full overflow-hidden border border-white/[0.04] rounded-xl bg-[#161618] mt-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-full flex items-center justify-between p-4 border-b border-white/[0.02] relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.02] to-transparent" />
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.02] shrink-0 animate-pulse" />
                  <div className="space-y-2 flex-1 max-w-[500px]">
                    <div className="h-3.5 bg-white/[0.04] rounded-md w-1/3 animate-pulse" />
                    <div className="h-3 bg-white/[0.02] rounded-md w-2/3 animate-pulse" />
                  </div>
                </div>
                <div className="w-10 h-5 bg-white/[0.04] rounded-full shrink-0 ml-4 animate-pulse" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center bg-white/[0.04] border border-white/[0.08] rounded-xl p-8 max-w-md">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full overflow-y-auto mt-4">
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
            <div className="text-center bg-white/[0.04] border border-white/[0.08] rounded-xl p-10 max-w-md">
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


