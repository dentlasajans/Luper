import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import { sanitizeRegName, sanitizeRegPath } from './securityManager.js';

const execPromise = promisify(exec);

class WindowsExecutionEngineCore {
  constructor() {
    this.defaultTimeoutMs = 60000;
  }

  /**
   * Universal command execution wrapper with UTF-8 encoding fix
   */
  async execAsync(command, options = {}) {
    let finalCommand = command;
    if (command.includes('powershell.exe') && command.includes('-Command "')) {
      finalCommand = command.replace('-Command "', '-Command "$OutputEncoding = [System.Text.Encoding]::UTF8; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; ');
    } else if (command.startsWith('cmd.exe /c "')) {
      finalCommand = command.replace('cmd.exe /c "', 'cmd.exe /c "chcp 65001 >nul && ');
    } else if (command.startsWith('cmd.exe /c ')) {
      finalCommand = command.replace('cmd.exe /c ', 'cmd.exe /c chcp 65001 >nul && ');
    } else if (!command.startsWith('cmd.exe') && !command.startsWith('powershell.exe')) {
      finalCommand = `cmd.exe /c chcp 65001 >nul && ${command}`;
    }
    return execPromise(finalCommand, { encoding: 'utf8', windowsHide: true, ...options });
  }

  /**
   * Execute in-memory Base64 UTF-16LE PowerShell script stream
   */
  executePowerShell(script, options = {}) {
    return new Promise((resolve, reject) => {
      const child = spawn('powershell.exe', [
        '-NoProfile', '-ExecutionPolicy', 'Bypass', '-WindowStyle', 'Hidden', '-Command', '-'
      ], { windowsHide: true });

      child.stdout.setEncoding('utf8');
      child.stderr.setEncoding('utf8');

      let stdout = '';
      let stderr = '';
      child.stdout.on('data', d => stdout += d);
      child.stderr.on('data', d => stderr += d);

      const timeout = setTimeout(() => {
        child.kill();
        reject(new Error(`PowerShell Execution Timeout (${options.timeoutMs || this.defaultTimeoutMs}ms)`));
      }, options.timeoutMs || this.defaultTimeoutMs);

      child.on('close', code => {
        clearTimeout(timeout);
        if (code !== 0 && stderr) {
          reject(new Error(`PowerShell error [Exit Code ${code}]: ${stderr}`));
        } else {
          resolve({ stdout, stderr });
        }
      });

      child.on('error', err => {
        clearTimeout(timeout);
        reject(err);
      });

      const utf8Script = "$OutputEncoding = [System.Text.Encoding]::UTF8; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8;\n" + script;
      child.stdin.write("\uFEFF" + utf8Script);
      child.stdin.end();
    });
  }

  /**
   * Execute elevated PowerShell script via Base64 UTF-16LE stream
   */
  executeElevatedPowerShell(script) {
    const utf8Script = "$OutputEncoding = [System.Text.Encoding]::UTF8; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8;\n" + script;
    const encoded = Buffer.from(utf8Script, 'utf16le').toString('base64');
    const launcherScript = `$process = Start-Process powershell.exe -WindowStyle Hidden -Verb RunAs -ArgumentList '-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -EncodedCommand ${encoded}' -Wait -PassThru; if ($process.ExitCode -ne 0) { throw "ExitCode: $($process.ExitCode)" }`;
    const launcherEncoded = Buffer.from(launcherScript, 'utf16le').toString('base64');
    return this.execAsync(`powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -EncodedCommand ${launcherEncoded}`);
  }

  /**
   * Query registry key value safely
   */
  async queryRegistryValue(regPath, regName) {
    const cleanPath = sanitizeRegPath(regPath);
    const cleanName = sanitizeRegName(regName);
    if (!cleanPath || !cleanName) return { exists: false, value: '' };

    let winPath = cleanPath
      .replace(/^HKLM:\\/i, 'HKLM\\')
      .replace(/^HKCU:\\/i, 'HKCU\\')
      .replace(/^HKEY_LOCAL_MACHINE\\/i, 'HKLM\\')
      .replace(/^HKEY_CURRENT_USER\\/i, 'HKCU\\');

    try {
      const { stdout } = await this.execAsync(`reg query "${winPath}" /v "${cleanName}"`);
      if (stdout) {
        const match = stdout.match(new RegExp(`${cleanName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+(REG_\\w+)\\s+(0x[0-9a-fA-F]+|\\S+)`, 'i'));
        if (match) {
          return { exists: true, value: match[2] };
        }
      }
    } catch (e) {}

    try {
      const queryCmd = `Get-ItemPropertyValue -Path "${cleanPath}" -Name "${cleanName}" -ErrorAction SilentlyContinue`;
      const { stdout } = await this.executePowerShell(queryCmd);
      if (stdout && stdout.trim()) {
        return { exists: true, value: stdout.trim() };
      }
    } catch (e) {}

    return { exists: false, value: '' };
  }

  /**
   * Fast Reg Command execution (Native reg.exe acceleration)
   */
  executeFastRegCommand(regCmd, isHklm) {
    if (!isHklm) {
      return this.execAsync(regCmd);
    } else {
      const args = regCmd.replace(/^reg\s+/i, '').replace(/'/g, "''");
      const script = `$process = Start-Process reg.exe -WindowStyle Hidden -Verb RunAs -ArgumentList '${args}' -Wait -PassThru; if ($process.ExitCode -ne 0) { throw "ExitCode: $($process.ExitCode)" }`;
      const encoded = Buffer.from(script, 'utf16le').toString('base64');
      return this.execAsync(`powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -EncodedCommand ${encoded}`);
    }
  }

  /**
   * Windows Service Management (Start/Stop/Disable)
   */
  async manageWindowsService(serviceName, action) {
    const validActions = ['start', 'stop', 'disabled', 'automatic', 'manual'];
    if (!validActions.includes(action)) throw new Error('Invalid service action.');
    
    if (action === 'start' || action === 'stop') {
      return this.executeElevatedPowerShell(`${action.toUpperCase()}-Service -Name "${serviceName}" -Force -ErrorAction SilentlyContinue`);
    } else {
      return this.executeElevatedPowerShell(`Set-Service -Name "${serviceName}" -StartupType ${action} -ErrorAction SilentlyContinue`);
    }
  }

  /**
   * Scheduled Tasks Controller
   */
  async manageScheduledTask(taskName, enable) {
    const cmd = enable ? 'Enable-ScheduledTask' : 'Disable-ScheduledTask';
    return this.executePowerShell(`${cmd} -TaskName "${taskName}" -ErrorAction SilentlyContinue`);
  }

  /**
   * Power Configuration (powercfg.exe)
   */
  async setPowerScheme(schemeGuid) {
    return this.execAsync(`powercfg /setactive ${schemeGuid}`);
  }

  /**
   * DISM System Image Servicing
   */
  async executeDism(args) {
    return this.executeElevatedPowerShell(`Dism.exe ${args}`);
  }

  /**
   * BCDEdit Boot Configuration
   */
  async executeBcdEdit(args) {
    return this.executeElevatedPowerShell(`bcdedit.exe ${args}`);
  }
}

export const WindowsExecutionEngine = new WindowsExecutionEngineCore();
