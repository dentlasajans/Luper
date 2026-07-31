# Yeni Windows CPU Optimizasyon Araştırması (New CPU Tweaks Research)

Bu doküman, `C:\Luper\docs\database\cpu.json` veritabanında bulunmayan ve internet üzerindeki performans toplulukları, overclock platformları, Microsoft resmi dokümantasyonları ve gecikme optimizasyon gruplarından derlenen tamamen yeni Windows CPU optimizasyon kodlarını içerir.

---

### 1. Heterojen İşlemci Çekirdek Zamanlama Politikası
- **Title:** Heterojen İşlemci Çekirdek Zamanlama Politikası (Heterogeneous Thread Scheduling Policy)
- **Category:** Thread Director & Hybrid Scheduling
- **Short description:** Intel Alder Lake / Raptor Lake / Arrow Lake veya AMD Dual-CCD (7900X3D / 7950X3D) hibrit mimarilerde işletim sistemi thread zamanlayıcısının öncelikli olarak Performans çekirdeklerini (P-Cores veya 3D V-Cache CCD) seçmesini zorlar.
- **Exact code:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 93b8b6dc-0698-4d1c-9ee4-0644e900c85d 1`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\Power\PowerSettings\54533251-82be-4824-96c1-47b60b740d00\93b8b6dc-0698-4d1c-9ee4-0644e900c85d`
- **PowerCfg alias:** `SCHEDPOLICY`
- **GUID:** `93b8b6dc-0698-4d1c-9ee4-0644e900c85d`
- **BCDEdit option:** N/A
- **PowerShell command:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 93b8b6dc-0698-4d1c-9ee4-0644e900c85d 1; powercfg /setactive SCHEME_CURRENT`
- **CMD command:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 93b8b6dc-0698-4d1c-9ee4-0644e900c85d 1 & powercfg /setactive SCHEME_CURRENT`
- **Original source:** Microsoft Power Management & Intel Thread Director Architecture Documentation
- **Source URL:** https://learn.microsoft.com/en-us/windows-hardware/customize/power-settings/processor-power-management-options
- **Discussion URL:** https://www.overclock.net/threads/intel-12th-13th-gen-e-core-p-core-scheduling-tweaks.1795412/
- **Alternative values:** `0` (All Processors), `1` (Performant Processors Only), `2` (Prefer Performant Processors), `3` (Efficient Processors Only), `4` (Prefer Efficient Processors), `5` (Automatic)
- **Related tweaks:** Heterogeneous Short Thread Scheduling Policy (`bae08b81-2d5e-4688-ad6a-13243356654b`)
- **Operating system compatibility:** Windows 11 (build 22000+) & Windows 10 21H2+
- **Intel / AMD / Hybrid compatibility:** Intel 12th/13th/14th Gen (Alder Lake, Raptor Lake), Core Ultra, AMD Ryzen 7900X3D / 7950X3D

---

