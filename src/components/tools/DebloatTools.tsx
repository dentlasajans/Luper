import { WarningCircle, Warning, Package, Check, SpinnerGap, Monitor, MagnifyingGlass, Trash, X } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { getCachedInstalledApps, getInstalledApps, uninstallApp } from '../../services/SystemEngine';
import { InstalledApp } from '../../types';

interface DebloatAppCardProps {
  app: InstalledApp;
  processingState: Record<string, string>;
  handleUninstall: (app: InstalledApp) => void;
}

const DebloatAppCard = memo(({ app, processingState, handleUninstall }: DebloatAppCardProps) => {
  const appId = app.id;
  const isUwp = app.type === 'uwp';
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 flex items-center group hover:bg-white/[0.05] hover:border-white/[0.1] transition-all"
    >
      <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.04] flex items-center justify-center shrink-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)]">
        {isUwp ? <Package weight="duotone" size={20} className="text-brand-primary" /> : <Monitor weight="duotone" size={20} className="text-text-muted" />}
      </div>
      
      <div className="flex-1 min-w-0 ml-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-[16px] font-medium text-[#f5f5f7] leading-snug truncate">
            {app.name}
          </h3>
          <span className={`text-[12px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider ${isUwp ? 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary' : 'bg-white/5 border-white/10 text-text-muted'}`}>
            {isUwp ? 'UWP' : 'Masaüstü'}
          </span>
        </div>
        
        <div className="flex items-center mt-1.5 space-x-4 opacity-60">
          <p className="text-text-muted text-[12px] truncate max-w-[200px]" title={app.publisher}>
            {app.publisher || 'Bilinmeyen Yayıncı'}
          </p>
          {app.version && (
            <span className="text-text-muted text-[12px] font-mono hidden sm:inline">
              v{app.version}
            </span>
          )}
        </div>
      </div>

      <div className="shrink-0 ml-4">
        <button
          onClick={() => handleUninstall(app)}
          disabled={processingState[appId] === 'processing'}
          className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-[#ff5f56]/10 hover:text-[#ff5f56] text-text-muted transition-all duration-300 border border-white/[0.04] hover:border-[#ff5f56]/20 focus-visible:ring-2 focus-visible:ring-[#1a5efd] focus-visible:outline-none"
          title="Uygulamayı Kaldır"
        >
          {processingState[appId] === 'processing' ? (
            <SpinnerGap weight="duotone" size={16} className="animate-spin text-[#ff5f56]" />
          ) : processingState[appId] === 'success' ? (
            <Check weight="duotone" size={16} className="text-[#81c784]" />
          ) : (
            <Trash weight="duotone" size={16} />
          )}
        </button>
      </div>
    </motion.div>
  );
});

