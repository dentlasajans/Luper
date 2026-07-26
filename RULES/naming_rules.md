# LUPER Permanent Naming Standards (`RULES/naming_rules.md`)

This document defines the permanent, non-negotiable naming conventions for the entire **LUPER** codebase (Commercial Windows Desktop Optimization & Performance Platform built with Electron, Node.js, React 19, TypeScript, and Tailwind CSS v4).

Every AI agent and software engineer working on LUPER must strictly follow these naming rules. These standards override personal naming preferences.

---

# Purpose

Establish a single, consistent naming convention across the entire LUPER codebase.

Consistent naming dramatically improves code readability, maintainability, searchability, scalability, and cross-agent collaboration. Names should clearly communicate intent without requiring additional explanation or docstrings.

---

# General Principles

Always prefer names that are:

- **Descriptive:** Explicitly communicate stored data or behavior.
- **Explicit:** Zero ambiguous or truncated terms.
- **Predictable:** Follow standardized casing rules according to file type.
- **Consistent:** Matched uniformly across all codebase modules.
- **Easy to Search:** Unique, grep-friendly terms across `src/` and `electron/`.
- **Easy to Understand:** Self-explanatory for any developer upon first inspection.

*Names should explain intent cleanly. Avoid clever, obscure, or ambiguous names.*

---

# Language

All code, identifiers, function signatures, comments, documentation, and technical file names must use **English**.

- Never mix languages in code identifiers or comments.
- User-facing text may be localized separately (LUPER uses clean Turkish for UI tooltips and end-user dialogs).

---

# Project Naming

Always use the official product name:

**`LUPER`**

Never use previous or obsolete project names (such as "Atlas", "Atlas Optimizer", etc.) under any circumstances.

---

# Variables

Variable names should accurately describe the stored data using `camelCase`.

### Good Examples:
- `userSettings`
- `networkStatus`
- `selectedGame`
- `systemHealth`
- `appliedOptimizationIds`

### Forbidden Examples:
- `data`
- `temp`
- `obj`
- `item`
- `test`
- `value`

---

# Functions

Function names should explicitly describe the action being performed using `camelCase`.

### Good Examples:
- `loadSettings()`
- `saveConfiguration()`
- `validateInput()`
- `calculateScore()`
- `flushDnsCache()`

*Avoid vague, generic function names like `process()`, `doStuff()`, or `handle()`.*

---

# Booleans

Boolean variables and properties should clearly represent a true or false condition.

### Preferred Prefixes:
- `is` (e.g. `isEnabled`, `isModalOpen`, `isReduceMotionEnabled`)
- `has` (e.g. `hasPermission`, `hasAppliedOptimizations`)
- `can` (e.g. `canExecute`, `canRestoreBackup`)
- `should` (e.g. `shouldUpdate`, `shouldAutoStart`)
- `was` (e.g. `wasCanceled`, `wasSuccessfullyRestored`)

---

# React Components

React presentational components must use **`PascalCase`**.

### Good Examples:
- `DashboardCard`
- `SettingsPanel`
- `OptimizationCard`
- `NotificationDialog`
- `SystemScoreCard`

*Each component should represent exactly one presentational concept.*

---

# Hooks

All custom React hooks must start with the prefix **`use`** followed by **`PascalCase`**.

### Good Examples:
- `useSettings`
- `useTheme`
- `useNotifications`
- `useCategorySettings`
- `useSystemStatus`

---

# Types

TypeScript interfaces and type aliases must use **`PascalCase`**.

### Good Examples:
- `UserSettings`
- `OptimizationResult`
- `NotificationOptions`
- `OptimizationCategory`

*Avoid unnecessary prefixes such as `I` (e.g. `IUserSettings`) or `T` (e.g. `TResult`).*

---

# Enums

Enums must use **`PascalCase`**. Enum member keys should be descriptive `PascalCase` identifiers.

### Good Example:
```typescript
export enum OptimizationStatus {
  Applied = 'APPLIED',
  Pending = 'PENDING',
  Failed = 'FAILED',
}
```

---

# Constants

Global constants and immutable configuration objects must use **`UPPER_SNAKE_CASE`**.

