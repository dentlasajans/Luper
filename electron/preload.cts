const { contextBridge, ipcRenderer } = require('electron');

const VALID_CHANNELS = [
  'window-minimize',
  'window-maximize',
  'window-close',
  'execute-quick-action',
  'get-optimization-counts',
  'get-category-settings',
  'get-system-status',
  'apply-optimization',
  'restore-optimization',
  'apply-optimizations-batch',
  'get-applied-optimizations',
  'get-startup-items',
  'toggle-startup-item',
  'get-installed-apps',
  'uninstall-app',
  'get-cleaner-items',
  'execute-cleaner',
  'get-all-installed-games',
  'launch-game',
  'get-installed-steam-games',
  'launch-steam-game',
  'set-auto-start',
  'get-system-metrics',
  'save-settings',
  'load-settings',
  'get-hardware-specs',
  'check-for-updates',
  'apply-nvidia-profile',
  'get-fps-stats',
  'generate-demo-fps-data'
];

const listenerMap = new Map();

/**
 * The API exposed to the renderer process (React app).
 * Provides safe IPC communication to the main process.
 */
contextBridge.exposeInMainWorld('electronAPI', {
  /** Minimizes the main window */
  minimize: () => ipcRenderer.invoke('window-minimize'),
  /** Maximizes or restores the main window */
  maximize: () => ipcRenderer.invoke('window-maximize'),
  /**
   * Closes the main window.
   * @param {boolean} [minimizeToTray=true] Whether to minimize to tray instead of quitting.
   */
  close: (minimizeToTray: boolean = true) => ipcRenderer.invoke('window-close', Boolean(minimizeToTray)),
  /** Retrieves system performance metrics (CPU, RAM, Network, etc.) */
  getSystemMetrics: () => ipcRenderer.invoke('get-system-metrics'),
  /** Retrieves the overall system health and status */
  getSystemStatus: () => ipcRenderer.invoke('get-system-status'),
  /** 
   * Applies a specific optimization setting.
   * @param {any} setting The setting object to apply.
   */
  applyOptimization: (setting: Record<string, any>) => ipcRenderer.invoke('apply-optimization', setting),
  /** 
   * Restores a specific optimization setting to its default.
   * @param {any} setting The setting object to restore.
   */
  restoreOptimization: (setting: Record<string, any>) => ipcRenderer.invoke('restore-optimization', setting),
  /** 
   * Applies multiple optimizations in a batch.
   * @param {string[]} ids Array of optimization IDs to apply.
   */
  applyOptimizationsBatch: (ids: string[]) => ipcRenderer.invoke('apply-optimizations-batch', ids),
  /** Retrieves a list of applied optimizations */
  getAppliedOptimizations: () => ipcRenderer.invoke('get-applied-optimizations'),
  /** Retrieves a list of startup items */
  getStartupItems: () => ipcRenderer.invoke('get-startup-items'),
  /** 
   * Toggles a startup item on or off.
   * @param {any} item The startup item object.
   * @param {boolean} enable True to enable, false to disable.
   */
  toggleStartupItem: (item: Record<string, any>, enable: boolean) => ipcRenderer.invoke('toggle-startup-item', { ...item, enabled: Boolean(enable) }),
  /** Retrieves a list of installed applications */
  getInstalledApps: () => ipcRenderer.invoke('get-installed-apps'),
  /** 
   * Uninstalls an application.
   * @param {any} app The application object to uninstall.
   */
  uninstallApp: (app: Record<string, any>) => ipcRenderer.invoke('uninstall-app', app),
  /** Retrieves items that can be cleaned up (temp files, cache, etc.) */
  getCleanerItems: () => ipcRenderer.invoke('get-cleaner-items'),
  /** 
   * Executes cleaner on selected item IDs.
   * @param {string[]} selectedIds Array of cleaner item IDs to clean.
   */
  executeCleaner: (selectedIds: string[]) => ipcRenderer.invoke('execute-cleaner', selectedIds),
  /** Retrieves all installed games */
  getAllInstalledGames: () => ipcRenderer.invoke('get-all-installed-games'),
  /** 
   * Launches a specific game.
   * @param {number|string} appid The game ID.
   * @param {string} launcher The launcher name (e.g., 'steam', 'epic').
   */
  launchGame: (appid: number | string, launcher: string) => ipcRenderer.invoke('launch-game', { appid, launcher }),
  /** Retrieves all installed Steam games */
  getInstalledSteamGames: () => ipcRenderer.invoke('get-installed-steam-games'),
  /** 
   * Launches a Steam game by its app ID.
   * @param {number|string} appid The Steam App ID.
   */
  launchSteamGame: (appid: number | string) => ipcRenderer.invoke('launch-steam-game', appid),
  /** 
   * Sets whether the app should auto-start on Windows boot.
   * @param {boolean} enable True to enable auto-start, false to disable.
   */
  setAutoStart: (enable: boolean) => ipcRenderer.invoke('set-auto-start', { enable: Boolean(enable) }),
  /** 
   * Executes a predefined quick action.
   * @param {string} actionId The ID of the quick action.
   */
  executeQuickAction: (actionId: string) => ipcRenderer.invoke('execute-quick-action', actionId),
  /** 
   * Saves user settings.
   * @param {any} settings The settings object to save.
   */
  saveSettings: (settings: Record<string, any>) => ipcRenderer.invoke('save-settings', settings),
  /** Loads user settings */
  loadSettings: () => ipcRenderer.invoke('load-settings'),
  /** Retrieves hardware specifications */
  getHardwareSpecs: () => ipcRenderer.invoke('get-hardware-specs'),
  /** Checks for application updates */
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  /** 
   * Applies an NVIDIA specific optimization profile.
   * @param {string} mode The profile mode (e.g., 'max-performance').
   */
  applyNvidiaProfile: (mode: string) => ipcRenderer.invoke('apply-nvidia-profile', mode),
  /** Retrieves FPS statistics from active monitoring */
  getFpsStats: () => ipcRenderer.invoke('get-fps-stats'),
  /** 
   * Generates demo FPS data for a game (testing purposes).
   * @param {number|string} gameId The game ID.
   * @param {string} gameName The game name.
   */
  generateDemoFpsData: (gameId: number | string, gameName: string) => ipcRenderer.invoke('generate-demo-fps-data', { gameId, gameName }),
  executeOptimization: (categoryId: string, enable: boolean) => ipcRenderer.invoke('execute-optimization', categoryId, enable),
  invoke: (channel: string, ...args: any[]) => {
    if (typeof channel !== 'string' || !VALID_CHANNELS.includes(channel)) return Promise.reject(new Error('Invalid IPC channel'));
    return ipcRenderer.invoke(channel, ...args);
  },
  on: (channel: string, listener: (...args: any[]) => void) => {
    if (typeof channel !== 'string' || !VALID_CHANNELS.includes(channel)) return;
    const wrappedListener = (_event: Electron.IpcRendererEvent, ...args: any[]) => listener(...args);
    if (!listenerMap.has(listener)) listenerMap.set(listener, new Map());
    
    const channelMap = listenerMap.get(listener);
    if (channelMap.has(channel)) {
      ipcRenderer.removeListener(channel, channelMap.get(channel));
    }
    channelMap.set(channel, wrappedListener);
    ipcRenderer.on(channel, wrappedListener);
  },
  removeListener: (channel: string, listener: (...args: any[]) => void) => {
    if (typeof channel !== 'string' || !VALID_CHANNELS.includes(channel)) return;
    const channelMap = listenerMap.get(listener);
    if (channelMap && channelMap.has(channel)) {
      ipcRenderer.removeListener(channel, channelMap.get(channel));
      channelMap.delete(channel);
    }
  }
});

contextBridge.exposeInMainWorld('electron', {
  executeOptimization: (categoryId: string, enable: boolean) => ipcRenderer.invoke('execute-optimization', categoryId, enable)
});
