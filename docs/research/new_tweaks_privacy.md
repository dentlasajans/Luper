# Yeni Windows Gizlilik (Privacy) Optimizasyon Kodları Araştırma Raporu

**Oluşturulma Tarihi:** 2026-07-30  
**Hedef Veritabanı:** `C:\Luper\docs\database\privacy.json` (Gözden geçirildi, çakışanlar atlandı)  
**Kapsam:** Windows 10 ve Windows 11 Sistem ve Uygulama Gizliliği, Yapay Zeka (Recall, Copilot), Donanım İzinleri, Ağ ve Tarayıcı Gizliliği  

---

## Optimizasyon Kartları

### 1. Windows 11 Recall AI Snapshot Analizini ve Geçmişini Kapat (Windows AI)
- **Title:** Windows 11 Recall AI Snapshot Analizini ve Geçmişini Kapat
- **Category:** Recall Privacy / Windows AI
- **Short description:** Windows 11 Copilot+ sistemlerde ekran görüntüsü alma, snapshot analizi ve Recall geçmişini tamamen devre dışı bırakır.
- **Exact code:** 
  ```cmd
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" /v "DisableAIDataAnalysis" /t REG_DWORD /d "1" /f
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" /v "AllowRecallEnablement" /t REG_DWORD /d "0" /f
  ```
- **Registry path:** `HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsAI`
- **Registry value:** `DisableAIDataAnalysis` = 1, `AllowRecallEnablement` = 0
- **PowerShell command:** 
  ```powershell
  New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" -Force | Out-Null
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" -Name "DisableAIDataAnalysis" -Value 1 -Type DWord
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" -Name "AllowRecallEnablement" -Value 0 -Type DWord
  ```
- **CMD command:** 
  ```cmd
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" /v "DisableAIDataAnalysis" /t REG_DWORD /d "1" /f & reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" /v "AllowRecallEnablement" /t REG_DWORD /d "0" /f
  ```
- **Group Policy:** Computer Configuration -> Administrative Templates -> Windows Components -> Windows AI -> Disable Saving Snapshots for Windows / Allow Recall to be enabled
- **App Permission:** N/A
- **Capability:** N/A
- **Supported Windows versions:** Windows 11 (24H2+)
- **Privacy impact:** Maximum (Ekran görüntüsü kaydı ve yerel AI indekslemesi tamamen engellenir)
- **Feature impact:** Low (Windows Recall özelliği kullanılamaz)
- **Gaming impact:** Positive (Arka plan NPU/CPU ve SSD I/O yükünü ortadan kaldırır)
- **Alternative values:** 0 (Recall/AI Etkin)
- **Related tweaks:** Copilot Privacy, Activity History Privacy
- **Original source:** Microsoft Enterprise Group Policy Baseline
- **Official documentation:** https://learn.microsoft.com/en-us/windows/client-management/mdm/policy-csp-windowsai
- **GitHub URL:** N/A
- **Forum URL:** https://elevenforum.com
- **Discussion URL:** N/A

---

### 2. Windows Copilot Sistem Bütünleşmesini ve Arka Plan Servisini Kapat
- **Title:** Windows Copilot Sistem Bütünleşmesini ve Arka Plan Servisini Kapat
- **Category:** Copilot Privacy / AI Features
- **Short description:** Windows 11 işletim sistemindeki yerleşik Windows Copilot asistanını ve arka plan veri akışını devre dışı bırakır.
- **Exact code:** 
  ```cmd
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsCopilot" /v "TurnOffWindowsCopilot" /t REG_DWORD /d "1" /f
  reg add "HKCU\Software\Policies\Microsoft\Windows\WindowsCopilot" /v "TurnOffWindowsCopilot" /t REG_DWORD /d "1" /f
  ```
- **Registry path:** `HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsCopilot` / `HKCU\Software\Policies\Microsoft\Windows\WindowsCopilot`
- **Registry value:** `TurnOffWindowsCopilot` = 1
- **PowerShell command:** 
  ```powershell
  New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsCopilot" -Force | Out-Null
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsCopilot" -Name "TurnOffWindowsCopilot" -Value 1 -Type DWord
  New-Item -Path "HKCU:\Software\Policies\Microsoft\Windows\WindowsCopilot" -Force | Out-Null
  Set-ItemProperty -Path "HKCU:\Software\Policies\Microsoft\Windows\WindowsCopilot" -Name "TurnOffWindowsCopilot" -Value 1 -Type DWord
  ```
