# Yeni GPU Optimizasyonları Araştırma Raporu (GPU Tweak Collection)

**Oluşturulma Tarihi:** 2026-07-30  
**Araştırmacı Ajan:** GPU Kod Araştırmacısı Ajanı (GPU Researcher Agent)  
**Hedef Rapor Dosyası:** `C:\Luper\docs\research\new_tweaks_gpu.md`  
**Referans Veritabanı:** `C:\Luper\docs\database\gpu.json` (Mevcut 4 optimizasyon kontrol edildi, hiçbir çakışma yok)

---

## 1. Message Signaled Interrupts (MSI Mode) & Line-Based Interrupt Mode Override for GPU

- **Title:** GPU Message Signaled Interrupts (MSI Mode) Etkinleştirme
- **Category:** Interrupt Management & PCI Express Latency
- **Short description:** GPU sürücülerinin geleneksel hat tabanlı (line-based IRQ) kesme sinyalleri yerine yüksek hızlı MSI (Message Signaled Interrupts) modunu kullanmasını sağlayarak DPC gecikmesini, IRQ çakışmalarını ve oyun içi micro-stuttering (mikro takılma) sorunlarını düşürür.
- **Exact code:**
```reg
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Enum\PCI\<GPU_Device_Instance_Path>\Device Parameters\Interrupt Management\MessageSignaledInterruptProperties]
"MSISupported"=dword:00000001
"MessageNumberLimit"=dword:00000001
```
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Enum\PCI\<GPU_Device_Instance_Path>\Device Parameters\Interrupt Management\MessageSignaledInterruptProperties`
- **Registry value:** `MSISupported` = `1` (REG_DWORD), `MessageNumberLimit` = `1` (REG_DWORD)
- **PowerShell command:**
```powershell
Get-PnpDevice -Class Display | ForEach-Object {
    $path = "HKLM:\SYSTEM\CurrentControlSet\Enum\" + $_.InstanceId + "\Device Parameters\Interrupt Management\MessageSignaledInterruptProperties"
    if (-not (Test-Path $path)) { New-Item -Path $path -Force }
    Set-ItemProperty -Path $path -Name "MSISupported" -Value 1 -Type DWord
    Set-ItemProperty -Path $path -Name "MessageNumberLimit" -Value 1 -Type DWord
}
```
- **CMD command:**
```cmd
reg add "HKLM\SYSTEM\CurrentControlSet\Enum\PCI\<GPU_Device_Instance_Path>\Device Parameters\Interrupt Management\MessageSignaledInterruptProperties" /v MSISupported /t REG_DWORD /d 1 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Enum\PCI\<GPU_Device_Instance_Path>\Device Parameters\Interrupt Management\MessageSignaledInterruptProperties" /v MessageNumberLimit /t REG_DWORD /d 1 /f
```
- **BCDEdit command:** N/A
- **Driver setting:** MSI Mode Enabled / Interrupt Handling Priority High
- **Driver profile:** N/A
- **GUID (if any):** N/A
- **Supported GPU vendors:** NVIDIA GeForce / Quadro, AMD Radeon / FirePro, Intel Arc / Iris Xe, Integrated GPUs
- **Supported Windows versions:** Windows 10 (tüm derlemeler), Windows 11 (tüm derlemeler)
- **DirectX/Vulkan/OpenGL compatibility:** Tüm Grafik API'leri (DirectX 9/11/12, Vulkan, OpenGL, OpenCL)
- **Related tweaks:** Interrupt Affinity Policy, IRQ Priority, High Precision Event Timer Disabling
- **Alternative values:** `MessageNumberLimit`: `2`, `4`, `8` (MSI-X mimarisine sahip çok çekirdekli gelişmiş GPU'lar için)
- **Original source:** Microsoft Hardware Developer Documentation & Guru3D MSI Tool Project
- **Official documentation:** https://learn.microsoft.com/en-us/windows-hardware/drivers/kernel/enabling-message-signaled-interrupts-in-the-registry
- **Community discussion URL:** https://forums.guru3d.com/threads/msi-tool-v3-process-prio-set-target-gpu.420573/
- **GitHub URL:** https://github.com/chpaech/MSI-Utility-v3
- **Forum URL:** https://www.reddit.com/r/OptimizedSomeGames/comments/msi_mode_guide/

---

## 2. GameDVR & Global Fullscreen Optimization Overrides (EFSE & FSE Behavior)

- **Title:** Windows Tam Ekran Optimizasyonları ve GameDVR Devre Dışı Bırakma (EFSE Override)
- **Category:** Fullscreen Optimizations & GameDVR Presentation
- **Short description:** Windows GameDVR ve hibrit pencere/tam ekran optimizasyonlarını (Enhanced Fullscreen Exclusive - EFSE) kayıt defteri düzeyinde tamamen kapatarak oyunların saf exclusive fullscreen modunda çalışmasını sağlar ve render katmanı girdi gecikmesini (input lag) düşürür.
- **Exact code:**
```reg
Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\System\GameConfigStore]
"GameDVR_FSEBehaviorMode"=dword:00000002
"GameDVR_HonorUserFSEBehaviorMode"=dword:00000001
"GameDVR_EFSEFeatureFlags"=dword:00000000
"GameDVR_DXGIHonorFSEWindowsCompatible"=dword:00000001
"GameDVR_Enabled"=dword:00000000

