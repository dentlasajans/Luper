import { Package, Power, MagnifyingGlass, ShieldCheck, Trash } from '@phosphor-icons/react';
import { memo, useMemo, useState } from 'react';

export interface ExtensionItem {
  id: string;
  name: string;
  version: string;
  author: string;
  publisher: string;
  category: 'Optimization' | 'Monitoring' | 'Gaming' | 'Themes' | 'Automation';
  status: 'Active' | 'Update Available' | 'Disabled' | 'Error';
  sizeMB: number;
  permissions: string[];
  signatureValid: boolean;
}

export const ExtensionManagerTools = memo(function ExtensionManagerTools() {
  const [extensions, setExtensions] = useState<ExtensionItem[]>([]);
  const [selectedId, setSelectedId] = useState<string>('ext-directstorage');
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const activeExt = useMemo(() => {
    return extensions.find(e => e.id === selectedId) || extensions[0];
  }, [extensions, selectedId]);

  const filteredExtensions = useMemo(() => {
    return extensions.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.category.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [extensions, searchQuery]);

  const toggleExtension = (id: string) => {
    setExtensions(prev => prev.map(e => {
      if (e.id === id) {
        const newStatus = e.status === 'Active' ? 'Disabled' : 'Active';
        return { ...e, status: newStatus };
      }
      return e;
    }));
  };

  const handleUpdate = (id: string) => {
    setExtensions(prev => prev.map(e => e.id === id ? { ...e, version: 'v2.2.0 (Güncellendi)', status: 'Active' } : e));
  };

  return (
    <div className="h-full w-full overflow-y-auto p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-3">
            <Package weight="duotone" className="text-[#1a5efd]" size={28} />
            <span>Gelişmiş Eklenti & Modül Yöneticisi (Extension Manager)</span>
          </h1>
          <p className="text-sm text-[#86868b] mt-1">Yüklü LUPER eklentilerini yönetin, güncelleyin, izin durumlarını ve dijital imzaları denetleyin.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setAutoUpdate(!autoUpdate)}
            className={`px-4 py-2 rounded-xl text-[12.5px] font-bold transition-all border ${
              autoUpdate ? 'bg-[#34c759]/10 text-[#34c759] border-[#34c759]/20' : 'bg-white/[0.04] text-[#86868b] border-white/[0.08]'
            }`}
          >
            Otomatik Güncelleme: {autoUpdate ? 'Açık' : 'Kapalı'}
          </button>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <MagnifyingGlass weight="duotone" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Modül veya kategori ara..."
            className="pl-9 pr-4 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-[13px] text-white focus:outline-none focus:border-[#1a5efd] w-full"
          />
        </div>

        <span className="text-[12px] font-mono text-[#86868b]">Toplam Yüklü Modül: <strong className="text-white">{extensions.length}</strong></span>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Extensions Manager List */}
        <div className="col-span-5 space-y-3">
          {filteredExtensions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-[#161619] border border-white/[0.08] rounded-2xl w-full col-span-full my-4">
            <h3 className="text-[14px] font-bold text-white mb-1">Veri Bulunamadı</h3>
            <p className="text-[12.5px] text-[#86868b]">Şu anda görüntülenecek veri bulunmuyor. Gerçek veri akışı bekleniyor.</p>
          </div>
        )}
        {filteredExtensions.length > 0 && filteredExtensions.map(ext => {
            const isSelected = ext.id === selectedId;
            return (
              <div
                key={ext.id}
                onClick={() => setSelectedId(ext.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1a5efd]/10 border-[#1a5efd] shadow-lg shadow-blue-500/10'
                    : 'bg-[#161619] border-white/[0.08] hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-white/[0.06] text-[#86868b] font-medium font-mono">{ext.category}</span>
                  <span className={`text-[11px] font-mono font-bold ${
                    ext.status === 'Active' ? 'text-[#34c759]' :
                    ext.status === 'Update Available' ? 'text-[#ff9f0a]' : 'text-[#86868b]'
                  }`}>
                    {ext.status}
                  </span>
                </div>

                <h4 className="text-white font-bold text-[14.5px] leading-snug">{ext.name}</h4>

                <div className="flex items-center justify-between text-[11.5px] text-[#86868b] mt-2 font-mono">
                  <span>{ext.version}</span>
                  <span>{ext.sizeMB} MB</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Details & Controls */}
        <div className="col-span-7 bg-[#161619] border border-white/[0.08] p-6 rounded-2xl space-y-6 luper-card flex flex-col justify-between">
          <div className="space-y-5">
            <div className="border-b border-white/[0.06] pb-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#1a5efd] font-bold font-mono uppercase tracking-wider">Modül Detayı & Yönetim</span>
                <h2 className="text-xl font-bold text-white mt-1">{activeExt.name}</h2>
              </div>

              <button
                onClick={() => toggleExtension(activeExt.id)}
                className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all flex items-center space-x-2 ${
                  activeExt.status === 'Active'
                    ? 'bg-[#34c759]/10 text-[#34c759] border border-[#34c759]/20'
                    : 'bg-white/[0.06] text-[#86868b] border border-white/[0.08]'
                }`}
              >
                <Power weight="duotone" size={14} />
                <span>{activeExt.status === 'Active' ? 'Etkin Modül' : 'Devre Dışı'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-[13px]">
              <div className="bg-white/[0.03] p-4 rounded-xl border border-white/[0.06]">
                <span className="text-[#86868b] text-[12px]">Geliştirici / Yayıncı</span>
                <div className="text-white font-bold font-mono text-sm mt-0.5">{activeExt.publisher}</div>
              </div>

              <div className="bg-white/[0.03] p-4 rounded-xl border border-white/[0.06]">
                <span className="text-[#86868b] text-[12px]">Disk Kullanımı</span>
                <div className="text-white font-bold font-mono text-sm mt-0.5">{activeExt.sizeMB} MB</div>
              </div>
            </div>

            {activeExt.status === 'Update Available' && (
              <div className="bg-[#ff9f0a]/10 border border-[#ff9f0a]/20 p-4 rounded-xl flex items-center justify-between">
                <span className="text-xs text-[#ff9f0a] font-bold font-mono">Yeni Sürüm Mevcut! (v2.2.0)</span>
                <button
                  onClick={() => handleUpdate(activeExt.id)}
                  className="px-3.5 py-1.5 bg-[#ff9f0a] text-black font-bold text-[12.5px] rounded-lg transition-all"
                >
                  Şimdi Güncelle
                </button>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-[12px] font-mono text-[#86868b]">
            <span className="flex items-center space-x-1.5">
              <ShieldCheck weight="duotone" size={15} className="text-[#34c759]" />
              <span>Dijital İmza: <strong className="text-[#34c759]">Doğrulandı (%100 Özgün)</strong></span>
            </span>

            <button className="text-[#ff453a] hover:underline flex items-center space-x-1">
              <Trash weight="duotone" size={13} />
              <span>Modülü Kaldır</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
