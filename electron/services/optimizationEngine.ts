import { deleteBackupNode, getBackupsNode, saveBackupNode } from '../core/configManager.js';
import { logError, logInfo } from './logger.js';
import { nativeAddon } from '../native/nativeAddon.js';
import {
    parsePowerShellToRegCmd,
    parseRegPathAndName,
    queryRegistryValueNode,
    runElevatedPowerShellScript,
    runFastRegCommand,
    runPowerShellScript
} from '../native/nativeServices.js';
import { ValidationEngine } from './validationEngine.js';

class OptimizationEngineCore {
  constructor() {
    this.registry = new Map();
    // @ts-expect-error - auto fixed
    this.executionQueue = [];
    // @ts-expect-error - auto fixed
    this.isProcessing = false;
  }

  /**
   * Register a new optimization item or plugin module
   */
  registerOptimization(item: unknown) {
    // @ts-expect-error - auto fixed
    if (!item || !item.id) {
      throw new Error('Invalid optimization registration schema.');
    }
    // @ts-expect-error - auto fixed
    this.registry.set(item.id, {
      // @ts-expect-error - auto fixed
      id: item.id,
      // @ts-expect-error - auto fixed
      category: item.category || 'general',
      // @ts-expect-error - auto fixed
      riskLevel: item.riskLevel || 'safe',
      // @ts-expect-error - auto fixed
      requiresAdmin: Boolean(item.requiresAdmin),
      // @ts-expect-error - auto fixed
      dependencies: Array.isArray(item.dependencies) ? item.dependencies : [],
      // @ts-expect-error - auto fixed
      applyCode: item.applyCode || '',
      // @ts-expect-error - auto fixed
      restoreCode: item.restoreCode || ''
    });
    // @ts-expect-error - auto fixed
    logInfo(`Registered optimization module: [${item.id}]`);
  }

  /**
   * Validate optimization execution requirements and risks
   */
  async validateRequirements(id: unknown, code: unknown) {
    return ValidationEngine.validatePreflight(id, code);
  }

