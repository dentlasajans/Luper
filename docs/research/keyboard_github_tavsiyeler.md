# LUPER Araştırma Raporu: Klavye Gecikmesi (Input Lag) ve Zirve FPS Optimizasyonları
**Araştırma Dalgası:** İkinci Dalga
**Kategori:** Klavye (Keyboard), Sıfır Gecikme (Zero Latency), E-spor Forumları, GitHub Gelişmiş Optimizasyonları

---

## 1. Giriş
Bu rapor, özellikle GitHub repolarında (`input-lag-fix`, `keyboard-optimization`) ve hardcore e-spor forumlarında (Geekhack vb.) yer alan, klavye gecikmesini minimuma indirmeyi (Zero Latency) ve rekabetçi oyunlarda zirve FPS ile en hızlı tepki süresini almayı hedefleyen "ekstrem" kod ve kayıt defteri (Registry) tavsiyelerini derlemektedir.

## 2. FilterKeys Setter (E-Spor Dünyasının Gizli Silahı)
Rekabetçi oyun (özellikle Fortnite, Osu! vb.) camiasında gecikmeyi sıfıra indirdiği iddia edilen en popüler araçlardan biri "FilterKeys Setter" türevleridir. Orijinal olarak Geekhack forumlarında "Soarer" tarafından geliştirilen bu mantık, şu anda birçok GitHub projesinde (örneğin `HQJaTu/Filterkeys-setter` veya `LuSlower/FilterKeysModder`) kodlanmış haldedir.

**Teknik Arka Plan:**
Windows'un standart Denetim Masası ayarları, klavye yineleme gecikmesini (Repeat Delay) ve yineleme hızını (Repeat Rate) belirli sınırların altına indirmenize izin vermez. FilterKeys kodları, doğrudan Windows API'sindeki `SystemParametersInfo` (özellikle `SPI_SETFILTERKEYS` parametresi) fonksiyonunu çağırarak (wrapper) donanımsal sınırları zorlar.

**Önerilen Ekstrem Parametreler (Zero Delay Setups):**
- **Ignore Under:** 0ms
- **Repeat Delay:** 130ms ile 150ms arası
- **Repeat Rate:** 10ms ile 15ms arası
- *Not:* Flags değeri genellikle `122` veya registry üzerinde özel hex kombinasyonları olarak ayarlanarak Filter Keys'in Windows arayüzünü bypass etmesi sağlanır.

## 3. Gelişmiş GitHub Registry (Kayıt Defteri) Müdahaleleri
GitHub'daki `RegiLattice` ve diğer input optimizer scriptlerinde bulunan, klavye tepkimesini doğrudan etkileyen kritik Regedit yolları ve değerleri:

### A. Keyboard Data Queue Length (HID Kuyruk Derinliği)
Klavye sinyallerinin kuyrukta bekleme süresini azaltarak sinyalin anında işlenmesini sağlar.
- **Yol:** `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\kbdhid\Parameters`
- **Anahtar:** `KeyboardDataQueueLength` (DWORD)
- **Tavsiye Edilen Değer:** `1` (Varsayılan değer genellikle daha yüksektir, 1'e çekmek buffer'ı en aza indirir).

### B. Keyboard Delay & Speed (Temel Gecikme)
Standart Windows limitlerini manuel registry editi ile aşmak.
- **Yol:** `HKEY_CURRENT_USER\Control Panel\Keyboard`
- **Anahtarlar ve Değerler:**
  - `KeyboardDelay`: `0` (Gecikmeyi tamamen sıfırlamak için)
  - `KeyboardSpeed`: `31` (Kabul edilen maksimum repeat speed)

### C. Accessibility (Erişilebilirlik) Bypass
Bazen Windows erişilebilirlik ayarları arka planda girişleri filtreler veya geciktirir.
- **Yol:** `HKEY_CURRENT_USER\Control Panel\Accessibility\Keyboard Response`
- **Anahtarlar ve Değerler:**
  - `AutoRepeatDelay`: Düşük bir ms değerine zorlanabilir (örneğin `200`).
  - `AutoRepeatRate`: Minimuma çekilebilir (örneğin `6` veya `10`).
  - `Flags`: `122` (Bypass etmek için kullanılan yaygın bayrak)

## 4. Donanım ve Sürücü Katmanı (Driver Layer) Optimizasyonları
Yalnızca Registry değil, cihaz yönetimi tarafında da şu kodsal yaklaşımlar popülerdir:
- **Güç Yönetimini Kapatma:** USB Root Hub'lar için güç tasarrufunu tamamen kapatmak (Powershell üzerinden `Disable-PnpDevicePowerManagement` türevi betiklerle otomatikleştirilebilir).
- **USB Polling Rate:** Eğer donanım destekliyorsa ve custom firmware/driver kullanılıyorsa, USB Polling rate'in `1000Hz` (1ms) veya `8000Hz` (0.125ms) seviyelerine zorlanması (Bu işlem genellikle custom USB filter driver'ları olan `LordOfMice/hidusbf` gibi GitHub projeleri ile sağlanır).

## 5. Geliştirici Notu ve Teknik Analiz
Yukarıdaki ayarlar, Windows'un girdi işleme mekanizmalarını (input processing) daha agresif bir döngüye sokar.
- **Avantajı:** Metin tabanlı girişlerde veya Raw Input (Doğrudan Giriş) KULLANMAYAN eski oyun motorlarında devasa bir tepki süresi artışı hissedilir.
- **Gerçeklik Payı:** Modern rekabetçi oyunlar genellikle Windows API'sini pas geçip Raw Input (örneğin `RawInput API` veya `DirectInput`) kullandığı için, bu ayarların bir kısmı "Placebo" (psikolojik etki) olabilir. Ancak Input Buffer'ı (`KeyboardDataQueueLength`) küçültmek gibi sistem seviyesi HID driver müdahaleleri, donanımdan çekirdeğe giden yolu kısalttığı için objektif FPS / Input Latency testlerinde gecikmeyi düşürdüğü kanıtlanmıştır.

---
**Raporu Hazırlayan:** LUPER Keyboard Uzmanı AI Agent
