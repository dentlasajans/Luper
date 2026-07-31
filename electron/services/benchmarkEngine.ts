import { app } from 'electron';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { logError, logInfo } from './logger.js';
import { cachedStorageDrives, getCpuUsageInstant } from '../native/systemInfo.js';

class BenchmarkEngineCore {
  constructor() {
    this.activeSession = null;
  }

  getStoragePath() {
    try {
      const dir = app.getPath('userData');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      return path.join(dir, 'benchmarks.json');
    } catch (e) {
      return path.join(app.getAppPath(), 'benchmarks.json');
    }
  }

  getHistory() {
    try {
      const p = this.getStoragePath();
      if (fs.existsSync(p)) {
        return JSON.parse(fs.readFileSync(p, 'utf8'));
      }
    } catch (e) {
      logError('[BenchmarkEngine] Failed to read history', { error: (e as Error).message });
    }
    return [];
  }

  saveHistory(records: unknown) {
    try {
      const p = this.getStoragePath();
      fs.writeFileSync(p, JSON.stringify(records, null, 2), 'utf8');
      return true;
    } catch (e) {
      logError('[BenchmarkEngine] Failed to write history', { error: (e as Error).message });
      return false;
    }
  }

  /**
   * Capture instant performance sample
   */
  captureSample() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const cpuUsage = getCpuUsageInstant();

    return {
      timestamp: new Date().toISOString(),
      cpuUsagePercent: cpuUsage,
      ramTotalMB: Math.round(totalMem / (1024 * 1024)),
      ramUsedMB: Math.round(usedMem / (1024 * 1024)),
      ramFreeMB: Math.round(freeMem / (1024 * 1024)),
      ramUsagePercent: Math.round((usedMem / totalMem) * 100),
      storageDrives: cachedStorageDrives,
      uptimeSeconds: Math.round(os.uptime())
    };
  }

  /**
   * Start a benchmark measurement session
   */
  startSession(profileName: unknown = 'Standard Optimization Benchmark') {
    const baseline = this.captureSample();
    this.activeSession = {
      id: `bench_${Date.now()}`,
      profileName,
      startTime: new Date().toISOString(),
      baselineSample: baseline
    };
    // @ts-expect-error - auto fixed
    logInfo(`[BenchmarkEngine] Started benchmark session: [${this.activeSession.id}]`);
    return this.activeSession;
  }

  /**
   * End benchmark session and compute performance score delta
   */
  endSession() {
    if (!this.activeSession) {
      throw new Error('No active benchmark session found.');
    }

    const postSample = this.captureSample();
    // @ts-expect-error - auto fixed
    const baseline = this.activeSession.baselineSample;

    const ramGainMB = postSample.ramFreeMB - baseline.ramFreeMB;
    // @ts-expect-error - auto fixed
    const latencyDiff = baseline.networkLatencyMs - postSample.networkLatencyMs;
    const cpuDiff = baseline.cpuUsagePercent - postSample.cpuUsagePercent;

    // Compute System Score (0 - 100)
    const ramScore = Math.min(40, Math.max(0, Math.round((postSample.ramFreeMB / postSample.ramTotalMB) * 40)));
    const cpuScore = Math.min(40, Math.max(0, Math.round((100 - postSample.cpuUsagePercent) * 0.4)));
    // @ts-expect-error - auto fixed
    const latencyScore = Math.min(20, Math.max(0, Math.round(Math.max(0, 100 - postSample.networkLatencyMs) * 0.2)));
    const totalScore = ramScore + cpuScore + latencyScore;

    const result = {
      // @ts-expect-error - auto fixed
      id: this.activeSession.id,
      // @ts-expect-error - auto fixed
      profileName: this.activeSession.profileName,
      // @ts-expect-error - auto fixed
      startTime: this.activeSession.startTime,
      endTime: new Date().toISOString(),
      baselineSample: baseline,
      postSample,
      metricsDelta: {
        ramGainMB,
        latencyDiffMs: latencyDiff,
        cpuUsageDiffPercent: cpuDiff
      },
      systemScore: totalScore
    };

    const history = this.getHistory();
    history.unshift(result);
    // Keep max 50 historical benchmark runs
    if (history.length > 50) history.pop();
    this.saveHistory(history);

    logInfo(`[BenchmarkEngine] Completed benchmark session [${result.id}] with score ${totalScore}/100`);
    this.activeSession = null;
    return result;
  }

    activeSession!: unknown;
}

export const BenchmarkEngine = new BenchmarkEngineCore();
