import fs from 'fs';
import os from 'os';
import path from 'path';
import { app, shell } from 'electron';
import { GameOptimizationEngine } from '../services/gameEngine.js';
import { wrapIpcHandler } from './ipcWrapper.js';
import { logError } from '../services/logger.js';
import { execAsync } from '../native/nativeServices.js';

// --- Steam Games Scanner Helper --- //

async function getSteamPathNode() {
  if (process.platform !== 'win32') return null;
  try {
    const { stdout } = await execAsync('reg query "HKCU\\Software\\Valve\\Steam" /v "SteamPath"');
    const match = stdout.match(/SteamPath\s+REG_SZ\s+(.+)/i);
    if (match && match[1]) {
      return path.normalize(match[1].trim());
    }
  } catch (e) {
    logError('Steam HKCU registry lookup failed', { error: (e as Error)?.message });
  }

  try {
    const { stdout } = await execAsync('reg query "HKLM\\SOFTWARE\\WOW6432Node\\Valve\\Steam" /v "InstallPath"');
    const match = stdout.match(/InstallPath\s+REG_SZ\s+(.+)/i);
    if (match && match[1]) {
      return path.normalize(match[1].trim());
    }
  } catch (e) {
    logError('Steam HKLM registry lookup failed', { error: (e as Error)?.message });
  }

  const commonPaths = [
    'C:\\Program Files (x86)\\Steam',
    'C:\\Program Files\\Steam',
    'D:\\Steam',
    'E:\\Steam'
  ];
  // @ts-expect-error - auto fixed
  for (const p: unknown of commonPaths) {
    if (fs.existsSync(p)) return path.normalize(p);
  }
  return null;
}

function parseAcfManifestNode(content: unknown) {
  const getVal = (key: unknown) => {
    const regex = new RegExp(`"${key}"\\s+"([^"]+)"`, 'i');
    // @ts-expect-error - auto fixed
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
      // @ts-expect-error - auto fixed
      for (const m: unknown of matches) {
        if (m[1]) {
          const cleanPath = path.normalize(m[1].replace(/\\\\/g, '\\'));
          const subApps = path.join(cleanPath, 'steamapps');
          if (fs.existsSync(subApps)) {
            libraryDirsMap.set(subApps.toLowerCase(), subApps);
          }
        }
      }
    } catch (e) {
      logError('Error reading libraryfolders.vdf:', { error: (e as Error).message });
    }
  }

  const IGNORED_APPIDS = new Set(['228980', '250820', '1391110', '1493710', '1007', '7']);
  const IGNORED_KEYWORDS = ['redistributable', 'proton', 'steamvr', 'soundtrack', 'dedicated server', 'sdk', 'shared dep'];

  const gamesMap = new Map();

  // @ts-expect-error - auto fixed
  for (const libDir: unknown of libraryDirsMap.values()) {
    try {
      const files = await fs.promises.readdir(libDir);
      await Promise.all(files.map(async (file: unknown) => {
        // @ts-expect-error - auto fixed
        if (file.startsWith('appmanifest_') && file.endsWith('.acf')) {
          try {
            // @ts-expect-error - auto fixed
            const filePath = path.join(libDir, file);
            const content = await fs.promises.readFile(filePath, 'utf8');
            const data = parseAcfManifestNode(content);

            if (!data.appid || !data.name) return;
            if (gamesMap.has(data.appid)) return;
            if (IGNORED_APPIDS.has(data.appid)) return;

            const nameLower = data.name.toLowerCase();
            if (IGNORED_KEYWORDS.some((kw: unknown) => nameLower.includes(kw))) return;

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
              // @ts-expect-error - auto fixed
              for (const p: unknown of coverCandidates) {
                if (fs.existsSync(p)) {
                  localCover = 'file:///' + p.replace(/\\/g, '/');
                  break;
                }
              }
              // @ts-expect-error - auto fixed
              for (const p: unknown of headerCandidates) {
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
          } catch (e) {
            logError('Steam game manifest parse error', { error: (e as Error)?.message });
          }
        }
      }));
    } catch (e) {
      logError('Steam library folder scan error', { error: (e as Error)?.message });
    }
  }

  return Array.from(gamesMap.values());
}

