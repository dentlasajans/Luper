# LUPER Master Application Architecture

## Executive Overview
The **LUPER** platform is built on an enterprise-grade, highly modular, scalable Clean Architecture designed for Windows System Optimization & Performance Management. Built on Electron, Node.js, React 19, and TypeScript, LUPER enforces strict physical and architectural isolation between the privileged OS/Node.js host system and the unprivileged React 19 rendering layer.

---

## 🏗️ 1. Application Architectural Layers & Module System

The architecture is organized into 16 distinct, loosely coupled layers and module groups:

### 1.1 Application Layers
- **Main Process Layer (`electron/main.js`):** System lifecycle host, window manager, native OS interface dispatcher, single-instance lock owner.
- **Preload Isolation Layer (`electron/preload.cjs`):** Immutable ContextBridge proxy. Exposes whitelisted, strongly typed API contracts (`window.electronAPI`) to the Renderer while enforcing process isolation.
- **Renderer Layer (`src/`):** React 19 presentational UI app operating under strict browser security sandbox constraints.

### 1.2 Core Modules (`src/core/` / `electron/core/`)
- **Responsibility:** Houses central domain models, system lifecycle orchestration, cross-cutting interface contracts, and core engine factories.
- **Scope:** Core system contracts, app bootstrapping, global state initialization.

### 1.3 Feature Modules (`src/features/` / `src/components/`)
- **Responsibility:** Self-contained, domain-specific feature verticals (e.g. System Cleaner, Gaming Booster, Startup Manager, Privacy Shield).
- **Scope:** Feature UI views, feature-specific hooks, local view-state managers.

### 1.4 Shared Modules (`src/shared/` / `src/utils/` / `src/types/`)
- **Responsibility:** Reusable presentational components, shared TypeScript types, utility helpers, and common constants.
- **Scope:** Component UI primitives, string formatters, validation utilities.

### 1.5 Engine Layer (`electron/engine/`)
- **Responsibility:** Native Windows performance execution engine responsible for executing low-level system operations, Win32 API calls, and in-memory Base64 PowerShell execution streams.
- **Scope:** Win32 API bindings, Base64 UTF-16LE command encoders, stdin process pipe controllers.

### 1.6 Platform Layer (`electron/platform/`)
- **Responsibility:** OS abstraction layer encapsulating Windows-specific kernel APIs, UAC elevation handles, registry key validators (`HKLM`/`HKCU`), and system metrics hardware sensors.
- **Scope:** Win32 API FFI bridges, UAC privilege checks, WMI/C++ native addons.

### 1.7 Infrastructure Layer (`electron/infrastructure/` / `src/infrastructure/`)
- **Responsibility:** Low-level OS I/O drivers, file system access routines (`fs/promises`), process handles, and hardware sensor telemetry interfaces.
- **Scope:** Asynchronous file streams, disk I/O, process handle lifecycles.

### 1.8 IPC Layer (`src/types/ipc.ts` & `electron/ipc/`)
- **Responsibility:** Bi-directional Inter-Process Communication contracts. Enforces `VALID_CHANNELS` whitelist arrays, argument regex sanitization, and strongly typed `invoke`/`handle` messaging.
- **Scope:** ContextBridge proxy scripts, IPC message serializers, payload validators.

### 1.9 State Management Layer (`src/context/` & `src/stores/`)
- **Responsibility:** Dual-layer state persistence engine. Manages transient React UI state in localStorage while synchronizing persistent settings with Node.js JSON stores.
- **Scope:** React Context providers, state selectors, state backup/restore engines.

### 1.10 Service Layer (`src/services/`)
- **Responsibility:** Frontend facade services that wrap IPC calls (`window.electronAPI`) into strongly typed async service methods for React components.
- **Scope:** Domain services (`optimizationService.ts`, `metricsService.ts`, `settingsService.ts`).

### 1.11 Configuration Layer (`src/config/` & `electron/config/`)
- **Responsibility:** Centralized configuration provider for app settings, default optimization limits, theme design tokens, and bundler/compiler flags.
- **Scope:** App default constants, category manifests, environment configurations.

### 1.12 Logging Layer (`electron/logging/` & `%APPDATA%\luper\logs\`)
- **Responsibility:** Non-blocking, structured JSON logging pipeline featuring privacy sanitization filters and automatic 10MB file rotation.
- **Scope:** Diagnostic streams, exception loggers, privacy filters.

### 1.13 Error Handling Layer (`src/error/` & `electron/error/`)
- **Responsibility:** Global uncaught exception boundaries, crash resilience engines, and automatic state rollback triggers upon system operation failure.
- **Scope:** React Error Boundaries, main process `uncaughtException` listeners, state rollback triggers.

### 1.14 Update Layer (`electron/updater/`)
- **Responsibility:** Secure offline/online update verification engine for packaging manifests (`latest.yml`) and installer delta checks.
- **Scope:** Update checksum verifiers, release manifest parsers.

### 1.15 Plugin Layer (`src/types/plugin.ts` & `electron/plugin/`)
- **Responsibility:** Modular extension API engine supporting sandboxed third-party plugins with capabilities-based permission manifests.
- **Scope:** Plugin registry loader, sandbox execution environments, plugin lifecycle hooks.

### 1.16 Optimization Layer (`src/data/` & `electron/optimization/`)
- **Responsibility:** Offline JSON optimization databases, category definition stores, and system tweak schema validators.
- **Scope:** Category manifests, tweak definitions (provided manually by Project Owner), schema migration utilities.

---

## 🔄 2. Allowed & Forbidden Layer Dependencies

To guarantee Clean Architecture layer isolation, dependency boundaries are strictly enforced:

