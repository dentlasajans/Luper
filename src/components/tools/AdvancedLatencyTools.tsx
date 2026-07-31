
import React, { useState } from 'react';
import { Cpu, Pulse, ArrowLeft } from '@/src/components/ui/Icons';
import { useSettings } from '../../context/SettingsContext';
import { applyOptimization } from '../../services/SystemEngine';
import { toast } from 'sonner';

export const AdvancedLatencyTools = React.memo(function AdvancedLatencyTools({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const { lowQualityMode } = useSettings();
  const [isExecutingIrq, setIsExecutingIrq] = useState(false);
  const [isExecutingHpet, setIsExecutingHpet] = useState(false);

  const applyIrq = async () => {
    setIsExecutingIrq(true);
    try {
      const success = await applyOptimization('irq_gpu_nic', '');
      if (success) toast.success('IRQ Afinitesi başarıyla uygulandı.');
      else toast.error('IRQ uygulaması başarısız oldu.');
    } catch (error: any) {
      toast.error((error as Error).message || 'Bir hata oluştu (IRQ).');
    } finally {
      setIsExecutingIrq(false);
    }
  };

  const applyHpet = async () => {
    setIsExecutingHpet(true);
    try {
      const success = await applyOptimization('hpet_timer', '');
      if (success) toast.success('Timer Resolution ve HPET yapılandırıldı.');
      else toast.error('Zamanlayıcı yapılandırması başarısız oldu.');
    } catch (error: any) {
      toast.error((error as Error).message || 'Bir hata oluştu (HPET).');
    } finally {
      setIsExecutingHpet(false);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col w-full overflow-hidden relative" style={{ WebkitAppRegion: 'no-drag' } as any}>
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8 shrink-0 relative z-10">
        <button
          onClick={() => setActiveTab('tools')}
          className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center hover:bg-white/[0.08] transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} className="text-[#86868b]" />
        </button>
        <div>
          <h1 className="text-[28px] font-bold text-[#f5f5f7] tracking-tight">Gelişmiş Gecikme (Latency)</h1>
          <p className="text-text-muted text-[14px] mt-1">Donanım kesmeleri ve sistem zamanlayıcısı optimizasyonları.</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pr-2 pb-20 relative z-10 space-y-6">
        
        {/* IRQ Card */}
        <div className={`bg-[#1a1a1d] border border-white/[0.06] rounded-2xl p-6 ${lowQualityMode ? '' : 'backdrop-blur-xl'}`}>
          <div className="flex items-start justify-between">
            <div className="flex space-x-4">
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center shrink-0">
                <Cpu size={24} className="text-brand-primary" weight="duotone" />
              </div>
              <div>
                <h3 className="text-[#f5f5f7] font-medium text-[16px] mb-1">Donanım Çekirdek Afinitesi (IRQ)</h3>
                <p className="text-[#86868b] text-[14px] leading-relaxed max-w-xl">
                  Ekran kartı ve Ağ kartının donanım kesmelerini fiziksel çekirdeklere atayarak veri kuyruğu tıkanmalarını önler. 
                  GPU sinyallerini Çekirdek 2'ye, ağ sinyallerini Çekirdek 4'e kilitler.
                </p>
              </div>
            </div>
            <button
              onClick={applyIrq}
              disabled={isExecutingIrq}
              className="px-6 py-2.5 rounded-xl bg-brand-primary text-white font-medium text-[14px] hover:bg-brand-primary/90 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isExecutingIrq ? 'Uygulanıyor...' : 'Aktifleştir'}
            </button>
          </div>
        </div>

        {/* HPET Card */}
        <div className={`bg-[#1a1a1d] border border-white/[0.06] rounded-2xl p-6 ${lowQualityMode ? '' : 'backdrop-blur-xl'}`}>
          <div className="flex items-start justify-between">
            <div className="flex space-x-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                <Pulse size={24} className="text-purple-400" weight="duotone" />
              </div>
              <div>
                <h3 className="text-[#f5f5f7] font-medium text-[16px] mb-1">Sistem Zamanlayıcısı (HPET & Timer)</h3>
                <p className="text-[#86868b] text-[14px] leading-relaxed max-w-xl">
                  Windows iç saatini 0.500ms seviyesine düşürür ve yüksek gecikme yaratan HPET saatini kapatır. 
                  Sıfıra yakın fare tepkisi ve pürüzsüzlük sağlar.
                </p>
              </div>
            </div>
            <button
              onClick={applyHpet}
              disabled={isExecutingHpet}
              className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-medium text-[14px] hover:bg-purple-500 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isExecutingHpet ? 'Uygulanıyor...' : 'Aktifleştir'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
});
