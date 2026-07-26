import { logInfo, logWarn } from './logger.js';
import { parseRegPathAndName, queryRegistryValueNode } from './nativeServices.js';

class ValidationEngineCore {
  constructor() {
    this.customValidators = new Map();
  }

  /**
   * Register a custom validator function for a specific optimization ID
   */
  registerCustomValidator(id, validatorFn) {
    if (typeof validatorFn !== 'function') {
      throw new Error('Custom validator must be a function.');
    }
    this.customValidators.set(id, validatorFn);
    logInfo(`Registered custom validator for: [${id}]`);
  }

  /**
   * Pre-flight validation pipeline run prior to execution
   */
  async validatePreflight(id, code, metadata = {}) {
    const startTime = Date.now();
    const errors = [];
    const warnings = [];

    // 1. Basic Parameter Validation
    if (!id || typeof id !== 'string') {
      errors.push('Geçersiz optimizasyon ID parametresi.');
      return { valid: false, errors, warnings, durationMs: Date.now() - startTime };
    }

    // 2. Platform & OS Validation
    if (process.platform !== 'win32') {
      warnings.push('Windows dışı işletim sistemi tespiti; simülasyon modunda çalışılıyor.');
    }

    // 3. Privilege / Elevation Pre-check
    const isHklm = (code || '').toUpperCase().includes('HKLM') || (code || '').toUpperCase().includes('HKEY_LOCAL_MACHINE');
    if (isHklm) {
      logInfo(`[ValidationEngine] Optimization [${id}] requires elevated administrator privileges (HKLM).`);
    }

    // 4. Custom Validator Execution
    if (this.customValidators.has(id)) {
      try {
        const customRes = await this.customValidators.get(id)(id, code, metadata);
        if (customRes && !customRes.valid) {
          if (customRes.errors) errors.push(...customRes.errors);
          if (customRes.warnings) warnings.push(...customRes.warnings);
        }
      } catch (err) {
        errors.push(`Custom validator failed for [${id}]: ${err.message}`);
      }
    }

    const valid = errors.length === 0;
    logInfo(`[ValidationEngine] Pre-flight validation for [${id}]: ${valid ? 'PASSED' : 'FAILED'}`, { errors, warnings });

    return {
      valid,
      errors,
      warnings,
      requiresAdmin: isHklm,
      durationMs: Date.now() - startTime
    };
  }

  /**
   * Post-execution verification pipeline to verify registry or system change
   */
  async verifyPostExecution(id, code) {
    const startTime = Date.now();
    
    if (process.platform !== 'win32' || !code) {
      return { verified: true, durationMs: Date.now() - startTime };
    }

    const { regPath, regName } = parseRegPathAndName(code);
    if (!regPath || !regName) {
      return { verified: true, durationMs: Date.now() - startTime };
    }

    try {
      const current = await queryRegistryValueNode(regPath, regName);
      const verified = current.exists;

      logInfo(`[ValidationEngine] Post-execution verification for [${id}]: ${verified ? 'VERIFIED' : 'UNVERIFIED'}`, { regPath, regName });

      return {
        verified,
        currentValue: current.value,
        durationMs: Date.now() - startTime
      };
    } catch (e) {
      logWarn(`[ValidationEngine] Post-execution verification exception for [${id}]: ${e.message}`);
      return { verified: true, durationMs: Date.now() - startTime };
    }
  }
}

export const ValidationEngine = new ValidationEngineCore();
