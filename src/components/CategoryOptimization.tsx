import { useState, memo } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Settings, Loader2, Check, RefreshCw } from 'lucide-react';
import { useCategorySettings } from '../hooks/useCategorySettings';


import { CATEGORY_META } from '../data/categories';

const ImpactBadge = memo(function ImpactBadge({ label, detail }: { label: string, detail: { level: string, description: string } | undefined }) {
  const level = detail?.level || 'none';
  const description = detail?.description || '';

  const isNone = level === 'none' || !level;
  const isPositive = level.startsWith('positive');
  const isNegative = level.startsWith('negative');
  const magnitude = level.replace('positive_', '').replace('negative_', '');

  const getLevelText = () => {
    if (isNone) return 'Etkisiz';
    switch(magnitude) {
      case 'high': return 'Yüksek';
      case 'medium': return 'Orta';
      case 'low': return 'Hafif';
      default: return 'Etkisiz';
    }
  };

  const getTooltipText = () => {
    if (description) return description;
    if (isNone) return `${label} üzerinde belirgin bir etkisi yoktur.`;

    const magnitudeText = magnitude === 'high' ? 'yüksek' : magnitude === 'medium' ? 'orta' : 'hafif';

    if (isPositive) {
       if (label === 'Perf') return `Performansa etkisi ${magnitudeText} düzeyde olumludur.`;
       if (label === 'Gecikme') return `Gecikmeyi ${magnitudeText} oranda düşürür.`;
       if (label === 'İnput') return `Girdi gecikmesini ${magnitudeText} düzeyde azaltır.`;
       if (label === 'Güç') return `Güç tüketimini ${magnitudeText} düzeyde optimize eder.`;
       if (label === 'Isı') return `Cihaz ısısını ${magnitudeText} oranda düşürür.`;
       return `Olumlu etkisi (${magnitudeText}) vardır.`;
    } else {
       if (label === 'Perf') return `Performansı ${magnitudeText} düzeyde kısıtlayabilir.`;
       if (label === 'Gecikme') return `Ağ gecikmesini ${magnitudeText} düzeyde artırabilir.`;
       if (label === 'İnput') return `Girdi gecikmesini ${magnitudeText} düzeyde artırabilir.`;
       if (label === 'Güç') return `Güç tüketimini ${magnitudeText} düzeyde artırabilir.`;
       if (label === 'Isı') return `Cihazın ${magnitudeText} düzeyde ısınmasına sebep olabilir.`;
       return `Olumsuz etkisi (${magnitudeText}) olabilir.`;
    }
  };

  const getStyle = () => {
    if (isPositive) {
      if (magnitude === 'high') return 'border-[#81c784] bg-[#81c784]/10 text-[#81c784] shadow-[0_0_10px_rgba(129,199,132,0.15)]';
      if (magnitude === 'medium') return 'border-[#81c784]/50 bg-[#81c784]/5 text-[#81c784]';
      return 'border-[#81c784]/30 bg-transparent text-[#81c784]/80';
    } else if (isNegative) {
      if (magnitude === 'high') return 'border-[#e57373] bg-[#e57373]/10 text-[#e57373] shadow-[0_0_10px_rgba(229,115,115,0.15)]';
      if (magnitude === 'medium') return 'border-[#e57373]/50 bg-[#e57373]/5 text-[#e57373]';
      return 'border-[#e57373]/30 bg-transparent text-[#e57373]/80';
    }
    return 'border-white/10 bg-white/[0.01] text-text-muted';
  };

  return (
    <div className={`group/badge relative flex flex-col items-center justify-center p-1.5 rounded-lg border ${getStyle()} transition-colors`}>
      <span className="text-[11px] text-text-muted uppercase tracking-wider mb-0.5">{label}</span>
      <span className="text-[11px] font-medium">{getLevelText()}</span>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] bg-[#1c1c1e] text-[#f5f5f7] text-[11px] py-1.5 px-2.5 rounded-lg shadow-xl opacity-0 group-hover/badge:opacity-100 pointer-events-none transition-opacity duration-200 z-10 text-center border border-white/10">
        {getTooltipText()}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-white/10"></div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[2px] border-4 border-transparent border-t-[#1c1c1e]"></div>
      </div>
    </div>
  );
});

