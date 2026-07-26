import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import { BackupRestoreEngine } from './backupRestoreEngine.js';
import { logError } from './logger.js';

function getBackupFilePath() {
  return BackupRestoreEngine.getBackupStoragePath();
}

export function getBackupsNode() {
  return BackupRestoreEngine.getBackups();
}

export function saveBackupNode(id, regPath, regName, originalValue, exists) {
  return BackupRestoreEngine.createBackup(id, regPath, regName, originalValue, exists);
}

export function deleteBackupNode(id) {
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
    logError('Failed to load settings', { error: e.message });
    return null;
  }
}

export async function saveSettingsNode(settings) {
  try {
    await fs.promises.writeFile(getSettingsFilePathNode(), JSON.stringify(settings, null, 2), 'utf-8');
    return true;
  } catch (e) {
    logError('Failed to save settings', { error: e.message });
    return false;
  }
}
