# LUPER Klavye Gecikmesi (Input Lag) Düşürücü Ekstrem Ayarlar Araştırması

Bu belge, Windows işletim sisteminde klavye gecikmesini (input lag) minimize etmek ve "scan code" (tarama kodu) işlemlerini hızlandırmak için kullanılabilecek ekstrem düzeydeki kayıt defteri (registry) ve sistem ince ayarlarını içermektedir.

> [!WARNING]
> **Önemli Uyarı:** Aşağıdaki Kayıt Defteri (Registry) ayarları, sistemin temel girdi/çıktı (I/O) davranışlarını doğrudan değiştirir. Bu ayarları LUPER optimizasyon rutinine eklemeden önce, kullanıcının sisteminde mutlaka bir **Sistem Geri Yükleme Noktası (Restore Point)** veya ilgili anahtarların bir yedeği oluşturulmalıdır.

## 1. Klavye Yanıt Süresi (Keyboard Response Time)

Klavye tuşlarına basılı tutulduğunda tekrar etme hızını (repeat rate) ve gecikmesini (delay) belirleyen standart Windows ayarlarıdır. Ancak Kayıt Defteri üzerinden bu değerler ekstrem seviyelere çekilebilir.

*   **Anahtar Yolu:** `HKEY_CURRENT_USER\Control Panel\Keyboard`
*   **Değiştirilecek Değerler:**
    *   `KeyboardDelay` = `0` (Varsayılan değer genellikle 1'dir. 0 yapmak, tekrar gecikmesini en aza indirir.)
    *   `KeyboardSpeed` = `31` (Maksimum tekrar hızı değeri. Tuş basılı tutulduğunda en hızlı tepkiyi verir.)

## 2. HID Kuyruk Derinliği (HID Queue Depth)

Donanım Kesintileri (Interrupts) ve HID (Human Interface Device) sürücüsü seviyesinde klavye verilerinin işlenme sırasını etkileyen, gecikmeyi düşürebilen ileri düzey bir ayardır. Kuyruk uzunluğunu azaltmak, arabelleğe (buffer) alma süresini kısaltarak girdi verisinin daha çabuk işlenmesini sağlayabilir.

*   **Anahtar Yolu:** `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\kbdhid\Parameters`
*   **İşlem:** Eğer yoksa yeni bir `DWORD (32-bit)` değeri oluşturun.
*   **Değer Adı:** `KeyboardDataQueueLength`
*   **Değer Verisi:** `1` (Varsayılan veya olmayan durumda bu değer daha yüksektir. 1 yapmak kuyruğu minimuma indirir.)

## 3. Sistem Yanıt Verebilirliği (System Responsiveness)

Windows'un arka plan görevleri ve medya işlemleri ile ön plan (oyun/girdi) görevleri arasındaki CPU döngüsü dağılımını belirler. Girdi odaklı bir sistem için arka plan görevlerine ayrılan payı sıfırlamak önemlidir.

*   **Anahtar Yolu:** `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile`
*   **Değiştirilecek Değer:** `SystemResponsiveness`
*   **Değer Verisi:** `0` (Sistemin arka plan işlemlerine kaynak ayırmamasını, %100 ön plana ve girdilere odaklanmasını sağlar.)

## 4. USB Güç Tasarrufu ve Seçmeli Askıya Alma (Selective Suspend)

Klavye USB üzerinden bağlandığı için, Windows'un USB portlarını güç tasarrufu amacıyla uyku moduna alması (veya beklemeye alması) ilk basışlarda mikro saniyelik uyanma gecikmelerine sebep olur.

*   **Aygıt Yöneticisi Üzerinden:** "Evrensel Seri Veriyolu denetleyicileri" (USB Root Hubs) özelliklerindeki "Güç Yönetimi" sekmesinden "Güç kazancı sağlamak için bilgisayar bu aygıtı kapatsın" seçeneği **kapatılmalıdır**.
*   **Komut İstemi (PowerShell/CMD) Üzerinden USB Selective Suspend Kapatma:**
    ```cmd
    powercfg -setacvalueindex scheme_current 2a737441-1930-4402-8d77-b2bebba308a3 48e6b7a6-50f5-4782-a5d4-53bb8f07e226 0
    powercfg -setactive scheme_current
    ```

## 5. Erişilebilirlik Filtreleri (Input Filtering)

Windows'un varsayılan erişilebilirlik seçenekleri, basılan tuşları filtreleyerek yapay bir gecikme yaratır. Tamamen kapatılmaları şarttır.

*   **Ayarlar:** Ayarlar > Erişilebilirlik > Klavye
*   **Kapatılacaklar:**
    *   Yapışkan Tuşlar (Sticky Keys)
    *   Filtre Tuşları (Filter Keys) *(Gecikmenin en büyük donanımsal olmayan sebeplerinden biridir.)*
    *   Geçiş Tuşları (Toggle Keys)

## 6. Scancode Map (Tarama Kodu Haritası) - İleri Düzey

`Scancode Map`, işletim sisteminin donanımdan gelen ham tarama kodlarını nasıl yorumlayacağını belirler. Doğrudan gecikme düşürmekten ziyade, Windows tuşu veya kullanılmayan tuşların (örneğin Caps Lock) doğrudan kernel seviyesinde devre dışı bırakılması veya yeniden atanması için kullanılır. Araya giren yazılım katmanlarını (örneğin AutoHotkey gibi) ortadan kaldırdığı için "saf" bir girdi performansı sağlar.

*   **Anahtar Yolu:** `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Keyboard Layout`
*   **Değer Adı:** `Scancode Map` (REG_BINARY)
*   **Not:** Yanlış yapılandırılması klavyenin tamamen çalışmamasına sebep olabilir. LUPER üzerinden bu anahtara müdahale edilecekse, hex değerlerinin son derece dikkatli oluşturulması ve sadece bilinen tuşların map edilmesi önerilir.

---
**Model Used:** Gemini 3.1 Pro (pro tier)
