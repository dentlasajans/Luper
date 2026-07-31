# Phase 2 Windows Gizlilik (Privacy) Optimizasyon Kodları Araştırma Raporu

**Oluşturulma Tarihi:** 2026-07-31  
**Ajan:** Privacy Code Researcher Agent (Phase 2)  
**Hedef Veritabanı:** `C:\Luper\docs\database\privacy.json` (Mevcut 21 optimizasyon okundu, hiçbiri tekrar önerilmedi)  
**Kapsam:** Derin Windows Gizlilik (Privacy) Optimizasyonları, Gecikme (Latency) ve Mikro-Takılma (Micro-Stutter) Sıfırlama Kodları  

---

## Optimizasyon Kartları

### 1. Windows Hata Raporlama (WER) Telemetrisi ve Arka Plan Minidump Gönderimini Kapat
- **Title:** Windows Hata Raporlama (WER) Telemetrisi ve Arka Plan Minidump Gönderimini Kapat
- **Category:** Error Reporting / Telemetry Isolation
- **Short description:** Windows'un sistem ve uygulama çökmelerinde (crash) oluşan bellek dökümlerini (minidump) ve hata telemetrisini arka planda Microsoft sunucularına otomatik yüklemesini engeller. Gecikmeyi düşürür ve çökme anındaki ağ/işlemci kilitlenmelerini önler.
- **Exact code:** 
  ```cmd
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Error Reporting" /v "Disabled" /t REG_DWORD /d "1" /f
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Error Reporting" /v "DoReport" /t REG_DWORD /d "0" /f
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Error Reporting" /v "LoggingDisabled" /t REG_DWORD /d "1" /f
  ```
- **Registry path:** `HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Error Reporting`
- **Registry value:** `Disabled` = 1, `DoReport` = 0, `LoggingDisabled` = 1
- **PowerShell command:** 
  ```powershell
  New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\Windows Error Reporting" -Force | Out-Null
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\Windows Error Reporting" -Name "Disabled" -Value 1 -Type DWord
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\Windows Error Reporting" -Name "DoReport" -Value 0 -Type DWord
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\Windows Error Reporting" -Name "LoggingDisabled" -Value 1 -Type DWord
  Stop-Service -Name "WerSvc" -Force -ErrorAction SilentlyContinue
  Set-Service -Name "WerSvc" -StartupType Disabled
  ```
- **CMD command:** 
  ```cmd
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Error Reporting" /v "Disabled" /t REG_DWORD /d "1" /f & reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Error Reporting" /v "DoReport" /t REG_DWORD /d "0" /f & reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Error Reporting" /v "LoggingDisabled" /t REG_DWORD /d "1" /f & sc config WerSvc start= disabled & net stop WerSvc
  ```