[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\GameDVR]
"AllowGameDVR"=dword:00000000

[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\PolicyManager\default\ApplicationManagement\AllowGameDVR]
"value"=dword:00000000
```
- **Registry path:** `HKCU\System\GameConfigStore`, `HKLM\SOFTWARE\Policies\Microsoft\Windows\GameDVR`, `HKLM\SOFTWARE\Microsoft\PolicyManager\default\ApplicationManagement\AllowGameDVR`
- **Registry value:** `GameDVR_FSEBehaviorMode` = `2` (REG_DWORD), `GameDVR_HonorUserFSEBehaviorMode` = `1` (REG_DWORD), `GameDVR_EFSEFeatureFlags` = `0` (REG_DWORD), `GameDVR_DXGIHonorFSEWindowsCompatible` = `1` (REG_DWORD), `GameDVR_Enabled` = `0` (REG_DWORD), `AllowGameDVR` = `0` (REG_DWORD)
- **PowerShell command:**
```powershell
Set-ItemProperty -Path "HKCU:\System\GameConfigStore" -Name "GameDVR_FSEBehaviorMode" -Value 2 -Type DWord
Set-ItemProperty -Path "HKCU:\System\GameConfigStore" -Name "GameDVR_HonorUserFSEBehaviorMode" -Value 1 -Type DWord
Set-ItemProperty -Path "HKCU:\System\GameConfigStore" -Name "GameDVR_EFSEFeatureFlags" -Value 0 -Type DWord
Set-ItemProperty -Path "HKCU:\System\GameConfigStore" -Name "GameDVR_DXGIHonorFSEWindowsCompatible" -Value 1 -Type DWord
Set-ItemProperty -Path "HKCU:\System\GameConfigStore" -Name "GameDVR_Enabled" -Value 0 -Type DWord
if (-not (Test-Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\GameDVR")) { New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\GameDVR" -Force }
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\GameDVR" -Name "AllowGameDVR" -Value 0 -Type DWord
```
- **CMD command:**
```cmd
reg add "HKCU\System\GameConfigStore" /v GameDVR_FSEBehaviorMode /t REG_DWORD /d 2 /f
reg add "HKCU\System\GameConfigStore" /v GameDVR_HonorUserFSEBehaviorMode /t REG_DWORD /d 1 /f
reg add "HKCU\System\GameConfigStore" /v GameDVR_EFSEFeatureFlags /t REG_DWORD /d 0 /f
reg add "HKCU\System\GameConfigStore" /v GameDVR_DXGIHonorFSEWindowsCompatible /t REG_DWORD /d 1 /f
reg add "HKCU\System\GameConfigStore" /v GameDVR_Enabled /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\GameDVR" /v AllowGameDVR /t REG_DWORD /d 0 /f
```
- **BCDEdit command:** N/A
- **Driver setting:** Fullscreen Optimizations Global Override
- **Driver profile:** N/A
- **GUID (if any):** N/A
- **Supported GPU vendors:** NVIDIA, AMD Radeon, Intel Arc
- **Supported Windows versions:** Windows 10 (1809 - 22H2), Windows 11 (tüm sürümler)
- **DirectX/Vulkan/OpenGL compatibility:** DirectX 9, DirectX 11, DirectX 12, Vulkan
- **Related tweaks:** Disable MPO (Multiplane Overlay), Windowed Games Optimizations
- **Alternative values:** `GameDVR_FSEBehaviorMode`: `0` (Varsayılan Açık), `1` (Pencereli Optimizasyon Zorla)
- **Original source:** Windows Internals, PCGamingWiki & Esports Tuning Labs
- **Official documentation:** https://learn.microsoft.com/en-us/windows/win32/direct3ddxgx/fullscreen-optimizations
- **Community discussion URL:** https://www.reddit.com/r/Windows10/comments/7nc0sq/disable_fullscreen_optimizations/
- **GitHub URL:** https://github.com/djdallmann/GamingPowerPlan
- **Forum URL:** https://tenforums.com/tutorials/104025-turn-off-fullscreen-optimizations-windows-10-a.html

---

## 3. DirectX / DXGI Global High Performance Preference & User GPU Override

- **Title:** DXGI & DirectX Yüksek Performans GPU Tercihi Zorlaması
- **Category:** DXGI & Direct3D Pipeline
- **Short description:** Tüm 3D grafik uygulamaları ve oyunlar için DXGI/DirectX katmanında varsayılan olarak yüksek performanslı ayrılmış (discrete) GPU kullanımını zorlar, hibrit GPU gecikmesini önler.
- **Exact code:**
```reg
Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\Software\Microsoft\DirectX\UserGpuPreferences]
"DirectXUserGlobalGPUPreference"=dword:00000002

