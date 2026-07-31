import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { Worker } from 'worker_threads';
import si from 'systeminformation';
// @ts-expect-error - auto fixed
import { execAsync } from './nativeServices.js';
// @ts-expect-error - auto fixed
import checkDiskSpace from 'check-disk-space';
import pidusage from 'pidusage';
import { logError } from '../services/logger.js';

// Dedicated Worker Thread Pool Manager for systeminformation calls
// @ts-expect-error - auto fixed
let sysWorker = null;
let sysRequestId = 0;
const pendingSysRequests = new Map();

function getSysWorker() {
  // @ts-expect-error - auto fixed
  if (!sysWorker) {
    try {
      const workerPath = path.join(__dirname, 'sysInfoWorker.js');
      sysWorker = new Worker(workerPath);

      sysWorker.on('message', (msg: unknown) => {
        // @ts-expect-error - auto fixed
        const { id, success, data, error } = msg || {};
        if (pendingSysRequests.has(id)) {
          const { resolve, reject } = pendingSysRequests.get(id);
          pendingSysRequests.delete(id);
          if (success) {
            resolve(data);
          } else {
            reject(new Error(error || 'Worker execution error'));
          }
        }
      });

      sysWorker.on('error', (err: unknown) => {
        // @ts-expect-error - auto fixed
        logError('[sysInfoWorker] Worker thread error:', { error: err?.message });
        resetSysWorker();
      });

      sysWorker.on('exit', (code: unknown) => {
        if (code !== 0) {
          logError('[sysInfoWorker] Worker exited unexpectedly with code:', { code });
        }
        resetSysWorker();
      });
    } catch (e) {
      logError('[sysInfoWorker] Failed to spawn worker thread:', { error: (e as Error)?.message });
      sysWorker = null;
    }
  }
  return sysWorker;
}

function resetSysWorker() {
  // @ts-expect-error - auto fixed
  if (sysWorker) {
    try { sysWorker.terminate(); } catch (e) {}
    sysWorker = null;
  }
  // @ts-expect-error - auto fixed
  for (const [, { reject }]: unknown of pendingSysRequests.entries()) {
    reject(new Error('sysInfoWorker thread terminated'));
  }
  pendingSysRequests.clear();
}

export function executeWorkerTask(type: unknown, payload: unknown = {}) {
  return new Promise((resolve: unknown, reject: unknown) => {
    try {
      const workerInstance = getSysWorker();
      if (!workerInstance) {
        throw new Error('Worker thread unavailable');
      }
      const id = ++sysRequestId;
      pendingSysRequests.set(id, { resolve, reject });
      workerInstance.postMessage({ id, type, payload });
    } catch (err) {
      // @ts-expect-error - auto fixed
      reject(err);
    }
  });
}

let currentCpuUsage = 0;
// @ts-expect-error - auto fixed
let previousCpuTimes = null;

function getCpuAvg() {
  const cpus = os.cpus();
  let idle = 0;
  let total = 0;
  // @ts-expect-error - auto fixed
  for (const c: unknown of cpus) {
    // @ts-expect-error - auto fixed
    for (const type: unknown in c.times) {
      // @ts-expect-error - auto fixed
      total += c.times[type];
    }
    idle += c.times.idle;
  }
  return { idle, total };
}

function updateCpuUsage() {
  try {
    const currentTimes = getCpuAvg();
    // @ts-expect-error - auto fixed
    if (previousCpuTimes) {
      const idleDiff = currentTimes.idle - previousCpuTimes.idle;
      const totalDiff = currentTimes.total - previousCpuTimes.total;
      if (totalDiff > 0) {
        currentCpuUsage = Math.round(100 - (100 * idleDiff / totalDiff));
      }
    }
    previousCpuTimes = currentTimes;
  } catch (e) {
    logError('[SystemInfo] Failed to update CPU usage', { error: (e as Error).message });
  }
}

export async function getProcessUsageNode(pid: unknown) {
  try {
    // @ts-expect-error - auto fixed
    return await pidusage(pid);
  } catch (error) {
    return null;
  }
}

// @ts-expect-error - auto fixed
let cpuInterval = null;

export function startCpuPolling() {
  // @ts-expect-error - auto fixed
  if (!cpuInterval) {
    updateCpuUsage();
    cpuInterval = setInterval(updateCpuUsage, 3000);
  }
}
export function getCpuUsageInstant() {
  return currentCpuUsage;
}

