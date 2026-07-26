# LUPER Permanent React 19 Development Standards (`RULES/react_rules.md`)

This document defines the permanent React 19 architecture, component design, state management, and best practice standards for **LUPER** (Commercial Windows Desktop Optimization & Performance Platform built with Electron, Node.js, React 19, TypeScript, and Tailwind CSS v4).

Every AI agent and frontend software engineer working on LUPER must strictly follow these rules.

---

# Purpose

Define a consistent, scalable, maintainable, type-safe, and high-performance React 19 architecture for the LUPER project.

React code should remain clean, modular, predictable, performant, and easy to extend throughout the entire product lifetime.

---

# Core Philosophy

React is responsible **ONLY** for:

- User Interface rendering and design token presentation.
- User Interaction handling and event dispatching.
- View State management (transient UI states, modal visibility).
- Component Composition and layout structures.
- Data Presentation (rendering system scores, optimization lists).

React must **NEVER** contain:

- Windows-specific OS logic or Win32 API calls.
- Heavy business logic or raw registry parsing.
- Direct Registry operations or shell script executions.
- Native system operations (RAM flushing, process termination).
- Performance-critical backend computations.

> 🛑 **RESPONSIBILITY BOUNDARY:**
> All system integration, business logic, registry execution, and native OS operations belong strictly to the Electron Main Process (Node.js).

---

# Component Design

Every React component must have a **single responsibility** (Single Responsibility Principle):

- Keep components **small, reusable, predictable, independent**, and easy to test.
- Move asynchronous data fetching, local persistence, or IPC communication into custom hooks or utility services.
- **Avoid large "god components"** (>200 lines of presentational code).

---

# Component Composition

- **Prefer Composition over Inheritance:** Build complex UI interfaces by composing small, atomic presentational building blocks.
- **Split Complex Interfaces:** Deconstruct complex cards or panels into atomic sub-components (e.g. `SystemScoreCard` → `ScoreMeter`, `ScoreBadge`, `ScoreAction`).
- **Avoid Deeply Nested Component Trees:** Keep layout depth shallow (maximum 3-4 component levels deep).

---

# State Management

- **Keep State Local:** Store state as close as possible to where it is consumed.
- **Lift State Only When Necessary:** Lift state to parent containers or Context stores strictly when multiple sibling views require access.
- **Avoid Duplicated State:** Never synchronize derived data into separate state primitives.
- **Avoid Derived State:** Compute values dynamically during render or memoize expensive computations via `useMemo`.
- **Global State Boundaries:** `SettingsContext` and global stores should contain strictly application-wide data (e.g., applied optimization IDs, active category routes, app settings).

---

# Props

Props passed to React components should be:

- **Typed:** Strongly typed with explicit TypeScript interfaces.
- **Minimal:** Pass only necessary data primitives or specific handler functions.
- **Explicit:** Explicitly named properties avoiding vague `[key: string]: any` catch-alls.
- **Immutable:** Never mutate props inside child components.

*Avoid passing unnecessary props down multiple layers (prop drilling); use composition or React Context.*

---

# Hooks

Use React 19 Hooks consistently and predictably:

- Custom hooks must encapsulate reusable stateful or side-effect logic.
- Custom hooks must have a single clear responsibility (e.g. `useSystemStatus`, `useCategorySettings`).
- Custom hooks must be independently reusable across components.
- **Hook Naming:** All custom hooks **MUST** begin with the prefix **`use`** followed by `PascalCase` (e.g. `useSettings`).

---

# Rendering

Keep component rendering fast and lightweight:

- **Avoid Unnecessary Re-renders:** Isolate presentational components to prevent root-level re-rendering cascades.
- **Avoid Expensive Computations in Render:** Move heavy data transformations outside the component body or wrap them in `useMemo`.
- **Avoid Large Inline Objects & Functions:** Avoid instantiating un-memoized object literals or inline arrow functions inside critical render loops.
- **Intentional Memoization:** Use `React.memo()`, `useMemo()`, and `useCallback()` when concrete profiler evidence demonstrates performance benefits.

---

# Effects

- `useEffect` must be used **ONLY** to synchronize components with external systems (e.g. Electron ContextBridge IPC events, `localStorage` synchronization, window resize listeners).
- Avoid using `useEffect` for internal business logic or derived state computations.
- Keep dependency arrays 100% accurate and explicit; never suppress lint warnings with `// eslint-disable-next-line`.
- **Always clean up:** Return explicit cleanup functions to dispose of event listeners, timers (`clearInterval`), and subscriptions on unmount.

