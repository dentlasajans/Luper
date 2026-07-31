# LUPER: Gelişmiş Depolama ve Disk Optimizasyonları (NVMe, SSD, NTFS)

Bu belge, LUPER platformu için Windows işletim sisteminde "Storage ve Disk" (NVMe, SSD, NTFS gecikmesi) kategorilerinde kullanılabilecek gelişmiş (hidden/advanced) oyun optimizasyonlarını içermektedir. Bu ayarlar, IO gecikmesini (latency) en aza indirmeyi, mikro takılmaları (micro-stutters) azaltmayı ve oyun varlıklarının (assets) yüklenme sürelerini hızlandırmayı amaçlamaktadır.

## 1. NTFS Dosya Sistemi Optimizasyonları (CMD / fsutil)

NTFS (New Technology File System), Windows'un varsayılan dosya sistemidir. Arka planda çalışan bazı uyumluluk ve kayıt tutma özellikleri, modern oyunlarda gereksiz disk G/Ç (I/O) işlemlerine yol açarak gecikmelere sebep olabilir.

### 1.1. 8.3 Dosya Adı Oluşturmayı Kapatma
Eski 16-bit MS-DOS uygulamalarıyla uyumluluk için Windows, her uzun dosya adına karşılık kısa bir 8.3 formatında isim oluşturur. Bu durum dosya dizinlerinin listelenmesinde ve oluşturulmasında gereksiz CPU ve disk yüküne neden olur. Modern sistemlerde tamamen gereksizdir.
**Uygulama (CMD):**
```cmd
fsutil 8dot3name set 1
```

### 1.2. Son Erişim Zamanı (Last Access Time) Güncellemelerini Kapatma
Windows, bir dosya her okunduğunda onun "Son Erişim Tarihi" bilgisini günceller. Özellikle çok fazla ufak dosyanın (texture, ses dosyası) aynı anda okunduğu oyunlarda bu durum devasa bir NTFS metadata yazma yükü (overhead) yaratır.
**Uygulama (CMD):**
```cmd
fsutil behavior set disablelastaccess 1
```

### 1.3. TRIM Desteğini Doğrulama / Etkinleştirme
SSD'lerin kullanılmayan veri bloklarını temizlemesini ve performansını korumasını sağlayan TRIM komutunun mutlaka devrede olması gerekir.
**Uygulama (CMD):**
```cmd
fsutil behavior set DisableDeleteNotify 0
```

### 1.4. NTFS Sıkıştırmayı Devre Dışı Bırakma
Eğer SSD alanınız yeterliyse, NTFS sıkıştırmanın (arka planda) devre dışı bırakılması diske yazma/okuma sırasında işlemci (CPU) yükünü ve dekompresyon gecikmesini ortadan kaldırır.
**Uygulama (CMD):**
```cmd
fsutil behavior set disablecompression 1
```

## 2. Gelişmiş NVMe & Kayıt Defteri (Registry) Ayarları

### 2.1. NVMe Cihaz Kuyruk Derinliği (Device Queue Depth) Ayarı
Standart olarak Windows, NVMe diskler için kuyruk derinliğini (Queue Depth) maksimum veri aktarım hızı (throughput) elde edecek şekilde yüksek tutar (genellikle 32). Ancak oyunlarda throughput'tan ziyade **düşük gecikme (low latency)** daha kritiktir. Kuyruk derinliğini düşürmek, anlık tepkime süresini iyileştirerek mikro takılmaları önleyebilir.
**Uygulama (PowerShell/Registry):**
```powershell
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Services\stornvme\Parameters\Device" /v "DeviceQueueDepth" /t REG_DWORD /d "8" /f
```
*(Not: 8 değeri gecikme ve hız arasında ideal bir oyun dengesidir. Yeniden başlatma gerektirir.)*

### 2.2. NTFS Bellek Kullanımı (NtfsMemoryUsage)
RAM kapasitesi yüksek (16GB ve üzeri) olan sistemlerde, NTFS'nin dosya metadata önbelleklemesi (caching) için kullanabileceği bellek miktarını artırmak, diske fiziksel erişim ihtiyacını azaltır. Sık erişilen oyun dosyalarının indeksleri RAM'de tutulur.
**Uygulama (PowerShell/Registry):**
```powershell
Reg.exe add "HKLM\SYSTEM\CurrentControlSet\Control\FileSystem" /v "NtfsMemoryUsage" /t REG_DWORD /d "2" /f
```
*(Değer: 1 = Standart, 2 = Artırılmış Ön Bellek)*

## 3. Güç Yönetimi ve Arka Plan Hizmetleri

### 3.1. PCIe ASPM (Active State Power Management) Kapatma
NVMe SSD'ler, anakarta PCIe hatları üzerinden bağlıdır. Windows güç tasarrufu sağlamak için boştayken bu PCIe hatlarının güç durumunu düşürür (Link State Power Management). Ancak oyun sırasında diskten aniden veri çekilmesi gerektiğinde, uyku durumundan uyanma süresi (wake-up latency) takılmalara neden olur.
**Uygulama (CMD):**
Bu ayar genellikle Güç Planı üzerinden değiştirilir, CMD ile şu şekilde kapatılabilir:
```cmd
powercfg /SETACVALUEINDEX SCHEME_CURRENT 501a4d13-42af-4429-9fd1-a8218c268e20 ee12f906-d277-404b-b6da-e5fa1a558440 0
powercfg /SETDCVALUEINDEX SCHEME_CURRENT 501a4d13-42af-4429-9fd1-a8218c268e20 ee12f906-d277-404b-b6da-e5fa1a558440 0
powercfg /SETACTIVE SCHEME_CURRENT
```
*(Değer 0 = Kapalı / Maksimum Performans)*

### 3.2. SysMain (Superfetch) Hizmetini Kapatma
Eskiden mekanik diskleri (HDD) hızlandırmak için geliştirilen SysMain, RAM'e sık kullanılan uygulamaları önceden yükler. Ancak saniyede binlerce MB okuma yapabilen NVMe SSD'ler için bu servis, arka planda diski meşgul eden gereksiz bir I/O yükü (ve dolayısıyla CPU/Disk gecikmesi) yaratır. Oyun bilgisayarlarında NVMe varsa kapatılması önerilir.
**Uygulama (CMD / PowerShell):**
```cmd
sc stop "SysMain" & sc config "SysMain" start=disabled
```

## ⚠️ Önemli Uyarılar ve Riskler
- Bu komutlar doğrudan sistem çekirdeğini ve dosya yönetimini etkilediği için **öncesinde Sistem Geri Yükleme Noktası oluşturulması** zorunludur.
- NVMe Native Driver gibi deneysel kayıt defteri hilelerinden (özellikle Windows 11'de resmi destek olmayan özellikler) kaçınılmalıdır, zira BSOD (Mavi Ekran) riskleri barındırırlar.
- En temel ve etkili depolama optimizasyonlarından biri, SSD'nin firmware yazılımının güncel tutulması ve sürücü kapasitesinin minimum %20'sinin boş bırakılmasıdır (TRIM ve Wear Leveling algoritmalarının sağlıklı çalışabilmesi için).