### 2. Kısa Süreli Thread Zamanlama Politikası
- **Title:** Kısa Süreli Thread Zamanlama Politikası (Heterogeneous Short Thread Scheduling Policy)
- **Category:** Thread Director & Hybrid Scheduling
- **Short description:** Anlık micro-task veya kısa süreli iş parçacıklarının (kısa thread'ler) E-Core'lara atılıp anlık takılma (stuttering) yaratmasını engeller, bunları da P-Core'lar üzerinde çalışmaya zorlar.
- **Exact code:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 bae08b81-2d5e-4688-ad6a-13243356654b 1`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\Power\PowerSettings\54533251-82be-4824-96c1-47b60b740d00\bae08b81-2d5e-4688-ad6a-13243356654b`
- **PowerCfg alias:** `ShortSchedulingPolicy`
- **GUID:** `bae08b81-2d5e-4688-ad6a-13243356654b`
- **BCDEdit option:** N/A
- **PowerShell command:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 bae08b81-2d5e-4688-ad6a-13243356654b 1; powercfg /setactive SCHEME_CURRENT`
- **CMD command:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 bae08b81-2d5e-4688-ad6a-13243356654b 1 & powercfg /setactive SCHEME_CURRENT`
- **Original source:** Microsoft Windows Core System Architecture
- **Source URL:** https://learn.microsoft.com/en-us/windows-hardware/design/device-experiences/power-performance-tuning
- **Discussion URL:** https://forums.guru3d.com/threads/windows-11-hybrid-cpu-optimization-guide.441200/
- **Alternative values:** `0` (All Processors), `1` (Performant Processors Only), `2` (Prefer Performant Processors), `3` (Efficient Processors Only), `4` (Prefer Efficient Processors), `5` (Automatic)
- **Related tweaks:** `SCHEDPOLICY` (`93b8b6dc-0698-4d1c-9ee4-0644e900c85d`)
- **Operating system compatibility:** Windows 11 21H2+ / 22H2 / 23H2 / 24H2
- **Intel / AMD / Hybrid compatibility:** Intel Hybrid (12th Gen+) & AMD Ryzen 3D V-Cache Dual-CCD

---

### 3. Enerji Performans Tercihi Politikası (EPP)
- **Title:** Enerji Performans Tercihi Politikası (Energy Performance Preference - EPP)
- **Category:** CPU Frequency Scaling & Dynamic Boost
- **Short description:** Intel Speed Shift (HWP) veya AMD CPPC2 teknolojisinde işlemcinin frekans artırma (boost) tepki süresini ve agresifliğini belirler. 0 değeri işlemcinin güç tasarrufu eğilimini sıfırlayarak donanımsal en düşük gecikmeyle maksimum frekansa tırmanmasını sağlar.
- **Exact code:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 368095db-5c92-4d25-a626-d07f5010747e 0`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\Power\PowerSettings\54533251-82be-4824-96c1-47b60b740d00\368095db-5c92-4d25-a626-d07f5010747e`
- **PowerCfg alias:** `PERFEPP` / `ENERGYPERFPREF`
- **GUID:** `368095db-5c92-4d25-a626-d07f5010747e`
- **BCDEdit option:** N/A
- **PowerShell command:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 368095db-5c92-4d25-a626-d07f5010747e 0; powercfg /setactive SCHEME_CURRENT`
- **CMD command:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 368095db-5c92-4d25-a626-d07f5010747e 0 & powercfg /setactive SCHEME_CURRENT`
- **Original source:** Intel Speed Shift Technology Technical Paper & AMD CPPC Documentation
- **Source URL:** https://www.intel.com/content/www/us/en/developer/articles/technical/software-development-for-intel-speed-shift-technology.html
- **Discussion URL:** https://forum.techpowerup.com/threads/epp-energy-performance-preference-tuning-for-latency.298112/
- **Alternative values:** `0` (0% - Maximum Performance), `33` (Balanced Performance), `50` (Balanced Power), `100` (100% - Maximum Power Savings)
- **Related tweaks:** E-Core EPP (`36687f9e-e3a5-4dbf-b1dc-15eb381c6864`), Processor Performance Boost Mode (`be337238-0d82-4146-a960-4f3749d470c7`)
- **Operating system compatibility:** Windows 10, Windows 11
- **Intel / AMD / Hybrid compatibility:** All modern Intel Core (6th Gen+) and AMD Ryzen (1000 Series+) processors

---

### 4. Verimlilik Çekirdekleri (E-Core) Tam Park Etme Zorlaması
- **Title:** Verimlilik Çekirdekleri (E-Core) Tam Park Etme Zorlaması (Efficiency Class 1 Core Parking Max Cores)
- **Category:** Core Parking & Hybrid Architecture Tuning
- **Short description:** Hibrit işlemcilerde E-Core'ların Maksimum Park Oranını %0'a indirerek oyun esnasında tüm E-Core'ları uyku moduna / park edilmiş duruma zorlar veya tam tersi P-Core yükünü korumak için izole eder.
- **Exact code:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 ea062031-0e34-4ff1-9b6d-eb1059334029 0`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\Power\PowerSettings\54533251-82be-4824-96c1-47b60b740d00\ea062031-0e34-4ff1-9b6d-eb1059334029`
- **PowerCfg alias:** `CPMAXCORES1`
- **GUID:** `ea062031-0e34-4ff1-9b6d-eb1059334029`
- **BCDEdit option:** N/A
- **PowerShell command:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 ea062031-0e34-4ff1-9b6d-eb1059334029 0; powercfg /setactive SCHEME_CURRENT`
- **CMD command:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 ea062031-0e34-4ff1-9b6d-eb1059334029 0 & powercfg /setactive SCHEME_CURRENT`
- **Original source:** Microsoft Power Management Options
- **Source URL:** https://learn.microsoft.com/en-us/windows-hardware/customize/power-settings/processor-power-management-options
- **Discussion URL:** https://linustechtips.com/topic/1420101-parking-e-cores-for-gaming-in-windows-11/
- **Alternative values:** `0` (Park all E-cores when idle / force offline for gaming), `100` (Keep all E-cores unparked)
- **Related tweaks:** `0cc5b647-c1df-4637-891a-dec35c318584` (`CPMINCORES1`), `0cc5b647-c1df-4637-891a-dec35c318583` (`CPMINCORES`)
- **Operating system compatibility:** Windows 11
- **Intel / AMD / Hybrid compatibility:** Intel 12th/13th/14th Gen Alder Lake, Raptor Lake, Arrow Lake

---

### 5. İşlemci Performans Boost Modu
- **Title:** İşlemci Performans Boost Modu (Processor Performance Boost Mode)
- **Category:** Turbo Boost & Frequency Scaling
- **Short description:** Intel Turbo Boost ve AMD Core Performance Boost (CPB) modlarının işletim sistemi tarafından tetiklenme biçimini belirler. "Aggressive" veya "Efficient Aggressive" olarak ayarlanarak işlemcinin gecikmesiz en yüksek boost adımına sıçraması sağlanır.
- **Exact code:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 be337238-0d82-4146-a960-4f3749d470c7 2`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\Power\PowerSettings\54533251-82be-4824-96c1-47b60b740d00\be337238-0d82-4146-a960-4f3749d470c7`
- **PowerCfg alias:** `PERFBOOSTMODE`
- **GUID:** `be337238-0d82-4146-a960-4f3749d470c7`
- **BCDEdit option:** N/A
- **PowerShell command:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 be337238-0d82-4146-a960-4f3749d470c7 2; powercfg /setactive SCHEME_CURRENT`
- **CMD command:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 be337238-0d82-4146-a960-4f3749d470c7 2 & powercfg /setactive SCHEME_CURRENT`
- **Original source:** Microsoft Windows Power Management Specification
- **Source URL:** https://learn.microsoft.com/en-us/windows-hardware/customize/power-settings/options-for-millisecond-response-times
- **Discussion URL:** https://reddit.com/r/AMDHelp/comments/11yvh6r/processor_performance_boost_mode_explained/
- **Alternative values:** `0` (Disabled), `1` (Enabled), `2` (Aggressive), `3` (Efficient Enabled), `4` (Efficient Aggressive), `5` (Aggressive At Guaranteed), `6` (Efficient Aggressive At Guaranteed)
- **Related tweaks:** `PERFBOOSTPOL` (`45bcc044-d885-43e2-8605-ee0ec6e96b59`)
- **Operating system compatibility:** Windows 10, Windows 11
- **Intel / AMD / Hybrid compatibility:** All Intel & AMD CPUs supporting Turbo / Boost

---

### 6. İşlemci Boost Eğilimi ve Politikası
- **Title:** İşlemci Boost Eğilimi ve Politikası (Processor Performance Boost Policy)
- **Category:** Turbo Boost & Frequency Scaling
- **Short description:** Donanım boost kararlarında performans ve güç koruması arasındaki yüzde dengesini yönetir. %100 yapıldığında güç koruma kısıtlamalarını es geçerek tam saat hızlarını korur.
- **Exact code:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 45bcc044-d885-43e2-8605-ee0ec6e96b59 100`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\Power\PowerSettings\54533251-82be-4824-96c1-47b60b740d00\45bcc044-d885-43e2-8605-ee0ec6e96b59`
- **PowerCfg alias:** `PERFBOOSTPOL`
- **GUID:** `45bcc044-d885-43e2-8605-ee0ec6e96b59`
- **BCDEdit option:** N/A
- **PowerShell command:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 45bcc044-d885-43e2-8605-ee0ec6e96b59 100; powercfg /setactive SCHEME_CURRENT`
- **CMD command:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 45bcc044-d885-43e2-8605-ee0ec6e96b59 100 & powercfg /setactive SCHEME_CURRENT`
- **Original source:** Microsoft Windows Power & Performance Optimization
- **Source URL:** https://learn.microsoft.com/en-us/windows-hardware/customize/power-settings/processor-power-management-options
- **Discussion URL:** https://forums.blur-busters.com/viewtopic.php?t=8402
- **Alternative values:** `0` (0% - Max Power Savings), `50` (50% - Balanced), `100` (100% - Max Boost Performance)
- **Related tweaks:** `PERFBOOSTMODE` (`be337238-0d82-4146-a960-4f3749d470c7`)
- **Operating system compatibility:** Windows 10, Windows 11
- **Intel / AMD / Hybrid compatibility:** Intel & AMD processors

---

### 7. İşlemci Boşta Bekleme (C-State) Durumlarını Devre Dışı Bırakma
- **Title:** İşlemci Boşta Bekleme (C-State) Durumlarını Devre Dışı Bırakma (Processor Idle Disable)
- **Category:** C-States & Idle Policies
- **Short description:** Windows işletim sisteminin CPU çekirdeklerini C1/C2/C3/C6/C7 uyku durumlarına sokmasını tamamen yasaklar. Çekirdeklerin sürekli C0 aktif durumunda kalmasını sağlayarak C-State geçişlerinden kaynaklanan mikrosaniyeler seviyesindeki gecikmeyi ve takılmaları yok eder.
- **Exact code:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 5d76a2ca-e8c0-402f-a133-2158492d58ad 1`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\Power\PowerSettings\54533251-82be-4824-96c1-47b60b740d00\5d76a2ca-e8c0-402f-a133-2158492d58ad`
- **PowerCfg alias:** `IDLEDISABLE`
- **GUID:** `5d76a2ca-e8c0-402f-a133-2158492d58ad`
- **BCDEdit option:** N/A
- **PowerShell command:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 5d76a2ca-e8c0-402f-a133-2158492d58ad 1; powercfg /setactive SCHEME_CURRENT`
- **CMD command:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 5d76a2ca-e8c0-402f-a133-2158492d58ad 1 & powercfg /setactive SCHEME_CURRENT`
- **Original source:** Microsoft Processor Power Management Architecture
- **Source URL:** https://learn.microsoft.com/en-us/windows-hardware/customize/power-settings/processor-power-management-options
- **Discussion URL:** https://www.overclock.net/threads/disabling-c-states-via-powercfg-idledisable.1775102/
- **Alternative values:** `0` (Idle Enabled - C-states active), `1` (Idle Disabled - C-states inactive, max responsiveness)
- **Related tweaks:** Core Parking Disable (`0cc5b647-c1df-4637-891a-dec35c318583`)
- **Operating system compatibility:** Windows 7, 8.1, 10, 11
- **Intel / AMD / Hybrid compatibility:** All x86 / x64 CPUs

---

### 8. Arka Plan Güç Kısma Özelliğini Kapatma
- **Title:** Arka Plan Güç Kısma Özelliğini Kapatma (Global Power Throttling Off)
- **Category:** CPU Telemetry & Power Framework
- **Short description:** Windows 10/11 işletim sisteminin arka planda çalışan süreçlerin ve oyun bağımlılıklarının CPU frekansını ve execution slice'larını kısmasını (Power Throttling / Efficiency Mode) sistem genelinde engeller.
- **Exact code:** `reg add "HKLM\SYSTEM\CurrentControlSet\Control\Power\PowerThrottling" /v PowerThrottlingOff /t REG_DWORD /d 1 /f`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\Power\PowerThrottling`
- **PowerCfg alias:** N/A
- **GUID:** N/A
- **BCDEdit option:** N/A
- **PowerShell command:** `New-Item -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Power" -Name "PowerThrottling" -Force -ErrorAction SilentlyContinue; Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Power\PowerThrottling" -Name "PowerThrottlingOff" -Value 1 -Type DWord`
- **CMD command:** `reg add "HKLM\SYSTEM\CurrentControlSet\Control\Power\PowerThrottling" /v PowerThrottlingOff /t REG_DWORD /d 1 /f`
- **Original source:** Microsoft TechNet / Windows Performance Tuning
- **Source URL:** https://learn.microsoft.com/en-us/windows-hardware/customize/power-settings/power-throttling
- **Discussion URL:** https://tenforums.com/tutorials/83002-turn-off-power-throttling-windows-10-a.html
- **Alternative values:** `0` (Power Throttling Enabled), `1` (Power Throttling Disabled)
- **Related tweaks:** IFEO PerfOptions (`CpuPriorityClass`)
- **Operating system compatibility:** Windows 10 Fall Creators Update (1709) & Windows 11
- **Intel / AMD / Hybrid compatibility:** All CPUs (particularly effective on Intel Skylake+ and mobile/desktop hybrid processors)

---

### 9. IFEO Üzerinden İşlemci Önceliği Zorlaması
- **Title:** IFEO Üzerinden İşlemci Önceliği Zorlaması (IFEO CPU Priority Override)
- **Category:** Process Priority & IFEO Tweaks
- **Short description:** Windows Image File Execution Options (IFEO) kayıt defteri anahtarı üzerinden belirli oyun veya uygulama yürütülebilir dosyalarının (örn. `cs2.exe`, `VALORANT-Win64-Shipping.exe`) her başlatıldığında doğrudan "Yüksek" (High) CPU Öncelik sınıfında çalışmasını otomatikleştirir.
- **Exact code:** `reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\cs2.exe\PerfOptions" /v CpuPriorityClass /t REG_DWORD /d 3 /f`
- **Registry path:** `HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\<ProcessName>\PerfOptions`
- **PowerCfg alias:** N/A
- **GUID:** N/A
- **BCDEdit option:** N/A
- **PowerShell command:** `New-Item -Path "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\cs2.exe\PerfOptions" -Force; Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\cs2.exe\PerfOptions" -Name "CpuPriorityClass" -Value 3 -Type DWord`
- **CMD command:** `reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\cs2.exe\PerfOptions" /v CpuPriorityClass /t REG_DWORD /d 3 /f`
- **Original source:** Microsoft Win32 Application Execution Documentation
- **Source URL:** https://learn.microsoft.com/en-us/windows/win32/procthread/scheduling-priorities
- **Discussion URL:** https://forums.blurbusters.com/viewtopic.php?t=7521
- **Alternative values:** `1` (Idle), `2` (Normal), `3` (High), `5` (Below Normal), `6` (Above Normal)
- **Related tweaks:** MMCSS Games Priority (`Priority`=6), Win32PrioritySeparation (`0x26`)
- **Operating system compatibility:** Windows 7, 8, 10, 11
- **Intel / AMD / Hybrid compatibility:** Universal (All CPUs)

---

### 10. İşlemci Frekans Yükseltme Eşik Değeri
- **Title:** İşlemci Frekans Yükseltme Eşik Değeri (Processor Performance Increase Threshold)
- **Category:** CPU Frequency Scaling
- **Short description:** CPU yükü yüzde kaç seviyesine ulaştığında saat hızının arttırılacağını belirler. Varsayılan %30-%50 değerleri yerine %1'e çekilerek en ufak bir thread iş talebinde işlemcinin anında en üst frekansa fırlaması sağlanır.
- **Exact code:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 06bed4fe-9e74-4a0e-8d9d-e54022423726 1`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\Power\PowerSettings\54533251-82be-4824-96c1-47b60b740d00\06bed4fe-9e74-4a0e-8d9d-e54022423726`
- **PowerCfg alias:** `PERFINCTHRESHOLD`
- **GUID:** `06bed4fe-9e74-4a0e-8d9d-e54022423726`
- **BCDEdit option:** N/A
- **PowerShell command:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 06bed4fe-9e74-4a0e-8d9d-e54022423726 1; powercfg /setactive SCHEME_CURRENT`
- **CMD command:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 06bed4fe-9e74-4a0e-8d9d-e54022423726 1 & powercfg /setactive SCHEME_CURRENT`
- **Original source:** Microsoft Power Management Options
- **Source URL:** https://learn.microsoft.com/en-us/windows-hardware/customize/power-settings/processor-power-management-options
- **Discussion URL:** https://forums.guru3d.com/threads/powercfg-perfincthreshold-tuning-for-zero-input-lag.432110/
- **Alternative values:** `1` (1% - Instant boost on minimal load), `30` (30% - Default), `80` (80% - Power saving mode)
- **Related tweaks:** `PERFDECTHRESHOLD` (`12a0ab44-fe28-4fa9-b3bd-4b64f44960a7`)
- **Operating system compatibility:** Windows 7, 8.1, 10, 11
- **Intel / AMD / Hybrid compatibility:** All Intel & AMD CPUs

---

### 11. İşlemci Frekans Düşürme Eşik Değeri
- **Title:** İşlemci Frekans Düşürme Eşik Değeri (Processor Performance Decrease Threshold)
- **Category:** CPU Frequency Scaling
- **Short description:** CPU yükü düşmeye başladığında saat frekansının düşürülmesi için gereken minimum yük yüzdesini belirler. %100 yapılarak yük tamamen sonlanana kadar saat hızının asla düşmemesi (downclock olmaması) garantilenir.
- **Exact code:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 12a0ab44-fe28-4fa9-b3bd-4b64f44960a7 100`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\Power\PowerSettings\54533251-82be-4824-96c1-47b60b740d00\12a0ab44-fe28-4fa9-b3bd-4b64f44960a7`
- **PowerCfg alias:** `PERFDECTHRESHOLD`
- **GUID:** `12a0ab44-fe28-4fa9-b3bd-4b64f44960a7`
- **BCDEdit option:** N/A
- **PowerShell command:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 12a0ab44-fe28-4fa9-b3bd-4b64f44960a7 100; powercfg /setactive SCHEME_CURRENT`
- **CMD command:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 12a0ab44-fe28-4fa9-b3bd-4b64f44960a7 100 & powercfg /setactive SCHEME_CURRENT`
- **Original source:** Microsoft Processor Performance Engine Settings
- **Source URL:** https://learn.microsoft.com/en-us/windows-hardware/customize/power-settings/processor-power-management-options
- **Discussion URL:** https://reddit.com/r/overclocking/comments/j2k9l1/perfdecthreshold_powercfg_tweaks/
- **Alternative values:** `100` (100% - Never downclock during active frame rendering), `50` (50% - Moderate), `10` (10% - Aggressive downclocking)
- **Related tweaks:** `PERFINCTHRESHOLD` (`06bed4fe-9e74-4a0e-8d9d-e54022423726`)
- **Operating system compatibility:** Windows 7, 8.1, 10, 11
- **Intel / AMD / Hybrid compatibility:** All Intel & AMD CPUs

---

### 12. BCDEdit PCI Yapılandırma Erişim Politikası
- **Title:** BCDEdit PCI Yapılandırma Erişim Politikası (BCDEdit Config Access Policy)
- **Category:** BCDEdit CPU Options & Interrupt Processing
- **Short description:** Windows çekirdeğinin PCI veriyolu konfigürasyon alanına MMCONFIG (Memory Mapped I/O) yerine HAL katmanı doğrudan port erişimi yapmasını zorlayarak belirli anakart çipsetlerindeki CPU-PCIe adresleme gecikmesini kaldırır.
- **Exact code:** `bcdedit /set configaccesspolicy disallowmmconfig`
- **Registry path:** N/A (BCDEdit BCD Store Entry: `{current}`)
- **PowerCfg alias:** N/A
- **GUID:** N/A
- **BCDEdit option:** `configaccesspolicy disallowmmconfig`
- **PowerShell command:** `bcdedit /set configaccesspolicy disallowmmconfig`
- **CMD command:** `bcdedit /set configaccesspolicy disallowmmconfig`
- **Original source:** Microsoft Windows Boot Configuration Data Reference
- **Source URL:** https://learn.microsoft.com/en-us/windows-hardware/drivers/devtest/bcdedit--set
- **Discussion URL:** https://superuser.com/questions/1218903/what-does-bcdedit-set-configaccesspolicy-disallowmmconfig-do
- **Alternative values:** `default`, `disallowmmconfig`
- **Related tweaks:** `x2apicpolicy enable`, `disabledynamictick yes`
- **Operating system compatibility:** Windows 10, Windows 11
- **Intel / AMD / Hybrid compatibility:** Intel & AMD platforms with PCIe legacy APIC mapping

---

### 13. Donanım Kesme (IRQ) Cihaz İzolasyon Politikası
- **Title:** Donanım Kesme (IRQ) Cihaz İzolasyon Politikası (Device Interrupt Routing Policy)
- **Category:** Interrupt Processing & Steering
- **Short description:** Ağ kartı, USB denetleyicisi veya Ekran kartı gibi kritik donanımların kesme (interrupt) isteklerini Core 0 dışındaki belirli yüksek hızlı işlemci çekirdeklerine (örn. Core 2/4) bağlayarak Core 0 üzerindeki ISR/DPC fırtınasını önler.
- **Exact code:** `reg add "HKLM\SYSTEM\CurrentControlSet\Control\Interrupt Management\DevicePolicy" /v DevicePolicy /t REG_DWORD /d 4 /f`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\Interrupt Management\DevicePolicy` (veya `HKLM\SYSTEM\CurrentControlSet\Enum\PCI\<PCI_ID>\Device Parameters\Interrupt Management\Affinity Policy`)
- **PowerCfg alias:** N/A
- **GUID:** N/A
- **BCDEdit option:** N/A
- **PowerShell command:** `New-Item -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Interrupt Management" -Name "DevicePolicy" -Force; Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Interrupt Management\DevicePolicy" -Name "DevicePolicy" -Value 4 -Type DWord`
- **CMD command:** `reg add "HKLM\SYSTEM\CurrentControlSet\Control\Interrupt Management\DevicePolicy" /v DevicePolicy /t REG_DWORD /d 4 /f`
- **Original source:** Microsoft Windows Driver Kit (WDK) Interrupt Affinity Policy Documentation
- **Source URL:** https://learn.microsoft.com/en-us/windows-hardware/drivers/kernel/interrupt-affinity-and-priority
- **Discussion URL:** https://forums.guru3d.com/threads/interrupt-affinity-policy-tool-manual-irq-steering.420119/
- **Alternative values:** `0` (IrqPolicyMachineDefault), `1` (IrqPolicyAllProcessorsInMachine), `2` (IrqPolicySpecifiedProcessors), `3` (IrqPolicyOneCloseProcessor), `4` (IrqPolicyOneNextProcessor)
- **Related tweaks:** MSI Mode (`MSISupported`=1)
- **Operating system compatibility:** Windows 10, Windows 11
- **Intel / AMD / Hybrid compatibility:** All x86 / x64 platforms

---
