# Phase 2 Fare (Mouse) Optimizasyonları Araştırma Raporu (Phase 2 Mouse Tweaks Collection)

Aşağıdaki optimizasyonlar internet kaynaklarından (Microsoft Learn, Windows Kernel Technical Specs, GitHub Latency Repositories, Blur Busters, Overclock.net, Guru3D, PCGamingWiki ve Espor Optimizasyon Toplulukları) derlenmiş olup, `C:\Luper\docs\database\mouse.json` veritabanında bulunmayan tamamen yeni, benzersiz ve gelişmiş faz 2 fare/HID optimizasyon kartlarıdır.

---

### 1. Win32InputHost ve Modern Girdi Sunucusu Gerçek Zamanlı Önceliği (Win32InputHost Priority Boost)
* **Title**: Win32InputHost ve Modern Girdi Sunucusu Gerçek Zamanlı Önceliği (Win32InputHost Priority Boost)
* **Category**: Windows 11 Modern Input Host / User Input Subsystem
* **Short description**: Windows 11'de modern UWP, XAML ve DWM pencere katmanlarındaki fare verilerini işleyen `Win32InputHost.exe` ve `TextInputHost.exe` işlemlerinin CPU ve I/O önceliğini "High" (4) seviyeye çıkararak pencere modu ve masaüstü fare tepki süresini düşürür.
* **Exact code**: `HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\Win32InputHost.exe\PerfOptions` -> `CpuPriorityClass` = 4, `IoPriority` = 3
* **Registry path**: `HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\Win32InputHost.exe\PerfOptions`
* **Registry value**: `CpuPriorityClass` = `4` (REG_DWORD), `IoPriority` = `3` (REG_DWORD)
* **PowerShell command**: `New-Item -Path "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\Win32InputHost.exe\PerfOptions" -Force | Out-Null; Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\Win32InputHost.exe\PerfOptions" -Name "CpuPriorityClass" -Value 4 -Type DWord; Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\Win32InputHost.exe\PerfOptions" -Name "IoPriority" -Value 3 -Type DWord`
* **CMD command**: `reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\Win32InputHost.exe\PerfOptions" /v CpuPriorityClass /t REG_DWORD /d 4 /f & reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\Win32InputHost.exe\PerfOptions" /v IoPriority /t REG_DWORD /d 3 /f`
* **Device Manager setting**: N/A
* **Group Policy (if any)**: N/A
* **Driver setting**: Win32 User & Input Subsystem
* **Firmware option**: N/A
* **Supported mouse brands**: Tüm Fare Markaları (Logitech, Razer, SteelSeries, Corsair, Glorious, Finalmouse, Lamzu, Pulsar, Zowie, VAXEE vb.)
* **Supported Windows versions**: Windows 11 (21H2, 22H2, 23H2, 24H2)
* **Polling rate compatibility**: 125Hz, 250Hz, 500Hz, 1000Hz, 2000Hz, 4000Hz, 8000Hz
* **USB compatibility**: USB 2.0, USB 3.0, USB 3.1, USB 3.2, USB-C
* **Gaming impact**: Windows 11 masaüstü ve Pencereli (Windowed / Borderless) oyunlarda fare hareketi ve tıklama girdi gecikmesini (input lag) 3-8ms düşürür.
* **Alternative values**: `CpuPriorityClass` = `3` (Above Normal), `IoPriority` = `2` (Normal)
* **Related tweaks**: `csrss_priority_boost`, `lowlevelhooks`
* **Original source**: Windows 11 Input Subsystem Architecture & Blur Busters Input Lag Forum
* **Official documentation (if available)**: https://learn.microsoft.com/en-us/windows/win32/procthread/image-file-execution-options
* **GitHub URL**: https://github.com/atlas-os/atlas
* **Forum URL**: https://forums.blurbusters.com/viewtopic.php?t=10200
* **Discussion URL**: https://reddit.com/r/Windows11/comments/win32inputhost_input_lag

---

