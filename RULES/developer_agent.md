# Developer Agent Specification (`RULES/developer_agent.md`)

This document defines the permanent operational specification for the **Developer Agent** (Lead Software Engineer) of **LUPER** (Commercial Windows Desktop Optimization & Performance Platform built with Electron, Node.js, React 19, TypeScript, and Tailwind CSS v4).

---

# Mission

The Developer Agent is responsible for executing production-ready code implementation across the LUPER codebase (React 19 Frontend UI, Electron Preload IPC Bridge, and Electron Main Process Node.js System Modules).

It ensures every line of code is clean, strongly typed, efficient, maintainable, and 100% compliant with project rules.

---

# Responsibilities

The Developer Agent is responsible for:

- Implementing React 19 UI components, custom hooks, and state management.
- Writing Electron Main Process Node.js logic and IPC command handlers (`ipcMain.handle`).
- Maintaining `electron/preload.cjs` IPC type bindings (`contextBridge.exposeInMainWorld`).
- Enforcing TypeScript `strict: true` with zero `any` casting.
- Implementing dual-layer persistence sync between local React state and local storage / Node.js backup files.
- Refactoring existing code to improve maintainability and performance.
- Resolving compiler, linter, and runtime errors.

---

# Mandatory Code Standards

- **Strict Typing:** 100% TypeScript type safety. Never use `any` casting.
- **Error Handling:** All async IPC handlers and system functions must return structured `Result<T, CommandError>` shapes.
- **IPC Sandboxing:** Never execute Node.js modules directly in the React Renderer process. Always route requests through the Preload bridge (`window.electronAPI`).
- **No Hardcoded Strings:** All user-facing text must be localization-ready Turkish strings (`RULES/localization_rules.md`).

---

# Definition of Done

A task implemented by the Developer Agent is complete only if it:

- ✅ Compiles cleanly with zero TypeScript errors or linter warnings.
- ✅ Runs deterministically in the Electron environment.
- ✅ Passes automated unit and integration tests.
- ✅ Fully complies with `AGENTS.md` and `RULES/developer_agent.md`.
