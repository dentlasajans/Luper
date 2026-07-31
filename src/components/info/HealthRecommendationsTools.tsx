import { Warning, CaretDown, CaretUp, MagnifyingGlass, Sparkle } from '@/src/components/ui/Icons';
import { AnimatePresence, motion } from 'motion/react';
import { memo, useMemo, useState } from 'react';

export interface RecommendationItem {
  id: string;
  title: string;
  description: string;
  reason: string;
  benefits: string;
  potentialRisks: string;
  difficulty: 'Easy' | 'Normal' | 'Advanced' | 'Expert';
  impact: 'Low' | 'Medium' | 'High' | 'Very High';
  category: 'Gaming' | 'Performance' | 'Windows' | 'Drivers' | 'Storage' | 'Power';
  severity: 'Critical' | 'Warning' | 'Recommendation' | 'Info';
  requiresRestart: boolean;
  requiresAdmin: boolean;
}

export const HealthRecommendationsTools = memo(function HealthRecommendationsTools() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('rec-hags');

  const filteredItems = useMemo(() => {
    return ([] as RecommendationItem[]).filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category.toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="h-full w-full overflow-y-auto p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-3">
            <Sparkle weight="duotone" className="text-luper-primary" size={28} />
            <span>Sağlık Bulguları & Öneri Merkezi</span>
          </h1>
          <p className="text-sm text-[#86868b] mt-1">Sistem taraması bulgularından üretilen akıllı optimizasyon önerileri (Analiz Modu).</p>
        </div>

        <div className="flex items-center space-x-3 font-mono text-[13px]">
          <span className="px-3 py-1.5 rounded-xl bg-[#34c759]/10 text-[#34c759] border border-[#34c759]/20 font-bold">
            92/100 Sağlık Skoru
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-luper-primary/10 text-luper-primary border border-luper-primary/20 font-bold">
            3 Öneri Mevcut
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          {['all', 'Gaming', 'Performance', 'Storage', 'Windows'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-[13px] font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-luper-primary text-white shadow-md'
                  : 'bg-white/[0.04] text-[#86868b] hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {cat === 'all' ? 'Tüm Öneriler' : cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <MagnifyingGlass weight="duotone" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Önerilerde ara..."
            className="pl-9 pr-4 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-[13px] text-white focus:outline-none focus:border-luper-primary w-60"
          />
        </div>
      </div>

      {/* Recommendation Items Accordion */}
      <div className="space-y-4">
        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-luper-surface border border-white/[0.08] rounded-2xl w-full col-span-full my-4">
            <h3 className="text-[14px] font-bold text-white mb-1">Veri Bulunamadı</h3>
            <p className="text-[12.5px] text-[#86868b]">Şu anda görüntülenecek veri bulunmuyor. Gerçek veri akışı bekleniyor.</p>
          </div>
        )}
        {filteredItems.length > 0 && filteredItems.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div key={item.id} className="bg-luper-surface border border-white/[0.08] rounded-2xl overflow-hidden luper-card transition-all">
              {/* Header Card */}
              <div 
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02]"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    item.severity === 'Warning' ? 'bg-[#ff9f0a]/10 text-[#ff9f0a]' : 'bg-luper-primary/10 text-luper-primary'
                  }`}>
                    {item.severity === 'Warning' ? <Warning weight="duotone" size={20} /> : <Sparkle weight="duotone" size={20} />}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-white font-bold text-[16px]">{item.title}</h3>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-white/[0.06] text-[#86868b] font-medium">{item.category}</span>
                    </div>
                    <p className="text-[#86868b] text-[13px] mt-1">{item.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 shrink-0">
                  <span className="text-[12px] font-semibold px-3 py-1 rounded-lg bg-luper-primary/10 text-luper-primary">
                    Etki: {item.impact}
                  </span>
                  {isExpanded ? <CaretUp weight="duotone" size={18} className="text-[#86868b]" /> : <CaretDown weight="duotone" size={18} className="text-[#86868b]" />}
                </div>
              </div>

              {/* Expanded Details Body */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-white/[0.06] p-6 bg-white/[0.01] space-y-4 text-[13.5px]"
                  >
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#86868b] mb-1">Neden Öneriliyor?</h4>
                      <p className="text-[#f5f5f7]">{item.reason}</p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#34c759] mb-1">Beklenen Kazanımlar</h4>
                      <p className="text-[#a1a1a6]">{item.benefits}</p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#ff453a] mb-1">Olası Riskler</h4>
                      <p className="text-[#86868b]">{item.potentialRisks}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.04] text-[12px] font-mono text-[#86868b]">
                      <div className="flex items-center space-x-4">
                        <span>Zorluk Derecesi: <strong className="text-white">{item.difficulty}</strong></span>
                        <span>â€¢</span>
                        <span>Yeniden Başlatma: <strong className={item.requiresRestart ? 'text-[#ff9f0a]' : 'text-[#34c759]'}>{item.requiresRestart ? 'Gerekli' : 'Gerekli Değil'}</strong></span>
                      </div>

                      <span className="text-[11px] text-[#86868b]/60">LUPER Öneri Motoru v1.0 (Analiz Modu)</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
});

