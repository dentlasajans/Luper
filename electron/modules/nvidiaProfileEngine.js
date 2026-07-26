import fs from 'fs';
import os from 'os';
import path from 'path';
import { app } from 'electron';
import util from 'util';
import { execFile } from 'child_process';
import { logError } from './logger.js';

const execFileAsync = util.promisify(execFile);

export async function applyNvidiaProfileMode(mode) {
    const settingsConfig = {
        fps: [
            { id: 274197361, val: 1 },         // Power management: Prefer Maximum Performance
            { id: 13510289, val: 20 },         // Texture filtering - Quality: High Performance
            { id: 8102046, val: 1 },           // Maximum pre-rendered frames: 1 (Lowest Latency)
            { id: 277041152, val: 2 },         // Low Latency Mode: 2 (Ultra)
            { id: 549528094, val: 1 },         // Threaded optimization: 1 (On)
            { id: 11041231, val: 138504007 },  // Vertical Sync: Force Off
            { id: 3066610, val: 1 },           // Texture filtering - Trilinear optimization: 1 (On)
            { id: 15151633, val: 1 },          // Texture filtering - Anisotropic sample opt: 1 (On)
            { id: 8703344, val: 1 },           // Texture filtering - Anisotropic filter opt: 1 (On)
            { id: 274502709, val: 1 },         // Preferred refresh rate: 1 (Highest available)
            { id: 11306135, val: 102400 }      // Shader disk cache maximum size: 100GB
        ],
        'aaa-quality': [
            { id: 274197361, val: 1 },         // Power management: Prefer Maximum Performance
            { id: 13510289, val: 0 },          // Texture filtering - Quality: High Quality
            { id: 8102046, val: 0 },           // Maximum pre-rendered frames: 0 (Let 3D app decide)
            { id: 277041152, val: 0 },         // Low Latency Mode: 0 (Off)
            { id: 549528094, val: 1 },         // Threaded optimization: 1 (On)
            { id: 11041231, val: 119965523 },  // Vertical Sync: Use 3D app setting
            { id: 3066610, val: 0 },           // Texture filtering - Trilinear optimization: 0 (Off)
            { id: 15151633, val: 0 },          // Texture filtering - Anisotropic sample opt: 0 (Off)
            { id: 8703344, val: 0 },           // Texture filtering - Anisotropic filter opt: 0 (Off)
            { id: 270426537, val: 16 },        // Anisotropic filtering setting: 16x
            { id: 11306135, val: 102400 }      // Shader cache: 100GB
        ],
        'aaa-fps': [
            { id: 274197361, val: 1 },         // Power management: Prefer Maximum Performance
            { id: 13510289, val: 20 },         // Texture filtering - Quality: Performance
            { id: 8102046, val: 1 },           // Maximum pre-rendered frames: 1 (Low Latency)
            { id: 277041152, val: 1 },         // Low Latency Mode: 1 (On)
            { id: 549528094, val: 1 },         // Threaded optimization: 1 (On)
            { id: 11041231, val: 119965523 },  // Vertical Sync: Use 3D app setting (AAA games need this)
            { id: 3066610, val: 1 },           // Texture filtering - Trilinear optimization: 1 (On)
            { id: 15151633, val: 1 },          // Texture filtering - Anisotropic sample opt: 1 (On)
            { id: 8703344, val: 1 },           // Texture filtering - Anisotropic filter opt: 1 (On)
            { id: 270426537, val: 8 },         // Anisotropic filtering setting: 8x
            { id: 11306135, val: 102400 }      // Shader cache: 100GB
        ],
        balanced: [
            { id: 274197361, val: 0 },         // Power management: Adaptive/Optimal
            { id: 13510289, val: 0 },          // Texture filtering - Quality: Quality (Default)
            { id: 8102046, val: 0 },           // Maximum pre-rendered frames: 0 (App decided)
            { id: 277041152, val: 0 },         // Low Latency Mode: 0 (Off)
            { id: 549528094, val: 0 },         // Threaded optimization: 0 (Auto)
            { id: 11041231, val: 119965523 },  // Vertical Sync: Use 3D app setting
            { id: 3066610, val: 0 },           // Texture filtering - Trilinear optimization: 0
            { id: 15151633, val: 0 },          // Texture filtering - Anisotropic sample opt: 0
            { id: 8703344, val: 0 },           // Texture filtering - Anisotropic filter opt: 0
            { id: 11306135, val: 10240 }       // Shader cache: 10GB
        ]
    };

    if (!settingsConfig[mode]) {
        throw new Error('Geçersiz mod. Beklenen: fps | aaa | balanced');
    }

    const targetSettings = settingsConfig[mode];
    
    let settingsXML = targetSettings.map(s => `
      <ProfileSetting>
        <SettingNameInfo />
        <SettingID>${s.id}</SettingID>
        <SettingValue>${s.val}</SettingValue>
        <ValueType>Dword</ValueType>
      </ProfileSetting>`).join('');

    const profileXML = `<?xml version="1.0" encoding="utf-16"?>
<ArrayOfProfile>
  <Profile>
    <ProfileName>Base Profile</ProfileName>
    <Executeables />
    <Settings>${settingsXML}
    </Settings>
  </Profile>
</ArrayOfProfile>`;

    try {
        const tmpFilePath = path.join(os.tmpdir(), 'luper-gpu.nip');
        
        // UTF-16LE encode with BOM
        const buffer = Buffer.from('\uFEFF' + profileXML, 'utf16le');
        await fs.promises.writeFile(tmpFilePath, buffer);
        
        const isDev = !app.isPackaged;
        const exePath = isDev 
          ? path.join(process.cwd(), 'resources', 'installers', 'nvidiaProfileInspector.exe')
          : path.join(process.resourcesPath, 'installers', 'nvidiaProfileInspector.exe');

        await execFileAsync(exePath, [tmpFilePath, '-silent']);
        return true;
    } catch (e) {
        logError('NVIDIA Profile Error:', { error: e.message });
        return false;
    }
}
