import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  invoke: (channel, ...args) => {
    const validChannels = [
      'window-close', 
      'window-minimize',
      'system-check',
      'install-app'
    ];
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, ...args);
    }
    return Promise.reject(new Error(`Invalid channel: ${channel}`));
  },
  on: (channel, func) => {
    const validChannels = ['install-progress'];
    if (validChannels.includes(channel)) {
      // Strip event as it includes `sender` 
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  removeListener: (channel, func) => {
    ipcRenderer.removeListener(channel, func);
  }
});
