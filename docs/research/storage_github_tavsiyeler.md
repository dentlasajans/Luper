# 🚀 LUPER Ekstrem Depolama (NVMe/SSD) Optimizasyon Raporu

**Hedef Kitle:** E-sporcular, Hardcore Oyuncular
**Amaç:** Sıfır Gecikme (Zero Latency), Maksimum FPS Kararlılığı, storport.sys Gecikme Engellemesi
**Kaynaklar:** GitHub Windows Tweaking Repoları (örn. AMIT, Calypto, vb.) ve Hardcore E-spor Forumları

Bu rapor, "throughput" (saniyede aktarılan gigabayt) değerlerinden ziyade, mikrosaniye seviyesindeki **girdi gecikmesini (input latency)** ve **mikro-takılmaları (micro-stutter)** yok etmeye odaklanmış yepyeni GitHub destekli kod ve kayıt defteri tavsiyelerini içermektedir.

---

## 1. NVMe APST (Autonomous Power State Transition) Kapatılması

Modern NVMe sürücüleri enerji tasarrufu için boştayken çok hızlı bir şekilde alt güç durumlarına (low-power states) geçer. Oyun sırasında anlık bir veri (doku vb.) istendiğinde, diskin "uyanması" mikro-takılmalara sebep olur.

**Kayıt Defteri (Registry) Çözümü:**
Standard `stornvme` sürücüsü için idle güç yönetimini devre dışı bırakmak.

```registry
[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\stornvme\Parameters\Device]
"EnableIdlePowerManagement"=dword:00000000
"IdlePowerState"=dword:00000000
```
*Etkisi:* Disk her zaman en yüksek P-State'te (performans durumu) kalır. Isı artabilir fakat gecikme tamamen minimize edilir.

## 2. Storport.sys ve Device Queue Depth (DQD) Optimizasyonu

Windows varsayılan olarak depolama kuyruk derinliğini (Queue Depth) maksimum veri aktarımı (benchmark skorları) için yüksek tutar (genelde 32). Ancak oyunlarda bu durum CPU'nun `storport.sys` (Storage Port Driver) üzerinde darboğaz yaratmasına ve LatencyMon'da DPC (Deferred Procedure Call) gecikmelerine neden olabilir.

**Kayıt Defteri Çözümü:**
E-spor odaklı sistemlerde, kuyruk derinliğini düşürmek gecikmeyi (latency) iyileştirir.

```registry
[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\stornvme\Parameters\Device]
"DeviceQueueDepth"=dword:00000008
```
*(Varsayılan 32'dir, 8 veya 16 değerleri anlık tepkime süresini iyileştirebilir.)*

## 3. PCIe ASPM (Active State Power Management) Kapatılması

NVMe diskler doğrudan PCIe veriyoluna bağlıdır. PCIe Link State Power Management açık olduğunda, veriyolu güç tasarrufu için `L0s` veya `L1` durumuna geçer. Bu geçişler PCIe hattında gecikmeye (latency spike) neden olur.

**Komut Satırı (PowerShell / CMD) Çözümü:**
Geçerli güç planında Link State Power Management özelliğini "Off" konumuna getirmek:

```cmd
powercfg /setacvalueindex scheme_current sub_pciexpress aspm 0
powercfg /setdcvalueindex scheme_current sub_pciexpress aspm 0
powercfg /setactive scheme_current
```
*Etkisi:* Veriyolu iletişimi hiçbir zaman beklemeye alınmaz, ekran kartı ve NVMe diski arasındaki veri yolu her an tetikte bekler.

## 4. MSI (Message Signaled Interrupts) Mode & Interrupt Affinity (IRQL)

Donanımların CPU ile haberleşme yöntemi olan kesmeler (Interrupts), Line-Based yerine MSI-X (Message Signaled Interrupts) kullanmalıdır. NVMe denetleyicisinin MSI modunda çalışması ve belirli bir CPU çekirdeğine (Core 0 hariç) atanması `storport.sys` yükünü hafifletir.

**Kayıt Defteri Yolu (Örnek Mantık):**
`HKLM\SYSTEM\CurrentControlSet\Enum\PCI\...\Device Parameters\Interrupt Management\MessageSignaledInterruptProperties`
* `MSISupported` = `1`
* `MessageNumberLimit` cihazın desteklediği maksimum değere ayarlanmalıdır.

Ayrıca Interrupt Affinity Mask (Örn. Sadece Core 2 ve 4) atanarak Windows'un IO işlemlerini sürekli çekirdekler arası zıplatması (context switching) engellenir.

## 5. Gereksiz I/O ve Arka Plan Servislerinin Engellenmesi

Oyun esnasında diske rastgele okuma/yazma yapan servisler, ani gecikme fırlamalarına (latency spike) sebep olur. Hardcore e-spor sistemlerinde bu servisler kesinlikle kapalı tutulur.

* **SysMain (Eski adıyla Superfetch):** Diski okuyarak RAM'i doldurur. NVMe SSD'lerde hiçbir faydası olmadığı gibi gereksiz I/O yaratır.
* **DiagTrack (Telemetry):** Arka planda sürekli diske log yazar.

**PowerShell Çözümü:**
```powershell
Stop-Service -Name "SysMain", "DiagTrack" -Force
Set-Service -Name "SysMain" -StartupType Disabled
Set-Service -Name "DiagTrack" -StartupType Disabled
```

## 6. Doğrulama ve Uyarılar

Bu ayarlar uygulandıktan sonra sistemin gecikme profili **LatencyMon** adlı yazılım ile test edilmelidir.
Özellikle `storport.sys` ve `nvme.sys` dosyalarının yaratacağı gecikme süreleri mikrosaniye (µs) cinsinden düşüş göstermelidir.

> [!WARNING]
> Bu optimizasyonlar aşırı güç tüketimine ve NVMe kontrolcüsünün daha fazla ısınmasına yol açacaktır. İyi bir M.2 soğutucusu (heatsink) ve kasa içi hava akışı (airflow) zorunludur.

> [!TIP]
> Firmware güncellemeleri de bu gecikmelerin giderilmesinde son derece etkilidir. LUPER uygulaması, kullanıcıları her zaman en son NVMe Firmware sürümünü kullanmaya teşvik etmelidir.