### Good Examples:
- `DEFAULT_TIMEOUT`
- `MAX_RETRIES`
- `APP_VERSION`
- `SAPPHIRE_BLUE_ACCENT`
- `ANTHRACITE_BG`

---

# Files

File naming conventions must strictly follow file types:

- **React Components:** `PascalCase.tsx` (e.g. `DashboardCard.tsx`, `Layout.tsx`)
- **Custom Hooks:** `camelCase.ts` (e.g. `useSettings.ts`, `useSystemStatus.ts`)
- **Utilities & Helpers:** `camelCase.ts` (e.g. `systemEngine.ts`, `firebaseService.ts`)
- **Types & Interfaces:** `types.ts` or `domainTypes.ts` (e.g. `optimizationTypes.ts`)
- **Constants:** `constants.ts` or `domainConstants.ts` (e.g. `colorConstants.ts`)

---

# Folders

Directory names under `src/components/`, `src/hooks/`, or `RULES/` must use **`kebab-case`** or lower-case categories:

### Good Examples:
- `settings-engine`
- `notification-center`
- `restore-center`
- `categories`
- `dashboard`

---

# CSS / Tailwind

Tailwind CSS class organization should remain consistent and structured logically:

- Group layout classes first (`flex`, `grid`, `relative`), followed by sizing (`w-full`, `h-12`), spacing (`p-4`, `gap-2`), colors (`bg-[#18181c]`, `text-white`), and interaction transitions (`hover:bg-white/[0.08] transition-all`).
- Avoid unnecessary custom CSS class overrides in `index.css`.
- Prefer reusable utility patterns defined in the design system.

---

# IDs

Interactive DOM element IDs must be:

- **Stable:** Never generated dynamically using unstable random seeds.
- **Unique:** Explicitly distinct across the DOM tree.
- **Predictable:** Follow kebab-case format.
- **Descriptive:** Explain target element purpose (e.g. `id="toggle-auto-start"`, `id="btn-apply-optimizations"`).

---

# Git Branches

Git branch names must follow structured prefixes in `kebab-case`:

### Good Examples:
- `feature/settings-engine`
- `feature/dashboard-score-card`
- `bugfix/ipc-timeout-handling`
- `refactor/theme-system`
- `release/v1.2.0`

---

# Commit Messages

Commit messages must use the **imperative mood** (e.g., "Add feature" not "Added feature"):

### Good Examples:
- `Add settings backup mechanism`
- `Fix startup tray minimize crash`
- `Improve dashboard score meter layout`
- `Refactor notification engine IPC handler`

*Avoid vague, un-descriptive commit messages like "fix", "update", or "wip".*

---

# Abbreviations

Avoid project-specific or obscure abbreviations unless universally accepted in tech:

### Acceptable Universal Abbreviations:
- `UI` (User Interface)
- `UX` (User Experience)
- `CPU` (Central Processing Unit)
- `GPU` (Graphics Processing Unit)
- `RAM` (Random Access Memory)
- `API` (Application Programming Interface)
- `IPC` (Inter-Process Communication)
- `JSON` (JavaScript Object Notation)
- `UUID` (Universally Unique Identifier)

*Avoid internal, project-specific abbreviations that confuse onboarding developers.*

---

# Things Never Allowed

The following identifiers are **STRICTLY FORBIDDEN** across LUPER:

- ❌ `tmp`, `temp`
- ❌ `test123`, `foo`, `bar`, `baz`
- ❌ `newData`, `oldData`
- ❌ `abc`, `xyz`, `a`, `b`, `c`
- ❌ `something`, `object`, `misc`
- ❌ Random, un-documented project abbreviations

---

# Definition of Done

A naming decision is considered **DONE** and compliant with LUPER standards only if it is:

- ✅ **Consistent:** Aligned with all casing rules defined in this document.
- ✅ **Descriptive:** Explains exact intent without requiring comments.
- ✅ **Predictable:** Standardized by file and variable type.
- ✅ **Searchable:** Easily searchable via grep across the codebase.
- ✅ **Maintainable:** Easy to understand for any developer.
- ✅ **Aligned with LUPER Naming Standards:** Fully compliant with `AGENTS.md` and `RULES/naming_rules.md`.
