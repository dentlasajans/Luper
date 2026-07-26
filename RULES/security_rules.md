# LUPER Permanent Security Engineering Standards (`RULES/security_rules.md`)

This document defines the permanent application security standards, process isolation rules, IPC threat prevention guidelines, and production checklists for **LUPER** (Commercial Windows Desktop Optimization & Performance Platform built with Electron, Node.js, React 19, TypeScript, and Tailwind CSS v4).

Every AI agent and software engineer working on LUPER must strictly follow these rules. Security is considered a core engineering requirement across every layer of the application.

---

# Purpose

Define the permanent security standards that apply to every component, native command, IPC channel, file operation, and data structure in LUPER.

Security is built directly into software design and is never added after the fact. Every implementation must actively protect the application binary, the underlying Windows operating system, and the user's local environment.

---

# Security Philosophy

Security is enforced through defense in depth, process isolation, and least privilege.

- Every feature, endpoint, and configuration must be **secure by default**.
- Always assume all external inputs, IPC arguments, and environment data are **untrusted**.
- Always prefer strict, restrictive secure defaults across Electron and Node.js execution layers.

---

# Core Principles

Always strictly adhere to these security principles:

- **Least Privilege:** Request strictly the minimum Windows privileges required for native execution.
- **Defense in Depth:** Implement layered input validation (React frontend + Preload proxy + Node.js main process checks).
- **Fail Securely:** Ensure failures, rejections, or exceptions leave the system in a safe fallback state without exposing internal state.
- **Secure by Default:** Hardened defaults for window creation, webPreferences, network requests, and IPC bridges.
- **Explicit Validation:** Validate every incoming parameter explicitly against strict whitelist schemas and regex patterns.
- **Explicit Elevation:** Scope administrative elevation strictly to verified Win32/Registry writes via NSIS execution levels.
- **Minimize Attack Surface:** Expose only essential, strongly typed IPC methods to the renderer process.
- **Zero Trust Mindset:** Treat all external data, IPC payloads, and user inputs as untrusted until fully validated.

---

# Process Isolation

Process isolation separates the privileged Electron Main Process (Node.js engine) from the unprivileged Renderer Process (Chromium web engine).

### Implementation Guidelines
- The React Renderer process runs in an isolated Chromium process without direct access to Node.js modules or OS primitives.
- All OS native operations (Win32 API, PowerShell commands, registry writes) must execute strictly within the Main Process.
- Never pass Node.js `process`, `child_process`, `fs`, or native bindings directly into the Renderer layer.

---

# Context Isolation

Context Isolation ensures that Preload scripts and Renderer JavaScript code run in completely separate execution contexts, preventing prototype pollution and context escaping.

### Implementation Guidelines
- `contextIsolation: true` MUST be explicitly configured on every `BrowserWindow` webPreferences dictionary.
- Preload scripts must NEVER modify global prototypes (`Object.prototype`, `Array.prototype`) shared with the renderer.
- Communicate across the context boundary strictly through `contextBridge.exposeInMainWorld`.

---

# Sandbox Requirements

Chromium process sandboxing restricts the Renderer process from accessing system resources directly.

### Implementation Guidelines
- `sandbox: true` MUST be enabled in `webPreferences` for all application windows.
- Preload scripts must remain lightweight, avoiding native module requires that break sandboxing boundaries.
- Renderers cannot create local files, execute binaries, or access environment variables directly.

---

# Preload Security

The Preload script (`electron/preload.cjs`) serves as a strict security firewall between Renderer and Main processes.

### Implementation Guidelines
- Use `contextBridge.exposeInMainWorld` to expose named API objects (e.g. `window.electronAPI`).
- NEVER expose raw `ipcRenderer`, `ipcMain`, `require`, or generic `send`/`on` emitters.
- Enforce strict channel name validation against a hardcoded `VALID_CHANNELS` whitelist array in preload.
- Cast or sanitize parameter types (e.g., `Boolean(val)`, `String(str)`) before sending payloads across IPC.

---

# IPC Validation

Every IPC message received by `ipcMain.handle` or `ipcMain.on` in the Main process must be thoroughly validated.

### Implementation Guidelines
- Validate the channel name against allowed registered handlers.
- Validate all payload parameter types, structures, and value bounds inside the IPC handler before executing logic.
- Return structured error objects (`Result<T, CommandError>`) instead of letting raw uncaught exceptions bubble across IPC.

---

# Input Validation

Every external input (IPC payload, search query, text field, file path argument, or configuration string) MUST be validated before use.

