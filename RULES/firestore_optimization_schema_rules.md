# Firestore Optimization Schema Rules (`RULES/firestore_optimization_schema_rules.md`)

This document defines the strict schema and architectural rules for managing optimization codes and data within the LUPER platform.

## 1. Mandatory Firestore Database Architecture

- **100% Live Firestore Data:** All optimization items, categories, and configuration data MUST be fetched directly from the live Firestore database.
- **No External Mock Data:** The use of any external mock data, static JSON files for production data, or hardcoded optimization items is STRICTLY FORBIDDEN.
- **RAM-Only Temporary Caching:** Data retrieved from Firestore MUST only be cached temporarily in RAM memory. Persistent local storage of the raw Firestore database content is prohibited for security and consistency reasons.
- **Firestore Kod Kuralı:** Firestore veritabanında olmayan hiçbir yerel/hardcoded kod uygulamaya sokulamaz. Otomatik seed yapılmaz.
- **Badge Tooltip Açıklama Kuralı:** Ayar kartı rozet (badge) açıklamaları sabit şablondur. Ayara özel açıklama yazılmaz, sadece level'a (positive_high, positive_medium, none, vb.) göre dinamik metin üretilir.

## 2. Optimization Code JSON Schema

Every optimization item stored in Firestore and used in the application MUST strictly adhere to the following JSON schema. No exceptions or variations are permitted.

```json
{
  "id": "string (Unique identifier)",
  "name": "string (Title of the optimization)",
  "description": "string (Detailed explanation of what the optimization does)",
  "status": "default",
  "applyCode": "string (PowerShell/Registry code to apply the optimization)",
  "restoreCode": "string (PowerShell/Registry code to revert the optimization)",
  "impacts": {
    "performance": "number (Impact score)",
    "latency": "number (Impact score)",
    "input": "number (Impact score)",
    "power": "number (Impact score)",
    "heat": "number (Impact score)"
  }
}
```

### Schema Field Constraints:
- `id`: Must be a unique string.
- `status`: Must strictly have the value of `'default'`.
- `applyCode` and `restoreCode`: Must contain valid, executable, and reversible code (e.g., PowerShell commands or Registry tweaks).
- `impacts`: Must be an object containing the exact keys: `performance`, `latency`, `input`, `power`, and `heat`, all with numeric values representing the impact score.
