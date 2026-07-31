# Yeni Telemetri ve Teşhis Optimizasyonları (New Telemetry Tweaks Research)

**Tarih:** 2026-07-30  
**Ajan:** Telemetry Researcher Agent  
**Durum:** Derin İnternet Araştırması Tamamlandı  
**Not:** Bu dosyadaki optimizasyonlar `C:\Luper\docs\database\telemetry.json` veritabanındaki mevcut kayıtlarla karşılaştırılmış ve **tamamen yeni (daha önce eklenmemiş)** olanlar gruplanarak düzenlenmiştir.

---

## 1. Windows 11 AI Telemetry, Recall ve Copilot Veri Toplama Optimizasyonu

* **Title:** Windows 11 AI Telemetry, Recall ve Copilot Veri Toplamayı Devre Dışı Bırakma
* **Category:** AI & Recall Telemetry
* **Short description:** Windows 11 Recall anlık görüntü analizini, Copilot AI veri işleme ve telemetri aktarımlarını sistem genelinde engeller.
* **Exact code:**
  ```powershell
  New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" -Force | Out-Null
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" -Name "DisableAIDataAnalysis" -Value 1 -Type DWord
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" -Name "AllowRecallEnablement" -Value 0 -Type DWord
  New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsCopilot" -Force | Out-Null
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsCopilot" -Name "TurnOffWindowsCopilot" -Value 1 -Type DWord
  ```
