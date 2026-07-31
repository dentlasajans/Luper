import type {
  CleanerItem,
  Game,
  HardwareSpecs,
  InstalledApp,
  OptimizationSetting,
  StartupItem,
  SystemMetricsResponse,
  SystemStatus,
} from './index';

/**
 * Enum containing all supported Electron IPC Channels in Luper.
 */
export enum IPCChannel {
  WINDOW_MINIMIZE = 'window-minimize',
  WINDOW_MAXIMIZE = 'window-maximize',
  WINDOW_CLOSE = 'window-close',
  EXECUTE_QUICK_ACTION = 'execute-quick-action',
  GET_OPTIMIZATION_COUNTS = 'get-optimization-counts',
  GET_CATEGORY_SETTINGS = 'get-category-settings',
  GET_SYSTEM_STATUS = 'get-system-status',
  APPLY_OPTIMIZATION = 'apply-optimization',
  RESTORE_OPTIMIZATION = 'restore-optimization',
  APPLY_OPTIMIZATIONS_BATCH = 'apply-optimizations-batch',
  GET_APPLIED_OPTIMIZATIONS = 'get-applied-optimizations',
  GET_STARTUP_ITEMS = 'get-startup-items',
  TOGGLE_STARTUP_ITEM = 'toggle-startup-item',
  GET_INSTALLED_APPS = 'get-installed-apps',
  UNINSTALL_APP = 'uninstall-app',
  GET_CLEANER_ITEMS = 'get-cleaner-items',
  EXECUTE_CLEANER = 'execute-cleaner',
  GET_ALL_INSTALLED_GAMES = 'get-all-installed-games',
  LAUNCH_GAME = 'launch-game',
  GET_INSTALLED_STEAM_GAMES = 'get-installed-steam-games',
  LAUNCH_STEAM_GAME = 'launch-steam-game',
  SET_AUTO_START = 'set-auto-start',
  GET_SYSTEM_METRICS = 'get-system-metrics',
  SAVE_SETTINGS = 'save-settings',
  LOAD_SETTINGS = 'load-settings',
  GET_HARDWARE_SPECS = 'get-hardware-specs',
  CHECK_FOR_UPDATES = 'check-for-updates',
  APPLY_NVIDIA_PROFILE = 'apply-nvidia-profile',
  GET_FPS_STATS = 'get-fps-stats',
  GENERATE_DEMO_FPS_DATA = 'generate-demo-fps-data',
}

// Request and Response interfaces for each IPC Channel

// WINDOW_MINIMIZE
export interface WindowMinimizeRequest {}
export type WindowMinimizeResponse = void;

// WINDOW_MAXIMIZE
export interface WindowMaximizeRequest {}
export type WindowMaximizeResponse = void;

// WINDOW_CLOSE
export interface WindowCloseRequest {
  minimizeToTray?: boolean;
}
export type WindowCloseResponse = void;

// EXECUTE_QUICK_ACTION
export interface ExecuteQuickActionRequest {
  actionId: string;
}
export type ExecuteQuickActionResponse = boolean;

// GET_OPTIMIZATION_COUNTS
export interface GetOptimizationCountsRequest {}
export type GetOptimizationCountsResponse = Record<string, number>;

// GET_CATEGORY_SETTINGS
export interface GetCategorySettingsRequest {
  categoryId?: string;
}
export type GetCategorySettingsResponse = OptimizationSetting[];

// GET_SYSTEM_STATUS
export interface GetSystemStatusRequest {}
export type GetSystemStatusResponse = SystemStatus;

// APPLY_OPTIMIZATION
export interface ApplyOptimizationRequest {
  id: string;
  code?: string;
}
export type ApplyOptimizationResponse = boolean;

// RESTORE_OPTIMIZATION
export interface RestoreOptimizationRequest {
  id: string;
  code?: string;
}
export type RestoreOptimizationResponse = boolean;

// APPLY_OPTIMIZATIONS_BATCH
export interface ApplyOptimizationsBatchRequest {
  ids: string[];
}
export type ApplyOptimizationsBatchResponse = boolean;

