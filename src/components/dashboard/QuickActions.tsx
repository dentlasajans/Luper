import { Check, FileMinus, Globe, SpinnerGap, Trash, Lightning } from '@phosphor-icons/react';
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
    <div style={{ transform: 'translateZ(0)', willChange: 'transform, opacity', contain: 'layout style' }} className={`flex flex-col justify-between w-full h-full bg-white/[0.02] ${lowQualityMode ? '' : 'backdrop-blur-xl'} border border-white/[0.08] rounded-3xl p-7 transition-colors duration-500 hover:bg-white/[0.03] hover:border-white/[0.12]`}> 
      <div className="flex items-center justify-between mb-7">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center transition-all duration-300">
            <Lightning size={20} weight="duotone" className="text-[#86868b] transition-all duration-300" />
          </div>
          <h3 className="text-[#f5f5f7] font-semibold tracking-tight text-[16px]">Hızlı İşlemler</h3>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-4 h-full">
        <button onClick={() => handleQuickAction('flush-dns')} className="h-full w-full flex flex-col items-center justify-center p-5 bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:bg-white/[0.04] hover:border-brand-primary/25 hover:-translate-y-1 active:scale-95 active:translate-y-0 transition-all duration-300 group focus-visible:ring-2 focus-visible:ring-brand-primary/40 focus-visible:ring-offset-1 focus-visible:ring-offset-[#121214] focus-visible:outline-none">
          <div className={`w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-3 group-hover:bg-brand-primary/10 group-hover:border-brand-primary/20 transition-all duration-300 ${successAction === 'flush-dns' ? 'ring-2 ring-[#81c784]/30 ring-offset-1 ring-offset-transparent' : ''}`}>
            {processingAction === 'flush-dns' ? (
              <SpinnerGap size={18} weight="duotone" className="text-brand-primary animate-spin" />
            ) : successAction === 'flush-dns' ? (
              <Check size={18} weight="duotone" className="text-[#81c784]" />
            ) : (
              <Globe size={18} weight="duotone" className="text-[#86868b] group-hover:text-brand-primary group-hover:scale-105 transition-all duration-300" />
            )}
          </div>
          <span className="text-[#f5f5f7] text-[14px] font-semibold tracking-tight">DNS Temizle</span>
          <span className="text-text-muted text-[12px] font-medium tracking-tight mt-1 text-center">Ağ önbelleğini sıfırla</span>
        </button>
        <button onClick={() => handleQuickAction('clean-junk')} className="h-full w-full flex flex-col items-center justify-center p-5 bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:bg-white/[0.04] hover:border-brand-primary/25 hover:-translate-y-1 active:scale-95 active:translate-y-0 transition-all duration-300 group focus-visible:ring-2 focus-visible:ring-brand-primary/40 focus-visible:ring-offset-1 focus-visible:ring-offset-[#121214] focus-visible:outline-none">
          <div className={`w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-3 group-hover:bg-brand-primary/10 group-hover:border-brand-primary/20 transition-all duration-300 ${successAction === 'clean-junk' ? 'ring-2 ring-[#81c784]/30 ring-offset-1 ring-offset-transparent' : ''}`}>
            {processingAction === 'clean-junk' ? (
              <SpinnerGap size={18} weight="duotone" className="text-brand-primary animate-spin" />
            ) : successAction === 'clean-junk' ? (
              <Check size={18} weight="duotone" className="text-[#81c784]" />
            ) : (
              <Trash size={18} weight="duotone" className="text-[#86868b] group-hover:text-brand-primary group-hover:scale-105 transition-all duration-300" />
            )}
          </div>
          <span className="text-[#f5f5f7] text-[14px] font-semibold tracking-tight">Çöp Dosyalar</span>
          <span className="text-text-muted text-[12px] font-medium tracking-tight mt-1 text-center">Gereksiz verileri sil</span>
        </button>
        <button onClick={() => handleQuickAction('clean-temp')} className="h-full w-full flex flex-col items-center justify-center p-5 bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:bg-white/[0.04] hover:border-brand-primary/25 hover:-translate-y-1 active:scale-95 active:translate-y-0 transition-all duration-300 group focus-visible:ring-2 focus-visible:ring-brand-primary/40 focus-visible:ring-offset-1 focus-visible:ring-offset-[#121214] focus-visible:outline-none">
          <div className={`w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-3 group-hover:bg-brand-primary/10 group-hover:border-brand-primary/20 transition-all duration-300 ${successAction === 'clean-temp' ? 'ring-2 ring-[#81c784]/30 ring-offset-1 ring-offset-transparent' : ''}`}>
            {processingAction === 'clean-temp' ? (
              <SpinnerGap size={18} weight="duotone" className="text-brand-primary animate-spin" />
            ) : successAction === 'clean-temp' ? (
              <Check size={18} weight="duotone" className="text-[#81c784]" />
            ) : (
              <FileMinus size={18} weight="duotone" className="text-[#86868b] group-hover:text-brand-primary group-hover:scale-105 transition-all duration-300" />
            )}
          </div>
          <span className="text-[#f5f5f7] text-[14px] font-semibold tracking-tight">Geçici Dosyalar</span>
          <span className="text-text-muted text-[12px] font-medium tracking-tight mt-1 text-center">Temp klasörünü boşalt</span>
        </button>
        <button onClick={() => handleQuickAction('optimize-ram')} className="h-full w-full flex flex-col items-center justify-center p-5 bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:bg-white/[0.04] hover:border-brand-primary/25 hover:-translate-y-1 active:scale-95 active:translate-y-0 transition-all duration-300 group focus-visible:ring-2 focus-visible:ring-brand-primary/40 focus-visible:ring-offset-1 focus-visible:ring-offset-[#121214] focus-visible:outline-none">
          <div className={`w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-3 group-hover:bg-brand-primary/10 group-hover:border-brand-primary/20 transition-all duration-300 ${successAction === 'optimize-ram' ? 'ring-2 ring-[#81c784]/30 ring-offset-1 ring-offset-transparent' : ''}`}>
            {processingAction === 'optimize-ram' ? (
              <SpinnerGap size={18} weight="duotone" className="text-brand-primary animate-spin" />
            ) : successAction === 'optimize-ram' ? (
              <Check size={18} weight="duotone" className="text-[#81c784]" />
            ) : (
              <Lightning size={18} weight="duotone" className="text-[#86868b] group-hover:text-brand-primary group-hover:scale-105 transition-all duration-300" />
            )}
          </div>
          <span className="text-[#f5f5f7] text-[14px] font-semibold tracking-tight">Bellek Optimize</span>
          <span className="text-text-muted text-[12px] font-medium tracking-tight mt-1 text-center">RAM kullanımını azalt</span>
        </button>
      </div>
    </div>
  );
}, deepEqual);