export function CategoryOptimization({ categoryId, onBack }: { categoryId: string; onBack: () => void }) {
  const meta = CATEGORY_META[categoryId] || { title: 'Bilinmeyen', description: 'Bu kategori bulunamadı.' };
  const [retryCount, setRetryCount] = useState(0);
  const { settings, loading, processingState, handleToggle } = useCategorySettings(categoryId, retryCount);

  return (
    <div className="p-8 max-w-6xl mx-auto h-full flex flex-col" style={{ WebkitAppRegion: 'no-drag' } as any}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 flex flex-col"
      >
        <div className="flex items-center space-x-4 mb-8 shrink-0">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-text-muted hover:text-white hover:bg-white/[0.06] transition-all focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:outline-none"
          >
            <ChevronRight size={20} className="rotate-180" />
          </button>
          <div>
            <h1 className="text-[32px] font-semibold leading-tight text-[#f5f5f7] tracking-tight">{meta.title}</h1>
            <p className="text-text-muted text-[15px] font-normal leading-relaxed">{meta.description}</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0 relative">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto pr-2 pb-4 content-start">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div key={idx} className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-5 flex flex-col min-h-[180px] animate-pulse">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3 w-full">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.03] shrink-0"></div>
                      <div className="flex-1">
                        <div className="h-4 w-3/4 bg-white/[0.03] rounded-lg mb-2"></div>
                        <div className="h-3 w-1/2 bg-white/[0.03] rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-white/[0.04] flex items-center justify-between">
                    <div className="h-5 w-16 bg-white/[0.03] rounded-full"></div>
                    <div className="w-[52px] h-[28px] bg-white/[0.03] rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : settings && settings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto pr-2 pb-4 content-start">
              {settings.map((setting, idx) => (
                <motion.div 
                  key={setting.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(idx * 0.04, 0.2) }}
                  className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 flex flex-col group hover:bg-white/[0.06] hover:border-white/[0.12] transition-all min-h-[180px]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3 pr-2">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)] shrink-0">
                        <Settings size={18} className="text-text-muted" />
                      </div>
                      <div>
                        <h3 className="text-[#f5f5f7] text-[15px] font-medium leading-snug">{setting.name}</h3>
                        <p className="text-text-muted text-[13px] mt-1.5 leading-relaxed">{setting.description}</p>
                      </div>
                    </div>
                    <div className="shrink-0 mt-1 flex flex-col items-end space-y-1.5">
                      <button
                        onClick={() => !processingState[setting.id] && handleToggle(setting.id, setting.status)}
                        disabled={!!processingState[setting.id]}
                        className={`relative w-[52px] h-[28px] rounded-full transition-colors duration-300  flex items-center justify-center ${setting.status === 'optimized' ? 'bg-[#f5f5f7]' : 'bg-white/[0.15] border border-white/[0.08]'} ${(processingState[setting.id] === 'processing') ? 'opacity-80 cursor-not-allowed' : ''} focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:outline-none`}
                      >
                        {processingState[setting.id] === 'processing' && (
                          <Loader2 size={12} className={`absolute animate-spin ${setting.status === 'optimized' ? 'text-surface-base left-[8px]' : 'text-text-muted right-[8px]'}`} />
                        )}
                        {processingState[setting.id] === 'success' && (
                          <Check size={12} className={`absolute ${setting.status === 'optimized' ? 'text-surface-base left-[8px]' : 'text-[#81c784] right-[8px]'}`} />
                        )}
                        <motion.div
                          className={`absolute top-1 bottom-1 w-[20px] rounded-full shadow-sm ${setting.status === 'optimized' ? 'bg-surface-base' : 'bg-white'}`}
                          initial={false}
                          animate={{
                            left: setting.status === 'optimized' ? '28px' : '4px',
                          }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </button>
                      <span className={`text-[11px] font-medium mr-1 ${setting.status === 'optimized' ? 'text-white' : 'text-text-muted'}`}>
                        {setting.status === 'optimized' ? 'Optimize' : 'Varsayılan'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-white/[0.04] grid grid-cols-5 gap-1">
                    <ImpactBadge label="Perf" detail={setting.impacts?.performance} />
                    <ImpactBadge label="Gecikme" detail={setting.impacts?.latency} />
                    <ImpactBadge label="İnput" detail={setting.impacts?.input} />
                    <ImpactBadge label="Güç" detail={setting.impacts?.power} />
                    <ImpactBadge label="Isı" detail={setting.impacts?.heat} />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center bg-white/[0.04] border border-white/[0.08] rounded-3xl p-10 max-w-md">
                <motion.div 
                  animate={{ y: [0, -8, 0] }} 
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Settings size={36} className="text-text-muted mx-auto mb-5 opacity-60" />
                </motion.div>
                <h3 className="text-[#f5f5f7] text-[18px] font-medium leading-tight mb-3">Ayarlar Yüklenemedi</h3>
                <p className="text-text-muted text-[14px] font-normal leading-relaxed max-w-sm mb-6 mx-auto">
                  Bu kategori için ayarlar sistemden çekilemedi veya boş.
                </p>
                <button 
                  onClick={() => setRetryCount(prev => prev + 1)}
                  className="flex items-center space-x-2 mx-auto px-5 py-2.5 bg-white/[0.05] hover:bg-white/[0.08] text-white rounded-xl border border-white/[0.05] hover:border-white/[0.1] transition-all"
                >
                  <RefreshCw size={14} className="text-text-muted" />
                  <span className="text-[13px] font-medium">Yeniden Dene</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
