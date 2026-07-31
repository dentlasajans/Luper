import { GearSix } from '@/src/components/ui/Icons';
import { memo, useState } from 'react';

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
      { id: 'auto-start', title: 'Windows Baslangicinda Çalistir', description: 'Sistem açilisinda arka planda dinleyici modda baslat.', type: 'toggle', value: true }
    ]
  }
];

export const AdvancedSettingsCenterTools = memo(function AdvancedSettingsCenterTools() {
  const [settingGroups, setSettingGroups] = useState<SettingGroup[]>(INITIAL_SETTINGS_DATA);

  const toggleSetting = (catIndex: number, itemIndex: number) => {
    setSettingGroups((prev) => {
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
            <GearSix weight="duotone" className="text-luper-primary" size={28} />
            <span>Ayarlar</span>
          </h1>
          <p className="text-sm text-[#86868b] mt-1">LUPER platformunun tercihlerini yönetin.</p>
        </div>
      </div>

      {/* Settings Groups */}
      <div className="space-y-6">
        {settingGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-3">

            <div className="bg-luper-surface border border-white/[0.08] rounded-2xl divide-y divide-white/[0.06] overflow-hidden luper-card">
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
                          item.value ? 'bg-luper-primary' : 'bg-white/10'
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
                        className="bg-[#161618] border border-white/[0.08] text-white font-mono text-[12.5px] px-3 py-1.5 rounded-xl focus:outline-none focus:border-luper-primary"
                      >
                        {item.options?.map((opt) => (
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

