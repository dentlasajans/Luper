# Windows İleri Düzey Telemetri Engelleme Rehberi (DiagTrack Ötesi)

Bu belge, LUPER için Windows 10/11 üzerinde çalışan ve standart "DiagTrack" (Bağlı Kullanıcı Deneyimleri ve Telemetri) servisini durdurmanın ötesine geçen, işletim sisteminin derin veri toplama (Telemetry) özelliklerini kısıtlayan Registry (Kayıt Defteri) ayarlarını içermektedir.

**DİKKAT:** Telemetri servislerini veya kayıt defteri anahtarlarını tamamen silmek (örneğin DiagTrack servisini sistemden kazımak), yeni Windows sürümlerinde (22H2/23H2 ve sonrası) Windows Güncelleştirmeleri'nin (Windows Update) bozulmasına veya `CRITICAL_PROCESS_DIED` gibi Mavi Ekran (BSOD) hatalarına yol açabilir. Bu nedenle en güvenli ve önerilen yöntem, Microsoft'un desteklediği İlke (Policy) ayarlarıyla telemetriyi en alt düzeye ("Güvenlik" veya "Gerekli" veri düzeyi) indirmektir.

Aşağıdaki Registry ayarları, verilerin Microsoft'a gönderilmesini güvenli ve kalıcı bir şekilde engellemek için kullanılabilir:

## 1. Temel Telemetriyi Engelleme (AllowTelemetry)

Bu anahtar, Windows'un temel telemetri veri gönderimini kısıtlar. `0` değeri (Güvenlik Düzeyi), verilerin yalnızca kritik güvenlik yamaları ve sistem sağlığı için gereken minimum düzeyle sınırlandırılmasını sağlar (Windows 11 Home sürümlerinde `1` olarak algılanabilir, ancak Enterprise/Education/Pro'da tam kısıtlama sağlar).

* **Yol (Path):** `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\DataCollection`
* **Anahtar (Value Name):** `AllowTelemetry`
* **Tür (Type):** `DWORD (32-bit)`
* **Değer (Value):** `0`

## 2. Windows Hata Bildirimini (Windows Error Reporting - WER) Kapatma

Uygulama çökmeleri ve sistem hataları meydana geldiğinde toplanan bellek dökümleri (dump files) ve hata raporlarının Microsoft'a gönderilmesini engeller. Bu raporlar bazen hassas bellek verileri içerebilir.

* **Yol (Path):** `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\Windows Error Reporting`
* **Anahtar (Value Name):** `Disabled`
* **Tür (Type):** `DWORD (32-bit)`
* **Değer (Value):** `1`

## 3. Reklam Kimliğini (Advertising ID) Devre Dışı Bırakma

Microsoft'un uygulama ve servislerdeki davranışlarınızı takip ederek size özel reklamlar (hedefli reklamcılık) sunmasını sağlayan özel izleme kimliğini kapatır.

* **Yol (Path):** `HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\AdvertisingInfo`
* **Anahtar (Value Name):** `Enabled`
* **Tür (Type):** `DWORD (32-bit)`
* **Değer (Value):** `0`

## 4. Kişiselleştirilmiş Deneyimleri (Tailored Experiences) Kapatma

Windows'un, toplanan teşhis verilerini (Diagnostic Data) kullanarak sisteminizde özel ipuçları, reklamlar veya tavsiyeler sunmasını engeller. Bu sayede arka planda kullanım alışkanlıklarınızın analiz edilmesi durdurulur.

* **Yol (Path):** `HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Privacy`
* **Anahtar (Value Name):** `TailoredExperiencesWithDiagnosticDataEnabled`
* **Tür (Type):** `DWORD (32-bit)`
* **Değer (Value):** `0`

## 5. Kullanıcı Etkinliği Takibini (User Activity/Timeline) Kapatma

Kullanıcının zaman çizelgesi (Timeline), açtığı dosyalar ve pencereler gibi etkinlik geçmişinin toplanmasını ve diğer cihazlarla senkronize edilmesi amacıyla Microsoft'a gönderilmesini engeller.

* **Yol (Path):** `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\System`
* **Anahtar (Value Name):** `PublishUserActivities`
* **Tür (Type):** `DWORD (32-bit)`
* **Değer (Value):** `0`

---

### Ek Tavsiyeler (LUPER Entegrasyonu İçin)

1. **Servisleri Silmeyin, Devre Dışı Bırakın:** LUPER'in optimizasyon işlemlerinde `DiagTrack` (Connected User Experiences and Telemetry) gibi servislerin tamamen silinmesi yerine `sc config DiagTrack start= disabled` komutu ile başlangıç türünün "Devre Dışı" (Disabled) yapılması önerilir.
2. **Görev Zamanlayıcı (Task Scheduler):** Telemetri sadece servisler üzerinden değil, zamanlanmış görevlerle de toplanır. LUPER üzerinden `Task Scheduler Library\Microsoft\Windows\Application Experience` yolunda bulunan `Microsoft Compatibility Appraiser` gibi görevlerin devre dışı bırakılması, veri sızıntısını ve gereksiz kaynak tüketimini (disk/işlemci kullanımı) ciddi ölçüde azaltacaktır.
3. **Kayıt Defteri Yedekleme:** Bu registry kayıtları LUPER tarafından değiştirilmeden önce `HKLM` ve `HKCU` düzeyinde mutlaka yedeğinin (`.reg` veya JSON snapshot olarak) alınması sağlanmalıdır.
