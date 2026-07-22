import { OPTIMIZATION_CARDS } from '../data/categories';
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { getOptimizationCounts } from '../services/SystemEngine';
import { useSettings } from '../context/SettingsContext';
import { CategoryOptimizationCount } from '../types';

interface OptimizationCardProps {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  settingCount: number | null;
  improvements: string[];
  onClick: (id: string) => void;
}

const OptimizationCard = React.memo(function OptimizationCard({ id, icon: Icon, title, description, settingCount, improvements, onClick }: OptimizationCardProps) {
  const { lowQualityMode } = useSettings();
  return (
    <div 
      onClick={() => onClick(id)}
      className={`bg-white/[0.04] border border-white/[0.08] ${lowQualityMode ? '' : 'backdrop-blur-xl'} rounded-xl p-6 hover:bg-white/[0.06] hover:border-white/[0.12] hover:shadow-[0_0_40px_rgba(26,94,253,0.08)] hover:border-t-[#1a5efd]/20 transition-all duration-500 group cursor-pointer flex flex-col h-full focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:outline-none`}
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-brand-primary/10 group-hover:border-brand-primary/20 transition-all duration-500">
          <Icon size={24} className="text-text-muted group-hover:text-brand-primary transition-colors duration-500" />
        </div>
        <div>
          <h3 className="text-[#f5f5f7] font-medium text-[18px]">{title}</h3>
          {settingCount === null ? (
            <div className="flex items-center space-x-1.5 mt-0.5">
              <Loader2 size={10} className="text-text-muted animate-spin" />
              <p className="text-text-muted text-[13px]">Veri bekleniyor...</p>
            </div>
          ) : (
            <p className="text-text-muted text-[13px] mt-0.5">{settingCount} Optimizasyon Ayarı</p>
          )}
        </div>
      </div>
      
      <p className="text-text-muted text-[15px] font-normal leading-relaxed mb-6 flex-1">
        {description}
      </p>

      <div className="space-y-2 mt-auto pt-4 border-t border-white/[0.04]">
        {improvements.map((imp, idx) => (
          <div key={idx} className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary/60" />
            <span className="text-text-muted text-[13px]">{imp}</span>
          </div>
        ))}
      </div>
    </div>
  );
});


export function Optimization({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [counts, setCounts] = useState<CategoryOptimizationCount | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    getOptimizationCounts()
      .then(data => {
        if (isMounted) setCounts(data);
      })
      .catch(() => {
        if (isMounted) setCounts({});
      });

    return () => { isMounted = false; };
  }, []);

  const cards = OPTIMIZATION_CARDS;

  const handleCardClick = useCallback((id: string) => {
    setActiveTab(id);
  }, [setActiveTab]);

  return (
    <div className="p-8 max-w-6xl mx-auto h-full overflow-y-auto" style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 3%, black 97%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 3%, black 97%, transparent 100%)', WebkitAppRegion: 'no-drag' } as any}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-8 mt-0 px-2">
          <h1 className="text-[32px] font-semibold leading-tight text-[#f5f5f7] tracking-tight mb-1">Optimizasyon</h1>
          <p className="text-text-muted text-[15px] font-normal leading-relaxed">Sisteminizi hızlandırmak için özelleştirilmiş kategoriler.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: Math.min(i * 0.04, 0.25), ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              <OptimizationCard
                {...card}
                settingCount={counts ? (counts[card.id] || 0) : null}
                onClick={handleCardClick}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
