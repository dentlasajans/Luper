const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (channel, ...args) => {
      // Whitelist channels if needed
      const validChannels = [
        'window-minimize', 'window-maximize', 'window-close',
        'execute-quick-action', 'get-optimization-counts',
        'get-category-settings', 'get-system-status',
        'apply-optimization', 'restore-optimization', 'get-startup-items', 'toggle-startup-item', 'get-installed-apps', 'uninstall-app', 'get-cleaner-items', 'execute-cleaner', 'get-installed-steam-games', 'launch-steam-game', 'finish-splash'
      ];
      if (validChannels.includes(channel)) {
        return ipcRenderer.invoke(channel, ...args);
      }
      return Promise.reject(new Error(`Unauthorized IPC channel: ${channel}`));
    },
    on: (channel, listener) => {
      ipcRenderer.on(channel, (event, ...args) => listener(event, ...args));
    },
    removeListener: (channel, listener) => {
      ipcRenderer.removeListener(channel, listener);
    }
  }
});
