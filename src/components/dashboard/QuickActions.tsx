import React, { useState, useCallback } from 'react';
import { Zap, Globe, Trash2, FileMinus, Loader2, Check } from 'lucide-react';
import { executeQuickAction } from '../../services/SystemEngine';

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
    <div className={`col-span-1 md:col-span-2 lg:col-span-3 bg-white/[0.02] ${lowQualityMode ? '' : 'backdrop-blur-xl'} border border-white/[0.08] rounded-2xl p-6 transition-all duration-500 hover:bg-white/[0.05] hover:border-white/[0.10]`}> 
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.04] flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)]">
            <Zap size={20} className="text-text-muted" />
          </div>
          <h3 className="text-[#f5f5f7] font-medium">Hızlı İşlemler</h3>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button onClick={() => handleQuickAction('flush-dns')} className="flex flex-col items-center justify-center p-5 bg-white/[0.02] border border-white/[0.04] rounded-xl hover:bg-white/[0.04] hover:border-brand-primary/15 hover:scale-[1.05] transition-all group focus-visible:ring-2 focus-visible:ring-brand-primary/40 focus-visible:ring-offset-1 focus-visible:ring-offset-[#121214] focus-visible:outline-none">
          <div className={`w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.04] flex items-center justify-center mb-3 group-hover:bg-brand-primary/10 group-hover:border-brand-primary/20 transition-all duration-300 ${successAction === 'flush-dns' ? 'ring-2 ring-[#81c784]/30 ring-offset-1 ring-offset-transparent' : ''}`}>
            {processingAction === 'flush-dns' ? (
              <Loader2 size={20} className="text-brand-primary animate-spin" />
            ) : successAction === 'flush-dns' ? (
              <Check size={20} className="text-[#81c784]" />
            ) : (
              <Globe size={20} className="text-text-muted group-hover:text-brand-primary transition-colors duration-300" />
            )}
          </div>
          <span className="text-[#f5f5f7] text-[13px] font-medium">DNS Temizle</span>
          <span className="text-text-muted text-[11px] mt-1 text-center">Ağ önbelleğini sıfırla</span>
        </button>
        <button onClick={() => handleQuickAction('clean-junk')} className="flex flex-col items-center justify-center p-5 bg-white/[0.02] border border-white/[0.04] rounded-xl hover:bg-white/[0.04] hover:border-brand-primary/15 hover:scale-[1.05] transition-all group focus-visible:ring-2 focus-visible:ring-brand-primary/40 focus-visible:ring-offset-1 focus-visible:ring-offset-[#121214] focus-visible:outline-none">
          <div className={`w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.04] flex items-center justify-center mb-3 group-hover:bg-brand-primary/10 group-hover:border-brand-primary/20 transition-all duration-300 ${successAction === 'clean-junk' ? 'ring-2 ring-[#81c784]/30 ring-offset-1 ring-offset-transparent' : ''}`}>
            {processingAction === 'clean-junk' ? (
              <Loader2 size={20} className="text-brand-primary animate-spin" />
            ) : successAction === 'clean-junk' ? (
              <Check size={20} className="text-[#81c784]" />
            ) : (
              <Trash2 size={20} className="text-text-muted group-hover:text-brand-primary transition-colors duration-300" />
            )}
          </div>
          <span className="text-[#f5f5f7] text-[13px] font-medium">Çöp Dosyalar</span>
          <span className="text-text-muted text-[11px] mt-1 text-center">Gereksiz verileri sil</span>
        </button>
        <button onClick={() => handleQuickAction('clean-temp')} className="flex flex-col items-center justify-center p-5 bg-white/[0.02] border border-white/[0.04] rounded-xl hover:bg-white/[0.04] hover:border-brand-primary/15 hover:scale-[1.05] transition-all group focus-visible:ring-2 focus-visible:ring-brand-primary/40 focus-visible:ring-offset-1 focus-visible:ring-offset-[#121214] focus-visible:outline-none">
          <div className={`w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.04] flex items-center justify-center mb-3 group-hover:bg-brand-primary/10 group-hover:border-brand-primary/20 transition-all duration-300 ${successAction === 'clean-temp' ? 'ring-2 ring-[#81c784]/30 ring-offset-1 ring-offset-transparent' : ''}`}>
            {processingAction === 'clean-temp' ? (
              <Loader2 size={20} className="text-brand-primary animate-spin" />
            ) : successAction === 'clean-temp' ? (
              <Check size={20} className="text-[#81c784]" />
            ) : (
              <FileMinus size={20} className="text-text-muted group-hover:text-brand-primary transition-colors duration-300" />
            )}
          </div>
          <span className="text-[#f5f5f7] text-[13px] font-medium">Geçici Dosyalar</span>
          <span className="text-text-muted text-[11px] mt-1 text-center">Temp klasörünü boşalt</span>
        </button>
        <button onClick={() => handleQuickAction('optimize-ram')} className="flex flex-col items-center justify-center p-5 bg-white/[0.02] border border-white/[0.04] rounded-xl hover:bg-white/[0.04] hover:border-brand-primary/15 hover:scale-[1.05] transition-all group focus-visible:ring-2 focus-visible:ring-brand-primary/40 focus-visible:ring-offset-1 focus-visible:ring-offset-[#121214] focus-visible:outline-none">
          <div className={`w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.04] flex items-center justify-center mb-3 group-hover:bg-brand-primary/10 group-hover:border-brand-primary/20 transition-all duration-300 ${successAction === 'optimize-ram' ? 'ring-2 ring-[#81c784]/30 ring-offset-1 ring-offset-transparent' : ''}`}>
            {processingAction === 'optimize-ram' ? (
              <Loader2 size={20} className="text-brand-primary animate-spin" />
            ) : successAction === 'optimize-ram' ? (
              <Check size={20} className="text-[#81c784]" />
            ) : (
              <Zap size={20} className="text-text-muted group-hover:text-brand-primary transition-colors duration-300" />
            )}
          </div>
          <span className="text-[#f5f5f7] text-[13px] font-medium">Bellek Optimize</span>
          <span className="text-text-muted text-[11px] mt-1 text-center">RAM kullanımını azalt</span>
        </button>
      </div>
    </div>
  );
});
