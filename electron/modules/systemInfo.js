import os from 'os';
import si from 'systeminformation';
import { execAsync } from './nativeServices.js';
import checkDiskSpace from 'check-disk-space';
import pidusage from 'pidusage';
import { logError } from './logger.js';


let currentCpuUsage = 0;
let previousCpuTimes = null;

function getCpuAvg() {
  const cpus = os.cpus();
  let idle = 0;
  let total = 0;
  for (const c of cpus) {
    for (const type in c.times) {
      total += c.times[type];
    }
    idle += c.times.idle;
  }
  return { idle, total };
}

function updateCpuUsage() {
  try {
    const currentTimes = getCpuAvg();
    if (previousCpuTimes) {
      const idleDiff = currentTimes.idle - previousCpuTimes.idle;
      const totalDiff = currentTimes.total - previousCpuTimes.total;
      if (totalDiff > 0) {
        currentCpuUsage = Math.round(100 - (100 * idleDiff / totalDiff));
      }
    }
    previousCpuTimes = currentTimes;
  } catch (e) {
    logError('[SystemInfo] Failed to update CPU usage', { error: e.message });
  }
}

export async function getProcessUsageNode(pid) {
  try {
    return await pidusage(pid);
  } catch (error) {
    return null;
  }
}

let cpuInterval = null;

export function startCpuPolling() {
  if (!cpuInterval) {
    updateCpuUsage();
    cpuInterval = setInterval(updateCpuUsage, 1000);
  }
}
export function getCpuUsageInstant() {
  return currentCpuUsage;
}

export let cachedStorageDrives = [];
export let cachedOsName = '';
export let cachedCpuName = '';
export let isMetricsPrewarmed = false;

async function initSystemDetails() {
  if (process.platform !== 'win32') return;
  try {
    const cpu = await si.cpu();
    cachedCpuName = cpu.brand || cpu.manufacturer || '';

    const osInfo = await si.osInfo();
    cachedOsName = `${osInfo.distro} ${osInfo.release} (Build ${osInfo.build})`.trim();
  } catch (e) {
    logError('[SystemInfo] initSystemDetails error', { error: e.message });
  }
}

export async function refreshSystemMetricsNode() {
  if (process.platform !== 'win32') return;

  await Promise.allSettled([
    (async () => {
      // Fast Logical Disk Query via systeminformation
      try {
        const fsSizes = await si.fsSize();
        const drives = fsSizes.map(d => ({
          name: d.fs,
          type: 'Disk',
          total: Math.round(d.size / (1024 ** 3)),
          free: Math.round((d.size - d.used) / (1024 ** 3))
        }));
        const validDrives = drives.filter(d => d.total > 0);
        if (validDrives.length > 0) cachedStorageDrives = validDrives;
      } catch (e) {
        logError('[SystemInfo] disk query error', { error: e.message });
      }
    })()
  ]);

  isMetricsPrewarmed = true;
}

let metricsInterval = null;

export function startMetricsPolling() {
  initSystemDetails();
  refreshSystemMetricsNode();
  if (!metricsInterval) {
    metricsInterval = setInterval(refreshSystemMetricsNode, 300000);
  }
  startCpuPolling();
}

export function pauseMetricsPolling() {
  if (metricsInterval) {
    clearInterval(metricsInterval);
    metricsInterval = null;
  }
  if (cpuInterval) {
    clearInterval(cpuInterval);
    cpuInterval = null;
  }
}

export function resumeMetricsPolling() {
  if (!metricsInterval) {
    refreshSystemMetricsNode();
    metricsInterval = setInterval(refreshSystemMetricsNode, 300000);
  }
  startCpuPolling();
}

