import { WarningCircle, Warning, Check, Power, ArrowsClockwise, Terminal, User as UserIcon, X } from '@/src/components/ui/Icons';
import { AnimatePresence, motion } from 'motion/react';
import { memo, useCallback, useEffect, useState } from 'react';
import { getStartupItems, toggleStartupItem } from '../../services/SystemEngine';
import { StartupItem } from '../../types';
import { LuperToggle } from '../ui/LuperToggle';

interface StartupAppCardProps {
  item: StartupItem;
  idx: number;
  processingState: Record<string, string>;
  handleToggle: (item: StartupItem) => void;
}

const StartupAppCard = memo(({ item, idx, processingState, handleToggle }: StartupAppCardProps) => {
  const itemId = item.name + item.location;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.15) }}
      className="bg-[#161618]/60 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 flex items-center group hover:bg-[#161618]/80 hover:border-white/[0.15] transition-all shadow-lg"
    >
      <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.04] flex items-center justify-center shrink-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)]">
        <Power weight="duotone" size={20} className={item.enabled ? 'text-brand-primary' : 'text-text-muted opacity-50'} />
      </div>
      
      <div className="flex-1 min-w-0 ml-4">
        <h3 className={`text-[16px] font-medium leading-snug truncate transition-colors ${item.enabled ? 'text-[#f5f5f7]' : 'text-text-muted opacity-60'}`}>
          {item.name}
        </h3>
        
        <div className="flex items-center mt-1.5 space-x-4">
          <div className="flex items-center space-x-1.5 opacity-60">
            <Terminal weight="duotone" size={12} className="text-text-muted shrink-0" />
            <p className="text-text-muted text-[12px] truncate max-w-[280px]" title={item.command}>
              {item.command || 'Bilinmeyen komut'}
            </p>
          </div>
          {item.user && (
            <div className="flex items-center space-x-1.5 opacity-60 hidden sm:flex">
              <UserIcon size={12} className="text-text-muted shrink-0" />
              <span className="text-text-muted text-[12px]">{item.user}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="shrink-0 ml-4 flex items-center space-x-3">
        <span className={`text-[12px] font-medium ${item.enabled ? 'text-brand-primary' : 'text-text-muted'} hidden sm:block`}>
          {item.enabled ? 'Etkin' : 'Devre Disi'}
        </span>
        <LuperToggle
          checked={item.enabled}
          onChange={() => handleToggle(item)}
          disabled={!!processingState[itemId]}
          isProcessing={processingState[itemId] === 'processing'}
          isSuccess={processingState[itemId] === 'success'}
        />
      </div>
    </motion.div>
  );
});

