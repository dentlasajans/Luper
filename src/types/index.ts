export type ImpactLevel = 'none' | 'positive_low' | 'positive_medium' | 'positive_high' | 'negative_low' | 'negative_medium' | 'negative_high';

export interface ImpactDetail {
  level: ImpactLevel;
  description: string;
}

export interface OptimizationSetting {
  id: string;
  name: string;
  description: string;
  status: 'optimized' | 'default' | 'checking';
  applyCode?: string;
  restoreCode?: string;
  impacts?: {
    performance: ImpactDetail;
    latency: ImpactDetail;
    input: ImpactDetail;
    power: ImpactDetail;
    heat: ImpactDetail;
  };
}

export interface ChangelogEntry {
  id: string;
  version: string;
  title: string;
  features: string[];
  date: string;
}

export interface CategoryOptimizationCount {
  [categoryId: string]: number;
}

export interface SystemStatus {
  cpuUsage: number | null;
  ramUsage: { used: number; total: number } | null;
  network: { latency: number } | null;
  firewall: boolean | null;
  storage: { drives: { name: string; type: string; free: number; total: number }[] } | null;
}

export enum IpcChannels {
  WINDOW_MINIMIZE = 'window-minimize',
  WINDOW_MAXIMIZE = 'window-maximize',
  WINDOW_CLOSE = 'window-close',
  EXECUTE_QUICK_ACTION = 'execute-quick-action',
  GET_OPTIMIZATION_COUNTS = 'get-optimization-counts',
  GET_CATEGORY_SETTINGS = 'get-category-settings',
  GET_SYSTEM_STATUS = 'get-system-status',
  APPLY_OPTIMIZATION = 'apply-optimization',
  RESTORE_OPTIMIZATION = 'restore-optimization',
  GET_STARTUP_ITEMS = 'get-startup-items',
  TOGGLE_STARTUP_ITEM = 'toggle-startup-item',
  GET_INSTALLED_APPS = 'get-installed-apps',
  UNINSTALL_APP = 'uninstall-app',
  GET_CLEANER_ITEMS = 'get-cleaner-items',
  EXECUTE_CLEANER = 'execute-cleaner',
  GET_INSTALLED_STEAM_GAMES = 'get-installed-steam-games',
  LAUNCH_STEAM_GAME = 'launch-steam-game',
}

export interface StartupItem {
  name: string;
  command: string;
  location: string;
  user: string;
  enabled: boolean;
}

export interface InstalledApp {
  id: string;
  name: string;
  publisher: string;
  version: string;
  type: 'desktop' | 'uwp';
  uninstallString: string;
  packageFullName: string;
}

export interface CleanerItem {
  id: string;
  name: string;
  description: string;
  sizeBytes: number;
}

export interface SteamGame {
  appid: string;
  name: string;
  sizeBytes?: number;
  installDir?: string;
  lastPlayed?: number;
  localCover?: string;
  localHeader?: string;
  headerImage: string;
  coverImage: string;
  heroImage?: string;
  isOptimized?: boolean;
}
