# İleri Düzey Windows & GPU Oyun Optimizasyonları (Araştırma Raporu)

Bu rapor, LUPER için derlenmiş "GPU" kategorisindeki en gelişmiş ve gizli oyun optimizasyonlarını içermektedir. WDDM (Windows Display Driver Model) ayarları, DXCache yönetimi ve Nvidia Profile Inspector yapılandırmaları incelenmiştir.

## 1. WDDM ve Kayıt Defteri (Registry) Optimizasyonları

### Hardware-Accelerated GPU Scheduling (HAGS)
HAGS (Donanım Hızlandırmalı GPU Zamanlaması), GPU'nun kendi belleğini yönetmesine olanak tanır. Gecikmeyi (latency) azaltır ve kare hızını (frame pacing) iyileştirir.

*   **Kayıt Defteri Yolu:** `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\GraphicsDrivers`
*   **Anahtar:** `HwSchMode` (DWORD 32-bit)
*   **Değer:** `2` (Etkinleştir) / `1` (Devre Dışı)

### GPU ve Oyun Önceliklendirme (Multimedia Class Scheduler)
Windows'un oyun süreçlerine ve GPU kaynaklarına nasıl öncelik verdiğini yönetir.

*   **Kayıt Defteri Yolu:** `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games`
*   **Tavsiye Edilen Ayarlar:**
    *   `GPU Priority`: `8` (DWORD)
    *   `Priority`: `6` (DWORD)
    *   `Scheduling Category`: `High` (Dize Değeri - String)

*   **Sistem Yanıt Hızı:** Arka plan hizmetlerinin oyuna müdahalesini azaltmak için:
    *   **Yol:** `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile`
    *   **Anahtar:** `SystemResponsiveness` (DWORD)
    *   **Değer:** `10`

### Ağ Darboğazını Kapatma (Network Throttling Index)
Çok oyunculu (multiplayer) oyunlarda ağ verimini artırmak için ağ kısıtlamalarını devre dışı bırakır.

*   **Yol:** `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile`
*   **Anahtar:** `NetworkThrottlingIndex` (DWORD)
*   **Değer:** `ffffffff` (Hexadecimal)

## 2. DirectX Shader Cache (DXCache) Yönetimi

DXCache, önceden derlenmiş shader'ları saklayarak yükleme sürelerini iyileştirir. Ancak bozulduğunda takılmalara (stuttering) neden olabilir.

*   **Tavsiye Edilen İşlem (Temizlik):** Eğer takılmalar yaşanıyorsa önbellek klasörlerinin periyodik olarak temizlenmesi önerilir.
    *   `%localappdata%\NVIDIA\DXCache`
    *   `%localappdata%\D3DSCache`
*   **Uyarı:** Shader Cache'i tamamen kapatmak *önerilmez*. Bu durum, oyun sırasında shader'ların sürekli yeniden derlenmesine ve ciddi FPS düşüşlerine/takılmalara yol açacaktır.

## 3. Nvidia Profile Inspector Gizli İnce Ayarları (Tweaks)

NVIDIA Profile Inspector, standart NVIDIA Kontrol Panelinde bulunmayan sürücü seviyesi ayarlara erişim sağlar. **Uyarı:** Bu ayarlar her oyunun kendi profili üzerinden (Per-Game) yapılmalıdır; global olarak uygulanması önerilmez.

### Resizable BAR Zorlama
Resmi olarak desteklenmeyen oyunlarda Resizable BAR'ı zorlamak performans artışı sağlayabilir (bazı oyunlar için).
*   **Ayarlar:** `rBAR - Feature` etkinleştirilir, uygun boyut (örneğin bellek limiti) atanır.

### Gecikme ve Takılma Azaltma (Latency & Stuttering)
*   **Maximum Pre-rendered Frames:** Değeri `1` yapmak (veya Ultra Düşük Gecikme Modunu açmak) input lag'i (giriş gecikmesini) azaltır.
*   **Low Latency Mode:** Rekabetçi oyunlarda tepkisel hissi artırmak için yapılandırılabilir.
*   **Shader Cache Size:** Nvidia Profile Inspector üzerinden Shader Cache boyutu Limitsiz (Unlimited) veya daha yüksek bir değere ayarlanarak ağır oyunlarda (örneğin açık dünya) takılmalar engellenebilir.

### Görsel Kalite (Anti-Aliasing ve Doku Filtreleme)
FPS artışından ziyade, oyunun kendi desteklemediği yüksek kaliteli Anti-Aliasing (SGSSAA gibi) ve Anisotropic Filtering modlarını sürücü seviyesinde zorlamak için kullanılabilir.

## Özet ve Güvenlik Uyarıları
1.  **Geri Yükleme Noktası:** Regedit ayarları uygulanmadan önce mutlaka Sistem Geri Yükleme noktası oluşturulmalıdır.
2.  **Test:** Nvidia Profile Inspector ile yapılan değişiklikler stabilite sorunlarına yol açabilir; her ayar tek tek denenmeli ve benchmark yapılmalıdır.
3.  **Risk:** Hatalı yapılandırmalar modern oyun motorlarıyla çakışabilir ve performansı olumsuz etkileyebilir.

---
*Bu belge, LUPER optimizasyon motorunun geliştirmelerinde referans alınması için oluşturulmuştur.*
