# LUPER Permanent API & IPC Architecture Standards (`RULES/api_rules.md`)

This document defines the permanent API, IPC, command, request, response and communication standards for the LUPER project.

Every AI agent must follow these rules.

---

## Technology Stack

- **React 19**
- **TypeScript**
- **Electron** (v43+)
- **Node.js**

---

## Purpose

Define a consistent, secure, predictable and maintainable communication architecture for the LUPER project.

All communication between the frontend and backend must follow these standards.

---

## Architecture Philosophy

LUPER follows a layered communication architecture:

```
React 19 Frontend (Renderer Process)
       ↓
Electron Preload Bridge (contextBridge)
       ↓
Electron Main Process (Node.js System Handlers)
       ↓
Windows Native APIs & PowerShell Execution
```

- Each layer has clearly defined responsibilities.
- **No layer should bypass another.** (The renderer must never invoke Node.js modules or shell execution directly).

---

## Communication Principles

Every API should be:

- **Explicit:** Clear purpose and transparent behavior.
- **Typed:** Strongly typed schemas across frontend and backend boundaries.
- **Predictable:** Consistent execution paths and standard result wrappers.
- **Secure:** Input validation and permission checks enforced at every boundary.
- **Minimal:** Payloads contain only necessary data attributes.
- **Versionable:** Backward-compatible contract design.
- **Easy to maintain:** Clean separation of concerns and self-describing interfaces.

---

## IPC Commands

Every IPC command (`ipcMain.handle`) should:

- Have **one responsibility**.
- Be **clearly named** in `camelCase`.
- **Validate all inputs** before execution.
- Return **typed results** (`Result<T, CommandError>`).
- Handle **failures safely**.
- **Never crash the main process**.

Avoid generic commands (`run`, `execute`, `action`, `process`).

---

## Command Naming

Commands should use descriptive verbs in `camelCase`.

### Examples:
- `getSettings`
- `saveSettings`
- `loadGames`
- `scanSystem`
- `applyOptimization`
- `restoreBackup`

---

## Request & Response Design

- Requests must be **strongly typed** using explicit TypeScript interfaces.
- Responses must return structured data or structured error objects.
- Error messages presented to the user must be clear, non-technical Turkish.

---

## Validation & Security

- **Never trust frontend requests.** Validate all input strings against whitelist regex patterns.
- Protect privileged Win32 / Registry writes with Windows elevation.
- Enforce the principle of least privilege.

---

## Definition of Done

An API implementation is complete only if it is:

- **Typed**
- **Secure**
- **Predictable**
- **Maintainable**
- **Well documented**
- **Versionable**
- **Fully aligned with the LUPER architecture**

*This document defines the permanent API and IPC communication standards for the LUPER project.*