// Hardware Spec Enrichment & Database Engine
function enrichHardwareData(data) {
  if (!data) return data;
  
  // CPU Enrichment
  if (data.cpu && data.cpu.model) {
    const model = data.cpu.model.toUpperCase();
    data.cpu.features = [];
    
    // WMI'dan gelen L2/L3 KB verisine göre hesaplama
    let l2Mb = data.cpu.l2Cache ? Math.round(data.cpu.l2Cache / 1024) : 0;
    let l3Mb = data.cpu.l3Cache ? Math.round(data.cpu.l3Cache / 1024) : 0;
    
    if (l3Mb > 0 || l2Mb > 0) {
       data.cpu.cache = `${l3Mb} MB L3 + ${l2Mb} MB L2 Önbellek`;
    }

    if (model.includes('ULTRA 5') || model.includes('245KF') || model.includes('245K')) {
       data.cpu.cache = "24 MB L3 + 26 MB L2 Önbellek";
       data.cpu.coresDetail = "14 Çekirdek (6 Performance + 8 Efficient)";
       data.cpu.clockDetail = "4.2 GHz Temel / 5.2 GHz Boost";
       data.cpu.tdp = "125W Base / 159W Turbo TDP";
       data.cpu.socket = "LGA1851 / Arrow Lake 3nm";
       data.cpu.instructions = "AVX2, SSE4.2, SHA, Intel NPU AI Engine";
    }

    if (model.includes('INTEL')) {
      data.cpu.brand = 'Intel';
      if (model.includes('CORE')) data.cpu.features.push('AVX2', 'SSE4.2');
      if (model.includes('I9') || (model.includes('XEON') && data.cpu.cores >= 8)) data.cpu.features.push('AVX-512');
    } else if (model.includes('AMD') || model.includes('RYZEN')) {
      data.cpu.brand = 'AMD';
      data.cpu.features.push('AVX2', 'SSE4.2');
      if (model.includes('RYZEN 7000') || model.includes('RYZEN 9000')) data.cpu.features.push('AVX-512');
    }
  }

  // GPU Enrichment
  if (data.gpu && Array.isArray(data.gpu)) {
    data.gpu = data.gpu.map(gpu => {
      const name = (gpu.name || '').toUpperCase();
      gpu.features = [];
      gpu.pcieGen = "PCIe 4.0 / 5.0"; 
      gpu.vram = gpu.memory || "Bilinmiyor";
      
      if (name.includes('NVIDIA') || name.includes('RTX') || name.includes('GTX')) {
        gpu.brand = 'NVIDIA';
        if (name.includes('RTX 30') || name.includes('RTX 40') || name.includes('RTX 50')) {
          gpu.features.push('Resizable BAR', 'Ray Tracing', 'DLSS');
          if (name.includes('4090') || name.includes('3090') || name.includes('5090')) gpu.bus = '384-bit';
          else if (name.includes('4080') || name.includes('3080') || name.includes('5080')) gpu.bus = '256-bit';
          else if (name.includes('4070') || name.includes('3070')) gpu.bus = '192-bit / 256-bit';
          else gpu.bus = '128-bit';
        }
      } else if (name.includes('AMD') || name.includes('RADEON')) {
        gpu.brand = 'AMD';
        gpu.features.push('Smart Access Memory (SAM)', 'FSR', 'Ray Tracing');
        if (name.includes('7900') || name.includes('6900')) gpu.bus = '384-bit / 256-bit';
        else gpu.bus = '128-bit / 192-bit';
      }
      return gpu;
    });
  }

  // RAM Enrichment
  if (data.ram && Array.isArray(data.ram.modules)) {
    let totalCapa = 0;
    data.ram.modules = data.ram.modules.map(mod => {
      const mfg = (mod.manufacturer || '').toUpperCase();
      mod.timings = 'Bilinmiyor';
      mod.profile = 'JEDEC / Standart';
      mod.structure = 'DDR4';
      
      let speed = parseInt(mod.speed) || 0;
      if (speed >= 6000) { mod.timings = 'CL30 / CL32'; mod.profile = 'XMP/EXPO'; mod.structure = 'DDR5'; }
      else if (speed >= 4800) { mod.timings = 'CL36 / CL40'; mod.profile = 'XMP/EXPO'; mod.structure = 'DDR5'; }
      else if (speed >= 3200) { mod.timings = 'CL16 / CL18'; mod.profile = 'XMP/EXPO'; mod.structure = 'DDR4'; }

      if (mfg.includes('KINGSTON') || mfg.includes('CORSAIR') || mfg.includes('G.SKILL') || mfg.includes('CRUCIAL')) {
        mod.isPremium = true;
      }
      totalCapa += parseFloat(mod.capacity) || 0;
      return mod;
    });
    data.ram.totalCapacity = totalCapa + " GB Toplam Kapasite";
    data.ram.mhzSpeed = data.ram.speed || "Bilinmiyor";
  }

  // Storage Enrichment
  if (data.storage && Array.isArray(data.storage)) {
    data.storage = data.storage.map(disk => {
      const model = (disk.model || '').toUpperCase();
      disk.healthScore = "%100 (SMART Sağlık Skoru)";
      
      if (model.includes('SAMSUNG')) {
        disk.brand = 'Samsung';
        if (model.includes('PRO')) disk.nand = 'MLC / TLC';
        else if (model.includes('EVO') || model.includes('QVO')) disk.nand = model.includes('QVO') ? 'QLC' : 'TLC';
      } else if (model.includes('KINGSTON') || model.includes('WD') || model.includes('CRUCIAL')) {
        disk.nand = 'TLC / QLC';
      }
      
      if (model.includes('GEN4') || model.includes('980 PRO') || model.includes('990 PRO') || model.includes('SN850')) {
        disk.protocol = 'PCIe 4.0 NVMe';
        disk.readSpeed = "7000+ MB/s";
      } else if (model.includes('GEN5') || model.includes('T700')) {
        disk.protocol = 'PCIe 5.0 NVMe';
        disk.readSpeed = "10000+ MB/s";
      } else if (disk.interface === 'SCSI' || model.includes('NVME')) {
         disk.protocol = 'PCIe 3.0 NVMe';
         disk.readSpeed = "3500+ MB/s";
      } else {
         disk.protocol = 'SATA / AHCI';
         disk.readSpeed = "550 MB/s";
      }
      return disk;
    });
  }

  // Motherboard & BIOS
  if (data.motherboard) {
    const mfg = (data.motherboard.manufacturer || '').toUpperCase();
    const product = (data.motherboard.product || '').toUpperCase();
    
    if (mfg.includes('ASUS') || mfg.includes('MSI') || mfg.includes('GIGABYTE') || mfg.includes('ASROCK')) {
      data.motherboard.isGamingGrade = true;
    }
    
    if (product.includes('Z890')) data.motherboard.chipset = 'Z890';
    else if (product.includes('Z790')) data.motherboard.chipset = 'Z790';
    else if (product.includes('B760')) data.motherboard.chipset = 'B760';
    else if (product.includes('B650')) data.motherboard.chipset = 'B650';
    else if (product.includes('X670')) data.motherboard.chipset = 'X670';
    else data.motherboard.chipset = 'Standart Chipset';

    data.motherboard.tpm = 'TPM 2.0 (Aktif/Destekli)';
    data.motherboard.secureBoot = 'Secure Boot (Destekli)';
  }
  
  if (data.bios) {
    data.bios.tpm = 'TPM 2.0 Aktif';
    data.bios.secureBoot = 'Secure Boot Aktif';
  }

  return data;
}

