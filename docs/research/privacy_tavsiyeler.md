# LUPER - Windows Privacy & Telemetry Ekstrem Optimizasyon Araştırması

Bu rapor, LUPER platformunun Windows sistemlerinde "Privacy" (Gizlilik) kategorisi altında uygulayabileceği ekstrem arka plan yükünü en aza indiren optimizasyon stratejilerini içermektedir. Bu yöntemler arka planda çalışan casus ve izleme servislerini devre dışı bırakarak hem sistem kaynaklarını (CPU/RAM) boşaltır hem de kullanıcı verilerinin gizliliğini en üst seviyeye çıkarır.

## 1. Arka Plan İzleme Servislerini Tamamen Devre Dışı Bırakma (PowerShell/Registry)

Windows'un en çok kaynak tüketen ve arka planda veri toplayan servisleri DiagTrack ve dmwappushservice'tir. Bunları kalıcı olarak durdurup silmek/kapatmak, ciddi performans ve gizlilik artışı sağlar.

### Kod Tavsiyesi: Telemetri Servislerinin Durdurulması

```powershell
# Connected User Experiences and Telemetry (DiagTrack) servisini durdur ve devre dışı bırak
Stop-Service -Name "DiagTrack" -WarningAction SilentlyContinue
Set-Service -Name "DiagTrack" -StartupType Disabled

# WAPushMessageRoutingService (dmwappushservice) servisini durdur ve devre dışı bırak
Stop-Service -Name "dmwappushservice" -WarningAction SilentlyContinue
Set-Service -Name "dmwappushservice" -StartupType Disabled

# Schedulded Task: Windows Customer Experience Improvement Program görevlerini devre dışı bırak
Get-ScheduledTask -TaskPath "\Microsoft\Windows\Customer Experience Improvement Program\" | Disable-ScheduledTask
Get-ScheduledTask -TaskPath "\Microsoft\Windows\Application Experience\" | Disable-ScheduledTask
```

**Açıklama:**
* `DiagTrack` ve `dmwappushservice`, Microsoft'a kullanıcı kullanım alışkanlıklarını, klavye/fare etkileşimlerini ve sistem çökmelerini gönderen ana telemetri servisleridir. Bu servisler bazen diski %100 kullanıma çıkarabilir. Bunların tamamen devre dışı bırakılması sıfır disk I/O ve daha temiz arka plan işlemleri sağlar.

## 2. Registry (Kayıt Defteri) Üzerinden Telemetri Bloklama

Group Policy (GPO) her Windows sürümünde (özellikle Home sürümlerinde) tam olarak çalışmayabilir. Bu yüzden Regedit müdahaleleri ile Telemetriyi "0" (Security) veya minimum (Basic) seviyesine çekmek gerekir.

### Kod Tavsiyesi: DataCollection Regedit

```powershell
# Windows 10/11 Telemetri seviyesini en aza indir (0 = Security (Sadece Enterprise), 1 = Basic)
$RegistryPath = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection"
If (!(Test-Path $RegistryPath)) { New-Item -Path $RegistryPath -Force | Out-Null }
Set-ItemProperty -Path $RegistryPath -Name "AllowTelemetry" -Value 0 -Type DWord -Force

# Windows Search içinde Cortana ve Bing aramalarını engelleme
$SearchRegPath = "HKCU:\Software\Policies\Microsoft\Windows\Explorer"
If (!(Test-Path $SearchRegPath)) { New-Item -Path $SearchRegPath -Force | Out-Null }
Set-ItemProperty -Path $SearchRegPath -Name "DisableSearchBoxSuggestions" -Value 1 -Type DWord -Force
```

**Açıklama:**
* `AllowTelemetry` değerini 0 yapmak, sistemin genel tanı verilerini göndermesini engeller.
* Bing web aramalarını ve Cortana'yı Windows aramasından kaldırmak (DisableSearchBoxSuggestions), başlat menüsünün açılma süresini ve arka plandaki `SearchApp.exe`'nin ağ/işlemci kullanımını ciddi şekilde azaltır.

## 3. Gereksiz Arka Plan Uygulamalarını Kapatma (UWP Arka Plan Kısıtlaması)

Windows mağaza uygulamaları varsayılan olarak arka planda çalışıp bildirim gönderme veya veri çekme eğilimindedir.

### Kod Tavsiyesi: UWP Arka Plan Uygulamalarını Kapatma

```powershell
# Tüm UWP (Mağaza) uygulamalarının arka planda çalışmasını devre dışı bırak (LetAppsRunInBackground)
$BackgroundAppsPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\BackgroundAccessApplications"
If (!(Test-Path $BackgroundAppsPath)) { New-Item -Path $BackgroundAppsPath -Force | Out-Null }
Set-ItemProperty -Path $BackgroundAppsPath -Name "GlobalUserDisabled" -Value 1 -Type DWord -Force
```

**Açıklama:**
* Bu regedit kaydı, Hesap Makinesi, Xbox servisleri veya Microsoft Store uygulamalarının kullanılmadıkları halde arka planda RAM tüketmesini engeller. Laptoplarda şarj süresini önemli ölçüde uzatır.

## 4. Reklam Kimliğini (Advertising ID) Devre Dışı Bırakma

Uygulamaların kullanıcı profilini çıkartarak kişiselleştirilmiş reklam sunması, ek bir yük yaratır.

### Kod Tavsiyesi: Reklam Kimliğini (Ad ID) Kapatma

```powershell
# Reklam Kimliğini Devre Dışı Bırak
$AdIdPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\AdvertisingInfo"
If (!(Test-Path $AdIdPath)) { New-Item -Path $AdIdPath -Force | Out-Null }
Set-ItemProperty -Path $AdIdPath -Name "Enabled" -Value 0 -Type DWord -Force
```

**Açıklama:**
* Kullanıcının sistem genelindeki hareketlerinin profil haline getirilip işlenmesini engeller, CPU üzerinde mikro-yükleri azaltır.

## 5. Host Dosyası ve Firewall ile Microsoft Telemetry Sunucularını Engelleme

LUPER sistem seviyesinde bir firewall kuralı ekleyerek veya HOSTS dosyasına blok listesi ekleyerek cihazdan çıkış yapan paketleri silebilir. `vortex.data.microsoft.com` ve `settings-win.data.microsoft.com` en bilinen telemetri sunucularıdır. (Bu işlem dikkatli yapılmalı ve Update servislerini bozmayacak şekilde ayarlanmalıdır.)

## Özet ve Güvenlik Notu

LUPER içerisine bu kodları entegre ederken:
1. Kullanıcıdan her zaman "Geri Yükleme Noktası" (Restore Point) alınması,
2. Bu optimizasyonların Geri Al (Rollback) fonksiyonunun sunulması,
3. İşlemlerin sadece yönetici yetkisi ile (LUPER arka uç servisinin ayrıcalıklarıyla) çalıştırılması elzemdir.
