import React from 'react';
import { Cpu, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { SystemStatus } from '../../types';

interface Props {
  status: SystemStatus | null;
  isInactive: boolean;
  lowQualityMode: boolean;
}

export const CpuCard = React.memo(({ status, isInactive, lowQualityMode }: Props) => {
  const getCpuColor = (usage: number) => {
    if (usage > 70) return 'from-[#e57373] to-[#ef5350]';
    if (usage > 40) return 'from-[#ffb74d] to-[#ffa726]';
    return 'from-brand-primary to-brand-primary/80';
  };

  return (
    <div className={`col-span-1 bg-white/[0.06] ${lowQualityMode ? '' : 'backdrop-blur-xl'} border border-white/[0.08] border-t-white/[0.12] rounded-2xl p-6 transition-all duration-500 relative overflow-hidden group hover:scale-[1.01] ${isInactive ? 'opacity-60 grayscale-[50%]' : 'hover:bg-white/[0.08] hover:border-white/[0.12]'}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-brand-primary/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-brand-primary/10 transition-all duration-700" />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.04] flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)]">
            <Cpu size={20} className="text-text-muted" />
          </div>
          <h3 className="text-[#f5f5f7] font-medium">İşlemci</h3>
        </div>
        {status?.cpuUsage !== null && status?.cpuUsage !== undefined ? (
          <span className="text-[28px] font-semibold tracking-tight text-white">{status.cpuUsage}%</span>
        ) : (
          <div className="w-8 h-8 flex items-center justify-center">
            <Loader2 size={16} className="text-text-muted animate-spin" />
          </div>
        )}
      </div>
      
      {status?.cpuUsage !== null && status?.cpuUsage !== undefined && (
        <div className="relative z-10 mt-2">
          <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
            <motion.div 
              className={`h-full bg-gradient-to-r ${getCpuColor(status.cpuUsage)} rounded-full shadow-[0_0_10px_rgba(26,94,253,0.3)]`}
              initial={{ width: 0 }}
              animate={{ width: `${status.cpuUsage}%` }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      )}
    </div>
  );
});
