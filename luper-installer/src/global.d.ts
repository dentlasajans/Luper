declare global {
  interface Window {
    electronAPI: {
      invoke(channel: string, ...args: any[]): Promise<any>;
      on(channel: string, func: (...args: any[]) => void): void;
      removeListener(channel: string, func: (...args: any[]) => void): void;
    };
  }
}

export {};
