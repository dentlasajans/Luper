import path from 'path';
import { app } from 'electron';
import { nativeAddon } from '../native/nativeAddon.js';

export { nativeAddon };

export async function executeHeuristicOptimization(settingId: string, enable: boolean): Promise<any> {
  console.log(`[HeuristicEngine] Executing ${settingId} -> enable: ${enable}`);
  
  if (!nativeAddon) {
    return { success: false, error: `Addon load failed: ${loadError}, Path: ${attemptPath}` };
  }
  
  try {
    if (settingId === 'hpet_timer') {
       // If enable is true, force 0.5ms (5000 units). 
       // If enable is false, relinquish control by passing false to SetResolution.
       const res = nativeAddon.setTimerResolution(enable ? 5000 : 0, enable);
       console.log(`[HeuristicEngine] setTimerResolution executed, enable: ${enable}, Result: ${res}`);
       if (res === false) return { success: false, error: "NtSetTimerResolution API returned false." };
    } 
    else if (settingId === 'ram_cleaner') {
       if (enable) {
          const res = nativeAddon.globalMemoryClean();
          console.log(`[HeuristicEngine] globalMemoryClean executed, Result: ${res}`);
          if (res === false) return { success: false, error: "Global memory clean failed or access denied." };
       }
    }
    else {
       // Legacy empty working set fallback
       if (enable) {
          const res = nativeAddon.emptyWorkingSetOptimization();
          if (res === false) return { success: false, error: "EmptyWorkingSet Win32 API returned false." };
       }
    }
  } catch (e: any) {
    return { success: false, error: `C++ Exception: ${e.message}` };
  }

  await new Promise(r => setTimeout(r, 1000));
  return { success: true };
}