---

# Performance

Optimize React code for:

- Sub-200ms visual interaction feedback.
- Instant, non-blocking UI response to user input.
- Locked 60 FPS visual rendering and route transitions.
- Lazy route loading (`React.lazy()` + `<Suspense>`) for dynamic view routes.
- Efficient, batched state updates.

*Do not optimize prematurely. Base optimizations on empirical React Profiler data.*

---

# TypeScript

Enforce strict type safety (`strict: true`) across all React code:

- ❌ **Forbidden:** `any` type casting, `as any` overrides, or un-typed `unknown` workarounds.
- ❌ **Forbidden:** Unsafe non-null assertions (`!`) on optional data structures.
- ✅ **Required:** Explicit interface contracts for component props, custom hook return tuples, and Context state objects.

*Prefer explicit, reusable TypeScript interfaces over inline type definitions.*

---

# Error Handling

React 19 components must fail gracefully and safely:

- Wrap top-level routes and features in **React Error Boundaries** to catch runtime exceptions.
- Explicitly handle and present **Loading States**, **Empty States**, and **Error States**.
- Present clean, non-technical, gamer-friendly Turkish notices to users upon IPC or state failures.
- Never allow unhandled JavaScript runtime exceptions to cause white screen crashes.

---

# Folder Organization

Keep React source code organized cleanly under `src/` by responsibility:

- `src/components/`: Reusable presentational components and category cards.
- `src/hooks/`: Custom React hooks encapsulating state and IPC logic.
- `src/context/`: React Context providers for global application state.
- `src/types/`: Centralized TypeScript interfaces and type definitions.
- `src/services/`: Client-side services (Firebase, SystemEngine, localStorage bridges).
- `src/utils/`: Pure helper functions and regex sanitizers.

*Avoid mixing presentational JSX with raw IPC transport or utility logic.*

---

# Styling

- Utilize **Tailwind CSS v4** for all UI styling.
- Prefer reusable utility patterns and design tokens defined in `RULES/design_rules.md`.
- Avoid writing excessive custom CSS rules in `index.css`.
- Maintain strictly uniform spacing, sizing, padding, and typography scales across all components.

---

# Accessibility

Every React UI component must support:

- Full **Keyboard Navigation** (tab order, Enter/Space key triggers).
- Visible **Focus Management** (`focus:ring-2 focus:ring-[#1a5efd]`) for active elements.
- Semantic HTML tags (`<button>`, `<main>`, `<nav>`, `<article>`, `<header>`).
- Respect for "Düşük Kalite Modu" (Reduce Motion) by disabling heavy motion transitions.

*Accessibility is a core engineering requirement, not an optional extra.*

---

# Testing

React components and hooks should be structured for effortless automated testing:

- Favor pure functional presentational components with predictable inputs and outputs.
- Avoid hidden side effects or un-mockable global variables.
- Structure custom hooks to be testable via `renderHook()` from `@testing-library/react-hooks`.

---

# Things Never Allowed

The following practices are **STRICTLY FORBIDDEN** in LUPER React development:

- ❌ Placing business logic, Win32 calls, or Regedit code inside React components.
- ❌ Using `any` type casting or `as any` overrides.
- ❌ Creating oversized, monolithic "god components" (>200 lines).
- ❌ Duplicating state primitives or maintaining synchronized parallel states.
- ❌ Mutating props or direct DOM state manipulation outside React control.
- ❌ Ignoring cleanup functions in `useEffect` hooks.
- ❌ Mixing React presentational responsibilities with Electron main process execution duties.

---

# Definition of Done

A React implementation is considered **DONE** and ready for release only if it is:

- ✅ **Modular:** Atomic presentational components driven by clean props.
- ✅ **Typed:** 100% type-safe (`strict: true`, zero `any`).
- ✅ **Reusable:** Designed to be shared across views without ad-hoc overrides.
- ✅ **Accessible:** Keyboard tab support, visible focus rings, semantic HTML.
- ✅ **Performant:** Sub-200ms visual interaction feedback, zero unnecessary re-renders.
- ✅ **Maintainable:** Clean, readable, and well-structured.
- ✅ **Consistent:** Fully aligned with LUPER design system tokens.
- ✅ **Aligned with LUPER Architecture:** Compliant with `AGENTS.md` and `RULES/react_rules.md`.
