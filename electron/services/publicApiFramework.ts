import { DiagnosticsHealthEngine } from './healthEngine.js';

import { LicensePlatform } from './licensePlatform.js';
import { logError, logInfo } from './logger.js';
import { OptimizationSchedulerEngine } from './schedulerEngine.js';

class PublicApiFrameworkCore {
  constructor() {
    this.apiVersion = '1.0.0';
    this.serviceRegistry = new Map();
    // @ts-expect-error - auto fixed
    this.automationTasks = new Map();
    this.initCoreServices();
  }

  initCoreServices() {
    // 1. Query: System Health Diagnostics
    this.registerService('query.systemHealth', async () => {
      const scan = await DiagnosticsHealthEngine.runDiagnosticScan();
      return {
        cpuUsage: scan.cpuUsagePercent,
        ramUsagePercent: scan.ramUsagePercent,
        healthScore: scan.overallScore,
        statusGrade: scan.statusGrade
      };
    });



    // 3. Command: Schedule Optimization Task
    this.registerService('command.scheduleTask', async (params: unknown) => {
      const task = OptimizationSchedulerEngine.scheduleTask({
        // @ts-expect-error - auto fixed
        name: params?.name || 'Public API Automation Task',
        type: 'user_triggered',
        // @ts-expect-error - auto fixed
        priority: params?.priority || 50,
        // @ts-expect-error - auto fixed
        packageIds: params?.packageIds || [],
        // @ts-expect-error - auto fixed
        scriptMap: params?.scriptMap || {}
      });
      return { taskId: task.id, status: task.status };
    });

    // 4. Query: License Status
    this.registerService('query.licenseStatus', async () => {
      return LicensePlatform.validateLicense();
    });
  }

  /**
   * Register a custom API service or adapter
   */
  registerService(endpoint: unknown, handlerFn: unknown) {
    if (typeof handlerFn !== 'function') {
      throw new Error(`Handler for endpoint [${endpoint}] must be a function.`);
    }
    // @ts-expect-error - auto fixed
    this.serviceRegistry.set(endpoint, handlerFn);
    logInfo(`[PublicApiFramework] Registered endpoint: [${endpoint}]`);
  }

  /**
   * Execute an API query or command call
   */
  async invoke(endpoint: unknown, payload: unknown = {}) {
    const startTime = Date.now();
    // @ts-expect-error - auto fixed
    const handler = this.serviceRegistry.get(endpoint);

    if (!handler) {
      logError(`[PublicApiFramework] Endpoint not found: [${endpoint}]`);
      return {
        success: false,
        error: { code: 'ENDPOINT_NOT_FOUND', message: `API Endpoint '${endpoint}' is not registered.` },
        metadata: { durationMs: Date.now() - startTime, apiVersion: this.apiVersion }
      };
    }

    try {
      const data = await handler(payload);
      return {
        success: true,
        data,
        metadata: { durationMs: Date.now() - startTime, apiVersion: this.apiVersion }
      };
    } catch (err) {
      logError(`[PublicApiFramework] Invocation error on [${endpoint}]:`, { error: (err as Error).message });
      return {
        success: false,
        error: { code: 'EXECUTION_ERROR', message: (err as Error).message },
        metadata: { durationMs: Date.now() - startTime, apiVersion: this.apiVersion }
      };
    }
  }

    serviceRegistry!: unknown;
    apiVersion!: unknown;
}

export const PublicApiFramework = new PublicApiFrameworkCore();
