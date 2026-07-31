import { IpcChannels, OptimizationSetting, SystemMetricsResponse, SystemStatus, StartupItemSchema, InstalledAppSchema, CleanerItemSchema, SystemStatusSchema, SystemMetricsResponseSchema, HardwareSpecsSchema } from '../types';
import { getCategorySettingsFromFirebase } from './FirebaseService';
import { z } from 'zod';

/**
 * SystemEngine.ts
 * Frontend service layer managing communication with Electron backend and
 * native worker_threads offloaded hardware & system metrics operations.
 *
 * All long-running native operations (such as systeminformation calls) are
 * offloaded to a dedicated Node worker thread (`sysInfoWorker.js`) in the Electron
 * main process to guarantee asynchronous execution, 60 FPS UI rendering, and
 * complete UI responsiveness.
 */

const IPC_TIMEOUT_MS = 5000;
const IPC_TTL_MS = 3000; // 3 seconds TTL

class IpcTimeoutError extends Error {
  constructor(channel: string) {
    super(`Connection Timeout: No response from Electron backend on channel ${channel}`);
    this.name = 'IpcTimeoutError';
  }
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}
const ipcCache = new Map<string, CacheEntry<unknown>>();
const MAX_CACHE_SIZE = 50;

// Promise deduplication caches for in-flight async calls
let activeHardwareSpecsPromise: Promise<import('../types').HardwareSpecs | null> | null = null;
let activeSystemStatusPromise: Promise<SystemStatus> | null = null;
let activeSystemMetricsPromise: Promise<SystemMetricsResponse> | null = null;

async function invokeIpc<T>(channel: IpcChannels, ...args: unknown[]): Promise<T> {
  const isGetQuery = channel.toString().includes('GET_') || channel.toString().includes('LOAD_');
  const cacheKey = `${channel}-${JSON.stringify(args)}`;

  if (isGetQuery) {
    const cached = ipcCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < IPC_TTL_MS)) {
      return cached.data as T;
    }
  }

  if (typeof window !== 'undefined' && 'electronAPI' in window) {
    const electronAPI = (window as unknown as { electronAPI: { invoke: (channel: string, ...args: unknown[]) => Promise<unknown> } }).electronAPI;
    if (electronAPI) {
      const invokePromise = electronAPI.invoke(channel, ...args) as Promise<T>;
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new IpcTimeoutError(channel)), IPC_TIMEOUT_MS);
      });
      
      const result = await Promise.race([invokePromise, timeoutPromise]);
      
      if (isGetQuery) {
        ipcCache.set(cacheKey, { data: result, timestamp: Date.now() });
        if (ipcCache.size > MAX_CACHE_SIZE) {
          const oldestKey = ipcCache.keys().next().value;
          if (oldestKey !== undefined) {
            ipcCache.delete(oldestKey);
          }
        }
      }
      
      return result;
    }
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
  const result = await invokeIpc(IpcChannels.APPLY_OPTIMIZATION, { id, code });
  await syncAppliedOptimizationsFromElectron();
  return result;
};

export const restoreOptimization = async (id: string, code: string) => {
  const result = await invokeIpc(IpcChannels.RESTORE_OPTIMIZATION, { id, code });
  await syncAppliedOptimizationsFromElectron();
  return result;
};

export const executeQuickAction = async (actionId: string): Promise<void> => {
  try {
    await invokeIpc(IpcChannels.EXECUTE_QUICK_ACTION, actionId);
  } catch (error) {
    console.error(`Failed to execute quick action ${actionId} from Electron:`, error);
    throw new Error('İşlem gerçekleştirilemedi');
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
    if (typeof window !== 'undefined' && 'electronAPI' in window) {
      const electronAPI = (window as unknown as { electronAPI: { invoke: (channel: string, ...args: unknown[]) => Promise<unknown> } }).electronAPI;
      if (electronAPI) {
        const backupKeys = await invokeIpc<string[]>(IpcChannels.GET_APPLIED_OPTIMIZATIONS);
        if (Array.isArray(backupKeys)) {
          const localArray = getAppliedOptimizationIds();
          const mergedKeys = Array.from(new Set([...localArray, ...backupKeys]));
          localStorage.setItem('applied_optimizations', JSON.stringify(mergedKeys));
          window.dispatchEvent(new Event('applied_optimizations_changed'));
        }
      }
    }
  } catch (e) {}
};

