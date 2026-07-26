import { onAuthStateChanged } from 'firebase/auth';
import { CheckCircle, ShieldCheck } from '@phosphor-icons/react';
import { motion } from 'motion/react';
import { memo, useEffect, useState } from 'react';
import { auth, getTotalOptimizationSettingsCount } from '../../services/FirebaseService';
import { HealthRing } from './HealthRing';

interface Props {
  lowQualityMode: boolean;
}

export const HeroSection = memo(({ lowQualityMode }: Props) => {
  const [userName, setUserName] = useState('Kullanıcı');
  const [totalCount, setTotalCount] = useState<number>(() => getTotalOptimizationSettingsCount());
  const [appliedCount, setAppliedCount] = useState<number>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('applied_optimizations') || '[]');
      return Array.isArray(stored) ? stored.length : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('applied_optimizations') || '[]');
        setAppliedCount(Array.isArray(stored) ? stored.length : 0);
      } catch {
        setAppliedCount(0);
      }
      setTotalCount(getTotalOptimizationSettingsCount());
    };

    window.addEventListener('applied_optimizations_changed', handleUpdate);
    window.addEventListener('settings_cache_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('applied_optimizations_changed', handleUpdate);
      window.removeEventListener('settings_cache_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || user.email || 'Kullanıcı');
      } else {
        setUserName('Kullanıcı');
      }
    });
    return () => unsubscribe();
  }, []);

  if (totalCount === 0) {
    return (
      <div className={`col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-r from-[#161619] via-[#1a1a20] to-[#121214] border border-white/[0.08] rounded-3xl p-8 min-h-[220px] flex items-center justify-center ${lowQualityMode ? '' : 'backdrop-blur-xl'}`}>
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-[#1a5efd] border-t-transparent rounded-full animate-spin" />
          <span className="text-[#a1a1a6] text-[14px] font-medium animate-pulse">Sistem Verileri Yükleniyor...</span>
        </div>
      </div>
    );
  }

  const score = Math.min(100, Math.round((appliedCount / totalCount) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      style={{ transform: 'translateZ(0)', willChange: 'transform, opacity', contain: 'layout style' }}
      className={`relative col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-r from-[#161619] via-[#1a1a20] to-[#121214] border border-white/[0.08] rounded-3xl p-8 overflow-hidden ${lowQualityMode ? '' : 'backdrop-blur-xl'} luper-card`}
    >
      {/* Background Ambient Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#1a5efd]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Info Column */}
        <div className="flex-1">

          <h1 className="text-[32px] font-bold text-white tracking-tight mb-3">
            Hoş Geldiniz, {userName}
          </h1>

          <p className="text-[#a1a1a6] text-[14px] font-medium tracking-tight leading-relaxed max-w-2xl mb-6">
            Sisteminizin anlık kaynak kullanımı, kayıt defteri optimizasyon seviyesi ve işletim sistemi sağlık puanı canlı olarak izlenmektedir.
          </p>

          {/* Quick Metrics Badges */}
          <div className="flex items-center space-x-3 flex-wrap gap-y-3">
            <div className="flex items-center space-x-2.5 bg-white/[0.03] hover:bg-white/[0.05] transition-all duration-300 border border-white/[0.06] rounded-xl px-4 py-2.5 group cursor-default">
              <CheckCircle size={16} weight="duotone" className="text-[#34c759] group-hover:scale-105 transition-all duration-300" />
              <span className="text-[12px] text-white font-medium tracking-tight">{appliedCount} / {totalCount} Optimizasyon Aktif</span>
            </div>
            <div className="flex items-center space-x-2.5 bg-white/[0.03] hover:bg-white/[0.05] transition-all duration-300 border border-white/[0.06] rounded-xl px-4 py-2.5 group cursor-default">
              <ShieldCheck size={16} weight="duotone" className="text-[#64d2ff] group-hover:scale-105 transition-all duration-300" />
              <span className="text-[12px] text-white font-medium tracking-tight">Güvenli Geri Yükleme Aktif</span>
            </div>
          </div>
        </div>

        {/* Right Health Ring */}
        <div className="shrink-0 flex items-center justify-center p-2 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
          <HealthRing score={score} size={150} />
        </div>
      </div>
    </motion.div>
  );
});
