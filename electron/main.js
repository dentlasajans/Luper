import { app, BrowserWindow, ipcMain, Tray, Menu } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

import fs from 'fs';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- State Backup & Restore Helpers --- //

// --- State Backup & Restore Helpers --- //

function getBackupFilePath() {
  try {
    const dir = app.getPath('userData');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    return path.join(dir, 'optimization_backups.json');
  } catch (e) {
    return path.join(__dirname, 'optimization_backups.json');
  }
}

function getBackupsNode() {
  try {
    const p = getBackupFilePath();
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, 'utf8'));
    }
  } catch (e) {
    console.error('Failed to read backups:', e);
  }
  return {};
}

function saveBackupNode(id, regPath, regName, originalValue, exists) {
  try {
    const backups = getBackupsNode();
    if (!backups[id]) {
      backups[id] = { regPath, regName, originalValue: String(originalValue), exists: Boolean(exists) };
      fs.writeFileSync(getBackupFilePath(), JSON.stringify(backups, null, 2), 'utf8');
      console.log(`Saved pre-optimization backup for [${id}]:`, backups[id]);
    }
  } catch (e) {
    console.error(`Failed to save backup for [${id}]:`, e);
  }
}

function deleteBackupNode(id) {
  try {
    const backups = getBackupsNode();
    if (backups[id]) {
      delete backups[id];
      fs.writeFileSync(getBackupFilePath(), JSON.stringify(backups, null, 2), 'utf8');
      console.log(`Deleted optimization backup for [${id}]`);
    }
  } catch (e) {
    console.error(`Failed to delete backup for [${id}]:`, e);
  }
}

function parseRegPathAndName(code) {
  if (!code) return { regPath: '', regName: '' };
  const pathMatch = code.match(/-Path\s+(?:"([^"]+)"|'([^']+)'|(\S+))/i);
  const nameMatch = code.match(/-Name\s+(?:"([^"]+)"|'([^']+)'|(\S+))/i);
  const regPath = pathMatch ? (pathMatch[1] || pathMatch[2] || pathMatch[3] || '') : '';
  const regName = nameMatch ? (nameMatch[1] || nameMatch[2] || nameMatch[3] || '') : '';
  return { regPath: regPath.trim(), regName: regName.trim() };
}

async function queryRegistryValueNode(regPath, regName) {
  if (!regPath || !regName) return { exists: false, value: '' };

  let winPath = regPath
    .replace(/^HKLM:\\/i, 'HKLM\\')
    .replace(/^HKCU:\\/i, 'HKCU\\')
    .replace(/^HKEY_LOCAL_MACHINE\\/i, 'HKLM\\')
    .replace(/^HKEY_CURRENT_USER\\/i, 'HKCU\\');

  try {
    const { stdout } = await execAsync(`reg query "${winPath}" /v "${regName}"`);
    if (stdout) {
      const match = stdout.match(new RegExp(`${regName}\\s+(REG_\\w+)\\s+(0x[0-9a-fA-F]+|\\S+)`, 'i'));
      if (match) {
        return { exists: true, value: match[2] };
      }
    }
  } catch (e) {}

  try {
    const queryCmd = `Get-ItemPropertyValue -Path "${regPath}" -Name "${regName}" -ErrorAction SilentlyContinue`;
    const { stdout } = await execAsync(`powershell.exe -NoProfile -NonInteractive -Command "${queryCmd}"`);
    if (stdout && stdout.trim()) {
      return { exists: true, value: stdout.trim() };
    }
  } catch (e) {}

  return { exists: false, value: '' };
}

function runPowerShellScript(script) {
  const encoded = Buffer.from(script, 'utf16le').toString('base64');
  return execAsync(`powershell.exe -NoProfile -ExecutionPolicy Bypass -EncodedCommand ${encoded}`);
}