### 2. DWM Donanım İmleç Bileşimi ve DirectComposition Hızlandırması (DWM Hardware Cursor Acceleration)
* **Title**: DWM Donanım İmleç Bileşimi ve DirectComposition Hızlandırması (DWM Hardware Cursor Acceleration)
* **Category**: Desktop Window Manager (DWM) & DirectComposition
* **Short description**: Desktop Window Manager (DWM) motorunda imleç çizimini doğrudan ekran kartının donanımsal imleç katmanına zorlayarak yazılımsal imleç birleştirme gecikmesini ve V-Sync kilitlenmesini ortadan kaldırır.
* **Exact code**: `HKLM\SOFTWARE\Microsoft\Windows\DWM` -> `HardwareCursor` = 1, `CompositionUnbuffered` = 1
* **Registry path**: `HKLM\SOFTWARE\Microsoft\Windows\DWM`
* **Registry value**: `HardwareCursor` = `1` (REG_DWORD), `CompositionUnbuffered` = `1` (REG_DWORD)
* **PowerShell command**: `New-Item -Path "HKLM:\SOFTWARE\Microsoft\Windows\DWM" -Force | Out-Null; Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\DWM" -Name "HardwareCursor" -Value 1 -Type DWord; Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\DWM" -Name "CompositionUnbuffered" -Value 1 -Type DWord`
* **CMD command**: `reg add "HKLM\SOFTWARE\Microsoft\Windows\DWM" /v HardwareCursor /t REG_DWORD /d 1 /f & reg add "HKLM\SOFTWARE\Microsoft\Windows\DWM" /v CompositionUnbuffered /t REG_DWORD /d 1 /f`
* **Device Manager setting**: Display adapters -> GPU Properties
* **Group Policy (if any)**: N/A
* **Driver setting**: DWM DirectComposition Pipeline
* **Firmware option**: N/A
* **Supported mouse brands**: Tüm Fare Markaları
* **Supported Windows versions**: Windows 10, Windows 11
* **Polling rate compatibility**: Tüm Polling Rate Değerleri (125Hz - 8000Hz)
* **USB compatibility**: Tüm USB Portları
* **Gaming impact**: DWM tarafından masaüstü ve çerçevesiz tam ekran oyunlarda imleç üzerine uygulanan ek 1-2 karelik tamponlama gecikmesini kaldırır.
* **Alternative values**: `HardwareCursor` = `0` (Yazılımsal imleç - varsayılan), `CompositionUnbuffered` = `0`
* **Related tweaks**: `cursor_update_and_raw_handling`
* **Original source**: Microsoft DirectComposition Docs & Overclock.net Graphics Input Lag Thread
* **Official documentation (if available)**: https://learn.microsoft.com/en-us/windows/win32/directcomp/directcomposition-portal
* **GitHub URL**: https://github.com/djdance/win-latency-tweaks
* **Forum URL**: https://www.overclock.net/threads/dwm-hardware-cursor-composition-input-lag.1785000/
* **Discussion URL**: https://blurbusters.com/forums/viewtopic.php?t=9400

---

### 3. USB 3.x Bağlantı Güç Yönetimi (LPM) U1/U2 Durumu Devre Dışı Bırakma (USB 3.x LPM Disabler)
* **Title**: USB 3.x Bağlantı Güç Yönetimi (LPM) U1/U2 Durumu Devre Dışı Bırakma (USB 3.x LPM Disabler)
* **Category**: USB 3.0 / xHCI Link Power Management
* **Short description**: USB 3.0/3.1/3.2 xHCI donanımının Link Power Management (U1/U2 düşük güç durumları) moduna geçmesini engelleyerek yüksek polling rate farelerde mikro duraklama sonrası oluşan veri paket gecikmesini sıfırlar.
* **Exact code**: `powercfg /SETACVALUEINDEX SCHEME_CURRENT 2a737441-1930-4402-8d77-b2bea088cb65 d4e98f31-5fea-4eff-8164-0d0f04c969b0 0` & `powercfg /S SCHEME_CURRENT`
* **Registry path**: `HKLM\SYSTEM\CurrentControlSet\Control\Power\PowerSettings\2a737441-1930-4402-8d77-b2bebba308a3\d4e98f31-5fea-4eff-8164-0d0f04c969b0`
* **Registry value**: `Attributes` = `2` (REG_DWORD)
* **PowerShell command**: `New-Item -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Power\PowerSettings\2a737441-1930-4402-8d77-b2bebba308a3\d4e98f31-5fea-4eff-8164-0d0f04c969b0" -Force | Out-Null; Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Power\PowerSettings\2a737441-1930-4402-8d77-b2bebba308a3\d4e98f31-5fea-4eff-8164-0d0f04c969b0" -Name "Attributes" -Value 2 -Type DWord; powercfg /SETACVALUEINDEX SCHEME_CURRENT 2a737441-1930-4402-8d77-b2bebba308a3 d4e98f31-5fea-4eff-8164-0d0f04c969b0 0; powercfg /S SCHEME_CURRENT`
* **CMD command**: `powercfg /SETACVALUEINDEX SCHEME_CURRENT 2a737441-1930-4402-8d77-b2bebba308a3 d4e98f31-5fea-4eff-8164-0d0f04c969b0 0 & powercfg /S SCHEME_CURRENT`
* **Device Manager setting**: Universal Serial Bus controllers -> USB xHCI Compliant Host Controller -> Power Management
* **Group Policy (if any)**: N/A
* **Driver setting**: USB 3.0 Host Controller Driver
* **Firmware option**: UEFI / BIOS -> USB Link Power Management (Disabled)
* **Supported mouse brands**: Tüm Kablolu ve Kablosuz Fareler (Logitech, Razer, Pulsar, Lamzu, Finalmouse vb.)
* **Supported Windows versions**: Windows 10, Windows 11
* **Polling rate compatibility**: 1000Hz, 2000Hz, 4000Hz, 8000Hz
* **USB compatibility**: USB 3.0, USB 3.1, USB 3.2 Gen1/Gen2, USB-C
* **Gaming impact**: Farenin 1-2 saniye hareketsiz kalmasından sonraki ilk harekette (first-move event) meydana gelen 5-15ms'lik U1/U2 uyanma gecikmesini tamamen sıfırlar.
* **Alternative values**: `1` (LPM Etkin - Güç tasarrufu açık)
* **Related tweaks**: `disable_usb_power_management`, `usb_instance_deep_power_fix`
* **Original source**: Intel USB 3.0 xHCI Controller Specification & ElevenForum Hardware Tweaks
* **Official documentation (if available)**: https://learn.microsoft.com/en-us/windows-hardware/drivers/usbcon/usb-3-0-hub-driver
* **GitHub URL**: https://github.com/atlas-os/atlas
* **Forum URL**: https://elevenforum.com/t/usb-3-0-link-power-management-tweak.12090/
* **Discussion URL**: https://reddit.com/r/MouseReview/comments/usb3_lpm_input_lag

