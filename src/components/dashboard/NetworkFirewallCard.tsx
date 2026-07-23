import React from 'react';
import { Network, ShieldCheck } from 'lucide-react';
import { SystemStatus } from '../../types';

interface Props {
  status: SystemStatus | null;
  isInactive: boolean;
  lowQualityMode: boolean;
}

export const NetworkFirewallCard = React.memo(({ status, isInactive, lowQualityMode }: Props) => {
  return (
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
  );
});
