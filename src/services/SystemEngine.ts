import { CategoryOptimizationCount, OptimizationSetting, SystemStatus, IpcChannels } from '../types';
import { getCategorySettingsFromFirebase } from './FirebaseService';
import { mockOptimizationCounts, mockSystemStatus, mockSteamGames } from '../mocks';

const IPC_TIMEOUT_MS = 60000;
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

class IpcTimeoutError extends Error {
  constructor(channel: string) {
    super(`Connection Timeout: No response from Electron backend on channel ${channel}`);
    this.name = 'IpcTimeoutError';
  }
}

async function invokeIpc<T>(channel: IpcChannels, ...args: any[]): Promise<T> {
  if (typeof window !== 'undefined' && window.electron && window.electron.ipcRenderer) {
    const invokePromise = window.electron.ipcRenderer.invoke(channel, ...args);
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new IpcTimeoutError(channel)), IPC_TIMEOUT_MS);
    });
    return Promise.race([invokePromise, timeoutPromise]);
  }
  throw new Error('Electron API not found');
}

export const minimizeWindow = async () => {
  try {
    await invokeIpc(IpcChannels.WINDOW_MINIMIZE);
  } catch (err) {
    console.error(err);
  }
};

export const maximizeWindow = async () => {
  try {
    await invokeIpc(IpcChannels.WINDOW_MAXIMIZE);
  } catch (err) {
    console.error(err);
  }
};

export const closeWindow = async () => {
  try {
    const minimizeToTray = localStorage.getItem('minimizeToTray') !== 'false';
    await invokeIpc(IpcChannels.WINDOW_CLOSE, minimizeToTray);
  } catch (err) {
    console.error(err);
  }
};

export const applyOptimization = async (id: string, code: string) => {
  if (USE_MOCKS) {
    return new Promise(resolve => setTimeout(resolve, 1000));
  }
  return await invokeIpc(IpcChannels.APPLY_OPTIMIZATION, { id, code });
};

export const restoreOptimization = async (id: string, code: string) => {
  if (USE_MOCKS) {
    return new Promise(resolve => setTimeout(resolve, 1000));
  }
  return await invokeIpc(IpcChannels.RESTORE_OPTIMIZATION, { id, code });
};

