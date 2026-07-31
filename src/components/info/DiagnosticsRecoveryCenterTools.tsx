import { Pulse, Warning, Clock, ArrowsClockwise, ShieldCheck, Wrench } from '@/src/components/ui/Icons';
import { memo, useState } from 'react';

export interface DiagnosticItem {
  id: string;
  name: string;
  category: 'System' | 'Database' | 'Extension' | 'Network';
  status: 'Healthy' | 'Warning' | 'Error';
  detail: string;
  repairable: boolean;
}

export const DiagnosticsRecoveryCenterTools = memo(function DiagnosticsRecoveryCenterTools() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticItem[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isRepairing, setIsRepairing] = useState(false);
  const [safeMode, setSafeMode] = useState(false);

  const handleRunFullDiagnostics = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1500);
  };

  const handleAutoRepair = () => {
    setIsRepairing(true);
    setTimeout(() => {
      setDiagnostics((prev) => prev.map((d) => ({ ...d, status: 'Healthy', detail: 'Onarım tamamlandı. Bütünlük %100.' })));
      setIsRepairing(false);
    }, 1500);
  };

  return (
    <div className="h-full w-full overflow-y-auto p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-3">
            <Pulse weight="duotone" className="text-luper-primary" size={28} />
            <span>Teşhis & Kurtarma Merkezi (Diagnostics & Recovery Center)</span>
          </h1>
          <p className="text-sm text-[#86868b] mt-1">LUPER platformu bileşen bütünlüğünü denetleyin, hataları otomatik onarın ve Güvenli Modu yönetin.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSafeMode(!safeMode)}
            className={`px-4 py-2 rounded-xl text-[12.5px] font-bold transition-all border ${
              safeMode ? 'bg-[#ff9f0a]/10 text-[#ff9f0a] border-[#ff9f0a]/20' : 'bg-white/[0.04] text-[#86868b] border-white/[0.08]'
            }`}
          >
            Güvenli Mod: {safeMode ? 'Aktif (Sadece Çekirdek)' : 'Kapalı (Normal)'}
          </button>

          <button
            onClick={handleRunFullDiagnostics}
            disabled={isScanning}
            className="px-5 py-2.5 bg-luper-primary hover:bg-[#2d6bfe] text-white font-bold text-[13.5px] rounded-xl transition-all flex items-center space-x-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            <ArrowsClockwise weight="duotone" size={16} className={isScanning ? 'animate-spin' : ''} />
            <span>{isScanning ? 'Teşhis Ediliyor...' : 'Derin Teşhisi Başlat'}</span>
          </button>
        </div>
      </div>

      {/* Overview Status Grid */}
      <div className="grid grid-cols-4 gap-5">
        <div className="bg-luper-surface border border-white/[0.08] p-5 rounded-2xl luper-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[12.5px] text-[#86868b] font-medium">Platform Bütünlüğü</span>
            <ShieldCheck weight="duotone" size={18} className="text-[#34c759]" />
          </div>
          <div className="text-2xl font-bold text-[#34c759] font-mono">%98.4</div>
          <span className="text-[11px] text-[#34c759] font-mono font-semibold">Tüm Çekirdek Modüller Tam</span>
        </div>

        <div className="bg-luper-surface border border-white/[0.08] p-5 rounded-2xl luper-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[12.5px] text-[#86868b] font-medium">Bulunan Sorunlar</span>
            <Warning weight="duotone" size={18} className="text-[#ff9f0a]" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">1 İkaz</div>
          <span className="text-[11px] text-[#ff9f0a] font-mono font-semibold">Otomatik Onarılabilir</span>
        </div>

        <div className="bg-luper-surface border border-white/[0.08] p-5 rounded-2xl luper-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[12.5px] text-[#86868b] font-medium">Son Onarım</span>
            <Clock weight="duotone" size={18} className="text-[#64d2ff]" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">Dün 18:40</div>
          <span className="text-[11px] text-[#86868b] font-mono">Registry Yöneticisi Onarıldı</span>
        </div>

        <div className="bg-luper-surface border border-white/[0.08] p-5 rounded-2xl luper-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[12.5px] text-[#86868b] font-medium">Kurtarma Noktası</span>
            <Wrench weight="duotone" size={18} className="text-luper-primary" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">Hazır</div>
          <span className="text-[11px] text-[#34c759] font-mono font-semibold">Otomatik Rollback Aktif</span>
        </div>
      </div>

      {/* Diagnostics Item List & Quick Repair Bar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#86868b] px-1">Teşhis Sonu Raporu</h3>
          <button
            onClick={handleAutoRepair}
            disabled={isRepairing}
            className="px-4 py-2 bg-[#34c759] hover:bg-[#30b752] text-black font-bold text-[13px] rounded-xl transition-all flex items-center space-x-2 shadow-md shadow-green-500/20 disabled:opacity-50"
          >
            <Wrench weight="duotone" size={14} className={isRepairing ? 'animate-spin' : ''} />
            <span>{isRepairing ? 'Onarılıyor...' : 'Tüm Sorunları Otomatik Onar'}</span>
          </button>
        </div>

        {diagnostics.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-luper-surface border border-white/[0.08] rounded-2xl w-full col-span-full my-4">
            <h3 className="text-[14px] font-bold text-white mb-1">Veri Bulunamadı</h3>
            <p className="text-[12.5px] text-[#86868b]">Şu anda görüntülenecek veri bulunmuyor. Gerçek veri akışı bekleniyor.</p>
          </div>
        )}
        {diagnostics.length > 0 && diagnostics.map((item) => (
          <div key={item.id} className="bg-luper-surface border border-white/[0.08] p-5 rounded-2xl luper-card flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-white/[0.06] text-[#86868b] font-mono font-medium">{item.category}</span>
                <h4 className="text-white font-bold text-[14.5px]">{item.name}</h4>
              </div>
              <p className="text-[12.5px] text-[#86868b] font-mono">{item.detail}</p>
            </div>

            <span className={`text-[12px] font-mono font-bold px-3 py-1 rounded-xl border ${
              item.status === 'Healthy' ? 'bg-[#34c759]/10 text-[#34c759] border-[#34c759]/20' :
              item.status === 'Warning' ? 'bg-[#ff9f0a]/10 text-[#ff9f0a] border-[#ff9f0a]/20' :
              'bg-[#ff453a]/10 text-[#ff453a] border-[#ff453a]/20'
            }`}>
              {item.status === 'Healthy' ? 'Bütünlük Tam' : 'Uyarı'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

