# LUPER Araştırma Raporu: Ekstrem Audio (Ses Gecikmesi) Optimizasyonları

**Tarih:** 30 Temmuz 2026
**Odak:** Sıfır Gecikme, Zirve FPS, E-Spor Düzeyi Ses Optimizasyonları (GitHub ve Forum Araştırmaları)

## Genel Bakış
Hardcore e-spor forumlarında ve GitHub üzerinde yapılan derin araştırmalar sonucunda, rekabetçi oyunlarda ses gecikmesini (audio latency) en aza indirmek ve DPC gecikme sorunlarını (DPC latency) ortadan kaldırarak FPS düşüşlerini önlemek için kullanılan en ekstrem kod ve kayıt defteri seviyesi optimizasyonlar aşağıda derlenmiştir.

## 1. Düşük Ses Gecikmesi Araçları ve Scriptleri

### A. spddl / LowAudioLatency
Standart Windows mimarisi genellikle ses arabelleğini (buffer) 10ms civarında tutar. GitHub üzerindeki [spddl/LowAudioLatency](https://github.com/spddl/LowAudioLatency) projesi, eski `REAL` aracına benzer bir yaklaşımla WASAPI üzerinden Windows ses buffer değerini mümkün olan en küçük değere (genellikle 1ms veya donanımın desteklediği en düşük değere) zorlamaktadır.

**Kullanım Senaryosu:** Sesi doğrudan donanıma ileterek aradaki Windows katmanının yarattığı gecikmeyi by-pass etmek.
**Etki:** İşitilen ses ve ekrandaki tepki arasındaki gecikmeyi mili saniyeler düzeyinde azaltır. (Özellikle CS2 ve Valorant gibi oyunlarda ayak sesleri için kritik).

### B. zonewx / Windows-Audio-Optimization-Script (audiodg.exe Optimizasyonu)
Oyun sırasında CPU kullanımının fırlaması, Windows Ses Motoru olan `audiodg.exe`'nin işlemesini geciktirebilir ve bu da çatlama (crackling) veya FPS stutter (takılma) yaratır. [zonewx scriptleri](https://github.com/zonewx/Windows-Audio-Optimization-Script) bu süreci şu şekilde optimize eder:

- **CPU Affinity (İşlemci İlgisi):** `audiodg.exe` işlemini yoğun oyun iş parçacıklarının (örneğin Core 0) dışındaki tek veya birkaç çekirdeğe hapseder.
- **Priority (Öncelik):** `audiodg.exe` önceliğini `High` (Yüksek) yaparak, Windows'un sesi işlemeyi arka plan görevlerinden daha üstün tutmasını sağlar.

## 2. Windows Kayıt Defteri (Registry) Tabanlı MMCSS Tweaks

Multimedia Class Scheduler Service (MMCSS), ses iş parçacıklarının önceliğini belirler. Aşağıdaki kayıt defteri değerleri "e-spor" düzeyinde en iyi performans için önerilmektedir:

**Konum:** `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile`
- `SystemResponsiveness`: Standart değer `20`dir (CPU'nun %20'si arka plan görevlerine ayrılır). E-spor ayarı: `0` veya `10`. `0` yapıldığında ön plandaki uygulama/oyun maksimum CPU'yu kullanır, ses işleme önceliği ile çatışmaz.
- `NetworkThrottlingIndex`: `0xFFFFFFFF` (4294967295) olarak ayarlandığında, ağ paket işlemlerinin medya (ses) işlemlerini bölmesini engeller.

**Konum:** `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Audio`
- `Scheduling Category`: `High`
- `Priority`: `6`
- `GPU Priority`: `8` (Donanım hızlandırmalı sesin GPU'da gecikmemesi için).

## 3. Donanım Kesme (Interrupt) Gecikmeleri ve MSI Mode

DPC (Deferred Procedure Call) gecikmelerinin en büyük düşmanı eski tip Line-Based IRQ kesmeleridir. GitHub üzerinde bulunan **MSI Mode Utility** (Message Signaled Interrupts) araçları kullanılarak:
- GPU ve Harici/Dahili Ses Kartı (Realtek, vb.) sürücüleri MSI moduna geçirilmeye zorlanır.
- Ses kartının (Audio Controller) Interrupt Priority (Kesme Önceliği) `High` olarak ayarlanır.
Bu sayede donanımlar arası kesme çatışmaları biter ve "click" veya seste gecikme (audio pop) tamamen engellenir.

## Anticheat ve Kararlılık Uyarıları
**ÖNEMLİ:** E-spor seviyesi optimizasyonlar yaparken, FACEIT, Vanguard (Valorant) ve BattlEye gibi Kernel seviyesi anti-cheat yazılımlarının bazı kernel modüllerine müdahale edilmemesi gereklidir. Windows ses hizmetlerini tamamen kapatan veya zamanlayıcıları (HPET/TSC) zorla bozan scriptler, anticheat yazılımları tarafından hile şüphesi olarak algılanabilir veya oyundan atılmaya neden olabilir.

Yukarıdaki parametreler, LUPER üzerinden uygulanırken **"System Restore Point"** (Sistem Geri Yükleme Noktası) alınarak ve dikkatlice (regedit veya powershell komutlarıyla) uygulanmalıdır.