export const executeQuickAction = async (actionId: string): Promise<void> => {
  if (USE_MOCKS) {
    return new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  try {
    await invokeIpc(IpcChannels.EXECUTE_QUICK_ACTION, actionId);
  } catch (error) {
    console.error(`Failed to execute quick action ${actionId} from Electron:`, error);
    throw new Error('İşlem gerçekleştirilemedi');
  }
};

export const getOptimizationCounts = async (): Promise<CategoryOptimizationCount> => {
  if (USE_MOCKS) {
    return mockOptimizationCounts;
  }
  
  try {
    return await invokeIpc(IpcChannels.GET_OPTIMIZATION_COUNTS);
  } catch (error) {
    console.error('Failed to fetch optimization counts from Electron:', error);
    throw new Error('Veri çekilemiyor');
  }
};

export const getAppliedOptimizationIds = (): string[] => {
  try {
    const stored = localStorage.getItem('applied_optimizations');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return [];
};

export const syncAppliedOptimizationsFromElectron = async () => {
  try {
    if (typeof window !== 'undefined' && window.electron && window.electron.ipcRenderer) {
      const backupKeys = await invokeIpc<string[]>('get-applied-optimizations' as any);
      if (Array.isArray(backupKeys)) {
        const stored = getAppliedOptimizationIds();
        const merged = Array.from(new Set([...stored, ...backupKeys]));
        localStorage.setItem('applied_optimizations', JSON.stringify(merged));
        window.dispatchEvent(new Event('applied_optimizations_changed'));
      }
    }
  } catch (e) {}
};

export const getCategorySettings = async (categoryId: string): Promise<OptimizationSetting[]> => {
  try {
    const firebaseSettings = await getCategorySettingsFromFirebase(categoryId);
    const appliedIds = getAppliedOptimizationIds();
    return firebaseSettings.map(setting => ({
      ...setting,
      status: appliedIds.includes(setting.id) ? 'optimized' : 'default'
    }));
  } catch (err) {
    console.error("Firebase'den ayarlar çekilemedi", err);
    throw err;
  }
};

let cachedSystemStatus: SystemStatus | null = null;

export const preloadSystemStatus = async (): Promise<SystemStatus | null> => {
  try {
    const status = await getSystemStatus();
    cachedSystemStatus = status;
    return status;
  } catch (error) {
    console.error('Failed to preload system status:', error);
    return null;
  }
};

export const getCachedSystemStatus = (): SystemStatus | null => {
  return cachedSystemStatus;
};

export const getSystemStatus = async (): Promise<SystemStatus> => {
  if (USE_MOCKS) {
    return mockSystemStatus;
  }

  try {
    const status = await invokeIpc<SystemStatus>(IpcChannels.GET_SYSTEM_STATUS);
    cachedSystemStatus = status;
    return status;
  } catch (error) {
    console.error('Failed to fetch system status from Electron:', error);
    throw new Error('Veri çekilemiyor');
  }
};

let cachedStartupItems: import('../types').StartupItem[] | null = null;
let cachedInstalledApps: import('../types').InstalledApp[] | null = null;
let cachedCleanerItems: import('../types').CleanerItem[] | null = null;

export const preloadToolsData = async (): Promise<void> => {
  try {
    await Promise.allSettled([
      getStartupItems().then(data => { cachedStartupItems = data; }),
      getInstalledApps().then(data => { cachedInstalledApps = data; }),
      getCleanerItems().then(data => { cachedCleanerItems = data; })
    ]);
  } catch (e) {
    console.error('Failed to preload tools data:', e);
  }
};

export const preloadAllApplicationData = async (): Promise<void> => {
  try {
    await Promise.allSettled([
      preloadSystemStatus(),
      preloadToolsData()
    ]);
  } catch (e) {
    console.error('Failed to preload all application data:', e);
  }
};

export const getCachedStartupItems = (): import('../types').StartupItem[] | null => cachedStartupItems;
export const getCachedInstalledApps = (): import('../types').InstalledApp[] | null => cachedInstalledApps;
export const getCachedCleanerItems = (): import('../types').CleanerItem[] | null => cachedCleanerItems;

export const getStartupItems = async (): Promise<import('../types').StartupItem[]> => {
  if (cachedStartupItems) return cachedStartupItems;

  if (USE_MOCKS) {
    const mockData = [
      { name: 'OneDrive', command: '"C:\\Program Files\\OneDrive.exe"', location: 'HKCU\\Run', user: 'Admin', enabled: true },
      { name: 'Spotify', command: '"C:\\Users\\Admin\\AppData\\Roaming\\Spotify\\Spotify.exe"', location: 'HKCU\\Run', user: 'Admin', enabled: true },
      { name: 'Discord', command: '"C:\\Users\\Admin\\AppData\\Local\\Discord\\Update.exe"', location: 'HKCU\\Run', user: 'Admin', enabled: false }
    ];
    cachedStartupItems = mockData;
    return mockData;
  }
  const items = await invokeIpc<import('../types').StartupItem[]>(IpcChannels.GET_STARTUP_ITEMS);
  cachedStartupItems = items;
  return items;
};

export const toggleStartupItem = async (item: import('../types').StartupItem): Promise<void> => {
  if (USE_MOCKS) {
    return new Promise(resolve => setTimeout(resolve, 500));
  }
  return await invokeIpc(IpcChannels.TOGGLE_STARTUP_ITEM, item);
};

export const getInstalledApps = async (): Promise<import('../types').InstalledApp[]> => {
  if (cachedInstalledApps) return cachedInstalledApps;

  if (USE_MOCKS) {
    const mockApps: import('../types').InstalledApp[] = [
      { id: '1', name: 'Microsoft Solitaire Collection', publisher: 'Microsoft', version: '1.0.0.0', type: 'uwp', packageFullName: 'Microsoft.MicrosoftSolitaireCollection_8wekyb3d8bbwe', uninstallString: '' },
      { id: '2', name: 'Netflix', publisher: 'Netflix, Inc.', version: '6.99.5.0', type: 'uwp', packageFullName: '4DF9E0F8.Netflix_mcm4njqhnhss8', uninstallString: '' },
      { id: '3', name: 'Google Chrome', publisher: 'Google LLC', version: '114.0.5735.199', type: 'desktop', packageFullName: '', uninstallString: 'C:\\Program Files\\Google\\Chrome\\Application\\114.0.5735.199\\Installer\\setup.exe --uninstall' },
      { id: '4', name: 'Spotify', publisher: 'Spotify AB', version: '1.2.14.0', type: 'desktop', packageFullName: '', uninstallString: 'C:\\Users\\Admin\\AppData\\Roaming\\Spotify\\Spotify.exe --uninstall' }
    ];
    cachedInstalledApps = mockApps;
    return mockApps;
  }
  const apps = await invokeIpc<import('../types').InstalledApp[]>(IpcChannels.GET_INSTALLED_APPS);
  cachedInstalledApps = apps;
  return apps;
};

export const uninstallApp = async (app: import('../types').InstalledApp): Promise<void> => {
  if (USE_MOCKS) {
    return new Promise(resolve => setTimeout(resolve, 1500));
  }
  return await invokeIpc(IpcChannels.UNINSTALL_APP, app);
};

export const getCleanerItems = async (): Promise<import('../types').CleanerItem[]> => {
  if (cachedCleanerItems) return cachedCleanerItems;

  if (USE_MOCKS) {
    const mockCleaner = [
      { id: 'temp', name: 'Geçici Dosyalar', description: 'Uygulamaların oluşturduğu gereksiz geçici dosyalar.', sizeBytes: 1024 * 1024 * 450 },
      { id: 'recycle_bin', name: 'Geri Dönüşüm Kutusu', description: 'Silinmiş dosyaların tutulduğu alan.', sizeBytes: 1024 * 1024 * 1024 * 2.5 },
      { id: 'prefetch', name: 'Prefetch Verileri', description: 'Program hızlandırma verileri.', sizeBytes: 1024 * 1024 * 120 },
      { id: 'windows_update', name: 'Windows Update Önbelleği', description: 'Eski güncelleme kalıntıları.', sizeBytes: 1024 * 1024 * 800 }
    ];
    cachedCleanerItems = mockCleaner;
    return mockCleaner;
  }
  const items = await invokeIpc<import('../types').CleanerItem[]>(IpcChannels.GET_CLEANER_ITEMS);
  cachedCleanerItems = items;
  return items;
};

export const executeCleaner = async (itemsToClean: string[]): Promise<boolean> => {
  if (USE_MOCKS) {
    return new Promise(resolve => setTimeout(() => resolve(true), 2000));
  }
  return await invokeIpc(IpcChannels.EXECUTE_CLEANER, itemsToClean);
};

let cachedSteamGames: import('../types').SteamGame[] | null = null;

export const getCachedSteamGames = (): import('../types').SteamGame[] | null => cachedSteamGames;

export const getInstalledSteamGames = async (force = false): Promise<import('../types').SteamGame[]> => {
  if (cachedSteamGames && !force) return cachedSteamGames;

  if (USE_MOCKS) {
    cachedSteamGames = mockSteamGames;
    return mockSteamGames;
  }

  try {
    const games = await invokeIpc<import('../types').SteamGame[]>(IpcChannels.GET_INSTALLED_STEAM_GAMES);
    if (Array.isArray(games)) {
      cachedSteamGames = games;
      return games;
    }
  } catch (e) {
    console.error('Failed to get Steam games from Electron:', e);
  }

  return [];
};

export const launchSteamGame = async (appid: string): Promise<boolean> => {
  if (USE_MOCKS) {
    return true;
  }
  return await invokeIpc(IpcChannels.LAUNCH_STEAM_GAME, appid);
};
