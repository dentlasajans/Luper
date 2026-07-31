import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import { BackupRestoreEngine } from '../services/backupRestoreEngine.js';
import { logError } from '../services/logger.js';

// @ts-expect-error - auto fixed
function getBackupFilePath() {
  return BackupRestoreEngine.getBackupStoragePath();
}

export function getBackupsNode() {
  return BackupRestoreEngine.getBackups();
}

export function saveBackupNode(id: unknown, regPath: unknown, regName: unknown, originalValue: unknown, exists: unknown) {
  return BackupRestoreEngine.createBackup(id, regPath, regName, originalValue, exists);
}

export function deleteBackupNode(id: unknown) {
  return BackupRestoreEngine.deleteBackup(id);
}

function getSettingsFilePathNode() {
  try {
    const dir = app.getPath('userData');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    return path.join(dir, 'settings.json');
  } catch (e) {
    return path.join(app.getAppPath(), 'settings.json');
  }
}

export async function loadSettingsNode() {
  try {
    const p = getSettingsFilePathNode();
    if (fs.existsSync(p)) {
      const content = await fs.promises.readFile(p, 'utf-8');
      return JSON.parse(content);
    }
    return null;
  } catch (e) {
    logError('Failed to load settings', { error: (e as Error).message });
    return null;
  }
}

export async function saveSettingsNode(settings: unknown) {
  try {
    await fs.promises.writeFile(getSettingsFilePathNode(), JSON.stringify(settings, null, 2), 'utf-8');
    return true;
  } catch (e) {
    logError('Failed to save settings', { error: (e as Error).message });
    return false;
  }
}
