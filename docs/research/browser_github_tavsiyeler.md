# LUPER Tarayıcı (Browser) Gecikme Optimizasyonu ve E-Spor Seviyesi Tweaks (GitHub Araştırması)

## 1. Araştırma Özeti ve Hedef
Bu doküman, "Browser (Arka plan engelleme)" kategorisi için GitHub repoları ve hardcore e-spor forumlarında yapılan ikinci dalga araştırmanın sonuçlarını içermektedir. Hedefimiz LUPER için **sıfır gecikme (zero-latency)** ve **zirve FPS** sağlayacak ekstrem tarayıcı parametreleri ve sistem entegrasyonlarını belirlemektir.

## 2. Ekstrem Chromium Başlatma Parametreleri (CLI Flags)
E-sporcular ve sistem optimize ediciler (tweakers), Chromium tabanlı tarayıcıları (Chrome, Edge, Brave, Opera GX) çalıştırırken varsayılan ayarlar yerine özel komut satırı argümanları kullanır. LUPER üzerinden bu kısayollara enjekte edilebilecek bazı parametreler:

- `--disable-gpu-vsync`: Tarayıcı içi V-Sync'i tamamen devre dışı bırakarak giriş gecikmesini (input lag) ortadan kaldırır. Özellikle tarayıcı tabanlı oyunlar ve "aim trainer" siteleri için hayati önem taşır.
- `--disable-frame-rate-limit`: Tarayıcının FPS limitini (genellikle monitörün yenileme hızına kilitlidir) kaldırır.
- `--enable-gpu-rasterization` & `--enable-zero-copy`: Sayfa çizim işlemlerini (rasterization) işlemciden (CPU) alıp tamamen ekran kartına (GPU) devrederek CPU üzerindeki yükü azaltır. Bu sayede ağır oyunlarda CPU darboğazı önlenir.
- `--disable-background-networking` & `--disable-sync`: Tarayıcının arka planda telemetry verisi göndermesini, güncelleme denetimi yapmasını veya senkronizasyon için ağı meşgul etmesini (ping dalgalanmalarını/jitter önlemek adına) durdurur.

## 3. Arka Plan İşlemlerini Bloklama (Background Blocking) Stratejileri
Bir oyun çalışırken tarayıcının arka planda kaynak sömürmesini engellemek için GitHub araçlarında kullanılan yaklaşımlar:

- **GPU Donanım Hızlandırma Yönetimi (Hardware Acceleration):** 
  - *Strateji A:* Eğer oyun GPU'ya çok yükleniyor ve darboğaz yaratıyorsa (ör. Cyberpunk), tarayıcıda donanım hızlandırmayı kapatarak GPU'yu tamamen oyuna bırakmak.
  - *Strateji B:* Oyun CPU'ya yükleniyorsa (ör. CS2, Valorant), donanım hızlandırmayı açarak tarayıcı yükünü GPU'ya kaydırmak. LUPER bu geçişi oyunun türüne göre otomatik yapacak bir profil sunabilir.
- **Thread Afinitesi (Core Affinity) İzolasyonu:** Process Hacker/Process Lasso gibi araçların yaptığı gibi, `chrome.exe` veya `msedge.exe` işlemlerini, oyunun kullandığı ana P-Core'lardan (Performans Çekirdekleri) uzaklaştırıp E-Core'lara (Verimlilik Çekirdekleri) zorlamak. Bu, CPU Cache (L3) paylaşımlarında oluşacak gecikmeleri önler.

## 4. LUPER İçin Ekstrem Kod Entegrasyon Tavsiyeleri
Aşağıdaki yöntemler Windows API (Win32) ve PowerShell kullanılarak LUPER'ın motoruna eklenebilir:

1. **Efficiency Mode (Eco Mod) Zorlaması:**
   Oyun başladığında, arka planda çalışan tüm tarayıcı süreçlerine Windows 11'in "Efficiency Mode" API'si (SetProcessInformation ile `ProcessPowerThrottling`) uygulanarak bu süreçlerin CPU kullanımı kısıtlanabilir.

2. **Empty Working Set (RAM Boşaltımı):**
   Ağır bir oyuna girmeden hemen önce veya periyodik olarak, arka plandaki tarayıcıların kullandığı kullanılmayan bellek bloklarını boşaltmak için `EmptyWorkingSet()` Win32 API'si çağrılabilir. Bu sayede tarayıcı sekmesi kapanmaz ancak RAM'deki kapladığı alan diske (pagefile) itilerek ana bellekte devasa bir yer açılır.

3. **Ağ Önceliği (QoS - Quality of Service):**
   Tarayıcı süreçlerinin ağ paket önceliği en düşük seviyeye çekilerek, e-spor oyunlarının (CS2, Valorant vb.) ağ paketleri her zaman öncelikli hale getirilebilir. (Bufferbloat ve ping dalgalanmalarını önlemek için).

## 5. Sonuç
En iyi optimizasyon tarayıcıyı tamamen kapatmaktır. Ancak e-spor oyuncuları Spotify veya Discord'u tarayıcıdan kullanmak istiyorsa, LUPER'ın yukarıdaki **Affinity yönlendirmesi**, **Eco Mode zorlaması** ve **V-Sync kapalı başlatma** parametrelerini otomatik uygulayan bir "Extreme Game Mode" sunması büyük fark yaratacaktır.
