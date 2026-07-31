# LUPER Permanent Electron IPC Rules (`RULES/ipc_rules.md`)

This document defines the mandatory Inter-Process Communication (IPC) architecture, security contracts, contextBridge isolation patterns, channel naming conventions, error handling mechanisms, and performance guidelines for **LUPER** (Windows Operating System Optimization & Performance Platform built with Electron, Node.js, React 19, and TypeScript).

Every AI agent and software engineer must strictly adhere to these rules when building or modifying IPC channels between the React 19 Renderer Process and the Electron Main Process.

---

## Purpose

The purpose of these IPC rules is to:
- Establish a secure, asynchronous, strongly typed bridge between the React Renderer and Node.js Main Process.
- Enforce strict process isolation (`contextIsolation: true`, `nodeIntegration: false`) to prevent Remote Code Execution (RCE) vulnerabilities.
- Guarantee predictable request/response and uni-directional event streams for Windows OS optimization features.
- Eliminate unsafe IPC practices like synchronous calls, raw string execution, or exposing dangerous Node.js modules to the frontend.

---

## Allowed IPC Patterns

LUPER permits only two specific asynchronous IPC patterns:

1. **Two-Way Request/Response (`ipcMain.handle` / `ipcRenderer.invoke`):**
   - Used when the Renderer process requests an operation or data from the Main process and awaits a response.
   - Always returns a Promise resolving to a strongly typed payload or structured error object (`Result<T, CommandError>`).

2. **One-Way Main-to-Renderer Events (`webContents.send` / `ipcRenderer.on`):**
   - Used when the Main process streams asynchronous background updates (e.g. real-time CPU/RAM telemetry metrics, progress status during batch optimizations) to the Renderer process.
   - Renderer registers explicit listeners exposed via `contextBridge` and removes listeners upon component unmount.

---

## Forbidden IPC Patterns

The following IPC anti-patterns are strictly prohibited across LUPER:

- ❌ **Synchronous IPC (`ipcRenderer.sendSync` / `ipcMain.on` returning values synchronously):** Blocks the UI main thread and causes frame drops.
- ❌ **Direct `remote` Module Usage:** The `@electron/remote` module is disabled and forbidden due to memory leaks and security bypasses.
- ❌ **Exposing Raw `ipcRenderer` or `ipcMain` via ContextBridge:** Never expose generic `.send()`, `.emit()`, or `.on()` methods without strict channel filtering.
- ❌ **Dynamic or Evaluated Channel Names:** Channel names must be explicit string constants in a validated whitelist array (`VALID_CHANNELS`), never dynamically constructed from user input.
- ❌ **Raw Shell / Code Execution via IPC:** Never pass arbitrary PowerShell scripts or CLI command strings directly from Renderer to Main.

---

## Context Bridge Rules

- **Preload Isolation:** All Preload scripts (`electron/preload.cjs`) must use `contextBridge.exposeInMainWorld` to expose explicit, named helper functions under specified namespaces (`window.electronAPI` and `window.electron`).
- **Channel Whitelisting:** Every IPC call exposed via `ipcRenderer.invoke` or `ipcRenderer.on` must validate the channel string against an explicit `VALID_CHANNELS` whitelist. Unrecognized channels must be rejected instantly.
- **No Node.js Types in Window Global:** Keep exposed preload APIs clean, returning plain JSON-serializable JavaScript objects.
- **Strict Parameter Sanitization:** Preload functions must typecast or validate parameters (e.g. `Boolean(enable)`, `String(actionId)`) before forwarding them across IPC.

---

## IPC Naming Convention

IPC channel names must follow strict naming rules:

- **Format:** `kebab-case` string identifiers (e.g. `get-system-status`, `apply-optimization`, `execute-cleaner`, `get-startup-items`).
- **Action Verbs:** Must start with a clear action verb:
  - Query channels: `get-*` (e.g. `get-system-metrics`, `get-installed-apps`, `get-category-settings`).
  - Action channels: `apply-*`, `restore-*`, `toggle-*`, `execute-*`, `launch-*`, `set-*` (e.g. `apply-optimization`, `toggle-startup-item`).
  - Window control channels: `window-minimize`, `window-maximize`, `window-close`.
- **Consistency:** The channel string in `electron/preload.cjs` `VALID_CHANNELS` array must exactly match the string registered in `electron/main.js` `ipcMain.handle(...)`.

---

## Request / Response Pattern