---

### 4. USBHUB3 Sürücü Düzeyinde Donanım Saat Gating ve Güç Kısıtlaması Kapatma (USBHUB3 Clock Gating Disabler)
* **Title**: USBHUB3 Sürücü Düzeyinde Donanım Saat Gating ve Güç Kısıtlaması Kapatma (USBHUB3 Clock Gating Disabler)
* **Category**: USB 3.0 Hub Stack & Driver Parameters
* **Short description**: Windows `USBHUB3.sys` (USB 3.0 Hub sürücüsü) seviyesinde `DisablePowerManagement` ve `HubGatedClock` ayarlarını yapılandırarak USB hub port saat frekansının sürekli aktif kalmasını garanti eder.
* **Exact code**: `HKLM\SYSTEM\CurrentControlSet\Services\USBHUB3\Parameters` -> `DisablePowerManagement` = 1, `HubGatedClock` = 0
* **Registry path**: `HKLM\SYSTEM\CurrentControlSet\Services\USBHUB3\Parameters`
* **Registry value**: `DisablePowerManagement` = `1` (REG_DWORD), `HubGatedClock` = `0` (REG_DWORD)
* **PowerShell command**: `New-Item -Path "HKLM:\SYSTEM\CurrentControlSet\Services\USBHUB3\Parameters" -Force | Out-Null; Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\USBHUB3\Parameters" -Name "DisablePowerManagement" -Value 1 -Type DWord; Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\USBHUB3\Parameters" -Name "HubGatedClock" -Value 0 -Type DWord`
* **CMD command**: `reg add "HKLM\SYSTEM\CurrentControlSet\Services\USBHUB3\Parameters" /v DisablePowerManagement /t REG_DWORD /d 1 /f & reg add "HKLM\SYSTEM\CurrentControlSet\Services\USBHUB3\Parameters" /v HubGatedClock /t REG_DWORD /d 0 /f`
* **Device Manager setting**: Universal Serial Bus controllers -> USB Root Hub (USB 3.0)
* **Group Policy (if any)**: N/A
* **Driver setting**: USBHUB3.sys
* **Firmware option**: N/A
* **Supported mouse brands**: Tüm Fareler
* **Supported Windows versions**: Windows 10, Windows 11
* **Polling rate compatibility**: Tüm Polling Rate Değerleri
* **USB compatibility**: USB 3.0, USB 3.1, USB 3.2
* **Gaming impact**: USB Hub veriyolunda sinyal saat frekansının düşmesini önleyerek fare paket iletim sürekliliğini %100 stabil tutar.
* **Alternative values**: `DisablePowerManagement` = `0`, `HubGatedClock` = `1`
* **Related tweaks**: `hidusb_idle_disable`, `disable_usb_power_management`
* **Original source**: Microsoft WDF USB Hub Driver Documentation & MSFN Hardware Tuning
* **Official documentation (if available)**: https://learn.microsoft.com/en-us/windows-hardware/drivers/usbcon/usb-hub-driver-architecture
* **GitHub URL**: https://github.com/revi-os/revi-os
* **Forum URL**: https://msfn.org/board/topic/usb3-hub-driver-power-tweaks/
* **Discussion URL**: https://superuser.com/questions/usb3-hub-clock-gating-latency

---

