import { Pulse, Clock, Gauge, Stack, ShieldCheck, Sparkle, Lightning } from '@/src/components/ui/Icons';
import { memo, useState } from 'react';

export const SystemInsightsActionCenterTools = memo(function SystemInsightsActionCenterTools() {
  const [healthScore] = useState(94);
  const [gamingScore] = useState(98);
  const [stabilityScore] = useState(96);

  return (
    <div className="h-full w-full overflow-y-auto p-8 space-y-8">
      {/* Header & Quick Action Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-3">
            <Sparkle weight="duotone" className="text-luper-primary" size={28} />
            <span>Sistem Analitiği & Karar Merkezi (Insights & Action Center)</span>
          </h1>
          <p className="text-sm text-[#86868b] mt-1">LUPER platformunun genel sağlık, performans ve önerilen eylem özet paneli.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button className="px-5 py-2.5 bg-luper-primary hover:bg-[#2d6bfe] text-white font-bold text-[13.5px] rounded-xl transition-all flex items-center space-x-2 shadow-lg shadow-blue-500/20">
            <Lightning weight="duotone" size={16} />
            <span>Hızlı Taramayı Çalıştır</span>
          </button>
        </div>
      </div>

      {/* Top Executive Score Cards */}
      <div className="grid grid-cols-4 gap-5">
        <div className="bg-luper-surface border border-white/[0.08] p-5 rounded-2xl luper-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[12.5px] text-[#86868b] font-medium">Genel Sistem Sağlığı</span>
            <ShieldCheck weight="duotone" size={18} className="text-[#34c759]" />
          </div>
          <div className="text-3xl font-bold text-[#34c759] font-mono">{healthScore} / 100</div>
          <span className="text-[11px] text-[#34c759] font-mono font-semibold">S+ Mükemmel Durumda</span>
        </div>

        <div className="bg-luper-surface border border-white/[0.08] p-5 rounded-2xl luper-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[12.5px] text-[#86868b] font-medium">Oyun Performans Skoru</span>
            <Gauge weight="duotone" size={18} className="text-luper-primary" />
          </div>
          <div className="text-3xl font-bold text-white font-mono">{gamingScore} / 100</div>
          <span className="text-[11px] text-luper-primary font-mono font-semibold">+18.4 FPS Optimizasyonu</span>
        </div>

        <div className="bg-luper-surface border border-white/[0.08] p-5 rounded-2xl luper-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[12.5px] text-[#86868b] font-medium">Sistem Kararlılığı</span>
            <Pulse weight="duotone" size={18} className="text-[#64d2ff]" />
          </div>
          <div className="text-3xl font-bold text-white font-mono">{stabilityScore} / 100</div>
          <span className="text-[11px] text-[#64d2ff] font-mono font-semibold">Sıfır Çökme / DPC Latency OK</span>
        </div>

        <div className="bg-luper-surface border border-white/[0.08] p-5 rounded-2xl luper-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[12.5px] text-[#86868b] font-medium">Aktif Otomasyonlar</span>
            <Stack weight="duotone" size={18} className="text-[#ff9f0a]" />
          </div>
          <div className="text-3xl font-bold text-[#ff9f0a] font-mono">3 Senaryo</div>
          <span className="text-[11px] text-[#86868b] font-mono">Arka Planda Dinlemede</span>
        </div>
      </div>

      {/* Priority Action Feed & Insights */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-7 bg-luper-surface border border-white/[0.08] p-6 rounded-2xl luper-card space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <h3 className="text-white font-bold text-[16px] flex items-center space-x-2">
              <Lightning weight="duotone" size={18} className="text-luper-primary" />
              <span>Öncelikli Eylem Paneli (Priority Actions)</span>
            </h3>
            <span className="text-[12px] font-mono text-luper-primary font-bold">2 Öneri Bekliyor</span>
          </div>

          <div className="space-y-3">
            <div className="bg-white/[0.03] p-4 rounded-xl border border-white/[0.06] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold font-mono text-[#ff9f0a] uppercase">Dikkat Edilmeli</span>
                <h4 className="text-white font-bold text-[14px]">NVMe TRIM Zamanlaması Çalıştırılmadı</h4>
                <p className="text-[12px] text-[#86868b]">Son TRIM işleminden bu yana 8 gün geçti. Rastgele okuma hızı %4 düşebilir.</p>
              </div>

              <button className="px-3.5 py-1.5 bg-white/[0.06] hover:bg-white/[0.1] text-white font-bold text-[12.5px] rounded-lg transition-all border border-white/[0.08]">
                İncele
              </button>
            </div>

            <div className="bg-white/[0.03] p-4 rounded-xl border border-white/[0.06] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold font-mono text-[#34c759] uppercase">Önerilen</span>
                <h4 className="text-white font-bold text-[14px]">HAGS (Donanım GPU İvmesi) Etkinleştirilebilir</h4>
                <p className="text-[12px] text-[#86868b]">RTX 4090 grafik kartınız HAGS özelliğini destekliyor.</p>
              </div>

              <button className="px-3.5 py-1.5 bg-luper-primary hover:bg-[#2d6bfe] text-white font-bold text-[12.5px] rounded-lg transition-all">
                Uygula
              </button>
            </div>
          </div>
        </div>

        {/* System Activity Timeline */}
        <div className="col-span-5 bg-luper-surface border border-white/[0.08] p-6 rounded-2xl luper-card space-y-4">
          <h3 className="text-white font-bold text-[16px] flex items-center space-x-2 border-b border-white/[0.06] pb-3">
            <Clock weight="duotone" size={18} className="text-[#34c759]" />
            <span>Son Sistem Etkinliği Günlüğü</span>
          </h3>

          <div className="space-y-3 text-[12.5px] font-mono text-[#86868b]">
            <div className="flex items-center justify-between">
              <span className="text-white font-bold">Sağlık Taraması Tamamlandı</span>
              <span>10:30</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white font-bold">Registry Snapshot Alındı</span>
              <span>10:15</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white font-bold">Cyberpunk 2077 Profili Aktifleşti</span>
              <span>Dün 22:14</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

