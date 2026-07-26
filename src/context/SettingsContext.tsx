import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { executeCleaner, loadSettingsFromElectron, saveSettingsToElectron, setAppAutoStart } from '../services/SystemEngine';
interface SettingsContextType {
  lowQualityMode: boolean;
  setLowQualityMode: (value: boolean) => void;
  autoStart: boolean;
  setAutoStart: (value: boolean) => void;
  minimizeToTray: boolean;
  setMinimizeToTray: (value: boolean) => void;
  startMinimized: boolean;
  setStartMinimized: (value: boolean) => void;
  autoRamClean: boolean;
  setAutoRamClean: (value: boolean) => void;
  autoUpdateCheck: boolean;
  setAutoUpdateCheck: (value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [lowQualityMode, setLowQualityMode] = useState(() => localStorage.getItem('lowQualityMode') === 'true');
  const [autoStart, setAutoStart] = useState(() => localStorage.getItem('autoStart') === 'true');
  const [minimizeToTray, setMinimizeToTray] = useState(() => localStorage.getItem('minimizeToTray') !== 'false');
  const [startMinimized, setStartMinimized] = useState(() => localStorage.getItem('startMinimized') === 'true');
  const [autoRamClean, setAutoRamClean] = useState(() => localStorage.getItem('autoRamClean') === 'true');
  const [autoUpdateCheck, setAutoUpdateCheck] = useState(() => localStorage.getItem('autoUpdateCheck') !== 'false');

  useEffect(() => {
    const fetchSettings = async () => {
      const data = (await loadSettingsFromElectron()) as any;
      if (data) {
        if (data.lowQualityMode !== undefined) { setLowQualityMode(data.lowQualityMode); localStorage.setItem('lowQualityMode', String(data.lowQualityMode)); }
        if (data.autoStart !== undefined) { setAutoStart(data.autoStart); localStorage.setItem('autoStart', String(data.autoStart)); }
        if (data.minimizeToTray !== undefined) { setMinimizeToTray(data.minimizeToTray); localStorage.setItem('minimizeToTray', String(data.minimizeToTray)); }
        if (data.startMinimized !== undefined) { setStartMinimized(data.startMinimized); localStorage.setItem('startMinimized', String(data.startMinimized)); }
        if (data.autoRamClean !== undefined) { setAutoRamClean(data.autoRamClean); localStorage.setItem('autoRamClean', String(data.autoRamClean)); }
        if (data.autoUpdateCheck !== undefined) { setAutoUpdateCheck(data.autoUpdateCheck); localStorage.setItem('autoUpdateCheck', String(data.autoUpdateCheck)); }
      }
      setIsLoaded(true);
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    const currentSettings = { lowQualityMode, autoStart, minimizeToTray, startMinimized, autoRamClean, autoUpdateCheck };
    saveSettingsToElectron(currentSettings);
  }, [isLoaded, lowQualityMode, autoStart, minimizeToTray, startMinimized, autoRamClean, autoUpdateCheck]);

  useEffect(() => {
    localStorage.setItem('lowQualityMode', lowQualityMode.toString());
  }, [lowQualityMode]);

  useEffect(() => {
    localStorage.setItem('autoStart', autoStart.toString());
  }, [autoStart]);

  useEffect(() => {
    localStorage.setItem('minimizeToTray', minimizeToTray.toString());
  }, [minimizeToTray]);

  useEffect(() => {
    localStorage.setItem('startMinimized', startMinimized.toString());
  }, [startMinimized]);

  useEffect(() => {
    localStorage.setItem('autoRamClean', autoRamClean.toString());
  }, [autoRamClean]);

  useEffect(() => {
    localStorage.setItem('autoUpdateCheck', autoUpdateCheck.toString());
  }, [autoUpdateCheck]);

  useEffect(() => {
    setAppAutoStart(autoStart, startMinimized);
  }, [autoStart, startMinimized]);

  useEffect(() => {
    if (lowQualityMode) {
      document.documentElement.classList.add('low-quality-mode');
    } else {
      document.documentElement.classList.remove('low-quality-mode');
    }
  }, [lowQualityMode]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRamClean) {
      // Run every 30 minutes
      interval = setInterval(() => {
        executeCleaner(['ram']);
      }, 30 * 60 * 1000);
    }
    return () => clearInterval(interval);
  }, [autoRamClean]);

  const contextValue = React.useMemo(() => ({
    lowQualityMode, setLowQualityMode,
    autoStart, setAutoStart,
    minimizeToTray, setMinimizeToTray,
    startMinimized, setStartMinimized,
    autoRamClean, setAutoRamClean,
    autoUpdateCheck, setAutoUpdateCheck
  }), [
    lowQualityMode,
    autoStart,
    minimizeToTray,
    startMinimized,
    autoRamClean,
    autoUpdateCheck
  ]);

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
