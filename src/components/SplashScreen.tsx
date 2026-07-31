import { motion } from 'motion/react';
import React, { useEffect, useState } from 'react';
import { preloadAllCategorySettings } from '../services/FirebaseService';
import { getCachedSystemStatus, preloadAllApplicationData, preloadSystemStatus, preloadHardwareSpecs } from '../services/SystemEngine';
import { AppLogo } from './ui/AppLogo';

interface SplashScreenProps {
  onComplete: () => void;
  key?: React.Key;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let isDataReady = false;

    // Concurrently pre-fetch ALL Firebase category settings, system metrics & app data
    const prepareAllData = async () => {
      try {
        await Promise.allSettled([
          preloadAllCategorySettings(),
          preloadAllApplicationData()
        ]);
        
        const specs = await preloadHardwareSpecs();
        
        let status = getCachedSystemStatus();
        if (!status) {
          status = await preloadSystemStatus();
        }
        
        if (status && specs) {
          isDataReady = true;
        } else {
          isDataReady = false;
        }
      } catch (e) {
        console.error('Data preparation error:', e);
        isDataReady = false;
      }
    };

    prepareAllData();

    const minSplashMs = 1500;
    const maxSplashMs = 7000;
    const intervalTime = 30;
    let elapsedTime = 0;

    const timer = setInterval(() => {
      elapsedTime += intervalTime;

      // Finish only when all homepage data is 100% ready and min duration passed (or max safety timeout)
      if ((isDataReady && elapsedTime >= minSplashMs) || elapsedTime >= maxSplashMs) {
        clearInterval(timer);
        setProgress(100);
        setTimeout(() => {
          onComplete();
        }, 250);
        return;
      }

      // Smooth progress calculation:
      // While data is still loading: progress moves smoothly up to 92%
      // As soon as data is ready: progress surges to 100%
      if (!isDataReady) {
        const ratio = Math.min(elapsedTime / 3000, 1);
        const p = Math.round((1 - Math.pow(1 - ratio, 2)) * 92);
        setProgress((prev) => Math.max(prev, p));
      } else {
        const ratio = Math.min(elapsedTime / minSplashMs, 1);
        const p = Math.round((1 - Math.pow(1 - ratio, 3)) * 100);
        setProgress((prev) => Math.max(prev, p));
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
      className="splash-screen fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-xl"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -15 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-[420px] bg-[#1a1a1d]/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/[0.12] shadow-[0_25px_60px_rgba(0,0,0,0.7)] p-10 flex flex-col items-center relative overflow-hidden drag-region"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
        
        {/* Logo */}
        <AppLogo className="h-16 w-auto mb-8 drop-shadow-lg relative z-10 shrink-0" />
        
        {/* Status */}
        <p className="text-text-muted text-[12px] mb-10 relative z-10">{
          progress < 25 ? "Sistem bileşenleri başlatılıyor..." :
          progress < 50 ? "Donanım parçaları taranıyor (CPU, GPU, RAM, Disk)..." :
          progress < 75 ? "Servisler kontrol ediliyor..." :
          progress < 95 ? "Arayüz hazırlanıyor..." :
          "Neredeyse hazır!"
        }</p>
        
        {/* Progress Container */}
        <div className="w-full relative z-10">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[12px] uppercase tracking-widest font-medium text-text-muted">Yükleniyor</span>
            <span className="text-[12px] font-mono font-medium text-[#f5f5f7]">{Math.round(progress)}%</span>
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
    </motion.div>
  );
}