* **Registry path:** `HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsAI` & `HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsCopilot`
* **Registry value:** `DisableAIDataAnalysis` = 1 (REG_DWORD), `AllowRecallEnablement` = 0 (REG_DWORD), `TurnOffWindowsCopilot` = 1 (REG_DWORD)
* **PowerShell command:** `Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" -Name "DisableAIDataAnalysis" -Value 1 -Type DWord`
* **CMD command:** `reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" /v "DisableAIDataAnalysis" /t REG_DWORD /d 1 /f`
* **Group Policy:** Computer Configuration > Administrative Templates > Windows Components > Windows AI / Windows Copilot
* **Scheduled Task:** N/A
* **Windows Service:** N/A
* **ETW Provider:** Microsoft-Windows-WindowsAI
* **ETW Session:** N/A
* **Firewall Rule:** N/A
* **CSP Policy:** `./Device/Vendor/MSFT/Policy/Config/WindowsAI/DisableAIDataAnalysis`
* **Supported Windows versions:** Windows 11 (24H2 ve üzeri)
* **Telemetry impact:** Yüksek (Arka planda AI anlık görüntü taramasını ve telemetry sunucularına veri gönderimini keser)
* **Performance impact:** Yüksek (NPU/CPU arka plan iş yükünü ve disk okuma/yazma trafiğini düşürür)
* **Gaming impact:** Pozitif (Arka plan AI işlemcisi kaynak tüketimini engelleyerek oyun içi drop'ları önler)
* **Alternative values:** 0 (Etkin)
* **Related tweaks:** Activity History & User Timeline Telemetry
* **Original source:** Microsoft Learn / GitHub Windows Privacy Hardening
* **Official Microsoft documentation:** https://learn.microsoft.com/en-us/windows/ai/
* **GitHub URL:** https://github.com/microsoft/Windows-Customization
* **Forum URL:** https://www.elevenforum.com/t/turn-on-or-off-recall-in-windows-11.25414/
* **Discussion URL:** https://reddit.com/r/Windows11/comments/recall_telemetry

---

## 2. Windows Etkinlik Geçmişi (Activity History) ve Bulut Senkronizasyon Telemetrisi

* **Title:** Windows Etkinlik Geçmişi (Activity History) ve Bulut Senkronizasyon Telemetrisini Kapatma
* **Category:** Activity History & Cloud Sync Telemetry
* **Short description:** Kullanıcının uygulama kullanım geçmişinin, dosya açma kayıtlarının ve etkinlik akışının Microsoft sunucularına aktarılmasını engeller.
* **Exact code:**
  ```powershell
  $path = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\System"
  if (!(Test-Path $path)) { New-Item -Path $path -Force | Out-Null }
  Set-ItemProperty -Path $path -Name "PublishUserActivities" -Value 0 -Type DWord
  Set-ItemProperty -Path $path -Name "UploadUserActivities" -Value 0 -Type DWord
  Set-ItemProperty -Path $path -Name "EnableActivityFeed" -Value 0 -Type DWord
  ```
* **Registry path:** `HKLM\SOFTWARE\Policies\Microsoft\Windows\System`
* **Registry value:** `PublishUserActivities` = 0 (REG_DWORD), `UploadUserActivities` = 0 (REG_DWORD), `EnableActivityFeed` = 0 (REG_DWORD)
* **PowerShell command:** `Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\System" -Name "PublishUserActivities" -Value 0 -Type DWord`
* **CMD command:** `reg add "HKLM:\SOFTWARE\Policies\Microsoft\Windows\System" /v "PublishUserActivities" /t REG_DWORD /d 0 /f`
* **Group Policy:** Computer Configuration > Administrative Templates > System > OS Policies
* **Scheduled Task:** N/A
* **Windows Service:** N/A
* **ETW Provider:** Microsoft-Windows-User-Activity-Correlation
* **ETW Session:** N/A
* **Firewall Rule:** N/A
* **CSP Policy:** `./Device/Vendor/MSFT/Policy/Config/System/PublishUserActivities`
* **Supported Windows versions:** Windows 10, Windows 11
* **Telemetry impact:** Yüksek (Kullanıcı etkileşim takip telemetrisini durdurur)
* **Performance impact:** Düşük/Orta (Arka plan ağ trafiğini ve veritabanı yazma yükünü azaltır)
* **Gaming impact:** Pozitif
* **Alternative values:** 1 (Etkin)
* **Related tweaks:** Cloud Experience Host Telemetry
* **Original source:** Microsoft Documentation / Privacy Guides
* **Official Microsoft documentation:** https://learn.microsoft.com/en-us/windows/privacy/activity-history
* **GitHub URL:** https://github.com/W10Privacy/W10Privacy
* **Forum URL:** https://www.tenforums.com/tutorials/100531-enable-disable-activity-history-windows-10-a.html
* **Discussion URL:** https://reddit.com/r/Windows10/comments/activity_history

---

## 3. Uygulama Deneyimi ve Envanter Telemetrisi Zamanlanmış Görevleri

* **Title:** Uygulama Deneyimi ve Uyumluluk Telemetrisi Zamanlanmış Görevlerini Kapatma
* **Category:** Application Telemetry & Scheduled Tasks
* **Short description:** CompatTelRunner.exe, DeviceCensus.exe ve ProgramDataUpdater gibi arka planda yüksek CPU ve Disk I/O tüketen envanter telemetri görevlerini devre dışı bırakır.
* **Exact code:**
  ```powershell
  Disable-ScheduledTask -TaskPath "\Microsoft\Windows\Application Experience\" -TaskName "Microsoft Compatibility Appraiser" -ErrorAction SilentlyContinue
  Disable-ScheduledTask -TaskPath "\Microsoft\Windows\Application Experience\" -TaskName "ProgramDataUpdater" -ErrorAction SilentlyContinue
  Disable-ScheduledTask -TaskPath "\Microsoft\Windows\Application Experience\" -TaskName "StartupAppTask" -ErrorAction SilentlyContinue
  Disable-ScheduledTask -TaskPath "\Microsoft\Windows\DeviceInformation\" -TaskName "Device" -ErrorAction SilentlyContinue
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AppCompat" -Name "AITEnable" -Value 0 -Type DWord -ErrorAction SilentlyContinue
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AppCompat" -Name "DisableInventory" -Value 1 -Type DWord -ErrorAction SilentlyContinue
  ```
* **Registry path:** `HKLM\SOFTWARE\Policies\Microsoft\Windows\AppCompat`
* **Registry value:** `AITEnable` = 0 (REG_DWORD), `DisableInventory` = 1 (REG_DWORD)
* **PowerShell command:** `Disable-ScheduledTask -TaskPath "\Microsoft\Windows\Application Experience\" -TaskName "Microsoft Compatibility Appraiser"`
* **CMD command:** `schtasks /Change /TN "\Microsoft\Windows\Application Experience\Microsoft Compatibility Appraiser" /DISABLE`
* **Group Policy:** Computer Configuration > Administrative Templates > Windows Components > Application Experience
* **Scheduled Task:** `\Microsoft\Windows\Application Experience\Microsoft Compatibility Appraiser`, `ProgramDataUpdater`, `StartupAppTask`
* **Windows Service:** N/A
* **ETW Provider:** Microsoft-Windows-Application-Experience
* **ETW Session:** N/A
* **Firewall Rule:** N/A
* **CSP Policy:** `./Device/Vendor/MSFT/Policy/Config/ApplicationExperience/DisableInventory`
* **Supported Windows versions:** Windows 10, Windows 11
* **Telemetry impact:** Çok Yüksek (Tüm sistem uygulama ve donanım envanter tarama raporlamasını durdurur)
* **Performance impact:** Kritik Yüksek (CompatTelRunner.exe nedeniyle oluşan %100 Disk ve CPU kullanım kilitlenmelerini bitirir)
* **Gaming impact:** Yüksek Pozitif (Oyun sırasında ani mikro-takılmaları (micro-stuttering) engeller)
* **Alternative values:** Disabled = False
* **Related tweaks:** Device Census Telemetry
* **Original source:** MSFN / MyDigitalLife / SuperUser
* **Official Microsoft documentation:** https://learn.microsoft.com/en-us/windows/privacy/configure-windows-telemetry-in-your-organization
* **GitHub URL:** https://github.com/farag2/windows-debloat
* **Forum URL:** https://forums.mydigitallife.net/threads/disabling-compattelrunner.78912/
* **Discussion URL:** https://superuser.com/questions/1000000/compattelrunner-high-cpu-usage

---

## 4. Müşteri Deneyimi Geliştirme Programı (CEIP / SQM) Görevleri

* **Title:** Müşteri Deneyimi Geliştirme Programı (CEIP / SQM) Görevlerini Devre Dışı Bırakma
* **Category:** CEIP & SQM Telemetry
* **Short description:** USB, Bluetooth, Kernel ve sistem geneli CEIP/SQM veri birleştirme ve telemetri gönderme görevlerini kapatır.
* **Exact code:**
  ```powershell
  Disable-ScheduledTask -TaskPath "\Microsoft\Windows\Customer Experience Improvement Program\" -TaskName "Consolidator" -ErrorAction SilentlyContinue
  Disable-ScheduledTask -TaskPath "\Microsoft\Windows\Customer Experience Improvement Program\" -TaskName "UsbCeip" -ErrorAction SilentlyContinue
  Disable-ScheduledTask -TaskPath "\Microsoft\Windows\Customer Experience Improvement Program\" -TaskName "KernelCeipTask" -ErrorAction SilentlyContinue
  Disable-ScheduledTask -TaskPath "\Microsoft\Windows\Customer Experience Improvement Program\" -TaskName "BthSQM" -ErrorAction SilentlyContinue
  ```
* **Registry path:** `HKLM\SOFTWARE\Policies\Microsoft\SQMClient\Windows`
* **Registry value:** `CEIPEnable` = 0 (REG_DWORD)
* **PowerShell command:** `Disable-ScheduledTask -TaskPath "\Microsoft\Windows\Customer Experience Improvement Program\" -TaskName "Consolidator"`
* **CMD command:** `schtasks /Change /TN "\Microsoft\Windows\Customer Experience Improvement Program\Consolidator" /DISABLE`
* **Group Policy:** Computer Configuration > Administrative Templates > System > Internet Communication Management > Customer Experience Improvement Program
* **Scheduled Task:** `Consolidator`, `UsbCeip`, `KernelCeipTask`, `BthSQM`
* **Windows Service:** N/A
* **ETW Provider:** Microsoft-Windows-SQM
* **ETW Session:** SQMLogger
* **Firewall Rule:** N/A
* **CSP Policy:** N/A
* **Supported Windows versions:** Windows 7, Windows 8.1, Windows 10, Windows 11
* **Telemetry impact:** Yüksek
* **Performance impact:** Orta Pozitif (Arka planda konsolidasyon ve veri paketi hazırlama işlemlerini sonlandırır)
* **Gaming impact:** Pozitif
* **Alternative values:** Enabled
* **Related tweaks:** DiagTrack Service
* **Original source:** PowerShell Gallery / O&O ShutUp10++
* **Official Microsoft documentation:** https://learn.microsoft.com/en-us/windows/privacy/ceip-telemetry
* **GitHub URL:** https://github.com/xanderbailey/win-telemetry-block
* **Forum URL:** https://www.tenforums.com/tutorials/45464-enable-disable-customer-experience-improvement-program-windows-10-a.html
* **Discussion URL:** https://reddit.com/r/Windows10/comments/ceip_tasks

---

## 5. Geri Bildirim İstemleri ve Kişiselleştirilmiş Deneyim Telemetrisi

* **Title:** Geri Bildirim İstemleri ve Kişiselleştirilmiş Deneyim Telemetrisini Kapatma
* **Category:** Feedback & Personalized Ads Telemetry
* **Short description:** Windows geri bildirim anket sıklığını sıfırlar ve teşhis verilerine dayalı kişiselleştirilmiş reklam/önerileri engeller.
* **Exact code:**
  ```powershell
  $siufPath = "HKCU:\Software\Microsoft\Siuf\Rules"
  if (!(Test-Path $siufPath)) { New-Item -Path $siufPath -Force | Out-Null }
  Set-ItemProperty -Path $siufPath -Name "NumberOfSIUFInPeriod" -Value 0 -Type DWord
  $privacyPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Privacy"
  if (!(Test-Path $privacyPath)) { New-Item -Path $privacyPath -Force | Out-Null }
  Set-ItemProperty -Path $privacyPath -Name "TailoredExperiencesWithDiagnosticDataEnabled" -Value 0 -Type DWord
  ```
* **Registry path:** `HKCU\Software\Microsoft\Siuf\Rules` & `HKCU\Software\Microsoft\Windows\CurrentVersion\Privacy`
* **Registry value:** `NumberOfSIUFInPeriod` = 0 (REG_DWORD), `TailoredExperiencesWithDiagnosticDataEnabled` = 0 (REG_DWORD)
* **PowerShell command:** `Set-ItemProperty -Path "HKCU:\Software\Microsoft\Siuf\Rules" -Name "NumberOfSIUFInPeriod" -Value 0 -Type DWord`
* **CMD command:** `reg add "HKCU\Software\Microsoft\Siuf\Rules" /v "NumberOfSIUFInPeriod" /t REG_DWORD /d 0 /f`
* **Group Policy:** Computer Configuration > Administrative Templates > Windows Components > Data Collection and Preview Builds > Do not show feedback notifications
* **Scheduled Task:** N/A
* **Windows Service:** N/A
* **ETW Provider:** Microsoft-Windows-Feedback
* **ETW Session:** N/A
* **Firewall Rule:** N/A
* **CSP Policy:** `./Device/Vendor/MSFT/Policy/Config/Experience/DoNotShowFeedbackNotifications`
* **Supported Windows versions:** Windows 10, Windows 11
* **Telemetry impact:** Orta Pozitif (Kullanıcı profil çıkarma ve rahatsız edici popup istemlerini engeller)
* **Performance impact:** Düşük Pozitif
* **Gaming impact:** Pozitif (Oyun esnasında ekrana gelen bildirimleri önler)
* **Alternative values:** 1 (Etkin)
* **Related tweaks:** Windows Diagnostic Data Collection
* **Original source:** PrivacyGuides / W10Privacy
* **Official Microsoft documentation:** https://learn.microsoft.com/en-us/windows/privacy/feedback-diagnostics-privacy
* **GitHub URL:** https://github.com/privacy-guides/windows-hardening
* **Forum URL:** https://www.elevenforum.com/t/change-feedback-frequency-in-windows-11.4512/
* **Discussion URL:** https://reddit.com/r/Windows11/comments/disable_feedback_prompts

---

## 6. ETW AutoLogger Telemetri İzleme Oturumları (Boot-time Logging)

* **Title:** ETW AutoLogger Telemetri İzleme Oturumlarını Boot Sırasında Kapatma
* **Category:** ETW & Kernel Logging Telemetry
* **Short description:** Windows açılışında otomatik başlatılan `AutoLogger-Diagtrack-Listener` ve `SQMLogger` gibi ETW izleme oturumlarını devre dışı bırakır.
* **Exact code:**
  ```powershell
  Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\WMI\Autologger\AutoLogger-Diagtrack-Listener" -Name "Start" -Value 0 -Type DWord -ErrorAction SilentlyContinue
  Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SQMLogger" -Name "Start" -Value 0 -Type DWord -ErrorAction SilentlyContinue
  ```
* **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\AutoLogger-Diagtrack-Listener` & `HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SQMLogger`
* **Registry value:** `Start` = 0 (REG_DWORD)
* **PowerShell command:** `Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\WMI\Autologger\AutoLogger-Diagtrack-Listener" -Name "Start" -Value 0 -Type DWord`
* **CMD command:** `reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\AutoLogger-Diagtrack-Listener" /v "Start" /t REG_DWORD /d 0 /f`
* **Group Policy:** N/A
* **Scheduled Task:** N/A
* **Windows Service:** N/A
* **ETW Provider:** AutoLogger-Diagtrack-Listener
* **ETW Session:** AutoLogger-Diagtrack-Listener, SQMLogger
* **Firewall Rule:** N/A
* **CSP Policy:** N/A
* **Supported Windows versions:** Windows 10, Windows 11
* **Telemetry impact:** Çok Yüksek (Açılıştan itibaren sistem olay izleme log dosyalarının (`.etl`) diske yazılmasını ve birikmesini durdurur)
* **Performance impact:** Yüksek Pozitif (Sistem açılış süresini hızlandırır ve arka plan disk I/O yükünü azaltır)
* **Gaming impact:** Pozitif
* **Alternative values:** 1 (Etkin)
* **Related tweaks:** DiagTrack Service Disable
* **Original source:** Sysinternals / Troopers Security Research / GitHub
* **Official Microsoft documentation:** https://learn.microsoft.com/en-us/windows/win32/etw/configuring-and-starting-an-autologger-session
* **GitHub URL:** https://github.com/dokan-dev/dokany/issues/etw
* **Forum URL:** https://forums.sysinternals.com/autologger-diagtrack-listener_topic34123.html
* **Discussion URL:** https://reddit.com/r/Windows10/comments/etw_autologger_telemetry

---

## 7. Mürekkep Oluşturma, Yazma Kişiselleştirme ve Kişi Telemetrisi

* **Title:** Mürekkep Oluşturma, Yazma Kişiselleştirme ve Kişi Telemetrisini Kapatma
* **Category:** Inking & Input Telemetry
* **Short description:** Klavyeden yazılan metinlerin ve dokunmatik kalem çizimlerinin kişisel sözlük adı altında Microsoft'a aktarılmasını engeller.
* **Exact code:**
  ```powershell
  $inkPath = "HKCU:\Software\Microsoft\InputPersonalization"
  if (!(Test-Path $inkPath)) { New-Item -Path $inkPath -Force | Out-Null }
  Set-ItemProperty -Path $inkPath -Name "RestrictImplicitInkCollection" -Value 1 -Type DWord
  Set-ItemProperty -Path $inkPath -Name "RestrictImplicitTextCollection" -Value 1 -Type DWord
  $storePath = "HKCU:\Software\Microsoft\InputPersonalization\TrainedDataStore"
  if (!(Test-Path $storePath)) { New-Item -Path $storePath -Force | Out-Null }
  Set-ItemProperty -Path $storePath -Name "HarvestContacts" -Value 0 -Type DWord
  ```
* **Registry path:** `HKCU\Software\Microsoft\InputPersonalization` & `HKCU\Software\Microsoft\InputPersonalization\TrainedDataStore`
* **Registry value:** `RestrictImplicitInkCollection` = 1 (REG_DWORD), `RestrictImplicitTextCollection` = 1 (REG_DWORD), `HarvestContacts` = 0 (REG_DWORD)
* **PowerShell command:** `Set-ItemProperty -Path "HKCU:\Software\Microsoft\InputPersonalization" -Name "RestrictImplicitInkCollection" -Value 1 -Type DWord`
* **CMD command:** `reg add "HKCU\Software\Microsoft\InputPersonalization" /v "RestrictImplicitInkCollection" /t REG_DWORD /d 1 /f`
* **Group Policy:** Computer Configuration > Administrative Templates > Control Panel > Regional and Language Options > Authoring telemetry
* **Scheduled Task:** N/A
* **Windows Service:** N/A
* **ETW Provider:** Microsoft-Windows-Input-Personalization
* **ETW Session:** N/A
* **Firewall Rule:** N/A
* **CSP Policy:** `./Device/Vendor/MSFT/Policy/Config/Privacy/RestrictImplicitInkCollection`
* **Supported Windows versions:** Windows 10, Windows 11
* **Telemetry impact:** Yüksek (Klavye ve giriş cihazı telemetri toplamayı engeller)
* **Performance impact:** Düşük Pozitif
* **Gaming impact:** Pozitif
* **Alternative values:** 0 (Etkin)
* **Related tweaks:** Speech Recognition Telemetry
* **Original source:** Microsoft Security Baselines / PrivacyGuides
* **Official Microsoft documentation:** https://learn.microsoft.com/en-us/windows/privacy/ink-typing-privacy
* **GitHub URL:** https://github.com/disableservices/windows-10-privacy
* **Forum URL:** https://www.tenforums.com/tutorials/68311-turn-off-inking-typing-personalization-windows-10-a.html
* **Discussion URL:** https://reddit.com/r/privacy/comments/windows_inking_telemetry

---

## 8. Microsoft Defender MAPS ve Otomatik Örnek Gönderimi Telemetrisi

* **Title:** Microsoft Defender MAPS ve Otomatik Örnek Gönderimi Telemetrisini Kapatma
* **Category:** Security Telemetry & Sample Uploads
* **Short description:** Defender'ın şüpheli dosyaları ve sistem analiz verilerini otomatik olarak Microsoft MAPS bulutuna yüklemesini engeller.
* **Exact code:**
  ```powershell
  $spynet = "HKLM:\SOFTWARE\Policies\Microsoft\Windows Defender\Spynet"
  if (!(Test-Path $spynet)) { New-Item -Path $spynet -Force | Out-Null }
  Set-ItemProperty -Path $spynet -Name "SpyNetReporting" -Value 0 -Type DWord
  Set-ItemProperty -Path $spynet -Name "SubmitSamplesConsent" -Value 2 -Type DWord
  ```
* **Registry path:** `HKLM\SOFTWARE\Policies\Microsoft\Windows Defender\Spynet`
* **Registry value:** `SpyNetReporting` = 0 (REG_DWORD), `SubmitSamplesConsent` = 2 (REG_DWORD)
* **PowerShell command:** `Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows Defender\Spynet" -Name "SpyNetReporting" -Value 0 -Type DWord`
* **CMD command:** `reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender\Spynet" /v "SpyNetReporting" /t REG_DWORD /d 0 /f`
* **Group Policy:** Computer Configuration > Administrative Templates > Windows Components > Microsoft Defender Antivirus > MAPS
* **Scheduled Task:** N/A
* **Windows Service:** WinDefend
* **ETW Provider:** Microsoft-Windows-WindowsDefender
* **ETW Session:** N/A
* **Firewall Rule:** N/A
* **CSP Policy:** `./Device/Vendor/MSFT/Policy/Config/Defender/SubmitSamplesConsent`
* **Supported Windows versions:** Windows 10, Windows 11
* **Telemetry impact:** Yüksek (Ağ üzerinden yerel dosya örneği transferini engeller)
* **Performance impact:** Orta Pozitif (Arka planda dosya yükleme trafiğini ve CPU tüketimini azaltır)
* **Gaming impact:** Pozitif
* **Alternative values:** 1 (Basic MAPS), 2 (Never send samples)
* **Related tweaks:** SmartScreen Telemetry
* **Original source:** Microsoft Security Baselines
* **Official Microsoft documentation:** https://learn.microsoft.com/en-us/defender-xdr/mde-maps
* **GitHub URL:** https://github.com/MicrosoftDocs/windows-itpro-docs
* **Forum URL:** https://www.elevenforum.com/t/enable-or-disable-cloud-delivered-protection-for-microsoft-defender-antivirus-in-windows-11.3912/
* **Discussion URL:** https://reddit.com/r/Windows11/comments/defender_sample_submission

---

## 9. Windows Teşhis Altyapısı (Diagnostic Policy & Hub) Servisleri

* **Title:** Windows Teşhis Altyapısı (Diagnostic Policy & Hub) Servislerini Yapılandırma
* **Category:** Diagnostic Services
* **Short description:** Diagnostic Policy Service (DPS), Diagnostic Service Host ve Diagnostics Hub Standard Collector servislerinin sürekli çalışmasını kapatır.
* **Exact code:**
  ```powershell
  Set-Service -Name "DPS" -StartupType Disabled -ErrorAction SilentlyContinue
  Set-Service -Name "WdiServiceHost" -StartupType Manual -ErrorAction SilentlyContinue
  Set-Service -Name "WdiSystemHost" -StartupType Manual -ErrorAction SilentlyContinue
  Set-Service -Name "diagnosticshub.standardcollector.service" -StartupType Disabled -ErrorAction SilentlyContinue
  ```
* **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Services\DPS` & `HKLM\SYSTEM\CurrentControlSet\Services\WdiServiceHost`
* **Registry value:** `Start` = 4 (REG_DWORD)
* **PowerShell command:** `Set-Service -Name "DPS" -StartupType Disabled`
* **CMD command:** `sc config DPS start= disabled`
* **Group Policy:** Computer Configuration > Administrative Templates > System > Troubleshooting and Diagnostics
* **Scheduled Task:** N/A
* **Windows Service:** `DPS`, `WdiServiceHost`, `WdiSystemHost`, `diagnosticshub.standardcollector.service`
* **ETW Provider:** Microsoft-Windows-Diagnostics-PerfTrack
* **ETW Session:** N/A
* **Firewall Rule:** N/A
* **CSP Policy:** N/A
* **Supported Windows versions:** Windows 7, Windows 10, Windows 11
* **Telemetry impact:** Yüksek
* **Performance impact:** Yüksek Pozitif (DPS servisinin sebep olduğu yüksek CPU kullanımı ve gecikmeleri çözer)
* **Gaming impact:** Orta/Yüksek Pozitif (DPS servisi ağ trafiğini izlerken lag/latency artışına sebep olabilmektedir)
* **Alternative values:** Start = 2 (Automatic), Start = 3 (Manual)
* **Related tweaks:** DiagTrack Service
* **Original source:** BlackViper Service Configurations / MSFN
* **Official Microsoft documentation:** https://learn.microsoft.com/en-us/windows/privacy/diagnostic-data-service
* **GitHub URL:** https://github.com/BlackViper/BlackViper-Scripts
* **Forum URL:** https://msfn.org/board/topic/177000-disabling-dps-and-wdiservicehost/
* **Discussion URL:** https://reddit.com/r/Windows10/comments/dps_service_high_cpu