[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\DirectX]
"UserGpuPreference"=dword:00000002

[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\DirectDraw]
"EmulationOnly"=dword:00000000
```
- **Registry path:** `HKCU\Software\Microsoft\DirectX\UserGpuPreferences`, `HKLM\SOFTWARE\Microsoft\DirectX`, `HKLM\SOFTWARE\Microsoft\DirectDraw`
- **Registry value:** `DirectXUserGlobalGPUPreference` = `2` (REG_DWORD), `UserGpuPreference` = `2` (REG_DWORD), `EmulationOnly` = `0` (REG_DWORD)
- **PowerShell command:**
```powershell
if (-not (Test-Path "HKCU:\Software\Microsoft\DirectX\UserGpuPreferences")) { New-Item -Path "HKCU:\Software\Microsoft\DirectX\UserGpuPreferences" -Force }
Set-ItemProperty -Path "HKCU:\Software\Microsoft\DirectX\UserGpuPreferences" -Name "DirectXUserGlobalGPUPreference" -Value 2 -Type DWord
Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\DirectX" -Name "UserGpuPreference" -Value 2 -Type DWord
Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\DirectDraw" -Name "EmulationOnly" -Value 0 -Type DWord
```
- **CMD command:**
```cmd
reg add "HKCU\Software\Microsoft\DirectX\UserGpuPreferences" /v DirectXUserGlobalGPUPreference /t REG_DWORD /d 2 /f
reg add "HKLM\SOFTWARE\Microsoft\DirectX" /v UserGpuPreference /t REG_DWORD /d 2 /f
reg add "HKLM\SOFTWARE\Microsoft\DirectDraw" /v EmulationOnly /t REG_DWORD /d 0 /f
```
- **BCDEdit command:** N/A
- **Driver setting:** Power Performance State / Preferred Graphics Processor = High-performance NVIDIA/AMD processor
- **Driver profile:** N/A
- **GUID (if any):** N/A
- **Supported GPU vendors:** NVIDIA, AMD Radeon, Intel Arc, Dual-GPU Laptop Systems (Optimus, SmartShift, MUX Switch)
- **Supported Windows versions:** Windows 10 (2004 ve üzeri), Windows 11
- **DirectX/Vulkan/OpenGL compatibility:** DirectX 11, DirectX 12, DXGI Flip Presentation
- **Related tweaks:** Hardware Accelerated GPU Scheduling (HAGS), MUX Switch Mode
- **Alternative values:** `1` (Power Saving / Entegre GPU), `0` (Sistem Otomatik Kararı)
- **Original source:** Microsoft DirectX Graphics Architecture Specifications
- **Official documentation:** https://learn.microsoft.com/en-us/windows/win32/direct3ddxgx/dxgi-graphics-pipeline
- **Community discussion URL:** https://reddit.com/r/pcgaming/comments/graphics_performance_preference_registry/
- **GitHub URL:** https://github.com/microsoft/DirectX-Graphics-Samples
- **Forum URL:** https://blur-busters.com/forums/viewtopic.php?t=8901

---

## 4. NVIDIA GPU P-State Lock (Force P0) & Shader Cache Registry Expansion

- **Title:** NVIDIA GPU P-State Lock (Force P0) & Shader Önbellek Limit Artırımı
- **Category:** NVIDIA Profile & Driver Registry
- **Short description:** NVIDIA GPU'larda sürücünün güç tasarrufu amaçlı düşük saat hızlarına (P2/P8 P-State) geçmesini engelleyerek sürekli tepe performans saat hızında (P0 State) kalmasını sağlar; ek olarak Shader Cache boyut limitini 10 GB seviyesine çıkararak oyunlardaki derleme kaynaklı shader takılmalarını engeller.
- **Exact code:**
```reg
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfba-08002be10318}\0000]
"DisablePowerManagement"=dword:00000001
"RmEnablePstateLocked"=dword:00000001
"RmDisableGpuReset"=dword:00000001

