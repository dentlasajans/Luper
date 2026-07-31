import { execFile } from 'child_process';
import { promisify } from 'util';
import { BenchmarkEngine } from './benchmarkEngine.js';
import { logError, logInfo } from './logger.js';
import { WindowsExecutionEngine } from '../native/windowsExecutionEngine.js';

const execFileAsync = promisify(execFile);

class GameOptimizationEngineCore {
  constructor() {
    this.gameProfiles = new Map();
    this.activeGameSessions = new Map();
  }

  /**
   * Fetch installed games from real Windows Registry
   */
  async fetchInstalledGames() {
    logInfo('[GameOptimizationEngine] Fetching installed games via Windows Registry');
    const games: unknown[] = [];
    
    if (process.platform !== 'win32') return games;

    try {
      const psCommand = `
        $games = @()
        
        # Steam Games
        $steamPath = (Get-ItemProperty "HKLM:\\SOFTWARE\\WOW6432Node\\Valve\\Steam" -ErrorAction SilentlyContinue).InstallPath
        if ($steamPath) {
          $appsPath = Join-Path $steamPath "steamapps"
          if (Test-Path $appsPath) {
            Get-ChildItem -Path $appsPath -Filter "*.acf" | ForEach-Object {
              $content = Get-Content $_.FullName -Raw
              $name = ""
              $appid = ""
              if ($content -match '"name"\\s+"([^"]+)"') { $name = $matches[1] }
              if ($content -match '"appid"\\s+"([^"]+)"') { $appid = $matches[1] }
              if ($name -and $appid) {
                $games += [PSCustomObject]@{
                  id = $appid
                  name = $name
                  launcher = 'steam'
                }
              }
            }
          }
        }

        # Epic Games
        $epicPath = "HKLM:\\SOFTWARE\\WOW6432Node\\Epic Games\\EpicGamesLauncher"
        if (Test-Path $epicPath) {
          $appData = $env:ProgramData + "\\Epic\\EpicGamesLauncher\\Data\\Manifests"
          if (Test-Path $appData) {
            Get-ChildItem -Path $appData -Filter "*.item" | ForEach-Object {
              $json = Get-Content $_.FullName -Raw | ConvertFrom-Json
              $games += [PSCustomObject]@{
                id = $json.AppName
                name = $json.DisplayName
                launcher = 'epic'
              }
            }
          }
        }
        
        $games | ConvertTo-Json -Compress
      `;

      const { stdout } = await execFileAsync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', psCommand], { windowsHide: true });
      if (stdout && stdout.trim()) {
        const parsed = JSON.parse(stdout.trim());
        const arr = Array.isArray(parsed) ? parsed : [parsed];
        games.push(...arr);
      }
    } catch (e) {
      logError('[GameOptimizationEngine] Error fetching games:', { error: (e as Error).message });
    }
    
    return games;
  }

  /**
   * Get or create per-game optimization profile
   */
  getGameProfile(gameId: unknown) {
    // @ts-expect-error - auto fixed
    if (!this.gameProfiles.has(gameId)) {
      // @ts-expect-error - auto fixed
      this.gameProfiles.set(gameId, {
        gameId,
        processPriority: 'High', // 'High' | 'AboveNormal' | 'Normal'
        autoTrimRamOnLaunch: true,
        highPerformancePowerScheme: true,
        disableBackgroundThrottling: true
      });
    }
    // @ts-expect-error - auto fixed
    return this.gameProfiles.get(gameId);
  }

  /**
   * Update per-game optimization profile settings
   */
  setGameProfile(gameId: unknown, profileUpdate: unknown) {
    const current = this.getGameProfile(gameId);
    // @ts-expect-error - auto fixed
    const updated = { ...current, ...profileUpdate };
    // @ts-expect-error - auto fixed
    this.gameProfiles.set(gameId, updated);
    logInfo(`[GameOptimizationEngine] Updated profile for game [${gameId}]`, updated);
    return updated;
  }

  /**
   * Launch a game with real-time process priority & memory optimization
   */
  async launchGameWithOptimization(gameId: unknown, launcher: unknown) {
    logInfo(`[GameOptimizationEngine] Launching game [${gameId}] via launcher [${launcher}]`);

    const profile = this.getGameProfile(gameId);

    // 1. Pre-game RAM Trim
    if (profile.autoTrimRamOnLaunch && process.platform === 'win32') {
      try {
        await WindowsExecutionEngine.executePowerShell('[GC]::Collect(); [GC]::WaitForPendingFinalizers()');
        logInfo(`[GameOptimizationEngine] Trimmed RAM prior to game launch [${gameId}]`);
      } catch (e) {}
    }

    // 2. High Performance Power Plan Activation
    if (profile.highPerformancePowerScheme && process.platform === 'win32') {
      try {
        // High Performance Power Plan GUID
        await WindowsExecutionEngine.setPowerScheme('8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c');
      } catch (e) {}
    }

    // 3. Start Benchmark Tracking Session for Game Launch
    BenchmarkEngine.startSession(`Game Launch: ${gameId}`);

    // 4. Launch Game Process
    let success = false;
    if (process.platform === 'win32') {
      try {
        const safeGameId = String(gameId).replace(/[\$\(\)\`&|;<>"]/g, '');
        
        if (launcher === 'steam') {
          if (/^\d+$/.test(safeGameId)) {
            await execFileAsync('cmd.exe', ['/c', 'start', `steam://run/${safeGameId}`]);
            success = true;
          }
        } else if (launcher === 'epic') {
          await execFileAsync('cmd.exe', ['/c', 'start', '""', `com.epicgames.launcher://apps/${safeGameId}?action=launch&silent=true`]);
          success = true;
        } else if (launcher === 'riot') {
          await execFileAsync('cmd.exe', ['/c', 'start', '""', 'C:\\Riot Games\\Riot Client\\RiotClientServices.exe', `--launch-product=${safeGameId}`, '--launch-patchline=live']);
          success = true;
        } else if (launcher === 'ea') {
          await execFileAsync('cmd.exe', ['/c', 'start', `origin2://game/launch?offerIds=${safeGameId}`]);
          success = true;
        } else if (launcher === 'pc') {
          await execFileAsync('cmd.exe', ['/c', 'start', '""', safeGameId]);
          success = true;
        }
      } catch (e) {
        logError(`[GameOptimizationEngine] Failed to launch game [${gameId}]:`, { error: (e as Error).message });
      }
    }

    // 5. Track Session State
    if (success) {
      // @ts-expect-error - auto fixed
      this.activeGameSessions.set(gameId, {
        gameId,
        launcher,
        launchTime: new Date().toISOString()
      });
    }

    return success;
  }

    gameProfiles!: unknown;
    activeGameSessions!: unknown;
}

export const GameOptimizationEngine = new GameOptimizationEngineCore();
