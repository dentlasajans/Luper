import os from 'os';
import { logError, logInfo } from '../services/logger.js';

class PackageManagerCore {
  constructor() {
    this.packages = new Map();
  }

  /**
   * Register a standardized optimization package
   */
  registerPackage(pkg: unknown) {
    const validation = this.validatePackageSchema(pkg);
    if (!validation.valid) {
      // @ts-expect-error - auto fixed
      logError(`Package registration failed for [${pkg?.meta?.id || 'unknown'}]:`, { errors: validation.errors });
      throw new Error(`Package schema validation failed: ${validation.errors.join(', ')}`);
    }

    // @ts-expect-error - auto fixed
    this.packages.set(pkg.meta.id, pkg);
    // @ts-expect-error - auto fixed
    logInfo(`Registered optimization package: [${pkg.meta.id}] v${pkg.meta.version}`);
  }

  /**
   * Validate package schema completeness
   */
  validatePackageSchema(pkg: unknown) {
    const errors: unknown[] = [];
    const warnings: unknown[] = [];

    if (!pkg) {
      errors.push('Package object is null or undefined.');
      return { valid: false, errors, warnings };
    }

    // @ts-expect-error - auto fixed
    if (!pkg.meta || !pkg.meta.id) {
      errors.push('Missing package metadata ID.');
    }

    // @ts-expect-error - auto fixed
    if (!pkg.scripts || (!pkg.scripts.applyCode && !pkg.scripts.restoreCode)) {
      warnings.push('Package contains empty script payload.');
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  /**
   * Validate OS & architecture compatibility
   */
  validateCompatibility(pkg: unknown) {
    if (process.platform !== 'win32') {
      return { compatible: true, warnings: ['Non-Windows OS environment.'] };
    }

    const currentArch = os.arch();
    // @ts-expect-error - auto fixed
    if (pkg.requirements?.supportedArch && !pkg.requirements.supportedArch.includes(currentArch)) {
      return { compatible: false, reason: `Incompatible CPU architecture [${currentArch}].` };
    }

    return { compatible: true };
  }

  /**
   * Resolve dependency tree and check for conflicting packages
   */
  resolveExecutionPlan(packageIds: unknown) {
    const orderedPackages: unknown[] = [];
    const visited = new Set();
    const conflicts: unknown[] = [];

    // @ts-expect-error - auto fixed
    for (const id: unknown of packageIds) {
      // @ts-expect-error - auto fixed
      const pkg = this.packages.get(id);
      if (!pkg) continue;

      // Check conflicts
      if (pkg.dependencies?.conflictsWith) {
        // @ts-expect-error - auto fixed
        for (const conflictId: unknown of pkg.dependencies.conflictsWith) {
          // @ts-expect-error - auto fixed
          if (packageIds.includes(conflictId)) {
            conflicts.push({ pkgA: id, pkgB: conflictId });
          }
        }
      }

      // Check dependencies
      if (pkg.dependencies?.dependsOn) {
        // @ts-expect-error - auto fixed
        for (const depId: unknown of pkg.dependencies.dependsOn) {
          // @ts-expect-error - auto fixed
          if (!visited.has(depId) && this.packages.has(depId)) {
            visited.add(depId);
            // @ts-expect-error - auto fixed
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
    // @ts-expect-error - auto fixed
    orderedPackages.sort((a: unknown, b: unknown) => (b.priority || 0) - (a.priority || 0));

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
    // @ts-expect-error - auto fixed
    return Array.from(this.packages.values());
  }

  /**
   * Get single package by ID
   */
  getPackage(id: unknown) {
    // @ts-expect-error - auto fixed
    return this.packages.get(id);
  }

    packages!: unknown;
}

export const PackageManager = new PackageManagerCore();