- **CMD command:** 
  ```cmd
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsCopilot" /v "TurnOffWindowsCopilot" /t REG_DWORD /d "1" /f & reg add "HKCU\Software\Policies\Microsoft\Windows\WindowsCopilot" /v "TurnOffWindowsCopilot" /t REG_DWORD /d "1" /f
  ```
- **Group Policy:** User Configuration / Computer Configuration -> Administrative Templates -> Windows Components -> Windows Copilot -> Turn off Windows Copilot
- **App Permission:** N/A
- **Capability:** N/A
- **Supported Windows versions:** Windows 11 (23H2, 24H2)
- **Privacy impact:** High (Yapay zeka asistanının masaüstü ve tarayıcı verisi toplamasını durdurur)
- **Feature impact:** Medium (Copilot paneli ve kısayolları kapanır)
- **Gaming impact:** Positive Low (Arka plan ağ trafiğini ve WebView2 RAM kullanımını düşürür)
- **Alternative values:** 0 (Copilot Etkin)
- **Related tweaks:** Edge Copilot Disable, Recall Privacy
- **Original source:** Microsoft MDM CSP Documentation
- **Official documentation:** https://learn.microsoft.com/en-us/windows/client-management/mdm/policy-csp-windowscopilot
- **GitHub URL:** N/A
- **Forum URL:** https://elevenforum.com
- **Discussion URL:** N/A

---

### 3. Windows Uygulama Gizlilik İzinlerini Zorunlu Engelleyin (CapabilityAccessManager / AppPrivacy)
- **Title:** Windows Uygulama Gizlilik İzinlerini Zorunlu Engelleyin (Kamera, Mikrofon, Konum, Kişiler)
- **Category:** App Privacy / CapabilityAccessManager
- **Short description:** Windows uygulamalarının Kamera, Mikrofon, Konum ve Kişiler gibi hassas donanım ve verilere izinsiz erişimini sistem politikası düzeyinde zorunlu olarak kapatır (Force Deny).
- **Exact code:** 
  ```cmd
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\AppPrivacy" /v "LetAppsAccessCamera" /t REG_DWORD /d "2" /f
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\AppPrivacy" /v "LetAppsAccessMicrophone" /t REG_DWORD /d "2" /f
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\AppPrivacy" /v "LetAppsAccessLocation" /t REG_DWORD /d "2" /f
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\AppPrivacy" /v "LetAppsAccessContacts" /t REG_DWORD /d "2" /f
  ```
- **Registry path:** `HKLM\SOFTWARE\Policies\Microsoft\Windows\AppPrivacy`
- **Registry value:** `LetAppsAccessCamera` = 2, `LetAppsAccessMicrophone` = 2, `LetAppsAccessLocation` = 2, `LetAppsAccessContacts` = 2 (2 = Force Deny, 1 = User Control, 0 = Force Allow)
- **PowerShell command:** 
  ```powershell
  New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AppPrivacy" -Force | Out-Null
  @('LetAppsAccessCamera','LetAppsAccessMicrophone','LetAppsAccessLocation','LetAppsAccessContacts') | ForEach-Object {
      Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AppPrivacy" -Name $_ -Value 2 -Type DWord
  }
  ```
- **CMD command:** 
  ```cmd
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\AppPrivacy" /v "LetAppsAccessCamera" /t REG_DWORD /d "2" /f & reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\AppPrivacy" /v "LetAppsAccessMicrophone" /t REG_DWORD /d "2" /f & reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\AppPrivacy" /v "LetAppsAccessLocation" /t REG_DWORD /d "2" /f & reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\AppPrivacy" /v "LetAppsAccessContacts" /t REG_DWORD /d "2" /f
  ```