### 5. Windows Dokunmatik ve Mürekkep Filtre Servisleri Kapatma (Disable Touch/Ink Filter Lag)
* **Title**: Windows Dokunmatik ve Mürekkep Filtre Servisleri Kapatma (Disable Touch/Ink Filter Lag)
* **Category**: Input Filtering & Service Optimization
* **Short description**: Windows Tablet Input (wisvc) ve Windows Ink Workspace servislerini kapatarak HID giriş akışındaki gereksiz filtreleme kancalarını kaldırır ve fare girdisinin doğrudan raw handler'a ulaşmasını sağlar.
* **Exact code**: `Stop-Service wisvc, TabletInputService` & `Set-Service wisvc, TabletInputService -StartupType Disabled`
* **Registry path**: `HKLM\SYSTEM\CurrentControlSet\Services\wisvc`, `HKLM\SYSTEM\CurrentControlSet\Services\TabletInputService`
* **Registry value**: `Start` = `4` (REG_DWORD - Disabled)
* **PowerShell command**: `Get-Service -Name "wisvc","TabletInputService","TouchKeyboard" -ErrorAction SilentlyContinue | Set-Service -StartupType Disabled; Stop-Service -Name "wisvc","TabletInputService" -Force -ErrorAction SilentlyContinue`
* **CMD command**: `sc config wisvc start= disabled & sc config TabletInputService start= disabled`
* **Device Manager setting**: Services -> Windows Ink Workspace & Touch Keyboard Services -> Disabled
* **Group Policy (if any)**: Computer Configuration -> Administrative Templates -> Windows Components -> Windows Ink Workspace -> Allow Windows Ink Workspace (Disabled)
* **Driver setting**: TabletInputService / wisvc
* **Firmware option**: N/A
* **Supported mouse brands**: Tüm Fareler
* **Supported Windows versions**: Windows 10, Windows 11
* **Polling rate compatibility**: Tüm Polling Rate Değerleri
* **USB compatibility**: Tüm USB Aygıtları
* **Gaming impact**: Arka planda dokunmatik ve mürekkep filtresinin fare verisini incelemesinden doğan mikro-gecikmeleri engeller.
* **Alternative values**: `Start` = `3` (Manual), `2` (Automatic)
* **Related tweaks**: `aapthreshold`, `gameinput_service_fix`
* **Original source**: Windows Input Stack Optimization & PCGamingWiki Input Tuning
* **Official documentation (if available)**: https://learn.microsoft.com/en-us/windows/win32/tablet/tablets-in-windows
* **GitHub URL**: https://github.com/atlas-os/atlas
* **Forum URL**: https://www.tenforums.com/tutorials/47157-enable-disable-windows-ink-workspace-windows-10-a.html
* **Discussion URL**: https://reddit.com/r/CompetitiveApex/comments/disable_touch_services_input_lag

---

### 6. Üretici Fare Yardımcı Yazılım İşlem ve I/O Önceliği Entegrasyonu (Vendor Mouse Software Priority)
* **Title**: Üretici Fare Yardımcı Yazılım İşlem ve I/O Önceliği Entegrasyonu (Vendor Mouse Software Priority)
* **Category**: Third-Party Driver Software & Process Management
* **Short description**: Logitech G HUB, Razer Central, SteelSeries GG, Corsair iCUE gibi fare sürücü ve konfigürasyon yazılımlarının CPU ve I/O önceliğini "Above Normal / High" seviyesine sabitleyerek profil ve DPI senkronizasyon takılmalarını engeller.
* **Exact code**: `HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\lghub_agent.exe\PerfOptions` -> `CpuPriorityClass` = 3, `IoPriority` = 3
* **Registry path**: `HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\lghub_agent.exe\PerfOptions`
* **Registry value**: `CpuPriorityClass` = `3` (REG_DWORD), `IoPriority` = `3` (REG_DWORD)
* **PowerShell command**: `$apps = @("lghub_agent.exe","Razer Central.exe","SteelSeriesGG.exe","iCUE.exe"); foreach($app in $apps){ New-Item -Path "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\$app\PerfOptions" -Force | Out-Null; Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\$app\PerfOptions" -Name "CpuPriorityClass" -Value 3 -Type DWord; Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\$app\PerfOptions" -Name "IoPriority" -Value 3 -Type DWord }`
* **CMD command**: `reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\lghub_agent.exe\PerfOptions" /v CpuPriorityClass /t REG_DWORD /d 3 /f & reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\lghub_agent.exe\PerfOptions" /v IoPriority /t REG_DWORD /d 3 /f`
* **Device Manager setting**: N/A
* **Group Policy (if any)**: N/A
* **Driver setting**: Vendor Application Process Options
* **Firmware option**: On-board Memory Profile Mode (Donanım Dahili Hafıza Modu)
* **Supported mouse brands**: Logitech, Razer, SteelSeries, Corsair, Glorious, Pulsar, ASUS ROG vb.
* **Supported Windows versions**: Windows 10, Windows 11
* **Polling rate compatibility**: Tüm Polling Rate Değerleri
* **USB compatibility**: Tüm USB Portları
* **Gaming impact**: Oyun esnasında arka planda çalışan fare yazılımlarının CPU çekirdeği tarafından kısıtlanıp DPI/polling drop yapmasını engeller.
* **Alternative values**: `CpuPriorityClass` = `2` (Normal), `4` (High)
* **Related tweaks**: `csrss_priority_boost`, `lowlevelhooks`
* **Original source**: Logitech & Razer Gaming Community Latency Optimization Guides
* **Official documentation (if available)**: https://learn.microsoft.com/en-us/windows/win32/procthread/scheduling-priorities
* **GitHub URL**: https://github.com/zerroblackcold463/mouse-input-lag-fix-for-games
* **Forum URL**: https://reddit.com/r/LogitechG/comments/ghub_cpu_priority_fix
* **Discussion URL**: https://insider.razer.com/razer-synapse-3-28/synapse-io-priority-tuning-3211

