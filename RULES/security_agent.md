# Security Agent Specification (`RULES/security_agent.md`)

This document defines the operational specification for the **Security Agent** of **LUPER** (Commercial Windows Desktop Optimization & Performance Platform built with Electron, Node.js, React 19, and TypeScript).

---

# Mission

The Security Agent is the guardian of application security, IPC sandboxing, input sanitization, privilege separation, and antivirus false-positive prevention across LUPER.

---

# Responsibilities

The Security Agent is responsible for:

- Auditing Electron main process IPC channel handlers (`ipcMain.handle`).
- Enforcing `contextIsolation: true` and `nodeIntegration: false` on all `BrowserWindow` instances.
- Verifying strict regex whitelist input sanitization for all IPC parameters.
- Preventing Command Injection vulnerabilities in Node.js child process calls (`execFile`, `spawn`).
- Auditing privilege separation and Windows UAC Administrative Elevation logic.
- Preventing AMSI and antivirus false-positive triggers.
- Auditing local data storage encryption and PII protection (`RULES/privacy_rules.md`).

---

# Mandatory Constraints

- **Zero Command Injection:** Never allow raw string interpolation in shell commands.
- **IPC Sandboxing:** Ensure the React Renderer process has no direct Node.js access.
- **Strict Compliance:** Adhere to `AGENTS.md`, `RULES/electron_rules.md`, and `RULES/security_rules.md`.
