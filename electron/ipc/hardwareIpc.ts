import os from 'os';
import { wrapIpcHandler } from './ipcWrapper.js';
import {
    cachedCpuName,
    cachedOsName,
    getCpuUsageInstant,
    getHardwareSpecs
} from '../native/systemInfo.js';

export function initHardwareIpc(ipcMain: unknown) {
    // @ts-expect-error - auto fixed
    let systemMetricsCache = null;
    let systemMetricsCacheTime = 0;

    // @ts-expect-error - auto fixed
    ipcMain.handle('get-system-metrics', wrapIpcHandler('get-system-metrics', async () => {
        const now = Date.now();
        // @ts-expect-error - auto fixed
        if (systemMetricsCache && now - systemMetricsCacheTime < 1000) {
            return systemMetricsCache;
        }

        try {
            const freeMem = os.freemem();
            const totalMem = os.totalmem();
            const freeMemoryMB = Math.round(freeMem / (1024 * 1024));
            const totalMemoryMB = Math.round(totalMem / (1024 * 1024));
            const usedMemoryMB = totalMemoryMB - freeMemoryMB;
            const ramUsagePercent = Math.round((usedMemoryMB / totalMemoryMB) * 100);

            const cpuUsage = getCpuUsageInstant();

            systemMetricsCache = {
                success: true,
                data: {
                    cpuUsage,
                    freeMemoryMB,
                    totalMemoryMB,
                    usedMemoryMB,
                    ramUsagePercent,
                    osUptimeSeconds: Math.round(os.uptime()),
                    osRelease: cachedOsName || `Windows ${os.release()}`, cpuName: cachedCpuName,
                    platform: os.platform(),
                    arch: os.arch()
                }
            };
            systemMetricsCacheTime = now;
            return systemMetricsCache;
        } catch (err) {
            return {
                success: false,
                error: { code: 'METRICS_ERROR', message: 'Sistem metrikleri okunamadı: ' + ((err as Error).message || 'Bilinmeyen hata') }
            };
        }
    }));

    // @ts-expect-error - auto fixed
    ipcMain.handle('get-hardware-specs', wrapIpcHandler('get-hardware-specs', async () => {
        return await getHardwareSpecs();
    }));
}
