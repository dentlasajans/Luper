import { Package, Power, ShieldCheck } from '@phosphor-icons/react';
import { memo, useState } from 'react';

export interface LuperExtension {
  id: string;
  name: string;
  version: string;
  author: string;
  type: 'Optimization' | 'Monitoring' | 'Game Module';
  description: string;
  permissions: string[];
  enabled: boolean;
}

export const ExtensionSdkTools = memo(function ExtensionSdkTools() {
  const [extensions, setExtensions] = useState<LuperExtension[]>([]);
  const [selectedId, setSelectedId] = useState<string>('ext-directx-directstorage');

  const activeExt = extensions.find(e => e.id === selectedId) || extensions[0];

  const toggleExtension = (id: string) => {
    setExtensions(prev => prev.map(e => e.id === id ? { ...e, enabled: !e.enabled } : e));
  };

  return (
    <div className="h-full w-full overflow-y-auto p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-3">
            <Package weight="duotone" className="text-[#1a5efd]" size={28} />
            <span>Eklenti SDK & Modül Platformu (Extension SDK)</span>
          </h1>
          <p className="text-sm text-[#86868b] mt-1">LUPER platformu için güvenli izin tabanlı SDK ve 3. parti modül yönetim merkezi.</p>
        </div>

        <div className="flex items-center space-x-2 text-[12px] font-mono text-[#34c759] font-bold">
          <ShieldCheck weight="duotone" size={16} />
          <span>Korumalı Sandbox Çatısı Aktif</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Extensions List */}
        <div className="col-span-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#86868b] px-1">Yüklü Modüller & Eklentiler</h3>
          {extensions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-[#161619] border border-white/[0.08] rounded-2xl w-full col-span-full my-4">
            <h3 className="text-[14px] font-bold text-white mb-1">Veri Bulunamadı</h3>
            <p className="text-[12.5px] text-[#86868b]">Şu anda görüntülenecek veri bulunmuyor. Gerçek veri akışı bekleniyor.</p>
          </div>
        )}
        {extensions.length > 0 && extensions.map(ext => {
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
                  <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-white/[0.06] text-[#86868b] font-medium font-mono">{ext.type}</span>
                  <span className={`text-[11px] font-mono font-bold ${
                    ext.enabled ? 'text-[#34c759]' : 'text-[#86868b]'
                  }`}>
                    {ext.enabled ? 'Aktif Modül' : 'Pasif'}
                  </span>
                </div>

                <h4 className="text-white font-bold text-[14.5px] leading-snug">{ext.name}</h4>

                <div className="flex items-center justify-between text-[11.5px] text-[#86868b] mt-2 font-mono">
                  <span>Sürüm: {ext.version}</span>
                  <span>Yazar: {ext.author}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail Card */}
        <div className="col-span-7 bg-[#161619] border border-white/[0.08] p-6 rounded-2xl space-y-6 luper-card flex flex-col justify-between">
          <div className="space-y-5">
            <div className="border-b border-white/[0.06] pb-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#1a5efd] font-bold font-mono uppercase tracking-wider">Modül Manifest Detayı</span>
                <h2 className="text-xl font-bold text-white mt-1">{activeExt.name}</h2>
              </div>

              <button
                onClick={() => toggleExtension(activeExt.id)}
                className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all flex items-center space-x-2 ${
                  activeExt.enabled
                    ? 'bg-[#34c759]/10 text-[#34c759] border border-[#34c759]/20'
                    : 'bg-white/[0.06] text-[#86868b] border border-white/[0.08]'
                }`}
              >
                <Power weight="duotone" size={14} />
                <span>{activeExt.enabled ? 'Modül Aktif' : 'Devre Dışı'}</span>
              </button>
            </div>

            <p className="text-[#a1a1a6] text-[13.5px] leading-relaxed">{activeExt.description}</p>

            <div className="space-y-2 font-mono text-[12.5px]">
              <span className="text-[#86868b] text-[11px] uppercase font-bold block">İstenen SDK İzinleri (Granted Sandbox Permissions)</span>
              <div className="flex flex-wrap gap-2">
                {activeExt.permissions.map((perm, idx) => (
                  <span key={idx} className="px-3 py-1 bg-[#1a5efd]/10 border border-[#1a5efd]/20 text-[#64d2ff] rounded-lg font-bold">
                    {perm}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-[12px] font-mono text-[#86868b]">
            <span>ID: <strong className="text-white">{activeExt.id}</strong></span>
            <span>İzin Durumu: <strong className="text-[#34c759]">Onaylandı (%100 Güvenli)</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
});
