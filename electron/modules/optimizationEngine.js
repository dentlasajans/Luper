import { deleteBackupNode, getBackupsNode, saveBackupNode } from './configManager.js';
import { logError, logInfo } from './logger.js';
import {
    parsePowerShellToRegCmd,
    parseRegPathAndName,
    queryRegistryValueNode,
    runElevatedPowerShellScript,
    runFastRegCommand,
    runPowerShellScript
} from './nativeServices.js';
import { ValidationEngine } from './validationEngine.js';

class OptimizationEngineCore {
  constructor() {
    this.registry = new Map();
    this.executionQueue = [];
    this.isProcessing = false;
  }

  /**
   * Register a new optimization item or plugin module
   */
  registerOptimization(item) {
    if (!item || !item.id) {
      throw new Error('Invalid optimization registration schema.');
    }
    this.registry.set(item.id, {
      id: item.id,
      category: item.category || 'general',
      riskLevel: item.riskLevel || 'safe',
      requiresAdmin: Boolean(item.requiresAdmin),
      dependencies: Array.isArray(item.dependencies) ? item.dependencies : [],
      applyCode: item.applyCode || '',
      restoreCode: item.restoreCode || ''
    });
    logInfo(`Registered optimization module: [${item.id}]`);
  }

  /**
   * Validate optimization execution requirements and risks
   */
  async validateRequirements(id, code) {
    return ValidationEngine.validatePreflight(id, code);
  }

  /**
   * Apply a single optimization through the engine pipeline with validation
   */
  async applyOptimization(id, code) {
    const startTime = Date.now();
    logInfo(`[OptimizationEngine] Applying optimization: [${id}]`);

    // Pre-flight Validation
    const preflight = await ValidationEngine.validatePreflight(id, code);
    if (!preflight.valid) {
      throw new Error(`Optimizasyon doğrulama hatası: ${preflight.errors.join(', ')}`);
    }

    if (process.platform !== 'win32') {
      return { success: true, id, durationMs: Date.now() - startTime };
    }

    if (!code) {
      const registered = this.registry.get(id);
      code = registered ? registered.applyCode : '';
    }

    if (!code) {
      logInfo(`[OptimizationEngine] No executable code for [${id}]; skipping engine execution.`);
      return { success: true, id, durationMs: Date.now() - startTime };
    }

    const parsedReg = parseRegPathAndName(code) || {};
    const regPath = parsedReg.regPath || '';
    const regName = parsedReg.regName || '';

    let originalValue = '';
    let exists = true;

    // Pre-optimization automatic backup snapshot
    if (regPath && regName) {
      const current = await queryRegistryValueNode(regPath, regName);
      originalValue = current.value;
      exists = current.exists;
    }
    
    await saveBackupNode(id, regPath, regName, originalValue, exists);

    const isHklm = code.toUpperCase().includes('HKLM') || code.toUpperCase().includes('HKEY_LOCAL_MACHINE');
    const fastRegCmd = parsePowerShellToRegCmd(code);

    try {
      if (fastRegCmd) {
        await runFastRegCommand(fastRegCmd, isHklm);
      } else if (!isHklm) {
        await runPowerShellScript(code);
      } else {
        await runElevatedPowerShellScript(code);
      }

      // Post-execution verification
      await ValidationEngine.verifyPostExecution(id, code);

      logInfo(`[OptimizationEngine] Successfully applied: [${id}] in ${Date.now() - startTime}ms`);
      return { success: true, id, durationMs: Date.now() - startTime };
    } catch (error) {
      logError(`[OptimizationEngine] Execution failed for [${id}]:`, { error: error.message });
      throw new Error('Yönetici izni gereklidir. Lütfen açılan UAC penceresini onaylayın veya uygulamayı Yönetici olarak çalıştırın.');
    }
  }

  /**
   * Restore a single optimization back to original backup state
   */
  async restoreOptimization(id, code) {
    const startTime = Date.now();
    logInfo(`[OptimizationEngine] Restoring optimization: [${id}]`);

    if (process.platform !== 'win32') {
      await deleteBackupNode(id);
      return { success: true, id, durationMs: Date.now() - startTime };
    }

    const backups = await getBackupsNode();
    const backup = backups[id];
    
    // Always delete the backup node when restore starts
    await deleteBackupNode(id);
    
    let restoreCode = code;

    if (backup && backup.regPath && backup.regName) {
      if (backup.exists && backup.originalValue !== undefined) {
        restoreCode = `Set-ItemProperty -Path "${backup.regPath}" -Name "${backup.regName}" -Value ${backup.originalValue === '' ? '""' : backup.originalValue} -ErrorAction SilentlyContinue`;
      } else if (backup.exists === false) {
        restoreCode = `Remove-ItemProperty -Path "${backup.regPath}" -Name "${backup.regName}" -ErrorAction SilentlyContinue`;
      }
    }

    if (!restoreCode) {
      return { success: true, id, durationMs: Date.now() - startTime };
    }

    const isHklm = restoreCode.toUpperCase().includes('HKLM') || restoreCode.toUpperCase().includes('HKEY_LOCAL_MACHINE');
    const fastRegCmd = parsePowerShellToRegCmd(restoreCode);

    try {
      if (fastRegCmd) {
        await runFastRegCommand(fastRegCmd, isHklm);
      } else if (!isHklm) {
        await runPowerShellScript(restoreCode);
      } else {
        await runElevatedPowerShellScript(restoreCode);
      }
      logInfo(`[OptimizationEngine] Successfully restored: [${id}]`);
      return { success: true, id, durationMs: Date.now() - startTime };
    } catch (error) {
      logError(`[OptimizationEngine] Restore failed for [${id}]:`, { error: error.message });
      throw new Error('Yönetici izni gereklidir. Lütfen açılan UAC penceresini onaylayın veya uygulamayı Yönetici olarak çalıştırın.');
    }
  }

  /**
   * Execute batch optimizations with automatic transaction rollback support
   */
  async applyBatchOptimizations(ids, scriptMap = {}) {
    const startTime = Date.now();
    logInfo(`[OptimizationEngine] Starting batch execution for ${ids.length} items`);

    const appliedIds = [];
    const failedIds = [];

    let combinedScript = '';

    for (const id of ids) {
      const scriptCode = scriptMap[id];
      if (scriptCode) {
        combinedScript += `\n# Optimization ID: ${id}\n${scriptCode}\n`;

        const parsedReg = parseRegPathAndName(scriptCode) || {};
        const regPath = parsedReg.regPath || '';
        const regName = parsedReg.regName || '';

        let originalValue = '';
        let exists = true;

        if (regPath && regName) {
          const current = await queryRegistryValueNode(regPath, regName);
          originalValue = current.value;
          exists = current.exists;
        }
        
        await saveBackupNode(id, regPath, regName, originalValue, exists);
        appliedIds.push(id);
      }
    }

    if (combinedScript && process.platform === 'win32') {
      try {
        await runElevatedPowerShellScript(combinedScript);
      } catch (error) {
        logError(`[OptimizationEngine] Batch execution encountered failure; initiating safety rollback`, { error: error.message });
        for (const rolledId of appliedIds) {
          try {
            await this.restoreOptimization(rolledId, scriptMap[rolledId]);
          } catch (rErr) {}
        }
        throw new Error('Yönetici izni gereklidir. Lütfen açılan UAC penceresini onaylayın veya uygulamayı Yönetici olarak çalıştırın.');
      }
    }

    return {
      success: true,
      applied: appliedIds,
      failed: failedIds,
      durationMs: Date.now() - startTime
    };
  }
}

export const OptimizationEngine = new OptimizationEngineCore();