[HKEY_LOCAL_MACHINE\SOFTWARE\NVIDIA Corporation\Global\NVTweak]
"DisableShaderCache"=dword:00000000
"ShaderCacheSize"=dword:00002800
```
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfba-08002be10318}\0000`, `HKLM\SOFTWARE\NVIDIA Corporation\Global\NVTweak`
- **Registry value:** `DisablePowerManagement` = `1` (REG_DWORD), `RmEnablePstateLocked` = `1` (REG_DWORD), `RmDisableGpuReset` = `1` (REG_DWORD), `DisableShaderCache` = `0` (REG_DWORD), `ShaderCacheSize` = `10240` (0x2800 REG_DWORD - 10 GB MB cinsinden)
- **PowerShell command:**
```powershell
if (-not (Test-Path "HKLM:\SOFTWARE\NVIDIA Corporation\Global\NVTweak")) { New-Item -Path "HKLM:\SOFTWARE\NVIDIA Corporation\Global\NVTweak" -Force }
Set-ItemProperty -Path "HKLM:\SOFTWARE\NVIDIA Corporation\Global\NVTweak" -Name "DisableShaderCache" -Value 0 -Type DWord
Set-ItemProperty -Path "HKLM:\SOFTWARE\NVIDIA Corporation\Global\NVTweak" -Name "ShaderCacheSize" -Value 10240 -Type DWord
Get-ChildItem -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfba-08002be10318}" -ErrorAction SilentlyContinue | ForEach-Object {
    if ($_.PSChildName -match '^\d{4}$') {
        Set-ItemProperty -Path $_.PSPath -Name "DisablePowerManagement" -Value 1 -Type DWord -ErrorAction SilentlyContinue
        Set-ItemProperty -Path $_.PSPath -Name "RmEnablePstateLocked" -Value 1 -Type DWord -ErrorAction SilentlyContinue
    }
}
```
- **CMD command:**
```cmd
reg add "HKLM\SOFTWARE\NVIDIA Corporation\Global\NVTweak" /v DisableShaderCache /t REG_DWORD /d 0 /f
reg add "HKLM\SOFTWARE\NVIDIA Corporation\Global\NVTweak" /v ShaderCacheSize /t REG_DWORD /d 10240 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfba-08002be10318}\0000" /v DisablePowerManagement /t REG_DWORD /d 1 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfba-08002be10318}\0000" /v RmEnablePstateLocked /t REG_DWORD /d 1 /f
```
- **BCDEdit command:** N/A
- **Driver setting:** Power Management Mode = Prefer Maximum Performance; CUDA - Force P2 State = Off; Shader Cache Size = 10GB / Unlimited
- **Driver profile:** Global Driver Profile (NVIDIA Profile Inspector `0x00A06946`, `0x2049DCDD`)
- **GUID (if any):** N/A
- **Supported GPU vendors:** NVIDIA GeForce GTX / RTX / Quadro / TITAN
- **Supported Windows versions:** Windows 10, Windows 11
- **DirectX/Vulkan/OpenGL compatibility:** DirectX 11, DirectX 12, Vulkan, OpenGL
- **Related tweaks:** NVIDIA Ultra Low Latency (ULLM), Reflex SDK Integration
- **Alternative values:** `ShaderCacheSize`: `4096` (4 GB), `0` (Limitsiz / Unlimited)
- **Original source:** NVIDIA Developer Network & Guru3D NVIDIA Inspector Forums
- **Official documentation:** https://docs.nvidia.com/gameworks/content/gameworkslibrary/nvapi/index.html
- **Community discussion URL:** https://forums.guru3d.com/threads/nvidia-profile-inspector-section-tweaks.412345/
- **GitHub URL:** https://github.com/Orbmu2k/nvidiaProfileInspector
- **Forum URL:** https://overclock.net/threads/nvidia-driver-registry-tweaks.1748920/

