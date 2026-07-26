# LUPER Permanent Electron Architecture & IPC Standards (`RULES/electron_rules.md`)

This document defines the permanent Electron main process, preload script, IPC channel bridge, and native Node.js execution standards for **LUPER** (Windows Desktop Optimization & Performance Platform built with Electron, Node.js, React 19, and TypeScript).

Every AI agent and software engineer working on LUPER must follow these rules.

---

## Technology Stack

- **Windows** (Target OS Platform)
- **Electron** (v43+ Main Process & WebContents)
- **Node.js** (Native System Execution & Registry Bridge)
- **React 19** (TypeScript Frontend UI Framework)
- **TypeScript** (Strongly Typed IPC Contracts & Schemas)

---

## Architecture Philosophy

LUPER follows a secure 3-tier Electron architecture:

```
React 19 Frontend (Renderer Process)
       ↓
Electron Preload Bridge (contextBridge / IPC Exposure)
       ↓
Electron Main Process (Node.js System Handlers & Win32 Execution)
```

- **Separation of Concerns:** The React renderer process must never execute `child_process`, `fs`, or native Node.js modules directly.
- **IPC Sandboxing:** All IPC communication must pass through `contextBridge.exposeInMainWorld` using strongly typed `ipcRenderer.invoke` and `ipcMain.handle` contracts.

---

## IPC Channel Standards

- Every IPC channel must use descriptive `camelCase` action verbs (e.g. `getSettings`, `saveSettings`, `scanSystem`, `applyOptimization`, `restoreBackup`).
- Avoid generic channel names (`run`, `execute`, `action`).
- All requests and responses must be 100% strongly typed with TypeScript interfaces.
- The Electron main process must validate all IPC input parameters before executing Win32 / PowerShell commands (`RULES/security_rules.md`).
- Handlers must catch exceptions gracefully and return structured error objects (`Result<T, CommandError>`) instead of crashing the main process.

---

## Security & Privilege Separation

- `contextIsolation: true` and `nodeIntegration: false` must be enforced on all `BrowserWindow` instances.
- Never pass raw, unsanitized user inputs or string snippets into `exec` or `execFile`.
- Validate all incoming registry paths, value names, and parameters against strict whitelist regex patterns.
- Request Windows UAC Administrative Elevation strictly when executing verified system registry or service modifications (`requestedExecutionLevel: requireAdministrator` in `electron-builder`).

---

## Performance Targets

- Fast, smooth window initialization (target under 200ms).
- Sub-16ms frame render times (60 FPS minimum for UI animations).
- Minimize background IPC polling and idle process overhead.
- Release unused event listeners and handles to prevent memory leaks.

*This document defines the permanent Electron architecture standards for the LUPER project.*
