import { useEffect, useRef } from 'react';
import { IpcChannels } from '../types';

export function useIpcListener<T>(channel: IpcChannels, callback: (event: any, data: T) => void) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.electron && window.electron.ipcRenderer) {
      const listener = (event: any, data: T) => savedCallback.current(event, data);
      
      window.electron.ipcRenderer.on(channel, listener);
      
      return () => {
        if (window.electron && window.electron.ipcRenderer) {
          window.electron.ipcRenderer.removeListener(channel, listener);
        }
      };
    }
  }, [channel]);
}