- All two-way communication must use `ipcMain.handle('channel-name', handler)` in the Main Process and `ipcRenderer.invoke('channel-name', payload)` in Preload.
- Main process handler must be an `async` function.
- The handler must accept `event` as the first argument, followed by sanitized parameters.
- Response payloads must be JSON-serializable. Circular references, Functions, or Native C++ handles cannot be passed over IPC.

---

## Event Pattern

- For real-time updates (e.g., hardware telemetry, progress bars), Main uses `window.webContents.send('telemetry-update', data)`.
- Preload wraps this into a safe listener registration function: `onTelemetryUpdate: (callback) => ipcRenderer.on('telemetry-update', (event, data) => callback(data))`.
- Renderer components MUST remove listeners on unmount (`ipcRenderer.removeListener` or cleanup function returned by hook) to prevent memory leaks.

---

## Error Handling

- **Never throw raw uncaught exceptions across IPC:** Main process handlers must catch all Node.js, Win32, and PowerShell exceptions inside `try/catch` blocks.
- **Structured Error Response:** Return standardized result objects or structured rejection payloads:
  ```typescript
  interface IPCResult<T> {
    success: boolean;
    data?: T;
    error?: {
      code: string;
      message: string;
      details?: string;
    };
  }
  ```
- **Renderer Graceful Fallbacks:** The Renderer process must handle IPC rejections or `success: false` states gracefully without freezing UI or showing unformatted stack traces to the user.

---

## Security Requirements

- **Strict Input Validation:** All input payloads received from Renderer must be checked against strict schemas or regex patterns before execution (e.g. verifying registry path formats, numeric IDs, or boolean toggles).
- **AMSI & Antivirus Safety:** PowerShell commands triggered by IPC must be executed via LUPER's In-Memory Base64 / Stdin stream engine to avoid disk `.ps1` drops and false positives.
- **Least Privilege:** Windows UAC elevation is restricted to Main Process execution when modifying protected registry keys (`HKLM`) or system services.
- **Context Isolation:** `contextIsolation: true`, `nodeIntegration: false`, `webSecurity: true`, `sandbox: true` enforced on all `BrowserWindow` configurations.

---

## Validation Rules

1. Every new IPC channel must be declared in:
   - `electron/preload.cjs` (`VALID_CHANNELS` array)
   - `electron/main.js` (`ipcMain.handle` block)
   - `src/types/` (TypeScript contract interface)
2. Run `node --check electron/main.js` to ensure syntax validity.
3. Run `npm run build` to verify TypeScript contract alignment across Renderer and Main.

---

## Performance Guidelines

- **Sub-5ms IPC Dispatch:** IPC serialization/deserialization overhead must remain under 5ms.
- **Payload Compression/Minification:** Avoid sending huge unnecessary JSON objects across IPC; send only delta metrics or minimal required parameters.
- **Throttling Telemetry:** Telemetry streams (CPU/RAM/Disk metrics) must be throttled to reasonable intervals (e.g., 1000ms) to prevent UI thread thrashing.
- **Zero Memory Leaks:** Cleanup IPC event listeners when views or components unmount.

---

## Examples

### 1. Preload Bridge Definition (`electron/preload.cjs`)
```javascript
const { contextBridge, ipcRenderer } = require('electron');

const VALID_CHANNELS = [
  'get-system-status',
  'apply-optimization'
];

contextBridge.exposeInMainWorld('electronAPI', {
  getSystemStatus: () => ipcRenderer.invoke('get-system-status'),
  applyOptimization: (settingKey) => ipcRenderer.invoke('apply-optimization', String(settingKey))
});
```

### 2. Main Process Handler (`electron/main.js`)
```javascript
const { ipcMain } = require('electron');

ipcMain.handle('get-system-status', async (event) => {
  try {
    const metrics = await readSystemStatusNative();
    return { success: true, data: metrics };
  } catch (err) {
    return { success: false, error: { code: 'SYS_METRICS_ERROR', message: err.message } };
  }
});
```

### 3. React Service Invocation (`src/services/systemService.ts`)
```typescript
export async function fetchSystemStatus() {
  if (window.electronAPI) {
    return await window.electronAPI.getSystemStatus();
  }
  throw new Error('Electron API unavailable');
}
```

---

## Best Practices

- Always keep `electron/preload.cjs` as a slim, secure security proxy.
- Group related IPC calls into dedicated frontend service abstractions inside `src/services/`.
- Test IPC handlers with mock payloads in non-Electron environments for fast unit testing.
- Document any breaking IPC schema changes in `docs/adr/` and `RULES/ipc_rules.md`.