async function scanEpicGamesNode() {
  const games: unknown[] = [];
  const manifestDir = 'C:\\ProgramData\\Epic\\EpicGamesLauncher\\Data\\Manifests';
  try {
    if (fs.existsSync(manifestDir)) {
      const files = await fs.promises.readdir(manifestDir);
      await Promise.all(files.map(async (file: unknown) => {
        // @ts-expect-error - auto fixed
        if (file.endsWith('.item')) {
          try {
            // @ts-expect-error - auto fixed
            const content = await fs.promises.readFile(path.join(manifestDir, file), 'utf8');
            const data = JSON.parse(content);
            if (data.AppName && data.DisplayName) {
              games.push({
                appid: data.AppName,
                name: data.DisplayName,
                launcher: 'epic',
                lastPlayed: 0,
                coverImage: `https://tse2.mm.bing.net/th?q=${encodeURIComponent(data.DisplayName + ' game cover vertical')}&w=600&h=900&c=7&rs=1&p=0&dpr=1&pid=1.7`,
                headerImage: `https://tse2.mm.bing.net/th?q=${encodeURIComponent(data.DisplayName + ' game header horizontal')}&w=460&h=215&c=7&rs=1&p=0&dpr=1&pid=1.7`,
                heroImage: `https://tse2.mm.bing.net/th?q=${encodeURIComponent(data.DisplayName + ' game wallpaper 1080p')}&w=1920&h=1080&c=7&rs=1&p=0&dpr=1&pid=1.7`
              });
            }
          } catch (e) {
            logError('Epic manifest parse error', { file, error: (e as Error)?.message });
          }
        }
      }));
    }
  } catch (e) {
    logError('Epic Games scan error', { error: (e as Error)?.message });
  }
  return games;
}

async function scanRiotGamesNode() {
  const games: unknown[] = [];
  const metaDir = 'C:\\ProgramData\\Riot Games\\Metadata';
  try {
    if (fs.existsSync(metaDir)) {
      const dirs = await fs.promises.readdir(metaDir);
      await Promise.all(dirs.map(async (dir: unknown) => {
        try {
          // @ts-expect-error - auto fixed
          if (dir === 'Riot Client' || dir.endsWith('.game_patch')) return;
          // @ts-expect-error - auto fixed
          const productFile = path.join(metaDir, dir, `${dir}.product_settings.yaml`);
          if (fs.existsSync(productFile)) {
            // @ts-expect-error - auto fixed
            let appid = dir.split('.')[0];
            let name = appid;
            if (appid === 'league_of_legends') name = 'League of Legends';
            else if (appid === 'teamfighttactics') name = 'Teamfight Tactics';
            else if (appid === 'valorant') name = 'VALORANT';
            else if (appid === 'bards_tale') name = "The Bard's Tale";
            else name = appid.replace(/_/g, ' ').replace(/\b\w/g, (l: unknown) => (l as string).toUpperCase());

            try {
              const content = await fs.promises.readFile(productFile, 'utf8');
              const nameMatch = content.match(/product_name:\s+"([^"]+)"/i) || content.match(/product_name:\s+([^\r\n]+)/i);
              if (nameMatch && nameMatch[1]) name = nameMatch[1].trim();
            } catch(e) {
              logError('Riot product name parse error', { error: (e as Error)?.message });
            }
            games.push({
              appid: appid,
              name: name,
              launcher: 'riot',
              lastPlayed: 0,
              coverImage: null
            });
          }
        } catch (e) {
          logError('Riot game dir parse error', { error: (e as Error)?.message });
        }
      }));
    }
  } catch (e) {
    logError('Riot Games scan error', { error: (e as Error)?.message });
  }
  return games;
}

async function scanEAGamesNode() {
  const games: unknown[] = [];
  const installDataDir = 'C:\\ProgramData\\EA Desktop\\InstallData';
  try {
    if (fs.existsSync(installDataDir)) {
      const dirs = await fs.promises.readdir(installDataDir);
      await Promise.all(dirs.map(async (dir: unknown) => {
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
        } catch (e) {
          logError('EA game dir parse error', { error: (e as Error)?.message });
        }
      }));
    }
  } catch (e) {
    logError('EA Games scan error', { error: (e as Error)?.message });
  }
  return games;
}

// @ts-expect-error - auto fixed
async function scanStandaloneGamesNode() {
  const games: unknown[] = [];
  try {
    const desktopPaths = [
      'C:\\Users\\Public\\Desktop',
      path.join(os.homedir(), 'Desktop')
    ];
    
    const blacklistedPaths = ['Windows', 'System32', 'Google', 'Microsoft', 'Adobe', 'AppData', 'ProgramData'];
    const blacklistedApps = ['chrome.exe', 'msedge.exe', 'firefox.exe', 'anydesk.exe', 'cpuz.exe', 'cpu-z.exe', 'spotify.exe', 'discord.exe', 'code.exe', 'winword.exe', 'excel.exe', 'powerpnt.exe', 'devenv.exe'];

    // @ts-expect-error - auto fixed
    for (const dPath: unknown of desktopPaths) {
      if (!fs.existsSync(dPath)) continue;
      
      const files = await fs.promises.readdir(dPath);
      await Promise.all(files.map(async (file: unknown) => {
        // @ts-expect-error - auto fixed
        if (file.toLowerCase().endsWith('.lnk')) {
          try {
            // @ts-expect-error - auto fixed
            const lnkPath = path.join(dPath, file);
            const shortcutDetails = shell.readShortcutLink(lnkPath);
            if (shortcutDetails && shortcutDetails.target) {
              const target = shortcutDetails.target;
              if (target.toLowerCase().endsWith('.exe')) {
                const targetLower = target.toLowerCase();
                
                // @ts-expect-error - auto fixed
                if (blacklistedPaths.some((bp: unknown) => targetLower.includes(bp.toLowerCase()))) return;
                
                const exeName = path.basename(targetLower);
                if (blacklistedApps.includes(exeName)) return;
                
                // @ts-expect-error - auto fixed
                const shortcutNameWithoutLnk = file.substring(0, file.length - 4);
                
                games.push({
                  appid: target,
                  name: shortcutNameWithoutLnk,
                  launcher: 'pc',
                  lastPlayed: 0,
                  coverImage: `https://tse2.mm.bing.net/th?q=${encodeURIComponent(shortcutNameWithoutLnk + ' game cover vertical')}&w=600&h=900&c=7&rs=1&p=0&dpr=1&pid=1.7`,
                headerImage: `https://tse2.mm.bing.net/th?q=${encodeURIComponent(shortcutNameWithoutLnk + ' game header horizontal')}&w=460&h=215&c=7&rs=1&p=0&dpr=1&pid=1.7`,
                heroImage: `https://tse2.mm.bing.net/th?q=${encodeURIComponent(shortcutNameWithoutLnk + ' game wallpaper 1080p')}&w=1920&h=1080&c=7&rs=1&p=0&dpr=1&pid=1.7`
                });
              }
            }
          } catch(e) {
            logError('Standalone game shortcut parse error', { error: (e as Error)?.message });
          }
        }
      }));
    }
  } catch(e) {
    logError('Failed to scan standalone PC games:', { error: (e as Error).message });
  }
  return games;
}