```
[Renderer Layer: React 19 UI]
         │
         ▼ (Calls async facade)
[Service Layer]
         │
         ▼ (Invokes typed channels)
[IPC Layer (ContextBridge / Preload)]
         │
         ▼ (Dispatches to Main)
[Core / Engine Layer] ──► [Platform Layer (Win32 / PowerShell)]
         │
         ▼
[Infrastructure Layer (FileSystem / Registry)]
```

### 2.1 Allowed Dependencies
- **Renderer Components** ➔ May import from **Shared Modules**, **Feature Modules**, **Service Layer**, and **State Management Layer**.
- **Services** ➔ May import from **IPC Layer Contracts (`src/types/ipc.ts`)** and **Configuration Layer**.
- **IPC Main Handlers** ➔ May call **Engine Layer**, **Optimization Layer**, **Logging Layer**, and **Error Handling Layer**.
- **Engine Layer** ➔ May call **Platform Layer**, **Infrastructure Layer**, and **Logging Layer**.

### 2.2 Forbidden Dependencies
- 🚫 **Renderer Layer** MUST NEVER import Node.js native modules (`fs`, `child_process`, `path`, `os`, `v8`).
- 🚫 **Renderer Layer** MUST NEVER invoke raw `ipcRenderer` directly without passing through `electron/preload.cjs` ContextBridge.
- 🚫 **Platform Layer / Engine Layer** MUST NEVER import React components or Renderer UI code.
- 🚫 **Core / Platform Layers** MUST NEVER instantiate user-facing AI models or remote cloud API keys.
- 🚫 **IPC Layer** MUST NEVER allow synchronous IPC invocations (`ipcRenderer.sendSync`).

---

## 🛰️ 3. Communication Flow Architecture

1. **User Action:** User clicks an action button in a React 19 component (`src/components/`).
2. **Service Facade Invocation:** Component calls async service method in `src/services/` (e.g. `optimizationService.applyCategory(...)`).
3. **IPC Preload Dispatch:** Service calls `window.electronAPI.invoke('apply-optimization', payload)`.
4. **Channel Whitelist & Regex Sanitization:** `preload.cjs` validates channel against `VALID_CHANNELS` array and sanitizes input payload.
5. **Main Process Reception:** `ipcMain.handle('apply-optimization', ...)` receives request in Main Process.
6. **Engine Execution:** Main Process dispatches task to **Engine Layer**, executing in-memory Base64 UTF-16LE PowerShell stream via stdin pipe.
7. **Infrastructure / OS Layer:** Native Windows kernel / Registry / System process handles execute operation safely.
8. **Logging & Response Stream:** Operation outcome logged asynchronously via **Logging Layer** (`%APPDATA%\luper\logs\`); result returned to Renderer as typed JSON payload.
9. **UI State Update:** Service resolves Promise; **State Management Layer** updates React view state seamlessly at 60 FPS.

---

## ⚡ 4. Lifecycle Execution Management

### 4.1 Initialization Order (Sequence 1 to 6)
1. **Bootstrap & Logger Init:** Launch Main Process, initialize structured JSON logger in `%APPDATA%\luper\logs\`.
2. **Security & Single-Instance Lock:** Verify single-instance lock (`requestSingleInstanceLock`), set hardened CSP headers.
3. **Configuration & Data Hydration:** Load configuration manifests and offline JSON databases (`src/data/`).
4. **IPC Channel Whitelist Binding:** Register all `ipcMain.handle` listeners for whitelisted channels.
5. **BrowserWindow Launch:** Create `BrowserWindow` with `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`.
6. **Renderer Hydration & State Sync:** Load web application in Renderer; hydrate React Context stores from dual-layer state.

### 4.2 Shutdown Order (Sequence 1 to 5)
1. **Window Close Event:** Intercept `before-quit` app lifecycle event.
2. **Pending Task Cancellation:** Terminate active background processes and drain PowerShell stdin streams cleanly.
3. **State Persistence Flush:** Flush transient UI state to localStorage and execute atomic file write of settings JSON.
4. **IPC Handler Unbinding:** Remove all `ipcMain` event listeners and close native Win32 process handles (`CloseHandle`).
5. **Logger Drain & Process Exit:** Flush pending log buffers to disk and terminate main process (`app.quit()`).

---

## 🛡️ 5. Module Boundaries, Extension Points & Scalability

### 5.1 Encapsulation & Boundaries
- All module capabilities MUST be exposed exclusively via public index exports (`index.ts`).
- Internal helper logic within modules MUST remain private and un-exported.

### 5.2 Extension Points & Plugin Architecture
- Plugins interface with LUPER through strongly typed plugin contracts (`src/types/plugin.ts`).
- Third-party plugins execute within isolated, capability-restricted sandboxes with 0 access to raw Node.js or Win32 APIs.

### 5.3 Scalability & Future Integration Strategy
- **Modular Feature Scalability:** New optimization categories or tools are integrated by adding self-contained modules under `src/features/<new_feature>/` and defining new offline JSON schemas in `src/data/`.
- **Zero Breaking Changes:** New IPC channels append to `VALID_CHANNELS` without modifying existing signatures.
- **Offline-First Guarantee:** All future modules MUST maintain 100% offline functionality without remote server dependencies.

---

## 🔗 Related Documents
- 📜 [AGENTS.md](../AGENTS.md) — Master AI Rule System & Governance Constitution
- 📜 [common_agent_standards.md](agents/common_agent_standards.md) — Mandatory Common Agent Standards
- 📜 [file_ownership_matrix.md](agents/file_ownership_matrix.md) — Mandatory File Ownership & Responsibility Matrix
- 📜 [definition_of_done.md](agents/definition_of_done.md) — Mandatory Definition of Done & Quality Gates
- 📑 [ADR-0001](adr/ADR-0001-electron-architecture.md) — Electron + Node.js Architecture ADR