- **Group Policy:** Computer Configuration -> Administrative Templates -> Windows Components -> App Privacy
- **App Permission:** webcam, microphone, location, contacts
- **Capability:** CapabilityAccessManager ConsentStore Policies
- **Supported Windows versions:** Windows 10, Windows 11
- **Privacy impact:** Maximum (Sistem düzeyinde izinsiz donanım/veri erişimini engeller)
- **Feature impact:** Medium (Uygulamaların kamera/mikrofon/konum erişimini kısıtlar)
- **Gaming impact:** None
- **Alternative values:** 1 (User in control), 0 (Force Allow)
- **Related tweaks:** LocationAndSensors Privacy, Background Apps Privacy
- **Original source:** Microsoft Group Policy Reference
- **Official documentation:** https://learn.microsoft.com/en-us/windows/privacy/privacy-controls-win11
- **GitHub URL:** N/A
- **Forum URL:** N/A
- **Discussion URL:** N/A

---

### 4. Bulut Pano ve Cihazlar Arası Pano Eşitlemesini Kapat (Cloud Clipboard & Cross-Device Sync)
- **Title:** Bulut Pano ve Cihazlar Arası Pano Eşitlemesini Kapat
- **Category:** Clipboard Privacy / Cloud Privacy
- **Short description:** Kopyalanan hassas verilerin (şifreler, metinler) Microsoft bulut sunucularına gönderilmesini ve diğer cihazlarla eşitlenmesini engeller.
- **Exact code:** 
  ```cmd
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\System" /v "AllowClipboardHistory" /t REG_DWORD /d "0" /f
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\System" /v "AllowCrossDeviceClipboard" /t REG_DWORD /d "0" /f
  ```
- **Registry path:** `HKLM\SOFTWARE\Policies\Microsoft\Windows\System`
- **Registry value:** `AllowClipboardHistory` = 0, `AllowCrossDeviceClipboard` = 0
- **PowerShell command:** 
  ```powershell
  New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\System" -Force | Out-Null
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\System" -Name "AllowClipboardHistory" -Value 0 -Type DWord
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\System" -Name "AllowCrossDeviceClipboard" -Value 0 -Type DWord
  ```
- **CMD command:** 
  ```cmd
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\System" /v "AllowClipboardHistory" /t REG_DWORD /d "0" /f & reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\System" /v "AllowCrossDeviceClipboard" /t REG_DWORD /d "0" /f
  ```
- **Group Policy:** Computer Configuration -> Administrative Templates -> System -> OS Policies -> Allow Clipboard History / Allow Clipboard synchronization across devices
- **App Permission:** N/A
- **Capability:** N/A
- **Supported Windows versions:** Windows 10 (1809+), Windows 11
- **Privacy impact:** High (Panoya kopyalanan özel verilerin buluta sızması engellenir)
- **Feature impact:** Low (Win+V pano geçmişi ve cihazlar arası pano aktarımı kapanır)
- **Gaming impact:** Positive Low (Arka plan senkronizasyon ağ çağrılarını azaltır)
- **Alternative values:** 1 (Enabled)
- **Related tweaks:** Activity History, Microsoft Account Sync
- **Original source:** PrivacyGuides & Windows Security Baseline
- **Official documentation:** https://learn.microsoft.com/en-us/windows/client-management/mdm/policy-csp-system#system-allowcrossdeviceclipboard
- **GitHub URL:** N/A
- **Forum URL:** https://tenforums.com
- **Discussion URL:** N/A

---

### 5. Windows Mürekkep Oluşturma ve Yazma Kişiselleştirmesini Kapat (Ink & Typing Personalization)
- **Title:** Windows Mürekkep Oluşturma ve Yazma Kişiselleştirmesini Kapat
- **Category:** Speech & Typing Privacy / InputPersonalization
- **Short description:** Klavyede yazılan kelimelerin ve dokunmatik ekrandaki el yazısı kalıplarının Microsoft'a gönderilerek sözlük/öğrenme veritabanına kaydedilmesini durdurur.
- **Exact code:** 
  ```cmd
  reg add "HKCU\Software\Microsoft\InputPersonalization" /v "RestrictImplicitTextCollection" /t REG_DWORD /d "1" /f
  reg add "HKCU\Software\Microsoft\InputPersonalization" /v "RestrictImplicitInkCollection" /t REG_DWORD /d "1" /f
  reg add "HKLM\SOFTWARE\Policies\Microsoft\InputPersonalization" /v "AllowInputPersonalization" /t REG_DWORD /d "0" /f
  ```
