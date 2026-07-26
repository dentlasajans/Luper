# ADR-0001: Electron + Node.js Architecture Decision

- **Status:** Accepted
- **Date:** 2026-07-24
- **Deciders:** LUPER Architecture Review Board & Project Owner

---

## Context

LUPER is a commercial Windows desktop optimization and performance platform requiring rock-solid Windows OS interaction, secure IPC sandboxing, responsive UI rendering (60 FPS), and 100% offline-first execution capabilities.

The platform must execute native Win32 API calls, manage Windows Registry keys (`HKLM`/`HKCU`), monitor system processes, and run PowerShell commands safely without exposing the operating system to Remote Code Execution (RCE) vulnerabilities or antivirus false positives.

---

## Decision

The Project Owner officially mandated **Electron (v43+) + Node.js + React 19 + TypeScript** as the single source of truth for LUPER's desktop architecture stack.

Key Architectural Principles:
1. **3-Tier Isolation:** Renderer Process (React 19 / TypeScript) → Preload Bridge (`contextBridge` exposure) → Main Process (Node.js system handlers & Win32 native bridge).
2. **IPC Sandboxing:** Hardened security defaults (`contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`). Direct access to Node.js modules from the renderer is prohibited.
3. **Parametric Execution Safety:** String-interpolated shell command execution is prohibited. Native command execution uses array arguments with `execFile` or in-memory PowerShell streams with regex input sanitization.
4. **Dual-Layer Persistence:** React state (localStorage / UI state) and local Node.js atomic JSON storage remain synchronized across IPC boundaries.
5. **Modular Main Process Architecture:** `electron/main.js` serves as the lightweight entry point dispatching to 15 specialized modules in `electron/modules/` (bootstrap, windowManager, ipcManager, nativeServices, systemInfo, powerEvents, trayManager, menuManager, protocolManager, updateManager, logger, errorManager, configManager, securityManager, lifecycleManager).

---

## Alternatives Considered

- **Tauri + Rust:** Considered for minimal binary footprint and low idle memory consumption. Rejected due to complex Windows Win32 COM/WMI integration overhead, slower developer iteration speed for complex Windows Registry manipulation, and project team expertise alignment.
- **Native C# / WPF / WinUI 3:** Considered for native Windows OS integration. Rejected due to lack of modern cross-platform React 19 component library reusability and slower UI iteration cycle compared to modern web technologies.
- **Progressive Web App (PWA):** Rejected due to strict browser sandbox restrictions preventing access to low-level Windows APIs, Win32 registry access, and system services.

---

## Consequences

### Positive
- Rapid development cycle using React 19, TypeScript, and modern web UI tooling.
- Deep access to Node.js native OS modules, Windows APIs, and PowerShell engine.
- Modular Main Process architecture with single-responsibility module isolation.
- Production-ready packaging and auto-update capabilities via Electron Builder and NSIS installer.

### Negative & Mitigation
- Larger initial distribution installer size compared to native webview wrappers. *Mitigation: Implement Vite bundle code-splitting (`manualChunks`) and asset optimization.*
- Higher idle RAM usage. *Mitigation: Implement aggressive window lifecycle management, memory profiling, and event listener cleanup.*

---

## Implementation Notes

- `electron/main.js` serves as the Main Process entry point dispatching to modular controllers in `electron/modules/`.
- `electron/preload.cjs` exposes safe APIs via `contextBridge.exposeInMainWorld('electronAPI', ...)`.
- All IPC channels must be whitelisted in `VALID_CHANNELS` in `electron/preload.cjs`.
- Use `node --check electron/main.js` and `npm run build` for local verification.

---

## References

- [ADR Index](README.md)
- [AGENTS.md](../../AGENTS.md)
- [RULES/electron_rules.md](../../RULES/electron_rules.md)
- [RULES/security_rules.md](../../RULES/security_rules.md)
- [RULES/ipc_rules.md](../../RULES/ipc_rules.md)

---

## Related Documents

- 📄 [README.md](../../README.md) — Main Project Overview & Architecture
- 🤖 [AGENTS.md](../../AGENTS.md) — Master AI Rule System & Governance
- 📂 [RULES/](../../RULES/AGENTS.md) — Shared System Standards & Engineering Rules
- 📑 [ADR Index](README.md) — Architecture Decision Records Index
