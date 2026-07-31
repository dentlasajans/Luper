# 🚀 LUPER - İleri Düzey CPU ve Zamanlayıcı (Scheduler) Optimizasyon Raporu

**Model Used: Gemini 3.1 Pro (pro tier)** 

Bu belge, oyun performansını (Özellikle %1 Low FPS, micro-stuttering ve gecikmeleri) iyileştirmek amacıyla Windows Zamanlayıcısı (Scheduler), Çekirdek Park Etme (Core Parking) ve DPC Latency üzerine yapılan ileri düzey (hidden/advanced) araştırmaları ve uygulanabilir kod tavsiyelerini içerir.

## 1. Core Parking (Çekirdek Park Etme) Kapatma

Core parking, Windows'un güç tasarrufu amacıyla boştaki CPU çekirdeklerini uyku durumuna almasıdır. Oyunlar anlık olarak yüksek CPU gücü talep ettiğinde, çekirdeklerin uykudan uyanması (unparking) gecikmeye (micro-stutter) yol açabilir. 

**Önerilen Komut İstemi (CMD / PowerShell) Yöntemi:**
Kayıt defterini manuel düzenlemek yerine, `powercfg` komutu ile Gizli Güç Ayarlarını (Minimum İşlemci Durumu vb.) görünür kılıp %100'e çekmek en güvenli yöntemdir.

```powershell
# Core Parking ayarını Güç Seçenekleri menüsünde görünür yapar:
powercfg -attributes SUB_PROCESSOR 0cc5b647-c1df-4637-891a-dec35c318583 -ATTRIB_HIDE

# İsteğe bağlı olarak mevcut güç planında direkt olarak Core Parking limitlerini kaldırmak için:
powercfg -setacvalueindex SCHEME_CURRENT SUB_PROCESSOR 0cc5b647-c1df-4637-891a-dec35c318583 100
powercfg -setactive SCHEME_CURRENT
```

## 2. Multimedia Class Scheduler (MMCSS) ve Foreground Priority Tweaks

Windows, arka plan görevleri ile aktif uygulama (oyun) arasında CPU zamanını paylaştırır. MMCSS ayarları üzerinden oyunların CPU önceliğini zorlamak bazı sistemlerde tepkiselliği artırabilir.

**Registry (Kayıt Defteri) Tavsiyeleri:**

*   **Win32PrioritySeparation:** Ön plandaki uygulamalara CPU döngüsünde ne kadar daha uzun süre verileceğini belirler.
    ```powershell
    # Ön plan uygulamasına en yüksek kısa/değişken kuantum süresini atamak (Oyunlar için önerilen Hex Değer: 26 veya 28)
    reg add "HKLM\SYSTEM\CurrentControlSet\Control\PriorityControl" /v Win32PrioritySeparation /t REG_DWORD /d 38 /f
    # Not: /d 38 Decimal(Onluk) karşılığıdır, Hex(On altılık) olarak 26'ya denk gelir.
    ```

*   **MMCSS Oyun Profili Optimizasyonu:** Oyunların CPU önceliğini ve zamanlayıcı kategorisini "High" olarak ayarlayarak sistemin oyun iş parçacıklarına (threads) öncelik vermesi sağlanabilir.
    ```powershell
    reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "GPU Priority" /t REG_DWORD /d 8 /f
    reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "Priority" /t REG_DWORD /d 6 /f
    reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games" /v "Scheduling Category" /t REG_SZ /d "High" /f
    ```

## 3. DPC Latency (Gecikmeli Prosedür Çağrısı Gecikmesi) Çözümleri

DPC Latency, genellikle kötü yazılmış donanım sürücüleri (özellikle ses, ağ veya GPU) nedeniyle oluşur ve seste cızırtı veya ekranda anlık takılmalar olarak kendini gösterir. Core Parking'in kapatılması buna bazen yardımcı olsa da asıl çözüm IRQ (Kesme İsteği) çakışmalarını yönetmektir.

**Çözüm ve Tavsiyeler:**
1.  **Sürücü Güncellemeleri:** Her zaman Chipset ve Ekran Kartı sürücülerini güncel tutun.
2.  **MSI (Message Signaled Interrupts) Mode:** Ekran kartınızın ve uyumlu ağ kartlarınızın MSI Modunda çalışmasını zorlamak, IRQ paylaşımlarını azaltarak DPC gecikmesini büyük ölçüde düşürebilir.

```powershell
# Örnek Registry Yolu (Cihaz Instance ID'sine göre değişir, otomatik bir PowerShell scripti ile taranarak uygulanmalıdır):
# HKLM\SYSTEM\CurrentControlSet\Enum\PCI\VEN_XXXX&DEV_XXXX...\Device Parameters\Interrupt Management\MessageSignaledInterruptProperties
# "MSISupported" = 1 (DWORD)
```

## ⚠️ Kritik Uyarılar (Risk Analizi)
*   **Isı ve Güç Tüketimi:** Core Parking'in tamamen devre dışı bırakılması, sistemin boşta (idle) daha fazla güç tüketmesine ve ısınmasına neden olur. Laptoplarda pil ömrünü ciddi anlamda kısaltır.
*   **Placebo Etkisi ve Kararlılık:** Windows 10/11'in zamanlayıcısı oldukça gelişmiştir (Özellikle Windows 11 ile gelen Intel Thread Director). MMCSS ve Priority tweakleri modern işlemcilerde her zaman mucizevi bir artış sağlamayabilir ve yanlış konfigürasyon sistem kararsızlıklarına sebep olabilir. Her işlemden önce Sistem Geri Yükleme Noktası (Restore Point) alınması zorunludur.
