import { spawn, execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { writeFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import electron from 'electron';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');
const electronPath = electron.toString();
const watchdogScript = resolve(tmpdir(), 'luper_watchdog.ps1');
const pidFile = resolve(tmpdir(), 'luper_launcher.pid');

/**
 * Detect if the current process has access to the interactive desktop.
 */
function isInteractiveDesktop() {
  try {
    return process.stdout.isTTY === true;
  } catch {
    return false;
  }
}

/**
 * Get all Electron PIDs currently running.
 */
function getElectronPids() {
  try {
    const output = execSync(
      'powershell -NoProfile -Command "Get-Process -Name electron -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Id"',
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    );
    return output.trim().split(/\r?\n/).filter(Boolean).map(Number);
  } catch {
    return [];
  }
}

/**
 * Direct spawn mode — used in interactive terminals (VS Code, CMD, PowerShell).
 */
function launchDirect() {
  console.log('[Launcher] Direct spawn mode (interactive terminal)');
  const child = spawn(electron, ['.'], {
    stdio: 'inherit',
    windowsHide: false,
    cwd: projectRoot
  });

  child.on('close', (code) => {
    process.exit(code || 0);
  });
}

/**
 * Create and launch a watchdog via schtasks (completely independent process tree).
 * Monitors the launcher PID — when it dies, kills all Electron processes.
 */
function launchWatchdogViaSchtasks(launcherPid) {
  const psContent = `
# Luper Watchdog — monitors launcher PID and kills Electron when it dies
$launcherPid = ${launcherPid}
Start-Sleep -Seconds 3
while ($true) {
    Start-Sleep -Seconds 2
    $alive = $null
    try { $alive = Get-Process -Id $launcherPid -ErrorAction Stop } catch {}
    if (-not $alive) {
        Start-Sleep -Seconds 1
        Get-Process -Name electron -ErrorAction SilentlyContinue | Stop-Process -Force
        Remove-Item "${pidFile.replace(/\\/g, '\\\\')}" -Force -ErrorAction SilentlyContinue
        Remove-Item "${watchdogScript.replace(/\\/g, '\\\\')}" -Force -ErrorAction SilentlyContinue
        schtasks /Delete /TN "LuperWatchdog" /F 2>$null
        exit 0
    }
}
`.trim();

  // Write the watchdog script to a temp file
  writeFileSync(watchdogScript, psContent, 'utf8');

  try {
    // Create watchdog as a scheduled task (independent process tree!)
    execSync(
      `schtasks /Create /TN "LuperWatchdog" /TR "powershell -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File '${watchdogScript}'" /SC ONCE /ST 00:00 /F /RL HIGHEST`,
      { stdio: 'pipe' }
    );
    execSync(`schtasks /Run /TN "LuperWatchdog" /I`, { stdio: 'pipe' });
    console.log(`[Launcher] Watchdog task launched (monitors PID ${launcherPid})`);
  } catch (err) {
    console.error('[Launcher] Watchdog creation failed:', err.message);
  }
}

/**
 * Schtasks-based launch for non-interactive contexts (AI agent terminal).
 */
function launchViaSchtasks() {
  const taskName = 'LuperQuickStart';

  console.log('[Launcher] Non-interactive desktop detected — schtasks mode');

  // Write our PID so watchdog knows who to monitor
  writeFileSync(pidFile, String(process.pid), 'utf8');

  try {
    execSync(
      `schtasks /Create /TN "${taskName}" /TR "'${electronPath}' '${projectRoot}'" /SC ONCE /ST 00:00 /F /RL HIGHEST`,
      { stdio: 'pipe' }
    );
    execSync(`schtasks /Run /TN "${taskName}" /I`, { stdio: 'pipe' });
    console.log('[Launcher] Electron launched on interactive desktop');

    // Cleanup the start task
    setTimeout(() => {
      try {
        execSync(`schtasks /Delete /TN "${taskName}" /F`, { stdio: 'pipe' });
      } catch { /* ignore */ }
    }, 3000);

  } catch (err) {
    console.error('[Launcher] schtasks failed:', err.message);
    launchDirect();
    return;
  }

  // Launch watchdog via schtasks — completely independent process tree
  launchWatchdogViaSchtasks(process.pid);

  // Track Electron PIDs
  let electronPids = [];

  setTimeout(() => {
    electronPids = getElectronPids();
    console.log(`[Launcher] Tracking Electron PIDs: [${electronPids.join(', ')}]`);
    console.log('[Launcher] Kill this task to close LUPER.');
  }, 2500);

  // Poll: if Electron exits on its own, exit this process too
  setInterval(() => {
    const alive = getElectronPids();
    if (alive.length === 0 && electronPids.length > 0) {
      console.log('[Launcher] Electron closed by user. Exiting...');
      // Cleanup watchdog
      try {
        execSync('schtasks /Delete /TN "LuperWatchdog" /F', { stdio: 'pipe' });
      } catch { /* ignore */ }
      try { unlinkSync(pidFile); } catch { /* ignore */ }
      try { unlinkSync(watchdogScript); } catch { /* ignore */ }
      process.exit(0);
    }
  }, 2000);
}

// --- Entry Point ---
if (isInteractiveDesktop()) {
  launchDirect();
} else {
  launchViaSchtasks();
}
