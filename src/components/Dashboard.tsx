import { motion } from 'motion/react';
import { Network, ShieldCheck, AlertCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useSystemStatus } from '../hooks/useSystemStatus';
import { CpuCard } from './dashboard/CpuCard';
import { RamCard } from './dashboard/RamCard';
import { StorageCard } from './dashboard/StorageCard';
import { QuickActions } from './dashboard/QuickActions';

export function Dashboard() {
  const { lowQualityMode } = useSettings();
  const { status, error } = useSystemStatus();

  const isInactive = !!error || !status;

  return (
    <div className="p-8 max-w-6xl mx-auto h-full flex flex-col" style={{ WebkitAppRegion: 'no-drag' } as any}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-medium tracking-tight text-white mb-2">Sistem Durumu</h1>
        <p className="text-text-muted text-[15px]">Cihazınızın anlık performans metrikleri.</p>
      </motion.div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 p-4 bg-[#ff5f56]/10 border border-[#ff5f56]/20 rounded-2xl flex items-start space-x-3"
        >
          <AlertCircle size={20} className="text-[#ff5f56] mt-0.5 shrink-0" />
          <div>
            <h4 className="text-[#ff5f56] font-medium text-[15px] mb-1">Veri Çekilemedi</h4>
            <p className="text-[#ff5f56]/70 text-[13px] leading-relaxed">
              Sistem verileri Electron IPC üzerinden alınamıyor. Web önizlemesinde olduğunuz veya arka plan servisinin çalışmadığı görülüyor. Geçici arayüz gösteriliyor.
            </p>
          </div>
        </motion.div>
      )}

      <div className="flex-1 overflow-y-auto pr-2 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CpuCard status={status} isInactive={isInactive} lowQualityMode={lowQualityMode} />
          <RamCard status={status} isInactive={isInactive} lowQualityMode={lowQualityMode} />

          <div className={`col-span-1 bg-white/[0.06] ${lowQualityMode ? '' : 'backdrop-blur-xl'} border border-white/[0.08] border-t-white/[0.12] rounded-2xl p-6 transition-all duration-500 relative overflow-hidden group hover:scale-[1.01] ${isInactive ? 'opacity-60 grayscale-[50%]' : 'hover:bg-white/[0.08] hover:border-white/[0.12]'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            
            <div className="flex flex-col h-full relative z-10">
              <div className={`flex-1 bg-white/[0.02] ${lowQualityMode ? '' : 'backdrop-blur-xl'} border border-white/[0.08] rounded-xl p-5 mb-4 transition-all duration-500 flex items-center space-x-4 ${isInactive ? 'opacity-60 grayscale-[50%]' : 'hover:bg-white/[0.05] hover:border-white/[0.10]'}`}>
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.04] flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)]">
                  <Network size={20} className="text-text-muted" />
                </div>
                <div>
                  <h4 className="text-text-muted text-[13px] font-medium mb-1">Ağ Gecikmesi</h4>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-[20px] font-semibold text-white leading-none">{status?.network?.latency || '--'}</span>
                    <span className="text-[11px] text-text-muted">ms</span>
                  </div>
                </div>
              </div>

              <div className={`flex-1 bg-white/[0.02] ${lowQualityMode ? '' : 'backdrop-blur-xl'} border border-white/[0.08] rounded-xl p-5 transition-all duration-500 flex items-center space-x-4 ${isInactive ? 'opacity-60 grayscale-[50%]' : 'hover:bg-white/[0.05] hover:border-white/[0.10]'}`}>
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.04] flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)]">
                  <ShieldCheck size={20} className="text-[#81c784]" />
                </div>
                <div>
                  <h4 className="text-text-muted text-[13px] font-medium mb-1">Güvenlik Duvarı</h4>
                  <span className="text-[15px] font-medium text-white leading-none">
                    {status?.firewall ? 'Aktif' : '--'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <StorageCard status={status} isInactive={isInactive} lowQualityMode={lowQualityMode} />
          <QuickActions lowQualityMode={lowQualityMode} />
        </div>
      </div>
    </div>
  );
}
