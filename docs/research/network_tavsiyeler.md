# LUPER E-Spor Network ve İnternet Optimizasyon Araştırması

Bu belge, LUPER için e-sporcuların (CS2, Valorant, vb.) ping sürelerini düşürmek ve paket kayıplarını (packet loss) önlemek amacıyla kullanabileceği gelişmiş (hidden/advanced) ağ optimizasyon tekniklerini içermektedir.

## 1. TCP ve Ağ Yığını İnce Ayarları (Command Prompt)

Windows'un ağ paketlerini işleme biçimini optimize etmek için Komut İstemi (Yönetici) üzerinden aşağıdaki ayarlar uygulanabilir:

*   **TCP Auto-Tuning'i Devre Dışı Bırakma:**
    ```cmd
    netsh int tcp set global autotuninglevel=disabled
    ```
    *Açıklama:* Windows'un pencere boyutunu (window size) agresif bir şekilde ayarlamasını önleyerek bazı durumlarda gecikmeyi (latency) azaltabilir.

*   **Heuristics'i Devre Dışı Bırakma:**
    ```cmd
    netsh int tcp set heuristics disabled
    ```
    *Açıklama:* Windows'un TCP ağ trafiği optimizasyonlarını manuel kontrole bırakır, ani ping fırlamalarını engelleyebilir.

*   **RSC (Receive Segment Coalescing) Kapatma:**
    ```cmd
    netsh int tcp set global rsc=disabled
    ```
    *Açıklama:* Windows'un paketleri birleştirmesini engeller. İşlemci yükünü biraz artırsa da oyun paketlerinin beklemeden işlenmesini sağlayarak ping'i düşürür.

## 2. Gelişmiş Kayıt Defteri (Registry) Tweak'leri

> **UYARI:** Kayıt defterinde değişiklik yapmadan önce mutlaka geri yükleme noktası oluşturulmalıdır! (Gelecekteki LUPER registry aracı bu yedeklemeyi otomatik yapacaktır.)

*   **NetworkThrottlingIndex (Ağ Darboğazını Kaldırma):**
    *   **Yol:** `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile`
    *   **Değer:** `NetworkThrottlingIndex` (DWORD)
    *   **Veri:** `ffffffff` (Onaltılık/Hexadecimal)
    *   **Açıklama:** Windows, varsayılan olarak multimedya dışı ağ trafiğini sınırlar. Bu değer darboğazı tamamen kaldırır.

*   **SystemResponsiveness (Sistem Tepkiselliği):**
    *   **Yol:** `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile`
    *   **Değer:** `SystemResponsiveness` (DWORD)
    *   **Veri:** `0`
    *   **Açıklama:** Arka plan işlemlerine ayrılan önceliği düşürüp oyunların ağ işlemlerine öncelik tanır.

*   **Nagle Algoritmasını Devre Dışı Bırakma (TcpAckFrequency ve TCPNoDelay):**
    *   **Yol:** `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces\{Bağdaştırıcı-ID}`
    *   **Değer:** `TcpAckFrequency` (DWORD) = `1`
    *   **Değer:** `TCPNoDelay` (DWORD) = `1`
    *   **Açıklama:** Nagle algoritması paketleri biriktirip tek seferde göndermeyi hedefler (bant genişliği tasarrufu). Ancak bu, oyunlarda gecikmeye (latency) neden olur. Bu iki değeri `1` yapmak, paketlerin anında iletilmesini sağlar.

## 3. Ağ Bağdaştırıcısı (Driver) Seviyesi Ayarlar (Device Manager)

Aygıt Yöneticisi -> Ağ Bağdaştırıcıları -> Özellikler -> Gelişmiş sekmesi altındaki kritik ayarlar:

*   **Interrupt Moderation (Kesme Yönetimi):** `Disabled`
    *   *Açıklama:* Bu ayar kapatıldığında, ağ kartı gelen her paketi anında CPU'ya iletir. İşlemci kullanımını bir miktar artırsa da gecikmeyi minimuma indirir.

*   **Large Send Offload (LSO) v2 (IPv4/IPv6):** `Disabled`
    *   *Açıklama:* Büyük paketlerin parçalanması işini CPU'dan alıp ağ kartına veren bu özellik, bazı ağ kartlarında bug'lı çalışarak paket kayıplarına yol açabilir. Kapatılması e-sporcular için önerilir.

## Sonuç ve Doğrulama
Bu işlemlerden sonra `ping -n 50 <server_ip>` komutuyla (örneğin Google DNS `8.8.8.8` veya oyun sunucuları) Jitter ve Packet Loss testi yapılmalıdır. LUPER uygulaması, bu metrikleri bir dashboard'da toplayıp optimizasyon öncesi/sonrası kıyaslaması sunabilir.
