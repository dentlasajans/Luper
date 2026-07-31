# Phase 2 Windows CPU Optimization Research Report (Derin İşlemci Kod Araştırması)

> **Not:** Bu rapordaki hiçbir optimizasyon kodu `C:\Luper\docs\database\cpu.json` içerisinde bulunmamaktadır. Tamamı en az bilinen, gecikmeyi sıfırlamaya odaklanmış ileri seviye kernel, BCDEdit, PowerCFG ve Registry optimizasyonlarından derlenmiştir.

---

## 1. Virtualization-Based Security (VBS) & Hyper-V CPU Katmanı Kapatma
- **Title:** Virtualization-Based Security (VBS) & Hyper-V CPU Katmanı Kapatma
- **Category:** Kernel / Virtualization CPU Overheads
- **Short description:** Hyper-V hypervisor'ünün Windows çekirdeği ile donanım arasına girmesini engelleyerek Ring -1 sanallaştırma gecikmesini ve ring geçişlerindeki CPU döngü kayıplarını sıfırlar.
- **Exact code:** `bcdedit /set hypervisorlaunchtype off` & `bcdedit /set vsmlaunchtype off`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\DeviceGuard`
- **PowerCfg alias:** Yok
- **GUID:** Yok
- **BCDEdit option:** `hypervisorlaunchtype off`, `vsmlaunchtype off`
- **PowerShell command:** `Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\DeviceGuard" -Name "EnableVirtualizationBasedSecurity" -Value 0`
- **CMD command:** `bcdedit /set hypervisorlaunchtype off && bcdedit /set vsmlaunchtype off`
- **Original source:** Microsoft TechNet / Guru3D Forum / Blur Busters Latency Guides
- **Source URL:** https://learn.microsoft.com/en-us/windows-hardware/drivers/devtest/bcdedit--set
- **Discussion URL:** https://forums.blurbusters.com/viewtopic.php?t=8912
- **Alternative values:** `auto` (Varsayılan Windows kararı)
- **Related tweaks:** HVCI Memory Integrity Disable, Isolated Context Disable
- **Operating system compatibility:** Windows 10, Windows 11
- **Intel / AMD / Hybrid compatibility:** Tüm Intel ve AMD İşlemciler

---

## 2. 5-Level Paging (LA57) CPU Adres Çevirim Gecikmesini Kapatma
- **Title:** 5-Level Paging (LA57) CPU Adres Çevirim Gecikmesini Kapatma
- **Category:** Memory Management / CPU MMU TLB
- **Short description:** Modern Intel/AMD işlemcilerde 5. seviye bellek sayfalama (57-bit linear addressing) translation lookaside buffer (TLB) miss maliyetlerini düşürmek için 48-bit 4-level paging ile kilitler.
- **Exact code:** `bcdedit /set linearaddress57 OptOut`
- **Registry path:** Yok
- **PowerCfg alias:** Yok
- **GUID:** Yok
- **BCDEdit option:** `linearaddress57 OptOut`
- **PowerShell command:** `bcdedit /set linearaddress57 OptOut`
- **CMD command:** `bcdedit /set linearaddress57 OptOut`
- **Original source:** Windows Kernel Internals / Overclock.net Latency Section
- **Source URL:** https://learn.microsoft.com/en-us/windows-hardware/drivers/devtest/bcdedit--set
- **Discussion URL:** https://www.overclock.net/threads/windows-bcdedit-latency-tweaks.1798123/
- **Alternative values:** `OptIn` (57-bit adreslemeyi zorla)
- **Related tweaks:** Large Page Support, DisablePagingExecutive
- **Operating system compatibility:** Windows 11 (build 22000+)
- **Intel / AMD / Hybrid compatibility:** Intel 10th Gen+, AMD Zen4+

---