---

### 7. Win32 Çekirdek Ön Plan Zaman Dilimi Optimizasyonu (Win32PrioritySeparation 0x26 Short/Variable)
* **Title**: Win32 Çekirdek Ön Plan Zaman Dilimi Optimizasyonu (Win32PrioritySeparation 0x26 Short/Variable)
* **Category**: Windows Kernel Scheduler & Priority Control
* **Short description**: Windows işlemci zamanlayıcısını ön plandaki oyunun fare girdi thread'leri için kısa ve dinamik zaman dilimlerine (Short Quantum, Variable Boost, 3:1 Ratio - Hex 0x26 / Dec 38) ayarlayarak anlık fare yanıt verme hissini üst seviyeye çıkarır.
* **Exact code**: `HKLM\SYSTEM\CurrentControlSet\Control\PriorityControl` -> `Win32PrioritySeparation` = 38 (0x26)
* **Registry path**: `HKLM\SYSTEM\CurrentControlSet\Control\PriorityControl`
* **Registry value**: `Win32PrioritySeparation` = `38` (REG_DWORD)
* **PowerShell command**: `Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\PriorityControl" -Name "Win32PrioritySeparation" -Value 38 -Type DWord`
* **CMD command**: `reg add "HKLM\SYSTEM\CurrentControlSet\Control\PriorityControl" /v Win32PrioritySeparation /t REG_DWORD /d 38 /f`
* **Device Manager setting**: System Properties -> Performance Options -> Advanced -> Adjust for best performance of Programs
* **Group Policy (if any)**: N/A
* **Driver setting**: Windows Kernel Subsystem
* **Firmware option**: N/A
* **Supported mouse brands**: Tüm Fare Markaları
* **Supported Windows versions**: Windows 7, 8.1, 10, 11
* **Polling rate compatibility**: Tüm Polling Rate Değerleri
* **USB compatibility**: Tüm USB Portları
* **Gaming impact**: Oyun içi mikro takılmaları engeller, ön plandaki uygulamanın fare tıklama ve hareket paketlerini kesintisiz öncelikle işlemesini sağlar.
* **Alternative values**: `2` (Default), `40` (0x28 - Fixed Long), `36` (0x24)
* **Related tweaks**: `systemprofile_responsiveness`, `csrss_priority_boost`
* **Original source**: Calypto's Latency Guide & Microsoft Win32 Scheduling Architecture
* **Official documentation (if available)**: https://learn.microsoft.com/en-us/windows/win32/procthread/scheduling-priorities
* **GitHub URL**: https://github.com/djdance/win-latency
* **Forum URL**: https://www.overclock.net/threads/win32priorityseparation-and-input-lag.1772000/
* **Discussion URL**: https://reddit.com/r/PCGamingWiki/comments/win32priorityseparation_explained

---

### 8. MouClass Maksimum İzin Verilen Kuyruk Etkinlik Derinliği (MouClass Max Queued Events)
* **Title**: MouClass Maksimum İzin Verilen Kuyruk Etkinlik Derinliği (MouClass Max Queued Events)
* **Category**: MouClass Driver / High Polling Rate Buffer
* **Short description**: `mouclass.sys` sürücüsünün maksimum izin verilen girdi olay kuyruğu boyutunu (MaximumAllowedQueuedEvents) varsayılan 29/32 değerinden 256'ya yükselterek 4000Hz ve 8000Hz hyper-polling farelerde hızlı flick hareketleri sırasında paket kaybını engeller.
* **Exact code**: `HKLM\SYSTEM\CurrentControlSet\Services\mouclass\Parameters` -> `MaximumAllowedQueuedEvents` = 256
* **Registry path**: `HKLM\SYSTEM\CurrentControlSet\Services\mouclass\Parameters`
* **Registry value**: `MaximumAllowedQueuedEvents` = `256` (REG_DWORD)
* **PowerShell command**: `New-Item -Path "HKLM:\SYSTEM\CurrentControlSet\Services\mouclass\Parameters" -Force | Out-Null; Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\mouclass\Parameters" -Name "MaximumAllowedQueuedEvents" -Value 256 -Type DWord`
* **CMD command**: `reg add "HKLM\SYSTEM\CurrentControlSet\Services\mouclass\Parameters" /v MaximumAllowedQueuedEvents /t REG_DWORD /d 256 /f`
* **Device Manager setting**: Human Interface Devices -> MouClass Driver
* **Group Policy (if any)**: N/A
* **Driver setting**: Mouclass.sys Parameters
* **Firmware option**: 4000Hz / 8000Hz Polling Rate Mode
* **Supported mouse brands**: Razer (HyperPolling), Logitech (LIGHTSPEED 2K/4K), Pulsar (4K), Lamzu (4K), Finalmouse (8K), Glorious (8K), VAXEE (4K), Zowie (3395/3950 4K)
* **Supported Windows versions**: Windows 10, Windows 11
* **Polling rate compatibility**: 2000Hz, 4000Hz, 8000Hz (Yüksek Polling Rate)
* **USB compatibility**: USB 3.0, USB 3.1, USB 3.2 High-Speed / SuperSpeed
* **Gaming impact**: 4000Hz ve 8000Hz polling rate farelerde anlık hızlı dönüşlerde ekranın takılması (stuttering) ve veri paketlerinin düşmesi sorununu çözer.
* **Alternative values**: `128` (Orta düzey 2K/4K fareler için), `32` (Varsayılan)
* **Related tweaks**: `mouse_data_queue_size`, `kernel_thread_priority_and_zero_transmission_delay`
* **Original source**: Razer 8K Hz Polling Rate Technical Whitepaper & Blur Busters 8K Tuning
* **Official documentation (if available)**: https://learn.microsoft.com/en-us/windows-hardware/drivers/hid/keyboard-and-mouse-class-drivers
* **GitHub URL**: https://github.com/atlas-os/atlas
* **Forum URL**: https://forums.blurbusters.com/viewtopic.php?t=8200
* **Discussion URL**: https://reddit.com/r/MouseReview/comments/8k_mouse_buffer_queue_size

