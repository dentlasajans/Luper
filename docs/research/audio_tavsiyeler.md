# LUPER Audio Optimizasyon Raporu: audiodg.exe ve Gecikme (Latency) Düşürme

**Yazar:** LUPER Audio Uzmanı
**Tarih:** 30 Temmuz 2026

Oyun içi seslerin en düşük gecikmeyle (latency) işlenmesi ve `audiodg.exe` (Windows Ses Aygıtı Grafik İzolasyonu) kaynaklı yüksek CPU kullanımlarının engellenmesi için yapılan araştırma sonuçları ve uygulanabilecek "gizli" ayarlar aşağıda derlenmiştir.

## 1. audiodg.exe CPU Yükünü ve Gecikmeyi Düşürmek İçin Temel Ayarlar

`audiodg.exe` doğrudan ses işleme ve efektleri yönetir. Gecikmeyi artırmasının en büyük nedeni Windows'un veya ses sürücüsünün (Realtek vb.) sunduğu ekstra ses efektleridir.

* **Ses Geliştirmelerini Kapatma (Disable Audio Enhancements):**
  Bu ayar, gecikmeyi (latency) en çok düşüren faktördür.
  - Görev çubuğundaki ses simgesine sağ tıklayıp "Ses Efekti" veya "Ses Ayarları" üzerinden kayıt/oynatma cihazınızın özelliklerine girin.
  - "Geliştirmeler" (Enhancements) sekmesine geçin.
  - "Tüm ses efektlerini engelle" (Disable all enhancements) kutucuğunu işaretleyin.
  - "Gelişmiş" sekmesinde Uzamsal Ses (Spatial Sound) açıksa tamamen kapatın.

* **Ses Formatı (Örnekleme Hızı) Optimizasyonu:**
  Çok yüksek stüdyo kalitesi (örn. 96kHz veya 192kHz) işlemciye ekstra yük bindirir. Oyunlar için 48kHz (DVD Kalitesi) veya 44.1kHz (CD Kalitesi) 16-bit / 24-bit en ideal olanıdır. Yüksek frekans, CPU döngülerini artırır ve gecikme yaşanmasına sebep olabilir.

## 2. Registry (Kayıt Defteri) Tweaks: MMCSS ve Audio Ayarları

**DİKKAT:** Bu işlemlerden önce sistem geri yükleme noktası oluşturulmalıdır. Çoğu "gaming tweak" eski Windows sürümlerine aittir, ancak rekabetçi oyunlarda milisaniyelerin önemli olduğu durumlarda test edilebilir.

### 2.1. MMCSS Ses Görevleri Önceliklendirmesi (NetworkThrottlingIndex ve SystemResponsiveness)
Oyunlarda sesin sistem önceliğini düzenlemek için Multimedia Class Scheduler Service (MMCSS) ayarlarını optimize edebiliriz.

**Kayıt Yolu:**
`HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile`

**Değiştirilecek Değerler:**
- `NetworkThrottlingIndex` (DWORD): Varsayılan değeri genelde 10'dur. `ffffffff` (Hexadecimal) yapılarak, Windows'un medya oynatırken ağ trafiğini kısıtlaması engellenir.
- `SystemResponsiveness` (DWORD): Varsayılanı 20'dir. `0` yapılarak sistem kaynaklarının tamamen (multimedya ve oyunlara) verilmesi sağlanabilir.

### 2.2. Audio Görevi Sınıfı Optimizasyonu
Ses ve oyun arasındaki işlemci gücü dağılımı.

**Kayıt Yolu:**
`HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Audio`

**Değiştirilecek Değerler:**
- `Scheduling Category` (String): `High` olarak ayarlanır (Varsayılan genellikle Medium veya High'dır).
- `SFIO Priority` (String): `High` olarak ayarlanır.
- `Background Only` (String): `False` olmalıdır.
- `Priority` (DWORD): `6` veya `8` olarak ayarlanabilir (Yüksek öncelik).

### 2.3. audiodg.exe İşlemci Afinitesi (CPU Affinity)
Çok çekirdekli sistemlerde `audiodg.exe` sürekli farklı çekirdekler arasında yer değiştirdiğinde DPC gecikmesi artabilir. `audiodg.exe`'yi fiziksel bir çekirdeğe atamak gecikmeyi sıfırlayabilir.
Bunu yapmak için Görev Yöneticisinden veya PowerShell üzerinden `audiodg.exe` işlemine sağ tıklayıp "Benzeşmeyi Ayarla" (Set Affinity) diyerek işlemi tek bir çekirdeğe (örneğin CPU 2 veya CPU 4) atamak tavsiye edilir.

## 3. Donanımsal Gecikme Tespiti
Yüksek `audiodg.exe` kullanımı her zaman ses sürücüsünden kaynaklanmaz. Ağ veya ekran kartı sürücüleri DPC (Deferred Procedure Call) kuyruğunu tıkayarak sesi kekemeleştirebilir.
- **Tavsiye:** `LatencyMon` yazılımı kullanılarak sistemdeki gerçek DPC/ISR gecikmesinin hangi `.sys` (sürücü) dosyasından kaynaklandığı analiz edilmelidir (örneğin `ndis.sys` veya `nvlddmkm.sys`).
