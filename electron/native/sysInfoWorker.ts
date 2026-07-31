import { parentPort } from 'worker_threads';
import si from 'systeminformation';

/**
 * sysInfoWorker.js
 * Dedicated Worker Thread for handling heavy native systeminformation calls
 * off the Electron main process event loop.
 */

if (parentPort) {
  parentPort.on('message', async (message: unknown) => {
    // @ts-expect-error - auto fixed
    const { id, type } = message || {};
    try {
      if (type === 'GET_HARDWARE_SPECS') {
        const [cpu, gpus, mem, mb, bios, diskLayout, memLayout] = await Promise.all([
          si.cpu(),
          si.graphics(),
          si.mem(),
          si.baseboard(),
          si.bios(),
          si.diskLayout(),
          si.memLayout()
        ]);

        // @ts-expect-error - auto fixed
        parentPort.postMessage({
          id,
          success: true,
          data: { cpu, gpus, mem, mb, bios, diskLayout, memLayout }
        });
      } else if (type === 'GET_SYSTEM_DETAILS') {
        const [cpu, osInfo] = await Promise.all([
          si.cpu(),
          si.osInfo()
        ]);

        // @ts-expect-error - auto fixed
        parentPort.postMessage({
          id,
          success: true,
          data: {
            cpuName: cpu.brand || cpu.manufacturer || '',
            osName: `${osInfo.distro} ${osInfo.release} (Build ${osInfo.build})`.trim()
          }
        });
      } else if (type === 'GET_FS_SIZE') {
        const fsSizes = await si.fsSize();
        // @ts-expect-error - auto fixed
        parentPort.postMessage({
          id,
          success: true,
          data: fsSizes
        });
      } else {
        // @ts-expect-error - auto fixed
        parentPort.postMessage({
          id,
          success: false,
          error: `Unknown worker action type: ${type}`
        });
      }
    } catch (err) {
      // @ts-expect-error - auto fixed
      parentPort.postMessage({
        id,
        success: false,
        error: (err as Error).message || String(err)
      });
    }
  });
}
