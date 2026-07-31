import { CheckCircle, Cloud, HardDrives, Laptop, Lock, ArrowsClockwise } from '@/src/components/ui/Icons';
import { memo, useState } from 'react';

export interface DeviceItem {
  id: string;
  name: string;
  type: 'Desktop' | 'Laptop';
  os: string;
  lastSync: string;
  isCurrent: boolean;
}

export const CloudBackupSyncTools = memo(function CloudBackupSyncTools() {
  const [devices] = useState<DeviceItem[]>([]);
  
  
  const [isSyncing, setIsSyncing] = useState(false);

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1500);
  };

  return (
    <div className="h-full w-full overflow-y-auto p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-3">
            <Cloud weight="duotone" className="text-luper-primary" size={28} />
            <span>Bulut Yedekleme & Senkronizasyon (Cloud Backup & Sync)</span>
          </h1>
          <p className="text-sm text-[#86868b] mt-1">Sistem ayarlarınızı, oyun profillerinizi ve otomasyon kurallarınızı uçtan uca şifreli bulutta saklayın.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="px-5 py-2.5 bg-luper-primary hover:bg-[#2d6bfe] text-white font-bold text-[13.5px] rounded-xl transition-all flex items-center space-x-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            <ArrowsClockwise weight="duotone" size={16} className={isSyncing ? 'animate-spin' : ''} />
            <span>{isSyncing ? 'Senkronize Ediliyor...' : 'Şimdi Senkronize Et'}</span>
          </button>
        </div>
      </div>

      {/* Top Status Cards */}
      <div className="grid grid-cols-4 gap-5">
        <div className="bg-luper-surface border border-white/[0.08] p-5 rounded-2xl luper-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[12.5px] text-[#86868b] font-medium">Senkronizasyon Durumu</span>
            <CheckCircle weight="duotone" size={18} className="text-[#34c759]" />
          </div>
          <div className="text-2xl font-bold text-white">Senkronize</div>
          <span className="text-[11px] text-[#34c759] font-mono font-semibold">Tüm Veriler Güncel</span>
        </div>

        <div className="bg-luper-surface border border-white/[0.08] p-5 rounded-2xl luper-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[12.5px] text-[#86868b] font-medium">Güvenlik & Şifreleme</span>
            <Lock weight="duotone" size={18} className="text-luper-primary" />
          </div>
          <div className="text-2xl font-bold text-white">AES-256 E2EE</div>
          <span className="text-[11px] text-luper-primary font-mono font-semibold">Uçtan Uca Şifreli</span>
        </div>

        <div className="bg-luper-surface border border-white/[0.08] p-5 rounded-2xl luper-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[12.5px] text-[#86868b] font-medium">Bağlı Cihazlar</span>
            <Laptop weight="duotone" size={18} className="text-[#64d2ff]" />
          </div>
          <div className="text-2xl font-bold text-white">2 Cihaz</div>
          <span className="text-[11px] text-[#64d2ff] font-mono font-semibold">Masaüstü & Dizüstü</span>
        </div>

        <div className="bg-luper-surface border border-white/[0.08] p-5 rounded-2xl luper-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[12.5px] text-[#86868b] font-medium">Bulut Depolama Alanı</span>
            <HardDrives weight="duotone" size={18} className="text-[#ff9f0a]" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">14.2 MB / 1 GB</div>
          <span className="text-[11px] text-[#86868b] font-mono">%1.4 Tüketim</span>
        </div>
      </div>

      {/* Connected Devices */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#86868b] px-1">Bağlı Cihazlar (Registered Devices)</h3>
        <div className="grid grid-cols-2 gap-5">
          {devices.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-luper-surface border border-white/[0.08] rounded-2xl w-full col-span-full my-4">
            <h3 className="text-[14px] font-bold text-white mb-1">Veri Bulunamadı</h3>
            <p className="text-[12.5px] text-[#86868b]">Şu anda görüntülenecek veri bulunmuyor. Gerçek veri akışı bekleniyor.</p>
          </div>
        )}
        {devices.length > 0 && devices.map((dev) => (
            <div key={dev.id} className="bg-luper-surface border border-white/[0.08] p-5 rounded-2xl luper-card flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-luper-primary">
                  <Laptop weight="duotone" size={20} />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-white font-bold text-[14.5px]">{dev.name}</h4>
                    {dev.isCurrent && (
                      <span className="px-2 py-0.5 rounded bg-luper-primary/20 text-luper-primary text-[10.5px] font-mono font-bold">Bu Cihaz</span>
                    )}
                  </div>
                  <p className="text-[12px] text-[#86868b] font-mono mt-0.5">{dev.os} â€¢ {dev.lastSync}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