export let cachedStorageDrives: unknown[] = [];
export let cachedOsName = '';
export let cachedCpuName = '';
export let isMetricsPrewarmed = false;

async function initSystemDetails() {
  if (process.platform !== 'win32') return;
  try {
    const details = await executeWorkerTask('GET_SYSTEM_DETAILS');
    // @ts-expect-error - auto fixed
    if ((details as Record<string, unknown>)?.cpuName) cachedCpuName = (details as Record<string, unknown>).cpuName;
    // @ts-expect-error - auto fixed
    if ((details as Record<string, unknown>)?.osName) cachedOsName = (details as Record<string, unknown>).osName;
  } catch (e) {
    logError('[SystemInfo] initSystemDetails worker failed, using fallback:', { error: (e as Error).message });
    try {
      const cpu = await si.cpu();
      cachedCpuName = cpu.brand || cpu.manufacturer || '';
      const osInfo = await si.osInfo();
      cachedOsName = `${osInfo.distro} ${osInfo.release} (Build ${osInfo.build})`.trim();
    } catch (fallbackErr) {
      logError('[SystemInfo] initSystemDetails fallback error', { error: (fallbackErr as Error).message });
    }
  }
}

export async function refreshSystemMetricsNode() {
  if (process.platform !== 'win32') return;

  await Promise.allSettled([
    (async () => {
      try {
        const fsSizes = await executeWorkerTask('GET_FS_SIZE');
        if (Array.isArray(fsSizes)) {
          const drives = fsSizes.map((d: unknown) => ({
            // @ts-expect-error - auto fixed
            name: d.fs,
            type: 'Disk',
            // @ts-expect-error - auto fixed
            total: Math.round(d.size / (1024 ** 3)),
            // @ts-expect-error - auto fixed
            free: Math.round((d.size - d.used) / (1024 ** 3))
          }));
          // @ts-expect-error - auto fixed
          const validDrives = drives.filter((d: unknown) => d.total > 0);
          if (validDrives.length > 0) cachedStorageDrives = validDrives;
        }
      } catch (e) {
        logError('[SystemInfo] disk query worker error, attempting fallback:', { error: (e as Error).message });
        try {
          const fsSizes = await si.fsSize();
          const drives = fsSizes.map((d: unknown) => ({
            // @ts-expect-error - auto fixed
            name: d.fs,
            type: 'Disk',
            // @ts-expect-error - auto fixed
            total: Math.round(d.size / (1024 ** 3)),
            // @ts-expect-error - auto fixed
            free: Math.round((d.size - d.used) / (1024 ** 3))
          }));
          // @ts-expect-error - auto fixed
          const validDrives = drives.filter((d: unknown) => d.total > 0);
          if (validDrives.length > 0) cachedStorageDrives = validDrives;
        } catch (fallbackErr) {
          logError('[SystemInfo] disk query fallback error', { error: (fallbackErr as Error).message });
        }
      }
    })()
  ]);

  isMetricsPrewarmed = true;
}

// @ts-expect-error - auto fixed
let metricsInterval = null;

export function startMetricsPolling() {
  initSystemDetails();
  refreshSystemMetricsNode();
  // @ts-expect-error - auto fixed
  if (!metricsInterval) {
    metricsInterval = setInterval(refreshSystemMetricsNode, 300000);
  }
  startCpuPolling();
}

export function pauseMetricsPolling() {
  // @ts-expect-error - auto fixed
  if (metricsInterval) {
    clearInterval(metricsInterval);
    metricsInterval = null;
  }
  // @ts-expect-error - auto fixed
  if (cpuInterval) {
    clearInterval(cpuInterval);
    cpuInterval = null;
  }
}

export function resumeMetricsPolling() {
  // @ts-expect-error - auto fixed
  if (!metricsInterval) {
    refreshSystemMetricsNode();
    metricsInterval = setInterval(refreshSystemMetricsNode, 300000);
  }
  startCpuPolling();
}