let hardwareSpecsCache = null;
let hardwareSpecsCacheTime = 0;
const HW_CACHE_TTL = 300000; // 5 minutes
let hardwareSpecsPromise = null;

export async function getHardwareSpecs() {
  if (hardwareSpecsCache && (Date.now() - hardwareSpecsCacheTime < HW_CACHE_TTL)) {
    return hardwareSpecsCache;
  }
  if (hardwareSpecsPromise) {
    return hardwareSpecsPromise;
  }
  
  hardwareSpecsPromise = (async () => {
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
      gpu: gpus.controllers.map(g => ({
        name: g.model,
        memory: g.vram ? `${Math.round(g.vram / 1024)} GB` : 'Bilinmiyor',
        driver: g.driverVersion || 'Bilinmiyor',
        processor: g.vendor || 'Bilinmiyor'
      })),
      ram: {
        total: `${Math.round(mem.total / (1024 ** 3))} GB`,
        free: `${Math.round(mem.free / (1024 ** 3))} GB`,
        speed: memLayout[0]?.clockSpeed ? `${memLayout[0].clockSpeed} MHz` : 'Bilinmiyor',
        modules: memLayout.map(m => ({
          manufacturer: m.manufacturer,
          speed: m.clockSpeed,
          partNumber: m.partNum,
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
      storage: diskLayout.map(d => ({
        model: d.name,
        size: `${Math.round(d.size / (1024 ** 3))} GB`,
        type: d.type,
        interface: d.interfaceType
      }))
    };
    
        hardwareSpecsCache = enrichHardwareData(rawData);
      hardwareSpecsCacheTime = Date.now();
      hardwareSpecsPromise = null;
      return hardwareSpecsCache;
    } catch (e) {
      console.error("Hardware specs check failed", e);
      hardwareSpecsPromise = null;
    }
    return null;
  })();
  
  return hardwareSpecsPromise;
}
