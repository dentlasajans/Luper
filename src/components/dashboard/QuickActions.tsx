import { FileMinus, Globe, Trash, Lightning } from '@/src/components/ui/Icons';
import { LuperButton } from '../ui/LuperButton';
import React, { useCallback, useState } from 'react';
import { executeQuickAction } from '../../services/SystemEngine';
import { deepEqual } from '../../utils/equals';

interface Props {
  lowQualityMode: boolean;
}

export const QuickActions = React.memo(({ lowQualityMode }: Props) => {
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  const [successAction, setSuccessAction] = useState<string | null>(null);

  const handleQuickAction = useCallback(async (actionId: string) => {
    if (processingAction || successAction) return;
    setProcessingAction(actionId);
    try {
      await executeQuickAction(actionId);
      setProcessingAction(null);
      setSuccessAction(actionId);
      setTimeout(() => setSuccessAction(null), 2000);
    } catch (err: any) {
      setProcessingAction(null);
    }
  }, [processingAction, successAction]);

  return (
    <div style={{ transform: 'translateZ(0)', willChange: 'transform, opacity', contain: 'layout style' }} className={`flex flex-col justify-between w-full h-full bg-[#1a1a1d] ${lowQualityMode ? '' : ''} border border-white/[0.08] rounded-xl p-7 transition-colors duration-500 hover:bg-[#1a1a1d] hover:border-white/[0.12]`}> 
      <div className="flex items-center justify-between mb-7">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#1a1a1d] border border-white/[0.06] flex items-center justify-center transition-all duration-300">
            <Lightning size={20} weight="duotone" className="text-[#86868b] transition-all duration-300" />
          </div>
          <h3 className="text-[#f5f5f7] font-semibold tracking-tight text-[16px]">Hizli Islemler</h3>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-4 h-full">
        <LuperButton
          variant="card"
          status={processingAction === 'flush-dns' ? 'loading' : successAction === 'flush-dns' ? 'success' : 'idle'}
          onClick={() => handleQuickAction('flush-dns')}
          icon={<Globe size={18} weight="duotone" />}
        >
          <span className="text-[#f5f5f7] text-[14px] font-semibold tracking-tight mt-1">DNS Temizle</span>
          <span className="text-text-muted text-[12px] font-medium tracking-tight mt-1 text-center">Ag önbellegini sifirla</span>
        </LuperButton>
        
        <LuperButton
          variant="card"
          status={processingAction === 'clean-junk' ? 'loading' : successAction === 'clean-junk' ? 'success' : 'idle'}
          onClick={() => handleQuickAction('clean-junk')}
          icon={<Trash size={18} weight="duotone" />}
        >
          <span className="text-[#f5f5f7] text-[14px] font-semibold tracking-tight mt-1">Çöp Dosyalar</span>
          <span className="text-text-muted text-[12px] font-medium tracking-tight mt-1 text-center">Gereksiz verileri sil</span>
        </LuperButton>
        
        <LuperButton
          variant="card"
          status={processingAction === 'clean-temp' ? 'loading' : successAction === 'clean-temp' ? 'success' : 'idle'}
          onClick={() => handleQuickAction('clean-temp')}
          icon={<FileMinus size={18} weight="duotone" />}
        >
          <span className="text-[#f5f5f7] text-[14px] font-semibold tracking-tight mt-1">Geçici Dosyalar</span>
          <span className="text-text-muted text-[12px] font-medium tracking-tight mt-1 text-center">Temp klasörünü bosalt</span>
        </LuperButton>

        <LuperButton
          variant="card"
          status={processingAction === 'optimize-ram' ? 'loading' : successAction === 'optimize-ram' ? 'success' : 'idle'}
          onClick={() => handleQuickAction('optimize-ram')}
          icon={<Lightning size={18} weight="duotone" />}
        >
          <span className="text-[#f5f5f7] text-[14px] font-semibold tracking-tight mt-1">Bellek Optimize</span>
          <span className="text-text-muted text-[12px] font-medium tracking-tight mt-1 text-center">RAM kullanimini azalt</span>
        </LuperButton>
      </div>
    </div>
  );
}, deepEqual);