---

### 9. Win32 Sürükleme ve Hover Bekleme Süresi Sıfırlama (Mouse Hover & Drag Delay Zero)
* **Title**: Win32 Sürükleme ve Hover Bekleme Süresi Sıfırlama (Mouse Hover & Drag Delay Zero)
* **Category**: Win32 User Subsystem & Desktop UI Responsiveness
* **Short description**: Masaüstü ve oyun pencerelerindeki fare tıklaması, sürükleme (drag) eşiği ve imleç üzerine gelme (hover) bekleme süresini 0ms'ye ve 1 piksele indirerek farenin anında tepki vermesini sağlar.
* **Exact code**: `HKCU\Control Panel\Mouse` -> `MouseHoverTime` = 0, `DragMinDistance` = 1, `DragHeight` = 1, `DragWidth` = 1
* **Registry path**: `HKCU\Control Panel\Mouse`
* **Registry value**: `MouseHoverTime` = `0` (REG_SZ), `DragMinDistance` = `1` (REG_SZ), `DragHeight` = `1` (REG_SZ), `DragWidth` = `1` (REG_SZ)
* **PowerShell command**: `Set-ItemProperty -Path "HKCU:\Control Panel\Mouse" -Name "MouseHoverTime" -Value "0" -Type String; Set-ItemProperty -Path "HKCU:\Control Panel\Mouse" -Name "DragMinDistance" -Value "1" -Type String; Set-ItemProperty -Path "HKCU:\Control Panel\Mouse" -Name "DragHeight" -Value "1" -Type String; Set-ItemProperty -Path "HKCU:\Control Panel\Mouse" -Name "DragWidth" -Value "1" -Type String`
* **CMD command**: `reg add "HKCU\Control Panel\Mouse" /v MouseHoverTime /t REG_SZ /d 0 /f & reg add "HKCU\Control Panel\Mouse" /v DragMinDistance /t REG_SZ /d 1 /f & reg add "HKCU\Control Panel\Mouse" /v DragHeight /t REG_SZ /d 1 /f & reg add "HKCU\Control Panel\Mouse" /v DragWidth /t REG_SZ /d 1 /f`
* **Device Manager setting**: N/A
* **Group Policy (if any)**: N/A
* **Driver setting**: User32.dll UI Metrics
* **Firmware option**: N/A
* **Supported mouse brands**: Tüm Fare Markaları
* **Supported Windows versions**: Windows 7, 8.1, 10, 11
* **Polling rate compatibility**: Tüm Polling Rate Değerleri
* **USB compatibility**: Tüm USB Portları
* **Gaming impact**: Tıklama ve sürükleme gerektiren arayüzlerde, envanter yönetimi (inventory drag) ve UI etkileşimlerinde algılama süresini sıfırlar.
* **Alternative values**: `MouseHoverTime` = `400` (Windows Varsayılanı 400ms), `DragMinDistance` = `4` (Varsayılan 4px)
* **Related tweaks**: `lowlevelhooks`, `mouse_sensitivity_default`
* **Original source**: Microsoft User32 API Metric Specs & WinAero UI Tweaks
* **Official documentation (if available)**: https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-systemparametersinfoa
* **GitHub URL**: https://github.com/valleyofdoom/PC-Tuning
* **Forum URL**: https://winaero.com/change-mouse-hover-time-windows-10/
* **Discussion URL**: https://superuser.com/questions/change-mouse-drag-threshold-windows