function runElevatedPowerShellScript(script) {
  const encoded = Buffer.from(script, 'utf16le').toString('base64');
  return execAsync(`powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Start-Process powershell.exe -Verb RunAs -ArgumentList '-NoProfile -ExecutionPolicy Bypass -EncodedCommand ${encoded}'"`);
}

// --- Real System Data Helpers --- //

let lastCpuTimes = null;

function getCpuUsageInstant() {
  const cpus = os.cpus();
  let idle = 0, total = 0;
  for (const cpu of cpus) {
    for (const type in cpu.times) { total += cpu.times[type]; }
    idle += cpu.times.idle;
  }

  if (!lastCpuTimes) {
    lastCpuTimes = { idle, total };
    return 0;
  }

  const idleDiff = idle - lastCpuTimes.idle;
  const totalDiff = total - lastCpuTimes.total;
  lastCpuTimes = { idle, total };

  return totalDiff === 0 ? 0 : Math.min(100, Math.max(0, Math.round(100 - (100 * idleDiff / totalDiff))));
}

async function getStorage() {
  if (process.platform === 'win32') {
    try {
      const { stdout } = await execAsync('powershell.exe -NoProfile -NonInteractive -Command "Get-CimInstance Win32_LogicalDisk | Select-Object DeviceID, FreeSpace, Size | ConvertTo-Json"');
      if (stdout && stdout.trim()) {
        const items = JSON.parse(stdout);
        const drives = (Array.isArray(items) ? items : [items])
          .filter(d => d.Size && d.Size > 0)
          .map(d => ({
            name: d.DeviceID,
            type: 'Disk',
            total: Math.round(d.Size / (1024 ** 3)),
            free: Math.round(d.FreeSpace / (1024 ** 3))
          }));
        if (drives.length > 0) return drives;
      }
    } catch (e) {
      console.error('Storage info error:', e);
    }
    return [{ name: 'C:', type: 'Disk', free: 200, total: 500 }];
  }
  return [{ name: '/', type: 'Disk', free: 100, total: 250 }]; 
}

async function getNetworkLatency() {
  if (process.platform === 'win32') {
    try {
      const { stdout } = await execAsync('ping -n 1 8.8.8.8');
      const match = stdout.match(/time=(\d+)ms/i) || stdout.match(/s\u00fcre=(\d+)ms/i);
      if (match) return parseInt(match[1]);
    } catch (e) {}
  }
  return 15;
}

async function getFirewallStatus() {
  if (process.platform === 'win32') {
    try {
      const { stdout } = await execAsync('netsh advfirewall show currentprofile');
      return stdout.toLowerCase().includes('on') || stdout.toLowerCase().includes('açık');
    } catch (e) {}
  }
  return true;
}

// --- IPC Handlers Setup --- //