- **Registry path:** `HKCU\Software\Microsoft\InputPersonalization` / `HKLM\SOFTWARE\Policies\Microsoft\InputPersonalization`
- **Registry value:** `RestrictImplicitTextCollection` = 1, `RestrictImplicitInkCollection` = 1, `AllowInputPersonalization` = 0
- **PowerShell command:** 
  ```powershell
  New-Item -Path "HKCU:\Software\Microsoft\InputPersonalization" -Force | Out-Null
  Set-ItemProperty -Path "HKCU:\Software\Microsoft\InputPersonalization" -Name "RestrictImplicitTextCollection" -Value 1 -Type DWord
  Set-ItemProperty -Path "HKCU:\Software\Microsoft\InputPersonalization" -Name "RestrictImplicitInkCollection" -Value 1 -Type DWord
  New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\InputPersonalization" -Force | Out-Null
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\InputPersonalization" -Name "AllowInputPersonalization" -Value 0 -Type DWord
  ```
- **CMD command:** 
  ```cmd
  reg add "HKCU\Software\Microsoft\InputPersonalization" /v "RestrictImplicitTextCollection" /t REG_DWORD /d "1" /f & reg add "HKCU\Software\Microsoft\InputPersonalization" /v "RestrictImplicitInkCollection" /t REG_DWORD /d "1" /f & reg add "HKLM\SOFTWARE\Policies\Microsoft\InputPersonalization" /v "AllowInputPersonalization" /t REG_DWORD /d "0" /f
  ```
- **Group Policy:** Computer Configuration -> Administrative Templates -> Control Panel -> Regional and Language Options -> Allow Input Personalization
- **App Permission:** N/A
- **Capability:** N/A
- **Supported Windows versions:** Windows 10, Windows 11
- **Privacy impact:** High (Kelime ve yazı stili kalıplarının toplanmasını engeller)
- **Feature impact:** Low (Kişiselleştirilmiş kelime tahminleri devre dışı kalır)
- **Gaming impact:** Positive Low (Giriş işleme üzerindeki arka plan analiz yükünü azaltır)
- **Alternative values:** 0 (Text/Ink Collection Allowed)
- **Related tweaks:** Speech Recognition Privacy, Telemetry Privacy
- **Original source:** Microsoft Privacy Documentation
- **Official documentation:** https://learn.microsoft.com/en-us/windows/privacy/windows-11-privacy-components
- **GitHub URL:** N/A
- **Forum URL:** https://elevenforum.com
- **Discussion URL:** N/A

---

### 6. Windows Konum Servislerini ve Sensör Verilerini Tamamen Kapat (Location & Sensors)
- **Title:** Windows Konum Servislerini ve Sensör Verilerini Tamamen Kapat
- **Category:** Location Privacy / Hardware Sensors
- **Short description:** Windows konum takibini, konum betiklerini ve cihaz sensörlerini (ışık, ivmeölçer vb.) sistem politikasında devre dışı bırakır.
- **Exact code:** 
  ```cmd
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\LocationAndSensors" /v "DisableLocation" /t REG_DWORD /d "1" /f
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\LocationAndSensors" /v "DisableLocationScripting" /t REG_DWORD /d "1" /f
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\LocationAndSensors" /v "DisableSensors" /t REG_DWORD /d "1" /f
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\LocationAndSensors" /v "DisableWindowsLocationProvider" /t REG_DWORD /d "1" /f
  ```
- **Registry path:** `HKLM\SOFTWARE\Policies\Microsoft\Windows\LocationAndSensors`
- **Registry value:** `DisableLocation` = 1, `DisableLocationScripting` = 1, `DisableSensors` = 1, `DisableWindowsLocationProvider` = 1
- **PowerShell command:** 
  ```powershell
  New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\LocationAndSensors" -Force | Out-Null
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\LocationAndSensors" -Name "DisableLocation" -Value 1 -Type DWord
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\LocationAndSensors" -Name "DisableLocationScripting" -Value 1 -Type DWord
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\LocationAndSensors" -Name "DisableSensors" -Value 1 -Type DWord
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\LocationAndSensors" -Name "DisableWindowsLocationProvider" -Value 1 -Type DWord
  ```
