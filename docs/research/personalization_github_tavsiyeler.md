# LUPER Personalization - İkinci Araştırma Dalgası: GitHub ve E-Spor Odaklı DWM Optimizasyonları

**Hedef:** Sıfır Gecikme (Zero Latency) ve Zirve FPS (Peak FPS)
**Kategori:** Personalization (Görsel DWM Yükü Azaltma)
**Kaynaklar:** Gelişmiş GitHub Repoları (örn. AlchemyTweaks, valleyofdoom) ve Hardcore E-Spor Forumları

Bu rapor, masaüstü pencere yöneticisi (DWM) ve görsel efektlerin yarattığı gecikmeleri minimize etmek üzere GitHub üzerindeki derinlikli araştırma ve testlerden elde edilen en agresif (fakat stabil) kod/kayıt defteri tavsiyelerini içermektedir.

---

## 1. DWM Flip Mode ve Presentation Optimizasyonları

Oyunlarda gecikmeyi azaltmanın en önemli yollarından biri DWM'in kompozisyon aşamalarını bypass etmektir. Yeni nesil oyun motorları "Flip Model" kullanır ancak bazı Windows ayarları bunu engelleyebilir.

### `DisableIndependentFlip`
*   **Kayıt Defteri (Registry) Yolu:** `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\Dwm`
*   **Önerilen Değer:** `0` (DWORD)
*   **Açıklama:** Bu değerin `0` olarak ayarlanması, "Independent Flip" (Bağımsız Çevirme) modunun aktif olmasını sağlar. Desteklenen tam ekran veya pencereli tam ekran (borderless) oyunlarda DWM kompozisyonunu atlayarak doğrudan ekrana kare basılmasını sağlar. Bu sayede ekran yırtılması (tearing) olmadan en düşük input lag elde edilir.

### `DisableAdvancedDirectFlip`
*   **Kayıt Defteri (Registry) Yolu:** `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\Dwm`
*   **Önerilen Değer:** `0` (DWORD)
*   **Açıklama:** Gelişmiş doğrudan çevirme özelliğini devre dışı bırakmayı engeller (yani aktif tutar). Modern GPU'larda sunum gecikmesini (presentation latency) milisaniyeler düzeyinde azaltan kritik bir değerdir.

---

## 2. Multi-Plane Overlay (MPO) Kontrolleri

MPO (Çoklu Düzlem Yerleşimi), modern GPU'ların video ve oyunları aynı ekranda DWM'i yormadan oluşturmasını sağlar. Normalde MPO gecikmeyi azaltır, ancak bazı spesifik ekran kartı sürücülerinde (özellikle AMD veya eski NVIDIA sürücüleri) "stutter" (takılma) yaratabilir.

### `OverlayTestMode`
*   **Kayıt Defteri (Registry) Yolu:** `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\Dwm`
*   **Önerilen Değer:** Takılma yaşanıyorsa `5` (DWORD)
*   **Açıklama:** Değeri `5` yapmak MPO'yu sistem genelinde devre dışı bırakır. E-sporcular, ani FPS düşüşlerini engellemek ve saf tam ekran gecikme optimizasyonu elde etmek için duruma göre bu ayarı kapatmayı tercih edebilirler. Ancak sorunsuz sistemlerde MPO açık kalmalıdır.

---

## 3. "DWM.exe'yi Kapatma" (Kill DWM) Efsanesi Üzerine Kritik Uyarı

Geçmişte Windows 7 döneminde DWM (Aero) tamamen kapatılabiliyordu. Ancak modern Windows 10 ve Windows 11 mimarisinde:
*   **Kesinlikle Önerilmez:** DWM'in "suspend" edilmesi veya zorla kapatılması, Başlat menüsünün bozulmasına, pencere çizim hatalarına, görev çubuğu kilitlenmelerine ve V-Sync senkronizasyonunun tamamen çökmesine (korkunç yırtılmalara) neden olur.
*   **Modern Yaklaşım:** DWM'i kapatmak yerine, `DisableIndependentFlip = 0` gibi yöntemlerle oyunların DWM'i otomatik olarak bypass etmesini sağlamak (FSE - Full Screen Exclusive veya FSO - Full Screen Optimizations) modern ve tek geçerli e-spor standardıdır.

---

## 4. Test ve Doğrulama Metodolojisi (PresentMon)

Körlemesine Kayıt Defteri ayarları girmek yerine GitHub komünitesinin en büyük tavsiyesi **PresentMon** (Intel/GameTechDev) aracı ile sunum (presentation) modlarını izlemektir.
*   Bir oyun açıldığında PresentMon üzerinde "Hardware Composed: Independent Flip" görülüyorsa, gecikme optimizasyonunuz maksimum seviyededir ve DWM oyununuza müdahale etmiyor demektir. "Composed: Copy with GPU GDI" gibi değerler görülüyorsa DWM araya giriyor ve input lag ekliyor demektir.

## Sonuç
LUPER yazılımı için bu ayarların bir "E-Spor / Ultra Düşük Gecikme" profili altında sunulması, kullanıcılara önce MPO durumunu test ettirmesi ve Flip Mode kayıt defteri anahtarlarını güvenli bir şekilde (yedek alarak) `0` değerine çekmesi hedeflenmelidir.
