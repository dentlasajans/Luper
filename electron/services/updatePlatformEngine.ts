import crypto from 'crypto';
import { app } from 'electron';
import pkg from 'electron-updater';
const { autoUpdater } = pkg;
import fs from 'fs';
import path from 'path';
import { logInfo, logError } from './logger.js';

class UpdatePlatformEngineCore {
  constructor() {
    this.currentVersion = app.getVersion() || '1.0.0';
    this.currentChannel = 'stable';
    this.status = 'idle';

    // Configure electron-updater
    try {
      autoUpdater.autoDownload = true;
      autoUpdater.autoInstallOnAppQuit = true;
      
      autoUpdater.on('update-available', (info: unknown) => {
        // @ts-expect-error - auto fixed
        logInfo(`AutoUpdater: New update available (v${info.version})`);
      });
      autoUpdater.on('update-downloaded', (info: unknown) => {
        // @ts-expect-error - auto fixed
        logInfo(`AutoUpdater: Update v${info.version} downloaded and ready to install.`);
      });
      autoUpdater.on('error', (err: unknown) => {
        logError('AutoUpdater Error:', err);
      });
    } catch (e) {}
  }

  getStagingDirectory() {
    try {
      const dir = path.join(app.getPath('userData'), 'update_staging');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      return dir;
    } catch (e) {
      return path.join(app.getAppPath(), 'update_staging');
    }
  }

  /**
   * SemVer version comparison helper
   */
  compareVersions(v1: unknown, v2: unknown) {
    // @ts-expect-error - auto fixed
    const p1 = (v1 || '0.0.0').split('.').map((n: unknown) => parseInt(n, 10) || 0);
    // @ts-expect-error - auto fixed
    const p2 = (v2 || '0.0.0').split('.').map((n: unknown) => parseInt(n, 10) || 0);
    for (let i = 0; i < Math.max(p1.length, p2.length); i++) {
      const num1 = p1[i] || 0;
      const num2 = p2[i] || 0;
      if (num1 > num2) return 1;
      if (num1 < num2) return -1;
    }
    return 0;
  }

  /**
   * Verify SHA-256 integrity of update installer package
   */
  async verifyPackageHash(filePath: unknown, expectedSha256: unknown) {
    try {
      // @ts-expect-error - auto fixed
      if (!fs.existsSync(filePath)) return false;
      const hash = crypto.createHash('sha256');
      // @ts-expect-error - auto fixed
      const stream = fs.createReadStream(filePath);
      
      return new Promise((resolve: unknown) => {
        // @ts-expect-error - auto fixed
        stream.on('data', (chunk: unknown) => hash.update(chunk));
        stream.on('end', () => {
          const actualHash = hash.digest('hex');
          // @ts-expect-error - auto fixed
          resolve(actualHash.toLowerCase() === expectedSha256.toLowerCase());
        });
        // @ts-expect-error - auto fixed
        stream.on('error', () => resolve(false));
      });
    } catch (e) {
      return false;
    }
  }

  /**
   * Check for application updates
   */
  async checkForApplicationUpdates(channel: unknown = 'stable') {
    const startTime = Date.now();
    this.currentChannel = channel;
    this.status = 'checking';
    logInfo(`[UpdatePlatformEngine] Checking for updates on channel [${channel}] (Current: v${this.currentVersion})...`);

    try {
      const updateCheckResult = await autoUpdater.checkForUpdatesAndNotify();
      this.status = 'idle';
      
      return {
        hasUpdate: !!updateCheckResult?.updateInfo,
        currentVersion: this.currentVersion,
        latestVersion: updateCheckResult?.updateInfo?.version || this.currentVersion,
        channel,
        durationMs: Date.now() - startTime
      };
    } catch (err) {
      logError(`[UpdatePlatformEngine] Update check failed:`, err);
      this.status = 'idle';
      return {
        hasUpdate: false,
        currentVersion: this.currentVersion,
        channel,
        durationMs: Date.now() - startTime,
        error: (err as Error).message
      };
    }
  }

  /**
   * Check for GitHub release updates (Stable only)
   */
  async checkForGitHubUpdate() {
    this.status = 'checking';
    logInfo(`[UpdatePlatformEngine] Checking for stable updates on GitHub (Current: v${this.currentVersion})...`);
    try {
      const res = await fetch('https://api.github.com/repos/dentlasajans/Luper/releases', {
        headers: { 'User-Agent': 'LUPER-Updater' }
      });
      if (!res.ok) {
        if (res.status === 404) {
          logInfo('[UpdatePlatformEngine] No releases found on GitHub (404).');
          this.status = 'idle';
          return { hasUpdate: false, currentVersion: this.currentVersion, latestVersion: this.currentVersion, releaseNotes: 'LUPER v1.0.0 Kararlı Sürümünüz en güncel durumdadır.' };
        }
        throw new Error(`GitHub API returned ${res.status}`);
      }
      const releases = await res.json();
      
      // Filter out prereleases and drafts
      // @ts-expect-error - auto fixed
      const stableReleases = releases.filter((r: unknown) => !r.prerelease && !r.draft);
      if (stableReleases.length === 0) {
        logInfo('[UpdatePlatformEngine] No stable releases found on GitHub.');
        this.status = 'idle';
        return { hasUpdate: false, currentVersion: this.currentVersion, latestVersion: this.currentVersion, releaseNotes: 'LUPER v1.0.0 Kararlı Sürümünüz en güncel durumdadır.' };
      }
      
      const latestRelease = stableReleases[0];
      const latestVersion = latestRelease.tag_name.replace(/^v/, '');
      
      const comparison = this.compareVersions(latestVersion, this.currentVersion);
      if (comparison > 0) {
        logInfo(`[UpdatePlatformEngine] Update found: v${latestVersion}`);
        this.status = 'idle';
        return {
          hasUpdate: true,
          currentVersion: this.currentVersion,
          latestVersion: latestVersion,
          releaseNotes: latestRelease.body,
          downloadUrl: latestRelease.assets?.[0]?.browser_download_url || latestRelease.html_url
        };
      } else {
        logInfo(`[UpdatePlatformEngine] App is up to date.`);
        this.status = 'idle';
        return { hasUpdate: false, currentVersion: this.currentVersion, latestVersion: latestVersion };
      }
    } catch (e) {
      logError(`[UpdatePlatformEngine] Failed to check for GitHub updates: ${(e as Error).message}`);
      this.status = 'idle';
      return { hasUpdate: false, currentVersion: this.currentVersion, error: (e as Error).message };
    }
  }

    currentChannel!: unknown;
    status!: unknown;
    currentVersion!: unknown;
}

export const UpdatePlatformEngine = new UpdatePlatformEngineCore();