- **CMD command:** 
  ```cmd
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\LocationAndSensors" /v "DisableLocation" /t REG_DWORD /d "1" /f & reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\LocationAndSensors" /v "DisableLocationScripting" /t REG_DWORD /d "1" /f & reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\LocationAndSensors" /v "DisableSensors" /t REG_DWORD /d "1" /f & reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\LocationAndSensors" /v "DisableWindowsLocationProvider" /t REG_DWORD /d "1" /f
  ```
- **Group Policy:** Computer Configuration -> Administrative Templates -> Windows Components -> Location and Sensors -> Turn off location / Turn off location scripting / Turn off sensors
- **App Permission:** location
- **Capability:** CapabilityAccessManager Location ConsentStore
- **Supported Windows versions:** Windows 10, Windows 11
- **Privacy impact:** Maximum (Coğrafi konum verilerinin web siteleri ve uygulamalarca izlenmesi engellenir)
- **Feature impact:** Medium (Harita ve hava durumu gibi konum bazlı uygulamalar otomatik konum alamaz)
- **Gaming impact:** Positive Low (Arka plan konum tarama sorgularını engeller)
- **Alternative values:** 0 (Location Enabled)
- **Related tweaks:** AppPrivacy Location, Wi-Fi Privacy
- **Original source:** Microsoft Enterprise Security Policy
- **Official documentation:** https://learn.microsoft.com/en-us/windows/client-management/mdm/policy-csp-location
- **GitHub URL:** N/A
- **Forum URL:** https://tenforums.com
- **Discussion URL:** N/A

---

### 7. Windows Spotlight ve Tüketici Deneyimi Önerilerini Kapat (Cloud Content / Consumer Features)
- **Title:** Windows Spotlight ve Tüketici Deneyimi Önerilerini Kapat
- **Category:** Windows Spotlight / Suggested Content Privacy
- **Short description:** Kilit ekranı dinamik görsellerini, Başlat menüsü ve Ayarlar içerisindeki Microsoft reklam/ipucu önerilerini, tüketici deneyimlerini tamamen engeller.
- **Exact code:** 
  ```cmd
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\CloudContent" /v "DisableWindowsSpotlightFeatures" /t REG_DWORD /d "1" /f
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\CloudContent" /v "DisableWindowsConsumerFeatures" /t REG_DWORD /d "1" /f
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\CloudContent" /v "DisableSoftLanding" /t REG_DWORD /d "1" /f
  reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" /v "SubscribedContent-338388Enabled" /t REG_DWORD /d "0" /f
  ```
- **Registry path:** `HKLM\SOFTWARE\Policies\Microsoft\Windows\CloudContent` / `HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager`
- **Registry value:** `DisableWindowsSpotlightFeatures` = 1, `DisableWindowsConsumerFeatures` = 1, `DisableSoftLanding` = 1, `SubscribedContent-338388Enabled` = 0
- **PowerShell command:** 
  ```powershell
  New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\CloudContent" -Force | Out-Null
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\CloudContent" -Name "DisableWindowsSpotlightFeatures" -Value 1 -Type DWord
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\CloudContent" -Name "DisableWindowsConsumerFeatures" -Value 1 -Type DWord
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\CloudContent" -Name "DisableSoftLanding" -Value 1 -Type DWord
  New-Item -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" -Force | Out-Null
  Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" -Name "SubscribedContent-338388Enabled" -Value 0 -Type DWord
  ```
- **CMD command:** 
  ```cmd
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\CloudContent" /v "DisableWindowsSpotlightFeatures" /t REG_DWORD /d "1" /f & reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\CloudContent" /v "DisableWindowsConsumerFeatures" /t REG_DWORD /d "1" /f & reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\CloudContent" /v "DisableSoftLanding" /t REG_DWORD /d "1" /f & reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" /v "SubscribedContent-338388Enabled" /t REG_DWORD /d "0" /f
  ```
