# Gelişmiş Privacy (Gizlilik) & Telemetry Optimizasyonları (GitHub ve E-Spor Odaklı)

Bu belge, LUPER için ikinci araştırma dalgası kapsamında GitHub depolarından ve e-spor forumlarından toplanan, "Sıfır Gecikme ve Zirve FPS" hedefine yönelik en ekstrem Privacy/Telemetry (Arka plan casus servisler) kapatma ve optimizasyon taktiklerini içermektedir.

## 1. Popüler ve Güvenilir GitHub Depoları / Scriptler

### 1.1. Chris Titus Tech's Windows Utility (WinUtil)
- **Açıklama:** GitHub üzerinde en çok yıldız alan ve topluluk tarafından sürekli güncellenen araçlardan biridir. "Debloat" ve "Telemetry" kapatma işlemlerini hem "Standart" hem de "Gelişmiş (Advanced)" seviyelerde yapabilmenizi sağlayan bir PowerShell arayüzü sunar. E-spor oyuncuları arka plan yükünü azaltmak için "Advanced Tweaks" bölümünü sıkça kullanır.
- **Odak Noktası:** Gereksiz Windows servislerini, telemetry'yi (Diagnostic Data) durdurma, Cortana ve Edge gibi arka plan servislerini izole etme.
- **LUPER İçin Ders:** LUPER'ın PowerShell scriptleri için WinUtil'in esnek GUI ve komut yapısından esinlenilebilir; kullanıcıya nelerin kapatılacağını seçtiren modüler bir yapı kurulmalıdır.

### 1.2. privacy.sexy
- **Açıklama:** Tamamen açık kaynaklı ve web tabanlı bir "script oluşturucu"dur. Hangi telemetry ayarlarının (Registry key, Scheduled Tasks, Services) kapatılacağını çok ince ayrıntılarına kadar gösterir.
- **Odak Noktası:** Gelişmiş şeffaflık. Yüzlerce ufak registry anahtarına müdahale ederek Windows'un eve veri göndermesini engeller.
- **LUPER İçin Ders:** E-sporcular PC'lerinin arkada ne yaptığını bilmek ister. LUPER, privacy.sexy benzeri bir şeffaflıkla hangi Windows kayıt defteri anahtarlarının değiştirildiğini açıklamalıdır.

### 1.3. N0tHorizon / WindowsTelemetryBlocker
- **Açıklama:** Özel olarak telemetry sunucularını host dosyasından veya firewall üzerinden engelleyen, servisleri durduran ve modüler bir geri alma (rollback) sistemi içeren GitHub tabanlı bir projedir.
- **Odak Noktası:** Ağ gecikmesini (ping dalgalanmaları) önlemek adına Windows'un arka planda telemetry sunucularına veri göndermek için bant genişliğini kullanmasını engellemek.
- **LUPER İçin Ders:** Ağ tarafında telemetry sunucularının (vortex.data.microsoft.com vb.) Hosts dosyası veya Windows Firewall kuralları ile kalıcı olarak engellenmesi, online oyunlarda anlık ping zıplamalarını önlemek için kritik bir "Privacy" taktiğidir.

## 2. Hardcore E-Spor Odaklı Telemetry Kapatma Taktikleri

### 2.1. Diagnostic Tracking Service (DiagTrack) Katliamı
- **Durum:** Sadece servisi durdurmak yetmez, servis e-spor maçının ortasında tetiklenip kaynak tüketebilir.
- **Tavsiye:** `sc delete DiagTrack` veya `REG ADD "HKLM\SYSTEM\CurrentControlSet\Services\DiagTrack" /v Start /t REG_DWORD /d 4 /f` komutları ile servisin tamamen felç edilmesi e-spor camiasında yaygındır.

### 2.2. Scheduled Tasks (Zamanlanmış Görevler) Temizliği
- **Durum:** Windows, bilgisayarın boşta olduğunu düşündüğünde (bazen oyun oynarken bile) "Customer Experience Improvement Program" gibi görevleri başlatır.
- **Tavsiye:** `\Microsoft\Windows\Customer Experience Improvement Program` altındaki tüm görevlerin PowerShell via `Disable-ScheduledTask` ile devre dışı bırakılması. Bu işlem mikro-stuttering'i (anlık takılmaları) engeller.

### 2.3. Appraiser ve Game DVR/Bar Kapatılması
- **Durum:** Xbox Game Bar'ın arka planda klip kaydetmeye hazır beklemesi ve Appraiser telemetry'si FPS drop sebebidir.
- **Tavsiye:** Kayıt defterinden `AppCaptureEnabled` (0) ve `GameDVR_Enabled` (0) değerlerinin girilmesi, profesyonel oyuncuların ilk yaptığı işlemlerden biridir.

## 3. Önemli Güvenlik ve İstikrar Uyarıları

Hardcore e-spor optimizasyonları her zaman "sıfır gecikme" vaat etse de bazı tehlikeleri vardır:
- **Geri Dönüş Noktası (Restore Point):** LUPER kesinlikle, privacy scriptlerini çalıştırmadan önce bir sistem geri yükleme noktası almalıdır (Windows Registry Specialist ajanı tarafından denetlenmeli).
- **Windows Update Bozulmaları:** Bazı scriptler telemetry'yi kapatırken yanlışlıkla BITS veya Windows Update servislerini bozabilir. Bu da uzun vadede güvenlik zafiyeti yaratır. Modüler ve güvenli bir "Privacy" yaklaşımı, işletim sisteminin temel güncellemelerini bozmamalıdır.
- **"Yılan Yağı" Çözümlere Dikkat:** Her servisi kapatmak performansı artırmaz. LUPER yalnızca CPU interrupt (DPC latency) yaratan ve ağ bant genişliğini sömüren spesifik telemetry servislerine odaklanmalıdır.

## Sonuç ve Eylem Planı
LUPER'ın "Privacy" modülü, yukarıdaki GitHub scriptlerinin en stabil ve ağ gecikmesini düşüren (ping optimizasyonu sağlayan) Registry ve Servis komutlarını harmanlamalıdır. Uygulanacak tüm ince ayarlar şeffaf olmalı, kullanıcının e-spor performansı ile günlük kullanım arasında seçim yapmasına olanak tanıyan bir "Extreme Mode" içermelidir.
