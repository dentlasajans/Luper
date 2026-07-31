import { logError, logInfo } from '../services/logger.js';
import { saveFpsSession } from '../services/statsDatabase.js';
import { execAsync, runElevatedPowerShellScript } from './nativeServices.js';
import path from 'path';
import os from 'os';
import fs from 'fs';
import readline from 'readline';
import { app } from 'electron';

let activeGameSession: any = null;
let backgroundMonitorInterval: any = null;
let libraryGamesCache: unknown[] = [];

app.on('before-quit', async () => {
  if (activeGameSession) {
    try {
      await stopFpsMonitor();
    } catch (e) {
      console.error(e);
    }
  }
});

export function startFpsMonitor(gameId: unknown, gameName: unknown, profile: unknown, processName: unknown) {
  if (activeGameSession) {
    if (activeGameSession.gameId === gameId) return; // Zaten takip ediliyor
    stopFpsMonitor();
  }
  
  const csvFileName = `luper_session_${gameId}_${Date.now()}.csv`;
  const csvFilePath = path.join(os.tmpdir(), csvFileName);
  
  activeGameSession = {
    gameId,
    gameName,
    profile: profile || 'default',
    processName,
    csvFilePath,
    startTime: Date.now()
  };

  // Run PresentMon elevated
  if (processName) {
    const rootDir = process.cwd();
    const presentMonExe = path.join(rootDir, 'resources', 'installers', 'PresentMon-x64.exe');
    
    // Check if PresentMon exists
    if (fs.existsSync(presentMonExe)) {
      logInfo('Starting PresentMon session', { gameId, gameName, processName, csvFilePath });
      // Use unique session name to prevent ETW trace session conflicts
      const sessionName = `LuperSession_${Date.now()}`;
      // Use PowerShell array syntax for ArgumentList to avoid nested quote parsing issues
    const psScript = `Start-Process -FilePath "${presentMonExe}" -ArgumentList "-process_name","${processName}","-output_file","${csvFilePath}","-terminate_on_proc_exit","-no_top","-session_name","${sessionName}" -WindowStyle Hidden`;
      
      runElevatedPowerShellScript(psScript).catch((err: unknown) => {
        // @ts-expect-error - auto fixed
        logError('Failed to start PresentMon ETW session', { error: err.message });
      });
    } else {
      logError('PresentMon-x64.exe not found in resources/installers');
    }
  }
}

