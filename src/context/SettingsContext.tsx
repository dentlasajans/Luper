import { useEffect, ReactNode } from 'react';
import { executeCleaner, loadSettingsFromElectron, saveSettingsToElectron, setAppAutoStart } from '../services/SystemEngine';
import { useSystemStore } from '../store/systemStore';

export function SettingsProvider({ children }: { children: ReactNode }) {
  const settings = useSystemStore(state => state.settings);
  const updateSettings = useSystemStore(state => state.updateSettings);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await loadSettingsFromElectron();
        if (data && typeof data === 'object') {
          updateSettings(data as Partial<typeof settings>);
        }
      } catch (err) {
        console.error("Failed to load settings from electron:", err);
      }
    };
    fetchSettings();
  }, [updateSettings]);

  useEffect(() => {
    saveSettingsToElectron(settings);
  }, [settings]);

  useEffect(() => {
    setAppAutoStart(settings.autoStart, settings.startMinimized);
  }, [settings.autoStart, settings.startMinimized]);

  useEffect(() => {
    if (settings.lowQualityMode) {
      document.documentElement.classList.add('low-quality-mode');
    } else {
      document.documentElement.classList.remove('low-quality-mode');
    }
  }, [settings.lowQualityMode]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (settings.autoRamClean) {
      // Run every 30 minutes
      interval = setInterval(() => {
        executeCleaner(['ram']);
      }, 30 * 60 * 1000);
    }
    return () => clearInterval(interval);
  }, [settings.autoRamClean]);

  return <>{children}</>;
}

export function useSettingsState() {
  return useSystemStore(state => state.settings);
}

export function useSettingsDispatch() {
  const updateSettings = useSystemStore(state => state.updateSettings);
  return {
    setLowQualityMode: (value: boolean) => updateSettings({ lowQualityMode: value }),
    setAutoStart: (value: boolean) => updateSettings({ autoStart: value }),
    setMinimizeToTray: (value: boolean) => updateSettings({ minimizeToTray: value }),
    setStartMinimized: (value: boolean) => updateSettings({ startMinimized: value }),
    setAutoRamClean: (value: boolean) => updateSettings({ autoRamClean: value }),
    setAutoUpdateCheck: (value: boolean) => updateSettings({ autoUpdateCheck: value })
  };
}

export function useSettings() {
  const state = useSettingsState();
  const dispatch = useSettingsDispatch();
  return { ...state, ...dispatch };
}