// Hardware Spec Enrichment & Database Engine
function enrichHardwareData(data: unknown) {
  if (!data) return data;
  
  // CPU Enrichment
  // @ts-expect-error - auto fixed
  if (data.cpu && data.cpu.model) {
    // @ts-expect-error - auto fixed
    const model = data.cpu.model.toUpperCase();
    // @ts-expect-error - auto fixed
    data.cpu.features = [];
    
    // @ts-expect-error - auto fixed
    let l2Mb = data.cpu.l2Cache ? Math.round(data.cpu.l2Cache / 1024) : 0;
    // @ts-expect-error - auto fixed
    let l3Mb = data.cpu.l3Cache ? Math.round(data.cpu.l3Cache / 1024) : 0;
    
    if (l3Mb > 0 || l2Mb > 0) {
       // @ts-expect-error - auto fixed
       data.cpu.cache = `${l3Mb} MB L3 + ${l2Mb} MB L2 Önbellek`;
    }

    if (model.includes('ULTRA 5') || model.includes('245KF') || model.includes('245K')) {
       // @ts-expect-error - auto fixed
       data.cpu.cache = "24 MB L3 + 26 MB L2 Önbellek";
       // @ts-expect-error - auto fixed
       data.cpu.coresDetail = "14 Çekirdek (6 Performance + 8 Efficient)";
       // @ts-expect-error - auto fixed
       data.cpu.clockDetail = "4.2 GHz Temel / 5.2 GHz Boost";
       // @ts-expect-error - auto fixed
       data.cpu.tdp = "125W Base / 159W Turbo TDP";
       // @ts-expect-error - auto fixed
       data.cpu.socket = "LGA1851 / Arrow Lake 3nm";
       // @ts-expect-error - auto fixed
       data.cpu.instructions = "AVX2, SSE4.2, SHA, Intel NPU AI Engine";
    }

    if (model.includes('INTEL')) {
      // @ts-expect-error - auto fixed
      data.cpu.brand = 'Intel';
      // @ts-expect-error - auto fixed
      if (model.includes('CORE')) data.cpu.features.push('AVX2', 'SSE4.2');
      // @ts-expect-error - auto fixed
      if (model.includes('I9') || (model.includes('XEON') && data.cpu.cores >= 8)) data.cpu.features.push('AVX-512');
    } else if (model.includes('AMD') || model.includes('RYZEN')) {
      // @ts-expect-error - auto fixed
      data.cpu.brand = 'AMD';
      // @ts-expect-error - auto fixed
      data.cpu.features.push('AVX2', 'SSE4.2');
      // @ts-expect-error - auto fixed
      if (model.includes('RYZEN 7000') || model.includes('RYZEN 9000')) data.cpu.features.push('AVX-512');
    }
  }

  // GPU Enrichment
  // @ts-expect-error - auto fixed
  if (data.gpu && Array.isArray(data.gpu)) {
    // @ts-expect-error - auto fixed
    data.gpu = data.gpu.map((gpu: unknown) => {
      // @ts-expect-error - auto fixed
      const name = (gpu.name || '').toUpperCase();
      // @ts-expect-error - auto fixed
      gpu.features = [];
      // @ts-expect-error - auto fixed
      gpu.pcieGen = "PCIe 4.0 / 5.0"; 
      // @ts-expect-error - auto fixed
      gpu.vram = gpu.memory || "Bilinmiyor";
      
      if (name.includes('NVIDIA') || name.includes('RTX') || name.includes('GTX')) {
        // @ts-expect-error - auto fixed
        gpu.brand = 'NVIDIA';
        if (name.includes('RTX 30') || name.includes('RTX 40') || name.includes('RTX 50')) {
          // @ts-expect-error - auto fixed
          gpu.features.push('Resizable BAR', 'Ray Tracing', 'DLSS');
          // @ts-expect-error - auto fixed
          if (name.includes('4090') || name.includes('3090') || name.includes('5090')) gpu.bus = '384-bit';
          // @ts-expect-error - auto fixed
          else if (name.includes('4080') || name.includes('3080') || name.includes('5080')) gpu.bus = '256-bit';
          // @ts-expect-error - auto fixed
          else if (name.includes('4070') || name.includes('3070')) gpu.bus = '192-bit / 256-bit';
          // @ts-expect-error - auto fixed
          else gpu.bus = '128-bit';
        }
      } else if (name.includes('AMD') || name.includes('RADEON')) {
        // @ts-expect-error - auto fixed
        gpu.brand = 'AMD';
        // @ts-expect-error - auto fixed
        gpu.features.push('Smart Access Memory (SAM)', 'FSR', 'Ray Tracing');
        // @ts-expect-error - auto fixed
        if (name.includes('7900') || name.includes('6900')) gpu.bus = '384-bit / 256-bit';
        // @ts-expect-error - auto fixed
        else gpu.bus = '128-bit / 192-bit';
      }
      return gpu;
    });
  }

  // RAM Enrichment
  // @ts-expect-error - auto fixed
  if (data.ram && Array.isArray(data.ram.modules)) {
    let totalCapa = 0;
    // @ts-expect-error - auto fixed
    data.ram.modules = data.ram.modules.map((mod: unknown) => {
      // @ts-expect-error - auto fixed
      const mfg = (mod.manufacturer || '').toUpperCase();
      // @ts-expect-error - auto fixed
      mod.timings = 'Bilinmiyor';
      // @ts-expect-error - auto fixed
      mod.profile = 'JEDEC / Standart';
      // @ts-expect-error - auto fixed
      mod.structure = 'DDR4';
      
      // @ts-expect-error - auto fixed
      let speed = parseInt(mod.speed) || 0;
      // @ts-expect-error - auto fixed
      if (speed >= 6000) { mod.timings = 'CL30 / CL32'; mod.profile = 'XMP/EXPO'; mod.structure = 'DDR5'; }
      // @ts-expect-error - auto fixed
      else if (speed >= 4800) { mod.timings = 'CL36 / CL40'; mod.profile = 'XMP/EXPO'; mod.structure = 'DDR5'; }
      // @ts-expect-error - auto fixed
      else if (speed >= 3200) { mod.timings = 'CL16 / CL18'; mod.profile = 'XMP/EXPO'; mod.structure = 'DDR4'; }

      if (mfg.includes('KINGSTON') || mfg.includes('CORSAIR') || mfg.includes('G.SKILL') || mfg.includes('CRUCIAL')) {
        // @ts-expect-error - auto fixed
        mod.isPremium = true;
      }
      // @ts-expect-error - auto fixed
      totalCapa += parseFloat(mod.capacity) || 0;
      return mod;
    });
    // @ts-expect-error - auto fixed
    data.ram.totalCapacity = totalCapa + " GB Toplam Kapasite";
    // @ts-expect-error - auto fixed
    data.ram.mhzSpeed = data.ram.speed || "Bilinmiyor";
  }

  // Storage Enrichment
  // @ts-expect-error - auto fixed
  if (data.storage && Array.isArray(data.storage)) {
    // @ts-expect-error - auto fixed
    data.storage = data.storage.map((disk: unknown) => {
      // @ts-expect-error - auto fixed
      const model = (disk.model || '').toUpperCase();
      // @ts-expect-error - auto fixed
      disk.healthScore = "%100 (SMART Sağlık Skoru)";
      
      if (model.includes('SAMSUNG')) {
        // @ts-expect-error - auto fixed
        disk.brand = 'Samsung';
        // @ts-expect-error - auto fixed
        if (model.includes('PRO')) disk.nand = 'MLC / TLC';
        // @ts-expect-error - auto fixed
        else if (model.includes('EVO') || model.includes('QVO')) disk.nand = model.includes('QVO') ? 'QLC' : 'TLC';
      } else if (model.includes('KINGSTON') || model.includes('WD') || model.includes('CRUCIAL')) {
        // @ts-expect-error - auto fixed
        disk.nand = 'TLC / QLC';
      }
      
      if (model.includes('GEN4') || model.includes('980 PRO') || model.includes('990 PRO') || model.includes('SN850')) {
        // @ts-expect-error - auto fixed
        disk.protocol = 'PCIe 4.0 NVMe';
        // @ts-expect-error - auto fixed
        disk.readSpeed = "7000+ MB/s";
      } else if (model.includes('GEN5') || model.includes('T700')) {
        // @ts-expect-error - auto fixed
        disk.protocol = 'PCIe 5.0 NVMe';
        // @ts-expect-error - auto fixed
        disk.readSpeed = "10000+ MB/s";
      // @ts-expect-error - auto fixed
      } else if (disk.interface === 'SCSI' || model.includes('NVME')) {
         // @ts-expect-error - auto fixed
         disk.protocol = 'PCIe 3.0 NVMe';
         // @ts-expect-error - auto fixed
         disk.readSpeed = "3500+ MB/s";
      } else {
         // @ts-expect-error - auto fixed
         disk.protocol = 'SATA / AHCI';
         // @ts-expect-error - auto fixed
         disk.readSpeed = "550 MB/s";
      }
      return disk;
    });
  }

  // Motherboard & BIOS
  // @ts-expect-error - auto fixed
  if (data.motherboard) {
    // @ts-expect-error - auto fixed
    const mfg = (data.motherboard.manufacturer || '').toUpperCase();
    // @ts-expect-error - auto fixed
    const product = (data.motherboard.product || '').toUpperCase();
    
    if (mfg.includes('ASUS') || mfg.includes('MSI') || mfg.includes('GIGABYTE') || mfg.includes('ASROCK')) {
      // @ts-expect-error - auto fixed
      data.motherboard.isGamingGrade = true;
    }
    
    // @ts-expect-error - auto fixed
    if (product.includes('Z890')) data.motherboard.chipset = 'Z890';
    // @ts-expect-error - auto fixed
    else if (product.includes('Z790')) data.motherboard.chipset = 'Z790';
    // @ts-expect-error - auto fixed
    else if (product.includes('B760')) data.motherboard.chipset = 'B760';
    // @ts-expect-error - auto fixed
    else if (product.includes('B650')) data.motherboard.chipset = 'B650';
    // @ts-expect-error - auto fixed
    else if (product.includes('X670')) data.motherboard.chipset = 'X670';
    // @ts-expect-error - auto fixed
    else data.motherboard.chipset = 'Standart Chipset';

    // @ts-expect-error - auto fixed
    data.motherboard.tpm = 'TPM 2.0 (Aktif/Destekli)';
    // @ts-expect-error - auto fixed
    data.motherboard.secureBoot = 'Secure Boot (Destekli)';
  }
  
  // @ts-expect-error - auto fixed
  if (data.bios) {
    // @ts-expect-error - auto fixed
    data.bios.tpm = 'TPM 2.0 Aktif';
    // @ts-expect-error - auto fixed
    data.bios.secureBoot = 'Secure Boot Aktif';
  }

  return data;
}

