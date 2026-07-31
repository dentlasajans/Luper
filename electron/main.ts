import { app, ipcMain } from 'electron';
import { bootstrapApp } from './core/bootstrap.js';
import { executeHeuristicOptimization } from './core/executionEngine';

// Record initial process start time for performance measurement
const startTime = performance.now();

// Bootstraps modular Electron Main Process architecture
bootstrapApp();

ipcMain.handle('execute-optimization', async (e, categoryId, enable) => await executeHeuristicOptimization(categoryId, enable));

// Measure performance timing around app ready and window creation
app.whenReady().then(() => {
  const startupTime = performance.now() - startTime;
  console.log(`[Startup Performance] App ready & window creation completed in ${startupTime.toFixed(2)}ms`);
});
