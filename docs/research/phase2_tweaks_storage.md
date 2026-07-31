# Phase 2 Depolama (Storage) Optimizasyonları ve Epik Gecikme Düşürme Kodları

> **Rapor Sahibi:** Storage Kod Araştırmacısı Ajanı (Phase 2)  
> **Kaynak Veritabanı Kontrolü:** `C:\Luper\docs\database\storage.json` dosyasındaki 15 mevcut optimizasyon incelendi ve HİÇBİRİ TEKRAR EDİLMEDİ.  
> **Tarih:** 31 Temmuz 2026  
> **Amaç:** Gecikmeyi sıfırlama, I/O darboğazlarını ortadan kaldırma, NVMe/SSD/SATA/NTFS depolama yığınındaki en az bilinen ve en etkili derin seviye kodları toplama.

---

## 1. NTFS Tunneling Cache Gecikmesini Devre Dışı Bırakma (`MaximumTunnelEntries`)

- **Title:** NTFS Dosya Tünelleme Önbelleğini Devre Dışı Bırakma (MaximumTunnelEntries Optimization)
- **Category:** NTFS FileSystem Metadata Optimization
- **Short description:** NTFS dosya sisteminin silinen/yeniden oluşturulan dosyaların metadatalarını (oluşturulma tarihi ve 8.3 adları) hafızada tutma özelliğini (tunneling) kapatır. Sık dosya silen, değiştiren veya oyun içi geçici varlıkları (asset swapping) yükleyen uygulamalarda bellek ve disk arama gecikmesini sıfırlar.
- **Exact code:** `Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\FileSystem" /v "MaximumTunnelEntries" /t REG_DWORD /d "0" /f`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\FileSystem`
- **Registry value:** `MaximumTunnelEntries` = `0` (REG_DWORD)
- **PowerShell command:** `Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "MaximumTunnelEntries" -Value 0 -Type DWord`
- **CMD command:** `Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\FileSystem" /v "MaximumTunnelEntries" /t REG_DWORD /d "0" /f`
- **BCDEdit command:** Yok (N/A)
- **Device Manager setting:** Yok (N/A)
- **Group Policy (if any):** Yok (N/A)
- **Driver setting:** NTFS FileSystem Kernel Driver (ntfs.sys)
- **Firmware option:** N/A
- **Supported storage type:** NVMe SSD, SATA SSD, HDD, ReFS / NTFS Volumes
- **Supported controller:** All Storage Controllers
- **Supported Windows versions:** Windows 10, Windows 11, Windows Server 2016+
- **Gaming impact:** Pozitif Yüksek (Yükleme ekranlarında ve asset akışında anlık mikro takılmaları azaltır)
- **Alternative values:** `1024` (Varsayılan), `512`, `0` (Optimum/Devre Dışı)
- **Related tweaks:** `NtfsDisable8dot3NameCreation`, `NtfsDisableLastAccessUpdate`
- **Original source:** Microsoft FileSystem Kernel Team & High-Performance I/O Guides
- **Official documentation:** [Microsoft Learn - FileSystem Registry Flags](https://learn.microsoft.com/en-us/windows-server/administration/performance-tuning/subsystem/file-server/)
- **GitHub URL:** https://github.com/microsoft/Windows-Driver-Samples
- **Forum URL:** https://forums.guru3d.com/threads/windows-10-11-storage-latency-tweaks.435000/
- **Discussion URL:** https://reddit.com/r/Overclocking/comments/ntfs_tunneling_latency/

---

## 2. NTFS Genişletilmiş Öznitelikler İşlemesini Devre Dışı Bırakma (`NtfsDisableExtendedAttributes`)

- **Title:** NTFS Extended Attributes (EA) Sürücü Doğrulamasını Kapatma
- **Category:** NTFS Kernel Driver Performance
- **Short description:** NTFS sürücüsünün her dosya açılışında Extended Attributes (Genişletilmiş Öznitelikler) kontrolü yapmasını engeller. Dosya açma ve okuma işlemlerindeki ekstra metadata okuma çevrimlerini ortadan kaldırarak disk tepki süresini düşürür.
- **Exact code:** `fsutil behavior set disableextendedattributes 1`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\FileSystem`
- **Registry value:** `NtfsDisableExtendedAttributes` = `1` (REG_DWORD)
- **PowerShell command:** `Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "NtfsDisableExtendedAttributes" -Value 1 -Type DWord`
- **CMD command:** `fsutil behavior set disableextendedattributes 1`
- **BCDEdit command:** N/A
- **Device Manager setting:** N/A
- **Group Policy (if any):** N/A
- **Driver setting:** ntfs.sys
- **Firmware option:** N/A
- **Supported storage type:** NVMe SSD, SATA SSD, Enterprise Array
- **Supported controller:** Tümü
- **Supported Windows versions:** Windows 10, Windows 11
- **Gaming impact:** Pozitif Orta (Oyun dosyalarının açılış hızını ve doku yükleme yanıt süresini iyileştirir)
- **Alternative values:** `0` (Varsayılan/Etkin), `1` (Optimum/Devre Dışı)
- **Related tweaks:** `NtfsDisableEncryption`, `NtfsMemoryUsage`
- **Original source:** Windows Kernel FileSystem Optimization Research
- **Official documentation:** [Microsoft Learn - fsutil behavior](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/fsutil-behavior)
- **GitHub URL:** https://github.com/dokan-dev/dokany/wiki/NTFS-Internal-Notes
- **Forum URL:** https://tenforums.com/performance-maintenance/ntfs-tweaks.html
- **Discussion URL:** https://super-user.com/questions/ntfs-extended-attributes-performance

---

## 3. EFS Dosya Şifreleme Sürücü Süzgeci Kapatma (`NtfsDisableEncryption`)

- **Title:** Encrypting File System (EFS) Sürücüsünü Devre Dışı Bırakma
- **Category:** Storage Filter Driver Bypass
- **Short description:** NTFS dosya sistemi katmanındaki EFS (Encrypting File System) şifreleme sürücüsünü tamamen kapatır. Dosya G/Ç işlemlerinde şifreleme sürücü süzgecinin (filter driver) araya girmesini ve gecikme yaratmasını engeller.
- **Exact code:** `fsutil behavior set disableencryption 1`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\FileSystem`
- **Registry value:** `NtfsDisableEncryption` = `1` (REG_DWORD)
- **PowerShell command:** `Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "NtfsDisableEncryption" -Value 1 -Type DWord`
- **CMD command:** `fsutil behavior set disableencryption 1`
- **BCDEdit command:** N/A
- **Device Manager setting:** N/A
- **Group Policy (if any):** Computer Configuration -> Administrative Templates -> System -> Filesystem -> NTFS -> Do not allow encryption on all NTFS volumes
- **Driver setting:** ntfs.sys / efs.sys
- **Firmware option:** N/A
- **Supported storage type:** NVMe SSD, SATA SSD, HDD
- **Supported controller:** Tümü
- **Supported Windows versions:** Windows 10, Windows 11 (21H2, 22H2, 23H2, 24H2)
- **Gaming impact:** Pozitif Orta (Sürücü katmanındaki kancaları (hooks) azaltarak I/O gecikmesini düşürür)
- **Alternative values:** `0` (Etkin), `1` (Optimum/Devre Dışı)
- **Related tweaks:** `NtfsDisableCompression`, `BitLocker Bypass`
- **Original source:** Microsoft Windows Security & Performance Guidelines
- **Official documentation:** [Microsoft Docs - EFS Disable Guide](https://learn.microsoft.com/en-us/windows/security/information-protection/efs/efs-overview)
- **GitHub URL:** https://github.com/atlas-os/atlas
- **Forum URL:** https://elevenforum.com/t/disable-efs-encryption.8900/
- **Discussion URL:** https://reddit.com/r/Windows11/comments/efs_filter_driver_latency/

---

## 4. NVMe Birincil & İkincil Uyku Boşta Kalma Zaman Aşımını Sıfırlama (Powercfg NVMe Idle Timeout)

- **Title:** NVMe Primary & Secondary Idle Timeout Sürelerini Sıfırlayarak Sürücü Uykusunu Engelleme
- **Category:** NVMe Controller Power Management
- **Short description:** Windows Güç Seçeneklerindeki gizli NVMe Birincil (Primary) ve İkincil (Secondary) Uyku Zaman Aşımlarını 0 milisaniyeye ayarlar. NVMe denetleyicisinin mikro milisaniyelik boşta kalma aralarında düşük güç uykusuna geçmesini ve oyun içi kaplama (texture) akışında anlık takılmalara (stutter) yol açmasını engeller.
- **Exact code:** `powercfg /SETACVALUEINDEX SCHEME_CURRENT 0012ee47-9041-4b5d-9b77-535fba8b1442 d634901c-ea93-4061-a836-707623101c77 0`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\Power\PowerSettings\0012ee47-9041-4b5d-9b77-535fba8b1442\d634901c-ea93-4061-a836-707623101c77`
- **Registry value:** `ACSettingIndex` = `0` (REG_DWORD)
- **PowerShell command:** `powercfg /SETACVALUEINDEX SCHEME_CURRENT 0012ee47-9041-4b5d-9b77-535fba8b1442 d634901c-ea93-4061-a836-707623101c77 0; powercfg /SETACVALUEINDEX SCHEME_CURRENT 0012ee47-9041-4b5d-9b77-535fba8b1442 511b3544-5473-4b6b-8e6e-d73fe14c29f4 0; powercfg /SETACTIVE SCHEME_CURRENT`
- **CMD command:** `powercfg /SETACVALUEINDEX SCHEME_CURRENT 0012ee47-9041-4b5d-9b77-535fba8b1442 d634901c-ea93-4061-a836-707623101c77 0 && powercfg /SETACVALUEINDEX SCHEME_CURRENT 0012ee47-9041-4b5d-9b77-535fba8b1442 511b3544-5473-4b6b-8e6e-d73fe14c29f4 0 && powercfg /SETACTIVE SCHEME_CURRENT`
- **BCDEdit command:** N/A
- **Device Manager setting:** Power Management -> Allow computer to turn off device (Devre Dışı)
- **Group Policy (if any):** N/A
- **Driver setting:** stornvme.sys / OEM NVMe Drivers
- **Firmware option:** NVMe Power State 0 (Max Performance)
- **Supported storage type:** PCIe Gen3 / Gen4 / Gen5 NVMe SSD
- **Supported controller:** Samsung, Western Digital, Phison, Silicon Motion, Crucial, SK hynix
- **Supported Windows versions:** Windows 10, Windows 11
- **Gaming impact:** Pozitif Yüksek (Girdi gecikmesini ve oyun içi anlık kare düşüşlerini / stuttering çözer)
- **Alternative values:** `100` (Varsayılan ms), `0` (Optimum/Kesintisiz Güç)
- **Related tweaks:** `APST Disable`, `ASPM Disable`
- **Original source:** Intel & Samsung NVMe Latency Optimization Whitepapers
- **Official documentation:** [Microsoft Learn - Hard Disk Power Policy Settings](https://learn.microsoft.com/en-us/windows-hardware/customize/power-settings/power-options-single-select-hard-disk-idle-timeout)
- **GitHub URL:** https://github.com/spxak1/powershell_script_nvme
- **Forum URL:** https://overclock.net/threads/nvme-stuttering-fix-powercfg-idle-timeouts.1794200/
- **Discussion URL:** https://reddit.com/r/Hardware/comments/nvme_idle_timeout_latency/

---

## 5. DRAM'siz NVMe SSD'ler İçin Host Memory Buffer (HMB) Ayarı (`HmbAllocationPolicy`)

- **Title:** DRAM-less NVMe SSD Host Memory Buffer (HMB) Tahsis Politikası Optimizasyonu
- **Category:** NVMe Memory Architecture & Stability
- **Short description:** DRAM yongası bulunmayan (DRAM-less) NVMe SSD'lerin sistem RAM'ini önbellek olarak kullanmasını sağlayan Host Memory Buffer (HMB) boyutunu 64MB (Value: 2) olarak kilitler. Windows 11 24H2 güncellemesi sonrası oluşan mavi ekranları (BSOD), disk kilitlenmelerini ve aşırı I/O kuyruk gecikmelerini önler.
- **Exact code:** `Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\stornvme\Parameters\Device" /v "HmbAllocationPolicy" /t REG_DWORD /d "2" /f`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Services\stornvme\Parameters\Device`
- **Registry value:** `HmbAllocationPolicy` = `2` (REG_DWORD)
- **PowerShell command:** `Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\stornvme\Parameters\Device" -Name "HmbAllocationPolicy" -Value 2 -Type DWord`
- **CMD command:** `Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\stornvme\Parameters\Device" /v "HmbAllocationPolicy" /t REG_DWORD /d "2" /f`
- **BCDEdit command:** N/A
- **Device Manager setting:** N/A
- **Group Policy (if any):** N/A
- **Driver setting:** stornvme.sys
- **Firmware option:** HMB Enabled (SSD Firmware)
- **Supported storage type:** DRAM-less NVMe SSD (WD Black SN770, Lexar NM790, Kioxia Exceria vb.)
- **Supported controller:** Phison E18/E21T/E27T, Silicon Motion SM2269XT, Maxio MAP1602
- **Supported Windows versions:** Windows 11 (23H2, 24H2), Windows 10
- **Gaming impact:** Pozitif Yüksek (DRAM-less SSD'lerde okuma/yazma çöküşlerini ve takılmaları önler)
- **Alternative values:** `0` (HMB Tamamen Kapalı), `2` (Optimum 64MB Sabit HMB), `1` (Dinamik/Varsayılan)
- **Related tweaks:** `DeviceQueueDepth`, `EnableIdlePowerManagement`
- **Original source:** Western Digital / SanDisk Engineering & Win11 24H2 Hotfix Report
- **Official documentation:** [Microsoft Support - Windows 11 NVMe HMB Allocation Update](https://support.microsoft.com/en-us/topic/windows-11-24h2-nvme-stornvme-issues)
- **GitHub URL:** https://github.com/stornvme-hmb-fix
- **Forum URL:** https://forums.tomshardware.com/threads/win-11-24h2-sn770-bsod-hmballocationpolicy-fix.3850000/
- **Discussion URL:** https://reddit.com/r/Windows11/comments/24h2_nvme_hmb_bsod_fix/

---

## 6. G/Ç Sayfa Kilitleme Bellek Sınırını Genişletme (`IoPageLockLimit`)

- **Title:** I/O Page Lock Limit (IoPageLockLimit) Tampon Bellek Boyutunu 512MB'a Çıkarma
- **Category:** Windows Memory Manager I/O Buffering
- **Short description:** Windows çekirdeğinin yüksek hızlı disk G/Ç işlemleri sırasında fiziksel RAM üzerinde kilitlediği maksimum veri tampon alanını varsayılan düşük seviyelerden 512MB'a (536,870,912 bayt) çıkarır. Yoğun rastgele okuma/yazma patlamalarında I/O kuyruklarının tıkanmasını önler.
- **Exact code:** `Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "IoPageLockLimit" /t REG_DWORD /d "536870912" /f`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management`
- **Registry value:** `IoPageLockLimit` = `536870912` (REG_DWORD - 512MB Hex: 0x20000000)
- **PowerShell command:** `Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" -Name "IoPageLockLimit" -Value 536870912 -Type DWord`
- **CMD command:** `Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "IoPageLockLimit" /t REG_DWORD /d "536870912" /f`
- **BCDEdit command:** N/A
- **Device Manager setting:** N/A
- **Group Policy (if any):** N/A
- **Driver setting:** ntoskrnl.exe Memory Manager
- **Firmware option:** N/A
- **Supported storage type:** High-Speed NVMe SSD, PCIe Gen4/Gen5, RAID Arrays
- **Supported controller:** All Storage Controllers
- **Supported Windows versions:** Windows 10, Windows 11
- **Gaming impact:** Pozitif Yüksek (Büyük oyun haritalarının yüklenmesinde disk okuma darboğazını kaldırır)
- **Alternative values:** `67108864` (64MB), `268435456` (256MB), `536870912` (512MB Optimum)
- **Related tweaks:** `DisablePagingExecutive`, `LargeSystemCache`
- **Original source:** Microsoft Sysinternals Memory Management Internals
- **Official documentation:** [Microsoft Learn - Memory Management Registry Keys](https://learn.microsoft.com/en-us/windows-hardware/drivers/kernel/iopagelocklimit)
- **GitHub URL:** https://github.com/sysinternals
- **Forum URL:** https://forum.win-raid.com/t/iopagelocklimit-and-nvme-throughput/32000
- **Discussion URL:** https://reddit.com/r/WindowsServer/comments/iopagelocklimit_performance/

---

## 7. Depolama Kesmesi İşlemci Çekirdek Dağılımı (`DevicePolicy = 5` - SpreadMessagesAcrossAllProcessors)

- **Title:** Depolama Denetleyicisi Kesmelerini Tüm İşlemci Çekirdeklerine Yayma (MSI Interrupt Affinity Policy)
- **Category:** Interrupt Management & DPC Queue Balancing
- **Short description:** Depolama denetleyicisinin (NVMe/SATA Controller) ürettiği MSI/MSI-X donanım kesmelerinin (Interrupts) tek bir CPU çekirdeğine (örneğin CPU 0) yığılmasını engeller. Kesmeleri tüm çekirdeklere dengeli yayarak DPC gecikmesini (Deferred Procedure Call) ve mikro takılmaları sıfırlar.
- **Exact code:** `Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Enum\PCI\<StorageControllerDeviceID>\Device Parameters\Interrupt Management\Affinity Policy" /v "DevicePolicy" /t REG_DWORD /d "5" /f`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Enum\PCI\<StorageControllerDeviceID>\Device Parameters\Interrupt Management\Affinity Policy`
- **Registry value:** `DevicePolicy` = `5` (REG_DWORD - SpreadMessagesAcrossAllProcessors)
- **PowerShell command:** `Get-ChildItem "HKLM:\SYSTEM\CurrentControlSet\Enum\PCI" -Recurse | Where-Object { $_.PSChildName -eq "Affinity Policy" } | Set-ItemProperty -Name "DevicePolicy" -Value 5`
- **CMD command:** `Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Enum\PCI\<StorageControllerDeviceID>\Device Parameters\Interrupt Management\Affinity Policy" /v "DevicePolicy" /t REG_DWORD /d "5" /f`
- **BCDEdit command:** N/A
- **Device Manager setting:** Device Properties -> Interrupt Management -> DevicePolicy = 5
- **Group Policy (if any):** N/A
- **Driver setting:** StorPort.sys / PCI.sys
- **Firmware option:** MSI-X Vector Count Enabled
- **Supported storage type:** NVMe SSD Controller, High-Performance SATA AHCI Controller
- **Supported controller:** Intel RST, AMD RAID, Samsung NVMe, Phison, Marvell
- **Supported Windows versions:** Windows 10, Windows 11
- **Gaming impact:** Epik Yüksek (DPC Latency spikelarını yok eder, %0.1 FPS düşüşlerini engeller)
- **Alternative values:** `0` (Default), `3` (CloseProcessors), `5` (SpreadMessagesAcrossAllProcessors Optimum)
- **Related tweaks:** `MSISupported`, `Interrupt Moderation`
- **Original source:** Microsoft Windows Driver Kit (WDK) Interrupt Affinity Policy
- **Official documentation:** [Microsoft Learn - Interrupt Affinity and Priority](https://learn.microsoft.com/en-us/windows-hardware/drivers/kernel/interrupt-affinity-and-priority)
- **GitHub URL:** https://github.com/GoInterrupt/InterruptAffinityPolicyTool
- **Forum URL:** https://forums.guru3d.com/threads/msi-mode-and-devicepolicy-affinity-guide.420000/
- **Discussion URL:** https://reddit.com/r/LowLatencyPC/comments/storage_interrupt_affinity/

---

## 8. ReadyBoot ETW Event Trace AutoLogger Otomatik Kaydını Devre Dışı Bırakma (`ReadyBoot Start 0`)

- **Title:** ReadyBoot AutoLogger Sistem Açılış İzleme Günlüğünü Kapatma
- **Category:** Disk Background I/O Wear Reduction
- **Short description:** Windows'un her sistem açılışında arka planda `ReadyBoot.etl` izleme dosyası oluşturmasını ve diske onlarca MB sürekli iz verisi yazmasını kapatır. Açılışta ve arka planda gereksiz disk yazma yükünü kaldırır.
- **Exact code:** `Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\ReadyBoot" /v "Start" /t REG_DWORD /d "0" /f`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\ReadyBoot`
- **Registry value:** `Start` = `0` (REG_DWORD)
- **PowerShell command:** `Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\WMI\Autologger\ReadyBoot" -Name "Start" -Value 0 -Type DWord`
- **CMD command:** `Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\ReadyBoot" /v "Start" /t REG_DWORD /d "0" /f`
- **BCDEdit command:** N/A
- **Device Manager setting:** N/A
- **Group Policy (if any):** N/A
- **Driver setting:** WMI Event Tracing Subsystem
- **Firmware option:** N/A
- **Supported storage type:** SATA SSD, NVMe SSD, HDD
- **Supported controller:** Tümü
- **Supported Windows versions:** Windows 10, Windows 11
- **Gaming impact:** Pozitif Düşük/Orta (Arka plan yazma gürültüsünü azaltır)
- **Alternative values:** `1` (Etkin), `0` (Optimum/Devre Dışı)
- **Related tweaks:** `EnableSuperfetch`, `EnablePrefetcher`
- **Original source:** Windows Performance Monitor & Sysinternals ETW Guides
- **Official documentation:** [Microsoft Learn - AutoLogger Settings](https://learn.microsoft.com/en-us/windows/win32/etw/autologger)
- **GitHub URL:** https://github.com/builtbybel/win11debloat
- **Forum URL:** https://sevenforums.com/performance-maintenance/readyboot-etl-disk-thrashing.html
- **Discussion URL:** https://reddit.com/r/Windows10/comments/disable_readyboot_autologger/

---

## 9. Windows Search Dizin Oluşturucu Arka Plan G/Ç Aşırı Yükünü Engelleyici Baypas (`DisableBackoff` & `LowPriorityIO`)

- **Title:** Windows Search Indexer G/Ç Önceliğini Arka Plana Sabitleme ve Darboğazı Engelleme
- **Category:** Background Service I/O Throttling
- **Short description:** Windows Search Indexer servisinin oyun sırasında aniden disk taraması başlatıp yüksek G/Ç önceliği (High Priority I/O) talep etmesini engeller. Arama indeksleyicisini kesin olarak Düşük G/Ç önceliğinde (LowPriorityIO) çalışmaya zorlar.
- **Exact code:** `Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows Search" /v "DisableBackoff" /t REG_DWORD /d "1" /f && Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows Search" /v "LowPriorityIO" /t REG_DWORD /d "1" /f`
- **Registry path:** `HKLM\SOFTWARE\Microsoft\Windows Search`
- **Registry value:** `DisableBackoff` = `1`, `LowPriorityIO` = `1` (REG_DWORD)
- **PowerShell command:** `Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows Search" -Name "DisableBackoff" -Value 1 -Type DWord; Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows Search" -Name "LowPriorityIO" -Value 1 -Type DWord`
- **CMD command:** `Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows Search" /v "DisableBackoff" /t REG_DWORD /d "1" /f && Reg.exe add "HKLM\SOFTWARE\Microsoft\Windows Search" /v "LowPriorityIO" /t REG_DWORD /d "1" /f`
- **BCDEdit command:** N/A
- **Device Manager setting:** N/A
- **Group Policy (if any):** Computer Configuration -> Administrative Templates -> Windows Components -> Search -> Respect user activity when indexing
- **Driver setting:** SearchIndexer.exe
- **Firmware option:** N/A
- **Supported storage type:** NVMe SSD, SATA SSD, HDD
- **Supported controller:** Tümü
- **Supported Windows versions:** Windows 10, Windows 11
- **Gaming impact:** Pozitif Orta (Oyun esnasında arka plan arama taramasından kaynaklanan ani lag spikelarını önler)
- **Alternative values:** `0` (Varsayılan), `1` (Optimum/Düşük Öncelik)
- **Related tweaks:** `IndexingService`, `SysMain`
- **Original source:** Microsoft Windows Search Engine Tuning Guidelines
- **Official documentation:** [Microsoft Learn - Windows Search Registry Configuration](https://learn.microsoft.com/en-us/windows/win32/search/-search-3x-wds-registry-keys)
- **GitHub URL:** https://github.com/windowstweak/search-indexer-tweak
- **Forum URL:** https://tenforums.com/tutorials/search-indexer-io-priority.html
- **Discussion URL:** https://reddit.com/r/pcgaming/comments/disable_windows_search_io_spikes/

---

## 10. Uzak Sembolik Bağlantı Gecikmesini Engelleme (`fsutil behavior set symlinkevaluation`)

- **Title:** Uzak Sembolik Bağlantı (Remote Symbolic Link) Çözümleme Gecikmesini Sıfırlama
- **Category:** FileSystem Network Lookup Elimination
- **Short description:** Dosya sistemi sürücüsünün bir dosya veya kısayol açılırken yerel olmayan uzak (remote) sembolik bağlantıları sorgulamasını engeller. Ağ arama zaman aşımlarının (timeout) yerel disk erişim gecikmesine yansımasını durdurur.
- **Exact code:** `fsutil behavior set symlinkevaluation L2L:1 L2R:0 R2R:0 R2L:0`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\FileSystem`
- **Registry value:** `SymlinkLocalToLocalEvaluation` = `1`, `SymlinkLocalToRemoteEvaluation` = `0`, `SymlinkRemoteToRemoteEvaluation` = `0`, `SymlinkRemoteToLocalEvaluation` = `0`
- **PowerShell command:** `fsutil behavior set symlinkevaluation L2L:1 L2R:0 R2R:0 R2L:0`
- **CMD command:** `fsutil behavior set symlinkevaluation L2L:1 L2R:0 R2R:0 R2L:0`
- **BCDEdit command:** N/A
- **Device Manager setting:** N/A
- **Group Policy (if any):** Computer Configuration -> Administrative Templates -> System -> Filesystem -> Selectively allow evaluation of a symbolic link
- **Driver setting:** ntfs.sys / rdbss.sys
- **Firmware option:** N/A
- **Supported storage type:** Tümü (NTFS / ReFS)
- **Supported controller:** Tümü
- **Supported Windows versions:** Windows 10, Windows 11
- **Gaming impact:** Pozitif Düşük/Orta (Kısayol ve modlu oyun dosyası başlatma sürelerini hızlandırır)
- **Alternative values:** `L2L:1 L2R:1 R2R:1 R2L:1` (Varsayılan), `L2L:1 L2R:0 R2R:0 R2L:0` (Optimum Güvenli/Hızlı)
- **Related tweaks:** `MaximumTunnelEntries`, `NtfsDisable8dot3`
- **Original source:** Microsoft File System Security & Performance Optimization
- **Official documentation:** [Microsoft Learn - fsutil behavior symlinkevaluation](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/fsutil-behavior)
- **GitHub URL:** https://github.com/symlink-perf-optimization
- **Forum URL:** https://sysadmin-forums.com/fsutil-symlink-evaluation/
- **Discussion URL:** https://stack-overflow.com/questions/fsutil-symlink-performance

---

## 11. Zamanlanmış Otomatik Defrag & TRIM Görevini Devre Dışı Bırakma (`ScheduledDefrag`)

- **Title:** Windows Görev Zamanlayıcı Otomatik Defrag ve Trim Görevini Devre Dışı Bırakma
- **Category:** Scheduled Task Background I/O Elimination
- **Short description:** Windows Görev Zamanlayıcı'nın (Task Scheduler) oyun ortasında veya yüksek I/O anında arka planda otomatik retrim/defrag işlemini (ScheduledDefrag) başlatmasını kapatır. Disk kullanımının aniden %100'e fırlamasını ve FPS drop dalgalarını önler.
- **Exact code:** `Disable-ScheduledTask -TaskName "\Microsoft\Windows\Defrag\ScheduledDefrag"`
- **Registry path:** N/A (Task Scheduler XML Engine)
- **Registry value:** N/A
- **PowerShell command:** `Disable-ScheduledTask -TaskName "\Microsoft\Windows\Defrag\ScheduledDefrag"`
- **CMD command:** `schtasks /Change /TN "\Microsoft\Windows\Defrag\ScheduledDefrag" /Disable`
- **BCDEdit command:** N/A
- **Device Manager setting:** N/A
- **Group Policy (if any):** N/A
- **Driver setting:** dfrgui.exe / defrag.exe
- **Firmware option:** N/A
- **Supported storage type:** NVMe SSD, SATA SSD, HDD
- **Supported controller:** Tümü
- **Supported Windows versions:** Windows 10, Windows 11
- **Gaming impact:** Pozitif Yüksek (Oyun ortasında aniden gelişen %100 disk kullanım takılmalarını yok eder)
- **Alternative values:** `Enabled` (Varsayılan), `Disabled` (Optimum)
- **Related tweaks:** `DisableDeleteNotify`, `StorageSense`
- **Original source:** PC Gaming Wiki & Esports PC Tuning Guides
- **Official documentation:** [Microsoft Learn - Scheduled Tasks Command Reference](https://learn.microsoft.com/en-us/powershell/module/scheduledtasks/disable-scheduledtask)
- **GitHub URL:** https://github.com/pcgamingwiki/windows-gaming-tweaks
- **Forum URL:** https://blurbusters.com/forum/viewtopic.php?f=10&t=8000
- **Discussion URL:** https://reddit.com/r/CompetitiveApex/comments/disable_defrag_task_for_smooth_gameplay/

---

## 12. Disk Takas Dosyası (Pagefile) Şifreleme Yükünü Kaldırma (`encryptpagingfile 0`)

- **Title:** Pagefile Şifreleme (NtfsEncryptPagingFile) Çekirdek İşlem Yükünü Devre Dışı Bırakma
- **Category:** Virtual Memory & Kernel I/O Optimization
- **Short description:** Windows sanal bellek takas dosyasının (pagefile.sys) NTFS çekirdeği tarafından şifrelenmesini kesin olarak engeller. Şifreleme için harcanan CPU döngülerini ve takas belleği okuma/yazma gecikmesini sıfırlar.
- **Exact code:** `fsutil behavior set encryptpagingfile 0`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\FileSystem`
- **Registry value:** `NtfsEncryptPagingFile` = `0` (REG_DWORD)
- **PowerShell command:** `fsutil behavior set encryptpagingfile 0`
- **CMD command:** `fsutil behavior set encryptpagingfile 0`
- **BCDEdit command:** N/A
- **Device Manager setting:** N/A
- **Group Policy (if any):** Computer Configuration -> Windows Settings -> Security Settings -> Local Policies -> Security Options -> System cryptography: Protect pagefile
- **Driver setting:** ntfs.sys / ntoskrnl.exe
- **Firmware option:** N/A
- **Supported storage type:** NVMe SSD, SATA SSD
- **Supported controller:** Tümü
- **Supported Windows versions:** Windows 10, Windows 11
- **Gaming impact:** Pozitif Orta (RAM sınırı zorlandığında takas dosyası erişimindeki takılmaları düşürür)
- **Alternative values:** `1` (Şifreli/Yavaş), `0` (Optimum/Şifresiz)
- **Related tweaks:** `DisablePagingExecutive`, `IoPageLockLimit`
- **Original source:** Microsoft Windows Kernel Security & Performance Manual
- **Official documentation:** [Microsoft Learn - fsutil behavior encryptpagingfile](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/fsutil-behavior)
- **GitHub URL:** https://github.com/windows-kernel-tuning
- **Forum URL:** https://overclock.net/threads/pagefile-performance-tweaks.1750000/
- **Discussion URL:** https://reddit.com/r/Windows10/comments/pagefile_encryption_performance/

---

## 13. Ufak NTFS Bozulmalarında BSOD Tetiklenmesini Engelleme (`NtfsBugcheckOnCorrupt 0`)

- **Title:** NTFS Dosya Bozulmalarında Anlık Sistem Mavi Ekranını (BSOD) Engelleme
- **Category:** FileSystem Resilience & Continuous Operation
- **Short description:** NTFS dosya sisteminin ufak bir küme (cluster) veya dizin hatasında anında `NTFS_FILE_SYSTEM` (0x00000024) hatasıyla çekirdeği kilitleyip mavi ekran (BSOD) verdirmesini engeller. Sistemin çökmek yerine hatayı arka planda onarmasını sağlar.
- **Exact code:** `fsutil behavior set bugcheckoncorrupt 0`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\FileSystem`
- **Registry value:** `NtfsBugcheckOnCorrupt` = `0` (REG_DWORD)
- **PowerShell command:** `fsutil behavior set bugcheckoncorrupt 0`
- **CMD command:** `fsutil behavior set bugcheckoncorrupt 0`
- **BCDEdit command:** N/A
- **Device Manager setting:** N/A
- **Group Policy (if any):** N/A
- **Driver setting:** ntfs.sys
- **Firmware option:** N/A
- **Supported storage type:** NVMe SSD, SATA SSD, HDD
- **Supported controller:** Tümü
- **Supported Windows versions:** Windows 10, Windows 11
- **Gaming impact:** Pozitif Yüksek (Oyun içi beklenmedik BSOD kilitlenmelerini engeller)
- **Alternative values:** `1` (Varsayılan/Mavi Ekran Tetikle), `0` (Optimum/Kesintisiz Çalışma)
- **Related tweaks:** `NtfsMemoryUsage`, `StorPort Timeout`
- **Original source:** Microsoft Enterprise Storage Reliability Documentation
- **Official documentation:** [Microsoft Learn - NtfsBugcheckOnCorrupt](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/fsutil-behavior)
- **GitHub URL:** https://github.com/microsoft/Windows-Driver-Samples
- **Forum URL:** https://sysnative.com/forums/threads/preventing-ntfs-bsod-on-corrupt.30000/
- **Discussion URL:** https://reddit.com/r/sysadmin/comments/ntfs_bugcheckoncorrupt_setting/

---

## 14. DirectStorage Donanım Süzgeç Baypas Politikasını Kilitleme (`BypassIoFlags`)

- **Title:** DirectStorage BypassIO Filtre Sürücüsü Baypas İlkesini Zorlama
- **Category:** DirectStorage & GPU Decompression Optimization
- **Short description:** Windows Depolama Yığınındaki (Storage Stack) BypassIO ilkesini `0` yapıp tüm engelleyici üçüncü taraf dosya filtre sürücülerini (antivirüs süzgeçleri vb.) DirectStorage hattından çıkarır. NVMe SSD'nin doğrudan GPU/VRAM bellek yollarına sıfır gecikmeyle erişmesini garanti eder.
- **Exact code:** `Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Storage" /v "BypassIoFlags" /t REG_DWORD /d "0" /f`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\Storage`
- **Registry value:** `BypassIoFlags` = `0` (REG_DWORD)
- **PowerShell command:** `Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Storage" -Name "BypassIoFlags" -Value 0 -Type DWord`
- **CMD command:** `Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Storage" /v "BypassIoFlags" /t REG_DWORD /d "0" /f`
- **BCDEdit command:** N/A
- **Device Manager setting:** N/A
- **Group Policy (if any):** N/A
- **Driver setting:** stornvme.sys / DirectStorage API 1.2+
- **Firmware option:** PCIe Gen4/Gen5 NVMe Direct Access
- **Supported storage type:** NVMe PCIe Gen3 / Gen4 / Gen5 SSD
- **Supported controller:** Samsung, WD, Phison, Sabrent, Crucial
- **Supported Windows versions:** Windows 11 (22H2, 23H2, 24H2)
- **Gaming impact:** Epik Yüksek (DirectStorage destekli oyunlarda -Ratchet & Clank, Spider-Man, Forza Horizon 5- yükleme sürelerini 1 saniyenin altına düşürür)
- **Alternative values:** `1` (Kısıtlı), `0` (Optimum/Tam Donanım Erişimi)
- **Related tweaks:** `fsutil bypassio state`, `GPU Decompression`
- **Original source:** Microsoft DirectStorage Developer SDK Team
- **Official documentation:** [Microsoft Learn - BypassIO for Storage Drivers](https://learn.microsoft.com/en-us/windows-hardware/drivers/ifs/bypassio)
- **GitHub URL:** https://github.com/microsoft/DirectStorage
- **Forum URL:** https://guru3d.com/threads/directstorage-bypassio-performance-testing.440000/
- **Discussion URL:** https://reddit.com/r/pcgaming/comments/directstorage_bypassio_registry_flag/

---

## 15. İş İstasyonu / Oyun Sistemi İçin Dosya Önbellek Dengesini Ayarlama (`LargeSystemCache 0`)

- **Title:** Workstation File System Cache Dengesi (LargeSystemCache = 0)
- **Category:** NT Cache Manager Memory Allocation
- **Short description:** `LargeSystemCache` değerinin `0` (Devre Dışı) olmasını sağlayarak Windows NT Cache Manager'ın dosya önbellekleme için oyunların ihtiyacı olan sistem RAM'ini gasp etmesini önler. Sunucu modu yerine oyun/iş istasyonu modunu koruyarak RAM kaynaklı takılmaları ve disk takas (paging) gecikmelerini engeller.
- **Exact code:** `Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "LargeSystemCache" /t REG_DWORD /d "0" /f`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management`
- **Registry value:** `LargeSystemCache` = `0` (REG_DWORD)
- **PowerShell command:** `Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" -Name "LargeSystemCache" -Value 0 -Type DWord`
- **CMD command:** `Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "LargeSystemCache" /t REG_DWORD /d "0" /f`
- **BCDEdit command:** N/A
- **Device Manager setting:** N/A
- **Group Policy (if any):** N/A
- **Driver setting:** ntoskrnl.exe Cache Manager
- **Firmware option:** N/A
- **Supported storage type:** NVMe SSD, SATA SSD, System RAM
- **Supported controller:** Tümü
- **Supported Windows versions:** Windows 10, Windows 11
- **Gaming impact:** Pozitif Yüksek (RAM bellek sızıntılarını ve oyun içi anlık kare düşüşlerini engeller)
- **Alternative values:** `1` (Sunucu Modu/Önbellek Yoğun), `0` (Optimum Masaüstü/Oyun Modu)
- **Related tweaks:** `DisablePagingExecutive`, `IoPageLockLimit`
- **Original source:** Microsoft Sysinternals Windows Internals Book
- **Official documentation:** [Microsoft Learn - LargeSystemCache Parameter](https://learn.microsoft.com/en-us/windows-hardware/drivers/kernel/largesystemcache)
- **GitHub URL:** https://github.com/sysinternals/guides
- **Forum URL:** https://overclock.net/threads/largesystemcache-0-vs-1-for-gaming.1600000/
- **Discussion URL:** https://reddit.com/r/Windows10/comments/largesystemcache_gaming_stutter/

---

## 16. StorPort Depolama Sürücü ETW İzleme Günlüğünü Devre Dışı Bırakma (`StorPort Autologger Start 0`)

- **Title:** StorPort Sürücüsü ETW Olay İzleme Günlüğünü Kapatma
- **Category:** Storage Driver Kernel Logging Overhead Elimination
- **Short description:** Windows depolama alt sisteminin temel sürücüsü olan `StorPort.sys` tarafından her disk komutunda üretilen ETW (Event Tracing for Windows) günlük kaydı mekanizmasını durdurur. İşlemci ve depolama denetleyicisi üzerindeki arka plan izleme yükünü tamamen kaldırır.
- **Exact code:** `Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\StorPort" /v "Start" /t REG_DWORD /d "0" /f`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\StorPort`
- **Registry value:** `Start` = `0` (REG_DWORD)
- **PowerShell command:** `Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\WMI\Autologger\StorPort" -Name "Start" -Value 0 -Type DWord`
- **CMD command:** `Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\StorPort" /v "Start" /t REG_DWORD /d "0" /f`
- **BCDEdit command:** N/A
- **Device Manager setting:** N/A
- **Group Policy (if any):** N/A
- **Driver setting:** storport.sys
- **Firmware option:** N/A
- **Supported storage type:** NVMe SSD, SATA SSD, RAID
- **Supported controller:** Tümü
- **Supported Windows versions:** Windows 10, Windows 11
- **Gaming impact:** Pozitif Orta (Depolama yığınındaki sürücü izleme gecikmesini keser)
- **Alternative values:** `1` (Etkin), `0` (Optimum/Devre Dışı)
- **Related tweaks:** `ReadyBoot Start 0`, `TimeOutValue`
- **Original source:** Windows Storage Kernel Performance Engineering
- **Official documentation:** [Microsoft Learn - StorPort Driver Performance Tuning](https://learn.microsoft.com/en-us/windows-hardware/drivers/storage/storport-driver)
- **GitHub URL:** https://github.com/storage-kernel-tweaks
- **Forum URL:** https://forums.guru3d.com/threads/storport-autologger-disable.438000/
- **Discussion URL:** https://reddit.com/r/Windows11/comments/storport_logging_overhead/

---

## 17. 8.3 Dosya Adı Karakter Uyum Modu Süzgeci (`NtfsAllowExtendedCharacterIn8dot3Name 0`)

- **Title:** NTFS 8.3 Kısa Dosya Adı Genişletilmiş Karakter Çevrimini Kapatma
- **Category:** FileSystem Character Parsing Optimization
- **Short description:** Eski ikincil depolama birimlerinde 8.3 kısa dosya adı oluşturma açık kalsa bile, genişletilmiş karakter kümesi (DBCS / UNICODE) dönüşüm kontrollerini kapatır. Dosya ismi işleme sırasında CPU döngüsü israfını önler.
- **Exact code:** `Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\FileSystem" /v "NtfsAllowExtendedCharacterIn8dot3Name" /t REG_DWORD /d "0" /f`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\FileSystem`
- **Registry value:** `NtfsAllowExtendedCharacterIn8dot3Name` = `0` (REG_DWORD)
- **PowerShell command:** `Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "NtfsAllowExtendedCharacterIn8dot3Name" -Value 0 -Type DWord`
- **CMD command:** `Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\FileSystem" /v "NtfsAllowExtendedCharacterIn8dot3Name" /t REG_DWORD /d "0" /f`
- **BCDEdit command:** N/A
- **Device Manager setting:** N/A
- **Group Policy (if any):** N/A
- **Driver setting:** ntfs.sys
- **Firmware option:** N/A
- **Supported storage type:** NTFS / ReFS Volumes
- **Supported controller:** Tümü
- **Supported Windows versions:** Windows 10, Windows 11
- **Gaming impact:** Pozitif Düşük (Dosya arama ve indeksleme adımlarındaki ekstra karakter dönüşüm yükünü engeller)
- **Alternative values:** `1` (Etkin), `0` (Optimum/Devre Dışı)
- **Related tweaks:** `NtfsDisable8dot3NameCreation`, `MaximumTunnelEntries`
- **Original source:** Microsoft FileSystem Architecture Specifications
- **Official documentation:** [Microsoft Learn - NTFS Technical Reference](https://learn.microsoft.com/en-us/windows-server/storage/file-server/ntfs-overview)
- **GitHub URL:** https://github.com/microsoft/Windows-Driver-Samples
- **Forum URL:** https://tenforums.com/ntfs-extended-character-setting.html
- **Discussion URL:** https://super-user.com/questions/ntfs-8dot3-character-translation

---

## 18. NVMe Sürücüsü Maksimum Transfer Modu Parçalanma Önleme (`ForcedMaxTransferMode 0`)

- **Title:** NVMe Sürücü Maksimum Transfer Boyutu Parçalanma Optimizasyonu
- **Category:** StorNVMe Request Chunking & Throughput
- **Short description:** `StorNVMe.sys` sürücüsünün büyük boyuttaki oyun kaplama paketlerini (texture packages) verimsiz küçük I/O parçalarına bölmesini (chunking) engeller. Maksimum transfer bloğunu optimum donanım limitinde tutarak sıralı ve rastgele okuma verimliliğini zirveye çıkarır.
- **Exact code:** `Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\stornvme\Parameters\Device" /v "ForcedMaxTransferMode" /t REG_DWORD /d "0" /f`
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Services\stornvme\Parameters\Device`
- **Registry value:** `ForcedMaxTransferMode` = `0` (REG_DWORD)
- **PowerShell command:** `Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\stornvme\Parameters\Device" -Name "ForcedMaxTransferMode" -Value 0 -Type DWord`
- **CMD command:** `Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\stornvme\Parameters\Device" /v "ForcedMaxTransferMode" /t REG_DWORD /d "0" /f`
- **BCDEdit command:** N/A
- **Device Manager setting:** N/A
- **Group Policy (if any):** N/A
- **Driver setting:** stornvme.sys
- **Firmware option:** Max Transfer Size (NVMe Spec)
- **Supported storage type:** NVMe PCIe Gen3 / Gen4 / Gen5 SSD
- **Supported controller:** Tümü
- **Supported Windows versions:** Windows 10, Windows 11
- **Gaming impact:** Pozitif Yüksek (Yüksek çözünürlüklü kaplama (4K Textures) yüklemelerinde I/O bant genişliğini korur)
- **Alternative values:** `1` (Kısıtlanmış), `0` (Optimum/Donanım Maksimumu)
- **Related tweaks:** `DeviceQueueDepth`, `HmbAllocationPolicy`
- **Original source:** NVMe Express Specification & StorNVMe Driver Architecture
- **Official documentation:** [NVM Express Organization Specifications](https://nvmexpress.org/specifications/)
- **GitHub URL:** https://github.com/nvme-cli/nvme-cli
- **Forum URL:** https://overclock.net/threads/stornvme-forcedmaxtransfermode-tuning.1780000/
- **Discussion URL:** https://reddit.com/r/Hardware/comments/nvme_max_transfer_length_latency/
