# LUPER Release Notes & Changelog

## [1.0.0] - 2026-07-25 (v1.0 Kararlı / Stable)

### 🚀 Ana Özellikler & Performans
- **Sistem Kontrol Merkezi (Dashboard)**: CPU, RAM, Ağ gecikmesi ve Güvenli Geri Yükleme durumlarının 60 FPS canlı izleme paneli.
- **Kategori Bazlı Windows Optimizasyonları**: Ağ, CPU, GPU, Depolama, Telemetri ve Gizlilik optimizasyon paketleri.
- **Dual-Layer Persistence**: `localStorage` (hızlı önbellek) ve Electron backend JSON saklama katmanı entegrasyonu.
- **Hızlı İşlemler**: Tek tıkla DNS temizleme, Çöp dosya silme, Temp klasör boşaltma ve RAM optimizasyonu.
- **Sistem Tepsisi (System Tray) Entegrasyonu**: Çift tıklama ile hızlı erişim ve arka planda düşük kaynak tüketimi.

### 🛡️ Güvenlik & Kararlılık
- **Zero-RCE & Hardened IPC**: `contextBridge` ve whitelist kanalları üzerinden tam izole Inter-Process Communication.
- **Otomatik Geri Alma (Rollback & Safe Mode)**: Hata durumunda otomatik orijinal Windows kayıt defteri değerlerine dönme.
- **Gizlilik Sanitizasyonu (PII Redaction)**: Kullanıcı Windows dizin yollarının (`C:\Users\[REDACTED]`) ve hassas verilerin loglarda otomatik maskelenmesi.
- **Dinamik Log Rotasyonu**: 10MB boyutuna ulaşan log dosyalarının otomatik yedeklenip döndürülmesi.
