import React, { useState, Suspense } from 'react';
import { Sidebar } from './Sidebar';
import { Dashboard } from './Dashboard';
const Optimization = React.lazy(() => import('./Optimization').then(m => ({ default: m.Optimization })));
const Settings = React.lazy(() => import('./Settings').then(m => ({ default: m.Settings })));
const CategoryOptimization = React.lazy(() => import('./CategoryOptimization').then(m => ({ default: m.CategoryOptimization })));
const StartupTools = React.lazy(() => import('./tools/StartupTools').then(m => ({ default: m.StartupTools })));
const DebloatTools = React.lazy(() => import('./tools/DebloatTools').then(m => ({ default: m.DebloatTools })));
const CleanerTools = React.lazy(() => import('./tools/CleanerTools').then(m => ({ default: m.CleanerTools })));
const GamesTools = React.lazy(() => import('./tools/GamesTools').then(m => ({ default: m.GamesTools })));
import { ErrorBoundary } from './ErrorBoundary';
import { useSettings } from '../context/SettingsContext';
const ChangelogModal = React.lazy(() => import('./ChangelogModal').then(module => ({ default: module.ChangelogModal })));
import { Minus, X, RefreshCw, Wrench } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { minimizeWindow, closeWindow } from '../services/SystemEngine';

const OPTIMIZATION_SUBCATEGORIES = [
  'network', 'cpu', 'storage', 'mouse', 'privacy', 
  'gpu', 'power', 'security', 'personalization', 
  'keyboard', 'audio', 'browser', 'telemetry'
];

export function Layout() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { lowQualityMode } = useSettings();

  return (
    <div className="w-full h-full bg-[#121214] p-0">
      <Suspense fallback={null}>
        <ChangelogModal />
      </Suspense>
      <div className="flex h-full w-full bg-[#121214] text-[#f5f5f7] overflow-hidden relative">

        {!lowQualityMode && (<>
          {/* Ambient Lights */}
        <motion.div 
          className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-brand-primary/20 rounded-full blur-[120px] pointer-events-none will-change-opacity" 
          animate={{ opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] bg-[#407eff]/10 rounded-full blur-[100px] pointer-events-none will-change-opacity" 
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />

        </>)}
        {/* Global Drag Region (Titlebar) */}
        <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-end z-50 drag-region" style={{ WebkitAppRegion: 'drag' } as any}>
          {/* Window Controls */}
          <div className="flex items-center h-full px-4 space-x-2 relative z-10" style={{ WebkitAppRegion: 'no-drag' } as any}>
            <button disabled aria-label="Check for Updates" className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted bg-white/[0.04] transition-all duration-300 border border-white/[0.04] group relative opacity-50 cursor-not-allowed focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:outline-none">
              <RefreshCw size={14} />
              <div className="absolute top-10 right-0 w-max px-2.5 py-1.5 bg-surface-base border border-white/10 rounded-lg shadow-xl opacity-0 scale-95 transition-all duration-200 pointer-events-none z-50">
                <span className="text-[11px] font-medium text-white">Güncellemeleri Denetle</span>
              </div>
            </button>
            <div className="w-px h-4 bg-white/10 mx-1" />
            <button onClick={minimizeWindow} aria-label="Minimize Window" className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted bg-white/[0.04] hover:bg-white/10 hover:text-white hover:scale-105 active:scale-95 transition-all duration-300 border border-white/[0.04] group relative focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:outline-none">
              <Minus size={14} />
              <div className="absolute top-10 right-0 w-max px-2.5 py-1.5 bg-surface-base border border-white/10 rounded-lg shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none z-50">
                <span className="text-[11px] font-medium text-white">Aşağı İndir</span>
              </div>
            </button>
            <button onClick={closeWindow} aria-label="Close Window" className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted bg-white/[0.04] hover:bg-[#ff5f56] hover:text-white hover:scale-105 active:scale-95 hover:shadow-[0_0_15px_rgba(255,95,86,0.4)] transition-all duration-300 border border-white/[0.04] hover:border-transparent group relative focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:outline-none">
              <X size={14} />
              <div className="absolute top-10 right-0 w-max px-2.5 py-1.5 bg-[#ff5f56]/10 backdrop-blur-md border border-[#ff5f56]/20 rounded-lg shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none z-50">
                <span className="text-[11px] font-medium text-[#ff5f56]">Kapat</span>
              </div>
            </button>
          </div>
        </div>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 min-w-0 flex flex-col relative z-10 pt-16 pr-3 pb-4 pl-0">
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
              className="h-full w-full absolute inset-0"
            >
              <Suspense fallback={<div className="flex items-center justify-center h-full text-text-muted text-[13px]">Yükleniyor...</div>}>
                {activeTab === 'dashboard' ? (
                  <Dashboard />
                ) : activeTab === 'optimization' ? (
                  <Optimization setActiveTab={setActiveTab} />
                ) : activeTab === 'settings' ? (
                  <Settings />
                ) : OPTIMIZATION_SUBCATEGORIES.includes(activeTab) ? (
                  <CategoryOptimization categoryId={activeTab} onBack={() => setActiveTab('optimization')} />
                ) : activeTab === 'startup' ? (
                  <StartupTools />
                ) : activeTab === 'debloat' ? (
                  <DebloatTools />
                ) : activeTab === 'cleaner' ? (
                  <CleanerTools />
                ) : activeTab === 'games' ? (
                  <GamesTools />
                ) : (
                  <div className="flex items-center justify-center h-full p-8">
                    <div className="bg-white/[0.03] backdrop-blur-lg border border-white/[0.06] rounded-[2rem] p-12 flex flex-col items-center justify-center group hover:bg-white/[0.05] hover:shadow-xl hover:border-white/[0.1] transition-all duration-500 hover:-translate-y-1 cursor-default animate-[pulse-border_4s_infinite]">
                      <Wrench size={28} className="text-text-muted opacity-50 mb-3" />
                      <p className="text-text-muted text-[15px] group-hover:text-[#f5f5f7] transition-colors duration-300">Bu alan geliştirme aşamasında.</p>
                      <p className="text-text-muted/50 text-[11px] mt-2">Yakında sizlerle</p>
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
    </div>
  );
}