// GET_APPLIED_OPTIMIZATIONS
export interface GetAppliedOptimizationsRequest {}
export type GetAppliedOptimizationsResponse = string[];

// GET_STARTUP_ITEMS
export interface GetStartupItemsRequest {}
export type GetStartupItemsResponse = StartupItem[];

// TOGGLE_STARTUP_ITEM
export interface ToggleStartupItemRequest {
  item: StartupItem;
  enable: boolean;
}
export type ToggleStartupItemResponse = boolean;

// GET_INSTALLED_APPS
export interface GetInstalledAppsRequest {}
export type GetInstalledAppsResponse = InstalledApp[];

// UNINSTALL_APP
export interface UninstallAppRequest {
  app: InstalledApp;
}
export type UninstallAppResponse = boolean;

// GET_CLEANER_ITEMS
export interface GetCleanerItemsRequest {}
export type GetCleanerItemsResponse = CleanerItem[];

// EXECUTE_CLEANER
export interface ExecuteCleanerRequest {
  selectedIds: string[];
}
export type ExecuteCleanerResponse = boolean;

// GET_ALL_INSTALLED_GAMES
export interface GetAllInstalledGamesRequest {}
export type GetAllInstalledGamesResponse = Game[];

// LAUNCH_GAME
export interface LaunchGameRequest {
  appid: string;
  launcher: string;
}
export type LaunchGameResponse = boolean;

// GET_INSTALLED_STEAM_GAMES
export interface GetInstalledSteamGamesRequest {}
export type GetInstalledSteamGamesResponse = Game[];

// LAUNCH_STEAM_GAME
export interface LaunchSteamGameRequest {
  appid: string;
}
export type LaunchSteamGameResponse = boolean;

// SET_AUTO_START
export interface SetAutoStartRequest {
  enable: boolean;
}
export type SetAutoStartResponse = boolean;

// GET_SYSTEM_METRICS
export interface GetSystemMetricsRequest {}
export type GetSystemMetricsResponse = SystemMetricsResponse;

// SAVE_SETTINGS
export interface SaveSettingsRequest {
  settings: unknown;
}
export type SaveSettingsResponse = boolean;

// LOAD_SETTINGS
export interface LoadSettingsRequest {}
export type LoadSettingsResponse = unknown;

// GET_HARDWARE_SPECS
export interface GetHardwareSpecsRequest {}
export type GetHardwareSpecsResponse = HardwareSpecs;

// CHECK_FOR_UPDATES
export interface CheckForUpdatesRequest {}
export interface CheckForUpdatesResponse {
  hasUpdate: boolean;
  version?: string;
  releaseNotes?: string;
  error?: string;
}

// APPLY_NVIDIA_PROFILE
export interface ApplyNvidiaProfileRequest {
  mode: 'fps' | 'aaa' | 'balanced';
}
export type ApplyNvidiaProfileResponse = boolean;

// GET_FPS_STATS
export interface GetFpsStatsRequest {}
export type GetFpsStatsResponse = Record<string, any>;

// GENERATE_DEMO_FPS_DATA
export interface GenerateDemoFpsDataRequest {
  gameId: string;
  gameName: string;
}
export type GenerateDemoFpsDataResponse = Record<string, any>;

/**
 * Mapping table of IPC Channels to their corresponding Request and Response types.
 */
