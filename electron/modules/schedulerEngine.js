import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import { BenchmarkEngine } from './benchmarkEngine.js';
import { logError, logInfo } from './logger.js';
import { OptimizationEngine } from './optimizationEngine.js';
import { PackageManager } from './packageManager.js';

class OptimizationSchedulerEngineCore {
  constructor() {
    this.queue = [];
    this.history = [];
    this.isProcessing = false;
    this.isPaused = false;
    this.activeTask = null;
  }

  getStoragePath() {
    try {
      const dir = app.getPath('userData');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      return path.join(dir, 'task_history.json');
    } catch (e) {
      return path.join(app.getAppPath(), 'task_history.json');
    }
  }

  getTaskHistory() {
    try {
      const p = this.getStoragePath();
      if (fs.existsSync(p)) {
        return JSON.parse(fs.readFileSync(p, 'utf8'));
      }
    } catch (e) {
      logError('[SchedulerEngine] Failed to read task history', { error: e.message });
    }
    return [];
  }

  saveTaskHistory(history) {
    try {
      const p = this.getStoragePath();
      fs.writeFileSync(p, JSON.stringify(history, null, 2), 'utf8');
      return true;
    } catch (e) {
      logError('[SchedulerEngine] Failed to save task history', { error: e.message });
      return false;
    }
  }

  /**
   * Schedule a new optimization task into the queue
   */
  scheduleTask(task) {
    if (!task || !task.packageIds || !Array.isArray(task.packageIds)) {
      throw new Error('Invalid task schedule payload.');
    }

    const scheduledTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: task.name || 'Custom Optimization Task',
      type: task.type || 'user_triggered', // 'user_triggered' | 'startup' | 'idle' | 'maintenance'
      priority: task.priority || 50,
      packageIds: task.packageIds,
      scriptMap: task.scriptMap || {},
      status: 'pending',
      createdAt: new Date().toISOString(),
      retryCount: 0,
      maxRetries: task.maxRetries || 1
    };

    this.queue.push(scheduledTask);
    // Sort queue by priority descending
    this.queue.sort((a, b) => b.priority - a.priority);

    logInfo(`[SchedulerEngine] Scheduled task [${scheduledTask.id}] with priority ${scheduledTask.priority}`);
    
    // Auto-process queue if not processing
    this.processQueue();
    return scheduledTask;
  }

  /**
   * Pause execution queue
   */
  pauseQueue() {
    this.isPaused = true;
    logInfo('[SchedulerEngine] Execution queue paused.');
  }

  /**
   * Resume execution queue
   */
  resumeQueue() {
    this.isPaused = false;
    logInfo('[SchedulerEngine] Execution queue resumed.');
    this.processQueue();
  }

  /**
   * Cancel a pending task by ID
   */
  cancelTask(taskId) {
    const index = this.queue.findIndex(t => t.id === taskId);
    if (index !== -1) {
      const [cancelled] = this.queue.splice(index, 1);
      cancelled.status = 'cancelled';
      logInfo(`[SchedulerEngine] Cancelled task [${taskId}]`);
      return true;
    }
    return false;
  }

  /**
   * Process execution queue
   */
  async processQueue() {
    if (this.isProcessing || this.isPaused || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const task = this.queue.shift();
    this.activeTask = task;
    task.status = 'running';
    task.startedAt = new Date().toISOString();

    logInfo(`[SchedulerEngine] Executing task [${task.id}] - ${task.name}`);

    try {
      // 1. Benchmark session start
      BenchmarkEngine.startSession(`Scheduler Task: ${task.name}`);

      // 2. Resolve dependencies
      const plan = PackageManager.resolveExecutionPlan(task.packageIds);
      const targetIds = plan.orderedPackages.map(p => p.meta.id);
      
      // 3. Execute via OptimizationEngine
      const result = await OptimizationEngine.applyBatchOptimizations(
        targetIds.length > 0 ? targetIds : task.packageIds, 
        task.scriptMap
      );

      // 4. Benchmark session end
      const benchmarkResult = BenchmarkEngine.endSession();

      task.status = 'completed';
      task.completedAt = new Date().toISOString();
      task.result = { result, benchmarkResult };

      logInfo(`[SchedulerEngine] Successfully completed task [${task.id}]`);
    } catch (error) {
      task.status = 'failed';
      task.failedAt = new Date().toISOString();
      task.error = error.message;

      logError(`[SchedulerEngine] Failed task [${task.id}]:`, { error: error.message });

      // Retry policy
      if (task.retryCount < task.maxRetries) {
        task.retryCount++;
        task.status = 'pending';
        this.queue.push(task);
        logInfo(`[SchedulerEngine] Retrying task [${task.id}] (Attempt ${task.retryCount}/${task.maxRetries})`);
      }
    } finally {
      const history = this.getTaskHistory();
      history.unshift(task);
      if (history.length > 100) history.pop();
      this.saveTaskHistory(history);

      this.activeTask = null;
      this.isProcessing = false;
      
      // Continue processing next task in queue
      setImmediate(() => this.processQueue());
    }
  }
}

export const OptimizationSchedulerEngine = new OptimizationSchedulerEngineCore();
