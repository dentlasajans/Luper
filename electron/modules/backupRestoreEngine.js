import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import { logError, logInfo, logWarn } from './logger.js';
import { WindowsExecutionEngine } from './windowsExecutionEngine.js';

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
      logError('[BackupRestoreEngine] Failed to read backup database', { error: e.message });
    }
    return {};
  }

  async saveBackupsDatabase(backups) {
    try {
      const p = this.getBackupStoragePath();
      await fs.promises.writeFile(p, JSON.stringify(backups, null, 2), 'utf8');
      return true;
    } catch (e) {
      logError('[BackupRestoreEngine] Failed to write backup database', { error: e.message });
      return false;
    }
  }

  /**
   * Save pre-optimization snapshot backup
   */
  async createBackup(id, regPath, regName, originalValue, exists) {
    try {
      const backups = await this.getBackups();
      if (!backups[id]) {
        backups[id] = {
          version: this.backupVersion,
          timestamp: new Date().toISOString(),
          regPath,
          regName,
          originalValue: String(originalValue),
          exists: Boolean(exists)
        };
        await this.saveBackupsDatabase(backups);
        logInfo(`[BackupRestoreEngine] Created pre-optimization backup snapshot for [${id}]`, backups[id]);
      }
    } catch (e) {
      logError(`[BackupRestoreEngine] Failed to create backup for [${id}]:`, { error: e.message });
    }
  }

  /**
   * Delete snapshot backup after successful restore
   */
  async deleteBackup(id) {
    try {
      const backups = await this.getBackups();
      if (backups[id]) {
        delete backups[id];
        await this.saveBackupsDatabase(backups);
        logInfo(`[BackupRestoreEngine] Deleted backup snapshot for [${id}]`);
      }
    } catch (e) {
      logError(`[BackupRestoreEngine] Failed to delete backup for [${id}]:`, { error: e.message });
    }
  }

  /**
   * Create native Windows System Restore Point via PowerShell
   */
  async createWindowsRestorePoint(description = 'LUPER Optimization Restore Point') {
    if (process.platform !== 'win32') return false;
    try {
      logInfo(`[BackupRestoreEngine] Creating Windows System Restore Point: "${description}"`);
      await WindowsExecutionEngine.executeElevatedPowerShell(
        `Checkpoint-Computer -Description "${description.replace(/"/g, '""')}" -RestorePointType "MODIFY_SETTINGS" -ErrorAction SilentlyContinue`
      );
      return true;
    } catch (e) {
      logWarn(`[BackupRestoreEngine] Windows System Restore Point creation failed: ${e.message}`);
      return false;
    }
  }

  /**
   * Verify backup entry integrity prior to restore
   */
  verifyBackupIntegrity(backupEntry) {
    if (!backupEntry) return { valid: false, reason: 'Backup entry does not exist.' };
    if (!backupEntry.regPath || !backupEntry.regName) {
      return { valid: false, reason: 'Backup entry missing path or name.' };
    }
    return { valid: true };
  }
}

export const BackupRestoreEngine = new BackupRestoreEngineCore();
