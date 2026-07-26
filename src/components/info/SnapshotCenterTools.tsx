import { Clock, Plus, ArrowCounterClockwise } from '@phosphor-icons/react';
import { memo, useMemo, useState } from 'react';

export interface SystemSnapshot {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  module: string;
  type: 'Registry' | 'Services' | 'Power' | 'Network' | 'Startup' | 'Full';
  status: 'Completed' | 'Restored' | 'Archived';
  sizeMB: number;
  itemsCount: number;
}

export const SnapshotCenterTools = memo(function SnapshotCenterTools() {
  const [snapshots, setSnapshots] = useState<SystemSnapshot[]>([]);
  const [selectedId, setSelectedId] = useState<string>('snap-20260725-1');
  
  const [isRestoring, setIsRestoring] = useState(false);

  const activeSnapshot = useMemo(() => {
    return snapshots.find(s => s.id === selectedId) || snapshots[0];
  }, [snapshots, selectedId]);

  const handleRestore = () => {
    setIsRestoring(true);
    setTimeout(() => {
      setIsRestoring(false);
      setSnapshots(prev => prev.map(s => s.id === selectedId ? { ...s, status: 'Restored' } : s));
    }, 1500);
  };

  return (
    <div className="h-full w-full overflow-y-auto p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-3">
            <ArrowCounterClockwise weight="duotone" className="text-[#1a5efd]" size={28} />
            <span>Sistem Geri Alma & Snapshot Merkezi</span>
          </h1>
          <p className="text-sm text-[#86868b] mt-1">İşlem öncesi bağımsız sistem durum yedekleri (Registry, Servis, Güç, Ağ) alma ve geri yükleme motoru.</p>
        </div>

        <button
          onClick={() => {
            const newSnap: SystemSnapshot = {
              id: `snap-${Date.now()}`,
              title: `Manuel Sistem Snapshot #${snapshots.length + 1}`,
              description: 'Kullanıcı tarafından manuel olarak tetiklenen anlık sistem yedeği.',
              createdAt: 'Şimdi',
              module: 'Manuel Yedekleme',
              type: 'Full',
              status: 'Completed',
              sizeMB: 4.2,
              itemsCount: 32
            };
            setSnapshots([newSnap, ...snapshots]);
          }}
          className="px-5 py-2.5 bg-[#1a5efd] hover:bg-[#2d6bfe] text-white font-bold text-[13.5px] rounded-xl transition-all flex items-center space-x-2 shadow-lg shadow-blue-500/20"
        >
          <Plus weight="duotone" size={16} />
          <span>Yeni Snapshot Oluştur</span>
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Snapshots Timeline */}
        <div className="col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#86868b]">Mevcut Sistem Snapshots</h3>
            <span className="text-xs font-mono text-[#1a5efd] font-bold">{snapshots.length} Yedek</span>
          </div>

          <div className="space-y-2.5">
            {snapshots.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-[#161619] border border-white/[0.08] rounded-2xl w-full col-span-full my-4">
            <h3 className="text-[14px] font-bold text-white mb-1">Veri Bulunamadı</h3>
            <p className="text-[12.5px] text-[#86868b]">Şu anda görüntülenecek veri bulunmuyor. Gerçek veri akışı bekleniyor.</p>
          </div>
        )}
        {snapshots.length > 0 && snapshots.map(item => {
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
                    <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-white/[0.06] text-[#86868b] font-medium">{item.type}</span>
                    <span className={`text-[11px] font-mono font-bold ${
                      item.status === 'Restored' ? 'text-[#34c759]' : 'text-[#86868b]'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <h4 className="text-white font-bold text-[14px] leading-snug">{item.title}</h4>
                  
                  <div className="flex items-center justify-between text-[11.5px] text-[#86868b] mt-2.5 font-mono">
                    <span className="flex items-center space-x-1"><Clock weight="duotone" size={12} /><span>{item.createdAt}</span></span>
                    <span>{item.sizeMB} MB • {item.itemsCount} Öğe</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Snapshot Details & Restore Interface */}
        <div className="col-span-7 bg-[#161619] border border-white/[0.08] p-6 rounded-2xl space-y-6 luper-card flex flex-col justify-between">
          <div className="space-y-5">
            <div className="border-b border-white/[0.06] pb-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#1a5efd] font-bold font-mono uppercase tracking-wider">Snapshot Detay Raporu</span>
                <h2 className="text-xl font-bold text-white mt-1">{activeSnapshot.title}</h2>
              </div>
              <span className="text-[12px] px-3 py-1 bg-white/[0.04] border border-white/[0.08] text-white rounded-lg font-mono">
                ID: {activeSnapshot.id}
              </span>
            </div>

            <p className="text-[#a1a1a6] text-[13.5px] leading-relaxed">{activeSnapshot.description}</p>

            <div className="grid grid-cols-3 gap-4 text-[13px]">
              <div className="bg-white/[0.03] p-4 rounded-xl border border-white/[0.06]">
                <span className="text-[#86868b] text-[12px]">Modül / Tetikleyici</span>
                <div className="text-white font-bold font-mono text-sm mt-0.5">{activeSnapshot.module}</div>
              </div>

              <div className="bg-white/[0.03] p-4 rounded-xl border border-white/[0.06]">
                <span className="text-[#86868b] text-[12px]">Yedeklenen Öğe</span>
                <div className="text-[#1a5efd] font-bold font-mono text-sm mt-0.5">{activeSnapshot.itemsCount} Değer</div>
              </div>

              <div className="bg-white/[0.03] p-4 rounded-xl border border-white/[0.06]">
                <span className="text-[#86868b] text-[12px]">Dosya Boyutu</span>
                <div className="text-white font-bold font-mono text-sm mt-0.5">{activeSnapshot.sizeMB} MB</div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between">
            <div className="text-[12px] text-[#86868b] font-mono">
              Durum: <strong className={activeSnapshot.status === 'Restored' ? 'text-[#34c759]' : 'text-white'}>{activeSnapshot.status}</strong>
            </div>

            <button
              onClick={handleRestore}
              disabled={isRestoring}
              className="px-6 py-3 bg-[#34c759] hover:bg-[#2fb350] text-white font-bold text-[13.5px] rounded-xl transition-all flex items-center space-x-2 shadow-lg shadow-green-500/20 disabled:opacity-50"
            >
              <ArrowCounterClockwise weight="duotone" size={16} className={isRestoring ? 'animate-spin' : ''} />
              <span>{isRestoring ? 'Sistem Durumu Geri Yükleniyor...' : 'Bu Snapshot’a Geri Dön'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