export interface IPCChannelMap {
  [IPCChannel.WINDOW_MINIMIZE]: { request: WindowMinimizeRequest; response: WindowMinimizeResponse };
  [IPCChannel.WINDOW_MAXIMIZE]: { request: WindowMaximizeRequest; response: WindowMaximizeResponse };
  [IPCChannel.WINDOW_CLOSE]: { request: WindowCloseRequest; response: WindowCloseResponse };
  [IPCChannel.EXECUTE_QUICK_ACTION]: { request: ExecuteQuickActionRequest; response: ExecuteQuickActionResponse };
  [IPCChannel.GET_OPTIMIZATION_COUNTS]: { request: GetOptimizationCountsRequest; response: GetOptimizationCountsResponse };
  [IPCChannel.GET_CATEGORY_SETTINGS]: { request: GetCategorySettingsRequest; response: GetCategorySettingsResponse };
  [IPCChannel.GET_SYSTEM_STATUS]: { request: GetSystemStatusRequest; response: GetSystemStatusResponse };
  [IPCChannel.APPLY_OPTIMIZATION]: { request: ApplyOptimizationRequest; response: ApplyOptimizationResponse };
  [IPCChannel.RESTORE_OPTIMIZATION]: { request: RestoreOptimizationRequest; response: RestoreOptimizationResponse };
  [IPCChannel.APPLY_OPTIMIZATIONS_BATCH]: { request: ApplyOptimizationsBatchRequest; response: ApplyOptimizationsBatchResponse };
  [IPCChannel.GET_APPLIED_OPTIMIZATIONS]: { request: GetAppliedOptimizationsRequest; response: GetAppliedOptimizationsResponse };
  [IPCChannel.GET_STARTUP_ITEMS]: { request: GetStartupItemsRequest; response: GetStartupItemsResponse };
  [IPCChannel.TOGGLE_STARTUP_ITEM]: { request: ToggleStartupItemRequest; response: ToggleStartupItemResponse };
  [IPCChannel.GET_INSTALLED_APPS]: { request: GetInstalledAppsRequest; response: GetInstalledAppsResponse };
  [IPCChannel.UNINSTALL_APP]: { request: UninstallAppRequest; response: UninstallAppResponse };
  [IPCChannel.GET_CLEANER_ITEMS]: { request: GetCleanerItemsRequest; response: GetCleanerItemsResponse };
  [IPCChannel.EXECUTE_CLEANER]: { request: ExecuteCleanerRequest; response: ExecuteCleanerResponse };
  [IPCChannel.GET_ALL_INSTALLED_GAMES]: { request: GetAllInstalledGamesRequest; response: GetAllInstalledGamesResponse };
  [IPCChannel.LAUNCH_GAME]: { request: LaunchGameRequest; response: LaunchGameResponse };
  [IPCChannel.GET_INSTALLED_STEAM_GAMES]: { request: GetInstalledSteamGamesRequest; response: GetInstalledSteamGamesResponse };
  [IPCChannel.LAUNCH_STEAM_GAME]: { request: LaunchSteamGameRequest; response: LaunchSteamGameResponse };
  [IPCChannel.SET_AUTO_START]: { request: SetAutoStartRequest; response: SetAutoStartResponse };
  [IPCChannel.GET_SYSTEM_METRICS]: { request: GetSystemMetricsRequest; response: GetSystemMetricsResponse };
  [IPCChannel.SAVE_SETTINGS]: { request: SaveSettingsRequest; response: SaveSettingsResponse };
  [IPCChannel.LOAD_SETTINGS]: { request: LoadSettingsRequest; response: LoadSettingsResponse };
  [IPCChannel.GET_HARDWARE_SPECS]: { request: GetHardwareSpecsRequest; response: GetHardwareSpecsResponse };
  [IPCChannel.CHECK_FOR_UPDATES]: { request: CheckForUpdatesRequest; response: CheckForUpdatesResponse };
  [IPCChannel.APPLY_NVIDIA_PROFILE]: { request: ApplyNvidiaProfileRequest; response: ApplyNvidiaProfileResponse };
  [IPCChannel.GET_FPS_STATS]: { request: GetFpsStatsRequest; response: GetFpsStatsResponse };
  [IPCChannel.GENERATE_DEMO_FPS_DATA]: { request: GenerateDemoFpsDataRequest; response: GenerateDemoFpsDataResponse };
}

export interface IpcAPI {
  saveSettings: (settings: any) => Promise<boolean>;
  loadSettings: () => Promise<any>;
  getHardwareSpecs: () => Promise<any>;
  checkForUpdates: () => Promise<CheckForUpdatesResponse>;
  applyNvidiaProfile: (mode: 'fps' | 'aaa' | 'balanced') => Promise<boolean>;
  getFpsStats: () => Promise<Record<string, any>>;
  generateDemoFpsData: (gameId: string, gameName: string) => Promise<Record<string, any>>;
  on: (channel: IPCChannel | string, listener: (...args: any[]) => void) => void;
}
