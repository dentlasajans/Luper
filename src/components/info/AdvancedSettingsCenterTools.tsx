import { DownloadSimple, MagnifyingGlass, GearSix } from '@phosphor-icons/react';
import { memo, useMemo, useState } from 'react';

export interface SettingGroup {
  category: string;
  items: {
    id: string;
    title: string;
    description: string;
    type: 'toggle' | 'select' | 'text';
    value: any;
    options?: string[];
  }[];
}

const INITIAL_SETTINGS_DATA: SettingGroup[] = [
  {
    category: 'Genel & Görünüm',
    items: [
      { id: 'theme-mode', title: 'Tema Stili', description: 'LUPER platformu karanlık cam morfizmi teması.', type: 'select', value: 'Dark Sapphire', options: ['Dark Sapphire', 'Anthracite Dark'] },
      { id: 'auto-start', title: 'Windows Başlangıcında Çalıştır', description: 'Sistem açılışında arka planda dinleyici modda başlat.', type: 'toggle', value: true }
    ]
  },
  {
    category: 'Performans & Oyun',
    items: [
      { id: 'profile-mode', title: 'Aktif Performans Profili', description: 'Sistem genelinde geçerli optimizasyon şablonu.', type: 'select', value: 'Competitive E-Sports', options: ['Competitive E-Sports', 'Gaming', 'Streaming', 'Creator', 'Office'] },
      { id: 'hags-auto', title: 'HAGS (Donanım GPU İvmesi) Otomasyonu', description: 'Desteklenen GPU ve oyunlarda varsayılan olarak aktif et.', type: 'toggle', value: true }
    ]
  },
  {
    category: 'Güvenlik & Gizlilik',
    items: [
      { id: 'telemetry-block', title: 'Telemetri & Gizlilik Koruması', description: 'Windows arka plan veri toplama servislerini kısıtla.', type: 'toggle', value: true },
      { id: 'amsi-guard', title: 'AMSI / Antivirüs Uyum Modu', description: 'In-memory komutlarda antivirüs yanlış pozitif engelleyici.', type: 'toggle', value: true }
    ]
  }
];

export const AdvancedSettingsCenterTools = memo(function AdvancedSettingsCenterTools() {
  const [settingGroups, setSettingGroups] = useState<SettingGroup[]>(INITIAL_SETTINGS_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Hepsi');

  const filteredGroups = useMemo(() => {
    return settingGroups.map(group => ({
      ...group,
      items: group.items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'Hepsi' || group.category.includes(activeCategory);
        return matchesSearch && matchesCategory;
      })
    })).filter(group => group.items.length > 0);
  }, [settingGroups, searchQuery, activeCategory]);

  const toggleSetting = (catIndex: number, itemIndex: number) => {
    setSettingGroups(prev => {
      const next = [...prev];
      const target = next[catIndex].items[itemIndex];
      if (target.type === 'toggle') {
        target.value = !target.value;
      }
      return next;
    });
  };

  return (
    <div className="h-full w-full overflow-y-auto p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-3">
            <GearSix weight="duotone" className="text-[#1a5efd]" size={28} />
            <span>Gelişmiş Ayarlar & Yapılandırma Merkezi (Advanced Settings Center)</span>
          </h1>
          <p className="text-sm text-[#86868b] mt-1">LUPER platformunun tüm modül, görünüm, performans ve güvenlik tercihlerini yönetin.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-white/[0.06] hover:bg-white/[0.1] text-white font-bold text-[12.5px] rounded-xl transition-all border border-white/[0.08] flex items-center space-x-2">
            <DownloadSimple weight="duotone" size={14} />
            <span>Dışa Aktır (JSON)</span>
          </button>
        </div>
      </div>

      {/* Category & Search Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {['Hepsi', 'Genel', 'Performans', 'Güvenlik'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-[12.5px] font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-[#1a5efd] text-white shadow-md'
                  : 'bg-[#161619] text-[#86868b] border border-white/[0.08] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-64">
          <MagnifyingGlass weight="duotone" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ayar ara..."
            className="pl-9 pr-4 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-[13px] text-white focus:outline-none focus:border-[#1a5efd] w-full"
          />
        </div>
      </div>

      {/* Settings Groups */}
      <div className="space-y-6">
        {filteredGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#86868b] px-1">{group.category}</h3>

            <div className="bg-[#161619] border border-white/[0.08] rounded-2xl divide-y divide-white/[0.06] overflow-hidden luper-card">
              {group.items.map((item, itemIdx) => (
                <div key={item.id} className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-all">
                  <div>
                    <h4 className="text-white font-bold text-[14.5px]">{item.title}</h4>
                    <p className="text-[12.5px] text-[#86868b] mt-0.5">{item.description}</p>
                  </div>

                  <div>
                    {item.type === 'toggle' ? (
                      <button
                        onClick={() => toggleSetting(groupIdx, itemIdx)}
                        className={`w-12 h-6 rounded-full transition-all relative ${
                          item.value ? 'bg-[#1a5efd]' : 'bg-white/10'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
                          item.value ? 'left-[26px]' : 'left-0.5'
                        }`} />
                      </button>
                    ) : (
                      <select
                        value={item.value}
                        onChange={() => {}}
                        className="bg-[#121214] border border-white/[0.08] text-white font-mono text-[12.5px] px-3 py-1.5 rounded-xl focus:outline-none focus:border-[#1a5efd]"
                      >
                        {item.options?.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
