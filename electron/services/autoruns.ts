import { runPowerShellScript, execAsync } from '../native/nativeServices.js';
import { logError } from './logger.js';

async function getAutorunsItems() {
  if (process.platform !== 'win32') return [];

  const script = `
$ErrorActionPreference = "SilentlyContinue"
$items = @()

$paths = @(
    @{
        RunPath = "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run"
        AutorunsPath = "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run\\AutorunsDisabled"
        ApprovedPath = "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\StartupApproved\\Run"
        Loc = "HKCU"
    },
    @{
        RunPath = "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run"
        AutorunsPath = "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run\\AutorunsDisabled"
        ApprovedPath = "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\StartupApproved\\Run"
        Loc = "HKLM"
    },
    @{
        RunPath = "HKLM:\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Run"
        AutorunsPath = "HKLM:\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Run\\AutorunsDisabled"
        ApprovedPath = "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\StartupApproved\\Run"
        Loc = "HKLM"
    }
)

foreach ($p in $paths) {
    if (Test-Path $p.RunPath) {
        $props = Get-ItemProperty -Path $p.RunPath
        $names = (Get-Item -Path $p.RunPath).Property
        
        if ($null -ne $names) {
            foreach ($name in $names) {
                $command = $props.$name
                $enabled = $true
                
                if (Test-Path $p.ApprovedPath) {
                    $approvedProps = Get-ItemProperty -Path $p.ApprovedPath -ErrorAction SilentlyContinue
                    $byteArr = $approvedProps.$name
                    if ($null -ne $byteArr -and $byteArr.Count -gt 0) {
                        if ($byteArr[0] % 2 -ne 0) { $enabled = $false }
                    }
                }
                
                $items += @{
                    Name = $name
                    Command = $command
                    Location = $p.Loc
                    Enabled = $enabled
                }
            }
        }
    }
    
    if (Test-Path $p.AutorunsPath) {
        $props = Get-ItemProperty -Path $p.AutorunsPath
        $names = (Get-Item -Path $p.AutorunsPath).Property
        
        if ($null -ne $names) {
            foreach ($name in $names) {
                $command = $props.$name
                $items += @{
                    Name = $name
                    Command = $command
                    Location = $p.Loc
                    Enabled = $false
                }
            }
        }
    }
}

$startupFolders = @(
    @{
        Path = "$env:APPDATA\\Microsoft\\Windows\\Start Menu\\Programs\\Startup"
        ApprovedPath = "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\StartupApproved\\StartupFolder"
        Loc = "StartupFolder"
    },
    @{
        Path = "$env:PROGRAMDATA\\Microsoft\\Windows\\Start Menu\\Programs\\StartUp"
        ApprovedPath = "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\StartupApproved\\StartupFolder"
        Loc = "StartupFolder"
    }
)

foreach ($f in $startupFolders) {
    if (Test-Path $f.Path) {
        $files = Get-ChildItem -Path $f.Path -File
        if ($null -ne $files) {
            foreach ($file in $files) {
                $name = $file.Name
                $command = $file.FullName
                $enabled = $true
                
                if (Test-Path $f.ApprovedPath) {
                    $approvedProps = Get-ItemProperty -Path $f.ApprovedPath -ErrorAction SilentlyContinue
                    $byteArr = $approvedProps.$name
                    if ($null -ne $byteArr -and $byteArr.Count -gt 0) {
                        if ($byteArr[0] % 2 -ne 0) { $enabled = $false }
                    }
                }
                
                $items += @{
                    Name = $name
                    Command = $command
                    Location = $f.Loc
                    Enabled = $enabled
                }
            }
        }
    }
}

$items | ConvertTo-Json -Compress
  `;

  try {
    // @ts-expect-error - auto fixed
    const { stdout } = await runPowerShellScript(script);
    if (stdout && stdout.trim()) {
      const items = JSON.parse(stdout.trim());
      const formatted = (Array.isArray(items) ? items : [items]).map((item: unknown) => ({
        // @ts-expect-error - auto fixed
        name: item.Name || item.name || 'Unknown',
        // @ts-expect-error - auto fixed
        command: item.Command || item.command || '',
        // @ts-expect-error - auto fixed
        location: item.Location || item.location || '',
        // @ts-expect-error - auto fixed
        enabled: item.Enabled !== undefined ? item.Enabled : (item.enabled !== undefined ? item.enabled : true)
      }));
      return formatted;
    }
    return [];
  } catch (error) {
    logError('Failed to get startup items from registry:', { error: (error as Error).message });
    return [];
  }
}

