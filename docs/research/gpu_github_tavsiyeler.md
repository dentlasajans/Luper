# 🚀 LUPER - İleri Düzey GPU ve Gecikme Optimizasyonu Araştırma Raporu (GitHub & E-Spor Odaklı)

## 📌 Giriş
Bu rapor, "Sıfır Gecikme" (Zero Latency) ve "Maksimum FPS" hedefleri doğrultusunda, GitHub üzerinde popüler olan açık kaynaklı sistem optimizasyon araçlarından (örn. ChrisTitusTech/winutil, AlchemyTweaks) ve hardcore e-spor forumlarından derlenmiş ileri düzey kayıt defteri (Registry) ve GPU ayarlarını içermektedir.

## 🛠️ İleri Düzey Kayıt Defteri (Registry) Tweakleri

### 1. MMCSS (Multimedia Class Scheduler Service) Optimizasyonu
Windows, arka plan işlemlerine belirli bir CPU yüzdesi ayırır. E-spor ve rekabetçi oyunlarda bu durum frame gecikmelerine (frametime spikes) neden olabilir.

*   **Anahtar Yolu:** `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile`
*   **Tavsiye Edilen Değişiklikler:**
    *   `SystemResponsiveness`: Varsayılan değeri `20`'dir (CPU'nun %20'si arka plana ayrılır). Bunu `0` veya `10` (Hexadecimal) olarak ayarlamak, oyunların CPU'yu daha agresif bir şekilde kullanmasını sağlar.
    *   `NetworkThrottlingIndex`: Ağ trafiği kısıtlamasını tamamen kapatmak için `ffffffff` (Hexadecimal) olarak ayarlanmalıdır.

### 2. Oyun ve GPU Önceliklendirmesi (Tasks\Games)
Sistem kaynaklarının doğrudan oyuna odaklanmasını sağlayan bir diğer MMCSS alt ayarıdır.

*   **Anahtar Yolu:** `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games`
*   **Tavsiye Edilen Değişiklikler:**
    *   `GPU Priority`: `8` (Yüksek Öncelik)
    *   `Priority`: `6`
    *   `Scheduling Category`: `High`
    *   `SFIO Priority`: `High`

## ⚙️ GPU Sürücü ve İşletim Sistemi Seviyesi Ayarları

### 1. NVIDIA / AMD Düşük Gecikme Modları
Hardcore oyuncuların vazgeçilmezi olan düşük gecikme teknolojileri:
*   **NVIDIA Ultra Low Latency (NULL):** E-spor oyunlarında (CS2, Valorant vb.) `Ultra` olarak ayarlanmalıdır. Render kuyruğunu sıfıra indirerek input lag'ı (girdi gecikmesi) minimuma çeker.
*   **AMD Radeon Anti-Lag:** Benzer şekilde CPU ve GPU senkronizasyonunu hızlandırarak gecikmeyi düşürür.

### 2. Donanım Hızlandırmalı GPU Zamanlaması (HAGS)
*   **Nedir:** Hardware-Accelerated GPU Scheduling (HAGS), video belleği yönetimini CPU'dan alıp doğrudan GPU'ya verir.
*   **Durum:** GitHub komünitesi, bu ayarın yeni nesil kartlarda (RTX 3000/4000 serisi vb.) FPS'i artırdığını ve darboğazı azalttığını belirtmektedir. Windows Grafik Ayarlarından mutlaka **Açık** konuma getirilmelidir.

## ⚠️ Kritik Uyarılar ve LUPER Entegrasyonu
1.  **Risk Analizi:** Bu ayarlar her sistemde aynı olumlu etkiyi yaratmayabilir. Aşırı agresif ayarlar (özellikle MMCSS tarafında) ses kartı sürücülerinde cızırtıya veya arka plan uygulamalarında takılmalara neden olabilir.
2.  **LUPER İçin Geliştirme Tavsiyesi:** LUPER içine entegre edilecek bir "E-Spor Modu", bu kayıt defteri değişikliklerini otomatik olarak uygulamalı, ancak her işlemden önce **mutlaka bir Geri Yükleme Noktası (Restore Point)** oluşturmalıdır.
3.  **Modern Sistemler:** Windows 11'in yeni Thread Director mimarisi eski tweak'lere göre farklı davranabilir; kodların test ortamında izole olarak denenmesi şarttır.

## 🔗 İlgili GitHub Kaynakları
*   [ChrisTitusTech/winutil](https://github.com/ChrisTitusTech/winutil) - Genel debloat ve sistem optimizasyonu.
*   [AlchemyTweaks](https://github.com/AlchemyTweaks/Verified-Tweaks) - Gecikme (Latency) odaklı doğrulanmış tweakler.
