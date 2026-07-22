const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (channel, ...args) => {
      // Whitelist channels if needed
      const validChannels = [
        'window-minimize', 'window-maximize', 'window-close',
        'execute-quick-action', 'get-optimization-counts',
        'get-category-settings', 'get-system-status'
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
