# Raw Optimizations Inbox

This document archives and organizes raw optimization codes (Registry, PowerShell, batch scripts).

## CPU / Power Management Optimizations

### CPU Core Parking (100% Active)
**Açıklama:** Tüm CPU çekirdeklerinin her zaman aktif kalmasını sağlar (Minimum park %100).
**Type:** Command Line / Powercfg
**Kod:**
```cmd
powercfg -setacvalueindex scheme_current sub_processor CPMINCORES 100
powercfg -setactive scheme_current
```

### Processor Energy Performance Preference (EPP)
**Description:** Turbo Boost özelliğini güvenli seviyede tutarken (Enabled), enerji tasarrufunu tamamen devre dışı bırakıp (EPP 0) işlemcinin yüke girdiği milisaniye tepe frekansa sıçramasını sağlar. Thermal throttling yaratmadan sürdürülebilir maksimum oyun performansı sunar.
**Code:**
```bat
powercfg -setacvalueindex scheme_current sub_processor PERFBOOSTMODE 1
powercfg -setacvalueindex scheme_current sub_processor PERFEPP 0
powercfg -setactive scheme_current
```

## Ready for Firebase (JSON)

*(Tüm JSON optimizasyonları kategori bazlı olarak `docs/database/` klasörüne aktarıldı. Firestore aktarımına hazırlar.)*