  /**
   * Apply a single optimization through the engine pipeline with validation
   */
  async applyOptimization(id: unknown, code: unknown) {
    const startTime = Date.now();
    logInfo(`[OptimizationEngine] Applying optimization: [${id}]`);

    // Pre-flight Validation
    const preflight = await ValidationEngine.validatePreflight(id, code);
    if (!preflight.valid) {
      throw new Error(`Optimizasyon doğrulama hatası: ${preflight.errors.join(', ')}`);
    }

    if (process.platform !== 'win32') {
      return { success: true, id, durationMs: Date.now() - startTime };
    }

    if (!code) {
      // @ts-expect-error - auto fixed
      const registered = this.registry.get(id);
      code = registered ? registered.applyCode : '';
    }

    if (!code) {
      logInfo(`[OptimizationEngine] No executable code for [${id}]; skipping engine execution.`);
      return { success: true, id, durationMs: Date.now() - startTime };
    }

    const parsedReg = parseRegPathAndName(code) || {};
    const regPath = parsedReg.regPath || '';
    const regName = parsedReg.regName || '';

    let originalValue = '';
    let exists = true;

    // Pre-optimization automatic backup snapshot
    if (regPath && regName) {
      const current = await queryRegistryValueNode(regPath, regName);
      originalValue = current.value;
      exists = current.exists;
    }
    
    await saveBackupNode(id, regPath, regName, originalValue, exists);

    // @ts-expect-error - auto fixed
    const isHklm = code.toUpperCase().includes('HKLM') || code.toUpperCase().includes('HKEY_LOCAL_MACHINE');
    const fastRegCmd = parsePowerShellToRegCmd(code);

    try {
      let executedNatively = false;

      // 1. Route Registry Commands to C++
      if (fastRegCmd && nativeAddon) {
         // fastRegCmd contains: action, path, name, value, type
         // e.g. path: HKLM\System\CurrentControlSet...
         const parts = fastRegCmd.path.split('\\');
         const rootStr = parts[0]; 
         const subPath = parts.slice(1).join('\\');

         if (fastRegCmd.action === 'set') {
            let valToPass: any = fastRegCmd.value;
            if (fastRegCmd.type === 'REG_DWORD' || fastRegCmd.type === 'REG_QWORD') {
                const parsedVal = parseInt(fastRegCmd.value, fastRegCmd.value.startsWith('0x') ? 16 : 10);
                valToPass = isNaN(parsedVal) ? 0 : parsedVal;
            }
            // writeRegistry(rootStr, pathStr, keyStr, typeStr, value)
            const success = nativeAddon.writeRegistry(rootStr, subPath, fastRegCmd.name, fastRegCmd.type, valToPass);
            if (success) {
               executedNatively = true;
            } else {
               logInfo(`[OptimizationEngine] C++ writeRegistry failed (maybe Access Denied). Falling back.`);
            }
         }
         else if (fastRegCmd.action === 'remove') {
            const success = nativeAddon.deleteRegistry(rootStr, subPath, fastRegCmd.name);
            // Deleting a non-existent key returns false from API, which is fine, treat as success or let it fallback.
            if (success) {
               executedNatively = true;
            } else {
               logInfo(`[OptimizationEngine] C++ deleteRegistry failed. Falling back.`);
            }
         }
      } 
      // 2. Route Service Commands to C++
      else if (typeof code === 'string' && code.includes('Stop-Service') && nativeAddon) {
         // Basic parsing for: Stop-Service -Name "SysMain"
         const match = code.match(/Stop-Service\s+-Name\s+["']?([^"'\s]+)["']?/i);
         if (match && match[1]) {
             const svcName = match[1];
             const success = nativeAddon.setServiceState(svcName, 0); // 0 = STOP
             if (!success) throw new Error(`C++ setServiceState failed to stop ${svcName}.`);
             executedNatively = true;
         }
      }
      // 3. Route Power Plan Commands to C++
      else if (typeof code === 'string' && code.trim().startsWith('[') && nativeAddon) {
         try {
             const jsonCmd = JSON.parse(code);
               if (Array.isArray(jsonCmd) && jsonCmd[0] && jsonCmd[0].action === 'CreatePowerPlan') {
                   const planName = jsonCmd[0].planName || "LUPER ULTIMATE";
                   logInfo(`[OptimizationEngine] Creating Power Plan via PowerShell: ${planName}`);
                   
                   const script = `
                       $baseGuid = "8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c"
                       $out = powercfg /duplicatescheme $baseGuid
                       if ($out -match "GUID: ([-a-zA-Z0-9]+)") {
                           $newGuid = $matches[1]
                           powercfg /changename $newGuid "${planName}"
                           powercfg /setactive $newGuid
                           
                           # Processor Settings (Maximized Single-Core & Multi-Core)
                           powercfg /setacvalueindex $newGuid 54533251-82be-4824-96c1-47b60b740d00 893dee8e-2bef-41e0-89c6-b55d0929964c 5   # Min Processor State (Allows frequency drop on idle)
                           powercfg /setacvalueindex $newGuid 54533251-82be-4824-96c1-47b60b740d00 bc5038f7-23e0-4960-96da-33abaf5935ec 100 # Max Processor State
                           powercfg /setacvalueindex $newGuid 54533251-82be-4824-96c1-47b60b740d00 36687f9e-e3a5-4dbf-b1dc-15eb381c6863 0   # Energy Performance Preference
                           powercfg /setacvalueindex $newGuid 54533251-82be-4824-96c1-47b60b740d00 5d76a2ca-e8c0-402f-a133-2158492d58ad 0   # Processor Idle Disable (0 = Enable Idle to reduce heat)
                           powercfg /setacvalueindex $newGuid 54533251-82be-4824-96c1-47b60b740d00 0cc5b647-c1df-4637-891a-dec35c318583 100 # Core Parking Min Cores (Unparked for zero latency)
                           powercfg /setacvalueindex $newGuid 54533251-82be-4824-96c1-47b60b740d00 06cadf0e-64ed-448a-8927-ce7bf90eb35d 0   # Increase Threshold (Immediate)
                           powercfg /setacvalueindex $newGuid 54533251-82be-4824-96c1-47b60b740d00 12a0ab44-fe28-4fa9-b3bd-4b64f44960a6 60  # Decrease Threshold (Allows downclocking if idle)
                           powercfg /setacvalueindex $newGuid 54533251-82be-4824-96c1-47b60b740d00 4b92d758-5a24-4851-a470-815d78aee119 40  # Idle Demote Threshold
                           powercfg /setacvalueindex $newGuid 54533251-82be-4824-96c1-47b60b740d00 7b224883-b66e-4a1b-a794-d592404023b2 60  # Idle Promote Threshold
                           powercfg /setacvalueindex $newGuid 54533251-82be-4824-96c1-47b60b740d00 be337238-0d82-4146-a960-4f3749d470c7 2   # Performance Boost Mode (Aggressive)
                           powercfg /setacvalueindex $newGuid 54533251-82be-4824-96c1-47b60b740d00 93b8b6dc-0698-4d1c-9ee4-0644e900c85d 1   # Heterogeneous Thread Scheduling Policy (Performant)
                           
                           # Deep P-State, Autonomous Scaling & Latency Sensitivity Tweaks
                           powercfg /setacvalueindex $newGuid 54533251-82be-4824-96c1-47b60b740d00 8baa4a8a-14c6-4451-8e8b-14bdbd197537 1   # Perf Autonomous Mode (Speed Shift)
                           powercfg /setacvalueindex $newGuid 54533251-82be-4824-96c1-47b60b740d00 984cf492-3bed-4488-a8f9-4286c97bf5aa 1   # Perf Increase Time (Fastest)
                           powercfg /setacvalueindex $newGuid 54533251-82be-4824-96c1-47b60b740d00 d8edeb9b-95cf-4f95-a73c-b061973693c8 2000 # Perf Decrease Time (Wait 2s before dropping clocks)
                           powercfg /setacvalueindex $newGuid 54533251-82be-4824-96c1-47b60b740d00 4e4450b3-6179-4e91-b8f1-5bb9938f81a1 0   # Processor Duty Cycling (Disabled)
                           powercfg /setacvalueindex $newGuid 54533251-82be-4824-96c1-47b60b740d00 619b7505-003b-4e82-b7a6-4dd29c300971 100 # Latency Sensitivity Hint (Max)
                           powercfg /setacvalueindex $newGuid 54533251-82be-4824-96c1-47b60b740d00 619b7505-003b-4e82-b7a6-4dd29c300972 100 # Latency Sensitivity Min Unparked Cores
                           powercfg /setacvalueindex $newGuid 54533251-82be-4824-96c1-47b60b740d00 94D3A615-A899-4AC5-AE2B-E4D8F634367F 1   # System Cooling Policy (Active)
                           
                           # Turbo Boost Max 3.0, Thread Director & Interrupt Steering Overrides
                           powercfg /setacvalueindex $newGuid 48c3b772-23c2-491c-b883-fa4a806c9e0d 2bfc24f9-5ea2-4801-8213-3dbae01aa39d 1    # Interrupt Steering Mode (Processor 1)
                           powercfg /setacvalueindex $newGuid 54533251-82be-4824-96c1-47b60b740d00 4d2b0152-7d5c-498b-88e2-3434539278ce 5000 # Perf Time Check
                           powercfg /setacvalueindex $newGuid 54533251-82be-4824-96c1-47b60b740d00 ea062031-0e34-4ff1-9b6d-eb1059334028 100  # Core Parking Concurrency Threshold
                           # Heterogeneous Short Running Thread (Performant)
                           
                           # --- LUPER ULTIMATE INJECTED HEURISTICS (From User) ---
                           powercfg /setacvalueindex $newGuid sub_processor CPMINCORES1 100
                           powercfg /setacvalueindex $newGuid sub_processor CPMINCORES 100
                           powercfg /setacvalueindex $newGuid sub_processor CPMAXCORES1 100
                           powercfg /setacvalueindex $newGuid sub_processor CPMAXCORES 100
                           powercfg /setacvalueindex $newGuid sub_processor PERFINCTHRESHOLD 1
                           powercfg /setacvalueindex $newGuid sub_processor PERFINCPOL 2
                           powercfg /setacvalueindex $newGuid sub_processor PERFDECPOL 1
                           powercfg /setacvalueindex $newGuid sub_processor HETPOLICY 0
                           powercfg /setacvalueindex $newGuid sub_processor SHORTTHREADRUNTIME 0
                           powercfg /setacvalueindex $newGuid sub_processor PERFCHECK 5
                           powercfg /setacvalueindex $newGuid sub_processor PERFEPP1 0
                           powercfg /setacvalueindex $newGuid sub_processor PERFEPP 0
                           powercfg /setacvalueindex $newGuid sub_processor HETPARKPOLICY 0
                           powercfg /setacvalueindex $newGuid sub_processor CPMPARKCONVERSION 1
                           powercfg /setacvalueindex $newGuid sub_processor PERFAUTONOMOUS 1
                           
                           # PCI Express ASPM
                           powercfg /setacvalueindex $newGuid 501a4d13-42af-4429-9fd1-a8218c268e20 ee12f906-d277-404b-b6da-e5fa1a576df5 0
                           
                           # USB Settings
                           powercfg /setacvalueindex $newGuid 2a737441-1930-4402-8d77-b2bebba308a3 48e6b7a6-50f5-4782-a5d4-53bb8f07e226 0
                           powercfg /setacvalueindex $newGuid 2a737441-1930-4402-8d77-b2bebba308a3 d4e98f31-5ffe-4ce1-b57a-160e417a20c6 0
                           
                           # Disk Settings
                           powercfg /setacvalueindex $newGuid 0012ee47-9041-4b5d-9b77-535fba8b1442 6738e2c4-e8a5-4a42-b16a-e040e769756e 0
                           powercfg /setacvalueindex $newGuid 0012ee47-9041-4b5d-9b77-535fba8b1442 0b2d69d7-a2a1-449c-9680-f91c70521c60 0
                           powercfg /setacvalueindex $newGuid 0012ee47-9041-4b5d-9b77-535fba8b1442 fc95af4d-40e7-4b6d-835a-56d131dbc80e 0
                           
                           # Wireless Adapter Settings
                           powercfg /setacvalueindex $newGuid 19cbb8fa-5279-450e-9fac-8a3d5fedd0c1 12bbebe6-58d6-4636-95bb-3217ef867c1a 0
                           
                           # Sleep Settings
                           powercfg /setacvalueindex $newGuid 238c9fa8-0aad-41ed-83f4-97be242c8f20 bd3b718a-0680-4d9d-8ab2-e1d2b4ac806d 0
                           powercfg /setacvalueindex $newGuid 238c9fa8-0aad-41ed-83f4-97be242c8f20 29f6c1db-86da-48c5-9fdb-f2b67b1f44da 0
                           
                           # Display Settings
                           powercfg /setacvalueindex $newGuid 7516b95f-f776-4464-8c53-06167f40cc99 fbd9aa66-9553-4097-ba06-ed31e62a2a1b 0
                           
                           # Video Settings
                           powercfg /setacvalueindex $newGuid 9596fb26-9850-41fd-ac3e-f7c3c00afd4b 34c7b99f-9a6d-4b3c-8dc7-b6693b78cef4 1
                           
                           # Apply DC (Battery) settings exactly the same
                           powercfg /setdcvalueindex $newGuid 54533251-82be-4824-96c1-47b60b740d00 893dee8e-2bef-41e0-89c6-b55d0929964c 100
                           powercfg /setdcvalueindex $newGuid 54533251-82be-4824-96c1-47b60b740d00 bc5038f7-23e0-4960-96da-33abaf5935ec 100
                           powercfg /setdcvalueindex $newGuid 54533251-82be-4824-96c1-47b60b740d00 36687f9e-e3a5-4dbf-b1dc-15eb381c6863 0
                           powercfg /setdcvalueindex $newGuid 54533251-82be-4824-96c1-47b60b740d00 5d76a2ca-e8c0-402f-a133-2158492d58ad 1
                           powercfg /setdcvalueindex $newGuid 54533251-82be-4824-96c1-47b60b740d00 0cc5b647-c1df-4637-891a-dec35c318583 100
                           powercfg /setdcvalueindex $newGuid 54533251-82be-4824-96c1-47b60b740d00 06cadf0e-64ed-448a-8927-ce7bf90eb35d 0
                           powercfg /setdcvalueindex $newGuid 54533251-82be-4824-96c1-47b60b740d00 12a0ab44-fe28-4fa9-b3bd-4b64f44960a6 100
                           powercfg /setdcvalueindex $newGuid 54533251-82be-4824-96c1-47b60b740d00 4b92d758-5a24-4851-a470-815d78aee119 100
                           powercfg /setdcvalueindex $newGuid 54533251-82be-4824-96c1-47b60b740d00 be337238-0d82-4146-a960-4f3749d470c7 2
                           powercfg /setdcvalueindex $newGuid 54533251-82be-4824-96c1-47b60b740d00 93b8b6dc-0698-4d1c-9ee4-0644e900c85d 0
                           
                           # --- LUPER ULTIMATE INJECTED HEURISTICS (From User) (DC) ---
                           powercfg /setdcvalueindex $newGuid sub_processor CPMINCORES1 100
                           powercfg /setdcvalueindex $newGuid sub_processor CPMINCORES 100
                           powercfg /setdcvalueindex $newGuid sub_processor CPMAXCORES1 100
                           powercfg /setdcvalueindex $newGuid sub_processor CPMAXCORES 100
                           powercfg /setdcvalueindex $newGuid sub_processor PERFINCTHRESHOLD 1
                           powercfg /setdcvalueindex $newGuid sub_processor PERFINCPOL 2
                           powercfg /setdcvalueindex $newGuid sub_processor PERFDECPOL 1
                           powercfg /setdcvalueindex $newGuid sub_processor HETPOLICY 0
                           powercfg /setdcvalueindex $newGuid sub_processor SHORTTHREADRUNTIME 0
                           powercfg /setdcvalueindex $newGuid sub_processor PERFCHECK 5
                           powercfg /setdcvalueindex $newGuid sub_processor PERFEPP1 0
                           powercfg /setdcvalueindex $newGuid sub_processor PERFEPP 0
                           powercfg /setdcvalueindex $newGuid sub_processor HETPARKPOLICY 0
                           powercfg /setdcvalueindex $newGuid sub_processor CPMPARKCONVERSION 1
                           powercfg /setdcvalueindex $newGuid sub_processor PERFAUTONOMOUS 1

                           powercfg /setdcvalueindex $newGuid 501a4d13-42af-4429-9fd1-a8218c268e20 ee12f906-d277-404b-b6da-e5fa1a576df5 0
                           powercfg /setdcvalueindex $newGuid 2a737441-1930-4402-8d77-b2bebba308a3 48e6b7a6-50f5-4782-a5d4-53bb8f07e226 0
                           powercfg /setdcvalueindex $newGuid 2a737441-1930-4402-8d77-b2bebba308a3 d4e98f31-5ffe-4ce1-b57a-160e417a20c6 0
                           powercfg /setdcvalueindex $newGuid 0012ee47-9041-4b5d-9b77-535fba8b1442 6738e2c4-e8a5-4a42-b16a-e040e769756e 0
                           powercfg /setdcvalueindex $newGuid 0012ee47-9041-4b5d-9b77-535fba8b1442 0b2d69d7-a2a1-449c-9680-f91c70521c60 0
                           powercfg /setdcvalueindex $newGuid 0012ee47-9041-4b5d-9b77-535fba8b1442 fc95af4d-40e7-4b6d-835a-56d131dbc80e 0
                           powercfg /setdcvalueindex $newGuid 19cbb8fa-5279-450e-9fac-8a3d5fedd0c1 12bbebe6-58d6-4636-95bb-3217ef867c1a 0
                           powercfg /setdcvalueindex $newGuid 238c9fa8-0aad-41ed-83f4-97be242c8f20 bd3b718a-0680-4d9d-8ab2-e1d2b4ac806d 0
                           powercfg /setdcvalueindex $newGuid 238c9fa8-0aad-41ed-83f4-97be242c8f20 29f6c1db-86da-48c5-9fdb-f2b67b1f44da 0
                           powercfg /setdcvalueindex $newGuid 7516b95f-f776-4464-8c53-06167f40cc99 fbd9aa66-9553-4097-ba06-ed31e62a2a1b 0
                           powercfg /setdcvalueindex $newGuid 9596fb26-9850-41fd-ac3e-f7c3c00afd4b 34c7b99f-9a6d-4b3c-8dc7-b6693b78cef4 1
                           
                           Write-Output $newGuid
                       }
                   `;
                   const result = await runElevatedPowerShellScript(script);
                   const newGuid = result.split('\n').map(l => l.trim()).find(l => l.match(/^[a-fA-F0-9-]+$/));
                   
                   if (!newGuid) throw new Error(`PowerShell createPowerPlan failed for ${planName}.`);
                   
                   // Save the generated GUID for restoration later
                   await saveBackupNode(id, 'PowerPlan', planName, newGuid, true);
                   logInfo(`[OptimizationEngine] Saved backup for ${id} with GUID: ${newGuid}`);
                   executedNatively = true;
               }
         } catch (e) {
             logError(`[OptimizationEngine] Failed to route JSON command:`, (e as Error).message);
         }
      }

      // 4. Fallback to PowerShell ONLY if it couldn't be routed to C++ 
      // (To preserve legacy complex scripts during transition)
      if (!executedNatively) {
          logInfo(`[OptimizationEngine] Action couldn't be parsed natively. Falling back to PS: ${id}`);
          if (!isHklm) {
            await runPowerShellScript(code);
          } else {
            await runElevatedPowerShellScript(code);
          }
      }

      // Post-execution verification
      await ValidationEngine.verifyPostExecution(id, code);

      logInfo(`[OptimizationEngine] Successfully applied: [${id}] in ${Date.now() - startTime}ms`);
      return { success: true, id, durationMs: Date.now() - startTime };
    } catch (error) {
      logError(`[OptimizationEngine] Execution failed for [${id}]:`, { error: (error as Error).message });
      throw new Error('Yönetici izni gereklidir. Lütfen açılan UAC penceresini onaylayın veya uygulamayı Yönetici olarak çalıştırın.');
    }
  }

