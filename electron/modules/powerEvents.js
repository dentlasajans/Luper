import { powerMonitor } from 'electron';
import { logInfo } from './logger.js';
import { pauseMetricsPolling, resumeMetricsPolling } from './systemInfo.js';

export function setupPowerEvents() {
  if (!powerMonitor) return;

  powerMonitor.on('suspend', () => {
    logInfo('System entering suspend mode; pausing metrics polling.');
    pauseMetricsPolling();
  });

  powerMonitor.on('resume', () => {
    logInfo('System resumed from suspend mode; resuming metrics polling.');
    resumeMetricsPolling();
  });

  powerMonitor.on('on-ac', () => {
    logInfo('System switched to AC power.');
  });

  powerMonitor.on('on-battery', () => {
    logInfo('System switched to Battery power.');
  });
}
