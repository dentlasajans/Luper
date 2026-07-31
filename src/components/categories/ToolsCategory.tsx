import { Package, Power, Recycle } from '@/src/components/ui/Icons';
import { motion } from 'motion/react';
import React, { useCallback, useMemo } from 'react';
import { useSettings } from '../../context/SettingsContext';

interface ToolCardProps {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  improvements: string[];
  onClick: (id: string) => void;
}

const ToolCard = React.memo(function ToolCard({ id, icon: Icon, title, description, improvements, onClick }: ToolCardProps) {
  const { lowQualityMode } = useSettings();

  return (
    <div 
      onClick={() => onClick(id)}
      className={`bg-[#1a1a1d] border border-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] ${lowQualityMode ? '' : 'backdrop-blur-xl'} rounded-2xl p-6 hover:bg-[#222226] hover:border-white/[0.12] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_8px_24px_rgba(0,0,0,0.4)] transition-all duration-300 group cursor-pointer flex flex-col h-full focus-visible:ring-2 focus-visible:ring-luper-primary focus-visible:outline-none relative overflow-hidden`}
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-brand-primary/10 group-hover:border-brand-primary/20 transition-all duration-300">
          <Icon size={24} weight="duotone" className="text-text-muted group-hover:text-brand-primary transition-colors duration-300" />
        </div>
        <div>
          <h3 className="text-[#f5f5f7] font-medium text-[16px]">{title}</h3>
        </div>
      </div>
      
      <p className="text-text-muted text-[16px] font-normal leading-relaxed mb-6 flex-1">
        {description}
      </p>

      <div className="space-y-2 mt-auto pt-4 border-t border-white/[0.04]">
        {improvements.map((imp, idx) => (
          <div key={idx} className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary/60" />
            <span className="text-text-muted text-[14px]">{imp}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

export const ToolsCategory = React.memo(function ToolsCategory({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const cards = useMemo(() => [
    {
      id: 'startup',
      title: 'Baslangiç Yöneticisi',
      description: 'Sistem açilisinda otomatik baslayan gereksiz uygulama ve servisleri devre disi birakin.',
      icon: Power,
      improvements: ['Daha hizli önyükleme', 'Kaynak tasarrufu']
    },
    {
      id: 'debloat',
      title: 'Kaldirici - Debloat',
      description: 'Windows ile birlikte gelen ancak kullanilmayan bloatware (gereksiz yazilimlari) kaldirin.',
      icon: Package,
      improvements: ['Disk alani açma', 'Arka plan islem azalmasi']
    },
    {
      id: 'cleaner',
      title: 'Temizlik',
      description: 'Geçici dosyalar, önbellek ve gereksiz kayit defteri girdilerini temizleyerek sisteminizi hafifletin.',
      icon: Recycle,
      improvements: ['Sistem ferahligi', 'Performans artisi']
    },
    {
      id: 'advanced-latency',
      title: 'Gelismis Gecikme (Latency)',
      description: 'Donanim kesmeleri (IRQ) ve Sistem Zamanlayicisi (HPET) üzerinde radikal optimizasyonlar yapin.',
      icon: Power,
      improvements: ['IRQ Çekirdek Atamasi (Pinning)', 'HPET Iptali', '0.5ms Zamanlayici']
    }
  ], []);

  const handleCardClick = useCallback((id: string) => {
    setActiveTab(id);
  }, [setActiveTab]);

  return (
    <div className="p-6 w-full h-full overflow-y-auto" style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 3%, black 97%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 3%, black 97%, transparent 100%)', WebkitAppRegion: 'no-drag' }}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
        className="w-full"
      >
        <div className="mb-8 px-1 pt-1">
          <h1 className="text-[28px] font-bold text-[#f5f5f7] tracking-tight leading-snug mb-2">Araçlar</h1>
          <p className="text-text-muted/90 text-[14px] mt-2 leading-relaxed max-w-3xl">Sistem yönetimi, temizlik ve bakim araçlari.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: Math.min(i * 0.04, 0.25), ease: [0.16, 1, 0.3, 1] }}
              style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
              className="h-full"
            >
              <ToolCard
                {...card}
                onClick={handleCardClick}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
});

export default ToolsCategory;