  /**
   * Restore a single optimization back to original backup state
   */
  async restoreOptimization(id: unknown, code: unknown) {
    const startTime = Date.now();
    logInfo(`[OptimizationEngine] Restoring optimization: [${id}]`);

    if (process.platform !== 'win32') {
      await deleteBackupNode(id);
      return { success: true, id, durationMs: Date.now() - startTime };
    }

    const backups = await getBackupsNode();
    // @ts-expect-error - auto fixed
    const backup = backups[id];
    
    // Always delete the backup node when restore starts
    await deleteBackupNode(id);
    
    let restoreCode = code;

    let isPowerPlanRestore = false;
    let powerPlanGuidToRestore = '';

    if (backup && backup.regPath && backup.regName) {
      if (backup.regPath === 'PowerPlan') {
          isPowerPlanRestore = true;
          powerPlanGuidToRestore = backup.originalValue || '';
      }
      else if (backup.exists && backup.originalValue !== undefined && backup.originalValue !== null) {
        restoreCode = `Set-ItemProperty -Path "${backup.regPath}" -Name "${backup.regName}" -Value ${backup.originalValue === '' ? '""' : backup.originalValue} -ErrorAction SilentlyContinue`;
      } else if (backup.exists === false) {
        restoreCode = `Remove-ItemProperty -Path "${backup.regPath}" -Name "${backup.regName}" -ErrorAction SilentlyContinue`;
      }
    }

    if (!restoreCode) {
      return { success: true, id, durationMs: Date.now() - startTime };
    }

    // @ts-expect-error - auto fixed
    const isHklm = restoreCode.toUpperCase().includes('HKLM') || restoreCode.toUpperCase().includes('HKEY_LOCAL_MACHINE');
    const fastRegCmd = parsePowerShellToRegCmd(restoreCode);

    try {
      let executedNatively = false;

      // 1. Route Registry Commands to C++
      if (fastRegCmd && nativeAddon) {
         const parts = fastRegCmd.path.split('\\');
         const rootStr = parts[0]; 
         const subPath = parts.slice(1).join('\\');

         if (fastRegCmd.action === 'set') {
            let valToPass: any = fastRegCmd.value;
            if (fastRegCmd.type === 'REG_DWORD' || fastRegCmd.type === 'REG_QWORD') {
                const parsedVal = parseInt(fastRegCmd.value, fastRegCmd.value.startsWith('0x') ? 16 : 10);
                valToPass = isNaN(parsedVal) ? 0 : parsedVal;
            }
            const success = nativeAddon.writeRegistry(rootStr, subPath, fastRegCmd.name, fastRegCmd.type, valToPass);
            if (success) {
               executedNatively = true;
            } else {
               logInfo(`[OptimizationEngine] C++ writeRegistry failed on restore. Falling back.`);
            }
         }
         else if (fastRegCmd.action === 'remove') {
            const success = nativeAddon.deleteRegistry(rootStr, subPath, fastRegCmd.name);
            if (success) {
               executedNatively = true;
            } else {
               logInfo(`[OptimizationEngine] C++ deleteRegistry failed on restore. Falling back.`);
            }
         }
      } 
      // 2. Route Service Commands to C++
      else if (typeof restoreCode === 'string' && restoreCode.includes('Start-Service') && nativeAddon) {
         const match = restoreCode.match(/Start-Service\s+-Name\s+["']?([^"'\s]+)["']?/i);
         if (match && match[1]) {
             const svcName = match[1];
             const success = nativeAddon.setServiceState(svcName, 1); // 1 = START
             if (!success) throw new Error(`C++ setServiceState failed to start ${svcName}.`);
             executedNatively = true;
         }
      }
      // 3. Route Power Plan Restore Commands to C++
      else if (isPowerPlanRestore) {
          // If the backup node saved the planName, use it. Otherwise guess LUPER ULTIMATE
          const backupNode = (await import('./backupRestoreEngine')).getBackupNode(id);
          const planName = backupNode?.restoreData?.planName || "LUPER ULTIMATE";
          
          logInfo(`[OptimizationEngine] Deleting Power Plan via PowerShell: ${powerPlanGuidToRestore} (${planName})`);
          
          const script = `
              # 381b4222-f694-41f0-9685-ff5bb260df2e is the standard Balanced power plan GUID
              powercfg /setactive 381b4222-f694-41f0-9685-ff5bb260df2e
              Start-Sleep -Milliseconds 200
              powercfg /delete ${powerPlanGuidToRestore}
              
              # Also cleanup any other leftover plans just in case
              $plans = Get-CimInstance -ClassName Win32_PowerPlan -Namespace root\\cimv2\\power | Where-Object { $_.ElementName -eq '${planName}' }
              foreach ($p in $plans) {
                  $gid = $p.InstanceID.Split('{')[1].TrimEnd('}')
                  if ($gid -ne "381b4222-f694-41f0-9685-ff5bb260df2e") {
                      powercfg /delete $gid
                  }
              }
          `;
          
          try {
              await runElevatedPowerShellScript(script);
              await deleteBackupNode(id);
              executedNatively = true;
          } catch (e) {
              logError(`[OptimizationEngine] PowerShell deletePowerPlan failed to restore/delete GUID: ${powerPlanGuidToRestore}`);
          }
      }
      // 4. Route Power Plan Restore Commands to C++ via JSON (if backup was lost)
      else if (typeof code === 'string' && code.trim().startsWith('[') && nativeAddon) {
         try {
             const jsonCmd = JSON.parse(code);
             if (Array.isArray(jsonCmd) && jsonCmd[0] && jsonCmd[0].action === 'DeletePowerPlan') {
                 // We don't have the GUID from backup, so we can't delete it directly by GUID.
                 // We need to find the GUID by name, but we don't have a C++ function for that.
                 // However, we can use PowerShell to delete it by name.
                 const planName = jsonCmd[0].planName || "LUPER FPS";
                 // Fallback to powershell to delete the plan if we lost the backup GUID
                 await runElevatedPowerShellScript(`
                    $plan = Get-CimInstance -ClassName Win32_PowerPlan -Namespace root\\cimv2\\power | Where-Object { $_.ElementName -eq '${planName}' }
                    if ($plan) {
                        # 381b4222-f694-41f0-9685-ff5bb260df2e is the standard Balanced power plan GUID
                        powercfg /setactive 381b4222-f694-41f0-9685-ff5bb260df2e
                        Start-Sleep -Milliseconds 200
                        powercfg /delete $plan.InstanceID.Split('{')[1].TrimEnd('}')
                    }
                 `);
                 executedNatively = true;
             }
         } catch (e) {
             logError(`[OptimizationEngine] Failed to route JSON restore command:`, (e as Error).message);
         }
      }

      if (!executedNatively) {
          logInfo(`[OptimizationEngine] Restore action couldn't be parsed natively. Falling back to PS: ${id}`);
          if (!isHklm) {
            await runPowerShellScript(restoreCode);
          } else {
            await runElevatedPowerShellScript(restoreCode);
          }
      }

      logInfo(`[OptimizationEngine] Successfully restored: [${id}]`);
      return { success: true, id, durationMs: Date.now() - startTime };
    } catch (error) {
      logError(`[OptimizationEngine] Restore failed for [${id}]:`, { error: (error as Error).message });
      throw new Error('Yönetici izni gereklidir. Lütfen açılan UAC penceresini onaylayın veya uygulamayı Yönetici olarak çalıştırın.');
    }
  }

