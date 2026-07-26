import {
  Pulse,
  Cpu,
  HardDrive,
  Info,
  Stack,
  Monitor,
  ArrowsClockwise,
  Shield,
  Laptop
} from '@phosphor-icons/react';
import { motion } from 'motion/react';
import { memo, useEffect, useState } from 'react';
import { getHardwareSpecs, getSystemMetrics } from '../../services/SystemEngine';
import { HardwareSpecs, SystemMetricsResponse } from '../../types';

export const MySystemCategory = memo(function MySystemCategory() {
  const [specs, setSpecs] = useState<HardwareSpecs | null>(null);
  const [metrics, setMetrics] = useState<SystemMetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [hSpecs, sMetrics] = await Promise.all([
        getHardwareSpecs(),
        getSystemMetrics()
      ]);
      setSpecs(hSpecs);
      if (sMetrics.success) setMetrics(sMetrics);
    } catch (e) {
      console.error('Failed to load system specs:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleManualRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const glassCardClasses = "bg-[#161619]/60 backdrop-blur-3xl border border-white/[0.08] rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden group transition-all duration-500 hover:bg-[#161619]/80";
  
  const getIconBoxStyles = (colorType: 'blue' | 'cyan' | 'green' | 'purple' | 'orange' | 'white') => {
    const baseClasses = "w-10 h-10 rounded-xl flex items-center justify-center border mb-4 group-hover:scale-110 transition-transform duration-500";
    switch (colorType) {
      case 'cyan': return `${baseClasses} bg-[#64d2ff]/10 text-[#64d2ff] border-[#64d2ff]/20 shadow-[0_0_15px_rgba(100,210,255,0.15)]`;
      case 'green': return `${baseClasses} bg-[#34c759]/10 text-[#34c759] border-[#34c759]/20 shadow-[0_0_15px_rgba(52,199,89,0.15)]`;
      case 'purple': return `${baseClasses} bg-purple-400/10 text-purple-400 border-purple-400/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]`;
      case 'orange': return `${baseClasses} bg-orange-400/10 text-orange-400 border-orange-400/20 shadow-[0_0_15px_rgba(251,146,60,0.15)]`;
      case 'white': return `${baseClasses} bg-white/5 text-white/80 border-white/10`;
      case 'blue':
      default:
        return `${baseClasses} bg-[#1a5efd]/10 text-[#1a5efd] border-[#1a5efd]/20 shadow-[0_0_15px_rgba(26,94,253,0.15)]`;
    }
  };

  if (loading) {
    return (
      <div className="p-8 w-full h-full flex flex-col items-center justify-center text-center">
        <ArrowsClockwise size={32} weight="duotone" className="animate-spin text-[#1a5efd] mb-4" />
        <p className="text-[#a1a1a6] text-[14px]">Donanım ve cihaz bilgileri yükleniyor...</p>
      </div>
    );
  }

  if (specs === null && loading === false) {
    return (
      <div className="p-8 w-full h-full flex flex-col items-center justify-center text-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md w-full backdrop-blur-md">
          <Shield size={48} weight="duotone" className="text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Donanım Bilgisi Alınamadı</h2>
          <p className="text-[#a1a1a6] text-sm mb-6">Sistem donanım özelliklerini okurken bir hata oluştu. Lütfen tekrar deneyin veya sistem izinlerini kontrol edin.</p>
          <button
            onClick={handleManualRefresh}
            className="px-6 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors w-full"
          >
            Yeniden Dene
          </button>
        </div>
      </div>
    );
  }

  const osData = metrics?.data;

  return (
    <div className="p-6 w-full h-full flex flex-col overflow-y-auto custom-scrollbar" style={{ WebkitAppRegion: 'no-drag' }}>
      {/* Header Banner - MacOS Sequoia Style */}
      <div className="flex items-center justify-between mb-8 bg-[#161619]/60 backdrop-blur-3xl border border-white/[0.08] rounded-[24px] p-8 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#1a5efd]/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#64d2ff]/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="flex items-center space-x-5 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1a5efd] to-[#64d2ff] p-[1px] shadow-[0_0_20px_rgba(26,94,253,0.3)]">
            <div className="w-full h-full bg-[#161619] rounded-2xl flex items-center justify-center">
              <Pulse size={28} weight="duotone" className="text-[#64d2ff]" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <span>Sistemim</span>
              <span className="px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-[#64d2ff] text-[13px] font-medium tracking-wide">
                {osData?.osRelease || 'Windows'}
              </span>
            </h1>
            <p className="text-[#a1a1a6] text-[14px] mt-1.5 font-medium">
              Cihazınızın donanım özellikleri ve anlık kaynak kullanımları
            </p>
          </div>
        </div>

        <button
          onClick={handleManualRefresh}
          disabled={refreshing}
          className="relative z-10 px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-white text-[14px] font-medium transition-all duration-300 flex items-center space-x-2 active:scale-95 shadow-lg"
        >
          <ArrowsClockwise size={16} weight="duotone" className={`text-[#64d2ff] ${refreshing ? 'animate-spin' : ''}`} />
          <span>Yenile</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
        
        {/* Operating System Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={glassCardClasses}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
          <div className={getIconBoxStyles('blue')}>
            <Laptop size={20} weight="duotone" />
          </div>
          <h3 className="text-white font-semibold text-[16px] mb-5">İşletim Sistemi</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-white/[0.04] pb-3">
              <span className="text-[#a1a1a6] text-[13px]">Sürüm</span>
              <span className="text-white text-[13px] font-semibold truncate max-w-[150px]">{osData?.osRelease || 'Windows'}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/[0.04] pb-3">
              <span className="text-[#a1a1a6] text-[13px]">Platform</span>
              <span className="text-white text-[13px] font-semibold">{osData?.platform || 'Windows'} ({osData?.arch || 'x64'})</span>
            </div>
            <div className="flex justify-between items-center pb-1">
              <span className="text-[#a1a1a6] text-[13px]">Çalışma Süresi</span>
              <span className="text-white text-[13px] font-semibold">{osData ? Math.floor(osData.osUptimeSeconds / 3600) : 0} Saat {osData ? Math.floor((osData.osUptimeSeconds % 3600) / 60) : 0} Dk</span>
            </div>
          </div>
        </motion.div>

        {/* CPU Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={glassCardClasses}
        >
          <div className={getIconBoxStyles('blue')}>
            <Cpu size={20} weight="duotone" />
          </div>
          <h3 className="text-white font-semibold text-[16px] mb-5">İşlemci (CPU)</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-start flex-col gap-1 border-b border-white/[0.04] pb-3">
              <span className="text-[#a1a1a6] text-[13px]">Model</span>
              <span className="text-white text-[14px] font-semibold line-clamp-2 leading-snug">
                {specs?.cpu?.model || 'Bilinmiyor'}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-white/[0.04] pb-3">
              <span className="text-[#a1a1a6] text-[13px]">Çekirdekler</span>
              <span className="text-white text-[13px] font-semibold">{specs?.cpu?.cores || 0} Core / {specs?.cpu?.threads || 0} Thread</span>
            </div>
            <div className="flex justify-between items-center pb-1">
              <span className="text-[#a1a1a6] text-[13px]">Frekans</span>
              <span className="text-[#64d2ff] text-[13px] font-bold">{specs?.cpu?.speed || 'Bilinmiyor'}</span>
            </div>
          </div>
        </motion.div>

        {/* GPU Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={glassCardClasses}
        >
          <div className={getIconBoxStyles('cyan')}>
            <Monitor size={20} weight="duotone" />
          </div>
          <h3 className="text-white font-semibold text-[16px] mb-5">Ekran Kartı (GPU)</h3>
          <div className="space-y-4">
            {specs?.gpu && specs.gpu.length > 0 ? (
              specs.gpu.map((g, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex justify-between items-start flex-col gap-1 border-b border-white/[0.04] pb-3">
                    <span className="text-[#a1a1a6] text-[13px]">Model</span>
                    <span className="text-white text-[14px] font-semibold line-clamp-2 leading-snug">
                      {g.name || 'Bilinmiyor'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/[0.04] pb-3">
                    <span className="text-[#a1a1a6] text-[13px]">VRAM Kapasitesi</span>
                    <span className="text-white text-[13px] font-semibold">{g.memory || 'Bilinmiyor'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-[#a1a1a6] text-[13px]">Sürücü Sürümü</span>
                    <span className="text-[#34c759] text-[13px] font-bold">{g.driver || 'Bilinmiyor'}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-[#a1a1a6] text-[13px]">GPU bilgisi alınamadı</div>
            )}
          </div>
        </motion.div>

        {/* RAM Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={glassCardClasses}
        >
          <div className={getIconBoxStyles('green')}>
            <Stack size={20} weight="duotone" />
          </div>
          <h3 className="text-white font-semibold text-[16px] mb-5">Sistem Belleği (RAM)</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-white/[0.04] pb-3">
              <span className="text-[#a1a1a6] text-[13px]">Toplam Kapasite</span>
              <span className="text-[#1a5efd] text-[15px] font-bold">{specs?.ram?.total || 'Bilinmiyor'}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/[0.04] pb-3">
              <span className="text-[#a1a1a6] text-[13px]">Bellek Frekansı</span>
              <span className="text-white text-[13px] font-semibold">{specs?.ram?.speed || 'Bilinmiyor'}</span>
            </div>
            <div className="flex justify-between items-center pb-1">
              <span className="text-[#a1a1a6] text-[13px]">Boş Alan</span>
              <span className="text-[#34c759] text-[13px] font-bold">{specs?.ram?.free || 'Bilinmiyor'}</span>
            </div>
          </div>
        </motion.div>

        {/* Storage Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={glassCardClasses}
        >
          <div className={getIconBoxStyles('white')}>
            <HardDrive size={20} weight="duotone" />
          </div>
          <h3 className="text-white font-semibold text-[16px] mb-5">Depolama (SSD/HDD)</h3>
          <div className="space-y-3 max-h-[160px] overflow-y-auto custom-scrollbar pr-2">
            {specs?.storage && specs.storage.length > 0 ? (
              specs.storage.map((d, idx) => (
                <div key={idx} className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.05] hover:bg-white/[0.06] transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-white text-[13px] font-semibold truncate max-w-[150px]" title={d.model || `Sürücü ${idx + 1}`}>
                      {d.model || `Sürücü ${idx + 1}`}
                    </span>
                    <span className="text-[#64d2ff] text-[12px] font-bold shrink-0">{d.size || 'Bilinmiyor'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#a1a1a6] text-[12px]">{d.type || 'Disk'}</span>
                    <span className="text-[#a1a1a6] text-[12px] truncate max-w-[80px]">{d.interface || 'SATA/NVMe'}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-[#a1a1a6] text-[13px]">Disk bilgisi alınamadı</div>
            )}
          </div>
        </motion.div>

        {/* Motherboard & BIOS Info (Spans 2 cols) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className={`${glassCardClasses} lg:col-span-2`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Motherboard */}
            <div>
              <div className={getIconBoxStyles('purple')}>
                <Shield size={20} weight="duotone" />
              </div>
              <h3 className="text-white font-semibold text-[16px] mb-5">Anakart (Motherboard)</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/[0.04] pb-3">
                  <span className="text-[#a1a1a6] text-[13px]">Üretici</span>
                  <span className="text-white text-[13px] font-semibold">{specs?.motherboard?.manufacturer || 'Bilinmiyor'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/[0.04] pb-3">
                  <span className="text-[#a1a1a6] text-[13px]">Model</span>
                  <span className="text-white text-[13px] font-semibold truncate max-w-[160px]">{specs?.motherboard?.product || 'Bilinmiyor'}</span>
                </div>
                <div className="flex justify-between items-center pb-1">
                  <span className="text-[#a1a1a6] text-[13px]">Versiyon</span>
                  <span className="text-white text-[13px] font-semibold">{specs?.motherboard?.version || 'Bilinmiyor'}</span>
                </div>
              </div>
            </div>

            {/* BIOS */}
            <div>
              <div className={getIconBoxStyles('orange')}>
                <Info size={20} weight="duotone" />
              </div>
              <h3 className="text-white font-semibold text-[16px] mb-5">BIOS Bilgileri</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/[0.04] pb-3">
                  <span className="text-[#a1a1a6] text-[13px]">Üretici</span>
                  <span className="text-white text-[13px] font-semibold truncate max-w-[150px]">{specs?.bios?.manufacturer || 'Bilinmiyor'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/[0.04] pb-3">
                  <span className="text-[#a1a1a6] text-[13px]">Versiyon</span>
                  <span className="text-white text-[13px] font-semibold">{specs?.bios?.version || 'Güncel'}</span>
                </div>
                <div className="flex justify-between items-center pb-1">
                  <span className="text-[#a1a1a6] text-[13px]">Güvenlik</span>
                  <span className="text-[#34c759] text-[12px] font-bold bg-[#34c759]/15 border border-[#34c759]/30 px-2.5 py-1 rounded-full">
                    {specs?.bios?.tpm || 'Secure Boot / TPM'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
});
