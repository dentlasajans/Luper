import { Package, ShieldCheck, Lightning } from '@/src/components/ui/Icons';
import { memo, useMemo, useState } from 'react';

export interface OptimizationPack {
  id: string;
  name: string;
  category: 'Gaming' | 'Esports' | 'Streaming' | 'Workstation' | 'Battery';
  description: string;
  optimizationsCount: number;
  expectedFpsGain: string;
  expectedLatencyGain: string;
  estimatedTime: string;
  risk: 'Safe' | 'Low' | 'Medium';
  requiresRestart: boolean;
}

export const OptimizationPacksTools = memo(function OptimizationPacksTools() {
  const [packs] = useState<OptimizationPack[]>([]);
  const [selectedId, setSelectedId] = useState<string>('pack-ultimate-gaming');
  const [isApplying, setIsApplying] = useState(false);

  const activePack = useMemo(() => {
    return packs.find((p) => p.id === selectedId) || packs[0];
  }, [packs, selectedId]);

  const handleApplyPack = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
    }, 1500);
  };

  return (
    <div className="h-full w-full overflow-y-auto p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-3">
            <Package weight="duotone" className="text-luper-primary" size={28} />
            <span>Tek Tıkla Optimizasyon Paketleri (One-Click Packs)</span>
          </h1>
          <p className="text-sm text-[#86868b] mt-1">Belirli bir amaca yönelik hazırlanmış önceden test edilmiş toplu optimizasyon paketleri.</p>
        </div>

        <div className="flex items-center space-x-2 text-[12px] font-mono text-[#34c759] font-bold">
          <ShieldCheck weight="duotone" size={16} />
          <span>%100 Doğrulanmış ve Geri Alınabilir Paketler</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Packs List */}
        <div className="col-span-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#86868b] px-1">Önerilen Paketler</h3>
          {packs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-luper-surface border border-white/[0.08] rounded-2xl w-full col-span-full my-4">
            <h3 className="text-[14px] font-bold text-white mb-1">Veri Bulunamadı</h3>
            <p className="text-[12.5px] text-[#86868b]">Şu anda görüntülenecek veri bulunmuyor. Gerçek veri akışı bekleniyor.</p>
          </div>
        )}
        {packs.length > 0 && packs.map((pack) => {
            const isSelected = pack.id === selectedId;
            return (
              <div
                key={pack.id}
                onClick={() => setSelectedId(pack.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-luper-primary/10 border-luper-primary shadow-lg shadow-blue-500/10'
                    : 'bg-luper-surface border-white/[0.08] hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-white/[0.06] text-[#86868b] font-medium font-mono">{pack.category}</span>
                  <span className="text-[11px] font-mono text-[#34c759] font-bold">{pack.optimizationsCount} Ayar İçerir</span>
                </div>

                <h4 className="text-white font-bold text-[15px]">{pack.name}</h4>

                <div className="flex items-center space-x-3 text-[12px] text-[#86868b] mt-2 font-mono">
                  <span>FPS: <strong className="text-[#34c759]">{pack.expectedFpsGain}</strong></span>
                  <span>â€¢</span>
                  <span>Gecikme: <strong className="text-[#34c759]">{pack.expectedLatencyGain}</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Pack Preview Detail */}
        <div className="col-span-7 bg-luper-surface border border-white/[0.08] p-6 rounded-2xl space-y-6 luper-card flex flex-col justify-between">
          <div className="space-y-5">
            <div className="border-b border-white/[0.06] pb-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-luper-primary font-bold font-mono uppercase tracking-wider">Paket Detay İnceleme</span>
                <h2 className="text-xl font-bold text-white mt-1">{activePack.name}</h2>
              </div>
              <span className="text-[11px] px-3 py-1 bg-[#34c759]/10 text-[#34c759] font-mono font-bold rounded-lg border border-[#34c759]/20">
                Risk: {activePack.risk}
              </span>
            </div>

            <p className="text-[#a1a1a6] text-[13.5px] leading-relaxed">{activePack.description}</p>

            <div className="grid grid-cols-2 gap-4 text-[13px]">
              <div className="bg-white/[0.03] p-4 rounded-xl border border-white/[0.06]">
                <span className="text-[#86868b] text-[12px]">İçerilen Optimizasyon</span>
                <div className="text-white font-bold font-mono text-base mt-0.5">{activePack.optimizationsCount} Farklı İyileştirme</div>
              </div>

              <div className="bg-white/[0.03] p-4 rounded-xl border border-white/[0.06]">
                <span className="text-[#86868b] text-[12px]">Tahmini FPS Artışı</span>
                <div className="text-[#34c759] font-bold font-mono text-base mt-0.5">{activePack.expectedFpsGain}</div>
              </div>

              <div className="bg-white/[0.03] p-4 rounded-xl border border-white/[0.06]">
                <span className="text-[#86868b] text-[12px]">Girdi Gecikmesi İyileşmesi</span>
                <div className="text-[#34c759] font-bold font-mono text-base mt-0.5">{activePack.expectedLatencyGain}</div>
              </div>

              <div className="bg-white/[0.03] p-4 rounded-xl border border-white/[0.06]">
                <span className="text-[#86868b] text-[12px]">Uygulama Süresi</span>
                <div className="text-white font-bold font-mono text-base mt-0.5">{activePack.estimatedTime}</div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between">
            <span className="text-[12px] text-[#86868b] font-mono">
              Yeniden Başlatma: <strong className="text-white">{activePack.requiresRestart ? 'Şart' : 'Gerekmiyor'}</strong>
            </span>

            <button
              onClick={handleApplyPack}
              disabled={isApplying}
              className="px-6 py-3 bg-luper-primary hover:bg-[#2d6bfe] text-white font-bold text-[13.5px] rounded-xl transition-all flex items-center space-x-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              <Lightning weight="duotone" size={16} className={isApplying ? 'animate-spin' : ''} />
              <span>{isApplying ? 'Paket Uygulanıyor...' : 'Paketi Tek Tıkla Uygula'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