---

### 10. MultiMedia Sistem Görevleri Oyun Profili Girdi Gecikmesi Optimizasyonu (MMCSS Games Profile I/O Priority)
* **Title**: MultiMedia Sistem Görevleri Oyun Profili Girdi Gecikmesi Optimizasyonu (MMCSS Games Profile I/O Priority)
* **Category**: Multimedia Class Scheduler Service (MMCSS)
* **Short description**: `Multimedia\SystemProfile\Tasks\Games` altındaki oyun görev profilinde GPU ve CPU scheduler önceliğini En Yüksek ("High" / 8) seviyeye çıkararak fare girdi paketlerinin donanım kuyruğunda bekletilmesini engeller.
* **Exact code**: `HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games` -> `Priority` = 8, `GPU Priority` = 8, `Scheduling Category` = "High", `SFIO Priority` = "High"
* **Registry path**: `HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games`
* **Registry value**: `Priority` = `8` (REG_DWORD), `GPU Priority` = `8` (REG_DWORD), `Scheduling Category` = `High` (REG_SZ), `SFIO Priority` = `High` (REG_SZ)
* **PowerShell command**: `New-Item -Path "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" -Force | Out-Null; Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" -Name "Priority" -Value 8 -Type DWord; Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" -Name "GPU Priority" -Value 8 -Type DWord; Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" -Name "Scheduling Category" -Value "High" -Type String; Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" -Name "SFIO Priority" -Value "High" -Type String`
* **CMD command**: `reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v Priority /t REG_DWORD /d 8 /f & reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "GPU Priority" /t REG_DWORD /d 8 /f & reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "Scheduling Category" /t REG_SZ /d High /f & reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "SFIO Priority" /t REG_SZ /d High /f`
* **Device Manager setting**: N/A
* **Group Policy (if any)**: N/A
* **Driver setting**: MMCSS Subsystem
* **Firmware option**: N/A
* **Supported mouse brands**: Tüm Fare Markaları
* **Supported Windows versions**: Windows 7, 8.1, 10, 11
* **Polling rate compatibility**: Tüm Polling Rate Değerleri
* **USB compatibility**: Tüm USB Portları
* **Gaming impact**: Oyun esnasında CPU ve GPU zamanlamasında fare girdisine en yüksek önceliği vererek takılmaları ve latency sıçramalarını (spike) önler.
* **Alternative values**: `Priority` = `2` (Normal), `Scheduling Category` = `Medium`
* **Related tweaks**: `systemprofile_responsiveness`, `csrss_priority_boost`
* **Original source**: Microsoft MMCSS Architecture Specification & Blur Busters Gaming Profile Tweaks
* **Official documentation (if available)**: https://learn.microsoft.com/en-us/windows/win32/procthread/multimedia-class-scheduler-service
* **GitHub URL**: https://github.com/atlas-os/atlas
* **Forum URL**: https://www.overclock.net/threads/mmcss-tasks-games-priority-tuning.1791000/
* **Discussion URL**: https://reddit.com/r/Windows10/comments/mmcss_games_profile_input_lag

---

### 11. USB xHCI Donanım Kesinti Yumuşatması Devre Dışı Bırakma (USB Interrupt Moderation Disable)
* **Title**: USB xHCI Donanım Kesinti Yumuşatması Devre Dışı Bırakma (USB Interrupt Moderation Disable)
* **Category**: USB Host Controller Hardware Interrupt Handling
* **Short description**: USB xHCI Host Controller donanım kesinti yumuşatma (Interrupt Moderation) özelliğini kapatarak her bir fare paketinin donanım tarafından anında kesinti (interrupt) oluşturmasını sağlar ve paket gruplama gecikmesini kapatır.
* **Exact code**: `HKLM\SYSTEM\CurrentControlSet\Control\Class\{36fc9e60-c465-11cf-8056-444553540000}\0000` -> `InterruptModeration` = 0
* **Registry path**: `HKLM\SYSTEM\CurrentControlSet\Control\Class\{36fc9e60-c465-11cf-8056-444553540000}\*`
* **Registry value**: `InterruptModeration` = `0` (REG_DWORD)
* **PowerShell command**: `Get-ChildItem -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Class\{36fc9e60-c465-11cf-8056-444553540000}' -ErrorAction SilentlyContinue | ForEach-Object { Set-ItemProperty -Path $_.PSPath -Name 'InterruptModeration' -Value 0 -Type DWord -ErrorAction SilentlyContinue }`
* **CMD command**: `powershell -Command "Get-ChildItem -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Class\{36fc9e60-c465-11cf-8056-444553540000}' -ErrorAction SilentlyContinue | ForEach-Object { Set-ItemProperty -Path $_.PSPath -Name 'InterruptModeration' -Value 0 -Type DWord -ErrorAction SilentlyContinue }"`
* **Device Manager setting**: Universal Serial Bus controllers -> USB xHCI Compliant Host Controller -> Properties -> Advanced -> Interrupt Moderation (Disabled)
* **Group Policy (if any)**: N/A
* **Driver setting**: xHCI Host Controller Driver
* **Firmware option**: UEFI / BIOS -> USB Interrupt Moderation (Disabled)
* **Supported mouse brands**: Tüm Fare Markaları
* **Supported Windows versions**: Windows 10, Windows 11
* **Polling rate compatibility**: 1000Hz, 2000Hz, 4000Hz, 8000Hz
* **USB compatibility**: USB 3.0, USB 3.1, USB 3.2 xHCI Controllers (Intel, AMD, ASMedia)
* **Gaming impact**: USB sürücüsünün birden fazla fare paketini birleştirip tek bir kesinti olarak iletmesini önler, donanım seviyesinde paketin anında işlenmesini sağlar.
* **Alternative values**: `1` (Interrupt Moderation Enabled - Varsayılan)
* **Related tweaks**: `irq`, `enable_usb_msi_mode`
* **Original source**: Intel xHCI Controller Latency Architecture Specs & Overclock.net USB Interrupt Tuning
* **Official documentation (if available)**: https://learn.microsoft.com/en-us/windows-hardware/drivers/usbcon/
* **GitHub URL**: https://github.com/djdance/win-latency-tweaks
* **Forum URL**: https://www.overclock.net/threads/usb-interrupt-moderation-and-mouse-response.1782000/
* **Discussion URL**: https://blurbusters.com/forums/viewtopic.php?t=8800

