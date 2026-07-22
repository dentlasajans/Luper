import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { AppLogo } from './Icons';

interface SplashScreenProps {
  onComplete: () => void;
  key?: React.Key;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 3-5 seconds dynamic loading
    const totalTime = 2500; 
    const intervalTime = 50; 
    const steps = totalTime / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      // Calculate progress with a slight ease-out effect (faster at start, slower at end)
      const p = currentStep / steps;
      const easedProgress = 1 - Math.pow(1 - p, 3); 
      
      setProgress(Math.min(easedProgress * 100, 100));

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          onComplete();
        }, 400); // Wait a bit after hitting 100%
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="flex h-screen w-full items-center justify-center p-4 drag-region">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="noise-overlay w-[400px] bg-surface-base/80 backdrop-blur-3xl rounded-[2.5rem] border border-white/[0.08] shadow-[0_30px_80px_rgba(0,0,0,0.8)] p-12 flex flex-col items-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
        
        {/* Logo */}
        <AppLogo className="h-16 w-auto mb-10 drop-shadow-lg relative z-10" />
        
        {/* Status */}
        <p className="text-text-muted text-[13px] mb-12 relative z-10">{
          progress < 30 ? "Sistem bileşenleri başlatılıyor..." :
          progress < 60 ? "Servisler kontrol ediliyor..." :
          progress < 90 ? "Arayüz hazırlanıyor..." :
          "Neredeyse hazır!"
        }</p>
        
        {/* Progress Container */}
        <div className="w-full relative z-10">
          <div className="flex justify-between items-end mb-3">
            <span className="text-[11px] uppercase tracking-widest font-medium text-text-muted">Yükleniyor</span>
            <span className="text-[11px] font-medium text-[#f5f5f7]">{Math.round(progress)}%</span>
          </div>
          
          <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden shadow-inner">
            <motion.div 
              className="h-full bg-gradient-to-r from-brand-primary to-[#407eff] rounded-full shadow-[0_0_15px_rgba(26,94,253,0.6)]"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: 'linear' }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
