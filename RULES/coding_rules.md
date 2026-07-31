# LUPER Global Coding Standards (`RULES/coding_rules.md`)

This document defines the permanent, unified coding standards for the entire **LUPER** project (Commercial Windows Desktop Optimization & Performance Platform built with Electron, Node.js, React 19, TypeScript, and Tailwind CSS v4).

Every AI agent and software engineer working on LUPER must strictly follow these rules. These standards override personal coding preferences.

---

# Purpose

Define a unified, non-negotiable coding standard for the entire codebase.

The primary objective is to achieve software consistency, maintainability, scalability, readable componentry, and production-quality software engineering across all application layers.

---

# General Principles

Always prefer:

- **Readability:** Clear control flows and explicit logic structures.
- **Simplicity:** Elegant, straightforward code over complex abstractions.
- **Maintainability:** Code that any senior developer can easily inspect and modify.
- **Predictability:** Transparent state mutations and pure functional handlers.
- **Explicit Code:** Explicit type annotations, parameters, and return signatures.
- **Reusability:** Modular components and composable utility functions.
- **Production Quality:** Fully typed (`strict: true`), zero warnings, robust error handling.
- **Scalability:** System design ready for 10x feature growth without structural debt.

> 🛑 **CORE PRINCIPLE:**
> Never optimize for writing less code. Always optimize for understanding code.

---

# Code Philosophy

Every single line of code added to LUPER should:

- Have a single, clear, and transparent purpose.
- Be immediately understandable upon first read.
- Be easy to test, inspect, and maintain over years.
- Produce deterministic, predictable execution outputs.
- Be easy to extend or modify without breaking adjacent modules.
- Avoid unnecessary abstraction or premature over-engineering.

*Write code for humans first, and compilers second.*

---

# Architecture Compliance

Never violate or bypass LUPER's established software architecture.

When adding features or refactoring, ALWAYS:

- **Extend existing systems:** Build upon current data stores, IPC bridges, and engine handlers.
- **Reuse existing components:** Inspect `src/components/` before creating new visual elements.
- **Reuse existing hooks:** Check `src/hooks/` for state management and system status hooks.
- **Reuse existing stores:** Utilize established React Context providers and state stores.
- **Reuse existing utilities:** Search utility modules for string, regex, or IPC helpers.
- **Reuse existing engines:** Connect directly to native Node.js/Electron system execution channels.

*Avoid duplicate implementations under any circumstances.*

---

# Code Organization

Organize code into small, focused, logical units.

Always prefer:

- **Small Functions:** Single-purpose functions under 30-40 lines.
- **Small Modules:** Decoupled files focusing on a single responsibility.
- **Small Components:** Atomic React presentational blocks driven by clean props.

*Avoid giant, monolithic files. Avoid deeply nested conditional logic (max 3 levels). Separate concerns clearly.*

---

# Naming

Use descriptive, meaningful names that communicate exact intent:

- **Avoid Abbreviations:** Write `optimizationCount` instead of `optCnt`; `systemStatus` instead of `sysStat`.
- **Avoid Generic Names:** Never use generic terms like `data`, `info`, `item`, `temp`, or `obj`.
- **Variables:** Must describe exact intent (e.g. `appliedOptimizationIds`, `isReduceMotionEnabled`).
- **Functions:** Must describe exact behavior (e.g. `calculateSystemScore`, `flushDnsCache`).
- **Components:** Must describe exact purpose (e.g. `SystemScoreCard`, `BaseCategoryView`).

---

# Functions

Functions across Node.js and TypeScript must:

- Have strictly **one responsibility** (Single Responsibility Principle).
- Be straightforward and easy to understand.
- Avoid hidden side effects or implicit global mutations.
- Return predictable, strongly-typed results.
- Remain reasonably small and focused.

*Prefer function composition and pipeline data transformations over large, multi-purpose functions.*

---

# Components

React presentational components must:

- Have strictly **one presentational responsibility**.
- Be reusable across multiple views and categories.
- Be modular and decoupled from hardcoded business data.
- Be clean, readable, and well-structured.
- Avoid duplicated presentation or state logic.

*Move complex business, asynchronous IPC, or calculation logic into custom hooks or utility helpers.*

---

# State Management

Keep React state management:

