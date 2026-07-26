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
  'apply-nvidia-profile'
];

const listenerMap = new Map();

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.invoke('window-minimize'),
  maximize: () => ipcRenderer.invoke('window-maximize'),
  close: (minimizeToTray = true) => ipcRenderer.invoke('window-close', Boolean(minimizeToTray)),
  getSystemMetrics: () => ipcRenderer.invoke('get-system-metrics'),
  getSystemStatus: () => ipcRenderer.invoke('get-system-status'),
  applyOptimization: (setting) => ipcRenderer.invoke('apply-optimization', setting),
  restoreOptimization: (setting) => ipcRenderer.invoke('restore-optimization', setting),
  applyOptimizationsBatch: (ids) => ipcRenderer.invoke('apply-optimizations-batch', ids),
  getAppliedOptimizations: () => ipcRenderer.invoke('get-applied-optimizations'),
  getStartupItems: () => ipcRenderer.invoke('get-startup-items'),
  toggleStartupItem: (item, enable) => ipcRenderer.invoke('toggle-startup-item', { ...item, enabled: Boolean(enable) }),
  getInstalledApps: () => ipcRenderer.invoke('get-installed-apps'),
  uninstallApp: (app) => ipcRenderer.invoke('uninstall-app', app),
  getCleanerItems: () => ipcRenderer.invoke('get-cleaner-items'),
  executeCleaner: (selectedIds) => ipcRenderer.invoke('execute-cleaner', selectedIds),
  getAllInstalledGames: () => ipcRenderer.invoke('get-all-installed-games'),
  launchGame: (appid, launcher) => ipcRenderer.invoke('launch-game', { appid, launcher }),
  getInstalledSteamGames: () => ipcRenderer.invoke('get-installed-steam-games'),
  launchSteamGame: (appid) => ipcRenderer.invoke('launch-steam-game', appid),
  setAutoStart: (enable) => ipcRenderer.invoke('set-auto-start', { enable: Boolean(enable) }),
  executeQuickAction: (actionId) => ipcRenderer.invoke('execute-quick-action', actionId),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
  loadSettings: () => ipcRenderer.invoke('load-settings'),
  getHardwareSpecs: () => ipcRenderer.invoke('get-hardware-specs'),
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  applyNvidiaProfile: (mode) => ipcRenderer.invoke('apply-nvidia-profile', mode),
  invoke: (channel, ...args) => {
    if (typeof channel !== 'string' || !VALID_CHANNELS.includes(channel)) return Promise.reject(new Error('Invalid IPC channel'));
    return ipcRenderer.invoke(channel, ...args);
  },
  on: (channel, listener) => {
    if (typeof channel !== 'string' || !VALID_CHANNELS.includes(channel)) return;
    const wrappedListener = (event, ...args) => listener(...args);
    if (!listenerMap.has(listener)) listenerMap.set(listener, new Map());
    listenerMap.get(listener).set(channel, wrappedListener);
    ipcRenderer.on(channel, wrappedListener);
  },
  removeListener: (channel, listener) => {
    if (typeof channel !== 'string' || !VALID_CHANNELS.includes(channel)) return;
    const channelMap = listenerMap.get(listener);
    if (channelMap && channelMap.has(channel)) {
      ipcRenderer.removeListener(channel, channelMap.get(channel));
      channelMap.delete(channel);
    }
  }
});