function setupIpcHandlers(mainWindow) {
  ipcMain.handle('window-minimize', () => {
    mainWindow.minimize();
  });

  ipcMain.handle('window-maximize', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.handle('window-close', (event, minimizeToTray = true) => {
    if (minimizeToTray && !app.isQuitting) {
      mainWindow.hide();
    } else {
      app.isQuitting = true;
      mainWindow.close();
    }
  });

  ipcMain.handle('set-auto-start', (event, { enable, openAsHidden }) => {
    try {
      app.setLoginItemSettings({
        openAtLogin: Boolean(enable),
        openAsHidden: Boolean(openAsHidden)
      });
      return true;
    } catch (e) {
      console.error('Failed to set login item settings:', e);
      return false;
    }
  });

  ipcMain.handle('get-system-status', async () => {
    const cpuUsage = getCpuUsageInstant();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    
    const drives = await getStorage();
    const latency = await getNetworkLatency();
    const firewall = await getFirewallStatus();
    
    return {
      cpuUsage,
      ramUsage: {
        used: parseFloat((usedMem / (1024 ** 3)).toFixed(1)),
        total: parseFloat((totalMem / (1024 ** 3)).toFixed(1))
      },
      storage: { drives },
      network: { latency },
      firewall
    };
  });

  ipcMain.handle('execute-quick-action', async (event, actionId) => {
    if (process.platform === 'win32') {
      try {
        switch (actionId) {
          case 'flush-dns':
            await execAsync('ipconfig /flushdns');
            break;
          case 'clean-temp':
            await execAsync('del /q /f /s %TEMP%\*').catch(() => {});
            break;
          case 'clean-junk':
            await execAsync('rd /s /q %systemdrive%\$Recycle.bin').catch(() => {});
            break;
          case 'optimize-ram':
            // Simulating success as standard node can't easily free standby memory
            await new Promise(r => setTimeout(r, 500));
            break;
        }
      } catch (e) {
        console.error('Quick action failed:', e);
      }
    }
    return true;
  });

  ipcMain.handle('get-optimization-counts', async () => {
    return { network: 5, cpu: 3, storage: 8, privacy: 12 };
  });

  ipcMain.handle('get-category-settings', async (event, categoryId) => {
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
    // Fallback dummy settings for other categories
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

function parseRegPathAndName(code) {
  if (!code) return { regPath: '', regName: '' };
  const pathMatch = code.match(/-Path\s+(?:"([^"]+)"|'([^']+)'|(\S+))/i);
  const nameMatch = code.match(/-Name\s+(?:"([^"]+)"|'([^']+)'|(\S+))/i);
  const regPath = pathMatch ? (pathMatch[1] || pathMatch[2] || pathMatch[3] || '') : '';
  const regName = nameMatch ? (nameMatch[1] || nameMatch[2] || nameMatch[3] || '') : '';
  return { regPath: regPath.trim(), regName: regName.trim() };
}

function runPowerShellScript(script) {
  const encoded = Buffer.from(script, 'utf16le').toString('base64');
  return execAsync(`powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -EncodedCommand ${encoded}`, { windowsHide: true });
}

function runElevatedPowerShellScript(script) {
  const encoded = Buffer.from(script, 'utf16le').toString('base64');
  return execAsync(`powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -Command "Start-Process powershell.exe -WindowStyle Hidden -Verb RunAs -ArgumentList '-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -EncodedCommand ${encoded}'"`, { windowsHide: true });
}

function parsePowerShellToRegCmd(code) {
  if (!code) return null;

  const { regPath, regName } = parseRegPathAndName(code);
  if (!regPath || !regName) return null;

  let winPath = regPath
    .replace(/^HKLM:\\/i, 'HKLM\\')
    .replace(/^HKCU:\\/i, 'HKCU\\')
    .replace(/^HKEY_LOCAL_MACHINE\\/i, 'HKLM\\')
    .replace(/^HKEY_CURRENT_USER\\/i, 'HKCU\\');

  if (code.match(/Set-ItemProperty/i)) {
    const valMatch = code.match(/-Value\s+(0x[0-9a-fA-F]+|\d+|"[^"]*"|'[^']*'|\S+)/i);
    let val = valMatch ? valMatch[1] : '';

    const typeMatch = code.match(/-Type\s+(\w+)/i);
    let type = typeMatch ? typeMatch[1].toUpperCase() : 'REG_DWORD';
    if (type === 'DWORD') type = 'REG_DWORD';
    if (type === 'STRING' || type === 'SZ') type = 'REG_SZ';
    if (type === 'QWORD') type = 'REG_QWORD';

    return `reg add "${winPath}" /v "${regName}" /t ${type} /d ${val} /f`;
  }

  if (code.match(/Remove-ItemProperty/i)) {
    return `reg delete "${winPath}" /v "${regName}" /f`;
  }

  return null;
}

function runFastRegCommand(regCmd, isHklm) {
  if (!isHklm) {
    return execAsync(regCmd, { windowsHide: true });
  } else {
    const script = `Start-Process reg.exe -WindowStyle Hidden -Verb RunAs -ArgumentList '${regCmd.replace(/^reg\s+/i, '').replace(/'/g, "''")}'`;
    const encoded = Buffer.from(script, 'utf16le').toString('base64');
    return execAsync(`powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -EncodedCommand ${encoded}`, { windowsHide: true });
  }
}

  ipcMain.handle('apply-optimization', async (event, payload) => {
    const { id, code } = payload || {};
    if (process.platform === 'win32' && code) {
      const { regPath, regName } = parseRegPathAndName(code);

      // Pre-optimization backup in Node (takes 15ms)
      if (regPath && regName) {
        const current = await queryRegistryValueNode(regPath, regName);
        saveBackupNode(id, regPath, regName, current.value, current.exists);
      }

      const isHklm = code.toUpperCase().includes('HKLM') || code.toUpperCase().includes('HKEY_LOCAL_MACHINE');
      const fastRegCmd = parsePowerShellToRegCmd(code);

      try {
        if (fastRegCmd) {
          await runFastRegCommand(fastRegCmd, isHklm);
        } else if (!isHklm) {
          await runPowerShellScript(code);
        } else {
          await runElevatedPowerShellScript(code);
        }
      } catch (e) {
        console.error(`Apply optimization [${id}] failed:`, e);
        throw new Error('Yönetici izni gereklidir. Lütfen açılan UAC penceresini onaylayın veya uygulamayı Yönetici olarak çalıştırın.');
      }
    }
    return true;
  });

  ipcMain.handle('restore-optimization', async (event, payload) => {
    const { id, code } = payload || {};
    if (process.platform === 'win32') {
      const backups = getBackupsNode();
      const backup = backups[id];

      let restoreCode = code;

      if (backup && backup.regPath && backup.regName) {
        if (backup.exists && backup.originalValue !== undefined && backup.originalValue !== '') {
          restoreCode = `Set-ItemProperty -Path "${backup.regPath}" -Name "${backup.regName}" -Value ${backup.originalValue} -ErrorAction SilentlyContinue`;
        } else if (backup.exists === false) {
          restoreCode = `Remove-ItemProperty -Path "${backup.regPath}" -Name "${backup.regName}" -ErrorAction SilentlyContinue`;
        }
      }

      if (!restoreCode) return true;

      const isHklm = restoreCode.toUpperCase().includes('HKLM') || restoreCode.toUpperCase().includes('HKEY_LOCAL_MACHINE');
      const fastRegCmd = parsePowerShellToRegCmd(restoreCode);

      try {
        if (fastRegCmd) {
          await runFastRegCommand(fastRegCmd, isHklm);
        } else if (!isHklm) {
          await runPowerShellScript(restoreCode);
        } else {
          await runElevatedPowerShellScript(restoreCode);
        }
        deleteBackupNode(id);
      } catch (e) {
        console.error(`Restore optimization [${id}] failed:`, e);
        throw new Error('Yönetici izni gereklidir. Lütfen açılan UAC penceresini onaylayın veya uygulamayı Yönetici olarak çalıştırın.');
      }
    }
    deleteBackupNode(id);
    return true;
  });

  ipcMain.handle('get-applied-optimizations', async () => {
    const backups = getBackupsNode();
    return Object.keys(backups);
  });

  ipcMain.handle('get-startup-items', async () => {
    if (process.platform === 'win32') {
      try {
        const { stdout } = await execAsync('powershell.exe -NoProfile -NonInteractive -Command "Get-CimInstance Win32_StartupCommand | Select-Object Name, Command, Location, User | ConvertTo-Json"');
        if (stdout && stdout.trim()) {
          const items = JSON.parse(stdout);
          const formatted = (Array.isArray(items) ? items : [items]).map(item => ({
            name: item.Name || 'Unknown',
            command: item.Command || '',
            location: item.Location || '',
            user: item.User || '',
            enabled: true
          }));
          return formatted;
        }
      } catch (e) {
        console.error('Failed to get startup items:', e);
      }
    }
    // Fallback data if fails or not windows
    return [
      { name: 'OneDrive', command: '"C:\\Program Files\\OneDrive.exe"', location: 'HKCU', user: 'Admin', enabled: true },
      { name: 'Discord', command: '"C:\\Users\\Admin\\AppData\\Local\\Discord.exe"', location: 'HKCU', user: 'Admin', enabled: true },
      { name: 'Spotify', command: '"C:\\Users\\Admin\\AppData\\Roaming\\Spotify\\Spotify.exe"', location: 'HKCU', user: 'Admin', enabled: true },
      { name: 'EpicGamesLauncher', command: '"C:\\Program Files (x86)\\Epic Games\\Launcher\\Portal\\Binaries\\Win64\\EpicGamesLauncher.exe"', location: 'HKLM', user: 'Public', enabled: false }
    ];
  });

  ipcMain.handle('toggle-startup-item', async (event, { name, command, enabled }) => {
    if (process.platform === 'win32') {
      // In a real app we'd manipulate HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\StartupApproved\Run
      // For this demo we'll just simulate a delay
      await new Promise(r => setTimeout(r, 500));
      return true;
    }
    return true;
  });


  
  ipcMain.handle('get-installed-apps', async () => {
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
          // filter out items with no way to uninstall
          return formatted.filter(i => i.type === 'uwp' || (i.type === 'desktop' && i.uninstallString));
        }
      } catch (e) {
        console.error('Failed to get installed apps:', e);
      }
    }
    // Fallback data
    return [
      { id: '1', name: 'Microsoft Solitaire Collection', publisher: 'Microsoft', version: '1.0.0.0', type: 'uwp', packageFullName: 'Microsoft.MicrosoftSolitaireCollection_8wekyb3d8bbwe', uninstallString: '' },
      { id: '2', name: 'Netflix', publisher: 'Netflix, Inc.', version: '6.99.5.0', type: 'uwp', packageFullName: '4DF9E0F8.Netflix_mcm4njqhnhss8', uninstallString: '' },
      { id: '3', name: 'Google Chrome', publisher: 'Google LLC', version: '114.0.5735.199', type: 'desktop', packageFullName: '', uninstallString: 'C:\\Program Files\\Google\\Chrome\\Application\\114.0.5735.199\\Installer\\setup.exe --uninstall --multi-install --chrome --system-level' }
    ];
  });

  ipcMain.handle('uninstall-app', async (event, app) => {
    if (process.platform === 'win32') {
      try {
        if (app.type === 'uwp' && app.packageFullName) {
          await execAsync(`powershell.exe -NoProfile -NonInteractive -Command "Remove-AppxPackage -Package '${app.packageFullName}'"`);
        } else if (app.type === 'desktop' && app.uninstallString) {
          await execAsync(app.uninstallString);
        }
        return true;
      } catch (e) {
        console.error('Uninstall failed:', e);
        throw new Error('Kaldırma işlemi başarısız oldu: ' + e.message);
      }
    }
    return true;
  });


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

  ipcMain.handle('get-cleaner-items', async () => {
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
        console.error('Failed to get cleaner items:', e);
      }
    }
    return [
      { id: 'temp', name: 'Geçici Dosyalar', description: 'Uygulamaların oluşturduğu gereksiz geçici dosyalar.', sizeBytes: 0 },
      { id: 'recycle_bin', name: 'Geri Dönüşüm Kutusu', description: 'Silinmiş dosyaların tutulduğu alan.', sizeBytes: 0 },
      { id: 'prefetch', name: 'Prefetch Verileri', description: 'Program hızlandırma verileri.', sizeBytes: 0 },
      { id: 'windows_update', name: 'Windows Update Önbelleği', description: 'Eski güncelleme kalıntıları.', sizeBytes: 0 }
    ];
  });

  ipcMain.handle('execute-cleaner', async (event, itemsToClean) => {
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

        if (cmdParts.length > 0) {
          const fullCmd = cmdParts.join(' & ');
          await execAsync(`cmd.exe /c "${fullCmd}"`, { windowsHide: true });
        }
        return true;
      } catch (e) {
        // Silently skip locked files / permissions without popup or error
        return true;
      }
    }
    return true;
  });

  ipcMain.handle('get-installed-steam-games', async () => {
    if (process.platform === 'win32') {
      try {
        const games = await scanSteamGamesNode();
        if (games.length > 0) return games;
      } catch (e) {
        console.error('Failed to scan Steam games:', e);
      }
    }
    return [];
  });

  ipcMain.handle('launch-steam-game', async (event, appid) => {
    if (process.platform === 'win32' && appid) {
      try {
        await execAsync(`cmd.exe /c start steam://run/${appid}`, { windowsHide: true });
        return true;
      } catch (e) {
        console.error(`Failed to launch Steam game [${appid}]:`, e);
      }
    }
    return true;
  });

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

  const libraryDirsMap = new Map(); // normalized -> actual path
  const mainAppsDir = path.join(steamPath, 'steamapps');
  if (fs.existsSync(mainAppsDir)) {
    libraryDirsMap.set(mainAppsDir.toLowerCase(), mainAppsDir);
  }

  // Parse libraryfolders.vdf
  const vdfPath = path.join(mainAppsDir, 'libraryfolders.vdf');
  if (fs.existsSync(vdfPath)) {
    try {
      const vdfContent = fs.readFileSync(vdfPath, 'utf8');
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
      console.error('Error reading libraryfolders.vdf:', e);
    }
  }

  const IGNORED_APPIDS = new Set(['228980', '250820', '1391110', '1493710', '1007', '7']);
  const IGNORED_KEYWORDS = ['redistributable', 'proton', 'steamvr', 'soundtrack', 'dedicated server', 'sdk', 'shared dep'];

  const gamesMap = new Map();

  for (const libDir of libraryDirsMap.values()) {
    try {
      const files = fs.readdirSync(libDir);
      for (const file of files) {
        if (file.startsWith('appmanifest_') && file.endsWith('.acf')) {
          try {
            const filePath = path.join(libDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const data = parseAcfManifestNode(content);

            if (!data.appid || !data.name) continue;
            if (gamesMap.has(data.appid)) continue;
            if (IGNORED_APPIDS.has(data.appid)) continue;

            const nameLower = data.name.toLowerCase();
            if (IGNORED_KEYWORDS.some(kw => nameLower.includes(kw))) continue;

            // Scan local Steam appcache for images (most reliable - Steam always downloads these)
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
      }
    } catch (e) {}
  }

  return Array.from(gamesMap.values());
}

// --- App Lifecycle --- //

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1520,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    maximizable: false,
    center: true,
    frame: false,
    transparent: false,
    backgroundColor: '#121214',
    icon: path.join(__dirname, '../public/icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    }
  });

  // Setup IPC Handlers
  setupIpcHandlers(mainWindow);

  let tray = null;
  const iconPath = path.join(__dirname, '../public/icon.ico');
  if (fs.existsSync(iconPath)) {
    try {
      tray = new Tray(iconPath);
      const contextMenu = Menu.buildFromTemplate([
        { label: 'Luper Windows Optimizer', enabled: false },
        { type: 'separator' },
        { label: 'Aç / Göster', click: () => { mainWindow.show(); mainWindow.focus(); } },
        { label: 'Çıkış', click: () => { app.isQuitting = true; app.quit(); } }
      ]);
      tray.setToolTip('Luper Windows Optimizer');
      tray.setContextMenu(contextMenu);
      tray.on('double-click', () => {
        mainWindow.show();
        mainWindow.focus();
      });
    } catch (e) {}
  }

  if (process.env.NODE_ENV?.trim() === 'development' || process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
