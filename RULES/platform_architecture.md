# LUPER Product Platform Architecture & AI Development Operating System

This document outlines the official **Platform Architecture & AI Development Operating System** for the LUPER Desktop Application platform.

---

## 🏛️ 1. Platform Folder & Module Standards

```
c:\Users\Dell\Drive'ım\DENTLAS AJANS\FORMLAR\LUPER\
├── electron/                   # Electron Main Process Scripts & Native IPC Handlers
│   ├── main.js                 # App Lifecycle, Security Settings, Window State
│   └── preload.cjs             # Secure ContextBridge IPC Interfaces & Whitelist
├── src/                        # React 19 + TypeScript Application Source
│   ├── app/                    # App Level Entry & Shell Wrappers (`AppShell.tsx`)
│   ├── components/             # Reusable UI Modules & View Layouts
│   │   ├── categories/         # Category-Specific Optimization Interfaces
│   │   ├── info/               # Analytics, Benchmark, AI, Marketplace Views
│   │   ├── tools/              # Gamer Booster, Startup, Debloat Tools
│   │   └── ui/                 # Platform UI Primitives (`Dialog`, `Chart`, `FeedbackState`)
│   ├── context/                # Global React Context Stores (`Theme`, `Settings`, `UI`)
│   ├── data/                   # Offline Optimization Databases & Manifests
│   ├── services/               # System Engine, Firebase & Win32 IPC Services
│   ├── types/                  # TypeScript Data Models & Contract Definitions
│   ├── index.css               # Design System Tokens, Animations & Utility Classes
│   └── main.tsx                # React DOM Render Root
├── RULES/                      # Governance Rules, Architectural Specs & AI Directives
└── dist/                       # Vite Compiled Production Artifacts
```

---

## ⚙️ 2. AI Development Operating System Workflows

Every subagent working on LUPER MUST follow these 5 pipeline steps:

1. **Inspection Phase:** Read `AGENTS.md` and relevant rule files in `RULES/`. Inspect existing components in `src/components/ui/` to prevent duplicate code.
2. **Implementation Phase:** Write clean TypeScript with `strict: true`. Use predefined design tokens from `src/index.css`.
3. **Local Syntax Guard:** Run local checks (`node --check` for Node scripts, `npm run build` for React codebase).
4. **Quality Gate Verification:** Ensure code is free of syntax/type errors, console leaks, or unhandled promise rejections.
5. **Report & Completion:** Report updated/created files and issue the `Completed` summary.

---

## 🛡️ 3. Quality Gate & Architecture Criteria

- **Build Integrity:** `npm run build` must complete in `< 3.0s` with zero errors or warnings.
- **Zero Disk drops:** All PowerShell execution streams must execute via Base64/stdin without temp `.ps1` files.
- **IPC Security:** All main/renderer communication must pass through `contextBridge` in `electron/preload.cjs` with channel whitelisting.

---

## 🏁 Phase 26 Status
Product Platform Architecture & AI Development Operating System specifications are locked in `RULES/platform_architecture.md`.
All 26 LUPER UI/UX Design and Platform Architecture Phases are 100% completed and ready for production release!