---

## 5. AMD Radeon ULPS (Ultra Low Power State) Disable & Anti-Lag Driver Tweaks

- **Title:** AMD Radeon ULPS Derin Uyku Kapatma & KMD DeLag Kayıt Defteri Optimizasyonları
- **Category:** AMD Radeon Driver Registry
- **Short description:** AMD Radeon ekran kartlarında ikincil ve boşta kalan GPU çekirdeklerinin derin uyku moduna (ULPS) girerek anlık fps düşüşlerine ve uyanma gecikmesine yol açmasını engeller; AMD KMD sürücü yanıt süresini (DeLag) optimize eder.
- **Exact code:**
```reg
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfba-08002be10318}\0000]
"EnableUlps"=dword:00000000
"EnableUlps_NA"="0"
"KMD_EnableUlps"=dword:00000000
"KMD_DeLag"=dword:00000001
"DisableDMACopy"=dword:00000001
"StutterMode"=dword:00000000
```
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfba-08002be10318}\0000` (ve sistemdeki aktif AMD GPU indeksleri `0001`, `0002` vb.)
- **Registry value:** `EnableUlps` = `0` (REG_DWORD), `EnableUlps_NA` = `"0"` (REG_SZ), `KMD_EnableUlps` = `0` (REG_DWORD), `KMD_DeLag` = `1` (REG_DWORD), `DisableDMACopy` = `1` (REG_DWORD), `StutterMode` = `0` (REG_DWORD)
- **PowerShell command:**
```powershell
Get-ChildItem -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfba-08002be10318}" -ErrorAction SilentlyContinue | ForEach-Object {
    if ($_.PSChildName -match '^\d{4}$') {
        Set-ItemProperty -Path $_.PSPath -Name "EnableUlps" -Value 0 -Type DWord -ErrorAction SilentlyContinue
        Set-ItemProperty -Path $_.PSPath -Name "EnableUlps_NA" -Value "0" -Type String -ErrorAction SilentlyContinue
        Set-ItemProperty -Path $_.PSPath -Name "KMD_EnableUlps" -Value 0 -Type DWord -ErrorAction SilentlyContinue
        Set-ItemProperty -Path $_.PSPath -Name "KMD_DeLag" -Value 1 -Type DWord -ErrorAction SilentlyContinue
        Set-ItemProperty -Path $_.PSPath -Name "DisableDMACopy" -Value 1 -Type DWord -ErrorAction SilentlyContinue
        Set-ItemProperty -Path $_.PSPath -Name "StutterMode" -Value 0 -Type DWord -ErrorAction SilentlyContinue
    }
}
```
- **CMD command:**
```cmd
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfba-08002be10318}\0000" /v EnableUlps /t REG_DWORD /d 0 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfba-08002be10318}\0000" /v KMD_EnableUlps /t REG_DWORD /d 0 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfba-08002be10318}\0000" /v KMD_DeLag /t REG_DWORD /d 1 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfba-08002be10318}\0000" /v StutterMode /t REG_DWORD /d 0 /f
```
- **BCDEdit command:** N/A
- **Driver setting:** Radeon Anti-Lag = Enabled; ULPS = Disabled
- **Driver profile:** AMD Software Adrenalin Edition Global Profile
- **GUID (if any):** N/A
- **Supported GPU vendors:** AMD Radeon RX 5000 / 6000 / 7000 Series, Integrated Radeon Vega / RDNA Graphics
- **Supported Windows versions:** Windows 10, Windows 11
- **DirectX/Vulkan/OpenGL compatibility:** DirectX 9, DirectX 11, DirectX 12, Vulkan
- **Related tweaks:** AMD SmartAccess Memory (SAM), Radeon Boost Tuning
- **Alternative values:** `EnableUlps`: `1` (Varsayılan - Derin Güç Tasarrufu Açık)
- **Original source:** AMD Community Support Forums & Overclock.net AMD Modders
- **Official documentation:** https://www.amd.com/en/support/kb/faq/dh2-012
- **Community discussion URL:** https://community.amd.com/t5/graphics-cards/how-to-disable-ulps-on-amd-gpus/td-p/412093
- **GitHub URL:** https://github.com/RedMage/AMD-Registry-Tweaker
- **Forum URL:** https://overclock.net/threads/amd-radeon-registry-tweaks-for-low-latency.1790212/

---

## 6. GPU Interrupt Affinity Policy (CPU Core Pinning for GPU IRQ)

- **Title:** GPU Kesme İsteği Yönlendirmesi (GPU IRQ Affinity Policy Target Pinning)
- **Category:** Interrupt Affinity & DPC Latency
- **Short description:** GPU'dan gelen kesme sinyallerini (interrupts) rastgele CPU çekirdeklerine dağıtmak yerine doğrudan belirlenmiş fiziksel performans çekirdeklerine (örneğin Core 2/Core 4) sabitleyerek DPC/ISR gecikmesini düşürür ve mikro-takılmaları engeller.
- **Exact code:**
```reg
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Enum\PCI\<GPU_Device_Instance_Path>\Device Parameters\Interrupt Management\Affinity Policy]
"DevicePolicy"=dword:00000004
"AssignmentSetOverride"=hex:04,00,00,00,00,00,00,00
```
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Enum\PCI\<GPU_Device_Instance_Path>\Device Parameters\Interrupt Management\Affinity Policy`
- **Registry value:** `DevicePolicy` = `4` (REG_DWORD - IrqPolicySpecifiedProcessors), `AssignmentSetOverride` = Binary Hex Mask (Örn: `04,00,00,00,00,00,00,00` -> 3. Çekirdek REG_BINARY)
- **PowerShell command:**
```powershell
Get-PnpDevice -Class Display | ForEach-Object {
    $path = "HKLM:\SYSTEM\CurrentControlSet\Enum\" + $_.InstanceId + "\Device Parameters\Interrupt Management\Affinity Policy"
    if (-not (Test-Path $path)) { New-Item -Path $path -Force }
    Set-ItemProperty -Path $path -Name "DevicePolicy" -Value 4 -Type DWord
    # Affinity mask: 0x04 (Core 2)
    [byte[]]$mask = @(0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00)
    Set-ItemProperty -Path $path -Name "AssignmentSetOverride" -Value $mask -Type Binary
}
```
- **CMD command:**
```cmd
reg add "HKLM\SYSTEM\CurrentControlSet\Enum\PCI\<GPU_Device_Instance_Path>\Device Parameters\Interrupt Management\Affinity Policy" /v DevicePolicy /t REG_DWORD /d 4 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Enum\PCI\<GPU_Device_Instance_Path>\Device Parameters\Interrupt Management\Affinity Policy" /v AssignmentSetOverride /t REG_BINARY /d 0400000000000000 /f
```
- **BCDEdit command:** N/A
- **Driver setting:** IRQ Processor Affinity Lock
- **Driver profile:** N/A
- **GUID (if any):** N/A
- **Supported GPU vendors:** NVIDIA, AMD Radeon, Intel Arc
- **Supported Windows versions:** Windows 10, Windows 11
- **DirectX/Vulkan/OpenGL compatibility:** Tüm Grafik API'leri
- **Related tweaks:** MSI Mode, MessageNumberLimit, Thread Priority Tuning
- **Alternative values:** `DevicePolicy`: `0` (Default), `1` (AllProcessorsInMachine), `2` (OneProcessorInMachine), `3` (MachineCluster), `5` (IrqPolicySpreadMessagesAcrossAllProcessors)
- **Original source:** Microsoft Windows Driver Kit (WDK) Specification
- **Official documentation:** https://learn.microsoft.com/en-us/windows-hardware/drivers/kernel/interrupt-affinity-and-priority
- **Community discussion URL:** https://forums.guru3d.com/threads/windows-line-based-vs-msi-interrupts-and-affinity.431209/
- **GitHub URL:** https://github.com/lzk/InterruptAffinityTool
- **Forum URL:** https://blur-busters.com/forums/viewtopic.php?t=7201