export const getCategorySettings = async (categoryId: string): Promise<OptimizationSetting[]> => {
  try {
    await syncAppliedOptimizationsFromElectron();
    const firebaseSettings = await getCategorySettingsFromFirebase(categoryId);
    const appliedIds = getAppliedOptimizationIds();
    return firebaseSettings.map((setting) => ({
      ...setting,
      status: appliedIds.includes(setting.id) ? 'optimized' : 'default'
    }));
  } catch (err) {
    console.error("Ayarlar çekilemedi", err);
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
  if (activeSystemStatusPromise) {
    return activeSystemStatusPromise;
  }

  activeSystemStatusPromise = (async () => {
    try {
      const rawData = await invokeIpc(IpcChannels.GET_SYSTEM_STATUS);
      const status = SystemStatusSchema.parse(rawData);
      cachedSystemStatus = status;
      return status;
    } catch (error) {
      console.error('Failed to fetch system status from Electron backend worker:', error);
      throw new Error('Veri çekilemiyor');
    } finally {
      activeSystemStatusPromise = null;
    }
  })();

  return activeSystemStatusPromise;
};

export const getSystemMetrics = async (): Promise<SystemMetricsResponse> => {
  if (activeSystemMetricsPromise) {
    return activeSystemMetricsPromise;
  }

  activeSystemMetricsPromise = (async () => {
    try {
      const rawData = await invokeIpc(IpcChannels.GET_SYSTEM_METRICS);
      return SystemMetricsResponseSchema.parse(rawData);
    } catch (error) {
      console.error('Failed to fetch system metrics from Electron backend worker:', error);
      return {
        success: false,
        error: { code: 'IPC_ERROR', message: 'Metrik verisi çekilemedi' }
      };
    } finally {
      activeSystemMetricsPromise = null;
    }
  })();

  return activeSystemMetricsPromise;
};

let cachedStartupItems: import('../types').StartupItem[] | null = null;
let cachedInstalledApps: import('../types').InstalledApp[] | null = null;
let cachedCleanerItems: import('../types').CleanerItem[] | null = null;

const preloadToolsData = async (): Promise<void> => {
  try {
    await Promise.allSettled([
      getStartupItems().then((data) => { cachedStartupItems = data; }),
      getInstalledApps().then((data) => { cachedInstalledApps = data; }),
      getCleanerItems().then((data) => { cachedCleanerItems = data; })
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

export const getCachedInstalledApps = (): import('../types').InstalledApp[] | null => cachedInstalledApps;

export const getStartupItems = async (): Promise<import('../types').StartupItem[]> => {
  if (cachedStartupItems) return cachedStartupItems;

  const rawData = await invokeIpc(IpcChannels.GET_STARTUP_ITEMS);
  const items = z.array(StartupItemSchema).parse(rawData);
  cachedStartupItems = items;
  return items;
};

export const toggleStartupItem = async (item: import('../types').StartupItem): Promise<void> => {
  return await invokeIpc(IpcChannels.TOGGLE_STARTUP_ITEM, item);
};

export const getInstalledApps = async (): Promise<import('../types').InstalledApp[]> => {
  if (cachedInstalledApps) return cachedInstalledApps;

  const rawData = await invokeIpc(IpcChannels.GET_INSTALLED_APPS);
  const apps = z.array(InstalledAppSchema).parse(rawData);
  cachedInstalledApps = apps;
  return apps;
};

export const uninstallApp = async (app: import('../types').InstalledApp): Promise<void> => {
  return await invokeIpc(IpcChannels.UNINSTALL_APP, app);
};

export const getCleanerItems = async (): Promise<import('../types').CleanerItem[]> => {
  if (cachedCleanerItems) return cachedCleanerItems;

  const rawData = await invokeIpc(IpcChannels.GET_CLEANER_ITEMS);
  const items = z.array(CleanerItemSchema).parse(rawData);
  cachedCleanerItems = items;
  return items;
};

export const executeCleaner = async (itemsToClean: string[]): Promise<boolean> => {
  return await invokeIpc(IpcChannels.EXECUTE_CLEANER, itemsToClean);
};

let cachedGames: import('../types').Game[] | null = null;

export const getCachedGames = (): import('../types').Game[] | null => cachedGames;

export const getAllInstalledGames = async (force = false): Promise<import('../types').Game[]> => {
  if (cachedGames && !force) return cachedGames;

  try {
    const rawData = await invokeIpc(IpcChannels.GET_ALL_INSTALLED_GAMES);
    if (Array.isArray(rawData)) {
      cachedGames = rawData as any;
      return cachedGames!;
    }
  } catch (e) {
    console.error('Failed to get games from Electron:', e);
  }

  cachedGames = [];
  return [];
};

export const setAppAutoStart = async (enable: boolean, openAsHidden: boolean): Promise<boolean> => {
  try {
    return await invokeIpc(IpcChannels.SET_AUTO_START, { enable, openAsHidden });
  } catch (e) {
    return false;
  }
};

// @ts-expect-error - auto fixed
export const saveSettingsToElectron = async (settings): Promise<boolean> => {
  try {
    return await invokeIpc(IpcChannels.SAVE_SETTINGS, settings);
  } catch (e) { return false; }
};

export const loadSettingsFromElectron = async (): Promise<unknown> => {
  try {
    return await invokeIpc(IpcChannels.LOAD_SETTINGS);
  } catch (e) { return null; }
};

export const preloadHardwareSpecs = async (): Promise<import('../types').HardwareSpecs | null> => {
  try {
    let specs = await getHardwareSpecs();
    let retries = 0;
    while (!specs && retries < 15) {
      await new Promise((r) => setTimeout(r, 500));
      specs = await getHardwareSpecs();
      retries++;
    }

    return specs;
  } catch (error) {
    console.error('Failed to preload hardware specs:', error);
    return null;
  }
};

export const getHardwareSpecs = async (): Promise<import('../types').HardwareSpecs | null> => {
  if (activeHardwareSpecsPromise) {
    return activeHardwareSpecsPromise;
  }

  activeHardwareSpecsPromise = (async () => {
    try {
      const rawData = await invokeIpc(IpcChannels.GET_HARDWARE_SPECS);
      const specs = HardwareSpecsSchema.parse(rawData);
      return specs;
    } catch (e) {
      console.error('Failed to get hardware specs from Electron backend worker:', e);
      return null;
    } finally {
      activeHardwareSpecsPromise = null;
    }
  })();

  return activeHardwareSpecsPromise;
};

export const checkForUpdates = async (): Promise<unknown> => {
  try {
    return await invokeIpc(IpcChannels.CHECK_FOR_UPDATES);
  } catch (error) {
    console.error('Failed to check for updates from Electron:', error);
    return { hasUpdate: false, error: 'Bağlantı hatası' };
  }
};
