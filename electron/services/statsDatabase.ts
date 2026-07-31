import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import { logError } from './logger.js';

let statsDbPath = '';

export function initStatsDatabase() {
  try {
    const userDataPath = app.getPath('userData');
    const dataDir = path.join(userDataPath, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    statsDbPath = path.join(dataDir, 'fps_stats.json');
    if (!fs.existsSync(statsDbPath)) {
      fs.writeFileSync(statsDbPath, JSON.stringify({}, null, 2), 'utf-8');
    }
  } catch (error) {
    logError('Failed to initialize stats database:', { error: (error as Error).message });
  }
}

export function getFpsStats() {
  try {
    if (!fs.existsSync(statsDbPath)) return {};
    const data = fs.readFileSync(statsDbPath, 'utf-8');
    const parsed = JSON.parse(data);
    
    // Add computed average for frontend convenience
    Object.keys(parsed).forEach(gameId => {
      const game = parsed[gameId];
      if (game.sessions && game.sessions.length > 0) {
        const totalFps = game.sessions.reduce((sum: number, s: any) => sum + (s.averageFps || 0), 0);
        game.average = Math.round(totalFps / game.sessions.length);
      } else {
        game.average = 0;
      }
    });
    
    return parsed;
  } catch (error) {
    logError('Failed to read FPS stats:', { error: (error as Error).message });
    return {};
  }
}

export function saveFpsSession(gameId: unknown, gameName: unknown, sessionData: unknown) {
  try {
    const stats = getFpsStats();
    // @ts-expect-error - auto fixed
    if (!stats[gameId]) {
      // @ts-expect-error - auto fixed
      stats[gameId] = {
        gameId,
        gameName,
        sessions: []
      };
    }
    
    // sessionData should be { date, durationMinutes, averageFps, onePercentLow, optimizationProfileUsed }
    // @ts-expect-error - auto fixed
    stats[gameId].sessions.unshift({
      date: new Date().toISOString(),
      // @ts-expect-error - auto fixed
      ...sessionData
    });

    fs.writeFileSync(statsDbPath, JSON.stringify(stats, null, 2), 'utf-8');
    return true;
  } catch (error) {
    logError('Failed to save FPS session:', { error: (error as Error).message });
    return false;
  }
}