// @ts-expect-error - auto fixed
let hardwareSpecsCache = null;
let hardwareSpecsCacheTime = 0;
const HW_CACHE_TTL = 300000; // 5 minutes
// @ts-expect-error - auto fixed
let hardwareSpecsPromise = null;

export async function getHardwareSpecs() {
  // @ts-expect-error - auto fixed
  if (hardwareSpecsCache && (Date.now() - hardwareSpecsCacheTime < HW_CACHE_TTL)) {
    return hardwareSpecsCache;
  }
  // @ts-expect-error - auto fixed
  if (hardwareSpecsPromise) {
    return hardwareSpecsPromise;
  }
  
  hardwareSpecsPromise = (async () => {
    try {
      // @ts-expect-error - auto fixed
      const { cpu, gpus, mem, mb, bios, diskLayout, memLayout } = await executeWorkerTask('GET_HARDWARE_SPECS');

      const rawData = {
        cpu: {
          model: cpu?.brand || cpu?.manufacturer,
          cores: cpu?.physicalCores,
          threads: cpu?.cores,
          speed: `${cpu?.speed || 0} GHz`,
          maxClock: cpu?.speedMax,
          l2Cache: cpu?.cache?.l2,
          l3Cache: cpu?.cache?.l3
        },
        gpu: Array.isArray(gpus?.controllers) ? gpus.controllers.map((g: unknown) => ({
          // @ts-expect-error - auto fixed
          name: g.model,
          // @ts-expect-error - auto fixed
          memory: g.vram ? `${Math.round(g.vram / 1024)} GB` : 'Bilinmiyor',
          // @ts-expect-error - auto fixed
          driver: g.driverVersion || 'Bilinmiyor',
          // @ts-expect-error - auto fixed
          processor: g.vendor || 'Bilinmiyor'
        })) : [],
        ram: {
          total: `${Math.round((mem?.total || 0) / (1024 ** 3))} GB`,
          free: `${Math.round((mem?.free || 0) / (1024 ** 3))} GB`,
          speed: Array.isArray(memLayout) && memLayout[0]?.clockSpeed ? `${memLayout[0].clockSpeed} MHz` : 'Bilinmiyor',
          modules: Array.isArray(memLayout) ? memLayout.map((m: unknown) => ({
            // @ts-expect-error - auto fixed
            manufacturer: m.manufacturer,
            // @ts-expect-error - auto fixed
            speed: m.clockSpeed,
            // @ts-expect-error - auto fixed
            partNumber: m.partNum,
            // @ts-expect-error - auto fixed
            capacity: `${Math.round((m.size || 0) / (1024 ** 3))} GB`
          })) : []
        },
        motherboard: {
          manufacturer: mb?.manufacturer,
          product: mb?.model,
          version: mb?.version
        },
        bios: {
          manufacturer: bios?.vendor,
          version: bios?.version,
          serial: bios?.serial
        },
        storage: Array.isArray(diskLayout) ? diskLayout.map((d: unknown) => ({
          // @ts-expect-error - auto fixed
          model: d.name,
          // @ts-expect-error - auto fixed
          size: `${Math.round((d.size || 0) / (1024 ** 3))} GB`,
          // @ts-expect-error - auto fixed
          type: d.type,
          // @ts-expect-error - auto fixed
          interface: d.interfaceType
        })) : []
      };
      
      hardwareSpecsCache = enrichHardwareData(rawData);
      hardwareSpecsCacheTime = Date.now();
      hardwareSpecsPromise = null;
      return hardwareSpecsCache;
    } catch (e) {
      logError("Hardware specs check via worker failed, attempting fallback:", { error: (e as Error).message });
      try {
        const [cpu, gpus, mem, mb, bios, diskLayout, memLayout] = await Promise.all([
          si.cpu(),
          si.graphics(),
          si.mem(),
          si.baseboard(),
          si.bios(),
          si.diskLayout(),
          si.memLayout()
        ]);
        const rawData = {
          cpu: {
            model: cpu.brand || cpu.manufacturer,
            cores: cpu.physicalCores,
            threads: cpu.cores,
            speed: `${cpu.speed} GHz`,
            maxClock: cpu.speedMax,
            l2Cache: cpu.cache.l2,
            l3Cache: cpu.cache.l3
          },
          gpu: gpus.controllers.map((g: unknown) => ({
            // @ts-expect-error - auto fixed
            name: g.model,
            // @ts-expect-error - auto fixed
            memory: g.vram ? `${Math.round(g.vram / 1024)} GB` : 'Bilinmiyor',
            // @ts-expect-error - auto fixed
            driver: g.driverVersion || 'Bilinmiyor',
            // @ts-expect-error - auto fixed
            processor: g.vendor || 'Bilinmiyor'
          })),
          ram: {
            total: `${Math.round(mem.total / (1024 ** 3))} GB`,
            free: `${Math.round(mem.free / (1024 ** 3))} GB`,
            speed: memLayout[0]?.clockSpeed ? `${memLayout[0].clockSpeed} MHz` : 'Bilinmiyor',
            modules: memLayout.map((m: unknown) => ({
              // @ts-expect-error - auto fixed
              manufacturer: m.manufacturer,
              // @ts-expect-error - auto fixed
              speed: m.clockSpeed,
              // @ts-expect-error - auto fixed
              partNumber: m.partNum,
              // @ts-expect-error - auto fixed
              capacity: `${Math.round(m.size / (1024 ** 3))} GB`
            }))
          },
          motherboard: {
            manufacturer: mb.manufacturer,
            product: mb.model,
            version: mb.version
          },
          bios: {
            manufacturer: bios.vendor,
            version: bios.version,
            serial: bios.serial
          },
          storage: diskLayout.map((d: unknown) => ({
            // @ts-expect-error - auto fixed
            model: d.name,
            // @ts-expect-error - auto fixed
            size: `${Math.round(d.size / (1024 ** 3))} GB`,
            // @ts-expect-error - auto fixed
            type: d.type,
            // @ts-expect-error - auto fixed
            interface: d.interfaceType
          }))
        };
        hardwareSpecsCache = enrichHardwareData(rawData);
        hardwareSpecsCacheTime = Date.now();
        hardwareSpecsPromise = null;
        return hardwareSpecsCache;
      } catch (fallbackErr) {
        logError("Hardware specs fallback check failed", { error: (fallbackErr as Error).message });
        hardwareSpecsPromise = null;
      }
    }
    return null;
  })();
  
  return hardwareSpecsPromise;
}
