import { WarningCircle, Warning, ShieldCheck, Lightning } from '@/src/components/ui/Icons';
import { motion } from 'motion/react';
import React, { useMemo } from 'react';

interface HealthRingProps {
  score: number;
  size?: number;
}

export const HealthRing: React.FC<HealthRingProps> = React.memo(({ score, size = 160 }) => {
  const clampedScore = Math.min(100, Math.max(0, score));

  const meta = useMemo(() => {
    if (clampedScore >= 80) {
      return {
        label: 'Maksimum Performans',
        color: '#1a5efd',
        icon: <Lightning size={18} weight="duotone" className="text-luper-primary" />,
        badgeBg: 'bg-luper-primary/10 text-luper-primary border-luper-primary/20'
      };
    }
    if (clampedScore >= 50) {
      return {
        label: 'Yüksek Performans',
        color: '#81c784',
        icon: <ShieldCheck size={18} weight="duotone" className="text-luper-success" />,
        badgeBg: 'bg-luper-success/10 text-luper-success border-luper-success/20'
      };
    }
    if (clampedScore >= 1) {
      return {
        label: 'Temel Optimizasyon',
        color: '#ffb74d',
        icon: <Warning size={18} weight="duotone" className="text-[#ffb74d]" />,
        badgeBg: 'bg-[#ffb74d]/10 text-[#ffb74d] border-[#ffb74d]/20'
      };
    }
    return {
      label: 'Optimizasyon Yapılmadı',
      color: '#ff5f56',
      icon: <WarningCircle size={18} weight="duotone" className="text-[#ff5f56]" />,
      badgeBg: 'bg-[#ff5f56]/10 text-[#ff5f56] border-[#ff5f56]/20'
    };
  }, [clampedScore]);

  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center p-2" style={{ transform: 'translateZ(0)', willChange: 'transform' }}>
      {/* Clean SVG Ring */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Value Arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={meta.color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center mb-0.5">
            {meta.icon}
          </div>
          <span className="text-3xl font-bold tracking-tight text-white font-mono">
            {clampedScore}
          </span>
          <span className="text-[9px] font-medium text-text-muted uppercase tracking-widest mt-0.5">
            PUAN
          </span>
        </div>
      </div>

      {/* Status Badge */}
      <div className={`mt-3 px-3 py-0.5 rounded-xl text-[12px] font-medium border flex items-center space-x-1.5 ${meta.badgeBg}`}>
        <span>{meta.label}</span>
      </div>
    </div>
  );
});

