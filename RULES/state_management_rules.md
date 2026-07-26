# LUPER Permanent State Management Standards (`RULES/state_management_rules.md`)

This document defines the permanent state management architecture, state hierarchy, persistence boundaries, and best practice standards for **LUPER** (Commercial Windows Desktop Optimization & Performance Platform built with React 19, TypeScript, Electron, and Node.js).

Every AI agent and software engineer working on LUPER must strictly follow these rules.

---

# Purpose

Define a scalable, predictable, transparent, and maintainable state management architecture for the entire LUPER application.

State management should remain simple, explicit, performant, and easy to reason about as the product grows in commercial capability.

---

# Core Philosophy

State exists strictly to represent the current operational condition of the application.

Every piece of state in LUPER must have:

- **A Clear Owner:** Exactly one designated component, Context store, or backend service.
- **A Clear Purpose:** Explicit, self-explanatory intent.
- **A Predictable Lifecycle:** Deterministic initialization, mutation, and destruction.
- **Minimal Duplication:** Zero redundant or mirrored state copies.

> 🛑 **CORE STATE RULE:**
> Application state should never become an un-indexed secondary database. Keep state trees lightweight and explicit.

---

# State Hierarchy

Scope state to the smallest possible boundary.

Always follow this strict 3-tier hierarchy:

1. **Local Component State:** Transient UI states (e.g. modal visibility, search inputs, hovered items).
2. **Shared Feature State:** State shared across a specific feature tree (e.g. category optimization selection).
3. **Global Application State:** State required across multiple independent top-level views (`SettingsContext`).

*Never promote state to a higher scope unless explicitly required by multiple independent modules.*

---

# Global State

Global application state (managed via React Context or global stores) must contain **ONLY** application-wide data required across independent modules:

### Valid Global State Examples:
- Active Theme & Visual Tokens
- User Preferences & Application Settings
- Applied Optimization IDs (`applied_optimizations`)
- System Performance Telemetry (`cpuUsage`, `ramUsage`)
- Auto-Start & Tray Notification Preferences
- Global Toast Notification Queue

*Feature-specific or temporary component data must remain strictly outside global state.*

---

# Local State

Local UI state belongs strictly inside the React component that owns it:

### Valid Local State Examples:
- Dialog or Modal visibility toggles (`isOpen`, `showDetails`)
- Form text input fields & search filters (`searchQuery`)
- Accordion or card expanded/collapsed sections (`isExpanded`)
- Active selected tabs within a single panel (`activeTab`)

*Avoid lifting local state to global Context stores unnecessarily.*

---

# Derived State

- **Compute Derived Values on the Fly:** Values that can be derived or calculated from existing state primitives should be computed dynamically during render.
- **Memoize Heavy Computations:** Use `useMemo()` to cache derived calculations (e.g. `systemScore`, filtered optimization arrays) when benchmarked as expensive.
- **Avoid Derived State Primitives:** Never sync derived values into separate `useState` primitives.

---

# Single Source of Truth

- Every piece of application data must have **strictly one authoritative owner**.
- Avoid keeping duplicate copies or mirrored mirrors of the same information across multiple components.
- If data originates from native Node.js main process IPC or `localStorage`, treat that provider as the authoritative single source of truth.

---

# Immutability

- Treat all React state trees as **100% immutable**.
- Always instantiate new array or object references during state dispatches rather than mutating existing objects in place.
- **Predictability Over Convenience:** Immutable state updates guarantee clean React 19 re-render detection and pure visual updates.

---

# State Updates

State updates must be:

- **Predictable:** Execute through transparent dispatch functions or typed reducers.
- **Explicit:** Explicitly named update handlers (e.g. `toggleOptimizationId`).
- **Atomic:** Execute state mutations as single, self-contained atomic updates.
- **Minimal:** Update only affected properties to prevent re-render cascades.

*Avoid cascading state updates where one state change triggers a chain reaction of secondary state dispatches.*

---

# Synchronization

- Synchronize state across module boundaries **ONLY when an explicit user action or IPC event occurs**.
- Avoid keeping identical parallel state stores in multiple places.
- **Frontend & Backend Synchronization:** Synchronize React frontend state and Node.js native main process state through explicit, strongly typed Electron ContextBridge IPC command bridges.

---

# Persistence

Persist **ONLY** data that must survive application restarts:

### Valid Persistent Data (via `%APPDATA%\luper\` / `localStorage`):
- Applied Optimization Configuration Array (`applied_optimizations`)
- User Application Settings & Auto-Start Toggles
- Custom Backup Restores & Activity Timestamps
- Window Position & Dimensions

*Temporary UI state (e.g., search text, active hover states, open dialog flags) must NEVER be persisted.*

---

# Performance

Optimize state management for:

- **Minimal Re-renders:** Isolate Context consumers so state updates do not re-render unaffected components.
- **Efficient Updates:** Use `useMemo` for Context value objects to preserve reference equality.
- **Small State Trees:** Store concise primitive IDs or arrays rather than giant nested object graphs.
- **Predictable Rendering:** Guarantee locked 60 FPS UI transitions without state update lag.

*Avoid unnecessary global Context subscriptions in low-level presentational components.*

---

# Error Handling

- State transitions must always remain valid and consistent.
- Handle IPC rejections, network timeouts, or corrupt local storage data gracefully.
- Provide safe fallback values (e.g. empty arrays `[]`, default scores `0`) to prevent corrupted application states or runtime crashes.

---

# Testing

State logic must be:

- **Deterministic:** Given the same initial state and action, produce the exact same updated state.
- **Easy to Isolate:** Decoupled from DOM elements or hardcoded native binaries.
- **Easy to Test:** Pure reducer functions and state hooks testable via `@testing-library/react-hooks`.
- **Free from Hidden Side Effects:** Zero implicit global mutations during state calculations.

---

# Things Never Allowed

The following practices are **STRICTLY FORBIDDEN** in LUPER state management:

- ❌ Duplicating state primitives across multiple components or Context stores.
- ❌ Mutating state objects directly (e.g. `state.items.push(newItem)`).
- ❌ Storing derived values in separate `useState` variables.
- ❌ Using global Context for local UI concerns (e.g. modal open flags, dropdown states).
- ❌ Mixing complex backend business logic into React UI state handlers.
- ❌ Synchronizing identical state across multiple independent owners.

---

# Definition of Done

A state management implementation is considered **DONE** and ready for release only if it is:

- ✅ **Predictable:** Deterministic, immutable state dispatches.
- ✅ **Consistent:** Aligned with LUPER state hierarchy rules.
- ✅ **Modular:** Decoupled Context providers and local component hooks.
- ✅ **Performant:** Zero unnecessary re-renders, memoized Context values.
- ✅ **Testable:** Easily testable state reducers and hooks.
- ✅ **Maintainable:** Clean, readable, strongly-typed state trees (`strict: true`).
- ✅ **Fully Aligned with LUPER Architecture:** Compliant with `AGENTS.md` and `RULES/state_management_rules.md`.
