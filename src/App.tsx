import { SettingsProvider } from './context/SettingsContext';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { SplashScreen } from './components/SplashScreen';
import { AnimatePresence, motion } from 'motion/react';
import { seedInitialData } from './services/FirebaseService';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    seedInitialData();
    if (typeof window !== 'undefined' && !window.electron) {
      document.body.classList.add('dev-preview-bg');
    }
  }, []);

  return (
    <SettingsProvider>
    <AnimatePresence mode="wait">
      {showSplash ? (
        <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
      ) : (
        <motion.div 
          key="main" 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full"
        >
          <Layout />
        </motion.div>
      )}
    </AnimatePresence>
    </SettingsProvider>
  );
}

