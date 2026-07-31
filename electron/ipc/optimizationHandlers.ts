import { ipcMain } from 'electron';
import { wrapIpcHandler } from './ipcWrapper.js';
import { OptimizationEngine } from '../services/optimizationEngine.js';
import { getBackupsNode } from '../core/configManager.js';
import { applyNvidiaProfileMode } from '../services/nvidiaProfileEngine.js';

const OPTIMIZATION_SCRIPTS = {
  'irq_gpu_nic': `
$gpu = Get-CimInstance Win32_VideoController | Select-Object -First 1
$net = Get-NetAdapter | Where-Object Status -eq 'Up' | Select-Object -First 1
if ($gpu -and $gpu.PNPDeviceID) {
    $gpuPath = "HKLM:\\System\\CurrentControlSet\\Enum\\$($gpu.PNPDeviceID)\\Device Parameters\\Interrupt Management\\AffinityPolicy"
    if (!(Test-Path $gpuPath)) { New-Item -Path $gpuPath -Force | Out-Null }
    Set-ItemProperty -Path $gpuPath -Name "DevicePolicy" -Value 4 -Type DWord -Force
    Set-ItemProperty -Path $gpuPath -Name "AssignmentSetOverride" -Value ([byte[]](0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00)) -Type Binary -Force
}
if ($net -and $net.PNPDeviceID) {
    $netPath = "HKLM:\\System\\CurrentControlSet\\Enum\\$($net.PNPDeviceID)\\Device Parameters\\Interrupt Management\\AffinityPolicy"
    if (!(Test-Path $netPath)) { New-Item -Path $netPath -Force | Out-Null }
    Set-ItemProperty -Path $netPath -Name "DevicePolicy" -Value 4 -Type DWord -Force
    Set-ItemProperty -Path $netPath -Name "AssignmentSetOverride" -Value ([byte[]](0x10, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00)) -Type Binary -Force
}
  `,
  'hpet_timer': `
# HKLM
$code = @'
using System;
using System.Runtime.InteropServices;
public class TimerRes {
    [DllImport("ntdll.dll")]
    public static extern int NtSetTimerResolution(uint DesiredResolution, bool SetResolution, out uint CurrentResolution);
    public static void Set() {
        uint current;
        NtSetTimerResolution(5000, true, out current);
    }
}
'@
Add-Type -TypeDefinition $code -Language CSharp -IgnoreWarnings
[TimerRes]::Set()
bcdedit /set useplatformclock false
bcdedit /set disabledynamictick yes
  `
};

export function registerOptimizationHandlers() {
  const registerHandler = (channel: string, fn: (...args: any[]) => any) => {
    ipcMain.handle(channel, wrapIpcHandler(channel, fn));
  };

  // @ts-expect-error - auto fixed
  registerHandler('apply-optimization', async (event: unknown, payload: unknown) => {
    // @ts-expect-error - auto fixed
    const { id, status } = payload || {};
    
    // Intercept Nvidia GPU Profile
    if (id === 'gpu_nvidia_profile') {
       if (status) {
          await applyNvidiaProfileMode(status as string);
       }
       return true;
    }

    // @ts-expect-error - auto fixed
    const providedCode = payload?.code;
    const actualCode = OPTIMIZATION_SCRIPTS[id as keyof typeof OPTIMIZATION_SCRIPTS] || providedCode;
    
    if (!actualCode) return false;
    
    const res = await OptimizationEngine.applyOptimization(id, actualCode);
    return res.success;
  });

  // @ts-expect-error - auto fixed
  registerHandler('restore-optimization', async (event: unknown, payload: unknown) => {
    // @ts-expect-error - auto fixed
    const { id } = payload || {};
    // @ts-expect-error - auto fixed
    const providedCode = payload?.code;
    const actualCode = OPTIMIZATION_SCRIPTS[id as keyof typeof OPTIMIZATION_SCRIPTS] || providedCode;
    
    if (!actualCode) return false;
    const res = await OptimizationEngine.restoreOptimization(id, actualCode);
    return res.success;
  });

  // @ts-expect-error - auto fixed
  registerHandler('apply-optimizations-batch', async (event: unknown, ids: unknown) => {
    const res = await OptimizationEngine.applyBatchOptimizations(ids, OPTIMIZATION_SCRIPTS);
    return res.success;
  });

  registerHandler('get-applied-optimizations', async () => {
    const backups = await getBackupsNode();
    return Object.keys(backups || {});
  });
}