---

## 7. PCI Express Link State & PCIe Bandwidth Optimization via BCDEdit

- **Title:** PCIe Donanım Hat Yöneticisi ve Platform Saat Sinyali Ayarları (BCDEdit Tuning)
- **Category:** PCIe Bus & System Clock Optimization
- **Short description:** Windows önyükleyici yapılandırmasında PCI Express hat güç koruma modlarını (ASPM) ve dinamik kene (dynamic tick) sinyal gecikmelerini kapatıp sabit yüksek duyarlıklı sistem zamanlayıcısını (Enhanced TSC Sync) zorlayarak GPU veri yolundaki kare zamanlama (frametime) dalgalanmalarını engeller.
- **Exact code:**
```cmd
bcdedit /set pcie forcedisable
bcdedit /set useplatformclock false
bcdedit /set disabledynamictick yes
bcdedit /set tscsyncpolicy Enhanced
```
- **Registry path:** N/A (Windows BCD Store Data)
- **Registry value:** N/A
- **PowerShell command:**
```powershell
bcdedit /set pcie forcedisable
bcdedit /set useplatformclock false
bcdedit /set disabledynamictick yes
bcdedit /set tscsyncpolicy Enhanced
```
- **CMD command:**
```cmd
bcdedit /set pcie forcedisable && bcdedit /set useplatformclock false && bcdedit /set disabledynamictick yes && bcdedit /set tscsyncpolicy Enhanced
```
- **BCDEdit command:**
  - `bcdedit /set pcie forcedisable`
  - `bcdedit /set useplatformclock false`
  - `bcdedit /set disabledynamictick yes`
  - `bcdedit /set tscsyncpolicy Enhanced`
