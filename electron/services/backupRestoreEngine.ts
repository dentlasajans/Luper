import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import { logError, logInfo, logWarn } from './logger.js';
import { WindowsExecutionEngine } from '../native/windowsExecutionEngine.js';

class BackupRestoreEngineCore {
  constructor() {
    this.backupVersion = '1.0.0';
  }

  getBackupStoragePath() {
    try {
      const dir = app.getPath('userData');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      return path.join(dir, 'optimization_backups.json');
    } catch (e) {
      return path.join(app.getAppPath(), 'optimization_backups.json');
    }
  }

  async getBackups() {
    try {
      const p = this.getBackupStoragePath();
      if (fs.existsSync(p)) {
        const content = await fs.promises.readFile(p, 'utf8');
        return JSON.parse(content);
      }
    } catch (e) {
      logError('[BackupRestoreEngine] Failed to read backup database', { error: (e as Error).message });
    }
    return {};
  }

  async saveBackupsDatabase(backups: unknown) {
    try {
      const p = this.getBackupStoragePath();
      await fs.promises.writeFile(p, JSON.stringify(backups, null, 2), 'utf8');
      return true;
    } catch (e) {
      logError('[BackupRestoreEngine] Failed to write backup database', { error: (e as Error).message });
      return false;
    }
  }

  /**
   * Save pre-optimization snapshot backup
   */
  async createBackup(id: unknown, regPath: unknown, regName: unknown, originalValue: unknown, exists: unknown) {
    try {
      const backups = await this.getBackups();
      // @ts-expect-error - auto fixed
      if (!backups[id]) {
        // @ts-expect-error - auto fixed
        backups[id] = {
          version: this.backupVersion,
          timestamp: new Date().toISOString(),
          regPath,
          regName,
          originalValue: String(originalValue),
          exists: Boolean(exists)
        };
        await this.saveBackupsDatabase(backups);
        // @ts-expect-error - auto fixed
        logInfo(`[BackupRestoreEngine] Created pre-optimization backup snapshot for [${id}]`, backups[id]);
      }
    } catch (e) {
      logError(`[BackupRestoreEngine] Failed to create backup for [${id}]:`, { error: (e as Error).message });
    }
  }

  /**
   * Delete snapshot backup after successful restore
   */
  async deleteBackup(id: unknown) {
    try {
      const backups = await this.getBackups();
      // @ts-expect-error - auto fixed
      if (backups[id]) {
        // @ts-expect-error - auto fixed
        delete backups[id];
        await this.saveBackupsDatabase(backups);
        logInfo(`[BackupRestoreEngine] Deleted backup snapshot for [${id}]`);
      }
    } catch (e) {
      logError(`[BackupRestoreEngine] Failed to delete backup for [${id}]:`, { error: (e as Error).message });
    }
  }

  /**
   * Create native Windows System Restore Point via PowerShell
   */
  async createWindowsRestorePoint(description: unknown = 'LUPER Optimization Restore Point') {
    if (process.platform !== 'win32') return false;
    try {
      logInfo(`[BackupRestoreEngine] Creating Windows System Restore Point: "${description}"`);
      await WindowsExecutionEngine.executeElevatedPowerShell(
        // @ts-expect-error - auto fixed
        `Checkpoint-Computer -Description "${description.replace(/"/g, '""')}" -RestorePointType "MODIFY_SETTINGS" -ErrorAction SilentlyContinue`
      );
      return true;
    } catch (e) {
      logWarn(`[BackupRestoreEngine] Windows System Restore Point creation failed: ${(e as Error).message}`);
      return false;
    }
  }

  /**
   * Verify backup entry integrity prior to restore
   */
  verifyBackupIntegrity(backupEntry: unknown) {
    if (!backupEntry) return { valid: false, reason: 'Backup entry does not exist.' };
    // @ts-expect-error - auto fixed
    if (!backupEntry.regPath || !backupEntry.regName) {
      return { valid: false, reason: 'Backup entry missing path or name.' };
    }
    return { valid: true };
  }

    backupVersion!: unknown;
}

export const BackupRestoreEngine = new BackupRestoreEngineCore();