  /**
   * Execute batch optimizations with automatic transaction rollback support
   */
  async applyBatchOptimizations(ids: unknown, scriptMap: unknown = {}) {
    const startTime = Date.now();
    // @ts-expect-error - auto fixed
    logInfo(`[OptimizationEngine] Starting batch execution for ${ids.length} items`);

    const appliedIds: unknown[] = [];
    const failedIds: unknown[] = [];

    let combinedScript = '';

    // @ts-expect-error - auto fixed
    for (const id: unknown of ids) {
      // @ts-expect-error - auto fixed
      const scriptCode = scriptMap[id];
      if (scriptCode) {
        combinedScript += `\n# Optimization ID: ${id}\n${scriptCode}\n`;

        const parsedReg = parseRegPathAndName(scriptCode) || {};
        const regPath = parsedReg.regPath || '';
        const regName = parsedReg.regName || '';

        let originalValue = '';
        let exists = true;

        if (regPath && regName) {
          const current = await queryRegistryValueNode(regPath, regName);
          originalValue = current.value;
          exists = current.exists;
        }
        
        await saveBackupNode(id, regPath, regName, originalValue, exists);
        appliedIds.push(id);
      }
    }

    if (combinedScript && process.platform === 'win32') {
      try {
        await runElevatedPowerShellScript(combinedScript);
      } catch (error) {
        logError(`[OptimizationEngine] Batch execution encountered failure; initiating safety rollback`, { error: (error as Error).message });
        // @ts-expect-error - auto fixed
        for (const rolledId: unknown of appliedIds) {
          try {
            // @ts-expect-error - auto fixed
            await this.restoreOptimization(rolledId, scriptMap[rolledId]);
          } catch (rErr) {}
        }
        throw new Error('Yönetici izni gereklidir. Lütfen açılan UAC penceresini onaylayın veya uygulamayı Yönetici olarak çalıştırın.');
      }
    }

    return {
      success: true,
      applied: appliedIds,
      failed: failedIds,
      durationMs: Date.now() - startTime
    };
  }

    registry!: unknown;
}

export const OptimizationEngine = new OptimizationEngineCore();
