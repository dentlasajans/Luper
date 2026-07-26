import React, { useState } from 'react';
import { Titlebar } from './components/Titlebar';
import { AnimatePresence, motion } from 'framer-motion';

// Pages
import WelcomePage from './pages/WelcomePage';
import LocationPage from './pages/LocationPage';
import ComponentsPage from './pages/ComponentsPage';
import SystemCheckPage from './pages/SystemCheckPage';
import InstallPage from './pages/InstallPage';
import CompletePage from './pages/CompletePage';

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -20 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
};

function App() {
  const [step, setStep] = useState(1);
  const [installPath, setInstallPath] = useState('C:\\Program Files\\LUPER');
  
  const nextStep = () => setStep(s => Math.min(s + 1, 6));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="flex flex-col h-screen w-screen bg-app">
      <Titlebar />
      
      <div className="flex-1 relative overflow-hidden flex flex-col p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="flex-1 flex flex-col w-full h-full"
          >
            {step === 1 && <WelcomePage onNext={nextStep} />}
            {step === 2 && <LocationPage onNext={nextStep} onPrev={prevStep} installPath={installPath} setInstallPath={setInstallPath} />}
            {step === 3 && <ComponentsPage onNext={nextStep} onPrev={prevStep} />}
            {step === 4 && <SystemCheckPage onNext={nextStep} onPrev={prevStep} />}
            {step === 5 && <InstallPage onNext={nextStep} />}
            {step === 6 && <CompletePage />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
