import { Minus, ArrowsClockwise, Square, Wrench, X } from '@/src/components/ui/Icons';
import { AnimatePresence, motion } from 'motion/react';
import React, { Suspense, useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import { useSettings } from '../context/SettingsContext';
import { closeWindow, maximizeWindow, minimizeWindow } from '../services/SystemEngine';
import { CommandPaletteModal } from './CommandPaletteModal';
import { ErrorBoundary } from './ErrorBoundary';
import { Sidebar } from './Sidebar';

import {
  ROUTE_IMPORTS,
  COMPONENT_MAP,
  Dashboard,
  CategoryOptimization,
  ChangelogModal,
  OPTIMIZATION_SUBCATEGORIES,
} from '../router/routes';

export const Layout = React.memo(function Layout() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMaximized, setIsMaximized] = useState(false);
  const { lowQualityMode } = useSettings();

  useEffect(() => {
    const preloadViews = () => {
      const MAIN_ROUTES = ['optimization', 'settings'];
      MAIN_ROUTES.forEach((route) => {
        if (ROUTE_IMPORTS[route]) ROUTE_IMPORTS[route]();
      });
      import('./CategoryOptimization');
    };

    let idleId: number | undefined;
    let timerId: ReturnType<typeof setTimeout> | undefined;

    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(preloadViews);
    } else {
      timerId = setTimeout(preloadViews, 1000);
    }

    return () => {
      if (typeof window.cancelIdleCallback === 'function' && idleId !== undefined) {
        window.cancelIdleCallback(idleId);
      }
      if (timerId !== undefined) {
        clearTimeout(timerId);
      }
    };
  }, []);

  const handleMaximize = React.useCallback(() => {
    setIsMaximized((prev) => !prev);
    maximizeWindow();
  }, []);

  return (
    <div className={`flex h-full w-full bg-[#161618] text-[#f5f5f7] overflow-hidden relative ${isMaximized ? 'rounded-none' : 'rounded-2xl'}`}>
      <Suspense fallback={null}>
        <ChangelogModal />
      </Suspense>

      <Toaster position="bottom-right" theme="dark" />

      <CommandPaletteModal setActiveTab={setActiveTab} />

      {!lowQualityMode && (<>
        {/* Ambient Lights */}
        <motion.div 
          style={{ transform: 'translateZ(0)' }}
          className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-luper-primary/20 rounded-full blur-[60px] pointer-events-none" 
          animate={{ opacity: 0.5 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 1 }}
        />
        <motion.div 
          style={{ transform: 'translateZ(0)' }}
          className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] bg-[#407eff]/10 rounded-full blur-[50px] pointer-events-none" 
          animate={{ opacity: 0.4 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 1 }}
        />
      </>)}

      {/* Global Drag Region (Titlebar) */}
      <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-end z-50 drag-region px-4" style={{ WebkitAppRegion: 'drag' }}>
        {/* Window Controls */}
        <div className="flex items-center h-full space-x-2 relative z-10" style={{ WebkitAppRegion: 'no-drag' }}>
          <button disabled aria-label="Check for Updates" className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted bg-white/[0.04] transition-all duration-300 border border-white/[0.04] group relative opacity-50 cursor-not-allowed focus-visible:ring-2 focus-visible:ring-luper-primary focus-visible:outline-none">
            <ArrowsClockwise size={14} weight="duotone" />
          </button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <button onClick={minimizeWindow} aria-label="Minimize Window" className="w-8 h-8 rounded-full flex items-center justify-center text-[#86868b] bg-white/[0.04] hover:bg-white/10 hover:text-white hover:scale-105 active:scale-95 transition-all duration-300 border border-white/[0.04] group relative focus-visible:ring-2 focus-visible:ring-luper-primary focus-visible:outline-none">
            <Minus size={14} weight="duotone" />
          </button>
          <button onClick={handleMaximize} aria-label="Maximize Window" className="w-8 h-8 rounded-full flex items-center justify-center text-[#86868b] bg-white/[0.04] hover:bg-white/10 hover:text-white hover:scale-105 active:scale-95 transition-all duration-300 border border-white/[0.04] group relative focus-visible:ring-2 focus-visible:ring-luper-primary focus-visible:outline-none">
            <Square size={14} weight="duotone" />
          </button>
          <button onClick={closeWindow} aria-label="Close Window" className="w-8 h-8 rounded-full flex items-center justify-center text-[#86868b] bg-white/[0.04] hover:bg-[#ff5f56] hover:text-white hover:scale-105 active:scale-95 hover:shadow-[0_0_15px_rgba(255,95,86,0.4)] transition-all duration-300 border border-white/[0.04] hover:border-transparent group relative focus-visible:ring-2 focus-visible:ring-luper-primary focus-visible:outline-none">
            <X size={14} weight="duotone" />
          </button>
        </div>
      </div>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 min-w-0 flex flex-col relative z-10 pt-12 pr-6 pb-6 pl-2">
        {/* Dynamic View Content */}
        <div className="flex-1 overflow-hidden relative">
          <ErrorBoundary>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={lowQualityMode ? { duration: 0.15 } : { duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{ transform: 'translateZ(0)', willChange: 'opacity, transform' }}
              className="h-full w-full absolute inset-0"
            >
              <Suspense fallback={<div className="flex items-center justify-center h-full text-[#86868b] text-[14px]">Yükleniyor...</div>}>
                {activeTab === 'dashboard' ? (
                  <Dashboard />
                ) : OPTIMIZATION_SUBCATEGORIES.includes(activeTab) ? (
                  <CategoryOptimization categoryId={activeTab} onBack={() => setActiveTab('optimization')} />
                ) : COMPONENT_MAP[activeTab] ? (
                  React.createElement(COMPONENT_MAP[activeTab] as React.ComponentType<any>, { setActiveTab })
                ) : (
                  <div className="flex items-center justify-center h-full p-8">
                    <div className="bg-luper-surface border border-white/[0.08] rounded-3xl p-12 flex flex-col items-center justify-center group hover:bg-white/[0.05] hover:shadow-xl hover:border-white/[0.1] transition-all duration-500 hover:-translate-y-1 cursor-default">
                      <Wrench size={28} weight="duotone" className="text-[#86868b] opacity-50 mb-3" />
                      <p className="text-[#86868b] text-[16px] group-hover:text-[#f5f5f7] transition-colors duration-300">Bu alan geliştirme aşamasında.</p>
                      <p className="text-[#86868b]/50 text-[12px] mt-2">Yakında sizlerle</p>
                    </div>
                  </div>
                )}
              </Suspense>
            </motion.div>
          </AnimatePresence>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
});