- **Group Policy:** Computer Configuration -> Administrative Templates -> Windows Components -> Cloud Content -> Turn off all Windows Spotlight features / Turn off Microsoft consumer experiences
- **App Permission:** N/A
- **Capability:** N/A
- **Supported Windows versions:** Windows 10, Windows 11
- **Privacy impact:** High (Arka plan dinamik görsel ve öneri indiricilerinin veri takibini keser)
- **Feature impact:** Low (Kilit ekranı sabit arka plan olur, öneri bildirimleri engellenir)
- **Gaming impact:** Positive Low (Arka plan ağ veri akışını düşürür)
- **Alternative values:** 0 (Enabled)
- **Related tweaks:** Widgets Privacy, Tailored Experiences
- **Original source:** Group Policy Administrative Templates Reference
- **Official documentation:** https://learn.microsoft.com/en-us/windows/client-management/mdm/policy-csp-experience
- **GitHub URL:** N/A
- **Forum URL:** https://elevenforum.com
- **Discussion URL:** N/A

---

### 8. Windows 11 Widget Panosunu ve Haber Akışını Kapat (Widgets & News)
- **Title:** Windows 11 Widget Panosunu ve Haber Akışını Kapat
- **Category:** Widgets Privacy / Windows Shell
- **Short description:** Windows 11 Görev Çubuğundaki Widget panosunu, MSN haber akışını ve arka plan veri trafiğini tamamen devre dışı bırakır.
- **Exact code:** 
  ```cmd
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Dsh" /v "AllowNewsAndInterests" /t REG_DWORD /d "0" /f
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Dsh" /v "DisableWidgetsBoard" /t REG_DWORD /d "1" /f
  ```
- **Registry path:** `HKLM\SOFTWARE\Policies\Microsoft\Dsh`
- **Registry value:** `AllowNewsAndInterests` = 0, `DisableWidgetsBoard` = 1
- **PowerShell command:** 
  ```powershell
  New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Dsh" -Force | Out-Null
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Dsh" -Name "AllowNewsAndInterests" -Value 0 -Type DWord
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Dsh" -Name "DisableWidgetsBoard" -Value 1 -Type DWord
  ```
- **CMD command:** 
  ```cmd
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Dsh" /v "AllowNewsAndInterests" /t REG_DWORD /d "0" /f & reg add "HKLM\SOFTWARE\Policies\Microsoft\Dsh" /v "DisableWidgetsBoard" /t REG_DWORD /d "1" /f
  ```
- **Group Policy:** Computer Configuration -> Administrative Templates -> Windows Components -> Widgets -> Allow news and interests
- **App Permission:** N/A
- **Capability:** N/A
- **Supported Windows versions:** Windows 11
- **Privacy impact:** High (Arka plan MSN haber ve konum takip trafiğini keser)
- **Feature impact:** Medium (Görev çubuğu widget ikonu ve panosu kapanır)
- **Gaming impact:** Positive Medium (WebView2 arka plan RAM ve CPU yükünü azaltır)
- **Alternative values:** 1 (Allowed)
- **Related tweaks:** Search Suggestions, Windows Spotlight
- **Original source:** Microsoft Docs & Windows 11 Enterprise Policy
- **Official documentation:** https://learn.microsoft.com/en-us/windows/client-management/mdm/policy-csp-dsh
- **GitHub URL:** N/A
- **Forum URL:** https://elevenforum.com
- **Discussion URL:** N/A

---

### 9. Windows Defender MAPS (SpyNet) Telemetrisini ve Otomatik Örnek Gönderimini Kapat
- **Title:** Windows Defender MAPS (SpyNet) Telemetrisini ve Otomatik Örnek Gönderimini Kapat
- **Category:** Defender Privacy / Security Telemetry
- **Short description:** Microsoft Defender'ın şüpheli dosyaları ve kullanım verilerini Microsoft bulut sunucularına otomatik olarak göndermesini durdurur.
- **Exact code:** 
  ```cmd
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender\Spynet" /v "SpynetReporting" /t REG_DWORD /d "0" /f
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender\Spynet" /v "SubmitSamplesConsent" /t REG_DWORD /d "2" /f
  ```
