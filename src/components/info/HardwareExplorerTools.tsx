import { CheckCircle, Cpu, DownloadSimple, MagnifyingGlass } from '@phosphor-icons/react';
import { memo, useMemo, useState } from 'react';

export interface HardwareSpec {
  category: 'CPU' | 'GPU' | 'RAM' | 'Storage' | 'Motherboard' | 'Network' | 'Display';
  title: string;
  specs: { label: string; value: string }[];
}

export const HardwareExplorerTools = memo(function HardwareExplorerTools() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHardware = useMemo(() => {
    return ([] as HardwareSpec[]).filter(item => {
      const matchesCat = activeCategory === 'all' || item.category.toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.specs.some(s => s.label.toLowerCase().includes(searchQuery.toLowerCase()) || s.value.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify([] as HardwareSpec[], null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "luper_hardware_report.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="h-full w-full overflow-y-auto p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-3">
            <Cpu weight="duotone" className="text-[#1a5efd]" size={28} />
            <span>Donanım & Bellenim (Firmware) Gezgini</span>
          </h1>
          <p className="text-sm text-[#86868b] mt-1">Sistem bileşenlerinin derinlemesine teknik özellik ve bellenim durum raporu (Salt Okunur).</p>
        </div>

        <button
          onClick={handleExportJSON}
          className="px-5 py-2.5 bg-white/[0.06] hover:bg-white/[0.1] text-white font-bold text-[13.5px] rounded-xl transition-all border border-white/[0.1] flex items-center space-x-2 shadow-md"
        >
          <DownloadSimple weight="duotone" size={16} />
          <span>JSON Raporu İndir</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          {['all', 'CPU', 'GPU', 'RAM', 'Storage', 'Motherboard'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-[13px] font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-[#1a5efd] text-white shadow-md'
                  : 'bg-white/[0.04] text-[#86868b] hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {cat === 'all' ? 'Tüm Donanımlar' : cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <MagnifyingGlass weight="duotone" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Donanım ara..."
            className="pl-9 pr-4 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-[13px] text-white focus:outline-none focus:border-[#1a5efd] w-60"
          />
        </div>
      </div>

      {/* Hardware Spec Cards */}
      <div className="space-y-6">
        {filteredHardware.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-[#161619] border border-white/[0.08] rounded-2xl w-full col-span-full my-4">
            <h3 className="text-[14px] font-bold text-white mb-1">Veri Bulunamadı</h3>
            <p className="text-[12.5px] text-[#86868b]">Şu anda görüntülenecek veri bulunmuyor. Gerçek veri akışı bekleniyor.</p>
          </div>
        )}
        {filteredHardware.length > 0 && filteredHardware.map(item => (
          <div key={item.title} className="bg-[#161619] border border-white/[0.08] p-6 rounded-2xl space-y-4 luper-card">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3.5">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-[#1a5efd]/10 text-[#1a5efd] text-[12px] font-bold rounded-lg font-mono">{item.category}</span>
                <h3 className="text-white font-bold text-[17px]">{item.title}</h3>
              </div>

              <span className="text-[12px] text-[#34c759] font-mono font-semibold flex items-center space-x-1">
                <CheckCircle weight="duotone" size={14} />
                <span>Tam Uyumlu</span>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {item.specs.map(spec => (
                <div key={spec.label} className="bg-white/[0.02] p-3.5 rounded-xl border border-white/[0.04]">
                  <span className="text-[12px] text-[#86868b] font-medium">{spec.label}</span>
                  <div className="text-[13.5px] font-bold text-[#f5f5f7] font-mono mt-0.5 truncate">{spec.value}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