async function toggleAutorunItem(item: unknown) {
  if (process.platform !== 'win32') return true;

  // @ts-expect-error - auto fixed
  const { name, location, command, enabled } = item;

  try {
    const safeName = (name || '').replace(/[`$()&|;'"\n\r\\]/g, '');
    const safeLoc = (location || '').replace(/[`$()&|;'"\n\r\\]/g, '');
    const safeCmdPath = (command || '').replace(/[`$()&|;'"\n\r]/g, '');
    
    // UI gives us the CURRENT state, so if we toggle it, we invert it
    const isEnabled = (!enabled) ? 'true' : 'false';

    const scriptRaw = `
      $ErrorActionPreference = "SilentlyContinue"
      $name = "${safeName}"
      $loc = "${safeLoc}"
      $cmdPath = "${safeCmdPath}"
      
      if ($loc -eq "StartupFolder") {
        $approvedPath = "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\StartupApproved\\StartupFolder"
        if ($cmdPath -match "ProgramData") {
            $approvedPath = "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\StartupApproved\\StartupFolder"
        }
        if (!(Test-Path $approvedPath)) {
            New-Item -Path $approvedPath -Force | Out-Null
        }
        if ("${isEnabled}" -eq "true") {
            $bytes = [byte[]](0x02,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00)
        } else {
            $bytes = [byte[]](0x03,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00)
        }
        Set-ItemProperty -Path $approvedPath -Name $name -Value $bytes -Type Binary
      }
      elseif ($loc -eq "HKCU" -or $loc -eq "HKLM") {
        $approvedPath = "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\StartupApproved\\Run"
        $runPath = "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run"
        $autorunsPath = "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run\\AutorunsDisabled"
        
        if ($loc -eq "HKLM") {
            $approvedPath = "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\StartupApproved\\Run"
            $runPath = "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run"
            $autorunsPath = "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run\\AutorunsDisabled"
            
            if (-not (Get-ItemProperty -Path $runPath -Name $name -ErrorAction SilentlyContinue) -and 
                -not (Get-ItemProperty -Path $autorunsPath -Name $name -ErrorAction SilentlyContinue)) {
                $runPath = "HKLM:\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Run"
                $autorunsPath = "HKLM:\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Run\\AutorunsDisabled"
            }
        }
        
        if ("${isEnabled}" -eq "true") {
            $val = Get-ItemProperty -Path $autorunsPath -Name $name -ErrorAction SilentlyContinue
            if ($null -ne $val) {
                $cmd = $val.$name
                Set-ItemProperty -Path $runPath -Name $name -Value $cmd
                Remove-ItemProperty -Path $autorunsPath -Name $name
            }
        }
        
        if (!(Test-Path $approvedPath)) {
            New-Item -Path $approvedPath -Force | Out-Null
        }
        
        if ("${isEnabled}" -eq "true") {
            $bytes = [byte[]](0x02,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00)
        } else {
            $bytes = [byte[]](0x03,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00)
        }
        Set-ItemProperty -Path $approvedPath -Name $name -Value $bytes -Type Binary
      }
      else {
        if ("${isEnabled}" -eq "true") {
          Enable-ScheduledTask -TaskName $name
        } else {
          Disable-ScheduledTask -TaskName $name
        }
      }
    `;

    const b64Script = Buffer.from(scriptRaw, 'utf16le').toString('base64');
    
    if (safeLoc === 'HKLM') {
      await execAsync(`powershell.exe -NoProfile -NonInteractive -Command "Start-Process powershell.exe -ArgumentList '-NoProfile -NonInteractive -ExecutionPolicy Bypass -EncodedCommand ${b64Script}' -Verb RunAs -WindowStyle Hidden"`, { shell: false });
    } else {
      await execAsync(`powershell.exe -NoProfile -NonInteractive -ExecutionPolicy Bypass -EncodedCommand ${b64Script}`, { shell: false });
    }
    return true;
  } catch (e) {
    logError('Failed to toggle startup item:', { error: (e as Error).message });
    return false;
  }
}

export { getAutorunsItems, toggleAutorunItem };