## 3. İşlemci Otonom Frekans Penceresi Sıfırlama (Autonomous Activity Window)
- **Title:** İşlemci Otonom Frekans Penceresi Sıfırlama (Autonomous Activity Window)
- **Category:** PowerCfg Processor Settings / Frequency Scaling
- **Short description:** Intel Speed Shift (HWP) ve AMD CPPC'nin frekans değerlendirme zaman penceresini (time window) 0 ms'ye düşürerek donanımın yük değişimlerine anında (0ms gecikmeyle) en yüksek frekansta yanıt vermesini sağlar.
- **Exact code:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 cf49253d-22a9-407e-8712-94b16334f7a8 0`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\Power\PowerSettings\54533251-82be-4824-96c1-47b60b740d00\cf49253d-22a9-407e-8712-94b16334f7a8`
- **PowerCfg alias:** Yok
- **GUID:** `cf49253d-22a9-407e-8712-94b16334f7a8`
- **BCDEdit option:** Yok
- **PowerShell command:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 cf49253d-22a9-407e-8712-94b16334f7a8 0`
- **CMD command:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 cf49253d-22a9-407e-8712-94b16334f7a8 0`
- **Original source:** GitHub Windows Power Settings Documentation
- **Source URL:** https://github.com/microsoft/Windows-driver-samples
- **Discussion URL:** https://forums.blurbusters.com/viewtopic.php?t=7234
- **Alternative values:** `30` (30ms varsayılan pencerelenmiş hesaplama)
- **Related tweaks:** EPP 0, Boost Mode Aggressive
- **Operating system compatibility:** Windows 10, Windows 11
- **Intel / AMD / Hybrid compatibility:** Intel SpeedShift & AMD CPPC destekli tüm işlemciler

---

## 4. İşlemci Görev Döngüsü (Processor Duty Cycling) Kapatma
- **Title:** İşlemci Görev Döngüsü (Processor Duty Cycling) Kapatma
- **Category:** PPM / Thermal & Power Throttling
- **Short description:** İşlemcinin aşırı ısınma veya güç sınırında saat frekansını düşürmek yerine saat sinyalini periyodik olarak boşta kesmesini (clock duty cycling) engeller, kesintisiz işlem gücü sağlar.
- **Exact code:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 4b92d758-5a2b-4856-a6f6-a563dfe5516a 0`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\Power\PowerSettings\54533251-82be-4824-96c1-47b60b740d00\4b92d758-5a2b-4856-a6f6-a563dfe5516a`
- **PowerCfg alias:** Yok
- **GUID:** `4b92d758-5a2b-4856-a6f6-a563dfe5516a`
- **BCDEdit option:** Yok
- **PowerShell command:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 4b92d758-5a2b-4856-a6f6-a563dfe5516a 0`
- **CMD command:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 4b92d758-5a2b-4856-a6f6-a563dfe5516a 0`
- **Original source:** Microsoft Power Management Architecture Guide
- **Source URL:** https://learn.microsoft.com/en-us/windows-hardware/design/device-experiences/power-management-architectures
- **Discussion URL:** https://www.overclock.net/threads/cpu-duty-cycling-throttling.1743210/
- **Alternative values:** `1` (Etkinleştirilmiş Duty Cycling)
- **Related tweaks:** Disable C-States, Global Power Throttling Off
- **Operating system compatibility:** Windows 10, Windows 11
- **Intel / AMD / Hybrid compatibility:** Tüm x86/x64 İşlemciler

---

## 5. Gecikmeye Duyarlı İş Parçacıkları İçin Çekirdek Parkı Devre Dışı Bırakma (Latency Sensitivity Hint Min Unparked Cores)
- **Title:** Gecikmeye Duyarlı İş Parçacıkları İçin Çekirdek Parkı Devre Dışı Bırakma (Latency Sensitivity Hint Min Unparked Cores)
- **Category:** PPM / Core Parking & Latency
- **Short description:** Sistem gecikmeye duyarlı bir iş parçacığı (input, render thread) tespit ettiğinde anında uyanacak minimum park edilmemiş çekirdek oranını %100 yapar.
- **Exact code:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 619bcc8d-b632-427a-a400-5640d6da94b2 100`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\Power\PowerSettings\54533251-82be-4824-96c1-47b60b740d00\619bcc8d-b632-427a-a400-5640d6da94b2`
- **PowerCfg alias:** Yok
- **GUID:** `619bcc8d-b632-427a-a400-5640d6da94b2`
- **BCDEdit option:** Yok
- **PowerShell command:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 619bcc8d-b632-427a-a400-5640d6da94b2 100`
- **CMD command:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 619bcc8d-b632-427a-a400-5640d6da94b2 100`
- **Original source:** Windows Quality of Service (QoS) & Scheduler Docs
- **Source URL:** https://learn.microsoft.com/en-us/windows-hardware/customize/power-settings/processor-performance-core-parking-min-cores
- **Discussion URL:** https://forums.blurbusters.com/viewtopic.php?t=6120
- **Alternative values:** `50` (%50 minimum uyanık çekirdek)
- **Related tweaks:** Disable Core Parking, E-Core Parking Max Cores
- **Operating system compatibility:** Windows 10, Windows 11
- **Intel / AMD / Hybrid compatibility:** Tüm Çok Çekirdekli İşlemciler

