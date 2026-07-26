export interface IpcAPI {
  applyNvidiaProfile: (mode: 'fps' | 'aaa' | 'balanced') => Promise<boolean>;
}
