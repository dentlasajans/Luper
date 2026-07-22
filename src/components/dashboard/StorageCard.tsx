import React from 'react';
import { HardDrive, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { SystemStatus } from '../../types';

interface Props {
  status: SystemStatus | null;
  isInactive: boolean;
  lowQualityMode: boolean;
}

export const StorageCard = React.memo(({ status, isInactive, lowQualityMode }: Props) => {
  return (
    <div className={`col-span-1 md:col-span-2 lg:col-span-3 bg-white/[0.02] ${lowQualityMode ? '' : 'backdrop-blur-xl'} border border-white/[0.08] rounded-2xl p-6 transition-all duration-500 hover:bg-white/[0.05] hover:border-white/[0.10]`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.04] flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)]">
            <HardDrive size={20} className="text-text-muted" />
          </div>
          <h3 className="text-[#f5f5f7] font-medium">Depolama Durumu</h3>
        </div>
      </div>
      
      {!status ? (
        <div className="flex items-center justify-center h-24">
          <Loader2 size={24} className="text-text-muted animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {status?.storage?.drives?.map((drive, i) => (
            <div key={drive.name} className={`flex-1 bg-white/[0.02] ${lowQualityMode ? '' : 'backdrop-blur-xl'} border border-white/[0.08] rounded-xl p-5 transition-all duration-500 flex flex-col justify-center ${isInactive ? 'opacity-60 grayscale-[50%]' : 'hover:bg-white/[0.05] hover:border-white/[0.10]'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-[#f5f5f7] text-[15px] font-medium">{drive.name}</span>
                  <span className="text-[11px] bg-white/[0.05] text-text-muted px-2 py-0.5 rounded-full">{drive.type}</span>
                </div>
                <span className="text-text-muted text-[13px]">{drive.free} GB boş</span>
              </div>
              <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full ${((drive.total - drive.free) / drive.total) * 100 > 80 ? 'bg-gradient-to-r from-[#e57373] to-[#ef5350]' : ((drive.total - drive.free) / drive.total) * 100 > 60 ? 'bg-gradient-to-r from-[#ffb74d] to-[#ffa726]' : 'bg-brand-primary'} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${((drive.total - drive.free) / drive.total) * 100}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.4 + (i * 0.1) }}
                />
              </div>
            </div>
          ))}
          {(!status?.storage?.drives || status.storage.drives.length === 0) && (
            <div className="col-span-full text-center text-text-muted text-[13px] py-4">Sürücü bulunamadı</div>
          )}
        </div>
      )}
    </div>
  );
});
