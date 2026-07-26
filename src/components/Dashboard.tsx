import { WarningCircle } from '@phosphor-icons/react';
import { motion } from 'motion/react';
import { memo } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useSystemStatus } from '../hooks/useSystemStatus';
import { HeroSection } from './dashboard/HeroSection';
import { QuickActions } from './dashboard/QuickActions';
import { RecommendedOptimizations } from './dashboard/RecommendedOptimizations';
export const Dashboard = memo(function Dashboard() {
  const { lowQualityMode } = useSettings();
  const { error } = useSystemStatus();

  return (
    <div className="p-8 w-full h-full flex flex-col" style={{ WebkitAppRegion: 'no-drag' }}>
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
          className="mb-8 p-4 bg-[#ff453a]/10 border border-[#ff453a]/20 rounded-2xl flex items-start space-x-3"
        >
          <WarningCircle size={20} weight="duotone" className="text-[#ff453a] mt-0.5 shrink-0" />
          <div>
            <h4 className="text-[#ff453a] font-medium text-[15px] tracking-tight mb-1">Sistem Verisi Alınamadı</h4>
            <p className="text-[#ff453a]/80 text-[13px] leading-relaxed">
              Sistem verileri canlı IPC üzerinden yüklenemiyor. Geçici demo verileri gösteriliyor.
            </p>
          </div>
        </motion.div>
      )}

      <div className="flex-1 overflow-y-auto pr-2 pb-8 space-y-8 custom-scrollbar">
        {/* Hero Section with Score Meter */}
        <HeroSection lowQualityMode={lowQualityMode} />

        {/* Quick Actions and Recommended Optimizations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-6">
            <QuickActions lowQualityMode={lowQualityMode} />
          </div>
          <div className="lg:col-span-6 w-full h-full">
            <RecommendedOptimizations lowQualityMode={lowQualityMode} />
          </div>
        </div>
      </div>
    </div>
  );
});
