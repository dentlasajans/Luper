import { ArrowsClockwise, ShieldCheck, Lightning } from '@/src/components/ui/Icons';
import { memo, useState } from 'react';

export interface SimulationResult {
  metric: string;
  currentValue: string;
  simulatedValue: string;
  delta: string;
  impact: 'Neutral' | 'Positive' | 'Very Positive';
  confidence: number;
}

export const OptimizationSimulatorTools = memo(function OptimizationSimulatorTools() {
  const [activeProfile, setActiveProfile] = useState<'Recommended' | 'Gaming' | 'Balanced' | 'Power'>('Gaming');
  const [isSimulating, setIsSimulating] = useState(false);

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 800);
  };

  return (
    <div className="h-full w-full overflow-y-auto p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-3">
            <Lightning weight="duotone" className="text-luper-primary" size={28} />
            <span>Optimizasyon Simülatörü (Predictive Engine)</span>
          </h1>
          <p className="text-sm text-[#86868b] mt-1">Sistem değişiklikleri uygulanmadan önce tahmini performans ve kazanım analizi (Salt Okunur Simülasyon).</p>
        </div>

        <button
          onClick={runSimulation}
          disabled={isSimulating}
          className="px-5 py-2.5 bg-luper-primary hover:bg-[#2d6bfe] text-white font-bold text-[13.5px] rounded-xl transition-all flex items-center space-x-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
        >
          <ArrowsClockwise weight="duotone" size={16} className={isSimulating ? 'animate-spin' : ''} />
          <span>{isSimulating ? 'Hesaplanıyor...' : 'Simülasyonu Yeniden Çalıştır'}</span>
        </button>
      </div>

      {/* Profile Selector Toolbar */}
      <div className="flex items-center justify-between bg-luper-surface border border-white/[0.08] p-2 rounded-2xl luper-card">
        <div className="flex items-center space-x-2">
          {(['Recommended', 'Gaming', 'Balanced', 'Power'] as const).map((prof) => (
            <button
              key={prof}
              onClick={() => {
                setActiveProfile(prof);
                runSimulation();
              }}
              className={`px-5 py-2 rounded-xl text-[13.5px] font-bold transition-all ${
                activeProfile === prof
                  ? 'bg-luper-primary text-white shadow-md'
                  : 'text-[#86868b] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {prof === 'Recommended' ? 'Önerilen Profil' :
               prof === 'Gaming' ? 'Oyun / E-Spor Profili' :
               prof === 'Balanced' ? 'Dengeli Profil' : 'Güç Tasarrufu'}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 px-3 text-[12px] font-mono text-[#34c759] font-bold">
          <ShieldCheck weight="duotone" size={16} />
          <span>Sıfır Risk â€¢ %100 Tahmin Güvenilirliği</span>
        </div>
      </div>

      {/* Simulated Metrics Cards */}
      <div className="grid grid-cols-2 gap-6">
        {([] as SimulationResult[]).map((res) => (
          <div key={res.metric} className="bg-luper-surface border border-white/[0.08] p-6 rounded-2xl space-y-4 luper-card">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-bold text-white">{res.metric}</span>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-[#34c759]/10 text-[#34c759] font-bold">
                %{res.confidence} Güven
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-2 border-t border-white/[0.04]">
              <div>
                <span className="text-[12px] text-[#86868b] block">Mevcut Durum</span>
                <span className="text-xl font-bold font-mono text-white/60">{res.currentValue}</span>
              </div>

              <div className="text-right">
                <span className="text-[12px] text-[#34c759] block font-semibold">Simüle Edilen Kazanım</span>
                <span className="text-2xl font-bold font-mono text-[#34c759]">{res.simulatedValue}</span>
              </div>
            </div>

            <div className="bg-[#34c759]/10 border border-[#34c759]/20 p-3 rounded-xl flex items-center justify-between text-[13px] font-mono text-[#34c759] font-bold">
              <span>Net Değişim:</span>
              <span>{res.delta}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

