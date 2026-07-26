import { AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Layout } from '../components/Layout';
import { SplashScreen } from '../components/SplashScreen';
import { AppProvider } from '../context/AppProvider';
import { preloadAllCategorySettings } from '../services/FirebaseService';
import { syncAppliedOptimizationsFromElectron } from '../services/SystemEngine';

export function AppShell() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    preloadAllCategorySettings();
    syncAppliedOptimizationsFromElectron();
  }, []);

  return (
    <ErrorBoundary>
      <AppProvider>
        <div className="w-full h-full relative overflow-hidden bg-[#121214]">
          {/* Main Application Layout in the Background */}
          <Layout />

          {/* Glassmorphic Splash Screen Overlay */}
          <AnimatePresence>
            {showSplash && (
              <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
            )}
          </AnimatePresence>
        </div>
      </AppProvider>
    </ErrorBoundary>
  );
}
