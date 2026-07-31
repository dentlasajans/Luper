# LUPER CPU ve Zamanlayıcı (Scheduler) Optimizasyonu - GitHub & Hardcore Espor Araştırmaları

Bu doküman, GitHub ve hardcore e-spor forumlarından elde edilen ileri düzey (sıfır gecikme, zirve FPS) CPU, DPC ve Zamanlayıcı (Scheduler) optimizasyon tavsiyelerini içermektedir. Bu yöntemler, LUPER platformuna entegre edilebilecek veya referans alınabilecek **ekstrem** seviye sistem ayarlamalarıdır.

## 1. DPC Gecikmesini (DPC Latency) Azaltma Yöntemleri
DPC (Deferred Procedure Call) gecikmesi, sistemdeki sürücülerin ve donanımların işlemciyi ne kadar süreyle meşgul ettiğini gösterir. Yüksek DPC gecikmesi FPS yüksek olsa bile mikro takılmalara (micro-stutters) ve girdi gecikmesine (input lag) yol açar.

*   **MSI (Message Signaled Interrupts) Modu:** Donanımların (özellikle GPU ve ağ kartlarının) geleneksel IRQ (Interrupt Request) paylaşımı yerine doğrudan işlemciye mesaj göndermesini sağlar. GitHub'da yer alan çeşitli `.bat` ve `.ps1` betikleri, cihazların MSI modunu kayıt defteri (Registry) üzerinden aktif hale getirerek sürücü çakışmalarını ve DPC gecikmesini dramatik ölçüde düşürmektedir.
*   **LatencyMon ile Teşhis:** Hangi `.sys` sürücüsünün (örneğin `ndis.sys` veya `nvlddmkm.sys`) gecikmeye sebep olduğunu bulmak esastır. Hardcore optimizasyon scriptleri, bu sürücüleri CPU'nun "0" numaralı çekirdeğinden uzaklaştırarak oyun süreçlerinin bölünmesini engeller.

## 2. İşlemci Benzeşimi (CPU Affinity) ve Core Parking Kapatma
Oyunların ve kritik arka plan işlemlerinin hangi işlemci çekirdeklerinde çalışacağını belirlemek, Windows'un varsayılan (ve bazen hantal olan) zamanlayıcısının yerini alabilir.

*   **Çekirdek Kilitleme (Affinity Locking):** GitHub'daki `BigBE4TS/OptiMax-Pro-Tuner` ve `affinity-rs/ThreadPilot` gibi projeler, oyunları yalnızca fiziksel veya yüksek performanslı (P-Cores) çekirdeklere kilitler. Bu, Windows Scheduler'ın oyun iş parçacıklarını E-Core'lara (Verimlilik Çekirdekleri) veya çapraz CCX (Core Complex) düğümlerine atamasını engelleyerek %1 ve %0.1 Low FPS değerlerini mükemmelleştirir.
*   **Dinamik Süreç İzolasyonu:** Arka plan hizmetleri ve Discord/OBS gibi uygulamalar tamamen ayrı çekirdeklere (örneğin son iki çekirdek) atanarak, oyunun ana iş parçacığının bulunduğu çekirdekler "sessiz" ve kesintisiz hale getirilir.
*   **SMT / Hyper-Threading Kapatma:** Mantıksal işlemciler arasındaki kaynak çekişmesini (contention) engellemek için, rekabetçi oyunlarda SMT kapatılıp oyunların yalnızca fiziksel çekirdeklere (örneğin Core 0, 2, 4, 6) yönlendirilmesi gecikmeyi milisaniyeler seviyesinde azaltmaktadır.

## 3. Windows Zamanlayıcı (Scheduler) ve Öncelik (Priority) Ayarları
Windows zamanlayıcısının oyunlar lehine karar vermesi için süreçlerin G/Ç (I/O) ve CPU önceliklerinin yönetilmesi gerekir.

*   **Süreç Yöneticileri (Process Governors):** `SystemXFiles/process-governor` benzeri projeler, oyun `exe`'lerinin önceliğini "High" (Yüksek) veya "Realtime" (Gerçek Zamanlı) olarak zorlar. Bu sayede oyun süreçleri, arka plan hizmetlerinin önünde işlem görür.
*   **Zamanlayıcı Çözünürlüğü (Timer Resolution):** Windows'un varsayılan 15.6ms olan zamanlayıcı çözünürlüğünü `SetTimerResolution` gibi API çağrılarıyla 0.5ms'ye (veya bazı özel tweakler ile daha da altına) düşürmek, işletim sisteminin döngü süresini hızlandırır ve oyun motorlarının daha tutarlı kare süreleri (frametime) üretmesini sağlar.

## 4. Anti-Cheat ve Güvenlik Hususları (Sıfır Enjeksiyon)
Hardcore e-spor optimizasyonlarında en çok dikkat edilen konulardan biri, yapılan işlemlerin Vanguard, Faceit AC veya EasyAntiCheat gibi sistemler tarafından hile (ban) olarak algılanmamasıdır.
*   Süreç belleklerine müdahale (Injection) eden araçlar yerine, tamamen **Windows NT Kernel API'lerini** (örneğin `SetProcessAffinityMask`) kullanan "Zero-Injection" (Sıfır Enjeksiyon) yöntemleri tercih edilmektedir. LUPER'ın mimarisinde C++ veya Native Windows API çağrılarının dışarıdan bir müdahale değil, yasal bir sistem yönetim yetkisi olarak tasarlanması zorunludur.

## Sonuç ve LUPER Entegrasyon Önerisi
LUPER platformuna, oyuncular için özel bir "E-Spor Zirve FPS Modu" eklenmesi önerilir. Bu mod şu işlevleri otomatize edebilir:
1. Oyun açıldığında arka plan Windows hizmetlerini belirli çekirdeklere (E-Core veya CCX2) hapsetmek.
2. Ekran kartı ve ağ bağdaştırıcıları için MSI modunu kontrol edip açık olduğundan emin olmak.
3. Oyun sürecinin önceliğini otomatik olarak "High" yapmak ve Timer Resolution'ı 0.5ms'ye sabitlemek.
4. Ağ kesilmelerini ve `ndis.sys` işlemlerini oyunun çalışmadığı çekirdeklere yönlendirmek.

Bu özellikler, LUPER'ın "Sıfır Gecikme" vaadini piyasadaki standart optimizasyon yazılımlarının çok ötesine, doğrudan e-spor profesyonellerinin kullandığı seviyeye taşıyacaktır.