---

## 6. AMD CPPC Tercih Edilen Çekirdek (Preferred Core) Zorlaması
- **Title:** AMD CPPC Tercih Edilen Çekirdek (Preferred Core) Zorlaması
- **Category:** AMD CPPC / Ryzen Topology
- **Short description:** AMD Ryzen işlemcilerde silikon kalitesi en yüksek olan en hızlı çekirdeklerin (Preferred Cores) Windows zamanlayıcısı tarafından öncelikli olarak seçilmesini zorlar.
- **Exact code:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 8b0e950d-72a1-4ca7-b391-7f8c5a974f11 1`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\Power\PowerSettings\54533251-82be-4824-96c1-47b60b740d00\8b0e950d-72a1-4ca7-b391-7f8c5a974f11`
- **PowerCfg alias:** Yok
- **GUID:** `8b0e950d-72a1-4ca7-b391-7f8c5a974f11`
- **BCDEdit option:** Yok
- **PowerShell command:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 8b0e950d-72a1-4ca7-b391-7f8c5a974f11 1`
- **CMD command:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 8b0e950d-72a1-4ca7-b391-7f8c5a974f11 1`
- **Original source:** AMD Community Guides / TechPowerUp Ryzen Optimization Thread
- **Source URL:** https://community.amd.com/t5/processors/cppc-preferred-cores/m-p/412351
- **Discussion URL:** https://www.techpowerup.com/forums/threads/ryzen-cppc2-and-windows-scheduler.261204/
- **Alternative values:** `0` (Devre dışı)
- **Related tweaks:** Heterogeneous Thread Scheduling
- **Operating system compatibility:** Windows 10, Windows 11
- **Intel / AMD / Hybrid compatibility:** AMD Ryzen 3000 / 5000 / 7000 / 9000 Serisi

---

## 7. Kritik Çekirdek İş Parçacığı Havuzu Genişletme (Additional Critical Worker Threads)
- **Title:** Kritik Çekirdek İş Parçacığı Havuzu Genişletme (Additional Critical Worker Threads)
- **Category:** Executive Scheduler / System Threads
- **Short description:** Windows Executive çekirdeğinin sistem G/Ç ve donanım taleplerini işlemek üzere önceden tahsis ettiği kritik işçi thread (worker thread) sayısını artırarak kuyruk gecikmesini yok eder.
- **Exact code:** `reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Executive" /v AdditionalCriticalWorkerThreads /t REG_DWORD /d 16 /f` & `reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Executive" /v AdditionalWorkerThreads /t REG_DWORD /d 16 /f`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Executive`
- **PowerCfg alias:** Yok
- **GUID:** Yok
- **BCDEdit option:** Yok
- **PowerShell command:** `Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Executive" -Name "AdditionalCriticalWorkerThreads" -Value 16; Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Executive" -Name "AdditionalWorkerThreads" -Value 16`
- **CMD command:** `reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Executive" /v AdditionalCriticalWorkerThreads /t REG_DWORD /d 16 /f && reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Executive" /v AdditionalWorkerThreads /t REG_DWORD /d 16 /f`
- **Original source:** Windows NT Executive Architecture Documentation / GitHub CPUTweaks
- **Source URL:** https://learn.microsoft.com/en-us/windows-hardware/drivers/kernel/executive-worker-threads
- **Discussion URL:** https://github.com/windows11-scripts/CPUTweaks
- **Alternative values:** `0` (Dinamik varsayılan atama), `8` (Orta seviye artış)
- **Related tweaks:** PriorityQuantumMatrix, Win32PrioritySeparation
- **Operating system compatibility:** Windows 10, Windows 11
- **Intel / AMD / Hybrid compatibility:** Tüm İşlemciler (Özellikle 8+ Çekirdekli Sistemler)

---

## 8. İşlemci Enerji Tahmin ve Telemetri Arka Plan İzlemesini Kapatma (EnergyEstimationDisabled)
- **Title:** İşlemci Enerji Tahmin ve Telemetri Arka Plan İzlemesini Kapatma (EnergyEstimationDisabled)
- **Category:** CPU Telemetry & Power Framework
- **Short description:** Windows Power Framework'ün periyodik olarak CPU çekirdeklerinin enerji tüketim istatistiklerini hesaplamak için harcadığı arka plan thread döngülerini devre dışı bırakır.
- **Exact code:** `reg add "HKLM\SYSTEM\CurrentControlSet\Control\Power" /v EnergyEstimationDisabled /t REG_DWORD /d 1 /f`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\Power`
- **PowerCfg alias:** Yok
- **GUID:** Yok
- **BCDEdit option:** Yok
- **PowerShell command:** `Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Power" -Name "EnergyEstimationDisabled" -Value 1`
- **CMD command:** `reg add "HKLM\SYSTEM\CurrentControlSet\Control\Power" /v EnergyEstimationDisabled /t REG_DWORD /d 1 /f`
- **Original source:** Win10Boost Optimization Repository / MSFN Forum
- **Source URL:** https://msfn.org/board/topic/182100-windows-power-framework-telemetry/
- **Discussion URL:** https://github.com/Win10Boost/PowerTweaks
- **Alternative values:** `0` (Tahmin sistemi aktif)
- **Related tweaks:** Global Power Throttling Off
- **Operating system compatibility:** Windows 10, Windows 11
- **Intel / AMD / Hybrid compatibility:** Tüm İşlemciler