export function DebloatTools() {
  const cachedData = getCachedInstalledApps();
  const [apps, setApps] = useState<InstalledApp[]>(cachedData ? [...cachedData].sort((a, b) => a.name.localeCompare(b.name)) : []);
  const [loading, setLoading] = useState<boolean>(!cachedData);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [processingState, setProcessingState] = useState<Record<string, 'processing' | 'success'>>({});
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'desktop' | 'uwp'>('all');

  const fetchApps = useCallback(async () => {
    if (!cachedData) setLoading(true);
    setError(null);
    try {
      const data = await getInstalledApps();
      setApps(data.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (err: any) {
      console.error("Apps fetch error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [retryCount, cachedData]);

  useEffect(() => {
    
    fetchApps();
    
  }, [fetchApps]);

  const handleUninstall = useCallback(async (app: InstalledApp) => {
    // Basic confirmation since uninstalling can be destructive
    if (!window.confirm(`${app.name} programını bilgisayarınızdan kaldırmak istediğinize emin misiniz?`)) {
      return;
    }
    
    const appId = app.id;
    setProcessingState(prev => ({ ...prev, [appId]: 'processing' }));
    
    try {
      await uninstallApp(app);
      setProcessingState(prev => ({ ...prev, [appId]: 'success' }));
      
      setToastMessage({ type: 'success', message: `${app.name} başarıyla kaldırıldı veya kaldırma aracı başlatıldı.` });
      
      // Update local state for optimistic UI after a delay to show success
      setTimeout(() => {
        setApps(prev => prev.filter(a => a.id !== appId));
        setProcessingState(prev => {
          const newState = { ...prev };
          delete newState[appId];
          return newState;
        });
      }, 1500);
      
      setTimeout(() => setToastMessage(null), 4000);
      
    } catch (err: any) {
      console.error('Uninstall error:', err);
      setToastMessage({ type: 'error', message: err.message || 'Kaldırma işlemi başarısız.' });
      setTimeout(() => setToastMessage(null), 4000);
      
      setProcessingState(prev => {
        const newState = { ...prev };
        delete newState[appId];
        return newState;
      });
    }
  }, []);

  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (app.publisher && app.publisher.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = filterType === 'all' ? true : app.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [apps, searchQuery, filterType]);

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
                ? 'bg-[#1c1c1e] border-[#e57373]/30 text-[#e57373]' 
                : 'bg-[#1c1c1e] border-[#81c784]/30 text-[#81c784]'
            }`}
          >
            <div className={`p-2 rounded-xl shrink-0 mr-4 ${toastMessage.type === 'error' ? 'bg-[#e57373]/10' : 'bg-[#81c784]/10'}`}>
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
          <h1 className="text-[28px] font-bold text-[#f5f5f7] tracking-tight leading-snug mb-2">Debloat & Uygulamalar</h1>
          <p className="text-text-muted/90 text-[14px] mt-2 leading-relaxed max-w-3xl">
            Bilgisayarınızda yüklü olan masaüstü ve mağaza (UWP) uygulamalarını görüntüleyin ve gereksizleri kaldırarak sisteminizi rahatlatın.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 space-y-4 sm:space-y-0 shrink-0">
          <div className="flex items-center space-x-2 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1 w-full sm:w-auto">
            <button 
              onClick={() => setFilterType('all')} 
              className={`flex-1 sm:flex-none px-4 py-2 text-[14px] font-medium rounded-lg transition-colors ${filterType === 'all' ? 'bg-white/10 text-white' : 'text-text-muted hover:text-[#f5f5f7]'}`}
            >
              Tümü
            </button>
            <button 
              onClick={() => setFilterType('desktop')} 
              className={`flex-1 sm:flex-none px-4 py-2 text-[14px] font-medium rounded-lg transition-colors ${filterType === 'desktop' ? 'bg-white/10 text-white' : 'text-text-muted hover:text-[#f5f5f7]'}`}
            >
              Masaüstü
            </button>
            <button 
              onClick={() => setFilterType('uwp')} 
              className={`flex-1 sm:flex-none px-4 py-2 text-[14px] font-medium rounded-lg transition-colors ${filterType === 'uwp' ? 'bg-white/10 text-white' : 'text-text-muted hover:text-[#f5f5f7]'}`}
            >
              Windows Uygulamaları
            </button>
          </div>

          <div className="relative w-full sm:w-64 shrink-0">
            <MagnifyingGlass weight="duotone" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input 
              type="text" 
              placeholder="Uygulama ara..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl pl-9 pr-4 py-2 text-[14px] text-white placeholder-text-muted/70 focus:outline-none focus:border-brand-primary/50 focus:bg-white/[0.05] transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white"
              >
                <X weight="duotone" size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0 relative">
          {loading ? (
            <div className="flex flex-col space-y-3 overflow-y-auto pr-2 pb-4">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div key={idx} className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4 flex items-center justify-between h-[80px] animate-pulse">
                  <div className="flex items-center space-x-4 w-full">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.03] shrink-0"></div>
                    <div className="flex-1 max-w-md">
                      <div className="h-4 w-1/3 bg-white/[0.03] rounded-lg mb-2.5"></div>
                      <div className="h-3 w-1/4 bg-white/[0.03] rounded-lg"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center bg-white/[0.04] border border-[#e57373]/30 rounded-3xl p-10 max-w-md">
                <Warning weight="duotone" size={36} className="text-[#e57373] mx-auto mb-5 opacity-80" />
                <h3 className="text-[#f5f5f7] text-[16px] font-medium leading-tight mb-3">Uygulamalar Alınamadı</h3>
                <p className="text-[#e57373]/90 text-[14px] font-normal leading-relaxed max-w-sm mb-6 mx-auto">
                  {error.message}
                </p>
                <button 
                  onClick={() => setRetryCount(prev => prev + 1)}
                  className="flex items-center space-x-2 mx-auto px-5 py-2.5 bg-white/[0.05] hover:bg-white/[0.08] text-white rounded-xl border border-white/[0.05] hover:border-white/[0.1] transition-all"
                >
                  <Monitor weight="duotone" size={14} className="text-text-muted" />
                  <span className="text-[14px] font-medium">Yeniden Dene</span>
                </button>
              </div>
            </div>
          ) : filteredApps && filteredApps.length > 0 ? (
            <div className="flex flex-col space-y-3 overflow-y-auto pr-2 pb-4">
              {filteredApps.map((app) => (
                <DebloatAppCard 
                  key={app.id} 
                  app={app} 
                  processingState={processingState} 
                  handleUninstall={handleUninstall} 
                />
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center bg-white/[0.04] border border-white/[0.08] rounded-3xl p-10 max-w-md">
                <Package weight="duotone" size={36} className="text-text-muted mx-auto mb-5 opacity-60" />
                <h3 className="text-[#f5f5f7] text-[16px] font-medium leading-tight mb-3">Uygulama Bulunamadı</h3>
                <p className="text-text-muted text-[14px] font-normal leading-relaxed max-w-sm mx-auto">
                  Arama kriterlerinize uyan bir uygulama bulunamadı veya sisteminizde yüklü program yok.
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

