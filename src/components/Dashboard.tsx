import { motion } from 'motion/react';
import { AlertCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useSystemStatus } from '../hooks/useSystemStatus';
import { SystemScoreCard } from './dashboard/SystemScoreCard';
import { CpuCard } from './dashboard/CpuCard';
import { RamCard } from './dashboard/RamCard';
import { StorageCard } from './dashboard/StorageCard';
import { QuickActions } from './dashboard/QuickActions';
import { NetworkFirewallCard } from './dashboard/NetworkFirewallCard';

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
        <p className="text-text-muted text-[15px]">Cihazınızın anlık performans metrikleri ve sağlık skoru.</p>
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
          <SystemScoreCard status={status} isInactive={isInactive} lowQualityMode={lowQualityMode} />
          <CpuCard status={status} isInactive={isInactive} lowQualityMode={lowQualityMode} />
          <RamCard status={status} isInactive={isInactive} lowQualityMode={lowQualityMode} />
          <NetworkFirewallCard status={status} isInactive={isInactive} lowQualityMode={lowQualityMode} />
          <StorageCard status={status} isInactive={isInactive} lowQualityMode={lowQualityMode} />
          <QuickActions lowQualityMode={lowQualityMode} />
        </div>
      </div>
    </div>
  );
}
