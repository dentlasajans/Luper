# LUPER: Güç Yönetimi ve İşlemci Performans Optimizasyonları Araştırma Raporu

Bu rapor, Windows işletim sisteminde "Power" (Güç yönetimi, Idle states, C-States, Core Parking) kategorisinde işlemci (CPU) ve anakartı tam performansa kilitleyecek kritik Registry (Kayıt Defteri) optimizasyonlarını içermektedir.

## 1. İşlemci Boşta Bekleme Durumlarını (C-States / Idle States) Kapatmak

İşlemcilerin enerji tasarrufu yapmak amacıyla kullandıkları uyku durumları (C-States), uyanma süreleri nedeniyle gecikmelere (latency) ve mikro-takılmalara (micro-stuttering) yol açabilir. Bu durumları devre dışı bırakarak işlemcinin sürekli yüksek güç durumunda (C0) kalmasını sağlayabiliriz.

**Dikkat:** Bu işlem güç tüketimini ve sıcaklıkları artıracaktır.

### Registry Optimizasyonu (Gizli Ayarı Görünür Kılma)

Windows Güç Seçenekleri menüsünde gizlenmiş olan "Processor idle disable" ayarını görünür hale getirmek için:

- **Anahtar Yolu:** `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Power\PowerSettings\54533251-82be-4824-96c1-47b60b740d00\5d76a2ca-e8c0-402f-a133-2158492d58ad`
- **Değer Adı:** `Attributes`
- **Yeni Değer (DWORD):** `0` (Varsayılan değer genelde `1`'dir).

### Güç Planı Uygulaması

Registry ayarı yapıldıktan sonra:
1. **Denetim Masası > Donanım ve Ses > Güç Seçenekleri**'ne gidin.
2. Aktif plan (Yüksek Performans önerilir) için **Plan ayarlarını değiştir** > **Gelişmiş güç ayarlarını değiştir** tıklayın.
3. **İşlemci güç yönetimi** (Processor power management) altında yeni beliren **İşlemci boşta bekleme devreden çıkar** (Processor idle disable) seçeneğini **Boşta beklemeyi devre dışı bırak** (Disable idle) olarak ayarlayın.

---

## 2. İşlemci Çekirdek Park Etmeyi (Core Parking) Kapatmak

Windows, iş yükü düşük olduğunda bazı işlemci çekirdeklerini "park ederek" (uyutarak) enerji tasarrufu sağlar. Ani iş yükü artışlarında park halindeki çekirdeklerin uyanması performans kayıplarına yol açar. Bunu tamamen kapatarak tüm çekirdeklerin her an aktif olmasını sağlayabiliriz.

### Registry Optimizasyonu (Gizli Ayarı Görünür Kılma)

- **Anahtar Yolu:** `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Power\PowerSettings\54533251-82be-4824-96c1-47b60b740d00\0cc5b647-c1df-4637-891a-dec35c318583`
- **Değer Adı:** `Attributes`
- **Yeni Değer (DWORD):** `0`

### Güç Planı Uygulaması

Registry ayarı yapıldıktan sonra:
1. Gelişmiş güç ayarları menüsünde **İşlemci güç yönetimi** altına gidin.
2. Yeni beliren **İşlemci performansı çekirdek park etme en düşük çekirdek sayısı** (Processor performance core parking min cores) seçeneğini bulun.
3. Bu değeri **%100** olarak ayarlayın. Bu, sistemin hiçbir çekirdeği park etmemesini (tüm çekirdeklerin aktif kalmasını) garanti eder.

---

## 3. Ek İnce Ayarlar (Tavsiye Edilen Alternatifler)

Tamamen idle state'leri kapatmak bazen Görev Yöneticisinde %100 CPU kullanım bug'ına sebep olabilmektedir (genellikle sadece gösterim hatasıdır). Alternatif olarak şu ince ayarlar yapılabilir:

*   **İşlemci boşta bekleme yükseltme/düşürme eşiği (Processor idle promote/demote threshold):** Bu değerleri **%100** yapmak, işlemciyi tam olarak tüm idle state'lerden çıkarmasa da daha agresif bir şekilde aktif durumda (C1) tutar.
*   **İşlemci performans süresi denetim aralığı (Processor performance time check interval):** Daha yüksek bir değere (ör. `5000`) ayarlamak, sistemin performans durumlarını kontrol etme sıklığını azaltır ve gereksiz CPU döngülerinden tasarruf sağlar.

## BIOS / UEFI Tavsiyesi

Yazılımsal (Registry) bazlı müdahaleler etkili olsa da, C-States (C1E, C6, vb.) ve Intel SpeedStep / AMD Cool'n'Quiet gibi özelliklerin doğrudan **Anakart BIOS/UEFI** menüsünden kapatılması, donanım seviyesinde en stabil ve kesin maksimum performans kilidini sağlar.
