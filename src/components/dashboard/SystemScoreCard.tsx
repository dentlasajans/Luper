import React, { useState, useEffect } from 'react';
import { ShieldCheck, Activity, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { SystemStatus } from '../../types';
import { getTotalOptimizationSettingsCount } from '../../services/FirebaseService';

interface Props {
  status: SystemStatus | null;
  isInactive: boolean;
  lowQualityMode: boolean;
}

export const SystemScoreCard = React.memo(({ isInactive, lowQualityMode }: Props) => {
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
    };

    window.addEventListener('applied_optimizations_changed', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('applied_optimizations_changed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Total count of all optimization codes across all categories in Firebase
  const totalCount = getTotalOptimizationSettingsCount();

  // Score scaled 0 to 100 based strictly on applied optimization codes ratio
  const score = totalCount > 0 ? Math.min(100, Math.round((appliedCount / totalCount) * 100)) : 0;

  const getScoreBadge = (s: number) => {
    if (s >= 80) return { label: 'Maksimum Performans', color: 'text-brand-primary', bg: 'bg-brand-primary/10 border-brand-primary/20', icon: CheckCircle2 };
    if (s >= 50) return { label: 'Yüksek Performans', color: 'text-[#81c784]', bg: 'bg-[#81c784]/10 border-[#81c784]/20', icon: ShieldCheck };
    if (s > 0) return { label: 'Temel Optimizasyon', color: 'text-[#ffb74d]', bg: 'bg-[#ffb74d]/10 border-[#ffb74d]/20', icon: Activity };
    return { label: 'Optimizasyon Yapılmadı', color: 'text-[#ff5f56]', bg: 'bg-[#ff5f56]/10 border-[#ff5f56]/20', icon: AlertTriangle };
  };

  const badge = getScoreBadge(score);
  const BadgeIcon = badge.icon;

  // SVG Circle calculations for radial meter
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`col-span-1 md:col-span-2 lg:col-span-3 bg-white/[0.06] ${lowQualityMode ? '' : 'backdrop-blur-xl'} border border-white/[0.08] border-t-white/[0.12] rounded-3xl p-7 transition-all duration-500 relative overflow-hidden group ${isInactive ? 'opacity-60 grayscale-[50%]' : 'hover:bg-white/[0.08] hover:border-white/[0.12]'}`}>
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-brand-primary/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-brand-primary/15 transition-all duration-700" />
      <div className="absolute right-0 top-0 w-64 h-64 bg-[#407eff]/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="flex items-center space-x-7 relative z-10">
        {/* Circular Score Meter */}
        <div className="relative shrink-0 flex items-center justify-center w-28 h-28">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="stroke-white/[0.06]"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress */}
            <motion.circle
              cx="50"
              cy="50"
              r={radius}
              className="stroke-brand-primary shadow-[0_0_15px_rgba(26,94,253,0.5)]"
              strokeWidth="8"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-semibold text-white tracking-tight leading-none font-mono">
              {score}
            </span>
            <span className="text-[10px] text-text-muted font-medium mt-1 uppercase tracking-widest">Puan</span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2 flex-wrap gap-y-2">
            <h2 className="text-xl font-medium text-white tracking-tight">Sistem Optimizasyon Puanı</h2>
            <div className={`px-2.5 py-1 rounded-full border flex items-center space-x-1.5 ${badge.bg}`}>
              <BadgeIcon size={13} className={badge.color} />
              <span className={`text-[11px] font-semibold uppercase tracking-wider ${badge.color}`}>{badge.label}</span>
            </div>
          </div>
          <p className="text-text-muted text-[13px] leading-relaxed max-w-xl">
            Sisteminizdeki optimizasyon ayarlarının aktiflik durumuna göre canlı olarak hesaplanan performans skorudur. Yeni kodlar uygulandıkça skorunuz 100'e yükselir.
          </p>
        </div>
      </div>
    </div>
  );
});
