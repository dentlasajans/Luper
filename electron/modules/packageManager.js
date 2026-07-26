import os from 'os';
import { logError, logInfo } from './logger.js';

class PackageManagerCore {
  constructor() {
    this.packages = new Map();
  }

  /**
   * Register a standardized optimization package
   */
  registerPackage(pkg) {
    const validation = this.validatePackageSchema(pkg);
    if (!validation.valid) {
      logError(`Package registration failed for [${pkg?.meta?.id || 'unknown'}]:`, { errors: validation.errors });
      throw new Error(`Package schema validation failed: ${validation.errors.join(', ')}`);
    }

    this.packages.set(pkg.meta.id, pkg);
    logInfo(`Registered optimization package: [${pkg.meta.id}] v${pkg.meta.version}`);
  }

  /**
   * Validate package schema completeness
   */
  validatePackageSchema(pkg) {
    const errors = [];
    const warnings = [];

    if (!pkg) {
      errors.push('Package object is null or undefined.');
      return { valid: false, errors, warnings };
    }

    if (!pkg.meta || !pkg.meta.id) {
      errors.push('Missing package metadata ID.');
    }

    if (!pkg.scripts || (!pkg.scripts.applyCode && !pkg.scripts.restoreCode)) {
      warnings.push('Package contains empty script payload.');
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  /**
   * Validate OS & architecture compatibility
   */
  validateCompatibility(pkg) {
    if (process.platform !== 'win32') {
      return { compatible: true, warnings: ['Non-Windows OS environment.'] };
    }

    const currentArch = os.arch();
    if (pkg.requirements?.supportedArch && !pkg.requirements.supportedArch.includes(currentArch)) {
      return { compatible: false, reason: `Incompatible CPU architecture [${currentArch}].` };
    }

    return { compatible: true };
  }

  /**
   * Resolve dependency tree and check for conflicting packages
   */
  resolveExecutionPlan(packageIds) {
    const orderedPackages = [];
    const visited = new Set();
    const conflicts = [];

    for (const id of packageIds) {
      const pkg = this.packages.get(id);
      if (!pkg) continue;

      // Check conflicts
      if (pkg.dependencies?.conflictsWith) {
        for (const conflictId of pkg.dependencies.conflictsWith) {
          if (packageIds.includes(conflictId)) {
            conflicts.push({ pkgA: id, pkgB: conflictId });
          }
        }
      }

      // Check dependencies
      if (pkg.dependencies?.dependsOn) {
        for (const depId of pkg.dependencies.dependsOn) {
          if (!visited.has(depId) && this.packages.has(depId)) {
            visited.add(depId);
            orderedPackages.push(this.packages.get(depId));
          }
        }
      }

      if (!visited.has(id)) {
        visited.add(id);
        orderedPackages.push(pkg);
      }
    }

    // Sort by priority (higher priority first)
    orderedPackages.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    return {
      orderedPackages,
      hasConflicts: conflicts.length > 0,
      conflicts
    };
  }

  /**
   * Get list of all registered packages
   */
  getAllPackages() {
    return Array.from(this.packages.values());
  }

  /**
   * Get single package by ID
   */
  getPackage(id) {
    return this.packages.get(id);
  }
}

export const PackageManager = new PackageManagerCore();
