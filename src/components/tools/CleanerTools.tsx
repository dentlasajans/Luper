import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Loader2, Check, AlertTriangle, AlertCircle, X, Search, FileSymlink, Recycle, Cpu, DownloadCloud, Sparkles } from 'lucide-react';
import { CleanerItem } from '../../types';
import { getCleanerItems, executeCleaner, getCachedCleanerItems } from '../../services/SystemEngine';


const CleanerAppCard = React.memo(({ item, idx, isSelected, processing, toggleSelection, getIconForId, formatSize }: any) => {
  const isZero = item.sizeBytes === 0;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.15) }}
      onClick={() => !processing && toggleSelection(item.id)}
      className={`bg-white/[0.03] border rounded-2xl p-4 flex items-center cursor-pointer transition-all ${
        isSelected 
          ? 'border-brand-primary/40 bg-brand-primary/[0.04]' 
          : 'border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.1]'
      } ${processing ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)] ${
        isSelected 
          ? 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary' 
          : 'bg-white/[0.04] border-white/[0.04] text-text-muted'
      }`}>
        {getIconForId(item.id)}
      </div>
      
      <div className="flex-1 min-w-0 ml-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-medium text-[#f5f5f7] leading-snug truncate">
            {item.name}
          </h3>
          <span className={`text-[13px] font-mono font-semibold ${isZero ? 'text-text-muted/50' : 'text-[#f5f5f7]'}`}>
            {formatSize(item.sizeBytes)}
          </span>
        </div>
        
        <p className="text-text-muted text-[12px] mt-1 line-clamp-1 opacity-70">
          {item.description}
        </p>
      </div>

      <div className="shrink-0 ml-4">
        <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
          isSelected 
            ? 'bg-brand-primary border-brand-primary text-white' 
            : 'border-white/20 bg-white/5'
        }`}>
          {isSelected && <Check size={12} strokeWidth={3} />}
        </div>
      </div>
    </motion.div>
  );
});

export function CleanerTools() {
  const cachedData = getCachedCleanerItems();
  const [items, setItems] = useState<CleanerItem[]>(cachedData || []);
  const [loading, setLoading] = useState<boolean>(!cachedData);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(() => {
    if (cachedData) {
      return new Set(cachedData.filter(i => i.sizeBytes > 0).map(i => i.id));
    }
    return new Set();
  });
  const [processing, setProcessing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchItems = useCallback(async () => {
    if (!cachedData) setLoading(true);
    setError(null);
    try {
      const data = await getCleanerItems();
      setItems(data);
      const toSelect = new Set<string>();
      data.forEach(item => {
        if (item.sizeBytes > 0) toSelect.add(item.id);
      });
      setSelectedItems(toSelect);
    } catch (err: any) {
      console.error("Cleaner fetch error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [retryCount, cachedData]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const toggleSelection = useCallback((id: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const handleClean = async () => {
    if (selectedItems.size === 0) return;
    
    setProcessing(true);
    try {
      const ids = Array.from(selectedItems);
      await executeCleaner(ids);
      
      setToastMessage({ type: 'success', message: 'Seçili öğeler başarıyla temizlendi.' });
      setTimeout(() => setToastMessage(null), 4000);
      
      // Update local state to show 0 size for cleaned items
      setItems(prev => prev.map(item => 
        ids.includes(item.id) ? { ...item, sizeBytes: 0 } : item
      ));
      
      // Deselect cleaned items
      setSelectedItems(new Set());
      
    } catch (err: any) {
      console.error('Clean error:', err);
      setToastMessage({ type: 'error', message: err.message || 'Temizleme işlemi başarısız.' });
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setProcessing(false);
    }
  };

  const formatSize = useCallback((bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const totalSelectedSize = useMemo(() => {
    return Array.from(selectedItems).reduce((total, id) => {
      const item = items.find(i => i.id === id);
      return total + (item ? item.sizeBytes : 0);
    }, 0);
  }, [selectedItems, items]);

  const getIconForId = useCallback((id: string) => {
    switch(id) {
      case 'temp': return <FileSymlink size={20} className="text-[#60a5fa]" />;
      case 'recycle_bin': return <Recycle size={20} className="text-[#a78bfa]" />;
      case 'prefetch': return <Cpu size={20} className="text-[#f472b6]" />;
      case 'windows_update': return <DownloadCloud size={20} className="text-[#fb923c]" />;
      default: return <Trash2 size={20} className="text-text-muted" />;
    }
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto h-full flex flex-col relative" style={{ WebkitAppRegion: 'no-drag' } as any}>
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
                ? 'bg-[#1c1c1e] border-[#e57373]/30 text-[#e57373]' 
                : 'bg-[#1c1c1e] border-[#81c784]/30 text-[#81c784]'
            }`}
          >
            <div className={`p-2 rounded-xl shrink-0 mr-4 ${toastMessage.type === 'error' ? 'bg-[#e57373]/10' : 'bg-[#81c784]/10'}`}>
              {toastMessage.type === 'error' ? <AlertCircle size={20} /> : <Check size={20} />}
            </div>
            <p className="flex-1 text-[14px] font-medium leading-snug text-[#f5f5f7]">
              {toastMessage.message}
            </p>
            <button 
              onClick={() => setToastMessage(null)}
              className="ml-4 p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/10 transition-colors shrink-0"
            >
              <X size={16} />
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
        <div className="flex flex-col mb-8 shrink-0">
          <h1 className="text-[32px] font-semibold leading-tight text-[#f5f5f7] tracking-tight mb-2">Sistem Temizliği</h1>
          <p className="text-text-muted text-[15px] font-normal leading-relaxed max-w-2xl">
            Sisteminizdeki gereksiz geçici dosyaları, kalıntıları ve önbellekleri temizleyerek depolama alanında yer açın ve performansı artırın.
          </p>
        </div>

        <div className="flex-1 flex flex-col min-h-0 relative">
          {loading ? (
            <div className="flex flex-col space-y-3 overflow-y-auto pr-2 pb-4">
              {[1, 2, 3, 4].map((idx) => (
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
                <AlertTriangle size={36} className="text-[#e57373] mx-auto mb-5 opacity-80" />
                <h3 className="text-[#f5f5f7] text-[18px] font-medium leading-tight mb-3">Veriler Alınamadı</h3>
                <p className="text-[#e57373]/90 text-[14px] font-normal leading-relaxed max-w-sm mb-6 mx-auto">
                  {error.message}
                </p>
                <button 
                  onClick={() => setRetryCount(prev => prev + 1)}
                  className="flex items-center space-x-2 mx-auto px-5 py-2.5 bg-white/[0.05] hover:bg-white/[0.08] text-white rounded-xl border border-white/[0.05] hover:border-white/[0.1] transition-all"
                >
                  <Search size={14} className="text-text-muted" />
                  <span className="text-[13px] font-medium">Yeniden Tara</span>
                </button>
              </div>
            </div>
          ) : items && items.length > 0 ? (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto pr-2 pb-4 space-y-3">
                {items.map((item, idx) => (
                  <CleanerAppCard 
                    key={item.id} 
                    item={item} 
                    idx={idx} 
                    isSelected={selectedItems.has(item.id)}
                    processing={processing} 
                    toggleSelection={toggleSelection} 
                    getIconForId={getIconForId}
                    formatSize={formatSize}
                  />
                ))}
              </div>

              {/* Action Bar */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="shrink-0 mt-4 bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-5 flex items-center justify-between shadow-2xl"
              >
                <div>
                  <p className="text-text-muted text-[13px] mb-1">Seçilen Boyut</p>
                  <p className="text-[24px] font-semibold text-white tracking-tight leading-none">
                    {formatSize(totalSelectedSize)}
                  </p>
                </div>

                <button
                  onClick={handleClean}
                  disabled={processing || selectedItems.size === 0}
                  className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl transition-all duration-300 focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:outline-none ${
                    processing 
                      ? 'bg-brand-primary/50 text-white/80 cursor-not-allowed' 
                      : selectedItems.size === 0
                        ? 'bg-white/[0.05] text-text-muted cursor-not-allowed border border-white/5'
                        : 'bg-brand-primary hover:bg-[#336ee6] text-white shadow-[0_0_20px_rgba(26,94,253,0.3)] hover:shadow-[0_0_25px_rgba(26,94,253,0.4)] hover:-translate-y-0.5'
                  }`}
                >
                  {processing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span className="text-[14px] font-medium">Temizleniyor...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      <span className="text-[14px] font-medium">Temizle ({selectedItems.size})</span>
                    </>
                  )}
                </button>
              </motion.div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center bg-white/[0.04] border border-white/[0.08] rounded-3xl p-10 max-w-md">
                <Recycle size={36} className="text-text-muted mx-auto mb-5 opacity-60" />
                <h3 className="text-[#f5f5f7] text-[18px] font-medium leading-tight mb-3">Taranacak Öğe Bulunamadı</h3>
                <p className="text-text-muted text-[14px] font-normal leading-relaxed max-w-sm mx-auto">
                  Sisteminizde temizlenebilecek bir öğe listesi yapılandırılmamış.
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
