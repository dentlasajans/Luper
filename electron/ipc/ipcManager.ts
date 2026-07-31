import { app, ipcMain } from 'electron';
import fs from 'fs';
import os from 'os';
import {
    loadSettingsNode,
    saveSettingsNode
} from '../core/configManager.js';
import { wrapIpcHandler } from './ipcWrapper.js';
import { logError } from '../services/logger.js';
import {
    execAsync
} from '../native/nativeServices.js';
import { registerOptimizationHandlers } from './optimizationHandlers.js';
import { initHardwareIpc } from './hardwareIpc.js';
import { initGameScannerIpc, getAllGamesNode } from './gameScannerIpc.js';
import { initStatsDatabase, getFpsStats } from '../services/statsDatabase.js';
import { startBackgroundMonitor } from '../native/fpsMonitor.js';
import { getCpuUsageInstant, cachedStorageDrives } from '../native/systemInfo.js';
import { getAutorunsItems, toggleAutorunItem } from '../services/autoruns.js';
import { UpdatePlatformEngine } from '../services/updatePlatformEngine.js';
import { applyNvidiaProfileMode } from '../services/nvidiaProfileEngine.js';

let currentMainWindow: any = null;
let ipcHandlersSetup = false;

export function setupIpcHandlers(mainWindow: unknown) {
  currentMainWindow = mainWindow;

  if (mainWindow) {
    // Window events are now handled centrally in windowManager.js to prevent memory leaks and duplicate listeners
  }

  if (ipcHandlersSetup) return;
  ipcHandlersSetup = true;

  initHardwareIpc(ipcMain);
  initGameScannerIpc(ipcMain);
  initStatsDatabase();
  startBackgroundMonitor(getAllGamesNode);

  const registerHandler = (channel: string, fn: (...args: any[]) => any) => {
    ipcMain.handle(channel, wrapIpcHandler(channel, fn));
  };

  registerHandler('window-minimize', () => {
    if (currentMainWindow) {
      currentMainWindow.minimize();
    }
  });

  registerHandler('get-fps-stats', async () => {
    return getFpsStats();
  });

  registerHandler('window-maximize', () => {
    if (!currentMainWindow) return;
    if (currentMainWindow.isMaximized()) {
      currentMainWindow.unmaximize();
    } else {
      currentMainWindow.maximize();
    }
  });

  registerHandler('window-close', (_event: unknown, minimizeToTray: unknown = true) => {
    if (!currentMainWindow) return;
    if (minimizeToTray && !(app as any).isQuitting) {
      currentMainWindow.hide();
    } else {
      (app as any).isQuitting = true;
      currentMainWindow.close();
    }
  });

  registerHandler('set-auto-start', (_event: unknown, { enable, openAsHidden }: any = {}) => {
    try {
      app.setLoginItemSettings({
        openAtLogin: Boolean(enable),
        openAsHidden: Boolean(openAsHidden)
      });
      return true;
    } catch (e) {
      logError('Set auto start failed:', { error: (e as Error).message });
      return false;
    }
  });

  let systemStatusCache: any = null;
  let systemStatusCacheTime = 0;

  registerHandler('get-system-status', async () => {
    const now = Date.now();
    if (systemStatusCache && now - systemStatusCacheTime < 1000) {
      return systemStatusCache;
    }

    const cpuUsage = getCpuUsageInstant();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    
    systemStatusCache = {
      cpuUsage,
      ramUsage: {
        used: parseFloat((usedMem / (1024 ** 3)).toFixed(1)),
        total: parseFloat((totalMem / (1024 ** 3)).toFixed(1))
      },
      storage: { drives: cachedStorageDrives }
    };
    systemStatusCacheTime = now;
    return systemStatusCache;
  });

  registerHandler('execute-quick-action', (_event: unknown, actionId: unknown) => {
    if (process.platform === 'win32') {
      try {
        switch (actionId) {
          case 'flush-dns':
            execAsync('ipconfig /flushdns & ipconfig /registerdns').catch(() => {});
            break;
          case 'clean-temp':
            execAsync('cmd.exe /c "del /q /f /s %TEMP%\\* & del /q /f /s C:\\Windows\\Temp\\*"').catch(() => {});
            break;
          case 'clean-junk':
            execAsync('powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Clear-RecycleBin -Force -ErrorAction SilentlyContinue"').catch(() => {});
            execAsync('cmd.exe /c "rd /s /q %systemdrive%\\$Recycle.bin"').catch(() => {});
            break;
          case 'optimize-ram':
            const ramScript = `
$code = @'
using System;
using System.Runtime.InteropServices;
public class RAM {
    [DllImport("ntdll.dll")]
    public static extern uint NtSetSystemInformation(int InfoClass, IntPtr Info, int Length);
    [DllImport("advapi32.dll", SetLastError = true)]
    internal static extern bool OpenProcessToken(IntPtr ProcessHandle, uint DesiredAccess, out IntPtr TokenHandle);
    [DllImport("kernel32.dll", SetLastError = true)]
    internal static extern IntPtr GetCurrentProcess();
    [DllImport("advapi32.dll", SetLastError = true)]
    internal static extern bool LookupPrivilegeValue(string lpSystemName, string lpName, out long lpLuid);
    [DllImport("advapi32.dll", SetLastError = true)]
    internal static extern bool AdjustTokenPrivileges(IntPtr TokenHandle, bool DisableAllPrivileges, ref TOKEN_PRIVILEGES NewState, uint BufferLength, IntPtr PreviousState, IntPtr ReturnLength);
    [StructLayout(LayoutKind.Sequential, Pack = 1)]
    internal struct TOKEN_PRIVILEGES { public uint PrivilegeCount; public long Luid; public uint Attributes; }

    public static void Optimize() {
        IntPtr token;
        OpenProcessToken(GetCurrentProcess(), 0x0020 | 0x0008, out token);
        long luid;
        LookupPrivilegeValue(null, "SeProfileSingleProcessPrivilege", out luid);
        TOKEN_PRIVILEGES tp = new TOKEN_PRIVILEGES { PrivilegeCount = 1, Luid = luid, Attributes = 2 };
        AdjustTokenPrivileges(token, false, ref tp, 0, IntPtr.Zero, IntPtr.Zero);
        
        IntPtr p = Marshal.AllocHGlobal(4);
        Marshal.WriteInt32(p, 3);
        NtSetSystemInformation(80, p, 4);
        Marshal.WriteInt32(p, 4);
        NtSetSystemInformation(80, p, 4);
        Marshal.WriteInt32(p, 5);
        NtSetSystemInformation(80, p, 4);
        Marshal.FreeHGlobal(p);
    }
}
'@
Add-Type -TypeDefinition $code -Language CSharp
[RAM]::Optimize()
`;
            const base64Script = Buffer.from(ramScript, 'utf16le').toString('base64');
            execAsync(`powershell.exe -NoProfile -NonInteractive -WindowStyle Hidden -EncodedCommand ${base64Script}`).catch((err: unknown) => {
               logError('RAM Optimize failed internally:', err);
            });
            break;
        }
      } catch (e) {
        logError('Quick action failed:', { actionId, error: (e as Error).message });
      }
    }
    return new Promise((r) => setTimeout(() => r(true), 800));
  });

  registerOptimizationHandlers();

  registerHandler('get-startup-items', async () => {
    return await getAutorunsItems();
  });

  registerHandler('toggle-startup-item', async (_event: unknown, item: any) => {
    return await toggleAutorunItem(item);
  });

  let installedAppsCache: any[] | null = null;
  let installedAppsCacheTime = 0;

  registerHandler('get-installed-apps', async () => {
    const now = Date.now();
    if (installedAppsCache && now - installedAppsCacheTime < 60000) {
      return installedAppsCache;
    }

    if (process.platform === 'win32') {
      try {
        const script = `
          $ErrorActionPreference = "SilentlyContinue"
          
          # UWP Apps
          $appx = Get-AppxPackage | Where-Object { $_.IsFramework -eq $false -and $_.NonRemovable -eq $false } | Select-Object @{Name="name";Expression={$_.Name}}, @{Name="publisher";Expression={$_.Publisher}}, @{Name="version";Expression={$_.Version}}, @{Name="packageFullName";Expression={$_.PackageFullName}}, @{Name="type";Expression={"uwp"}}
          
          # Desktop Apps (HKLM)
          $desktop1 = Get-ItemProperty HKLM:\\Software\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | Where-Object { $_.DisplayName -ne $null -and $_.SystemComponent -ne 1 } | Select-Object @{Name="name";Expression={$_.DisplayName}}, @{Name="publisher";Expression={$_.Publisher}}, @{Name="version";Expression={$_.DisplayVersion}}, @{Name="uninstallString";Expression={if ($_.QuietUninstallString) { $_.QuietUninstallString } else { $_.UninstallString } }}, @{Name="type";Expression={"desktop"}}
          $desktop2 = Get-ItemProperty HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | Where-Object { $_.DisplayName -ne $null -and $_.SystemComponent -ne 1 } | Select-Object @{Name="name";Expression={$_.DisplayName}}, @{Name="publisher";Expression={$_.Publisher}}, @{Name="version";Expression={$_.DisplayVersion}}, @{Name="uninstallString";Expression={if ($_.QuietUninstallString) { $_.QuietUninstallString } else { $_.UninstallString } }}, @{Name="type";Expression={"desktop"}}
          $desktop3 = Get-ItemProperty HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | Where-Object { $_.DisplayName -ne $null -and $_.SystemComponent -ne 1 } | Select-Object @{Name="name";Expression={$_.DisplayName}}, @{Name="publisher";Expression={$_.Publisher}}, @{Name="version";Expression={$_.DisplayVersion}}, @{Name="uninstallString";Expression={if ($_.QuietUninstallString) { $_.QuietUninstallString } else { $_.UninstallString } }}, @{Name="type";Expression={"desktop"}}
          
          $all = @()
          if ($appx) { $all += $appx }
          if ($desktop1) { $all += $desktop1 }
          if ($desktop2) { $all += $desktop2 }
          if ($desktop3) { $all += $desktop3 }
          
          $all | Where-Object { $_.name -ne $null } | ConvertTo-Json -Compress
        `;
        
        const { stdout } = await execAsync(`powershell.exe -NoProfile -NonInteractive -Command "${script.replace(/"/g, '\"')}"`, { maxBuffer: 1024 * 1024 * 10 });
        if (stdout && stdout.trim()) {
          const items = JSON.parse(stdout);
          const formatted = (Array.isArray(items) ? items : [items]).map((item: any) => ({
            id: item.packageFullName || item.uninstallString || item.name,
            name: item.name || 'Unknown',
            publisher: item.publisher || '',
            version: item.version || '',
            type: item.type || 'desktop',
            uninstallString: item.uninstallString || '',
            packageFullName: item.packageFullName || ''
          }));
          installedAppsCache = formatted.filter((i: any) => i.type === 'uwp' || (i.type === 'desktop' && i.uninstallString));
          installedAppsCacheTime = now;
          return installedAppsCache;
        }
      } catch (e) {
        logError('Failed to get installed apps:', { error: (e as Error).message });
      }
    }
    return [
      { id: '1', name: 'Microsoft Solitaire Collection', publisher: 'Microsoft', version: '1.0.0.0', type: 'uwp', packageFullName: 'Microsoft.MicrosoftSolitaireCollection_8wekyb3d8bbwe', uninstallString: '' },
      { id: '2', name: 'Netflix', publisher: 'Netflix, Inc.', version: '6.99.5.0', type: 'uwp', packageFullName: '4DF9E0F8.Netflix_mcm4njqhnhss8', uninstallString: '' },
      { id: '3', name: 'Google Chrome', publisher: 'Google LLC', version: '114.0.5735.199', type: 'desktop', packageFullName: '', uninstallString: 'C:\\Program Files\\Google\\Chrome\\Application\\114.0.5735.199\\Installer\\setup.exe --uninstall --multi-install --chrome --system-level' }
    ];
  });

  registerHandler('uninstall-app', async (_event: unknown, appToUninstall: any) => {
    if (process.platform === 'win32') {
      try {
        if (appToUninstall?.type === 'uwp' && appToUninstall?.packageFullName) {
          if (!/^[a-zA-Z0-9\._\-]+$/.test(appToUninstall.packageFullName)) {
            throw new Error('Geçersiz paket ismi.');
          }
          await execAsync(`powershell.exe -NoProfile -NonInteractive -Command "Remove-AppxPackage -Package '${appToUninstall.packageFullName}'"`);
        } else if (appToUninstall?.type === 'desktop' && appToUninstall?.id) {
          if (!installedAppsCache) throw new Error('Uygulama listesi bulunamadı.');
          const targetApp = installedAppsCache.find((a: any) => a.id === appToUninstall.id);
          if (!targetApp || !targetApp.uninstallString) throw new Error('Kaldırma komutu bulunamadı.');
          const uStr = targetApp.uninstallString.trim();
          const isWhitelisted = /msiexec|unins000\.exe|setup\.exe|uninstall\.exe/i.test(uStr);
          const hasValidPath = /^(?:[a-zA-Z]:\\|msiexec)/i.test(uStr);
          
          if (!isWhitelisted || !hasValidPath || /[&|$;`\n]/.test(uStr)) {
            throw new Error('Geçersiz veya yetkisiz kaldırma komutu.');
          }
          
          const { spawn } = await import('child_process');
          const [cmd, ...args] = uStr.split(' ');
          await new Promise((resolve: any, reject: any) => {
            const proc = spawn(cmd, args, { shell: false });
            proc.on('close', resolve);
            proc.on('error', reject);
          });
        }
        return true;
      } catch (e) {
        logError('Uninstall failed:', { error: (e as Error).message });
        throw new Error('Kaldırma işlemi başarısız oldu: ' + (e as Error).message);
      }
    }
    return true;
  });

  let cleanerItemsCache: any = null;
  let cleanerItemsCacheTime = 0;

  registerHandler('get-cleaner-items', async () => {
    const now = Date.now();
    if (cleanerItemsCache && now - cleanerItemsCacheTime < 120000) {
      return cleanerItemsCache;
    }

    if (process.platform === 'win32') {
      try {
        const tempPath = process.env.TEMP || 'C:\\Windows\\Temp';
        const winTempPath = 'C:\\Windows\\Temp';
        const prefetchPath = 'C:\\Windows\\Prefetch';
        const wuPath = 'C:\\Windows\\SoftwareDistribution\\Download';

        const [tempSize, winTempSize, prefetchSize, wuSize, recycleSize] = await Promise.all([
          getDirSizeBytesCmd(tempPath),
          getDirSizeBytesCmd(winTempPath),
          getDirSizeBytesCmd(prefetchPath),
          getDirSizeBytesCmd(wuPath),
          getRecycleBinSizeBytes()
        ]);

        cleanerItemsCache = [
          { id: 'temp', name: 'Geçici Dosyalar', description: 'Uygulamaların oluşturduğu gereksiz geçici dosyalar.', sizeBytes: tempSize + winTempSize },
          { id: 'recycle_bin', name: 'Geri Dönüşüm Kutusu', description: 'Silinmiş dosyaların tutulduğu alan.', sizeBytes: recycleSize },
          { id: 'prefetch', name: 'Prefetch Verileri', description: 'Program hızlandırma verileri, zamanla şişebilir.', sizeBytes: prefetchSize },
          { id: 'windows_update', name: 'Windows Update Önbelleği', description: 'Eski Windows güncelleme kalıntıları.', sizeBytes: wuSize }
        ];
        cleanerItemsCacheTime = now;
        return cleanerItemsCache;
      } catch (e) {
        logError('Failed to get cleaner items:', { error: (e as Error).message });
      }
    }
    return [
      { id: 'temp', name: 'Geçici Dosyalar', description: 'Uygulamaların oluşturduğu gereksiz geçici dosyalar.', sizeBytes: 0 },
      { id: 'recycle_bin', name: 'Geri Dönüşüm Kutusu', description: 'Silinmiş dosyaların tutulduğu alan.', sizeBytes: 0 },
      { id: 'prefetch', name: 'Prefetch Verileri', description: 'Program hızlandırma verileri.', sizeBytes: 0 },
      { id: 'windows_update', name: 'Windows Update Önbelleği', description: 'Eski güncelleme kalıntıları.', sizeBytes: 0 }
    ];
  });

  registerHandler('execute-cleaner', async (_event: unknown, itemsToClean: any) => {
    if (process.platform === 'win32' && Array.isArray(itemsToClean)) {
      try {
        let cmdParts: string[] = [];
        if (itemsToClean.includes('temp')) {
          cmdParts.push('del /q /f /s "%TEMP%\\*" 2>nul');
          cmdParts.push('del /q /f /s "C:\\Windows\\Temp\\*" 2>nul');
        }
        if (itemsToClean.includes('recycle_bin')) {
          cmdParts.push('rd /s /q "C:\\$Recycle.Bin" 2>nul');
        }
        if (itemsToClean.includes('prefetch')) {
          cmdParts.push('del /q /f /s "C:\\Windows\\Prefetch\\*" 2>nul');
        }
        if (itemsToClean.includes('windows_update')) {
          cmdParts.push('del /q /f /s "C:\\Windows\\SoftwareDistribution\\Download\\*" 2>nul');
        }
        if (itemsToClean.includes('ram')) {
          cmdParts.push('powershell.exe -NoProfile -NonInteractive -Command "[GC]::Collect(); [GC]::WaitForPendingFinalizers()"');
        }

        if (cmdParts.length > 0) {
          const fullCmd = cmdParts.join(' & ');
          await execAsync(`cmd.exe /c "${fullCmd}"`, { windowsHide: true });
        }
        return true;
      } catch (e) {
        return true;
      }
    }
    return true;
  });

  registerHandler('save-settings', async (_event: unknown, settings: unknown) => {
    return saveSettingsNode(settings);
  });

  registerHandler('load-settings', async () => {
    return loadSettingsNode();
  });

  registerHandler('check-for-updates', async () => {
    return await UpdatePlatformEngine.checkForGitHubUpdate();
  });

  registerHandler('apply-nvidia-profile', async (_event: unknown, mode: any) => {
    return await applyNvidiaProfileMode(mode);
  });
}

// --- Cleaner Helpers --- //

async function getRecycleBinSizeBytes() {
  try {
    const cmd = `powershell.exe -NoProfile -NonInteractive -Command "(New-Object -ComObject Shell.Application).NameSpace(10).Items() | Measure-Object -Property Size -Sum | Select-Object -ExpandProperty Sum"`;
    const { stdout } = await execAsync(cmd, { windowsHide: true });
    const val = parseInt((stdout || '').trim(), 10);
    return isNaN(val) ? 0 : val;
  } catch (e) {
    return 0;
  }
}

async function getDirSizeBytesCmd(dirPath: any) {
  try {
    if (!dirPath || !fs.existsSync(dirPath)) return 0;
    const cmd = `powershell.exe -NoProfile -NonInteractive -Command "(Get-ChildItem -Path '${dirPath}' -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum"`;
    const { stdout } = await execAsync(cmd, { windowsHide: true });
    const val = parseInt((stdout || '').trim(), 10);
    return isNaN(val) ? 0 : val;
  } catch (e) {
    logError('Dir size parse error', { error: (e as Error)?.message });
  }
  return 0;
}
