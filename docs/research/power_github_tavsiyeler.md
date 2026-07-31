# ⚡ LUPER İkinci Araştırma Dalgası: GitHub E-Spor Güç (Power & Idle States) Optimizasyon Raporu

**Tarih:** 30 Temmuz 2026  
**Hedef:** Sıfır gecikme, zirve FPS, mikro-stutter'ları (takılmaları) yok etme.  
**Odak:** GitHub ve Hardcore E-Spor topluluklarındaki en güncel "Power" ve "Idle States" (C-States) script'leri ve tavsiyeleri.

---

## 1. Giriş ve Temel Felsefe
E-spor odaklı GitHub projelerinde (ör. *kaylerberserk/WindowsOptimizer*, *theantipopau/windows11nontouchgamingoptimizer*, *NEKR1D/PC-OPTIMIZATION*) donanımın ve işletim sisteminin güç tasarrufu modlarının gecikmeye (latency) neden olduğu kabul edilir. Temel amaç, CPU'nun derin uyku durumlarına girmesini engelleyerek "uyku modundan uyanma" (wake-up penalty) gecikmesini sıfıra indirmektir.

## 2. C-States ve İşlemci Güç Yönetimi (Idle States)
İşlemci çekirdeklerinin kullanılmadığı anlarda girdiği güç tasarrufu durumlarına **C-States** denir.
*   **Sorun:** C1E, C3, C6 gibi derin uyku durumlarından aktif (C0) durumuna geçiş, milisaniyelik gecikmeler yaratır. Rekabetçi oyunlarda bu durum frame time (kare süresi) tutarsızlıklarına ve takılmalara yol açar.
*   **GitHub Tavsiyeleri:** 
    *   BIOS üzerinden "Global C-State Control", "C1E" ve "Intel SpeedStep / AMD Cool'n'Quiet" ayarlarının **Disable** edilmesi önerilir.
    *   İşletim sistemi seviyesinde "Idle Disable" (Boşta Beklemeyi Kapat) powercfg ayarlarının zorlanması yaygındır.
*   **Modern İstisna (AMD X3D vb.):** Bazı yeni nesil önbellek odaklı işlemcilerde (örn. AMD Ryzen 7 7800X3D), aşırı agresif güç profilleri termal sınırı (thermal throttling) çabuk tetikleyebilir. Bu tarz sistemlerde "Balanced" (Dengeli) modun üzerine sadece Idle State'leri kapatan özel ince ayarlar yapılması tavsiye edilmektedir.

### 📌 Örnek Gelişmiş `powercfg` Kodları (Idle States Disable)
GitHub'daki scriptlerde sıkça kullanılan gizli güç ayarlarını açma ve Idle State'leri kapatma komutları:

```powershell
# Gizli İşlemci Güç Yönetimi Ayarlarını Görünür Kılma
powercfg -attributes SUB_PROCESSOR 5d76a2ca-e8c0-402f-a133-2158492d58ad -ATTRIB_HIDE
powercfg -attributes SUB_PROCESSOR 4a2f6c5f-1c14-4276-8531-e0c1592398ee -ATTRIB_HIDE

# Idle Disable (İşlemci Boşta Bekleme Durumlarını Kapatma)
# 000 = Disable (Gecikmeyi engeller, sürekli aktif tutar)
powercfg -setacvalueindex SCHEME_CURRENT SUB_PROCESSOR IDLEDISABLE 000
powercfg -setactive SCHEME_CURRENT
```

## 3. Kesme (Interrupt) ve Timer Latency Optimizasyonları
İşlemcinin uyanık kalması kadar, donanımlarla (özellikle GPU) iletişiminin de kesintisiz olması gerekir.
*   **MSI Mode (Message Signaled Interrupts):** IRQ çakışmalarını ve DPC (Deferred Procedure Call) gecikmelerini düşürmek için ekran kartı, ağ bağdaştırıcısı ve NVMe disklerin MSI Moduna (Line-Based kesmeler yerine) alınması GitHub depolarında standart bir adımdır (Örn: *vadyaravadim/msi-mode-utility*).
*   **Timer Resolution:** Windows'un varsayılan zamanlayıcı çözünürlüğünü 15.6ms'den 0.5ms'ye (hatta destekleyen donanımlarda daha altına) düşürmek, input lag'ı (giriş gecikmesini) azaltır.

## 4. Sistem ve Scheduler (Zamanlayıcı) İnce Ayarları
CPU'nun sadece oyun iş parçacıklarına odaklanmasını sağlamak için:
*   Arka planda çalışan gereksiz telemetri hizmetlerinin ve Windows Defender zamanlanmış taramalarının oyun sırasında durdurulması.
*   Oyun (Game) process'inin `High` (Yüksek) önceliğe alınarak CPU Scheduler'da (Zamanlayıcı) ilk sıraya yerleştirilmesi.

## 5. Önemli Uyarılar ve LUPER Entegrasyonu İçin Notlar
*   **Risk ve Termal Etki:** Idle State'leri tamamen kapatmak, sistemin sürekli yüksek voltaj çekmesine ve ısınmasına neden olur. Laptop veya yetersiz soğutmalı masaüstü sistemlerde bu durum, hız aşırtma (throttling) kaynaklı FPS düşüşlerine yol açabilir.
*   **LUPER Stratejisi:** LUPER içerisinde bu ayarlar **"E-Sports / Extreme Mode"** adı altında, kullanıcının onayı (UAC) ve termal riskleri anladığına dair bir uyarı ile sunulmalıdır.
*   **Geri Dönüş (Rollback):** LUPER'ın her "Power" işleminden önce mevcut güç planının bir kopyasını alması (örn. `powercfg -export`) ve C-States / MSI değişiklikleri öncesi Sistem Geri Yükleme Noktası (Restore Point) oluşturması zorunludur.

---
*Rapor, GitHub üzerindeki genel geçer optimizasyon prensipleri baz alınarak LUPER geliştirme sürecine rehber olması amacıyla hazırlanmıştır.*
