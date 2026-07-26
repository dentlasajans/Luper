import crypto from 'crypto';
import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import { logError, logInfo } from './logger.js';

class CloudContentPlatformCore {
  constructor() {
    this.currentChannel = 'stable';
    this.catalogCache = null;
  }

  getCacheDirectory() {
    try {
      const dir = path.join(app.getPath('userData'), 'cloud_cache');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      return dir;
    } catch (e) {
      return path.join(app.getAppPath(), 'cloud_cache');
    }
  }

  getLocalCatalogPath() {
    return path.join(this.getCacheDirectory(), `catalog_${this.currentChannel}.json`);
  }

  /**
   * Calculate SHA-256 hash of a file for package integrity verification
   */
  calculateFileHash(filePath) {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(filePath)) {
        return reject(new Error('File does not exist for hash calculation.'));
      }
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(filePath);
      stream.on('data', chunk => hash.update(chunk));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', err => reject(err));
    });
  }

  /**
   * Verify package SHA-256 integrity
   */
  async verifyPackageIntegrity(filePath, expectedSha256) {
    try {
      const actualHash = await this.calculateFileHash(filePath);
      const isMatch = actualHash.toLowerCase() === expectedSha256.toLowerCase();
      if (!isMatch) {
        logError(`[CloudContentPlatform] Hash mismatch for [${path.basename(filePath)}]. Expected: ${expectedSha256}, Actual: ${actualHash}`);
      }
      return isMatch;
    } catch (e) {
      logError(`[CloudContentPlatform] Package verification failed: ${e.message}`);
      return false;
    }
  }

  /**
   * Read cached local catalog or return offline fallback
   */
  getLocalCatalog() {
    try {
      const p = this.getLocalCatalogPath();
      if (fs.existsSync(p)) {
        return JSON.parse(fs.readFileSync(p, 'utf8'));
      }
    } catch (e) {
      logError('[CloudContentPlatform] Failed to read local catalog cache', { error: e.message });
    }
    return {
      catalogVersion: '1.0.0',
      updatedAt: new Date().toISOString(),
      channel: this.currentChannel,
      items: []
    };
  }

  /**
   * Save catalog JSON to local offline store
   */
  saveLocalCatalog(catalog) {
    try {
      const p = this.getLocalCatalogPath();
      fs.writeFileSync(p, JSON.stringify(catalog, null, 2), 'utf8');
      return true;
    } catch (e) {
      logError('[CloudContentPlatform] Failed to save catalog cache', { error: e.message });
      return false;
    }
  }

  /**
   * Synchronize content catalog (Offline-first fallback)
   */
  async refreshContentCatalog(channel = 'stable') {
    const startTime = Date.now();
    this.currentChannel = channel;
    logInfo(`[CloudContentPlatform] Refreshing content catalog for channel: [${channel}]`);

    const localCatalog = this.getLocalCatalog();

    return {
      success: true,
      channel,
      catalog: localCatalog,
      durationMs: Date.now() - startTime
    };
  }
}

export const CloudContentPlatform = new CloudContentPlatformCore();
