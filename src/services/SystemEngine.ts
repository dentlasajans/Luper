import { CategoryOptimizationCount, OptimizationSetting, SystemStatus, IpcChannels } from '../types';
import { getCategorySettingsFromFirebase, subscribeToCategorySettingsFromFirebase, getOptimizationCountsFromFirebase } from './FirebaseService';
import { mockOptimizationCounts, mockNetworkSettings, getMockDummySettings, mockSystemStatus } from '../mocks';

const IPC_TIMEOUT_MS = 5000;
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
    await invokeIpc(IpcChannels.WINDOW_CLOSE);
  } catch (err) {
    console.error(err);
  }
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
    // Determine category IDs from mock keys or a known list. 
    // Ideally we pass them, but we know them from data/categories.ts
    const categoryIds = ['network', 'cpu', 'storage', 'mouse', 'privacy', 'gpu', 'power', 'security', 'personalization', 'keyboard', 'audio', 'browser', 'telemetry'];
    const firebaseCounts = await getOptimizationCountsFromFirebase(categoryIds);
    if (firebaseCounts) {
      return firebaseCounts;
    }
  } catch (err) {
    console.error("Firebase'den counts çekilemedi:", err);
  }
  
  try {
    return await invokeIpc(IpcChannels.GET_OPTIMIZATION_COUNTS);
  } catch (error) {
    console.error('Failed to fetch optimization counts from Electron:', error);
    throw new Error('Veri çekilemiyor');
  }
};

export const subscribeToCategorySettings = (
  categoryId: string,
  onUpdate: (settings: OptimizationSetting[]) => void,
  onError: (error: Error) => void
): (() => void) | null => {
  if (USE_MOCKS) {
    // Return mock data immediately and no unsubscribe function
    const mockData = categoryId === 'network' ? mockNetworkSettings : getMockDummySettings(categoryId);
    onUpdate(mockData);
    return () => {};
  }
  
  const unsubscribe = subscribeToCategorySettingsFromFirebase(categoryId, onUpdate, onError);
  if (unsubscribe) return unsubscribe;
  
  // If Firebase fails or is not available, we fall back to IPC one-time fetch
  // but since it's a subscription, we just emit once.
  invokeIpc<OptimizationSetting[]>(IpcChannels.GET_CATEGORY_SETTINGS, categoryId)
    .then(onUpdate)
    .catch(onError);
    
  return () => {};
};

export const getCategorySettings = async (categoryId: string): Promise<OptimizationSetting[]> => {
  if (USE_MOCKS) {
    if (categoryId === 'network') return mockNetworkSettings;
    return getMockDummySettings(categoryId);
  }

  try {
    const firebaseSettings = await getCategorySettingsFromFirebase(categoryId);
    if (firebaseSettings && firebaseSettings.length > 0) {
      return firebaseSettings;
    }
  } catch (err) {
    console.error("Firebase'den ayarlar çekilemedi, yerel API'ye düşülüyor", err);
  }

  try {
    return await invokeIpc(IpcChannels.GET_CATEGORY_SETTINGS, categoryId);
  } catch (error) {
    console.error(`Failed to fetch settings for ${categoryId}:`, error);
    throw new Error('Veri çekilemiyor');
  }
};

export const getSystemStatus = async (): Promise<SystemStatus> => {
  if (USE_MOCKS) {
    return mockSystemStatus;
  }

  try {
    return await invokeIpc(IpcChannels.GET_SYSTEM_STATUS);
  } catch (error) {
    console.error('Failed to fetch system status from Electron:', error);
    throw new Error('Veri çekilemiyor');
  }
};
