import { BookOpen, MagnifyingGlass, ShieldCheck, Star } from '@phosphor-icons/react';
import { memo, useMemo, useState } from 'react';

export interface LibraryItem {
  id: string;
  name: string;
  category: 'Gaming' | 'CPU' | 'GPU' | 'Memory' | 'Network' | 'Storage' | 'Windows';
  description: string;
  risk: 'Safe' | 'Low' | 'Medium' | 'Advanced';
  fpsImpact: string;
  latencyImpact: string;
  requiresRestart: boolean;
  requiresAdmin: boolean;
  isFavorite?: boolean;
}

export const OptimizationLibraryTools = memo(function OptimizationLibraryTools() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [selectedId, setSelectedId] = useState<string>('lib-hags');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const activeItem = useMemo(() => {
    return items.find(i => i.id === selectedId) || items[0];
  }, [items, selectedId]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesCat = activeCategory === 'all' || item.category.toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [items, activeCategory, searchQuery]);

  const toggleFavorite = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, isFavorite: !i.isFavorite } : i));
  };

  return (
    <div className="h-full w-full overflow-y-auto p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-3">
            <BookOpen weight="duotone" className="text-[#1a5efd]" size={28} />
            <span>Optimizasyon Kütüphanesi & Kataloğu</span>
          </h1>
          <p className="text-sm text-[#86868b] mt-1">LUPER bünyesindeki tüm sistem ve oyun iyileştirmelerinin detaylı kataloğu.</p>
        </div>

        <div className="flex items-center space-x-2 text-[12px] font-mono text-[#34c759] font-bold">
          <ShieldCheck weight="duotone" size={16} />
          <span>{items.length} Doğrulanmış İyileştirme Kataloğu</span>
        </div>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          {['all', 'Gaming', 'CPU', 'Network', 'Storage'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-[13px] font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-[#1a5efd] text-white shadow-md'
                  : 'bg-white/[0.04] text-[#86868b] hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {cat === 'all' ? 'Tüm Katalog' : cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <MagnifyingGlass weight="duotone" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Kütüphanede ara..."
            className="pl-9 pr-4 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-[13px] text-white focus:outline-none focus:border-[#1a5efd] w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Library Catalog List */}
        <div className="col-span-5 space-y-3">
          {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-[#161619] border border-white/[0.08] rounded-2xl w-full col-span-full my-4">
            <h3 className="text-[14px] font-bold text-white mb-1">Veri Bulunamadı</h3>
            <p className="text-[12.5px] text-[#86868b]">Şu anda görüntülenecek veri bulunmuyor. Gerçek veri akışı bekleniyor.</p>
          </div>
        )}
        {filteredItems.length > 0 && filteredItems.map(item => {
            const isSelected = item.id === selectedId;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1a5efd]/10 border-[#1a5efd] shadow-lg shadow-blue-500/10'
                    : 'bg-[#161619] border-white/[0.08] hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-white/[0.06] text-[#86868b] font-medium font-mono">{item.category}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                    className="text-[#86868b] hover:text-[#ff9f0a]"
                  >
                    <Star weight="duotone" size={15} className={item.isFavorite ? 'fill-[#ff9f0a] text-[#ff9f0a]' : ''} />
                  </button>
                </div>

                <h4 className="text-white font-bold text-[14.5px] leading-snug">{item.name}</h4>

                <div className="flex items-center space-x-3 text-[11.5px] text-[#86868b] mt-2 font-mono">
                  <span>FPS: <strong className="text-[#34c759]">{item.fpsImpact}</strong></span>
                  <span>•</span>
                  <span>Gecikme: <strong className="text-[#34c759]">{item.latencyImpact}</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail Card */}
        <div className="col-span-7 bg-[#161619] border border-white/[0.08] p-6 rounded-2xl space-y-6 luper-card">
          <div className="border-b border-white/[0.06] pb-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-[#1a5efd] font-bold font-mono uppercase tracking-wider">İyileştirme Detayı</span>
              <h2 className="text-xl font-bold text-white mt-1">{activeItem.name}</h2>
            </div>
            <span className="text-[11px] px-3 py-1 bg-white/[0.04] border border-white/[0.08] text-[#34c759] font-mono font-bold rounded-lg">
              Risk: {activeItem.risk}
            </span>
          </div>

          <p className="text-[#a1a1a6] text-[13.5px] leading-relaxed">{activeItem.description}</p>

          <div className="grid grid-cols-2 gap-4 text-[13px]">
            <div className="bg-white/[0.03] p-4 rounded-xl border border-white/[0.06]">
              <span className="text-[#86868b] text-[12px]">Tahmini FPS Etkisi</span>
              <div className="text-[#34c759] font-bold font-mono text-base mt-0.5">{activeItem.fpsImpact}</div>
            </div>

            <div className="bg-white/[0.03] p-4 rounded-xl border border-white/[0.06]">
              <span className="text-[#86868b] text-[12px]">Girdi Gecikmesi İyileşmesi</span>
              <div className="text-[#34c759] font-bold font-mono text-base mt-0.5">{activeItem.latencyImpact}</div>
            </div>

            <div className="bg-white/[0.03] p-4 rounded-xl border border-white/[0.06]">
              <span className="text-[#86868b] text-[12px]">Yeniden Başlatma</span>
              <div className="text-white font-bold font-mono text-base mt-0.5">{activeItem.requiresRestart ? 'Şart' : 'Gerekmiyor'}</div>
            </div>

            <div className="bg-white/[0.03] p-4 rounded-xl border border-white/[0.06]">
              <span className="text-[#86868b] text-[12px]">Geri Alınabilirlik</span>
              <div className="text-[#34c759] font-bold font-mono text-base mt-0.5">%100 Geri Alınabilir</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
