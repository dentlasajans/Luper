# DWM.exe RAM ve GPU Kullanımını Optimize Etme Rehberi (Personalization ve UI)

**Desktop Window Manager (dwm.exe)**, pencere saydamlığı, animasyonlar ve yüksek çözünürlüklü ölçekleme gibi Windows arayüzünün (UI) oluşturulmasından sorumlu temel bir Windows sistem işlemidir. Derinlemesine işletim sistemine entegre olduğu için **dwm.exe'yi kalıcı bir çözüm olarak devre dışı bırakamazsınız veya sonlandıramazsınız**. 

Yüksek RAM veya GPU kullanımı genellikle bir "kayıt defteri (registry) hilesi" eksikliğinden değil, sürücü çakışmalarından, yapılandırma sorunlarından veya yazılım hatalarından kaynaklanır.

Kayıt defteri (registry) hileleri (örn. Ndu veya Memory Management anahtarlarını değiştirmek) modern Windows sürümleri için güncel olmayıp sistem kararsızlığına yol açabileceğinden tavsiye edilmez. Bunun yerine aşağıdaki standart Windows arayüz (UI) ve sistem optimizasyonlarını uygulamak en güvenli ve etkili yöntemdir.

## 1. UI (Arayüz) ve Görsel Efekt Optimizasyonları
Görsel yükü azaltmak, DWM'nin temel kaynak kullanımını düşürmenin en etkili yoludur.

- **Saydamlık Efektlerini Kapatın:**
  `Ayarlar > Kişiselleştirme > Renkler` menüsüne gidin ve **Saydamlık efektleri** seçeneğini kapatın. Bu basit işlem, GPU kullanımını tek başına %10-15 oranında azaltabilir.
  
- **Görsel Efektleri Ayarlayın:**
  Başlat menüsünde "Windows'un görünümünü ve performansını ayarla" (Adjust the appearance and performance of Windows) yazarak aratın. Açılan pencerede "Görsel Efektler" sekmesi altında **En iyi performans için ayarla** seçeneğini işaretleyin. (Yazıların okunaklı kalması için sadece "Ekran yazı tiplerinin kenarlarını düzelt" seçeneğini aktif bırakabilirsiniz.)

- **Statik Arka Planlar Kullanın:**
  Yüksek çözünürlüklü veya "canlı/hareketli" duvar kağıtları yerine statik ve basit duvar kağıtları kullanmak kaynak tüketimini düşürür.

## 2. Grafik Sürücüsü Optimizasyonları
Eski veya bozulmuş grafik sürücüleri, DWM sıçramalarının bir numaralı nedenidir.

- **Temiz Kurulum (Clean Reinstall):**
  GPU sürücülerinizi Güvenli Mod'da [Display Driver Uninstaller (DDU)](https://www.wagnardsoft.com/) kullanarak tamamen kaldırın ve ardından resmi üretici web sitesinden (NVIDIA, AMD veya Intel) en güncel sürümü indirerek temiz kurulum yapın.

- **Donanım Hızlandırmalı GPU Zamanlaması (HAGS):**
  Bu özellik bazen DWM ile çakışabilir. `Ayarlar > Sistem > Monitör > Grafikler > Varsayılan grafik ayarlarını değiştir` yolunu izleyerek **Donanım hızlandırmalı GPU zamanlaması** ayarını kapatın (veya zaten kapalıysa açarak test edin) ve performans artışı olup olmadığını gözlemleyin.

## 3. Monitör ve Ekran Ayarları
Çoklu monitör kullanıyorsanız, uyumsuz ayarlar DWM'nin daha fazla çalışmasına neden olabilir.

- **Yenileme Hızlarını Senkronize Edin:**
  `Ayarlar > Sistem > Monitör > Gelişmiş ekran ayarları` yolundan tüm monitörlerinizin aynı yenileme hızına (örneğin hepsi 60Hz veya hepsi 144Hz) sahip olduğundan emin olun.
- **Çözünürlük Düşürme:**
  Eğer ikincil yüksek çözünürlüklü bir monitörünüz varsa, çözünürlüğünü düşürmek GPU üzerindeki render (oluşturma) yükünü hafifletebilir.

## 4. Anlık Sıçramaları (Spike) Giderme
- **Gereksiz Arayüz Katmanlarını (Overlay) Kapatın:**
  Xbox Game Bar, Discord Overlay veya performans izleme yazılımları, DWM'nin ekranı sürekli yeniden çizmesine neden olabilir. GPU kullanımının düzelip düzelmediğini görmek için bu özellikleri devre dışı bırakın.
- **Windows Update:**
  Sistem güncellemeleri, bilinen DWM bellek sızıntıları (memory leak) ve performans hataları için düzeltmeler içerebilir. Sisteminizi güncel tutun.
- **Windows Gezgini'ni Yeniden Başlatma:**
  Eğer devasa bir bellek veya GPU kullanımı sıçraması fark ederseniz, sistemi tamamen yeniden başlatmak yerine `Görev Yöneticisi > Windows Gezgini` (Windows Explorer) öğesine sağ tıklayıp **Yeniden Başlat** seçeneğiyle sadece Windows kabuğunu yeniden başlatabilirsiniz.

---
**Önemli Not (Registry Hakkında):** İnternette yer alan ve `dwm.exe`'nin devre dışı bırakılabileceğini veya sihirli bir registry anahtarı ile kaynak kullanımının sıfırlanabileceğini iddia eden rehberlere itibar etmeyiniz. En güvenli yöntem UI/UX optimizasyonları ve sürücü güncellemeleridir.