---

## 9. Platform AoAc ve Modern Standby İşlemci Güç Kısıtlamalarını Kapatma
- **Title:** Platform AoAc ve Modern Standby İşlemci Güç Kısıtlamalarını Kapatma
- **Category:** Power Framework (PEP) / CPU Idle States
- **Short description:** Modern Standby (S0 Low Power Idle) mimarisinin işlemciyi agresif düşük güç durumlarına sokmasını ve arka plan kesme gecikmelerini önlemek için geleneksel tam güç moduna zorlar.
- **Exact code:** `reg add "HKLM\SYSTEM\CurrentControlSet\Control\Power" /v PlatformAoAcOverride /t REG_DWORD /d 0 /f`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\Power`
- **PowerCfg alias:** Yok
- **GUID:** Yok
- **BCDEdit option:** Yok
- **PowerShell command:** `Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Power" -Name "PlatformAoAcOverride" -Value 0`
- **CMD command:** `reg add "HKLM\SYSTEM\CurrentControlSet\Control\Power" /v PlatformAoAcOverride /t REG_DWORD /d 0 /f`
- **Original source:** Framework Laptop Community & Intel Power Management Guides
- **Source URL:** https://learn.microsoft.com/en-us/windows-hardware/design/device-experiences/modern-standby
- **Discussion URL:** https://frame.work/blog/modern-standby-debugging
- **Alternative values:** `1` (Modern Standby zorla)
- **Related tweaks:** Energy Performance Preference, CsEnabled
- **Operating system compatibility:** Windows 10, Windows 11
- **Intel / AMD / Hybrid compatibility:** Modern Intel Core & AMD Ryzen Mobil / Masaüstü İşlemciler

---

## 10. Tam Ekran Oyunlar İçin Ultra Düşük Gecikmeli Quantum Seçimi (Win32PrioritySeparation = 0x16)
- **Title:** Tam Ekran Oyunlar İçin Ultra Düşük Gecikmeli Quantum Seçimi (Win32PrioritySeparation = 0x16)
- **Category:** Win32PrioritySeparation / Quantum Scheduling
- **Short description:** 0x26 (varsayılan uzun/sabit) yerine 0x16 (kısa, değişken, 3:1 ön plan oranı) kullanarak CPU zaman dilimlerini (quantum slice) kısaltır. Girdi ve klavye/fare tepki süresi anında hissedilir derecede düşer.
- **Exact code:** `reg add "HKLM\SYSTEM\CurrentControlSet\Control\PriorityControl" /v Win32PrioritySeparation /t REG_DWORD /d 22 /f`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\PriorityControl`
- **PowerCfg alias:** Yok
- **GUID:** Yok
- **BCDEdit option:** Yok
- **PowerShell command:** `Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\PriorityControl" -Name "Win32PrioritySeparation" -Value 22`
- **CMD command:** `reg add "HKLM\SYSTEM\CurrentControlSet\Control\PriorityControl" /v Win32PrioritySeparation /t REG_DWORD /d 22 /f`
- **Original source:** Win32PrioritySeparation Tool & Blur Busters Tuning Guides
- **Source URL:** https://github.com/keoy7am/Win32PrioritySeparationTool
- **Discussion URL:** https://forums.blurbusters.com/viewtopic.php?t=7512
- **Alternative values:** `38` (0x26 varsayılan), `40` (0x28 - uzun sabit 1:1), `20` (0x14 - kısa sabit)
- **Related tweaks:** MMCSS SystemResponsiveness, ThreadPriorityFloor
- **Operating system compatibility:** Windows 10, Windows 11
- **Intel / AMD / Hybrid compatibility:** Tüm İşlemciler

