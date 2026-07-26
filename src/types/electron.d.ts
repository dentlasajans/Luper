import { CleanerItem, Game, InstalledApp, StartupItem, SystemMetricsResponse, SystemStatus } from './index';

export interface SystemMetrics {
  cpuUsage: number;
  freeMemoryMB: number;
  totalMemoryMB: number;
  usedMemoryMB: number;
  ramUsagePercent: number;
  osUptimeSeconds: number;
  osRelease: string;
  platform: string;
  arch: string;
}

export interface CommandResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface ElectronAPI {
  // Window Controls
  minimize: () => Promise<void>;
  maximize: () => Promise<void>;
  close: (minimizeToTray?: boolean) => Promise<void>;

  // Settings & System Ops
  getSystemMetrics: () => Promise<SystemMetricsResponse>;
  getSystemStatus: () => Promise<SystemStatus>;
  applyOptimization: (payload: { id: string; code: string }) => Promise<boolean>;
  restoreOptimization: (payload: { id: string; code: string }) => Promise<boolean>;
  applyOptimizationsBatch: (ids: string[]) => Promise<boolean>;
  getAppliedOptimizations: () => Promise<string[]>;

  // Tools & Actions
  getStartupItems: () => Promise<StartupItem[]>;
  toggleStartupItem: (item: StartupItem, enable: boolean) => Promise<boolean>;
  getInstalledApps: () => Promise<InstalledApp[]>;
  uninstallApp: (app: InstalledApp) => Promise<boolean>;
  getCleanerItems: () => Promise<CleanerItem[]>;
  executeCleaner: (selectedIds: string[]) => Promise<boolean>;
  getAllInstalledGames: () => Promise<Game[]>;
  launchGame: (appid: string, launcher: string) => Promise<boolean>;
  getInstalledSteamGames: () => Promise<Game[]>;
  launchSteamGame: (appid: string) => Promise<boolean>;
  setAutoStart: (enable: boolean) => Promise<boolean>;
  executeQuickAction: (actionId: string) => Promise<boolean>;

  // State Persistence
  saveSettings: (settings: unknown) => Promise<boolean>;
  loadSettings: () => Promise<unknown>;
  getHardwareSpecs: () => Promise<import('./index').HardwareSpecs>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
    electron?: {
      ipcRenderer: {
        invoke: (channel: string, ...args: unknown[]) => Promise<unknown>;
        on: (channel: string, listener: (...args: unknown[]) => void) => void;
        removeListener: (channel: string, listener: (...args: unknown[]) => void) => void;
      };
    };
  }
}