export async function stopFpsMonitor() {
  if (!activeGameSession) return null;

  // Capture the session locally and clear the global to prevent re-entrant calls
  const session = activeGameSession;
  activeGameSession = null;

  // PresentMon-x64.exe will naturally exit because of -terminate_on_proc_exit.
  // Wait for the process to exit and file system to flush the CSV.
  // @ts-expect-error - auto fixed
  await new Promise((resolve: unknown) => setTimeout(resolve, 4000));

  const durationMs = Date.now() - session.startTime;
  const durationMinutes = Math.max(1, Math.round(durationMs / 60000));
  const durationSeconds = durationMs / 1000;
  
  let averageFps = 0;
  let onePercentLow = 0;
  let tenPercentLow = 0;
  
  // PresentMon CSV'sini okuyup kare sayısını hesaplıyoruz ve %1 / %10 Low hesaplıyoruz
  if (session.csvFilePath && fs.existsSync(session.csvFilePath)) {
    try {
      let capacity = 100000;
      let frameTimes = new Float32Array(capacity);
      let frameCount = 0;
      let msBetweenIndex = -1;
      
      const fileStream = fs.createReadStream(session.csvFilePath);
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
      });

      let isFirstLine = true;
      let lineCount = 0;
      // @ts-expect-error - auto fixed
      for await (const line: unknown of rl) {
        lineCount++;
        if (isFirstLine) {
          const headers = line.split(',');
          msBetweenIndex = headers.findIndex((h: unknown) => {
            // @ts-expect-error - auto fixed
            const cleanH = h.replace(/["']/g, '').trim();
            return cleanH === 'msBetweenPresents' || cleanH === 'msBetweenDisplayChange';
          });
          isFirstLine = false;
          continue;
        }

        if (msBetweenIndex !== -1) {
          const cols = line.split(',');
          const ms = parseFloat(cols[msBetweenIndex]?.replace(/["']/g, ''));
          if (!isNaN(ms) && ms > 0) {
            if (frameCount >= capacity) {
              capacity *= 2;
              const newArray = new Float32Array(capacity);
              newArray.set(frameTimes);
              frameTimes = newArray;
            }
            frameTimes[frameCount++] = ms;
          }
        }
      }
      
      const totalFrames = frameCount;
      logInfo('CSV Parsed', { csvFilePath: session.csvFilePath, msBetweenIndex, lineCount, totalFrames, durationSeconds });
      
      if (durationSeconds > 0 && totalFrames > 0) {
        // Average FPS from actual frame count over duration
        averageFps = Math.round(totalFrames / durationSeconds);
        
        // Slice to actual size
        const actualFrameTimes = frameTimes.subarray(0, totalFrames);
        
        // Frametime'ları büyükten küçüğe sıralıyoruz (En yavaş kareler başa)
        // @ts-expect-error - auto fixed
        actualFrameTimes.sort((a: unknown, b: unknown) => b - a);
        
        // %1 Low
        const onePercentCount = Math.max(1, Math.floor(totalFrames * 0.01));
        let sumSlowest1 = 0;
        for(let i=0; i<onePercentCount; i++) sumSlowest1 += actualFrameTimes[i];
        onePercentLow = Math.round(1000 / (sumSlowest1 / onePercentCount));
        
        // %10 Low
        const tenPercentCount = Math.max(1, Math.floor(totalFrames * 0.10));
        let sumSlowest10 = 0;
        for(let i=0; i<tenPercentCount; i++) sumSlowest10 += actualFrameTimes[i];
        tenPercentLow = Math.round(1000 / (sumSlowest10 / tenPercentCount));
      }
      
      if (averageFps > 0) {
        fs.unlinkSync(session.csvFilePath);
      } else {
        logError('Failed to calculate FPS > 0. Keeping CSV for debugging.', { csvFilePath: session.csvFilePath });
      }
    } catch (e) {
      logError('Error parsing PresentMon CSV:', { error: (e as Error).message });
    }
  } else {
    logError('CSV file does not exist after waiting', { csvFilePath: session.csvFilePath });
  }

  // Eğer veri toplanamadıysa (örneğin donanım ivmeli bir oyun değilse)
  // en azından oturumun kaydedildiğini UI'a bildirmek için FPS 0 olarak dönüyoruz.
  const sessionData = {
    durationMinutes,
    averageFps,
    onePercentLow,
    tenPercentLow,
    optimizationProfileUsed: session.profile,
    resolution: "1920x1080"
  };

  saveFpsSession(session.gameId, session.gameName, sessionData);
  const result = { gameId: session.gameId, sessionData };
  activeGameSession = null;
  return result;
}


// Ultra Hafif Arka Plan İzleyicisi (CPU: %0)
export function startBackgroundMonitor(fetchGamesCallback: unknown) {
  if (backgroundMonitorInterval) return;

  const pollIntervalMs = 5000; // Her 5 saniyede bir kontrol et (hafif CPU dostu)
  
  backgroundMonitorInterval = setInterval(async () => {
    try {
      if (fetchGamesCallback && libraryGamesCache.length === 0) {
        // @ts-expect-error - auto fixed
        const games = await fetchGamesCallback();
        if (Array.isArray(games)) libraryGamesCache = games;
      }

      // PowerShell yerine saniyenin onda biri hızında çalışan ultra hafif Windows "tasklist" komutunu kullanıyoruz.
      // Sadece imaj adlarını alıyoruz (örn: cs2.exe). Belleğe veya wmi'a yük bindirmiyoruz.
      const { stdout } = await execAsync('tasklist /FO CSV /NH');
      if (!stdout) return;

      const runningExes = stdout
        .split('\n')
        .map((line: unknown) => {
          // @ts-expect-error - auto fixed
          const match = line.match(/"(.*?)"/); // CSV'deki ilk sütun (Image Name)
          return match ? match[1] : null; // Orijinal harf büyüklüğünü koru
        })
        .filter(Boolean);

      logInfo('Background Monitor Tick', { 
        gamesInCache: libraryGamesCache.length, 
        runningExesCount: runningExes.length,
        // @ts-expect-error - auto fixed
        hasDesktopDefender: runningExes.some((e: unknown) => e.toLowerCase().includes('desktop'))
      });

      let foundRunningGame = null;

      // Debug: Dump entire cache (async, only if changed)
      try {
        const cacheString = JSON.stringify(libraryGamesCache, null, 2);
        if ((backgroundMonitorInterval as any)?.lastCache !== cacheString) {
          fs.writeFile(path.join(os.tmpdir(), 'luper_games_cache.json'), cacheString, () => {});
          if (backgroundMonitorInterval) {
            (backgroundMonitorInterval as any).lastCache = cacheString;
          }
        }
      } catch(e) {}

      logInfo('LOOP START', { length: libraryGamesCache.length });

      // Oyun isimleriyle eşleşme kontrolü yap
      // @ts-expect-error - auto fixed
      for (const game: unknown of libraryGamesCache) {
        // @ts-expect-error - auto fixed
        if (!game || typeof game.name !== 'string') continue;
        // @ts-expect-error - auto fixed
        const cleanGameName = game.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (cleanGameName.length < 4) continue;
        
        const matches = runningExes.filter((exe: unknown) => {
          if (!exe) return false;
          // @ts-expect-error - auto fixed
          const cleanExe = exe.toLowerCase().replace(/[^a-z0-9]/g, '');
          if (cleanGameName === 'desktopdefender') {
            logInfo('Checking Desktop Defender Match', { cleanExe, cleanGameName, includes: cleanExe.includes(cleanGameName) });
          }
          return cleanExe.includes(cleanGameName);
        });
        
        if (matches.length > 0) {
          // Unreal/Unity oyunlarında genellikle 'Oyun.exe' (launcher) ve 'Oyun-Win64-Shipping.exe' (gerçek oyun) bulunur.
          // En uzun ismi seçerek gerçek oyunu takip etmeyi garantiliyoruz.
          // @ts-expect-error - auto fixed
          matches.sort((a: unknown, b: unknown) => b.length - a.length);
          const matchedExe = matches[0];
          
          // @ts-expect-error - auto fixed
          logInfo('Background Monitor Match Found', { gameName: game.name, matchedExe, allMatches: matches });
          foundRunningGame = { ...game, processName: matchedExe };
          break;
        }
      }
      
      logInfo('LOOP END', { found: !!foundRunningGame });

      if (foundRunningGame) {
        if (!activeGameSession) {
          // @ts-expect-error - auto fixed
          startFpsMonitor(foundRunningGame.appid, foundRunningGame.name, 'default', foundRunningGame.processName);
        // @ts-expect-error - auto fixed
        } else if (activeGameSession.gameId !== foundRunningGame.appid) {
          stopFpsMonitor();
          // @ts-expect-error - auto fixed
          startFpsMonitor(foundRunningGame.appid, foundRunningGame.name, 'default', foundRunningGame.processName);
        }
      } else {
        if (activeGameSession) {
          stopFpsMonitor();
        }
      }

    } catch (e) {
      logError('Background FPS Monitor polling error:', { error: (e as Error).message });
    }
  }, pollIntervalMs);
}
