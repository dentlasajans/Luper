import { sanitizeRegName, sanitizeRegPath } from '../core/securityManager.js';
import { WindowsExecutionEngine } from './windowsExecutionEngine.js';

export const execAsync = (command: unknown, options: unknown = {}) => {
  return WindowsExecutionEngine.execAsync(command, options);
};

export function parseRegPathAndName(code: unknown) {
  if (!code || typeof code !== 'string') return { regPath: '', regName: '' };
  
  // 1. PowerShell Set-ItemProperty / New-ItemProperty / Remove-ItemProperty
  let pathMatch = code.match(/-Path\s+(?:"([^"]+)"|'([^']+)'|(\S+))/i);
  let nameMatch = code.match(/-Name\s+(?:"([^"]+)"|'([^']+)'|(\S+))/i);
  
  let regPath = pathMatch ? (pathMatch[1] || pathMatch[2] || pathMatch[3] || '') : '';
  let regName = nameMatch ? (nameMatch[1] || nameMatch[2] || nameMatch[3] || '') : '';
  
  // 2. reg.exe add / delete (e.g. reg add "HKLM\System" /v "GameMode")
  if (!regPath || !regName) {
      const regMatch = code.match(/reg\s+(?:add|delete)\s+(?:"([^"]+)"|'([^']+)'|(\S+))/i);
      const valMatch = code.match(/\/v\s+(?:"([^"]+)"|'([^']+)'|(\S+))/i);
      if (regMatch && valMatch) {
          regPath = regMatch[1] || regMatch[2] || regMatch[3] || '';
          regName = valMatch[1] || valMatch[2] || valMatch[3] || '';
      }
  }

  // 3. C++ Native JSON payload: [{"action":"set","path":"HKLM\\System","name":"GameMode"}]
  if (!regPath || !regName) {
      if (code.trim().startsWith('[')) {
          try {
              const jsonCmds = JSON.parse(code);
              if (Array.isArray(jsonCmds) && jsonCmds.length > 0) {
                  const cmd = jsonCmds[0];
                  if (cmd.path && cmd.name) {
                      regPath = cmd.path;
                      regName = cmd.name;
                  }
              }
          } catch(e) {}
      }
  }
  
  // Normalize path
  if (regPath.startsWith('HKLM\\')) regPath = regPath.replace('HKLM\\', 'HKLM:\\');
  else if (regPath.startsWith('HKCU\\')) regPath = regPath.replace('HKCU\\', 'HKCU:\\');
  else if (regPath.startsWith('HKEY_LOCAL_MACHINE\\')) regPath = regPath.replace('HKEY_LOCAL_MACHINE\\', 'HKLM:\\');
  else if (regPath.startsWith('HKEY_CURRENT_USER\\')) regPath = regPath.replace('HKEY_CURRENT_USER\\', 'HKCU:\\');
  
  return { regPath: sanitizeRegPath(regPath), regName: sanitizeRegName(regName) };
}

export async function queryRegistryValueNode(regPath: unknown, regName: unknown) {
  return WindowsExecutionEngine.queryRegistryValue(regPath, regName);
}

export function runPowerShellScript(script: unknown) {
  return WindowsExecutionEngine.executePowerShell(script);
}

export function runElevatedPowerShellScript(script: unknown) {
  return WindowsExecutionEngine.executeElevatedPowerShell(script);
}

export function parsePowerShellToRegCmd(code: unknown) {
  if (!code || typeof code !== 'string') return null;

  const { regPath, regName } = parseRegPathAndName(code);
  const cleanPath = sanitizeRegPath(regPath);
  const cleanName = sanitizeRegName(regName);
  if (!cleanPath || !cleanName) return null;

  let winPath = cleanPath
    .replace(/^HKLM:\\/i, 'HKLM\\')
    .replace(/^HKCU:\\/i, 'HKCU\\')
    .replace(/^HKEY_LOCAL_MACHINE\\/i, 'HKLM\\')
    .replace(/^HKEY_CURRENT_USER\\/i, 'HKCU\\');

  if (code.match(/Set-ItemProperty/i)) {
    const valMatch = code.match(/-Value\s+(0x[0-9a-fA-F]+|\d+|"[^"]*"|'[^']*'|\S+)/i);
    let val = valMatch ? valMatch[1].replace(/["'&|;`$\r\n]/g, '') : '';

    const typeMatch = code.match(/-Type\s+(\w+)/i);
    let type = typeMatch ? typeMatch[1].toUpperCase() : 'REG_DWORD';
    if (type === 'DWORD') type = 'REG_DWORD';
    if (type === 'STRING' || type === 'SZ') type = 'REG_SZ';
    if (type === 'QWORD') type = 'REG_QWORD';

    if ((type === 'REG_DWORD' || type === 'REG_QWORD') && /^[0-9a-fA-F]+$/.test(val)) {
      if (!/^\d+$/.test(val) && !val.toLowerCase().startsWith('0x')) {
        val = '0x' + val;
      }
    }

    return `reg add "${winPath}" /v "${cleanName}" /t ${type} /d ${val} /f`;
  }

  if (code.match(/Remove-ItemProperty/i)) {
    return `reg delete "${winPath}" /v "${cleanName}" /f`;
  }

  return null;
}

export function runFastRegCommand(regCmd: unknown, isHklm: unknown) {
  return WindowsExecutionEngine.executeFastRegCommand(regCmd, isHklm);
}