---

## 11. DPC Kuyruk Derinliği ve Kesme Zamanlaması İyileştirmesi (DPC Queue Depth)
- **Title:** DPC Kuyruk Derinliği ve Kesme Zamanlaması İyileştirmesi (DPC Queue Depth)
- **Category:** Interrupt Processing & DPC
- **Short description:** DPC (Deferred Procedure Call) kuyruk derinliğini minimuma indirerek sürücü kesmelerinin kuyrukta beklemeden hedef CPU çekirdeğinde anında işlenmesini sağlar.
- **Exact code:** `reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\kernel" /v DpcQueueDepth /t REG_DWORD /d 1 /f`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\kernel`
- **PowerCfg alias:** Yok
- **GUID:** Yok
- **BCDEdit option:** Yok
- **PowerShell command:** `Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\kernel" -Name "DpcQueueDepth" -Value 1`
- **CMD command:** `reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\kernel" /v DpcQueueDepth /t REG_DWORD /d 1 /f`
- **Original source:** GamingPCSetup Kernel Tuning Documentation
- **Source URL:** https://github.com/GamingPCSetup/WindowsKernelTweaks
- **Discussion URL:** https://www.overclock.net/threads/dpc-latency-and-kernel-queue-depth.1789410/
- **Alternative values:** `2` (Varsayılan kuyruk sınırı)
- **Related tweaks:** MSI Mode, Interrupt Routing Policy
- **Operating system compatibility:** Windows 10, Windows 11
- **Intel / AMD / Hybrid compatibility:** Tüm İşlemciler

---

## 12. L2 Cache Boyutu Doğrudan Hizalama (SecondLevelDataCache)
- **Title:** L2 Cache Boyutu Doğrudan Hizalama (SecondLevelDataCache)
- **Category:** CPU Cache Policies / Memory Manager
- **Short description:** Windows Kernel'inin eski veya belirli mimarilerde CPU L2 Önbellek boyutunu yanlış algılamasını engeller, L2 Önbellek miktarını KB cinsinden manuel olarak kayıt defterine kilitler.
- **Exact code:** `reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v SecondLevelDataCache /t REG_DWORD /d 1024 /f`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management`
- **PowerCfg alias:** Yok
- **GUID:** Yok
- **BCDEdit option:** Yok
- **PowerShell command:** `Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" -Name "SecondLevelDataCache" -Value 1024`
- **CMD command:** `reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v SecondLevelDataCache /t REG_DWORD /d 1024 /f`
- **Original source:** Microsoft System Memory Management Specifications
- **Source URL:** https://learn.microsoft.com/en-us/troubleshoot/windows-server/performance/memory-management-registry-keys
- **Discussion URL:** https://tenforums.com/performance-maintenance/145210-secondleveldatacache-tweak.html
- **Alternative values:** `512` (512 KB), `2048` (2 MB), `4096` (4 MB)
- **Related tweaks:** LargeSystemCache, DisablePagingExecutive
- **Operating system compatibility:** Windows 10, Windows 11
- **Intel / AMD / Hybrid compatibility:** Tüm İşlemciler

---

## 13. Kernel SpinLock Doğrulama Aşırı Yükünü Kapatma (DisableSpinlockVerification)
- **Title:** Kernel SpinLock Doğrulama Aşırı Yükünü Kapatma (DisableSpinlockVerification)
- **Category:** Executive Scheduler / Kernel Synchronization
- **Short description:** Sürücülerin çekirdek kilitlerinde (spinlock) geçirdiği sürenin periyodik denetimini kapatır, çok çekirdekli sistemlerde kilit çakışması yönetim yükünü azaltır.
- **Exact code:** `reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Executive" /v DisableSpinlockVerification /t REG_DWORD /d 1 /f`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Executive`
- **PowerCfg alias:** Yok
- **GUID:** Yok
- **BCDEdit option:** Yok
- **PowerShell command:** `Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Executive" -Name "DisableSpinlockVerification" -Value 1`
- **CMD command:** `reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Executive" /v DisableSpinlockVerification /t REG_DWORD /d 1 /f`
- **Original source:** Windows Driver Kit (WDK) SpinLock Internals
- **Source URL:** https://learn.microsoft.com/en-us/windows-hardware/drivers/devtest/driver-verifier
- **Discussion URL:** https://www.overclock.net/threads/windows-kernel-spinlock-performance.1776512/
- **Alternative values:** `0` (Spinlock doğrulaması aktif)
- **Related tweaks:** AdditionalCriticalWorkerThreads
- **Operating system compatibility:** Windows 10, Windows 11
- **Intel / AMD / Hybrid compatibility:** Multi-Core Intel & AMD İşlemciler

