import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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
  const [lowQualityMode, setLowQualityMode] = useState(() => localStorage.getItem('lowQualityMode') === 'true');
  const [autoStart, setAutoStart] = useState(() => localStorage.getItem('autoStart') === 'true');
  const [minimizeToTray, setMinimizeToTray] = useState(() => localStorage.getItem('minimizeToTray') !== 'false');
  const [startMinimized, setStartMinimized] = useState(() => localStorage.getItem('startMinimized') === 'true');
  const [autoRamClean, setAutoRamClean] = useState(() => localStorage.getItem('autoRamClean') === 'true');
  const [autoUpdateCheck, setAutoUpdateCheck] = useState(() => localStorage.getItem('autoUpdateCheck') !== 'false');

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

  return (
    <SettingsContext.Provider value={{
      lowQualityMode, setLowQualityMode,
      autoStart, setAutoStart,
      minimizeToTray, setMinimizeToTray,
      startMinimized, setStartMinimized,
      autoRamClean, setAutoRamClean,
      autoUpdateCheck, setAutoUpdateCheck
    }}>
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
