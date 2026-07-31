# LUPER Permanent Component Architecture Standards (`RULES/component_rules.md`)

This document defines the permanent React 19 component design, composition, styling, and prop contract standards for **LUPER** (Commercial Windows Desktop Optimization & Performance Platform built with Electron, Node.js, React 19, TypeScript, and Tailwind CSS v4).

Every AI agent and frontend software engineer working on LUPER must strictly follow these rules.

---

# Purpose

Define a consistent, reusable, maintainable, type-safe, and scalable component architecture for LUPER.

Presentational components are the core building blocks of the application's user interface. Every component across the repository must strictly follow a unified design philosophy and structural standard.

---

# Core Philosophy

Every presentational component in LUPER must exhibit:

- **A Single Responsibility:** Solve strictly one presentational problem.
- **A Clear Purpose:** Self-explanatory interface and functional boundary.
- **A Predictable API:** Explicit, strongly-typed prop contracts.
- **Strong Typing:** 100% strict TypeScript types (`strict: true`, zero `any`).
- **High Reusability:** Modular blocks designed to be shared across views.
- **Minimal Dependencies:** Decoupled from hardcoded business data or IPC transport layers.

*Components must be easy to understand, test, extend, and inspect.*

---

# Component Classification

Organize UI presentational components into distinct, logical categories:

- **UI Components (`src/components/common/`):** Base buttons, toggles, badges, card containers, inputs.
- **Layout Components (`src/components/`):** Sidebar, Layout wrapper, Header, Grid structures.
- **Feature Components (`src/components/<feature>/`):** SystemScoreCard, CpuCard, GamesTools, StartupTools.
- **Shared Components:** Shared card blocks, score meters, status progress bars.
- **Dialog Components (`src/components/modals/`):** Confirmation modals, backup restore dialogs, changelog.
- **Form Components:** Toggle switches, input controls, select dropdowns, search bars.
- **Navigation Components:** Floating sidebar navigation items, breadcrumbs, tab bars.

*Do not mix responsibilities across categories.*

---

# Single Responsibility

Each component must solve **strictly one problem**:

- If a component grows complex or difficult to understand, decompose it immediately into smaller sub-components.
- Separate UI layout logic from custom hook state management.

---

# Component Size

- **Prefer small components:** Keep component files focused and concise (target <150-200 lines).
- Decompose large monolithic components into clean, logical child components.
- **Avoid monolithic UI files** that attempt to render an entire page or complex form in a single file.

---

# Props

Props passed to React components must be:

- **Typed:** Strongly typed using explicit TypeScript interfaces (`interface ComponentProps { ... }`).
- **Minimal:** Pass only necessary data primitives or specific event handler functions.
- **Explicit:** Avoid vague `[key: string]: any` catch-alls.
- **Immutable:** Never attempt to mutate prop objects inside child components.
- **Well Documented:** Clear parameter descriptions for complex prop handlers.

*Avoid unnecessary prop drilling; utilize React Context or component composition.*

---

# Composition

- **Prefer Composition over Inheritance:** Build complex interfaces by composing atomic building blocks.
- **Create Reusable Building Blocks:** Design cards to accept `children`, `headerActions`, or `footerControls`.
- **Favor Flexibility over Duplication:** Avoid duplicating component code to make minor visual tweaks.

---

# State

- Keep component state **local** whenever possible.
- Avoid duplicated state primitives or maintaining synchronized parallel states.
- **Do not store derived values unnecessarily:** Compute derived data during render or memoize via `useMemo`.

---

# Styling

- Exclusively use **Tailwind CSS v4** for component styling.
- Maintain strictly uniform design tokens (`RULES/design_rules.md`):
  - **Spacing:** Standard 4px grid scale (`gap-4`, `p-5`, `space-y-3`).
  - **Typography:** Standard font weights and sizes (`text-sm`, `text-lg`, `font-semibold`).
  - **Border Radius:** `rounded-xl` for cards, `rounded-lg` for buttons/inputs, `rounded-2xl` for modals.
  - **Colors:** Deep Anthracite (`#121214`), Koyu Antrasit (`#18181c`), Luper Sapphire Blue (`#1a5efd`).
  - **Animations:** Subtle 150-250ms `easeOut` transitions.

*Avoid inline `style={{ ... }}` attributes unless dynamically computing canvas or positional values.*

---

# Accessibility

Every presentational component must support:

- Full **Keyboard Navigation** (tab order, Enter/Space key triggers).
- Visible **Focus Visibility** (`focus:ring-2 focus:ring-[#1a5efd]`).
- **Semantic HTML** (`<button>`, `<header>`, `<article>`, `<nav>`, `<main>`).
- Appropriate **ARIA attributes** (`aria-expanded`, `aria-label`, `aria-checked`) when required.

> 🛑 **ACCESSIBILITY MANDATE:**
> Accessibility is a mandatory engineering requirement for all LUPER components.

---

# Performance

Components must:

- Avoid unnecessary re-renders (wrap pure presentational blocks in `React.memo()`).
- Minimize expensive calculations inside render loops.
- Render efficiently with sub-200ms visual interaction feedback.
- Support dynamic lazy loading (`React.lazy()`) where appropriate.

*Optimize based on empirical React Profiler metrics.*

---

# Reusability

Before creating a new UI component:

1. **Check Existing Componentry:** Search `src/components/` for pre-existing UI elements.
2. **Extend Existing Components:** Add clean, optional prop variants to pre-existing components when appropriate.
3. **Avoid Duplication:** Never create duplicate or parallel visual components.

---

# Testing

Components must be designed for effortless automated testing:

- Keep inputs (props) and outputs (callbacks/DOM nodes) completely predictable.
- Avoid hidden side effects or un-mockable global window mutations.

---

# Documentation

Reusable UI components must clearly document:

- **Purpose:** Summary of what the visual component presents.
- **Props:** TypeScript interface describing all input parameters.
- **Expected Behavior:** Description of interaction states (hover, focus, active, disabled).
- **Usage Examples:** Short code snippet demonstrating implementation.

---

# Things Never Allowed

The following practices are **STRICTLY FORBIDDEN** in LUPER component development:

- ❌ Mixing business logic, IPC calls, or Win32 execution code into UI components.
- ❌ Mutating props inside child components.
- ❌ Creating duplicate or parallel UI components.
- ❌ Creating oversized monolithic UI files (>200 lines).
- ❌ Ignoring keyboard focus ring accessibility or semantic HTML.
- ❌ Hardcoding reusable color values or arbitrary pixel spacing (`p-[13px]`).
- ❌ Introducing unnecessary technical complexity.

---

# Definition of Done

A component implementation is considered **DONE** and ready for release only if it is:

- ✅ **Reusable:** Modular, decoupled presentational block.
- ✅ **Modular:** Single-purpose, cleanly structured under `src/components/`.
- ✅ **Typed:** 100% strict TypeScript types (`strict: true`, zero `any`).
- ✅ **Accessible:** Keyboard tab support, visible focus rings, semantic HTML.
- ✅ **Maintainable:** Clean, readable, well-commented code.
- ✅ **Testable:** Predictable prop inputs and DOM outputs.
- ✅ **Consistent:** Strictly matched with LUPER design system tokens.
- ✅ **Fully Aligned with LUPER Component Architecture:** Compliant with `AGENTS.md` and `RULES/component_rules.md`.
