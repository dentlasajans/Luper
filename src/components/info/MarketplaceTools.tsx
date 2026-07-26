import { Medal, CheckCircle, DownloadSimple, ArrowsClockwise, MagnifyingGlass, ShieldCheck, ShoppingBag, Star } from '@phosphor-icons/react';
import { memo, useMemo, useState } from 'react';

export interface MarketplaceItem {
  id: string;
  name: string;
  category: 'Optimization Pack' | 'Game Profile' | 'Workflow Template' | 'Extension';
  publisher: string;
  rating: number;
  downloads: string;
  sizeMB: number;
  description: string;
  verified: boolean;
  featured: boolean;
  installed: boolean;
}

export const MarketplaceTools = memo(function MarketplaceTools() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Hepsi');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'Hepsi' || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, activeCategory]);

  const handleInstall = (id: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setItems(prev => prev.map(item => item.id === id ? { ...item, installed: true } : item));
      setDownloadingId(null);
    }, 1200);
  };

  return (
    <div className="h-full w-full overflow-y-auto p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-3">
            <ShoppingBag weight="duotone" className="text-[#1a5efd]" size={28} />
            <span>LUPER Optimizasyon Pazaryeri (Optimization Marketplace)</span>
          </h1>
          <p className="text-sm text-[#86868b] mt-1">Resmi ve topluluk üretimi optimizasyon paketleri, oyun profilleri ve eklentileri keşfedin.</p>
        </div>

        <div className="flex items-center space-x-2 text-[12px] font-mono text-[#34c759] font-bold bg-[#34c759]/10 px-3.5 py-1.5 rounded-xl border border-[#34c759]/20">
          <ShieldCheck weight="duotone" size={16} />
          <span>Güvenli Dijital İmzalı İçerik</span>
        </div>
      </div>

      {/* Hero Featured Card */}
      <div className="bg-gradient-to-r from-[#1a5efd]/20 via-[#161619] to-[#161619] border border-[#1a5efd]/30 p-6 rounded-2xl flex items-center justify-between relative overflow-hidden">
        <div className="space-y-3 z-10 max-w-xl">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#1a5efd] text-white text-[11px] font-mono font-bold uppercase tracking-wider flex items-center space-x-1">
              <Medal weight="duotone" size={12} />
              <span>Editörün Seçimi</span>
            </span>
            <span className="text-[12px] text-[#86868b] font-mono">Resmi LUPER Sürümü</span>
          </div>

          <h2 className="text-2xl font-bold text-white">Ultimate E-Sports Gaming Pack 2026</h2>
          <p className="text-[13px] text-[#a1a1a6] leading-relaxed">
            Windows 11 sistemler için özel olarak kalibre edilmiş, gecikmeyi 2.4ms'ye düşüren en popüler e-spor paketimiz.
          </p>

          <div className="flex items-center space-x-4 pt-2">
            <button
              onClick={() => handleInstall('pack-ultimate-esports')}
              className="px-5 py-2.5 bg-[#1a5efd] hover:bg-[#2d6bfe] text-white font-bold text-[13.5px] rounded-xl transition-all flex items-center space-x-2 shadow-lg shadow-blue-500/20"
            >
              <DownloadSimple weight="duotone" size={16} />
              <span>Yüklendi (%100 Güncel)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category & Search Filter Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {['Hepsi', 'Optimization Pack', 'Game Profile', 'Workflow Template', 'Extension'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-[12.5px] font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-[#1a5efd] text-white shadow-md'
                  : 'bg-[#161619] text-[#86868b] border border-white/[0.08] hover:text-white'
              }`}
            >
              {cat === 'Hepsi' ? 'Tüm Paketler' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-64">
          <MagnifyingGlass weight="duotone" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pazaryerinde ara..."
            className="pl-9 pr-4 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-[13px] text-white focus:outline-none focus:border-[#1a5efd] w-full"
          />
        </div>
      </div>

      {/* Marketplace Items Grid */}
      <div className="grid grid-cols-2 gap-6">
        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-[#161619] border border-white/[0.08] rounded-2xl w-full col-span-full my-4">
            <h3 className="text-[14px] font-bold text-white mb-1">Veri Bulunamadı</h3>
            <p className="text-[12.5px] text-[#86868b]">Şu anda görüntülenecek veri bulunmuyor. Gerçek veri akışı bekleniyor.</p>
          </div>
        )}
        {filteredItems.length > 0 && filteredItems.map(item => (
          <div key={item.id} className="bg-[#161619] border border-white/[0.08] p-5 rounded-2xl luper-card space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-white/[0.06] text-[#86868b] font-mono font-medium">{item.category}</span>
                <div className="flex items-center space-x-1 text-[#ff9f0a] font-mono text-[12px] font-bold">
                  <Star weight="duotone" size={14} className="fill-[#ff9f0a]" />
                  <span>{item.rating}</span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white leading-snug">{item.name}</h3>
              <p className="text-[12.5px] text-[#86868b] line-clamp-2">{item.description}</p>
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
              <div className="text-[11.5px] font-mono text-[#86868b]">
                <div>İndirme: <strong className="text-white">{item.downloads}</strong></div>
                <div>Yayıncı: <strong className="text-white">{item.publisher}</strong></div>
              </div>

              <button
                onClick={() => handleInstall(item.id)}
                disabled={downloadingId === item.id || item.installed}
                className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all flex items-center space-x-2 ${
                  item.installed
                    ? 'bg-[#34c759]/10 text-[#34c759] border border-[#34c759]/20 cursor-default'
                    : 'bg-[#1a5efd] hover:bg-[#2d6bfe] text-white shadow-md'
                }`}
              >
                {downloadingId === item.id ? (
                  <>
                    <ArrowsClockwise weight="duotone" size={14} className="animate-spin" />
                    <span>İndiriliyor...</span>
                  </>
                ) : item.installed ? (
                  <>
                    <CheckCircle weight="duotone" size={14} />
                    <span>Yüklendi</span>
                  </>
                ) : (
                  <>
                    <DownloadSimple weight="duotone" size={14} />
                    <span>Tek Tıkla Yükle ({item.sizeMB} MB)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
