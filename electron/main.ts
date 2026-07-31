import { app, ipcMain } from 'electron';
import fs from 'fs';
import os from 'os';

process.on('uncaughtException', (err) => {
  try {
    fs.appendFileSync(os.homedir() + '\\Desktop\\luper_main_debug.txt', `[${new Date().toISOString()}] UNCAUGHT EXCEPTION: ${err.message}\n${err.stack}\n\n`);
  } catch (e) {}
});

process.on('unhandledRejection', (reason) => {
  try {
    fs.appendFileSync(os.homedir() + '\\Desktop\\luper_main_debug.txt', `[${new Date().toISOString()}] UNHANDLED REJECTION: ${reason}\n\n`);
  } catch (e) {}
});

import { bootstrapApp } from './core/bootstrap.js';
import { executeHeuristicOptimization } from './core/executionEngine';

// Record initial process start time for performance measurement
const startTime = performance.now();

// Disable Hardware Acceleration to prevent blank/empty window issues on some Windows GPUs
app.disableHardwareAcceleration();

// Bootstraps modular Electron Main Process architecture
bootstrapApp();

ipcMain.handle('execute-optimization', async (e, categoryId, enable) => await executeHeuristicOptimization(categoryId, enable));

// Measure performance timing around app ready and window creation
app.whenReady().then(() => {
  const startupTime = performance.now() - startTime;
  console.log(`[Startup Performance] App ready & window creation completed in ${startupTime.toFixed(2)}ms`);
});
