# LUPER Araştırma Raporu: Ekstrem Telemetri & Gecikme Optimizasyonları (GitHub / E-Spor)

**Tarih:** 30 Temmuz 2026  
**Hedef:** Sıfır Gecikme (Zero Latency) ve Zirve FPS (Peak FPS)  
**Kapsam:** Windows Telemetri Servislerinin Kapatılması, Arka Plan İzleme Sistemlerinin Devre Dışı Bırakılması, Kayıt Defteri (Registry) İnce Ayarları

---

## 1. Giriş ve Araştırma Kapsamı

LUPER Telemetry Uzmanı olarak GitHub üzerindeki popüler optimizasyon depoları (`hellzerg/optimizer`, `ceo714/win-baseline`, `MeoHunterr/MeoBoost`, `nicholasbly/Windows-11-Latency-Optimization`) ve hardcore e-spor forumlarındaki ekstrem telemetri kapatma metotları incelenmiştir. Amaç, Windows'un arka planda veri toplayan (telemetri) servislerini en agresif şekilde kapatarak CPU yükünü hafifletmek, disk G/Ç (I/O) darboğazlarını önlemek ve input lag (giriş gecikmesi) süresini mutlak sıfıra yaklaştırmaktır.

## 2. GitHub Tabanlı Ekstrem Telemetri Kapatma Kodları ve Kayıt Defteri (Registry) Ayarları

Aşağıda, açık kaynak e-spor optimizasyon projelerinden elde edilen ve doğrudan `.reg` veya `PowerShell` ile sisteme işlenebilen en kritik değerler listelenmiştir:

### 2.1. Ana Telemetri Mekanizmalarının Devre Dışı Bırakılması

En temel telemetri toplama merkezi `DiagTrack` ve `DataCollection` ayarlarıdır. GitHub projeleri (özellikle `win-baseline` ve `Optimizer`) aşağıdaki kayıt defteri yollarını zorunlu tutmaktadır:

```registry
; Windows Telemetrisini tamamen kapatır
[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\DataCollection]
"AllowTelemetry"=dword:00000000
"MaxTelemetryAllowed"=dword:00000000

; Telemetri ile ilgili geri bildirim ve teşhis verilerini engeller
[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\DataCollection]
"AllowTelemetry"=dword:00000000

; DiagTrack (Bağlı Kullanıcı Deneyimleri ve Telemetri) Servisini Devre Dışı Bırakma
[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\DiagTrack]
"Start"=dword:00000004
```

### 2.2. Windows Customer Experience Improvement Program (CEIP) Kapatılması

CEIP, arka planda sistem performansınızı Microsoft'a raporlar. E-sporcuların en çok nefret ettiği input lag nedenlerinden biridir.

```registry
[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\SQMClient\Windows]
"CEIPEnable"=dword:00000000

[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\AppCompat]
"AITEnable"=dword:00000000
"VDMDisallowed"=dword:00000001
```

### 2.3. Zamanlayıcı ve Sistem Gecikmesi (Latency) Ayarları

MeoBoost ve diğer FPS odaklı repolar, Timer Resolution (Zamanlayıcı Çözünürlüğü) ve HPET (High Precision Event Timer) yapılandırmalarını düzenleyerek DPC gecikmesini (DPC Latency) düşürmeyi hedefler:

```powershell
# PowerShell ile HPET ve Dinamik Tik'lerin kapatılması (Ekstrem Gecikme Düşürme)
bcdedit /deletevalue useplatformclock
bcdedit /set disabledynamictick yes
bcdedit /set useplatformtick yes
```
*(Not: HPET kapatılması donanıma göre değişiklik gösterebilir, LUPER uygulamasında kullanıcı onayı alınması önerilir.)*

### 2.4. GameDVR ve Arka Plan Oyun Telemetrisi

Windows 10/11'in gömülü Xbox ve GameDVR özellikleri, anlık FPS düşüşleri ve "micro-stutter" yaratır.

```registry
; GameDVR'ı kapatır
[HKEY_CURRENT_USER\System\GameConfigStore]
"GameDVR_Enabled"=dword:00000000
"GameDVR_FSEBehaviorMode"=dword:00000002

[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\GameDVR]
"AllowGameDVR"=dword:00000000
```

## 3. Ekstrem Ağ ve TCP/IP Optimizasyonları (Sıfır Ping Gecikmesi)

Telemetri sadece disk ve işlemciyi yormaz; aynı zamanda internet bant genişliğini işgal eder. Gecikmeyi düşürmek için Nagle Algoritması devre dışı bırakılmalıdır (`TcpNoDelay` ve `TcpAckFrequency`):

```registry
; Ağ bağdaştırıcısı için (Ağ kartı GUID değerine göre uyarlanmalıdır)
[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces\{AĞ_KARTI_GUID}]
"TcpAckFrequency"=dword:00000001
"TCPNoDelay"=dword:00000001
"TcpDelAckTicks"=dword:00000000
```

## 4. Güvenlik ve Risk Analizi (LUPER Standartlarına Uygunluk)

1. **Geri Alınabilirlik:** Uygulanacak tüm bu telemetri kısıtlamaları, LUPER mimarisinin *Windows_Registry_Specialist* standartları gereğince işlem öncesinde **System Restore (Sistem Geri Yükleme Noktası)** ve `.json` tabanlı Snapshot oluşturularak yapılmalıdır.
2. **Körükörüne Yürütme Yasak (No Blind Execution):** GitHub'daki all-in-one `.exe` scriptleri yerine bu ham PowerShell ve RegEdit değerleri şeffaf bir şekilde LUPER motoruna (PowerShell Specialist üzerinden) entegre edilmelidir.
3. **AMSI ve Antivirüs:** Güvenlik katmanında bu regedit değerlerinin değiştirilmesi bazı sistemlerde "şüpheli eylem" olarak algılanabilir. LUPER, bu işlemi gerçekleştirirken yükseltilmiş UAC ayrıcalıklarını doğrudan ve güvenli bir Windows Native API köprüsü üzerinden iletmelidir.

## 5. Sonuç ve Geliştirici Ekibe Tavsiyeler

Yukarıdaki kod blokları, "Sıfır Gecikme ve Zirve FPS" misyonu için LUPER'ın `optimization_database` (Optimizasyon Veritabanı) şemasına dahil edilmelidir. Geliştirici (Developer) ve Mimar (Architect) ajanların bu kodları JSON yapılandırma dosyalarına modüler olarak eklemesi ve IPC üzerinden Native Windows Engineer ajanıyla haberleşerek uygulaması tavsiye edilir.

*Rapor Sonu*
