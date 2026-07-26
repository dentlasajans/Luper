import { GridFour, List, SpinnerGap, MagnifyingGlass } from '@phosphor-icons/react';
import { motion } from 'motion/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { OPTIMIZATION_CARDS } from '../data/categories';
import { getAllCategorySettingCounts } from '../services/FirebaseService';

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
    <motion.div 
      whileHover={{ y: -2 }}
      onClick={() => onClick(id)}
      style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
      className={`bg-[#161619] border border-white/[0.08] ${lowQualityMode ? '' : 'backdrop-blur-xl'} rounded-2xl p-6 hover:bg-[#1a1a1e] hover:border-[#1a5efd]/40 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_16px_rgba(26,94,253,0.2)] transition-all duration-200 group cursor-pointer flex flex-col h-full relative overflow-hidden luper-card`}
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0 group-hover:bg-[#1a5efd]/10 group-hover:border-[#1a5efd]/20 transition-all duration-300">
          <Icon size={20} weight="duotone" className="text-[#86868b] group-hover:text-[#1a5efd] group-hover:scale-105 transition-all duration-300" />
        </div>
        <div>
          <h3 className="text-[#f5f5f7] font-semibold text-[17px] group-hover:text-white transition-colors">{title}</h3>
          {settingCount === null ? (
            <div className="flex items-center space-x-1.5 mt-0.5">
              <SpinnerGap size={11} weight="duotone" className="text-[#86868b] animate-spin" />
              <p className="text-[#86868b] text-[13px]">Hesaplanıyor...</p>
            </div>
          ) : (
            <p className="text-[#86868b] text-[13px] mt-0.5 font-medium">{settingCount} Aktif Optimizasyon</p>
          )}
        </div>
      </div>
      
      <p className="text-[#86868b] text-[14px] leading-relaxed mb-5 flex-1 group-hover:text-[#a1a1a6] transition-colors">
        {description}
      </p>

      <div className="space-y-2 mt-auto pt-4 border-t border-white/[0.04]">
        {improvements.map((imp, idx) => (
          <div key={idx} className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#1a5efd]" />
            <span className="text-[#86868b] text-[13px] font-medium">{imp}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
});

export const Optimization = React.memo(function Optimization({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [counts, setCounts] = useState<Record<string, number>>(() => getAllCategorySettingCounts());
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    setCounts(getAllCategorySettingCounts());
  }, []);

  const cards = useMemo(() => OPTIMIZATION_CARDS, []);

  const filteredCards = useMemo(() => {
    return cards.filter(c => {
      return c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
             c.description.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [cards, searchQuery]);

  const handleCardClick = useCallback((id: string) => {
    setActiveTab(id);
  }, [setActiveTab]);

  return (
    <div className="p-8 w-full h-full overflow-y-auto" style={{ WebkitAppRegion: 'no-drag' }}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h1 className="text-3xl font-bold tracking-tight text-white">Sistem Optimizasyonu</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#1a5efd]/15 border border-[#1a5efd]/30 text-[#64d2ff] text-[11px] font-bold uppercase tracking-wider">
                13 KATEGORİ
              </span>
            </div>
            <p className="text-[#86868b] text-[14px]">Maksimum sistem performansı ve en düşük girdi gecikmesi için hazırlanmış kayıt defteri optimizasyonları.</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#161619] border border-white/[0.08] rounded-2xl p-3.5">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <MagnifyingGlass size={16} weight="duotone" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#86868b]" />
            <input
              type="text"
              placeholder="Optimizasyon kategorisi veya ayar ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-xl text-[13.5px] text-white placeholder-[#86868b] focus:outline-none focus:border-[#1a5efd] transition-all"
            />
          </div>

          {/* View Mode */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl text-[#86868b] transition-colors ${viewMode === 'grid' ? 'bg-white/[0.08] text-white' : 'hover:text-white'}`}
              title="Izgara Görünümü"
            >
              <GridFour size={16} weight="duotone" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl text-[#86868b] transition-colors ${viewMode === 'list' ? 'bg-white/[0.08] text-white' : 'hover:text-white'}`}
              title="Liste Görünümü"
            >
              <List size={16} weight="duotone" />
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 w-full" : "space-y-5 w-full"}>
          {filteredCards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: Math.min(i * 0.03, 0.2) }}
              style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
            >
              <OptimizationCard
                {...card}
                settingCount={counts ? (counts[card.id] ?? 0) : 0}
                onClick={handleCardClick}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
});