- **Minimal:** Store only necessary, non-derived state primitives.
- **Predictable:** Execute state mutations through transparent dispatchers.
- **Local Whenever Possible:** Keep transient UI state inside local component state.

*Avoid unnecessary global state bloat. Avoid duplicated or synchronized parallel states.*

---

# Error Handling

- **Never Ignore Errors:** Catch and handle all expected async rejections and Win32 failures.
- **Handle Expected Failures:** Gracefully manage missing registry keys, permission denials, or network timeouts.
- **Provide Meaningful Error Messages:** Log technical details internally while displaying gamer-friendly Turkish notices to users.
- **Fail Safely:** Ensure sub-component failures never crash the main application thread or UI looper.

---

# Performance

- **Avoid Unnecessary Renders:** Wrap presentational components in `React.memo()`, values in `useMemo`, callbacks in `useCallback`.
- **Avoid Unnecessary Allocations:** Do not instantiate transient objects inside render loops.
- **Avoid Duplicate Computations:** Memoize expensive calculations.
- **Avoid Heavy Synchronous Work:** Keep the UI looper free by executing native work asynchronously.

*Optimize only when backed by profiler metrics. Measure improvements before and after optimizing.*

---

# Dependencies

Before adding any external package dependency:

- Verify absolute technical necessity; confirm the feature cannot be implemented cleanly with existing tools.
- Prefer existing project utilities and UI design tokens.
- Prefer native platform capabilities (Electron APIs, native Web APIs).
- Minimize overall project dependency count to keep security footprints small.

*Avoid importing heavy external libraries for trivial tasks.*

---

# Comments

- **Explain WHY, Not How:** Document technical rationale, architectural trade-offs, and non-obvious business rules.
- **Do Not Explain Obvious Code:** Avoid redundant comments that re-state readable code syntax.
- **Remove Outdated Comments:** Clean up obsolete comments during refactoring.

---

# Refactoring

Refactor existing code **ONLY** when it:

- Measurably improves code readability and developer clarity.
- Significantly improves long-term codebase maintainability.
- Eliminates verified code or logic duplication.
- Simplifies complex or brittle architectural structures.

*Never refactor working production code without a clear, measurable benefit.*

---

# Code Review Checklist

Audit every line of code against these 9 standards before submission:

- [ ] **Readability:** Is the code self-explanatory and easy for any engineer to read?
- [ ] **Naming:** Do variable, function, and file names clearly express intent according to `RULES/naming_rules.md`?
- [ ] **Maintainability:** Is the code clean, modular, and easy to modify in the future?
- [ ] **Reusability:** Are pre-existing components, hooks, stores, and utilities reused?
- [ ] **Simplicity:** Is unnecessary complexity, deep nesting, or premature abstraction eliminated?
- [ ] **Error Handling:** Are safe fallbacks, try/catch blocks, and error states present?
- [ ] **Performance:** Are re-renders avoided and memory allocations kept lightweight?
- [ ] **Consistency:** Does the code match established formatting and code patterns?
- [ ] **Architecture Compliance:** Does the file conform to Clean Architecture boundaries?

---

# Things Never Allowed

The following practices are **STRICTLY FORBIDDEN** across LUPER:

- ❌ Temporary hacks, quick workarounds, or swallowed exceptions.
- ❌ Dead code, abandoned files, or commented-out code blocks.
- ❌ Duplicate implementations or redundant parallel helper functions.
- ❌ Magic numbers or hardcoded configuration strings (use explicit constants).
- ❌ Unused imports, unused variables, or `any` type casting.
- ❌ Circular dependencies between modules.
- ❌ Misleading, ambiguous, or abbreviated variable names.

---

# Definition of Done

A code implementation is considered **DONE** and ready for release only if it is:

- ✅ **Production-Ready:** Fully typed, zero warnings, zero dead code.
- ✅ **Readable:** Self-explanatory and clean.
- ✅ **Tested:** Verified by build compilation (`npm run build`) and runtime execution.
- ✅ **Maintainable:** Modular and loosely coupled.
- ✅ **Consistent:** Strictly aligned with LUPER design tokens and code standards.
- ✅ **Scalable:** Prepared for long-term product evolution.
- ✅ **Reviewed:** Formally audited and approved by `critic_agent`.
- ✅ **Compliant:** Fully compliant with `AGENTS.md` and all files inside `RULES/`.
