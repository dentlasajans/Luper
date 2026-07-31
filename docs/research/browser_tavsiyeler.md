# Tarayıcı Optimizasyonları: Arka Plan Servislerini ve Güncellemeleri Devre Dışı Bırakma

Bu belge, Google Chrome ve Microsoft Edge tarayıcılarının arka planda çalışan gereksiz güncelleme (Update) ve yetki yükseltme (Elevation) servislerini Windows Kayıt Defteri (Registry) üzerinden tamamen engellemek için gerekli yapılandırmaları içermektedir.

## 1. Google Chrome Optimizasyonları

Chrome'un arka planda sürekli güncelleme denetimi yapmasını ve gereksiz çalışan Elevation (Yetki Yükseltme) servisini durdurmak için aşağıdaki Registry ayarları uygulanmalıdır.

### Güncellemeleri Devre Dışı Bırakma (Policy Ayarları)
Aşağıdaki kayıt defteri anahtarları, Chrome'un güncelleme denetimlerini tamamen durdurmasını sağlar.

```registry
[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Google\Update]
"AutoUpdateCheckPeriodMinutes"=dword:00000000
"DisableAutoUpdateChecksCheckboxValue"=dword:00000001
"UpdateDefault"=dword:00000000
```
*Not: 64-bit sistemlerde alternatif olarak `HKEY_LOCAL_MACHINE\SOFTWARE\Wow6432Node\Policies\Google\Update` yoluna da aynı değerler eklenebilir.*

### Chrome Elevation Service ve Update Servislerini Kapatma
Chrome'a ait arka plan servislerinin başlangıç türünü "Devre Dışı" (Start = 4) olarak ayarlamak için aşağıdaki anahtarlar kullanılır:

```registry
[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\GoogleChromeElevationService]
"Start"=dword:00000004

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\gupdate]
"Start"=dword:00000004

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\gupdatem]
"Start"=dword:00000004
```

---

## 2. Microsoft Edge Optimizasyonları

Microsoft Edge, Windows sistemlerinde varsayılan olarak gelir ve update servisleri çok daha inatçı bir şekilde arka planda çalışmaya devam eder. Bunu engellemek için aşağıdaki Policy ve Servis ayarları yapılmalıdır.

### Güncellemeleri Devre Dışı Bırakma (Policy Ayarları)
Aşağıdaki kayıt defteri anahtarları, Edge'in güncelleme denetimlerini iptal eder.

```registry
[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\EdgeUpdate]
"AutoUpdateCheckPeriodMinutes"=dword:00000000
"Update"=dword:00000000
"UpdateDefault"=dword:00000000
```

### Edge Elevation Service ve Update Servislerini Kapatma
Edge'in arka planda sürekli uyanmasını sağlayan servisleri "Devre Dışı" (Start = 4) bırakmak için:

```registry
[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\MicrosoftEdgeElevationService]
"Start"=dword:00000004

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\edgeupdate]
"Start"=dword:00000004

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\edgeupdatem]
"Start"=dword:00000004
```

## Önemli Notlar
* **Güvenlik Riski:** Bu ayarlar tarayıcıların otomatik olarak güvenlik yamalarını almasını engeller. Bu optimizasyonlar uygulanırken, belirli aralıklarla tarayıcıların manuel olarak güncellenmesi tavsiye edilir.
* **Zamanlanmış Görevler (Task Scheduler):** Sadece Registry ayarları bazı durumlarda yeterli olmayabilir. İleri düzey optimizasyon için `Task Scheduler` üzerinden "MicrosoftEdgeUpdateTaskMachineCore" ve Chrome Update görevlerinin de devre dışı bırakılması (Silinmesi veya pasif hale getirilmesi) gerekebilir.
