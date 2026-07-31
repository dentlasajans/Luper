# LUPER: Gelişmiş Mouse ve Input Lag Optimizasyon Rehberi

Bu belge, Windows sistemlerinde fare (mouse) tepkime süresini (input lag) en aza indirmek ve DPC (Deferred Procedure Call) gecikmelerini optimize etmek amacıyla hazırlanmış ileri düzey yöntemleri içerir.

## 1. DPC Gecikmesi (DPC Latency) Analizi ve Çözümleri
Gelişmiş optimizasyonlara geçmeden önce sorunun kaynağını belirlemek kritik öneme sahiptir.
- **LatencyMon Kullanımı:** Sistemin 10-15 dakika boyunca izlenmesi, yüksek DPC gecikmesine neden olan sorunlu sürücülerin (genellikle ses veya ağ sürücüleri, `ndis.sys`, `tcpip.sys` veya `nvlddmkm.sys`) tespit edilmesini sağlar.
- **Arka Plan Yoklamaları (Polling):** iCUE, Razer Synapse veya agresif HWiNFO donanım sensör okumaları CPU'da kesintilere neden olarak input lag yaratabilir. Rekabetçi oyunlardan önce bu tür donanım kontrol yazılımlarının tamamen kapatılması önerilir.

## 2. USB ve Kesinti (Interrupt) Optimizasyonları
- **USB Güç Tasarrufunu Kapatma (Selective Suspend):**
  - **Aygıt Yöneticisi (Device Manager):** Tüm "USB Kök Hub (USB Root Hub)" ve "Genel USB Hub" cihazlarının özelliklerinden, "Güç Yönetimi" sekmesindeki *'Gücü kazandırmak için bilgisayarın bu aygıtı kapatmasına izin ver'* seçeneği kaldırılmalıdır.
  - **Güç Seçenekleri:** Gelişmiş Güç Seçenekleri üzerinden *USB seçmeli askıya alma ayarı (USB selective suspend setting)* "Devre Dışı" (Disabled) bırakılmalıdır.
- **MSI (Message Signaled Interrupts) Modunu Etkinleştirme (Çok Gelişmiş):**
  - Geleneksel hat tabanlı (line-based) donanım kesintileri yerine MSI modunun kullanılması cihazlar arası hat paylaşımını önler ve gecikmeyi düşürür.
  - **MSI Utility v3** kullanılarak, GPU ve özellikle USB Host Denetleyicileri (USB Host Controllers) MSI moduna alınabilir. *Uyarı: Cihaz önceliğini (Priority) 'High' veya 'Realtime' olarak değiştirmek sistem stabilitesini bozabileceğinden sadece 'Undefined' veya varsayılan bırakılmalıdır.*

## 3. Windows Kayıt Defteri (Registry) Ayarları
Piyasada dolaşan çoğu "toplu kayıt defteri ayarı (registry tweak)" sistem stabilitesini bozar, ancak bilinçli yapılabilecek bazı ayarlar mevcuttur:
- **Win32PrioritySeparation:** `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\PriorityControl` altında bulunur. Arka plan süreçleri ve ön plan uygulamalarının işlemci zamanlamasını ayarlar. Yanlış yapılandırılması stutter (takılma) yaratabilir.
- *LUPER Önerisi:* Bilinmeyen toplu kayıt defteri (.reg) dosyalarından uzak durulmalı, yalnızca belgelenmiş ve spesifik donanıma hitap eden kayıt girdileri uygulanmalıdır. Her işlem öncesi mutlaka Sistem Geri Yükleme Noktası (Restore Point) oluşturulmalıdır.

## 4. Sistem ve Oyun İçi Temel Ayarlar
- **Ham Giriş (Raw Input):** Oynanan oyunlarda (CS2, Valorant vb.) her zaman "Raw Input" açılmalıdır. Bu, Windows'un fare imleci işleme katmanını atlayarak doğrudan donanımdan veri okunmasını sağlar.
- **Fare İvmelenmesini Kapatma (Enhance Pointer Precision):** Windows Fare ayarlarında "İşaretçi hassasiyetini artır" seçeneği kesinlikle kapalı olmalıdır.
- **Nihai Performans Modu (Ultimate Performance):** Komut istemi üzerinden `powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61` komutuyla etkinleştirilip güç seçeneklerinden seçilmelidir.
- **Donanım Hızlandırmalı GPU Zamanlaması (HAGS):** Desteklenen sistemlerde Windows grafik ayarları altından etkinleştirilmesi tepkime sürelerini iyileştirebilir.

---
**Önemli Uyarı:** İşletim sisteminin alt seviye ayarlarını ve sürücü kesintilerini değiştirmek (özellikle MSI mod) sistem kararsızlıklarına ve Mavi Ekran (BSOD) hatalarına yol açabilir. Düzenleme öncesi mutlaka yedek alınmalıdır.
