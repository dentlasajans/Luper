# LUPER Fare (Mouse) ve Girdi Gecikmesi (Input Lag) Optimizasyonları - GitHub & E-Spor Tavsiyeleri

LUPER sistem uzmanı olarak yürütülen araştırma dalgasının sonucunda, hardcore e-spor forumlarından (Blur Busters, vb.) ve GitHub depolarından toplanan en agresif ve ekstrem "Sıfır Gecikme" (Zero Input Lag) kod tavsiyeleri aşağıda listelenmiştir. Bu tavsiyelerin amacı, Windows'un araya girdiği tüm işlemci yüklerini atlayıp fare verisini saf (raw) donanım seviyesinden en yüksek hızda okumaktır.

---

## 1. Mükemmel 1:1 Fare Takibi (MarkC Mouse Fix Türevi)

Windows varsayılan olarak fare imlecini yumuşatmak için gizli bir ivmelenme eğrisi uygular. Gelişmiş oyuncular ve GitHub projeleri, bu eğrileri tamamen sıfırlayarak donanım ile oyun arasında saf bir 1:1 piksel/DPI uyumu yakalar.

**Registry Kodu:**
```registry
Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\Control Panel\Mouse]
"MouseSpeed"="0"
"MouseSensitivity"="10"
"MouseThreshold1"="0"
"MouseThreshold2"="0"
"SmoothMouseXCurve"=hex:00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00
"SmoothMouseYCurve"=hex:00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00
```
> **Açıklama:** Bu ayarlar fare ivmesini tamamen devre dışı bırakır. X ve Y eğrilerinin `00` heksadesimal değerleriyle doldurulması Windows'un hiçbir yumuşatma filtresi uygulamamasını sağlar.

---

## 2. USB MSI Modu (Message Signaled Interrupts)

Standart USB sürücüleri eski IRQ paylaşım yöntemlerini kullanır. E-sporcular, farenin bağlı olduğu USB Host Controller'ı MSI (Message Signaled Interrupts) moduna geçirerek işlemci üzerindeki kesme gecikmesini minimuma indirir.

**Uygulama Mantığı:**
Fareyi yöneten cihazın `Device Parameters\Interrupt Management` altındaki ayarlarında MSI etkinleştirilir ve kesinti önceliği (Interrupt Priority) "High" (Yüksek) olarak ayarlanır.

**Registry Kodu (Örnek Şablon):**
```registry
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Enum\PCI\...\Device Parameters\Interrupt Management\MessageSignaledInterruptProperties]
"MSISupported"=dword:00000001

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Enum\PCI\...\Device Parameters\Interrupt Management\Affinity Policy]
"DevicePriority"=dword:00000003
```
> **Açıklama:** `MSISupported=1` işlemi MSI modunu aktif ederken, `DevicePriority=3` bu cihaza yüksek öncelik verir, böylece fare hareketi diğer donanımlardan önce işlenir.

---

## 3. Güç Tasarrufu ve USB Selective Suspend Kapatma

Input lag düşmanlarından biri de cihazların güç tasarrufu (C-States / USB Suspend) özellikleridir. GitHub optimizasyon repolarında bu özellik global olarak kapatılır.

**Registry Kodu:**
```registry
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\USB]
"DisableSelectiveSuspend"=dword:00000001

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Power\PowerSettings\2a737441-1930-4402-8d77-b2bebba308a3\48e6b7a6-50f5-4782-a5d4-53bb8f07e226]
"Attributes"=dword:00000002
```
> **Açıklama:** USB portlarının kendini uyku moduna almasını engeller. Fare verisi ilk hareket anında bile gecikmesiz olarak sisteme iletilir.

---

## 4. Sistem Zamanlayıcı Çözünürlüğü (System Timer Resolution)

Oyunlarda gecikmenin stabil olması için Windows Sistem Zamanlayıcısının 0.5ms (5000 ns) seviyesinde zorlanması esastır. Bu doğrudan registry ile kalıcı hale gelmese de, başlatma sırasında API (`NtSetTimerResolution`) tetikleyen PowerShell script'leriyle ya da küçük C++ servisleriyle uygulanır.

**PowerShell Başlangıç Script'i Örneği:**
```powershell
# ISLC veya benzeri toolların yaptığı işin kernel tetikleyicisi
# Özel C# entegrasyonu ile 0.5ms zorlanması
Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
public class TimerRes {
    [DllImport("ntdll.dll", SetLastError=true)]
    public static extern int NtSetTimerResolution(uint DesiredResolution, bool SetResolution, out uint CurrentResolution);
}
"@
[TimerRes]::NtSetTimerResolution(5000, $true, [ref]0)
```
> **Açıklama:** Windows işlem döngüsünü 0.5 milisaniyeye (5000 birim) indirerek fare tıklama ve hareket algılama aralıklarını olabildiğince sıklaştırır.

---

## 5. RawAccel ve Kernel Seviyesi Okuma

Son dönemde en agresif yöntemlerden biri, fare verilerini tamamen Windows kullanıcı arayüzünü (User Mode) bypass edip direkt Kernel mode üzerinden okuyan özel sürücüler (örn. *RawAccel*) kullanmaktır. 

*   **Nasıl Çalışır:** Fare verisi DWM.exe (Desktop Window Manager) gibi süreçleri beklemez.
*   **Optimizasyon:** Özel filtreleme uygulanmayan saf ham (raw) girdi kullanılır. LUPER'ın ileride kendi C++ Native eklentisiyle bu tarz bir "Kernel Mouse Filter" sunması planlanabilir.

---

## Sonuç ve Uyarılar

Bu kodların registry'e entegrasyonu esnasında her zaman kullanıcıdan bir **Sistem Geri Yükleme Noktası** (System Restore Point) alınmalıdır. Hedef "Sıfır Gecikme" olsa da yanlış cihazlara `MSISupported` uygulanması sistemin mavi ekran (BSOD) vermesine neden olabilir. LUPER uygulamasında uygulanırken, donanım ID (HWID) kontrolü yapılması kritik bir zorunluluktur.
