# LUPER Ağ Optimizasyon Araştırması - Aşama 2: E-Spor ve GitHub Odaklı Ekstrem Tavsiyeler

Bu belge, GitHub kaynakları ve hardcore e-spor forumlarından toplanan, sıfır gecikme (ping) ve paket kaybını (packet loss) önleme odaklı ekstrem ağ (network) optimizasyon kodları ve kayıt defteri (registry) ayarlarını içermektedir.

**Dikkat:** Bu ayarlar rekabetçi oyunlarda milisaniyelerin bile önemli olduğu durumlar (zirve FPS, sıfır gecikme) için hedeflenmiştir. Uygulamadan önce sistemin yedeklenmesi veya bir geri yükleme noktası oluşturulması şiddetle önerilir.

---

## 1. Nagle Algoritmasını Devre Dışı Bırakma (TCP Paket Optimizasyonu)

Nagle algoritması, veri iletimi verimliliğini artırmak için küçük veri paketlerini birleştirerek gönderir. Ancak bu işlem, hızlı tepki gerektiren e-spor oyunlarında (Valorant, CS2 vb.) ping'i ve input lag'i artırabilir. Bunu devre dışı bırakmak, her bir verinin gecikmeksizin anında gönderilmesini sağlar.

**Kayıt Defteri Yolu:**
`HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces\{Aktif-Ağ-Adaptörü-ID}`

*(Not: Ağ Adaptörü ID'sini (GUID), bu klasördeki IP adresinizi içeren alt anahtardan bulabilirsiniz.)*

**Uygulanacak Değerler (DWORD 32-bit):**
- `TcpAckFrequency` = `1`
- `TCPNoDelay` = `1`
- `TcpDelAckTicks` = `0`

## 2. Ağ Darboğazını (Network Throttling) Kaldırma

Windows işletim sistemi, varsayılan olarak multimedya uygulamalarına (medya oynatıcılar vb.) öncelik vererek diğer ağ işlemlerini kısıtlayabilir (throttle). Bu limiti tamamen kaldırmak, ağın potansiyelini sonuna kadar kullanmanızı sağlar.

**Kayıt Defteri Yolu:**
`HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile`

**Uygulanacak Değer (DWORD 32-bit):**
- `NetworkThrottlingIndex` = `ffffffff` (Onaltılık - Hexadecimal)

## 3. Ağ Bağdaştırıcısı Gelişmiş Ayarları (Aygıt Yöneticisi)

Kayıt defterine ek olarak, ağ kartının donanımsal seviyede gecikmesini azaltmak için Aygıt Yöneticisi'nden (Device Manager) bazı ayarların yapılması GitHub komünitesinde sıkça tavsiye edilmektedir:

**Yol:** `Aygıt Yöneticisi` > `Ağ Bağdaştırıcıları` > [Ağ Kartınız] > `Gelişmiş` (Advanced)

- **Interrupt Moderation (Kesme Yavaşlatıcısı):** `Disabled` (Devre dışı). Bu ayarın kapatılması CPU kullanımını bir miktar artırsa da, ağ paketlerinin işlemciye iletilmesindeki mikrosaniyelik gecikmeleri ortadan kaldırır.
- **Energy Efficient Ethernet (EEE / Green Ethernet):** `Disabled` (Devre dışı). Ağ kartının güç tasarrufu moduna geçmesini engelleyerek her zaman en yüksek performansta çalışmasını sağlar. Güç tasarrufu, paket uyanma sürelerinde gecikmeye sebep olur.

## 4. Endüstri Standardı Alternatif Araçlar (TCP Optimizer)

Manuel kayıt defteri ayarlarını otomatize etmek ve en stabil değerlere (MTU optimizasyonu, TCP Window boyutu) ulaşmak için **TCP Optimizer** aracı (SG TCP Optimizer) e-spor oyuncuları arasında standart kabul edilmektedir.

## Özet & Öneriler

Bu ekstrem ayarların faydasını tam anlamıyla görebilmek için:
1. **Fiziksel Bağlantı:** Wi-Fi yerine kesinlikle yüksek kaliteli bir Ethernet kablosu (Cat6/Cat7) kullanılmalıdır.
2. **Bufferbloat Testi:** Sorun modem/router kaynaklı (Bufferbloat) ise, Windows ayarları işe yaramayacaktır. Router üzerinden SQM (Smart Queue Management) ayarlanması gerekebilir.
3. **Güncel Sürücüler:** Ağ kartı sürücülerinin doğrudan üreticinin (Intel, Realtek vb.) sitesinden en son sürümle güncellenmesi kritiktir.
