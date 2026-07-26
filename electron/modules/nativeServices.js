import { sanitizeRegName, sanitizeRegPath } from './securityManager.js';
import { WindowsExecutionEngine } from './windowsExecutionEngine.js';

export const execAsync = (command, options = {}) => {
  return WindowsExecutionEngine.execAsync(command, options);
};

export function parseRegPathAndName(code) {
  if (!code || typeof code !== 'string') return { regPath: '', regName: '' };
  const pathMatch = code.match(/-Path\s+(?:"([^"]+)"|'([^']+)'|(\S+))/i);
  const nameMatch = code.match(/-Name\s+(?:"([^"]+)"|'([^']+)'|(\S+))/i);
  const regPath = pathMatch ? (pathMatch[1] || pathMatch[2] || pathMatch[3] || '') : '';
  const regName = nameMatch ? (nameMatch[1] || nameMatch[2] || nameMatch[3] || '') : '';
  return { regPath: sanitizeRegPath(regPath), regName: sanitizeRegName(regName) };
}

export async function queryRegistryValueNode(regPath, regName) {
  return WindowsExecutionEngine.queryRegistryValue(regPath, regName);
}

export function runPowerShellScript(script) {
  return WindowsExecutionEngine.executePowerShell(script);
}

export function runElevatedPowerShellScript(script) {
  return WindowsExecutionEngine.executeElevatedPowerShell(script);
}

export function parsePowerShellToRegCmd(code) {
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

export function runFastRegCommand(regCmd, isHklm) {
  return WindowsExecutionEngine.executeFastRegCommand(regCmd, isHklm);
}
