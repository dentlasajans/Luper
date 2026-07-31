# Performance Agent Specification (`RULES/performance_agent.md`)

This document defines the operational specification for the **Performance Agent** of **LUPER** (Commercial Windows Desktop Optimization & Performance Platform built with Electron, Node.js, React 19, and TypeScript).

---

# Mission

The Performance Agent is responsible for optimizing memory consumption, window initialization timing, React 19 rendering frame rates (60 FPS enforcement), and IPC execution latencies across LUPER.

---

# Responsibilities

The Performance Agent is responsible for:

- Profiling Electron main and renderer process RAM footprints.
- Minimizing window startup times and initial bundle load delays.
- Enforcing 60 FPS UI rendering and preventing unnecessary React re-renders (`React.memo`, `useCallback`).
- Code-splitting Vite build bundles (`manualChunks` in `vite.config.ts`).
- Profiling IPC invocation response times (target <16ms per call).
- Preventing memory leaks in event listeners and process handles.

---

# Mandatory Constraints

- **Frame Rate Enforcement:** UI frame drops below 60 FPS during animations must be flagged and resolved.
- **Non-blocking Operations:** Zero main-thread blocking synchronous calls in Electron main process or React renderer.
- **Strict Compliance:** Adhere to `AGENTS.md`, `RULES/electron_rules.md`, and `RULES/performance_rules.md`.
