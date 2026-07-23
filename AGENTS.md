# Project Rules & Guidelines

## 1. Project Overview
- **Purpose:** Luper - Windows Operating System Optimization & Performance Application.
- **Architecture:** React 19 + TypeScript + Vite for frontend UI. Electron + Node.js for native Windows system integration and IPC calls.
- **Data Flow:** All real system metrics and optimization commands run through Electron IPC (`electron/main.js`) executing native Windows registry operations and PowerShell commands. Mock data is isolated under `src/mocks` and only runs when `VITE_USE_MOCKS=true` is set.
- **Language Standard:** The application operates **100% natively in Turkish**. Multi-language dropdowns or translation contexts are strictly removed; all UI elements, tooltips, cards, and notification messages must remain in clean, concise Turkish.

## 2. Design Language (Design & UI)
- **Concept:** Confident, elite, smooth, and premium dark mode design inspired by Apple/macOS precision adapted to Windows.
- **Color Palette & Contrast:** Deep anthracite backgrounds (`#121214`, `#1c1c1e`), white primary text (`#f5f5f7`), soft secondary text (`#86868b`), subtle primary blue accents (`#1a5efd` / `brand-primary`), and subtle success greens (`#81c784`).
- **Framing & Oval Corners:**
  - Window frame layout is **full-bleed** without outer margin gaps (`p-0`).
  - Container edges feature soft oval top and bottom corners (`rounded-[24px]`) in normal windowed mode, collapsing seamlessly to `rounded-none` when maximized.
- **Animations:** Spring-based fluid micro-interactions using Framer Motion (`motion/react`).
- **Typography & Icons:** Clean sans-serif typography (`Helvetica Neue`, `Helvetica`, native OS sans-serif). Only `lucide-react` icons are used, with colorless/subtle blue defaults.

## 3. System Optimization Score Logic (Sistem Optimizasyon Puanı)
- **Score Calculation:** System Score (0-100) is calculated **strictly dynamically based on applied optimization codes**:
  $$\text{Score} = \text{Math.round}\left(\frac{\text{Applied Optimizations Count}}{\text{Total Optimization Settings Count}}\right) \times 100$$
- **Real-Time Dynamic Updates:** Updates automatically whenever an optimization toggle is switched, restored, or reset across any category.
- **Score Badges:**
  - `80 - 100`: Maksimum Performans (Primary Blue)
  - `50 - 79`: Yüksek Performans (Emerald Green)
  - `1 - 49`: Temel Optimizasyon (Amber Warning)
  - `0`: Optimizasyon Yapılmadı (Rose Red)
- **No Metric Coupling:** CPU, GPU, or RAM real-time usage metrics DO NOT affect the System Score.

## 4. State Persistence & Data Architecture (Çift Katmanlı Kalıcılık)
- **Dual-Layer Persistence:** To ensure settings remain active after app restarts or Windows reboots:
  1. `localStorage.applied_optimizations`: Fast client-side cache for instant UI state restoration.
  2. `%APPDATA%\luper\optimization_backups.json`: Electron native JSON backup storing registry keys, original values, and applied state nodes via IPC (`get-applied-optimizations`, `deleteBackupNode`).
- **Firebase Pre-caching:** Optimization categories and settings are dynamically pre-loaded from Firebase Firestore (`preloadAllCategorySettings`), providing instant category setting counts without loading delays.

## 5. Native Application Features & Settings
- **Düşük Kalite Modu (Reduce Motion):** Toggles off background ambient blurs and heavy spring animations to minimize GPU/CPU overhead on lower-end devices.
- **Windows Açılışında Çalıştırma (Auto-Start):** Controls Electron login item settings via `set-auto-start` IPC handler.
- **Sistem Tepsisi (System Tray):**
  - Closing the app window minimizes silently to the Windows System Tray when enabled.
  - Tray icon features double-click window restore and a right-click context menu ("Aç / Göster", "Çıkış").
- **Akıllı RAM Temizliği:** Background monitoring automatically clears standby RAM memory when usage exceeds 85%.
- **1-Tıkla Tümünü Sıfırla (Reset All Optimizations):** Iterates over all applied optimization IDs, reverting registry values back to Windows original defaults (`restoreOptimization`).

## 6. Coding & Quality Standards
- **Strict TypeScript:** Strictly follows `strict: true`. The `any` type is forbidden in new code.
- **Zero Technical Jargon to User:** Registry paths (e.g. `HKEY_LOCAL_MACHINE\...`), PowerShell syntax, or technical log output must NEVER be visible on the user interface.
- **Clean Code & Maintenance:**
  - Dead code, commented-out blocks, unused imports, or unused React hooks are strictly prohibited.
  - Temporary helper scripts (`fix_*.js`, `update_*.js`) must be deleted immediately after execution.
- **React Performance Optimization:** Presentational components wrapped in `React.memo()`, derived state wrapped in `useMemo`/`useCallback`, and heavy views lazy-loaded via `React.lazy()` and `<Suspense>`.

*(Note: This file is kept up-to-date with application architecture changes and user directives.)*