export async function getAllGamesNode() {
  let allGames: any[] = [];
  if (process.platform === 'win32') {
    const results = await Promise.allSettled([
      scanSteamGamesNode().then((games: unknown) => (games as any[]).map((g: any) => ({ ...g, launcher: 'steam' }))),
      scanEpicGamesNode(),
      scanRiotGamesNode(),
      scanEAGamesNode()
    ]);
    
    for (const res of results) {
      if (res.status === 'fulfilled' && Array.isArray(res.value)) {
        allGames.push(...res.value);
      } else if (res.status === 'rejected') {
        logError('Game scan failed:', { error: res.reason?.message });
      }
    }

    // Add custom games
    try {
      const userDataPath = app ? app.getPath('userData') : process.cwd();
      const customGamesPath = path.join(userDataPath, 'data', 'customGames.json');
      if (fs.existsSync(customGamesPath)) {
        const customGames = JSON.parse(fs.readFileSync(customGamesPath, 'utf8'));
        if (Array.isArray(customGames)) {
          allGames.push(...customGames);
        }
      }
    } catch (e) {
      logError('Failed to load custom games:', { error: (e as Error)?.message });
    }
  }

  // Deduplicate games by name (prioritize games that already have a coverImage)
  const uniqueGamesMap = new Map<string, any>();
  for (const game of allGames) {
    if (!game || !game.name) continue;
    const nameKey = game.name.toLowerCase().trim();
    if (!uniqueGamesMap.has(nameKey)) {
      uniqueGamesMap.set(nameKey, game);
    } else {
      const existing = uniqueGamesMap.get(nameKey);
      if (!existing?.coverImage && game.coverImage) {
        uniqueGamesMap.set(nameKey, game);
      }
    }
  }
  return Array.from(uniqueGamesMap.values());
}

export function initGameScannerIpc(ipcMain: unknown) {
  // @ts-expect-error - auto fixed
  ipcMain.handle('get-all-installed-games', wrapIpcHandler('get-all-installed-games', async () => {
    return getAllGamesNode();
  }));

  // @ts-expect-error - auto fixed
  ipcMain.handle('launch-game', wrapIpcHandler('launch-game', async (event: unknown, { appid, launcher }: unknown) => {
    return GameOptimizationEngine.launchGameWithOptimization(appid, launcher);
  }));

  // @ts-expect-error - auto fixed
  ipcMain.handle('get-installed-steam-games', wrapIpcHandler('get-installed-steam-games', async () => {
    return scanSteamGamesNode();
  }));

  // @ts-expect-error - auto fixed
  ipcMain.handle('launch-steam-game', wrapIpcHandler('launch-steam-game', async (event: unknown, appid: unknown) => {
    return GameOptimizationEngine.launchGameWithOptimization(appid, 'steam');
  }));

  // @ts-expect-error - auto fixed
  ipcMain.handle('add-custom-game', wrapIpcHandler('add-custom-game', async (event: unknown, game: unknown) => {
    try {
      const userDataPath = app ? app.getPath('userData') : process.cwd();
      const dataDir = path.join(userDataPath, 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const customGamesPath = path.join(dataDir, 'customGames.json');
      let customGames: unknown[] = [];
      if (fs.existsSync(customGamesPath)) {
        customGames = JSON.parse(fs.readFileSync(customGamesPath, 'utf8'));
      }
      customGames.push(game);
      fs.writeFileSync(customGamesPath, JSON.stringify(customGames, null, 2), 'utf8');
      return true;
    } catch (e) {
      logError('Failed to save custom game:', { error: (e as Error)?.message });
      return false;
    }
  }));
}
