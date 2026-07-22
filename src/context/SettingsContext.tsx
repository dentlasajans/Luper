import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface SettingsContextType {
  lowQualityMode: boolean;
  setLowQualityMode: (value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [lowQualityMode, setLowQualityMode] = useState(() => {
    return localStorage.getItem('lowQualityMode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('lowQualityMode', lowQualityMode.toString());
  }, [lowQualityMode]);

  return (
    <SettingsContext.Provider value={{ lowQualityMode, setLowQualityMode }}>
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