---

## 14. İşlemci Kontrol Akış Koruması (Control Flow Guard - CFG) CPU İnceleme Gecikmesini Kapatma
- **Title:** İşlemci Kontrol Akış Koruması (Control Flow Guard - CFG) CPU İnceleme Gecikmesini Kapatma
- **Category:** Process Mitigation Tweaks / Kernel Security
- **Short description:** Yürütülebilir kod parçacıklarının her dolaylı çağrıda (indirect call) CPU tarafından CFG haritasına karşı doğrulanması adımını es geçerek oyun iş parçacıklarının CPU yürütme hızını artırır.
- **Exact code:** `Set-ProcessMitigation -System -Disable CFG`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\kernel`
- **PowerCfg alias:** Yok
- **GUID:** Yok
- **BCDEdit option:** Yok
- **PowerShell command:** `Set-ProcessMitigation -System -Disable CFG`
- **CMD command:** `powershell -Command "Set-ProcessMitigation -System -Disable CFG"`
- **Original source:** Microsoft Security Mitigations Guide / PCGamingWiki Performance Guides
- **Source URL:** https://learn.microsoft.com/en-us/windows/security/application-security/application-control/app-control-for-windows/design/control-flow-guard
- **Discussion URL:** https://www.reddit.com/r/OptimizedGaming/comments/119h32w/disabling_control_flow_guard_for_games/
- **Alternative values:** `Set-ProcessMitigation -System -Enable CFG`
- **Related tweaks:** Disable CPU Mitigations (Spectre/Meltdown)
- **Operating system compatibility:** Windows 10, Windows 11
- **Intel / AMD / Hybrid compatibility:** Tüm İşlemciler

---

## 15. BCDEdit İşlemci Grup Mimarisi ve NUMA Node Ayarı (GroupAware & MaxGroup)
- **Title:** BCDEdit İşlemci Grup Mimarisi ve NUMA Node Ayarı (GroupAware & MaxGroup)
- **Category:** BCDEdit CPU Options / NUMA & Topology
- **Short description:** 64'ten fazla mantıksal çekirdeğe sahip veya çoklu NUMA mimarilerinde (Ryzen Threadripper / Dual CCD) sürücülerin tüm çekirdek gruplarından eşit faydalanmasını zorlar.
- **Exact code:** `bcdedit /set groupaware yes` & `bcdedit /set maxgroup true`
- **Registry path:** Yok
- **PowerCfg alias:** Yok
- **GUID:** Yok
- **BCDEdit option:** `groupaware yes`, `maxgroup true`
- **PowerShell command:** `bcdedit /set groupaware yes; bcdedit /set maxgroup true`
- **CMD command:** `bcdedit /set groupaware yes && bcdedit /set maxgroup true`
- **Original source:** Microsoft Hardware Developer Options
- **Source URL:** https://learn.microsoft.com/en-us/windows-hardware/drivers/devtest/bcdedit--set
- **Discussion URL:** https://level1techs.com/video/windows-numa-node-group-scheduling
- **Alternative values:** `no` / `false`
- **Related tweaks:** Win32PrioritySeparation, Heterogeneous Scheduling
- **Operating system compatibility:** Windows 10, Windows 11
- **Intel / AMD / Hybrid compatibility:** AMD Ryzen 7900X/7950X/9900X/9950X, Threadripper & Intel Dual-CCD / High Core CPUs

---

## 16. Kısa Süreli İş Parçacıkları İçin EPP Performans Eğilimi (Short Thread EPP)
- **Title:** Kısa Süreli İş Parçacıkları İçin EPP Performans Eğilimi (Short Thread EPP)
- **Category:** Hybrid Scheduling / Heterogeneous P-Core / E-Core Policy
- **Short description:** Hibrit işlemcilerde kısa ömürlü mikro görevlerin (mouse polling, UI render ticks) EPP değerini 0 yaparak P-Core frekansını düşürmeden anında işlenmesini sağlar.
- **Exact code:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 40b2d6d1-72e0-45e9-963d-b659c25b07c9 0`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\Power\PowerSettings\54533251-82be-4824-96c1-47b60b740d00\40b2d6d1-72e0-45e9-963d-b659c25b07c9`
- **PowerCfg alias:** Yok
- **GUID:** `40b2d6d1-72e0-45e9-963d-b659c25b07c9`
- **BCDEdit option:** Yok
- **PowerShell command:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 40b2d6d1-72e0-45e9-963d-b659c25b07c9 0`
- **CMD command:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 40b2d6d1-72e0-45e9-963d-b659c25b07c9 0`
- **Original source:** Intel Thread Director Architecture Tuning
- **Source URL:** https://www.intel.com/content/www/us/en/developer/articles/technical/hybrid-architecture-optimization.html
- **Discussion URL:** https://forums.blurbusters.com/viewtopic.php?t=9120
- **Alternative values:** `50` (%50 varsayılan dengeli eğilim)
- **Related tweaks:** Energy Performance Preference (EPP), Heterogeneous Short Thread Scheduling
- **Operating system compatibility:** Windows 11
- **Intel / AMD / Hybrid compatibility:** Intel Alder Lake / Raptor Lake / Arrow Lake & AMD Ryzen Hibrit Mimariler

---

## 17. IntelPPM / AmdPPM Sürücüsü Düşük Güç Durumu Geçiş Gecikmesini Engelleme
- **Title:** IntelPPM / AmdPPM Sürücüsü Düşük Güç Durumu Geçiş Gecikmesini Engelleme
- **Category:** Processor Power Management (PPM) / Sürücü Düzeyi
- **Short description:** IntelPPM veya AmdPPM çekirdek sürücüsünün işlemciyi derin C-State uyku modlarına geçirmesini engelleyerek doğrudan C0/P0 durumlarında tutar.
- **Exact code:** `reg add "HKLM\SYSTEM\CurrentControlSet\Services\IntelPPM" /v DisableCStates /t REG_DWORD /d 1 /f` & `reg add "HKLM\SYSTEM\CurrentControlSet\Services\AmdPPM" /v DisableCStates /t REG_DWORD /d 1 /f`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Services\IntelPPM` & `HKLM\SYSTEM\CurrentControlSet\Services\AmdPPM`
- **PowerCfg alias:** Yok
- **GUID:** Yok
- **BCDEdit option:** Yok
- **PowerShell command:** `Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\IntelPPM" -Name "DisableCStates" -Value 1 -ErrorAction SilentlyContinue; Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\AmdPPM" -Name "DisableCStates" -Value 1 -ErrorAction SilentlyContinue`
- **CMD command:** `reg add "HKLM\SYSTEM\CurrentControlSet\Services\IntelPPM" /v DisableCStates /t REG_DWORD /d 1 /f & reg add "HKLM\SYSTEM\CurrentControlSet\Services\AmdPPM" /v DisableCStates /t REG_DWORD /d 1 /f`
- **Original source:** TenForums & Overclock.net PPM Service Tweaks
- **Source URL:** https://www.tenforums.com/performance-maintenance/165432-intelppm-amdppm-driver-cstates.html
- **Discussion URL:** https://www.overclock.net/threads/disabling-intelppm-service-vs-c-states.1732104/
- **Alternative values:** `0` (Sürücü C-State geçişlerine izin ver)
- **Related tweaks:** Processor Idle Disable C-States
- **Operating system compatibility:** Windows 10, Windows 11
- **Intel / AMD / Hybrid compatibility:** Tüm Intel ve AMD İşlemciler