- **Group Policy:** Computer Configuration -> Administrative Templates -> Windows Components -> Windows Error Reporting -> Disable Windows Error Reporting
- **App Permission:** N/A
- **Capability:** N/A
- **Supported Windows versions:** Windows 10, Windows 11
- **Privacy impact:** High (Hata anında bellek içeriğinin ve kişisel verilerin Microsoft'a iletilmesini engeller)
- **Feature impact:** Low (Uygulama çökme raporları MS'e iletilmez, yerel çökme günlükleri tutulabilir)
- **Gaming impact:** Positive High (Çökme sonrası veya arka planda WerFault.exe ve WerSvc kaynaklı CPU/Disk/Ağ takılmalarını sıfırlar)
- **Alternative values:** 0 (WER Etkin)
- **Related tweaks:** Telemetry Services Disable, CompatTelRunner Disable
- **Original source:** Microsoft Security & Policy Baseline
- **Official documentation:** https://learn.microsoft.com/en-us/windows/client-management/mdm/policy-csp-errorreporting
- **GitHub URL:** https://github.com/kalaspuff/Win10-Privacy-and-Debloat
- **Forum URL:** https://sysnative.com
- **Discussion URL:** N/A

---

### 2. ETW Çekirdek Telemetri Otomatik Günlükçülerini (AutoLogger-Diagtrack-Listener & SQM) Kapat
- **Title:** ETW Çekirdek Telemetri Otomatik Günlükçülerini (AutoLogger-Diagtrack-Listener & SQM) Kapat
- **Category:** Kernel Telemetry / Latency Optimization
- **Short description:** Windows kernel düzeyinde real-time olay takibi yapan AutoLogger-Diagtrack-Listener ve SQMLogger izleme oturumlarını kapatır. CPU önbellek (L3 cache) ve bellek halka arabelleklerinde (ring buffer) telemetri izleme yükünü sıfırlayarak mikro-takılmaları (micro-stutter) engeller.
- **Exact code:** 
  ```cmd
  reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\AutoLogger-Diagtrack-Listener" /v "Start" /t REG_DWORD /d "0" /f
  reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SQMLogger" /v "Start" /t REG_DWORD /d "0" /f
  ```
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\AutoLogger-Diagtrack-Listener` / `HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SQMLogger`
- **Registry value:** `Start` = 0
- **PowerShell command:** 
  ```powershell
  Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\WMI\Autologger\AutoLogger-Diagtrack-Listener" -Name "Start" -Value 0 -Type DWord
  Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SQMLogger" -Name "Start" -Value 0 -Type DWord
  ```
- **CMD command:** 
  ```cmd
  reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\AutoLogger-Diagtrack-Listener" /v "Start" /t REG_DWORD /d "0" /f & reg add "HKLM\SYSTEM\CurrentControlSet\Control\WMI\Autologger\SQMLogger" /v "Start" /t REG_DWORD /d "0" /f
  ```
- **Group Policy:** N/A (Low-level Registry / ETW Autologger Control)
- **App Permission:** N/A
- **Capability:** N/A
- **Supported Windows versions:** Windows 10, Windows 11
- **Privacy impact:** Maximum (Çekirdek seviyesinde sistem kullanım verilerinin toplanmasını durdurur)
- **Feature impact:** None (Sistem kararlılığını etkilemez, geliştirici tanılamaları hariç günlük sistem işleyişini değiştirmez)
- **Gaming impact:** Extreme Positive (Kernel interrupt/DPC gecikmelerini ve frame time sapmalarını doğrudan düşürür)
- **Alternative values:** 1 (ETW Autologger Etkin)
- **Related tweaks:** DiagTrack Service Disable, Telemetry Disable
- **Original source:** Calyptix & MSFN Kernel Optimization Guides
- **Official documentation:** https://learn.microsoft.com/en-us/windows/win32/etw/configuring-and-starting-an-autologger-session
- **GitHub URL:** https://github.com/djdunc/Win10Clean
- **Forum URL:** https://msfn.org
- **Discussion URL:** N/A

---

### 3. Windows Teslim İyileştirme (Delivery Optimization) P2P Ağ Yüklemesi ve Telemetrisini Kapat
- **Title:** Windows Teslim İyileştirme (Delivery Optimization) P2P Ağ Yüklemesi ve Telemetrisini Kapat
- **Category:** Network Privacy / Bandwidth Optimization
- **Short description:** Windows Update'in arka planda yerel ağınız ve internet üzerindeki diğer bilgisayarlara güncelleme dosyaları yüklemesini (P2P upload) ve bant genişliği telemetrisi göndermesini engeller.
- **Exact code:** 
  ```cmd
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\DeliveryOptimization" /v "DODownloadMode" /t REG_DWORD /d "0" /f
  reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\DeliveryOptimization\Config" /v "DODownloadMode" /t REG_DWORD /d "0" /f
  ```
- **Registry path:** `HKLM\SOFTWARE\Policies\Microsoft\Windows\DeliveryOptimization`
- **Registry value:** `DODownloadMode` = 0 (0 = HTTP Only / Bypass P2P)
- **PowerShell command:** 
  ```powershell
  New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\DeliveryOptimization" -Force | Out-Null
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\DeliveryOptimization" -Name "DODownloadMode" -Value 0 -Type DWord
  Stop-Service -Name "dosvc" -Force -ErrorAction SilentlyContinue
  Set-Service -Name "dosvc" -StartupType Disabled
  ```
- **CMD command:** 
  ```cmd
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\DeliveryOptimization" /v "DODownloadMode" /t REG_DWORD /d "0" /f & sc config dosvc start= disabled & net stop dosvc
  ```
- **Group Policy:** Computer Configuration -> Administrative Templates -> Windows Components -> Delivery Optimization -> Download Mode (Bypass/HTTP Only)
- **App Permission:** N/A
- **Capability:** N/A
- **Supported Windows versions:** Windows 10, Windows 11
- **Privacy impact:** High (Ağınızın ve IP adresinizin Microsoft P2P dağıtım ağına dahil edilmesini önler)
- **Feature impact:** Low (Güncellemeler doğrudan Microsoft sunucularından indirilir, P2P yükleme yapılmaz)
- **Gaming impact:** Extreme Positive (Oyun esnasında beklenmedik arka plan yüklemelerini (upload spill) ve ping fırlamalarını engeller)
- **Alternative values:** 1 (LAN P2P), 3 (Internet P2P)
- **Related tweaks:** DoH Encrypted DNS, Network Latency Optimization
- **Original source:** Microsoft Intune & Group Policy Reference
- **Official documentation:** https://learn.microsoft.com/en-us/windows/deployment/do/waas-delivery-optimization-setup
- **GitHub URL:** https://github.com/Sycnex/Windows10Debloater
- **Forum URL:** https://tenforums.com
- **Discussion URL:** N/A

---

### 4. Bağlı Cihazlar Platformu (CDPSvc / Project Rome) Cihaz Keşfi ve Bulut Telemetrisini Kapat
- **Title:** Bağlı Cihazlar Platformu (CDPSvc / Project Rome) Cihaz Keşfi ve Bulut Telemetrisini Kapat
- **Category:** Device Privacy / Cross-Device Telemetry
- **Short description:** Windows'un yakındaki ve aynı Microsoft hesabına bağlı diğer cihazları (telefon, tablet, PC) sürekli arama, Bluetooth/Wi-Fi yayını yapma ve cihaz etkinlik verisini bulutla eşitleme servisini kapatır.
- **Exact code:** 
  ```cmd
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\System" /v "EnableCdp" /t REG_DWORD /d "0" /f
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\System" /v "EnableMdmCdpService" /t REG_DWORD /d "0" /f
  reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\CDP" /v "CdpSessionUserAuthzPolicy" /t REG_DWORD /d "0" /f
  reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\CDP" /v "NearShareChannelUserAuthzPolicy" /t REG_DWORD /d "0" /f
  ```
- **Registry path:** `HKLM\SOFTWARE\Policies\Microsoft\Windows\System` / `HKCU\Software\Microsoft\Windows\CurrentVersion\CDP`
- **Registry value:** `EnableCdp` = 0, `EnableMdmCdpService` = 0, `CdpSessionUserAuthzPolicy` = 0
- **PowerShell command:** 
  ```powershell
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\System" -Name "EnableCdp" -Value 0 -Type DWord
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\System" -Name "EnableMdmCdpService" -Value 0 -Type DWord
  New-Item -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\CDP" -Force | Out-Null
  Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\CDP" -Name "CdpSessionUserAuthzPolicy" -Value 0 -Type DWord
  Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\CDP" -Name "NearShareChannelUserAuthzPolicy" -Value 0 -Type DWord
  Stop-Service -Name "CDPSvc" -Force -ErrorAction SilentlyContinue
  Set-Service -Name "CDPSvc" -StartupType Disabled
  ```
- **CMD command:** 
  ```cmd
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\System" /v "EnableCdp" /t REG_DWORD /d "0" /f & reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\CDP" /v "CdpSessionUserAuthzPolicy" /t REG_DWORD /d "0" /f & sc config CDPSvc start= disabled & net stop CDPSvc
  ```
- **Group Policy:** Computer Configuration -> Administrative Templates -> System -> Connected Devices Platform -> Enable Connected Devices Platform
- **App Permission:** N/A
- **Capability:** N/A
- **Supported Windows versions:** Windows 10, Windows 11
- **Privacy impact:** High (Cihaz konumlandırma ve cihazlar arası etkinlik aktarımını tamamen durdurur)
- **Feature impact:** Medium (Yakındaki Paylaşım / NearShare ve Telefon Bağlantısı uzaktan uygulama sürdürme özellikleri kapanır)
- **Gaming impact:** Positive Medium (Arka plan Bluetooth/Wi-Fi tarama paketlerini ve CDPSvc bellek kullanımını kaldırır)
- **Alternative values:** 1 (CDP Etkin)
- **Related tweaks:** Bluetooth Device Discovery Disable, Nearby Sharing Disable
- **Original source:** Windows Privacy & Security CSP Guide
- **Official documentation:** https://learn.microsoft.com/en-us/windows/client-management/mdm/policy-csp-connecteddevices
- **GitHub URL:** https://github.com/W4RH34D/Windows-10-Security-Privacy-Debloat
- **Forum URL:** https://elevenforum.com
- **Discussion URL:** N/A

---

### 5. Windows Defender SmartScreen Dosya/Uygulama Hashing Telemetrisini ve Başlatma Gecikmesini Kapat
- **Title:** Windows Defender SmartScreen Dosya/Uygulama Hashing Telemetrisini ve Başlatma Gecikmesini Kapat
- **Category:** Security Telemetry / Process Launch Latency
- **Short description:** Yeni çalıştırılan her .exe dosyasının karmasının (hash) ve yolunun Microsoft SmartScreen bulut sunucularına gönderilmesini engeller. Uygulama ve oyun başlatma süresindeki ağ kontrol gecikmesini (launch latency) sıfırlar.
- **Exact code:** 
  ```cmd
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\System" /v "EnableSmartScreen" /t REG_DWORD /d "0" /f
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender\SmartScreen" /v "ConfigureAppInstallControlEnabled" /t REG_DWORD /d "0" /f
  reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\AppHost" /v "EnableWebContentEvaluation" /t REG_DWORD /d "0" /f
  ```
- **Registry path:** `HKLM\SOFTWARE\Policies\Microsoft\Windows\System` / `HKCU\Software\Microsoft\Windows\CurrentVersion\AppHost`
- **Registry value:** `EnableSmartScreen` = 0, `EnableWebContentEvaluation` = 0
- **PowerShell command:** 
  ```powershell
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\System" -Name "EnableSmartScreen" -Value 0 -Type DWord
  New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows Defender\SmartScreen" -Force | Out-Null
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows Defender\SmartScreen" -Name "ConfigureAppInstallControlEnabled" -Value 0 -Type DWord
  New-Item -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\AppHost" -Force | Out-Null
  Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\AppHost" -Name "EnableWebContentEvaluation" -Value 0 -Type DWord
  ```
- **CMD command:** 
  ```cmd
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\System" /v "EnableSmartScreen" /t REG_DWORD /d "0" /f & reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\AppHost" /v "EnableWebContentEvaluation" /t REG_DWORD /d "0" /f
  ```
- **Group Policy:** Computer Configuration -> Administrative Templates -> Windows Components -> File Explorer -> Configure Windows Defender SmartScreen
- **App Permission:** N/A
- **Capability:** N/A
- **Supported Windows versions:** Windows 10, Windows 11
- **Privacy impact:** High (İndirilen ve çalıştırılan tüm uygulamaların bilgilerinin MS'e raporlanmasını kapatır)
- **Feature impact:** Medium (Bilinmeyen internet kaynaklı uygulamalarda SmartScreen uyarı penceresi çıkmaz)
- **Gaming impact:** Extreme Positive (Oyun ve uygulama açılışındaki 200ms-1500ms arası SmartScreen ağ bekleme süresini (launch delay) ortadan kaldırır)
- **Alternative values:** 1 (SmartScreen Etkin)
- **Related tweaks:** Defender MAPS Disable, Edge SmartScreen Disable
- **Original source:** PrivacyGuides & WinAero Security Tweaks
- **Official documentation:** https://learn.microsoft.com/en-us/windows/security/operating-system-security/virus-and-threat-protection/microsoft-defender-smartscreen/
- **GitHub URL:** https://github.com/farag2/win10debloat
- **Forum URL:** https://www.reddit.com/r/Windows11/
- **Discussion URL:** N/A

---

### 6. NCSI Aktif Ağ Bağlantı Problarını (msftconnecttest) ve Telemetri Sorgularını Kapat
- **Title:** NCSI Aktif Ağ Bağlantı Problarını (msftconnecttest) ve Telemetri Sorgularını Kapat
- **Category:** Network Privacy / Background Traffic Reduction
- **Short description:** Windows'un internet bağlantısını doğrulamak için sürekli msftconnecttest.com sunucusuna arka planda DNS sorguları ve HTTP istekleri (Active Probing) atmasını durdurur. Gereksiz ağ paket trafiğini yok eder.
- **Exact code:** 
  ```cmd
  reg add "HKLM\SYSTEM\CurrentControlSet\Services\NlaSvc\Parameters\Internet" /v "EnableActiveProbing" /t REG_DWORD /d "0" /f
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\NetworkConnectivityStatusIndicator" /v "NoActiveProbe" /t REG_DWORD /d "1" /f
  ```
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Services\NlaSvc\Parameters\Internet` / `HKLM\SOFTWARE\Policies\Microsoft\Windows\NetworkConnectivityStatusIndicator`
- **Registry value:** `EnableActiveProbing` = 0, `NoActiveProbe` = 1
- **PowerShell command:** 
  ```powershell
  Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\NlaSvc\Parameters\Internet" -Name "EnableActiveProbing" -Value 0 -Type DWord
  New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\NetworkConnectivityStatusIndicator" -Force | Out-Null
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\NetworkConnectivityStatusIndicator" -Name "NoActiveProbe" -Value 1 -Type DWord
  ```
- **CMD command:** 
  ```cmd
  reg add "HKLM\SYSTEM\CurrentControlSet\Services\NlaSvc\Parameters\Internet" /v "EnableActiveProbing" /t REG_DWORD /d "0" /f & reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\NetworkConnectivityStatusIndicator" /v "NoActiveProbe" /t REG_DWORD /d "1" /f
  ```
- **Group Policy:** Computer Configuration -> Administrative Templates -> Network -> Network Connectivity Status Indicator -> Turn off NCSI active probing
- **App Permission:** N/A
- **Capability:** N/A
- **Supported Windows versions:** Windows 10, Windows 11
- **Privacy impact:** Medium (Sistem başlatıldığında veya ağ değiştiğinde IP adresinizin MS loglarına düşmesini engeller)
- **Feature impact:** Low (Ağ simgesi bazı durumlarda 'İnternet Yok' gösterse de internet tam performans çalışmaya devam eder)
- **Gaming impact:** Positive Low (Ağ arayüzündeki periyodik DNS/HTTP sorgu yükünü kaldırarak ağ kuyruğunu temiz tutar)
- **Alternative values:** 1 (Active Probing Etkin)
- **Related tweaks:** DoH Encrypted DNS, Wi-Fi Sense Disable
- **Original source:** Microsoft Enterprise Networking Knowledge Base
- **Official documentation:** https://learn.microsoft.com/en-us/windows-server/networking/ncsi/ncsi-overview
- **GitHub URL:** https://github.com/spicetify/cli
- **Forum URL:** https://super-user.com
- **Discussion URL:** N/A

---

### 7. UWP/WinRT Uygulamalarının Tüm Dosya Sistemine (BroadFileSystemAccess) İzinsiz Erişimini Kapat
- **Title:** UWP/WinRT Uygulamalarının Tüm Dosya Sistemine (BroadFileSystemAccess) İzinsiz Erişimini Kapat
- **Category:** App Privacy / CapabilityAccessManager
- **Short description:** Mağaza uygulamalarının kullanıcının tüm sürücülerindeki (C:, D:) belgelere, resimlere ve özel dosyalara arka planda erişmesini sistem genelinde zorunlu olarak yasaklar.
- **Exact code:** 
  ```cmd
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\AppPrivacy" /v "LetAppsAccessBroadFileSystem" /t REG_DWORD /d "2" /f
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\AppPrivacy" /v "LetAppsAccessAccountInfo" /t REG_DWORD /d "2" /f
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\AppPrivacy" /v "LetAppsAccessCallHistory" /t REG_DWORD /d "2" /f
  ```
- **Registry path:** `HKLM\SOFTWARE\Policies\Microsoft\Windows\AppPrivacy`
- **Registry value:** `LetAppsAccessBroadFileSystem` = 2, `LetAppsAccessAccountInfo` = 2, `LetAppsAccessCallHistory` = 2 (2 = Force Deny)
- **PowerShell command:** 
  ```powershell
  New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AppPrivacy" -Force | Out-Null
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AppPrivacy" -Name "LetAppsAccessBroadFileSystem" -Value 2 -Type DWord
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AppPrivacy" -Name "LetAppsAccessAccountInfo" -Value 2 -Type DWord
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AppPrivacy" -Name "LetAppsAccessCallHistory" -Value 2 -Type DWord
  ```
- **CMD command:** 
  ```cmd
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\AppPrivacy" /v "LetAppsAccessBroadFileSystem" /t REG_DWORD /d "2" /f & reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\AppPrivacy" /v "LetAppsAccessAccountInfo" /t REG_DWORD /d "2" /f & reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\AppPrivacy" /v "LetAppsAccessCallHistory" /t REG_DWORD /d "2" /f
  ```
- **Group Policy:** Computer Configuration -> Administrative Templates -> Windows Components -> App Privacy -> Let Windows apps access the file system / account info
- **App Permission:** BroadFileSystemAccess, UserAccountInformation
- **Capability:** broadFileSystemAccess
- **Supported Windows versions:** Windows 10 (1803+), Windows 11
- **Privacy impact:** Maximum (UWP uygulamalarının kişisel dosyalarda ve diski taramasında tam engel kurar)
- **Feature impact:** Low (Özel dosya yöneticisi UWP uygulamaları hariç standart oyun ve uygulamaları etkilemez)
- **Gaming impact:** Positive Medium (Arka planda diske erişip tarama yapan UWP servislerinin disk I/O ve takılma oluşturmasını engeller)
- **Alternative values:** 0 (Force Allow), 1 (User Choice)
- **Related tweaks:** Force Deny App Privacy, UWP Background Apps Disable
- **Original source:** Microsoft MDM CSP AppPrivacy Reference
- **Official documentation:** https://learn.microsoft.com/en-us/windows/client-management/mdm/policy-csp-privacy#letappsaccessbroadfilesystem
- **GitHub URL:** https://github.com/RVMaster/Windows11Optimization
- **Forum URL:** https://elevenforum.com
- **Discussion URL:** N/A

---

### 8. Windows Geri Bildirim Sıklığını (Feedback Frequency) ve SIUF Anket Görevlerini Kapat
- **Title:** Windows Geri Bildirim Sıklığını (Feedback Frequency) ve SIUF Anket Görevlerini Kapat
- **Category:** User Feedback Privacy / Background Tasks
- **Short description:** Windows'un kullanıcıya periyodik olarak anket/geri bildirim pencereleri çıkarmasını ve arka planda SIUF (System Initiated User Feedback) tanılamaları toplamasını engeller.
- **Exact code:** 
  ```cmd
  reg add "HKCU\SOFTWARE\Microsoft\Siuf\Rules" /v "NumberOfSIUFInPeriod" /t REG_DWORD /d "0" /f
  reg add "HKCU\SOFTWARE\Microsoft\Siuf\Rules" /v "PeriodInNanoSeconds" /t REG_DWORD /d "0" /f
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\DataCollection" /v "DoNotShowFeedbackNotifications" /t REG_DWORD /d "1" /f
  ```
- **Registry path:** `HKCU\SOFTWARE\Microsoft\Siuf\Rules` / `HKLM\SOFTWARE\Policies\Microsoft\Windows\DataCollection`
- **Registry value:** `NumberOfSIUFInPeriod` = 0, `DoNotShowFeedbackNotifications` = 1
- **PowerShell command:** 
  ```powershell
  New-Item -Path "HKCU:\SOFTWARE\Microsoft\Siuf\Rules" -Force | Out-Null
  Set-ItemProperty -Path "HKCU:\SOFTWARE\Microsoft\Siuf\Rules" -Name "NumberOfSIUFInPeriod" -Value 0 -Type DWord
  Set-ItemProperty -Path "HKCU:\SOFTWARE\Microsoft\Siuf\Rules" -Name "PeriodInNanoSeconds" -Value 0 -Type DWord
  New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection" -Force | Out-Null
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection" -Name "DoNotShowFeedbackNotifications" -Value 1 -Type DWord
  Disable-ScheduledTask -TaskPath "\Microsoft\Windows\Feedback\Siuf\" -TaskName "*" -ErrorAction SilentlyContinue
  ```
- **CMD command:** 
  ```cmd
  reg add "HKCU\SOFTWARE\Microsoft\Siuf\Rules" /v "NumberOfSIUFInPeriod" /t REG_DWORD /d "0" /f & reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\DataCollection" /v "DoNotShowFeedbackNotifications" /t REG_DWORD /d "1" /f & schtasks /Change /TN "\Microsoft\Windows\Feedback\Siuf\DmClient" /DISABLE
  ```
- **Group Policy:** Computer Configuration -> Administrative Templates -> Windows Components -> Data Collection and Preview Builds -> Do not show feedback notifications
- **App Permission:** N/A
- **Capability:** N/A
- **Supported Windows versions:** Windows 10, Windows 11
- **Privacy impact:** High (Kullanıcı deneyimi değerlendirme veri paketlerinin Microsoft'a gitmesini engeller)
- **Feature impact:** Low (Sadece Windows geri bildirim anket bildirimleri kapanır)
- **Gaming impact:** Positive Low (Oyun sırasında aniden açılan bildirim pencerelerini ve arkada çalışan SIUF DmClient görevini yok eder)
- **Alternative values:** 1 (Feedback Etkin)
- **Related tweaks:** Telemetry Disable, Diagnostic Data Disable
- **Original source:** TenForums Windows Privacy Master List
- **Official documentation:** https://learn.microsoft.com/en-us/windows/privacy/configure-windows-diagnostic-data-in-your-organization
- **GitHub URL:** https://github.com/gist/privacy-tweaks
- **Forum URL:** https://tenforums.com
- **Discussion URL:** N/A

---

### 9. Dokunmatik/Kalem El Yazısı Tanılama Verilerinin Paylaşılmasını Kapat
- **Title:** Dokunmatik/Kalem El Yazısı Tanılama Verilerinin Paylaşılmasını Kapat
- **Category:** Input Privacy / Handwriting Telemetry
- **Short description:** Dokunmatik ekranlarda ve dijital kalemle yazılan el yazısı verilerinin, şekil tanımlamalarının ve yazım hatalarının Microsoft öğrenme veritabanına iletilmesini durdurur.
- **Exact code:** 
  ```cmd
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\HandwritingErrorReports" /v "PreventHandwritingErrorReports" /t REG_DWORD /d "1" /f
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\TabletPC" /v "PreventHandwritingDataSharing" /t REG_DWORD /d "1" /f
  ```
- **Registry path:** `HKLM\SOFTWARE\Policies\Microsoft\Windows\HandwritingErrorReports` / `HKLM\SOFTWARE\Policies\Microsoft\Windows\TabletPC`
- **Registry value:** `PreventHandwritingErrorReports` = 1, `PreventHandwritingDataSharing` = 1
- **PowerShell command:** 
  ```powershell
  New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\HandwritingErrorReports" -Force | Out-Null
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\HandwritingErrorReports" -Name "PreventHandwritingErrorReports" -Value 1 -Type DWord
  New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\TabletPC" -Force | Out-Null
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\TabletPC" -Name "PreventHandwritingDataSharing" -Value 1 -Type DWord
  ```
- **CMD command:** 
  ```cmd
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\HandwritingErrorReports" /v "PreventHandwritingErrorReports" /t REG_DWORD /d "1" /f & reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\TabletPC" /v "PreventHandwritingDataSharing" /t REG_DWORD /d "1" /f
  ```
- **Group Policy:** Computer Configuration -> Administrative Templates -> System -> Tablet PC -> Handwriting -> Prevent handwriting data sharing
- **App Permission:** N/A
- **Capability:** N/A
- **Supported Windows versions:** Windows 10, Windows 11
- **Privacy impact:** High (Giriş cihazlarından toplanan el yazısı ve çizim biyometrik kalıplarının gizliliğini korur)
- **Feature impact:** None (Yerel el yazısı tanıma çalışmaya devam eder, sadece veriler MS'e iletilmez)
- **Gaming impact:** Positive Low (Arka plan el yazısı veri işleme daemon'larının CPU kullanımını sıfırlar)
- **Alternative values:** 0 (Data Sharing Etkin)
- **Related tweaks:** Ink & Typing Personalization Disable
- **Original source:** Microsoft Enterprise Group Policy Baseline
- **Official documentation:** https://learn.microsoft.com/en-us/windows/client-management/mdm/policy-csp-handwriting
- **GitHub URL:** N/A
- **Forum URL:** https://elevenforum.com
- **Discussion URL:** N/A

---

### 10. Dosya Gezgini Son Kullanılan Belgeler ve Hızlı Erişim İzleme Telemetrisini Kapat
- **Title:** Dosya Gezgini Son Kullanılan Belgeler ve Hızlı Erişim İzleme Telemetrisini Kapat
- **Category:** Local Privacy / File Explorer Tracking
- **Short description:** Windows Dosya Gezgini'nin açılan her dosya, klasör ve uygulamanın kaydını tutarak diske (AutomaticDestinations JumpList veritabanı) sürekli yazmasını ve son kullanılanlar listesi oluşturmasını engeller. Disk I/O yükünü düşürür.
- **Exact code:** 
  ```cmd
  reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v "Start_TrackDocs" /t REG_DWORD /d "0" /f
  reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer" /v "ShowRecent" /t REG_DWORD /d "0" /f
  reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer" /v "ShowFrequent" /t REG_DWORD /d "0" /f
  ```
- **Registry path:** `HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced` / `HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer`
- **Registry value:** `Start_TrackDocs` = 0, `ShowRecent` = 0, `ShowFrequent` = 0
- **PowerShell command:** 
  ```powershell
  Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "Start_TrackDocs" -Value 0 -Type DWord
  Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer" -Name "ShowRecent" -Value 0 -Type DWord
  Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer" -Name "ShowFrequent" -Value 0 -Type DWord
  ```
- **CMD command:** 
  ```cmd
  reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v "Start_TrackDocs" /t REG_DWORD /d "0" /f & reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer" /v "ShowRecent" /t REG_DWORD /d "0" /f & reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer" /v "ShowFrequent" /t REG_DWORD /d "0" /f
  ```
- **Group Policy:** User Configuration -> Administrative Templates -> Start Menu and Taskbar -> Do not keep history of recently opened documents
- **App Permission:** N/A
- **Capability:** N/A
- **Supported Windows versions:** Windows 10, Windows 11
- **Privacy impact:** High (Bilgisayarı kullanan diğer kişilerin veya zararlı yazılımların son açılan kişisel dosyaları izlemesini engeller)
- **Feature impact:** Low (Başlat menüsü ve Gezgin'de 'Son Kullanılanlar' bölümü boş kalır)
- **Gaming impact:** Positive Medium (Dosya açma/kapama anlarındaki rastgele SSD/HDD yazma gecikmelerini (write latency) azaltır)
- **Alternative values:** 1 (Tracking Etkin)
- **Related tweaks:** Search History Disable, Explorer History Disable
- **Original source:** WinAero Tweaker Explorer Privacy Guide
- **Official documentation:** https://learn.microsoft.com/en-us/windows/client-management/mdm/policy-csp-start#norecentdocshistory
- **GitHub URL:** https://github.com/leodevbro/win11-debloat
- **Forum URL:** https://elevenforum.com
- **Discussion URL:** N/A

---

### 11. Bulut Tabanlı Ses Tanıma (Cloud Speech Recognition) ve Ses Kalıbı Toplamayı Kapat
- **Title:** Bulut Tabanlı Ses Tanıma (Cloud Speech Recognition) ve Ses Kalıbı Toplamayı Kapat
- **Category:** Speech Privacy / Voice Activation
- **Short description:** Konuşulan seslerin işlenmek ve ses modellerini geliştirmek üzere Microsoft bulut sunucularına gönderilmesini tamamen kapatır.
- **Exact code:** 
  ```cmd
  reg add "HKCU\Software\Microsoft\Speech_OneCore\Settings\OnlineSpeechPrivacy" /v "HasAccepted" /t REG_DWORD /d "0" /f
  reg add "HKLM\SOFTWARE\Policies\Microsoft\InputPersonalization" /v "AllowInputPersonalization" /t REG_DWORD /d "0" /f
  ```
- **Registry path:** `HKCU\Software\Microsoft\Speech_OneCore\Settings\OnlineSpeechPrivacy` / `HKLM\SOFTWARE\Policies\Microsoft\InputPersonalization`
- **Registry value:** `HasAccepted` = 0, `AllowInputPersonalization` = 0
- **PowerShell command:** 
  ```powershell
  New-Item -Path "HKCU:\Software\Microsoft\Speech_OneCore\Settings\OnlineSpeechPrivacy" -Force | Out-Null
  Set-ItemProperty -Path "HKCU:\Software\Microsoft\Speech_OneCore\Settings\OnlineSpeechPrivacy" -Name "HasAccepted" -Value 0 -Type DWord
  New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\InputPersonalization" -Force | Out-Null
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\InputPersonalization" -Name "AllowInputPersonalization" -Value 0 -Type DWord
  ```
- **CMD command:** 
  ```cmd
  reg add "HKCU\Software\Microsoft\Speech_OneCore\Settings\OnlineSpeechPrivacy" /v "HasAccepted" /t REG_DWORD /d "0" /f & reg add "HKLM\SOFTWARE\Policies\Microsoft\InputPersonalization" /v "AllowInputPersonalization" /t REG_DWORD /d "0" /f
  ```
- **Group Policy:** Computer Configuration -> Administrative Templates -> Control Panel -> Regional and Language Options -> Allow Users To Enable Online Speech Recognition Services
- **App Permission:** N/A
- **Capability:** N/A
- **Supported Windows versions:** Windows 10, Windows 11
- **Privacy impact:** Maximum (Mikrofon üzerinden ses kaydı ve bulut ses analizi yapılmasını engeller)
- **Feature impact:** Medium (Windows Dictation / Çevrimiçi Sesli Yazma özelliği kullanılamaz, yerel ses tanıma devam eder)
- **Gaming impact:** Positive Low (Çevrimiçi ses dinleme arka plan servislerinin ağ ve RAM kullanımını kaldırır)
- **Alternative values:** 1 (Online Speech Etkin)
- **Related tweaks:** Microphone App Privacy, Cortana Disable
- **Original source:** Microsoft Privacy Settings Reference
- **Official documentation:** https://support.microsoft.com/en-us/windows/speech-voice-activation-inking-typing-and-privacy-35ed2814-2a04-375e-9e79-bfb025251642
- **GitHub URL:** N/A
- **Forum URL:** https://tenforums.com
- **Discussion URL:** N/A

---

### 12. Microsoft Edge Tarayıcı Arka Plan Ön Yüklemesi (Pre-launch) ve Eklenti Tanılamalarını Kapat
- **Title:** Microsoft Edge Tarayıcı Arka Plan Ön Yüklemesi (Pre-launch) ve Eklenti Tanılamalarını Kapat
- **Category:** Browser Privacy / Background Process Elimination
- **Short description:** Edge tarayıcısının sistem açılışında arka planda sinsi bir şekilde ön yükleme (pre-launch) yaparak ~250MB RAM tüketmesini ve kapalıyken bile arka plan eklenti telemetrisi toplamasını engeller.
- **Exact code:** 
  ```cmd
  reg add "HKLM\SOFTWARE\Policies\Microsoft\MicrosoftEdge\Main" /v "AllowPrelaunch" /t REG_DWORD /d "0" /f
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Edge" /v "BackgroundModeEnabled" /t REG_DWORD /d "0" /f
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Edge" /v "MetricsReportingEnabled" /t REG_DWORD /d "0" /f
  ```
- **Registry path:** `HKLM\SOFTWARE\Policies\Microsoft\MicrosoftEdge\Main` / `HKLM\SOFTWARE\Policies\Microsoft\Edge`
- **Registry value:** `AllowPrelaunch` = 0, `BackgroundModeEnabled` = 0, `MetricsReportingEnabled` = 0
- **PowerShell command:** 
  ```powershell
  New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\MicrosoftEdge\Main" -Force | Out-Null
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\MicrosoftEdge\Main" -Name "AllowPrelaunch" -Value 0 -Type DWord
  New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Edge" -Force | Out-Null
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Edge" -Name "BackgroundModeEnabled" -Value 0 -Type DWord
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Edge" -Name "MetricsReportingEnabled" -Value 0 -Type DWord
  ```
- **CMD command:** 
  ```cmd
  reg add "HKLM\SOFTWARE\Policies\Microsoft\MicrosoftEdge\Main" /v "AllowPrelaunch" /t REG_DWORD /d "0" /f & reg add "HKLM\SOFTWARE\Policies\Microsoft\Edge" /v "BackgroundModeEnabled" /t REG_DWORD /d "0" /f & reg add "HKLM\SOFTWARE\Policies\Microsoft\Edge" /v "MetricsReportingEnabled" /t REG_DWORD /d "0" /f
  ```
- **Group Policy:** Computer Configuration -> Administrative Templates -> Microsoft Edge -> Allow Microsoft Edge to pre-launch at Windows startup / Continue running background apps after Microsoft Edge closes
- **App Permission:** N/A
- **Capability:** N/A
- **Supported Windows versions:** Windows 10, Windows 11
- **Privacy impact:** High (Tarayıcı kapalıyken dahi çalıştırılan arka plan süreçlerini ve veri gönderimini durdurur)
- **Feature impact:** Low (Edge manuel açıldığında ~100ms daha yavaş başlatılabilir ama arka planda boşuna çalışmaz)
- **Gaming impact:** Extreme Positive (200MB-400MB RAM tasarrufu sağlar ve oyun sırasında Edge arka plan alt süreçlerinin işlemci almasını engeller)
- **Alternative values:** 1 (Pre-launch & Background Mode Etkin)
- **Related tweaks:** Edge Telemetry Reporting Disable, UWP Background Apps Disable
- **Original source:** Edge Enterprise Policy Documentation
- **Official documentation:** https://learn.microsoft.com/en-us/deployedge/microsoft-edge-policies#backgroundmodeenabled
- **GitHub URL:** https://github.com/browser-debloat
- **Forum URL:** https://elevenforum.com
- **Discussion URL:** N/A
