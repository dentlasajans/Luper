import { Trash, Wrench, MagnifyingGlass, CheckCircle } from '@/src/components/ui/Icons';
import { memo, useMemo, useState } from 'react';
import { getCleanerItems, executeCleaner } from '../../services/SystemEngine';
import { CleanerItem } from '../../types';
import { motion } from 'motion/react';

export const MaintenanceCenterTools = memo(function MaintenanceCenterTools() {
  const [items, setItems] = useState<(CleanerItem & { selected: boolean })[]>([]);
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'scanned'>('idle');
  const [isCleaning, setIsCleaning] = useState(false);

  const handleScan = async () => {
    setScanState('scanning');
    try {
      const data = await getCleanerItems();
      setItems(data.map((item) => ({ ...item, selected: true })));
    } catch (err) {
      console.error('Failed to load cleaner items:', err);
    } finally {
      setScanState('scanned');
    }
  };

  const totalSelectedSpace = useMemo(() => {
    return items.filter((t) => t.selected).reduce((acc, curr) => acc + curr.sizeBytes, 0);
  }, [items]);

  const toggleTask = (id: string) => {
    setItems((prev) => prev.map((t) => t.id === id ? { ...t, selected: !t.selected } : t));
  };

  const handleRunMaintenance = async () => {
    const selectedIds = items.filter((t) => t.selected).map((t) => t.id);
    if (selectedIds.length === 0) return;
    
    setIsCleaning(true);
    try {
      await executeCleaner(selectedIds);
      // Wait a bit, clear list and return to idle
      setTimeout(() => {
        setItems([]);
        setScanState('idle');
        setIsCleaning(false);
      }, 1500);
    } catch (err) {
      console.error('Failed to execute cleaner:', err);
      setIsCleaning(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="h-full w-full overflow-y-auto p-8 space-y-8 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-3">
            <Wrench weight="duotone" className="text-luper-primary" size={28} />
            <span>Sistem Temizleyici</span>
          </h1>
          <p className="text-sm text-[#86868b] mt-1">Gereksiz dosyaları ve sistem kalıntılarını temizleyerek disk alanı kazanın.</p>
        </div>

        <div className="flex space-x-3">
          {scanState === 'scanned' && (
            <button
              onClick={handleRunMaintenance}
              disabled={isCleaning || items.filter((t) => t.selected).length === 0}
              className="px-5 py-2.5 bg-luper-primary hover:bg-[#2d6bfe] text-white font-bold text-[13.5px] rounded-xl transition-all flex items-center space-x-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              <Trash weight="duotone" size={16} className={isCleaning ? 'animate-spin' : ''} />
              <span>{isCleaning ? 'Temizleniyor...' : 'Seçili Öğeleri Temizle'}</span>
            </button>
          )}
        </div>
      </div>

      {scanState === 'idle' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center bg-luper-surface border border-white/[0.08] rounded-2xl w-full"
        >
          <div className="w-20 h-20 bg-luper-primary/10 rounded-full flex items-center justify-center mb-6">
            <MagnifyingGlass weight="duotone" size={40} className="text-luper-primary" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Sisteminizi Tarayın</h2>
          <p className="text-[#86868b] text-[14px] max-w-md mx-auto mb-8">
            Gereksiz dosyaları, geçici Windows verilerini ve sistem çöplerini bularak ne kadar disk alanı kazanabileceğinizi görün.
          </p>
          <button
            onClick={handleScan}
            className="px-8 py-3.5 bg-luper-primary hover:bg-[#2d6bfe] text-white font-bold text-[15px] rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center space-x-2"
          >
            <MagnifyingGlass weight="bold" size={18} />
            <span>Taramayı Başlat</span>
          </button>
        </motion.div>
      )}

      {scanState === 'scanning' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center bg-luper-surface border border-white/[0.08] rounded-2xl w-full"
        >
          <div className="w-16 h-16 border-4 border-luper-primary/30 border-t-[#1a5efd] rounded-full animate-spin mb-6"></div>
          <h3 className="text-[16px] font-bold text-white mb-1">Sistem Taranıyor...</h3>
          <p className="text-[13px] text-[#86868b]">Kayıt defteri, geçici dosyalar ve gereksiz veriler analiz ediliyor.</p>
        </motion.div>
      )}

      {scanState === 'scanned' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Space Summary Bar */}
          <div className="flex items-center justify-between bg-luper-surface border border-white/[0.08] p-4 rounded-2xl luper-card">
            <div className="flex items-center space-x-3 text-[14px] text-[#86868b]">
              <CheckCircle weight="fill" size={20} className="text-[#34c759]" />
              <span>Tarama tamamlandı. Seçilen öğeler sisteminizden tamamen kaldırılacaktır.</span>
            </div>
            <div className="flex items-center space-x-2 text-[13px] font-mono">
              <span className="text-[#86868b]">Kazanılacak Alan:</span>
              <span className="text-xl font-bold text-[#34c759]">{formatBytes(totalSelectedSpace)}</span>
            </div>
          </div>

          {/* Maintenance Tasks List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#86868b] px-1">Temizlenebilecek Öğeler</h3>
            
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-luper-surface border border-white/[0.08] rounded-2xl w-full">
                <h3 className="text-[14px] font-bold text-white mb-1">Harika! Sisteminiz Temiz</h3>
                <p className="text-[12.5px] text-[#86868b]">Temizlenecek herhangi bir gereksiz dosya bulunamadı.</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleTask(item.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    item.selected
                      ? 'bg-luper-primary/10 border-luper-primary'
                      : 'bg-luper-surface border-white/[0.08] hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={item.selected}
                      readOnly
                      className="w-5 h-5 accent-[#1a5efd] rounded cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-white font-bold text-[14.5px]">{item.name}</h4>
                      </div>
                      <p className="text-[12px] text-[#86868b] mt-0.5">{item.description}</p>
                    </div>
                  </div>

                  <div className="text-right font-mono text-[13px]">
                    <div className="text-[#34c759] font-bold">{formatBytes(item.sizeBytes)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
});