---

## 18. İşlemci Frekans Düşürme Geciktirme Süresi (Processor Performance Decrease Time)
- **Title:** İşlemci Frekans Düşürme Geciktirme Süresi (Processor Performance Decrease Time)
- **Category:** PPM / Frequency Scaling
- **Short description:** İşlemci yükü düştükten sonra saat hızının düşürülmeden önce bekleneceği süreyi maksimum değere çıkartarak micro-burst yüklerde frekans dalgalanmasını önler.
- **Exact code:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 2ddd5a84-5a71-437e-912a-db708878f1a5 100`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\Power\PowerSettings\54533251-82be-4824-96c1-47b60b740d00\2ddd5a84-5a71-437e-912a-db708878f1a5`
- **PowerCfg alias:** Yok
- **GUID:** `2ddd5a84-5a71-437e-912a-db708878f1a5`
- **BCDEdit option:** Yok
- **PowerShell command:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 2ddd5a84-5a71-437e-912a-db708878f1a5 100`
- **CMD command:** `powercfg /setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 2ddd5a84-5a71-437e-912a-db708878f1a5 100`
- **Original source:** Microsoft Power Management Setting Reference
- **Source URL:** https://learn.microsoft.com/en-us/windows-hardware/customize/power-settings/processor-performance-decrease-time
- **Discussion URL:** https://forums.blurbusters.com/viewtopic.php?t=8110
- **Alternative values:** `15` (15ms varsayılan bekleme)
- **Related tweaks:** Processor Performance Decrease Threshold
- **Operating system compatibility:** Windows 10, Windows 11
- **Intel / AMD / Hybrid compatibility:** Tüm İşlemciler

---

## 19. Ön Plan Uygulama İş Parçacığı Taban Öncelik Tabanı Zorlaması (ThreadPriorityFloor)
- **Title:** Ön Plan Uygulama İş Parçacığı Taban Öncelik Tabanı Zorlaması (ThreadPriorityFloor)
- **Category:** Process Priority Tweaks / Executive Scheduler
- **Short description:** Windows zamanlayıcısının ön plandaki dinamik iş parçacıklarının öncelik seviyesini (priority boost) hiçbir zaman `NORMAL` seviyesinin altına düşürmemesini kilitler.
- **Exact code:** `reg add "HKLM\SYSTEM\CurrentControlSet\Control\PriorityControl" /v ThreadPriorityFloor /t REG_DWORD /d 1 /f`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\PriorityControl`
- **PowerCfg alias:** Yok
- **GUID:** Yok
- **BCDEdit option:** Yok
- **PowerShell command:** `Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\PriorityControl" -Name "ThreadPriorityFloor" -Value 1`
- **CMD command:** `reg add "HKLM\SYSTEM\CurrentControlSet\Control\PriorityControl" /v ThreadPriorityFloor /t REG_DWORD /d 1 /f`
- **Original source:** Windows Internals 7th Edition (Priority Scheduling Section)
- **Source URL:** https://learn.microsoft.com/en-us/sysinternals/resources/windows-internals
- **Discussion URL:** https://www.overclock.net/threads/threadpriorityfloor-and-foreground-scheduling.1791024/
- **Alternative values:** `0` (Dinamik öncelik düşürmeye izin ver)
- **Related tweaks:** Win32PrioritySeparation, MMCSS SystemResponsiveness
- **Operating system compatibility:** Windows 10, Windows 11
- **Intel / AMD / Hybrid compatibility:** Tüm İşlemciler

