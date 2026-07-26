import { app, ipcMain, shell } from 'electron';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {
    getBackupsNode,
    loadSettingsNode,
    saveSettingsNode
} from './configManager.js';
import { GameOptimizationEngine } from './gameEngine.js';
import { wrapIpcHandler } from './ipcWrapper.js';
import { logError } from './logger.js';
import {
    execAsync,
    runElevatedPowerShellScript,
    runPowerShellScript
} from './nativeServices.js';
import { OptimizationEngine } from './optimizationEngine.js';
import {
    cachedCpuName,
    cachedOsName,
    cachedStorageDrives,
    getCpuUsageInstant,
    isMetricsPrewarmed,
    pauseMetricsPolling,
    resumeMetricsPolling,
    refreshSystemMetricsNode,
    getHardwareSpecs
} from './systemInfo.js';
import { UpdatePlatformEngine } from './updatePlatformEngine.js';
import { getAutorunsItems, toggleAutorunItem } from './autoruns.js';
import { applyNvidiaProfileMode } from './nvidiaProfileEngine.js';

const OPTIMIZATION_SCRIPTS = {
  // Hardcoded main-process map for secure execution
};

let currentMainWindow = null;
let ipcHandlersSetup = false;

export function setupIpcHandlers(mainWindow) {
  currentMainWindow = mainWindow;

  if (mainWindow) {
    // Window events are now handled centrally in windowManager.js to prevent memory leaks and duplicate listeners
  }

  if (ipcHandlersSetup) return;
  ipcHandlersSetup = true;

  const registerHandler = (channel, fn) => {
    ipcMain.handle(channel, wrapIpcHandler(channel, fn));
  };

  registerHandler('window-minimize', () => {
    if (currentMainWindow) {
      currentMainWindow.minimize();
      pauseMetricsPolling();
    }
  });

  registerHandler('window-maximize', () => {
    if (!currentMainWindow) return;
    if (currentMainWindow.isMaximized()) {
      currentMainWindow.unmaximize();
    } else {
      currentMainWindow.maximize();
    }
  });

  registerHandler('window-close', (event, minimizeToTray = true) => {
    if (!currentMainWindow) return;
    if (minimizeToTray && !app.isQuitting) {
      currentMainWindow.hide();
      pauseMetricsPolling();
    } else {
      app.isQuitting = true;
      currentMainWindow.close();
    }
  });

  registerHandler('set-auto-start', (event, { enable, openAsHidden }) => {
    try {
      app.setLoginItemSettings({
        openAtLogin: Boolean(enable),
        openAsHidden: Boolean(openAsHidden)
      });
      return true;
    } catch (e) {
      logError('Failed to set login item settings:', { error: e.message });
      return false;
    }
  });

  let systemStatusCache = null;
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

  registerHandler('execute-quick-action', async (event, actionId) => {
    if (process.platform === 'win32') {
      try {
        switch (actionId) {
          case 'flush-dns':
            await execAsync('ipconfig /flushdns');
            break;
          case 'clean-temp':
            await execAsync('del /q /f /s %TEMP%\\*').catch(() => {});
            break;
          case 'clean-junk':
            await execAsync('rd /s /q %systemdrive%\\$Recycle.bin').catch(() => {});
            break;
          case 'optimize-ram':
            await execAsync('powershell.exe -NoProfile -NonInteractive -Command "[GC]::Collect(); [GC]::WaitForPendingFinalizers()"', { windowsHide: true }).catch(() => {});
            break;
        }
      } catch (e) {
        logError('Quick action failed:', { actionId, error: e.message });
      }
    }
    return true;
  });

  registerHandler('get-optimization-counts', async () => {
    return { network: 5, cpu: 3, storage: 8, privacy: 12 };
  });

  let systemMetricsCache = null;
  let systemMetricsCacheTime = 0;

  registerHandler('get-system-metrics', async () => {
    const now = Date.now();
    if (systemMetricsCache && now - systemMetricsCacheTime < 1000) {
      return systemMetricsCache;
    }

    try {
      const freeMem = os.freemem();
      const totalMem = os.totalmem();
      const freeMemoryMB = Math.round(freeMem / (1024 * 1024));
      const totalMemoryMB = Math.round(totalMem / (1024 * 1024));
      const usedMemoryMB = totalMemoryMB - freeMemoryMB;
      const ramUsagePercent = Math.round((usedMemoryMB / totalMemoryMB) * 100);

      const cpuUsage = getCpuUsageInstant();

      systemMetricsCache = {
        success: true,
        data: {
          cpuUsage,
          freeMemoryMB,
          totalMemoryMB,
          usedMemoryMB,
          ramUsagePercent,
          osUptimeSeconds: Math.round(os.uptime()),
          osRelease: cachedOsName || `Windows ${os.release()}`, cpuName: cachedCpuName,
          platform: os.platform(),
          arch: os.arch()
        }
      };
      systemMetricsCacheTime = now;
      return systemMetricsCache;
    } catch (err) {
      return {
        success: false,
        error: { code: 'METRICS_ERROR', message: 'Sistem metrikleri okunamadı: ' + (err.message || 'Bilinmeyen hata') }
      };
    }
  });

  registerHandler('get-category-settings', async (event, categoryId) => {
    if (categoryId === 'network') {
      return [
        {
          id: 'network_throttling',
          name: 'Ağ Kısıtlamasını Kapat',
          description: 'Windows ağ kısıtlamalarını devre dışı bırakarak gecikmeyi düşürür ve paket iletimini hızlandırır.',
          status: 'default',
          impacts: {
            performance: { level: 'positive_medium', description: 'Performansa etkisi orta düzeyde olumludur.' },
            latency: { level: 'positive_high', description: 'Gecikmeyi yüksek oranda düşürür.' },
            input: { level: 'none' },
            power: { level: 'negative_low' },
            heat: { level: 'none' }
          }
        },
        {
          id: 'dns_cache',
          name: 'DNS Önbelleğini Optimize Et',
          description: 'Daha hızlı alan adı çözümlemesi için DNS kayıtlarını yapılandırır.',
          status: 'optimized',
          impacts: {
            performance: { level: 'positive_low' },
            latency: { level: 'positive_medium' },
            input: { level: 'none' },
            power: { level: 'none' },
            heat: { level: 'none' }
          }
        }
      ];
    }
    return [
      {
        id: `dummy_${categoryId}_1`,
        name: `Örnek Optimizasyon (${categoryId})`,
        description: 'Sistemden çekilen örnek ayar verisi.',
        status: 'default',
        impacts: {
          performance: { level: 'none' }
        }
      }
    ];
  });

  registerHandler('apply-optimization', async (event, payload) => {
    const { id, code } = payload || {};
    const actualCode = OPTIMIZATION_SCRIPTS[id] || code;
    if (!actualCode) return false;
    const res = await OptimizationEngine.applyOptimization(id, actualCode);
    return res.success;
  });

  registerHandler('restore-optimization', async (event, payload) => {
    const { id, code } = payload || {};
    const actualCode = OPTIMIZATION_SCRIPTS[id] || code;
    if (!actualCode) return false;
    const res = await OptimizationEngine.restoreOptimization(id, actualCode);
    return res.success;
  });

  registerHandler('apply-optimizations-batch', async (event, ids) => {
    const res = await OptimizationEngine.applyBatchOptimizations(ids, OPTIMIZATION_SCRIPTS);
    return res.success;
  });

  registerHandler('get-applied-optimizations', async () => {
    const backups = await getBackupsNode();
    return Object.keys(backups || {});
  });

  registerHandler('get-startup-items', async () => {
    return await getAutorunsItems();
  });

  registerHandler('toggle-startup-item', async (event, item) => {
    return await toggleAutorunItem(item);
  });

  registerHandler('get-installed-apps', async () => {
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
          const formatted = (Array.isArray(items) ? items : [items]).map(item => ({
            id: item.packageFullName || item.uninstallString || item.name,
            name: item.name || 'Unknown',
            publisher: item.publisher || '',
            version: item.version || '',
            type: item.type || 'desktop',
            uninstallString: item.uninstallString || '',
            packageFullName: item.packageFullName || ''
          }));
          return formatted.filter(i => i.type === 'uwp' || (i.type === 'desktop' && i.uninstallString));
        }
      } catch (e) {
        logError('Failed to get installed apps:', { error: e.message });
      }
    }
    return [
      { id: '1', name: 'Microsoft Solitaire Collection', publisher: 'Microsoft', version: '1.0.0.0', type: 'uwp', packageFullName: 'Microsoft.MicrosoftSolitaireCollection_8wekyb3d8bbwe', uninstallString: '' },
      { id: '2', name: 'Netflix', publisher: 'Netflix, Inc.', version: '6.99.5.0', type: 'uwp', packageFullName: '4DF9E0F8.Netflix_mcm4njqhnhss8', uninstallString: '' },
      { id: '3', name: 'Google Chrome', publisher: 'Google LLC', version: '114.0.5735.199', type: 'desktop', packageFullName: '', uninstallString: 'C:\\Program Files\\Google\\Chrome\\Application\\114.0.5735.199\\Installer\\setup.exe --uninstall --multi-install --chrome --system-level' }
    ];
  });

  registerHandler('uninstall-app', async (event, appToUninstall) => {
    if (process.platform === 'win32') {
      try {
        if (appToUninstall.type === 'uwp' && appToUninstall.packageFullName) {
          if (!/^[a-zA-Z0-9\._\-]+$/.test(appToUninstall.packageFullName)) {
            throw new Error('Geçersiz paket ismi.');
          }
          await execAsync(`powershell.exe -NoProfile -NonInteractive -Command "Remove-AppxPackage -Package '${appToUninstall.packageFullName}'"`);
        } else if (appToUninstall.type === 'desktop' && appToUninstall.uninstallString) {
          const uStr = appToUninstall.uninstallString.trim();
          const isWhitelisted = /msiexec|unins000\.exe|setup\.exe|uninstall\.exe/i.test(uStr);
          const hasValidPath = /^(?:[a-zA-Z]:\\|msiexec)/i.test(uStr);
          
          if (!isWhitelisted || !hasValidPath || /[&|$;`\n]/.test(uStr)) {
            throw new Error('Geçersiz veya yetkisiz kaldırma komutu.');
          }
          
          await execAsync(uStr, { shell: false });
        }
        return true;
      } catch (e) {
        logError('Uninstall failed:', { error: e.message });
        throw new Error('Kaldırma işlemi başarısız oldu: ' + e.message);
      }
    }
    return true;
  });

  registerHandler('get-cleaner-items', async () => {
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

        return [
          { id: 'temp', name: 'Geçici Dosyalar', description: 'Uygulamaların oluşturduğu gereksiz geçici dosyalar.', sizeBytes: tempSize + winTempSize },
          { id: 'recycle_bin', name: 'Geri Dönüşüm Kutusu', description: 'Silinmiş dosyaların tutulduğu alan.', sizeBytes: recycleSize },
          { id: 'prefetch', name: 'Prefetch Verileri', description: 'Program hızlandırma verileri, zamanla şişebilir.', sizeBytes: prefetchSize },
          { id: 'windows_update', name: 'Windows Update Önbelleği', description: 'Eski Windows güncelleme kalıntıları.', sizeBytes: wuSize }
        ];
      } catch (e) {
        logError('Failed to get cleaner items:', { error: e.message });
      }
    }
    return [
      { id: 'temp', name: 'Geçici Dosyalar', description: 'Uygulamaların oluşturduğu gereksiz geçici dosyalar.', sizeBytes: 0 },
      { id: 'recycle_bin', name: 'Geri Dönüşüm Kutusu', description: 'Silinmiş dosyaların tutulduğu alan.', sizeBytes: 0 },
      { id: 'prefetch', name: 'Prefetch Verileri', description: 'Program hızlandırma verileri.', sizeBytes: 0 },
      { id: 'windows_update', name: 'Windows Update Önbelleği', description: 'Eski güncelleme kalıntıları.', sizeBytes: 0 }
    ];
  });

  registerHandler('execute-cleaner', async (event, itemsToClean) => {
    if (process.platform === 'win32' && Array.isArray(itemsToClean)) {
      try {
        let cmdParts = [];
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

  registerHandler('get-all-installed-games', async () => {
    let allGames = [];
    if (process.platform === 'win32') {
      const results = await Promise.allSettled([
        scanSteamGamesNode().then(games => games.map(g => ({ ...g, launcher: 'steam' }))),
        scanEpicGamesNode(),
        scanRiotGamesNode(),
        scanEAGamesNode(),
        scanStandaloneGamesNode()
      ]);
      
      for (const res of results) {
        if (res.status === 'fulfilled' && Array.isArray(res.value)) {
          allGames.push(...res.value);
        } else if (res.status === 'rejected') {
          logError('Game scan failed:', { error: res.reason?.message });
        }
      }
    }
    return allGames;
  });

  registerHandler('launch-game', async (event, { appid, launcher }) => {
    return GameOptimizationEngine.launchGameWithOptimization(appid, launcher);
  });

  registerHandler('get-installed-steam-games', async () => {
    return scanSteamGamesNode();
  });

  registerHandler('launch-steam-game', async (event, appid) => {
    return GameOptimizationEngine.launchGameWithOptimization(appid, 'steam');
  });

  registerHandler('save-settings', async (event, settings) => {
    return saveSettingsNode(settings);
  });

  registerHandler('load-settings', async () => {
    return loadSettingsNode();
  });

  registerHandler('get-hardware-specs', async () => {
    return await getHardwareSpecs();
  });

  registerHandler('check-for-updates', async () => {
    return await UpdatePlatformEngine.checkForGitHubUpdate();
  });

  registerHandler('apply-nvidia-profile', async (event, mode) => {
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

async function getDirSizeBytesCmd(dirPath) {
  try {
    if (!dirPath || !fs.existsSync(dirPath)) return 0;
    const { stdout } = await execAsync(`cmd.exe /c "dir /s /a-d \\"${dirPath}\\" 2>nul"`, { windowsHide: true });
    if (!stdout) return 0;
    const lines = stdout.trim().split('\n');
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i];
      if (line.includes('bytes') || line.includes('bayt') || line.includes('File(s)') || line.includes('Dosya')) {
        const matches = line.match(/([\d\.,\s]+)\s+(?:bytes|bayt)/i) || line.match(/[\d\.,\s]+\s+(?:File\(s\)|Dosya)\s+([\d\.,\s]+)/i);
        if (matches && matches[1]) {
          const rawNum = matches[1].replace(/[\.,\s]/g, '');
          const num = parseInt(rawNum, 10);
          if (!isNaN(num)) return num;
        }
      }
    }
  } catch (e) {}
  return 0;
}

// --- Steam Games Scanner Helper --- //

async function getSteamPathNode() {
  if (process.platform !== 'win32') return null;
  try {
    const { stdout } = await execAsync('reg query "HKCU\\Software\\Valve\\Steam" /v "SteamPath"');
    const match = stdout.match(/SteamPath\s+REG_SZ\s+(.+)/i);
    if (match && match[1]) {
      return path.normalize(match[1].trim());
    }
  } catch (e) {}

  try {
    const { stdout } = await execAsync('reg query "HKLM\\SOFTWARE\\WOW6432Node\\Valve\\Steam" /v "InstallPath"');
    const match = stdout.match(/InstallPath\s+REG_SZ\s+(.+)/i);
    if (match && match[1]) {
      return path.normalize(match[1].trim());
    }
  } catch (e) {}

  const commonPaths = [
    'C:\\Program Files (x86)\\Steam',
    'C:\\Program Files\\Steam',
    'D:\\Steam',
    'E:\\Steam'
  ];
  for (const p of commonPaths) {
    if (fs.existsSync(p)) return path.normalize(p);
  }
  return null;
}

function parseAcfManifestNode(content) {
  const getVal = (key) => {
    const regex = new RegExp(`"${key}"\\s+"([^"]+)"`, 'i');
    const match = content.match(regex);
    return match ? match[1] : '';
  };

  const appid = getVal('appid');
  const name = getVal('name');
  const installdir = getVal('installdir');
  const sizeBytesStr = getVal('SizeOnDisk') || getVal('bytesToDownload') || '0';
  const lastPlayedStr = getVal('LastPlayed') || '0';

  return {
    appid,
    name,
    installdir,
    sizeBytes: parseInt(sizeBytesStr, 10) || 0,
    lastPlayed: parseInt(lastPlayedStr, 10) || 0
  };
}

async function scanSteamGamesNode() {
  const steamPath = await getSteamPathNode();
  if (!steamPath) return [];

  const libraryDirsMap = new Map();
  const mainAppsDir = path.join(steamPath, 'steamapps');
  if (fs.existsSync(mainAppsDir)) {
    libraryDirsMap.set(mainAppsDir.toLowerCase(), mainAppsDir);
  }

  const vdfPath = path.join(mainAppsDir, 'libraryfolders.vdf');
  if (fs.existsSync(vdfPath)) {
    try {
      const vdfContent = await fs.promises.readFile(vdfPath, 'utf8');
      const matches = vdfContent.matchAll(/"path"\s+"([^"]+)"/gi);
      for (const m of matches) {
        if (m[1]) {
          const cleanPath = path.normalize(m[1].replace(/\\\\/g, '\\'));
          const subApps = path.join(cleanPath, 'steamapps');
          if (fs.existsSync(subApps)) {
            libraryDirsMap.set(subApps.toLowerCase(), subApps);
          }
        }
      }
    } catch (e) {
      logError('Error reading libraryfolders.vdf:', { error: e.message });
    }
  }

  const IGNORED_APPIDS = new Set(['228980', '250820', '1391110', '1493710', '1007', '7']);
  const IGNORED_KEYWORDS = ['redistributable', 'proton', 'steamvr', 'soundtrack', 'dedicated server', 'sdk', 'shared dep'];

  const gamesMap = new Map();

  for (const libDir of libraryDirsMap.values()) {
    try {
      const files = await fs.promises.readdir(libDir);
      await Promise.all(files.map(async (file) => {
        if (file.startsWith('appmanifest_') && file.endsWith('.acf')) {
          try {
            const filePath = path.join(libDir, file);
            const content = await fs.promises.readFile(filePath, 'utf8');
            const data = parseAcfManifestNode(content);

            if (!data.appid || !data.name) return;
            if (gamesMap.has(data.appid)) return;
            if (IGNORED_APPIDS.has(data.appid)) return;

            const nameLower = data.name.toLowerCase();
            if (IGNORED_KEYWORDS.some(kw => nameLower.includes(kw))) return;

            let localCover = null;
            let localHeader = null;
            if (steamPath) {
              const cacheDir = path.join(steamPath, 'appcache', 'librarycache');
              const coverCandidates = [
                path.join(cacheDir, `${data.appid}_library_600x900.jpg`),
                path.join(cacheDir, `${data.appid}_library_600x900_2x.jpg`),
              ];
              const headerCandidates = [
                path.join(cacheDir, `${data.appid}_header.jpg`),
                path.join(cacheDir, `${data.appid}_library_hero.jpg`),
                path.join(cacheDir, `${data.appid}_hero_capsule.jpg`),
              ];
              for (const p of coverCandidates) {
                if (fs.existsSync(p)) {
                  localCover = 'file:///' + p.replace(/\\/g, '/');
                  break;
                }
              }
              for (const p of headerCandidates) {
                if (fs.existsSync(p)) {
                  localHeader = 'file:///' + p.replace(/\\/g, '/');
                  break;
                }
              }
            }

            gamesMap.set(data.appid, {
              appid: data.appid,
              name: data.name,
              sizeBytes: data.sizeBytes,
              installDir: data.installdir,
              lastPlayed: data.lastPlayed,
              localCover: localCover || undefined,
              localHeader: localHeader || undefined,
              headerImage: `https://cdn.cloudflare.steamstatic.com/steam/apps/${data.appid}/header.jpg`,
              coverImage: `https://cdn.cloudflare.steamstatic.com/steam/apps/${data.appid}/library_600x900.jpg`,
              heroImage: `https://cdn.cloudflare.steamstatic.com/steam/apps/${data.appid}/library_hero.jpg`
            });
          } catch (e) {}
        }
      }));
    } catch (e) {}
  }

  return Array.from(gamesMap.values());
}

async function scanEpicGamesNode() {
  const games = [];
  const manifestDir = 'C:\\ProgramData\\Epic\\EpicGamesLauncher\\Data\\Manifests';
  try {
    if (fs.existsSync(manifestDir)) {
      const files = await fs.promises.readdir(manifestDir);
      await Promise.all(files.map(async (file) => {
        if (file.endsWith('.item')) {
          try {
            const content = await fs.promises.readFile(path.join(manifestDir, file), 'utf8');
            const data = JSON.parse(content);
            if (data.AppName && data.DisplayName) {
              games.push({
                appid: data.AppName,
                name: data.DisplayName,
                launcher: 'epic',
                lastPlayed: 0,
                coverImage: null
              });
            }
          } catch (e) {}
        }
      }));
    }
  } catch (e) {}
  return games;
}

async function scanRiotGamesNode() {
  const games = [];
  const metaDir = 'C:\\ProgramData\\Riot Games\\Metadata';
  try {
    if (fs.existsSync(metaDir)) {
      const dirs = await fs.promises.readdir(metaDir);
      await Promise.all(dirs.map(async (dir) => {
        try {
          const productFile = path.join(metaDir, dir, `${dir}.product_settings.yaml`);
          if (fs.existsSync(productFile)) {
            let appid = dir.split('.')[0];
            let name = appid.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            try {
              const content = await fs.promises.readFile(productFile, 'utf8');
              const nameMatch = content.match(/product_name:\s+"([^"]+)"/i) || content.match(/product_name:\s+([^\r\n]+)/i);
              if (nameMatch && nameMatch[1]) name = nameMatch[1].trim();
            } catch(e) {}
            games.push({
              appid: appid,
              name: name,
              launcher: 'riot',
              lastPlayed: 0,
              coverImage: null
            });
          }
        } catch (e) {}
      }));
    }
  } catch (e) {}
  return games;
}

async function scanEAGamesNode() {
  const games = [];
  const installDataDir = 'C:\\ProgramData\\EA Desktop\\InstallData';
  try {
    if (fs.existsSync(installDataDir)) {
      const dirs = await fs.promises.readdir(installDataDir);
      await Promise.all(dirs.map(async (dir) => {
        try {
          let name = dir;
          let appid = dir;
          games.push({
            appid: appid,
            name: name,
            launcher: 'ea',
            lastPlayed: 0,
            coverImage: null
          });
        } catch (e) {}
      }));
    }
  } catch (e) {}
  return games;
}

async function scanStandaloneGamesNode() {
  const games = [];
  try {
    const desktopPaths = [
      'C:\\Users\\Public\\Desktop',
      path.join(os.homedir(), 'Desktop')
    ];
    
    const blacklistedPaths = ['Windows', 'System32', 'Google', 'Microsoft', 'Adobe', 'AppData', 'ProgramData'];
    const blacklistedApps = ['chrome.exe', 'msedge.exe', 'firefox.exe', 'anydesk.exe', 'cpuz.exe', 'cpu-z.exe', 'spotify.exe', 'discord.exe', 'code.exe', 'winword.exe', 'excel.exe', 'powerpnt.exe', 'devenv.exe'];

    for (const dPath of desktopPaths) {
      if (!fs.existsSync(dPath)) continue;
      
      const files = await fs.promises.readdir(dPath);
      await Promise.all(files.map(async (file) => {
        if (file.toLowerCase().endsWith('.lnk')) {
          try {
            const lnkPath = path.join(dPath, file);
            const shortcutDetails = shell.readShortcutLink(lnkPath);
            if (shortcutDetails && shortcutDetails.target) {
              const target = shortcutDetails.target;
              if (target.toLowerCase().endsWith('.exe')) {
                const targetLower = target.toLowerCase();
                
                if (blacklistedPaths.some(bp => targetLower.includes(bp.toLowerCase()))) return;
                
                const exeName = path.basename(targetLower);
                if (blacklistedApps.includes(exeName)) return;
                
                const shortcutNameWithoutLnk = file.substring(0, file.length - 4);
                
                games.push({
                  appid: target,
                  name: shortcutNameWithoutLnk,
                  launcher: 'pc',
                  lastPlayed: 0,
                  coverImage: null
                });
              }
            }
          } catch(e) {}
        }
      }));
    }
  } catch(e) {
    logError('Failed to scan standalone PC games:', { error: e.message });
  }
  return games;
}
