import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { AppLogo } from './Icons';
import { preloadAllApplicationData } from '../services/SystemEngine';
import { preloadAllCategorySettings } from '../services/FirebaseService';

interface SplashScreenProps {
  onComplete: () => void;
  key?: React.Key;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let isDataReady = false;

    // Concurrently pre-fetch ALL Firebase categories, Dashboard status & Tool items
    Promise.allSettled([
      preloadAllCategorySettings(),
      preloadAllApplicationData()
    ]).then(() => {
      isDataReady = true;
    });

    const minSplashMs = 2500;
    const intervalTime = 50;
    const minSteps = minSplashMs / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const p = Math.min(currentStep / minSteps, 1);
      const easedProgress = 1 - Math.pow(1 - p, 3);
      
      let targetProgress = easedProgress * 95;
      if (isDataReady) {
        targetProgress = Math.min(easedProgress * 100, 100);
      }

      setProgress(targetProgress);

      if (currentStep >= minSteps && isDataReady) {
        clearInterval(timer);
        setProgress(100);
        setTimeout(() => {
          onComplete();
        }, 300);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="w-full h-full bg-[#121214] flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-[400px] bg-[#1c1c1e] rounded-[2rem] border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-10 flex flex-col items-center relative overflow-hidden drag-region"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
        
        {/* Logo */}
        <AppLogo className="h-16 w-auto mb-8 drop-shadow-lg relative z-10" />
        
        {/* Status */}
        <p className="text-text-muted text-[12.5px] mb-10 relative z-10">{
          progress < 30 ? "Sistem bileşenleri başlatılıyor..." :
          progress < 60 ? "Servisler kontrol ediliyor..." :
          progress < 90 ? "Arayüz hazırlanıyor..." :
          "Neredeyse hazır!"
        }</p>
        
        {/* Progress Container */}
        <div className="w-full relative z-10">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10.5px] uppercase tracking-widest font-medium text-text-muted">Yükleniyor</span>
            <span className="text-[10.5px] font-mono font-medium text-[#f5f5f7]">{Math.round(progress)}%</span>
          </div>
          
          <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden shadow-inner">
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