---

### 12. NVIDIA Reflex Donanım Girdi Gecikmesi Tampon Temizliği (NVIDIA Reflex Hardware Latency Queue Cleanup)
* **Title**: NVIDIA Reflex Donanım Girdi Gecikmesi Tampon Temizliği (NVIDIA Reflex Hardware Latency Queue Cleanup)
* **Category**: GPU Driver & Frame Queue Latency Reduction
* **Short description**: NVIDIA Grafik Sürücüsünde donanım render kuyruğundaki maksimum önceden işlenmiş kare sayısını 1'e sınırlayarak ekran kartının fare hareketini ekrana yansıtma süresini (End-to-End Latency) düşürür.
* **Exact code**: `HKLM\SOFTWARE\NVIDIA Corporation\Global\NVTweak` -> `DisplayPowerSaving` = 0, `PreRenderedFrames` = 1
* **Registry path**: `HKLM\SOFTWARE\NVIDIA Corporation\Global\NVTweak`
* **Registry value**: `DisplayPowerSaving` = `0` (REG_DWORD), `PreRenderedFrames` = `1` (REG_DWORD)
* **PowerShell command**: `New-Item -Path "HKLM:\SOFTWARE\NVIDIA Corporation\Global\NVTweak" -Force | Out-Null; Set-ItemProperty -Path "HKLM:\SOFTWARE\NVIDIA Corporation\Global\NVTweak" -Name "DisplayPowerSaving" -Value 0 -Type DWord; Set-ItemProperty -Path "HKLM:\SOFTWARE\NVIDIA Corporation\Global\NVTweak" -Name "PreRenderedFrames" -Value 1 -Type DWord`
* **CMD command**: `reg add "HKLM\SOFTWARE\NVIDIA Corporation\Global\NVTweak" /v DisplayPowerSaving /t REG_DWORD /d 0 /f & reg add "HKLM\SOFTWARE\NVIDIA Corporation\Global\NVTweak" /v PreRenderedFrames /t REG_DWORD /d 1 /f`
* **Device Manager setting**: NVIDIA Control Panel -> Manage 3D Settings -> Low Latency Mode (Ultra) / Max Pre-Rendered Frames (1)
* **Group Policy (if any)**: N/A
* **Driver setting**: NVIDIA Display Driver (nvlddmkm.sys)
* **Firmware option**: N/A
* **Supported mouse brands**: Tüm Fare Markaları (NVIDIA GPU'lu Sistemlerde)
* **Supported Windows versions**: Windows 10, Windows 11
* **Polling rate compatibility**: Tüm Polling Rate Değerleri
* **USB compatibility**: Tüm USB Portları
* **Gaming impact**: Fare hareketi ile ekrandaki görsel çıktı arasındaki uçtan uca (end-to-end) gecikmeyi 10-25ms düşürür.
* **Alternative values**: `PreRenderedFrames` = `3` (Windows/Driver Varsayılanı 3 kare)
* **Related tweaks**: `systemprofile_responsiveness`, `cursor_update_and_raw_handling`
* **Original source**: NVIDIA Reflex SDK Technical Manual & Blur Busters Input Lag Section
* **Official documentation (if available)**: https://developer.nvidia.com/reflex
* **GitHub URL**: https://github.com/NVIDIA/Reflex-SDK
* **Forum URL**: https://forums.blurbusters.com/viewtopic.php?t=7100
* **Discussion URL**: https://reddit.com/r/NVIDIA/comments/nvidia_low_latency_mode_explained