### Implementation Guidelines
- **Regex Schema:** Validate incoming strings against strict regex schemas (e.g. `/^[a-zA-Z0-9_-]+$/` for action keys, `/^\d+$/` for Steam AppIDs).
- **Sanitization:** Strip dangerous shell metacharacters (`&`, `;`, `|`, `` ` ``, `$`, `>`, `<`, `\n`, `\r`).
- **Length & Type Limits:** Enforce maximum byte lengths and strict TypeScript types.
- **Immediate Rejection:** Reject malformed or un-whitelisted inputs immediately without executing fallback system commands.

---

# Permission Management

LUPER enforces strict privilege separation and least privilege for Windows OS operations.

### Implementation Guidelines
- Request Windows UAC Administrative Elevation strictly when executing verified system registry (`HKLM`) or service modifications (`requestedExecutionLevel: requireAdministrator` in `electron-builder`).
- Block unrequested Electron session permissions by setting a custom permission handler:
  ```javascript
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    return callback(false); // Reject camera, microphone, geolocation, etc.
  });
  ```

---

# External URL Handling

Prevent unauthorized web navigation and remote code execution through external links.

### Implementation Guidelines
- Intercept and block unexpected window creation and navigation on all `webContents`:
  ```javascript
  contents.on('will-navigate', (event, navigationUrl) => {
    event.preventDefault();
  });
  contents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) {
      shell.openExternal(url); // Open trusted external HTTPS links in OS default browser
    }
    return { action: 'deny' };
  });
  ```
- Never load remote web content inside `BrowserWindow` instances; serve strictly local packaged assets (`dist/index.html`).

---

# Shell Execution Policy

Executing native shell scripts or command-line utilities must strictly prevent Command Injection and AMSI false positives.

### Implementation Guidelines
- **In-Memory PowerShell Engine:** Execute PowerShell operations in-memory via Base64 encoded streams or `stdin` inputs without dropping temporary `.ps1` files to disk.
- **No Concatenation:** Never concatenate raw user or renderer input into command-line strings.
- **Use `execFile`:** Prefer `child_process.execFile` with explicit argument arrays over `child_process.exec` shell strings.
- **Sanitize Arguments:** Sanitize every array argument against whitelist regex filters before spawn.

---

# File System Access Rules

File system operations must be bounded and safe from directory traversal attacks.

### Implementation Guidelines
- **Scope Paths:** Restrict file reads and writes strictly to designated `%APPDATA%\luper\` or application installation directories.
- **Path Traversal Prevention:** Reject paths containing `..`, illegal characters, or relative navigation tokens.
- **Path Normalization:** Normalize paths using `path.resolve()` and verify target path starts with the allowed root directory.
- **Safe File Access:** Catch `EACCES` / `Access Denied` errors gracefully without crashing the Main process.

---

# Secure Defaults

Enforce hardened configuration defaults across all Electron window and session initializations.

### Implementation Guidelines
Every `BrowserWindow` dictionary must enforce the following secure defaults:
```javascript
const mainWindow = new BrowserWindow({
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    sandbox: true,
    webSecurity: true,
    allowRunningInsecureContent: false,
    experimentalFeatures: false,
    preload: path.join(__dirname, 'preload.cjs')
  }
});
```

---

# Production Security Checklist

Audit every code submission and production build against this 12-point security checklist:

- [ ] **1. Process Isolation:** Are Renderer and Main processes strictly separated with zero Node.js leakage into Renderer?
- [ ] **2. Context Isolation:** Is `contextIsolation: true` explicitly configured on all `BrowserWindow` instances?
- [ ] **3. Sandbox Enabled:** Is `sandbox: true` enforced in `webPreferences` for all windows?
- [ ] **4. Preload Hardening:** Are exposed APIs wrapped strictly via `contextBridge` with channel whitelisting?
- [ ] **5. IPC Sanitization:** Are all IPC parameters validated against regex schemas inside `ipcMain.handle` handlers?
- [ ] **6. Input Sanitization:** Are shell metacharacters (`&`, `;`, `|`, `` ` ``, `$`) stripped from all native execution inputs?
- [ ] **7. Permission Denial:** Are unnecessary session permissions (camera, microphone, location) explicitly blocked?
- [ ] **8. URL Navigation Guard:** Are `will-navigate` and `setWindowOpenHandler` handlers blocking untrusted navigation?
- [ ] **9. Shell Safety:** Are PowerShell commands run in-memory via Base64/stdin without dropping temporary `.ps1` files?
- [ ] **10. Path Bounds:** Are file system paths normalized and bounded to prevent directory traversal (`..`)?
- [ ] **11. Secure Defaults:** Are `nodeIntegration: false` and `webSecurity: true` enforced on all windows?
- [ ] **12. Dependency & Update Audit:** Has `npm audit` returned 0 vulnerabilities, and are update packages SHA-256 verified?

---

# Things Never Allowed

The following practices are **STRICTLY FORBIDDEN** across LUPER:

- ❌ Hardcoding secrets, API keys, tokens, or passwords in source files.
- ❌ Setting `nodeIntegration: true` or `contextIsolation: false` in any window.
- ❌ Passing raw, unsanitized user inputs or renderer strings into native shell execution bridges.
- ❌ Dropping unencrypted `.ps1` script files to disk for execution.
- ❌ Loading remote HTTP/HTTPS websites directly inside Electron `BrowserWindow` frames.
- ❌ Exposing raw stack traces, internal file paths, or system tokens to the user interface.
- ❌ Bypassing administrative permission boundaries or UAC requirements.