- **Registry path:** `HKLM\SOFTWARE\Policies\Microsoft\Windows Defender\Spynet`
- **Registry value:** `SpynetReporting` = 0 (Disabled), `SubmitSamplesConsent` = 2 (Never Send)
- **PowerShell command:** 
  ```powershell
  New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows Defender\Spynet" -Force | Out-Null
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows Defender\Spynet" -Name "SpynetReporting" -Value 0 -Type DWord
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows Defender\Spynet" -Name "SubmitSamplesConsent" -Value 2 -Type DWord
  ```
- **CMD command:** 
  ```cmd
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender\Spynet" /v "SpynetReporting" /t REG_DWORD /d "0" /f & reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender\Spynet" /v "SubmitSamplesConsent" /t REG_DWORD /d "2" /f
  ```
- **Group Policy:** Computer Configuration -> Administrative Templates -> Windows Components -> Microsoft Defender Antivirus -> MAPS -> Join Microsoft MAPS / Send file samples when further analysis is required
- **App Permission:** N/A
- **Capability:** N/A
- **Supported Windows versions:** Windows 10, Windows 11
- **Privacy impact:** High (Kişisel dosyalarınızın veya özel verilerinizin Microsoft'a yüklenmesini önler)
- **Feature impact:** Low (Defender taramayı yerel imza veritabanı ile sürdürür)
- **Gaming impact:** Positive Low (Dosya yükleme sırasındaki ağ ve disk I/O yükünü ortadan kaldırır)
- **Alternative values:** `SpynetReporting`: 1 (Basic), 2 (Advanced); `SubmitSamplesConsent`: 1 (Always send), 3 (Send safe samples)
- **Related tweaks:** Telemetry Privacy, Diagnostic Data
- **Original source:** Microsoft Defender Security Policy Documentation
- **Official documentation:** https://learn.microsoft.com/en-us/windows/security/threat-protection/microsoft-defender-antivirus/configure-network-connections-microsoft-defender-antivirus
- **GitHub URL:** N/A
- **Forum URL:** https://tenforums.com
- **Discussion URL:** N/A

---

### 10. DNS over HTTPS (DoH) Zorunlu Kılma ile Şifreli DNS Gizliliği
- **Title:** DNS over HTTPS (DoH) Zorunlu Kılma ile Şifreli DNS Gizliliği
- **Category:** Network Privacy / DNS Encryption
- **Short description:** Windows DNS sorgularının İnternet Servis Sağlayıcısı (ISS) ve 3. şahıslar tarafından izlenmesini engellemek için HTTPS üzerinden şifreli DNS (DoH) kullanımını aktifleştirir.
- **Exact code:** 
  ```cmd
  reg add "HKLM\SYSTEM\CurrentControlSet\Services\Dnscache\Parameters" /v "EnableAutoDoh" /t REG_DWORD /d "2" /f
  ```
- **Registry path:** `HKLM\SYSTEM\CurrentControlSet\Services\Dnscache\Parameters`
- **Registry value:** `EnableAutoDoh` = 2 (2 = Require DoH / Encrypted Only, 1 = Automatic, 0 = Disabled)
- **PowerShell command:** 
  ```powershell
  New-Item -Path "HKLM:\SYSTEM\CurrentControlSet\Services\Dnscache\Parameters" -Force | Out-Null
  Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\Dnscache\Parameters" -Name "EnableAutoDoh" -Value 2 -Type DWord
  ```
- **CMD command:** 
  ```cmd
  reg add "HKLM\SYSTEM\CurrentControlSet\Services\Dnscache\Parameters" /v "EnableAutoDoh" /t REG_DWORD /d "2" /f
  ```
- **Group Policy:** Computer Configuration -> Administrative Templates -> Network -> DNS Client -> Configure DNS over HTTPS (DoH) name resolution
- **App Permission:** N/A
- **Capability:** N/A
- **Supported Windows versions:** Windows 11 (Tüm sürümler), Windows 10 (21H2+)
- **Privacy impact:** Maximum (Tüm alan adı sorgularınız TLS şifrelemesi ile gizlenir)
- **Feature impact:** None (Cloudflare 1.1.1.1 veya Google 8.8.8.8 gibi DoH destekli DNS ayarlandığında çalışır)
- **Gaming impact:** Positive (DNS müdahalesini engeller, daha kararlı sorgu yanıtı sağlar)
- **Alternative values:** 1 (Auto fallback), 0 (Disabled)
- **Related tweaks:** Network Privacy, SmartScreen Privacy
- **Original source:** Microsoft Networking Documentation
- **Official documentation:** https://learn.microsoft.com/en-us/windows-server/networking/dns/doh-client-configuration
- **GitHub URL:** N/A
- **Forum URL:** https://elevenforum.com
- **Discussion URL:** N/A

---

### 11. Microsoft Edge Tarayıcı Telemetrisi ve Öneri Raporlamasını Kapat
- **Title:** Microsoft Edge Tarayıcı Telemetrisi ve Öneri Raporlamasını Kapat
- **Category:** Browser Privacy / Edge Policies
- **Short description:** Microsoft Edge tarayıcısının gezinti geçmişini, arama verilerini ve kişiselleştirilmiş reklam/veri analitiğini Microsoft sunucularına iletmesini sistem politikasıyla engeller.
- **Exact code:** 
  ```cmd
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Edge" /v "PersonalizationReportingEnabled" /t REG_DWORD /d "0" /f
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Edge" /v "ShowRecommendationsEnabled" /t REG_DWORD /d "0" /f
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Edge" /v "DiagnosticData" /t REG_DWORD /d "0" /f
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Edge" /v "HubsSidebarEnabled" /t REG_DWORD /d "0" /f
  ```
- **Registry path:** `HKLM\SOFTWARE\Policies\Microsoft\Edge`
- **Registry value:** `PersonalizationReportingEnabled` = 0, `ShowRecommendationsEnabled` = 0, `DiagnosticData` = 0, `HubsSidebarEnabled` = 0
- **PowerShell command:** 
  ```powershell
  New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Edge" -Force | Out-Null
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Edge" -Name "PersonalizationReportingEnabled" -Value 0 -Type DWord
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Edge" -Name "ShowRecommendationsEnabled" -Value 0 -Type DWord
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Edge" -Name "DiagnosticData" -Value 0 -Type DWord
  Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Edge" -Name "HubsSidebarEnabled" -Value 0 -Type DWord
  ```
- **CMD command:** 
  ```cmd
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Edge" /v "PersonalizationReportingEnabled" /t REG_DWORD /d "0" /f & reg add "HKLM\SOFTWARE\Policies\Microsoft\Edge" /v "ShowRecommendationsEnabled" /t REG_DWORD /d "0" /f & reg add "HKLM\SOFTWARE\Policies\Microsoft\Edge" /v "DiagnosticData" /t REG_DWORD /d "0" /f & reg add "HKLM\SOFTWARE\Policies\Microsoft\Edge" /v "HubsSidebarEnabled" /t REG_DWORD /d "0" /f
  ```
- **Group Policy:** Computer Configuration -> Administrative Templates -> Microsoft Edge -> PersonalizationReportingEnabled / ShowRecommendationsEnabled / DiagnosticData
- **App Permission:** N/A
- **Capability:** N/A
- **Supported Windows versions:** Windows 10, Windows 11
- **Privacy impact:** High (Gezinme verilerinin profil oluşturmak için toplanmasını engeller)
- **Feature impact:** Low (Edge önerileri ve yan çubuğu devre dışı kalır)
- **Gaming impact:** Positive Low (Edge arka plan süreçlerinin kaynak kullanımını düşürür)
- **Alternative values:** 1 (Enabled)
- **Related tweaks:** Copilot Privacy, SmartScreen Privacy
- **Original source:** Microsoft Edge Enterprise Policy Documentation
- **Official documentation:** https://learn.microsoft.com/en-us/deployedge/microsoft-edge-policies
- **GitHub URL:** N/A
- **Forum URL:** N/A
- **Discussion URL:** N/A

---