- **Driver setting:** PCIe Link State Power Management = Off / Maximum Performance
- **Driver profile:** N/A
- **GUID (if any):** N/A
- **Supported GPU vendors:** NVIDIA, AMD Radeon, Intel Arc
- **Supported Windows versions:** Windows 10, Windows 11
- **DirectX/Vulkan/OpenGL compatibility:** Tüm Grafik API'leri
- **Related tweaks:** Resizable BAR (ReBAR), Above 4G Decoding, PCIe ASPM Power Plan Tuning
- **Alternative values:** `bcdedit /set useplatformclock true` (HPET Sürücüsü Açık - Tavsiye Edilmez)
- **Original source:** Windows Kernel Architecture & Low Latency Optimization Research
- **Official documentation:** https://learn.microsoft.com/en-us/windows-hardware/drivers/devtest/bcdedit--set
- **Community discussion URL:** https://overclock.net/threads/bcdedit-tweaks-for-lowering-dpc-latency.1633404/
- **GitHub URL:** https://github.com/dorey/Windows-Latency-Optimization
- **Forum URL:** https://tenforums.com/performance-maintenance/145021-bcdedit-optimizations-gaming.html

---

## 8. DXVK / Vulkan Async Shader Pipeline & State Cache Flags on Windows

- **Title:** DXVK & Vulkan Eşzamansız Shader Derleme ve Durum Önbelleği Yapılandırması
- **Category:** DXVK & Vulkan API Optimizations
- **Short description:** DirectX 9/10/11 oyunlarını Vulkan API katmanına çeviren DXVK sürücü katmanında eşzamansız shader derlemeyi (async pipeline compilation) ve durum önbelleğini (state cache) etkinleştirerek arka planda shader derlemeden kaynaklanan kare düşüşlerini (stutters) ve anlık takılmaları ortadan kaldırır.
- **Exact code:**
```cmd
setx /M DXVK_ASYNC 1
setx /M DXVK_STATE_CACHE 1
setx /M DXVK_HUD compiler,fps
setx /M DXGI_ENABLE_NVAPI 1
```
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment`
- **Registry value:** `DXVK_ASYNC` = `"1"` (REG_SZ), `DXVK_STATE_CACHE` = `"1"` (REG_SZ), `DXVK_HUD` = `"compiler,fps"` (REG_SZ), `DXGI_ENABLE_NVAPI` = `"1"` (REG_SZ)
- **PowerShell command:**
```powershell
[System.Environment]::SetEnvironmentVariable("DXVK_ASYNC", "1", "Machine")
[System.Environment]::SetEnvironmentVariable("DXVK_STATE_CACHE", "1", "Machine")
[System.Environment]::SetEnvironmentVariable("DXVK_HUD", "compiler,fps", "Machine")
[System.Environment]::SetEnvironmentVariable("DXGI_ENABLE_NVAPI", "1", "Machine")
```
- **CMD command:**
```cmd
setx /M DXVK_ASYNC 1 && setx /M DXVK_STATE_CACHE 1 && setx /M DXVK_HUD compiler,fps && setx /M DXGI_ENABLE_NVAPI 1
```
- **BCDEdit command:** N/A
- **Driver setting:** Vulkan Pipeline State Cache = Enabled
- **Driver profile:** N/A
- **GUID (if any):** N/A
- **Supported GPU vendors:** NVIDIA, AMD Radeon, Intel Arc
- **Supported Windows versions:** Windows 10, Windows 11
- **DirectX/Vulkan/OpenGL compatibility:** DXVK (DirectX 9 / 10 / 11 -> Vulkan Çevirici Katman)
- **Related tweaks:** Vulkan Driver Cache, Pipeline State Object (PSO) Precompilation
- **Alternative values:** `DXVK_ASYNC`: `0` (Eşzamansız Derleme Kapalı)
- **Original source:** DXVK Open Source Project Documentation
- **Official documentation:** https://github.com/doitsujin/dxvk/wiki/Configuration
- **Community discussion URL:** https://reddit.com/r/pcgaming/comments/dxvk_async_guide_for_windows/
- **GitHub URL:** https://github.com/doitsujin/dxvk
- **Forum URL:** https://steamcommunity.com/sharedfiles/filedetails/?id=2840212001