---

## 20. Bellek Bütünlüğü (HVCI / Memory Integrity) Donanım İnceleme Yükünü Kaldırma
- **Title:** Bellek Bütünlüğü (HVCI / Memory Integrity) Donanım İnceleme Yükünü Kaldırma
- **Category:** VBS / Process Mitigation Tweaks
- **Short description:** CPU SLAT ve VT-x/AMD-V sanallaştırma sayfalarının her sürücü bellek erişiminde kontrol edilmesini sağlayan Hypervisor Enforced Code Integrity özelliğini kapatır.
- **Exact code:** `reg add "HKLM\SYSTEM\CurrentControlSet\Control\DeviceGuard\Scenarios\HypervisorEnforcedCodeIntegrity" /v Enabled /t REG_DWORD /d 0 /f`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\DeviceGuard\Scenarios\HypervisorEnforcedCodeIntegrity`
- **PowerCfg alias:** Yok
- **GUID:** Yok
- **BCDEdit option:** Yok
- **PowerShell command:** `Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\DeviceGuard\Scenarios\HypervisorEnforcedCodeIntegrity" -Name "Enabled" -Value 0`
- **CMD command:** `reg add "HKLM\SYSTEM\CurrentControlSet\Control\DeviceGuard\Scenarios\HypervisorEnforcedCodeIntegrity" -v Enabled -t REG_DWORD -d 0 -f`
- **Original source:** Microsoft Windows Security Documentation & Tom's Hardware HVCI Gaming Benchmarks
- **Source URL:** https://learn.microsoft.com/en-us/windows/security/application-security/device-isolation/memory-integrity
- **Discussion URL:** https://www.tomshardware.com/news/windows-11-hvci-gaming-benchmarks
- **Alternative values:** `1` (HVCI aktif)
- **Related tweaks:** Virtualization-Based Security (VBS) Disable
- **Operating system compatibility:** Windows 10, Windows 11
- **Intel / AMD / Hybrid compatibility:** Tüm Intel ve AMD İşlemciler