export function StartupTools() {
  const [items, setItems] = useState<StartupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [processingState, setProcessingState] = useState<Record<string, 'processing' | 'success'>>({});
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStartupItems();
      setItems(data);
    } catch (err: any) {
      console.error("Startup fetch error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [retryCount]);

  useEffect(() => {
    
    fetchItems();
    
  }, [fetchItems]);

  const handleToggle = useCallback(async (item: StartupItem) => {
    const itemId = item.name + item.location;
    setProcessingState((prev) => ({ ...prev, [itemId]: 'processing' }));
    
    try {
      await toggleStartupItem(item);
      setProcessingState((prev) => ({ ...prev, [itemId]: 'success' }));
      
      // Update local state for optimistic UI
      setItems((prev) => prev.map((i) => 
        (i.name === item.name && i.location === item.location) 
          ? { ...i, enabled: !i.enabled } 
          : i
      ));
      
      setTimeout(() => {
        setProcessingState((prev) => {
          const newState = { ...prev };
          delete newState[itemId];
          return newState;
        });
      }, 1000);
      
    } catch (err: any) {
      console.error('Toggle error:', err);
      setToastMessage({ type: 'error', message: (err as Error).message || 'Islem basarisiz.' });
      setTimeout(() => setToastMessage(null), 3000);
      
      setProcessingState((prev) => {
        const newState = { ...prev };
        delete newState[itemId];
        return newState;
      });
    }
  }, []);

  return (
    <div className="p-8 w-full h-full flex flex-col relative" style={{ WebkitAppRegion: 'no-drag' } as any}>
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center p-4 rounded-2xl border shadow-2xl min-w-[320px] max-w-lg ${
              toastMessage.type === 'error' 
                ? 'bg-[#161618] border-[#e57373]/30 text-[#e57373]' 
                : 'bg-[#161618] border-luper-success/30 text-luper-success'
            }`}
          >
            <div className={`p-2 rounded-xl shrink-0 mr-4 ${toastMessage.type === 'error' ? 'bg-[#e57373]/10' : 'bg-luper-success/10'}`}>
              {toastMessage.type === 'error' ? <WarningCircle weight="duotone" size={20} /> : <Check weight="duotone" size={20} />}
            </div>
            <p className="flex-1 text-[14px] font-medium leading-snug text-[#f5f5f7]">
              {toastMessage.message}
            </p>
            <button 
              onClick={() => setToastMessage(null)}
              className="ml-4 p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/10 transition-colors shrink-0"
            >
              <X weight="duotone" size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 flex flex-col min-h-0"
      >
        <div className="flex flex-col mb-8 pt-1 shrink-0">
          <h1 className="text-[32px] font-bold text-[#f5f5f7] tracking-tight leading-snug mb-2">Baslangiç Uygulamalari</h1>
          <p className="text-text-muted/90 text-[14px] mt-2 leading-relaxed max-w-3xl">
            Sistem baslatildiginda otomatik olarak çalisan uygulamalari yönetin. Gereksiz programlari devre disi birakarak açilis süresini hizlandirabilirsiniz.
          </p>
        </div>

        <div className="flex-1 flex flex-col min-h-0 relative">
          {loading ? (
            <div className="flex-1 flex flex-col space-y-3 overflow-y-auto pr-2 pb-4">
              {[1, 2, 3, 4, 5].map((idx) => (
                <div key={idx} className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4 flex items-center justify-between h-[84px] animate-pulse">
                  <div className="flex items-center space-x-4 w-full">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.03] shrink-0"></div>
                    <div className="flex-1 max-w-md">
                      <div className="h-4 w-1/3 bg-white/[0.03] rounded-lg mb-2.5"></div>
                      <div className="h-3 w-2/3 bg-white/[0.03] rounded-lg"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center bg-white/[0.04] border border-[#e57373]/30 rounded-3xl p-10 max-w-md">
                <Warning weight="duotone" size={36} className="text-[#e57373] mx-auto mb-5 opacity-80" />
                <h3 className="text-[#f5f5f7] text-[16px] font-medium leading-tight mb-3">Sistem Verisi Alinamadi</h3>
                <p className="text-[#e57373]/90 text-[14px] font-normal leading-relaxed max-w-sm mb-6 mx-auto">
                  {error.message}
                </p>
                <button 
                  onClick={() => setRetryCount((prev) => prev + 1)}
                  className="flex items-center space-x-2 mx-auto px-5 py-2.5 bg-white/[0.05] hover:bg-white/[0.08] text-white rounded-xl border border-white/[0.05] hover:border-white/[0.1] transition-all"
                >
                  <ArrowsClockwise weight="duotone" size={14} className="text-text-muted" />
                  <span className="text-[14px] font-medium">Yeniden Dene</span>
                </button>
              </div>
            </div>
          ) : items && items.length > 0 ? (
            <div className="flex-1 flex flex-col space-y-3 overflow-y-auto pr-2 pb-4 custom-scrollbar">
              {items.map((item, idx) => (
                <StartupAppCard 
                  key={idx} 
                  item={item} 
                  idx={idx} 
                  processingState={processingState} 
                  handleToggle={handleToggle} 
                />
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center bg-white/[0.04] border border-white/[0.08] rounded-3xl p-10 max-w-md">
                <motion.div 
                  animate={{ scale: [1, 1.05, 1] }} 
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Power weight="duotone" size={36} className="text-text-muted mx-auto mb-5 opacity-60" />
                </motion.div>
                <h3 className="text-[#f5f5f7] text-[16px] font-medium leading-tight mb-3">Baslangiç Ögesi Bulunamadi</h3>
                <p className="text-text-muted text-[14px] font-normal leading-relaxed max-w-sm mx-auto">
                  Sisteminizde yapilandirilmis herhangi bir baslangiç ögesi bulunamadi.
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}


