# LUPER Project Rules & Core Engineering Principles (`RULES/project_rules.md`)

This document defines the permanent engineering principles, quality standards, and development rules for **LUPER** (Premium Commercial Windows Desktop Optimization & Performance Platform built with Electron, Node.js, React 19, TypeScript, and Tailwind CSS v4).

---

# Project Vision

LUPER is engineered to be the industry gold standard for Windows operating system optimization and performance management. 

Our long-term vision is to deliver a commercial-grade, rock-solid desktop application that combines:
- **Uncompromised Reliability & Stability:** Zero system corruption risks, flawless state restoration, and non-blocking asynchronous execution.
- **Sub-Millisecond Engine Performance:** Lightning-fast application startup, 60 FPS UI rendering, and minimal resource consumption.
- **Professional Software Engineering:** Clean Architecture, strict type safety, modular Electron/React componentry, and comprehensive security auditing.
- **World-Class User Experience:** Apple/macOS Sequoia precision and Windows 11 Fluent Design minimalism without gaming RGB clutter or aggressive visual noise.

---

# Core Principles

All AI engineering activities on LUPER must prioritize:

- **Quality Over Speed:** Never compromise code quality or stability to rush a feature out.
- **Maintainability First:** Write clean, modular, and self-documenting code that any senior developer can easily inspect and maintain.
- **Scalability First:** Design system components, IPC channels, and state stores to handle future feature expansions seamlessly.
- **Consistency:** Enforce uniform patterns for component structure, variable naming, styling tokens, and error handling.
- **Simplicity Where Possible:** Prefer simple, elegant solutions over over-engineered abstractions.
- **Production-Ready Code Only:** Every merged file must be fully typed, linted, tested, and ready for production deployment.
- **No Temporary Hacks:** Quick fixes, hardcoded bypasses, swallowing exceptions, or temporary patches are strictly forbidden.
- **No Unapproved Technical Debt:** Refactor code immediately when architectural smells arise; never accumulate unapproved technical debt.

---

# Architecture Principles

The codebase architecture of LUPER must remain clean, modular, and predictable:

- **Respect Existing Architecture:** Always inspect and follow established directory patterns (`RULES/`, `src/`, `electron/`).
- **Extend, Don't Duplicate:** Features should extend existing abstractions rather than inventing standalone parallel logic.
- **Avoid Duplicate Implementations:** Search the codebase for existing helper functions, hooks, or utilities before writing new ones.
- **Prefer Reusable Modules:** Extract repeated component logic into shared UI tokens or custom hooks.
- **Prefer Composition Over Duplication:** Build complex screens by composing atomic presentational components rather than copying large code blocks.

---

# Development Philosophy

Every implementation across LUPER must strictly adhere to a disciplined development lifecycle:

1. **Planned:** Analyze requirements, inspect dependencies, and outline architectural steps.
2. **Reviewed:** Audit code diffs against project rules (`AGENTS.md` and `RULES/`).
3. **Clean:** Enforce strict TypeScript (`strict: true`), zero `any` casting, and zero dead code.
4. **Tested:** Verify runtime functionality, error handling, and edge cases.
5. **Documented:** Maintain up-to-date documentation and Turkish user guides where applicable.

*Never rush implementation. Thoughtful planning precedes every code modification.*

# Execution & Command Standards
- TÜM ALT AJANLAR (SUBAGENTS) İŞİNİ VE RAPORUNU TAMAMLAMADAN `npm start` VEYA HERHANGİ BİR UYGULAMA BAŞLATMA KOMUTU ÇALIŞTIRILAMAZ. Önce tüm subagent'ların kod modifikasyonları ve doğrulama raporları beklenir, ardından derleme kontrolü yapılıp uygulama başlatılır.
- **Masaüstü Uygulama Başlatma Kuralı (Win32_Process Detached Launch):** Yapay zeka ajanları uygulamayı kullanıcının masaüstünde açmak istediğinde veya `npm start` istendiğinde, izole arka plan görevlerinin kapanmasından etkilenmemek için komutu doğrudan `Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{ CommandLine = 'cmd.exe /c cd /d C:\Luper && npm start' }` ile başlatmalıdır.

---

# User Experience Philosophy

- **Turkish Language Standard:** Every user-facing UI string, tooltip, notification, dialog, and settings guide must be in clean, natural Turkish.
- **Zero Technical Jargon to End-Users:** Present technical metrics and tweaks in simple, non-technical Turkish terms.
- **macOS Sequoia / Fluent Design Aesthetics:** Clean borders, subtle glassmorphism, Luper Sapphire Blue (`#1a5efd`) accents, and anthracite dark mode (`#121214`).
- **Micro-Interactions:** Smooth, responsive micro-animations for hover states and button presses.

---

# Database and Data Architecture

- **100% Live Firestore Data:** All optimization data MUST be pulled directly from the live Firestore database.
- **No Mock Data:** The use of external mock data or hardcoded optimization lists is strictly forbidden in production.
- **RAM-Only Caching:** Data fetched from Firestore must only be temporarily cached in RAM.
- **Firestore Kod Kuralı:** Firestore veritabanında olmayan hiçbir yerel/hardcoded kod uygulamaya sokulamaz. Otomatik seed yapılmaz.
- **Badge Tooltip Açıklama Kuralı:** Ayar kartı rozet (badge) açıklamaları sabit şablondur. Ayara özel açıklama yazılmaz, sadece level'a (positive_high, positive_medium, none, vb.) göre dinamik metin üretilir.

---

# Dual-Layer Persistence

LUPER enforces dual-layer persistence for all optimization settings and user preferences:
1. **Frontend State (React / TypeScript / localStorage):** Instant UI state hydration and immediate feedback.
2. **Backend Persistence (Electron Main Process / Node.js JSON storage):** Secure, atomic file backups and registry state snapshots.

*Both layers must remain synchronized across IPC boundaries.*
