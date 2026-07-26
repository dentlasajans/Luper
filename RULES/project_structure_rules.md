# LUPER Permanent Project Structure Standards (`RULES/project_structure_rules.md`)

This document defines the permanent project structure, module organization, folder hierarchy, and architectural boundaries for the entire **LUPER** repository (Commercial Windows Desktop Optimization & Performance Platform built with Electron, Node.js, React 19, TypeScript, and Tailwind CSS v4).

Every AI agent and software engineer working on LUPER must strictly follow these rules.

---

# Purpose

Define a scalable, maintainable, predictable, and clean project structure for LUPER.

As the product grows in commercial scope, the project directory organization must remain structured, easy to navigate, and resistant to architectural debt. In LUPER, folder organization is considered a core element of the software architecture.

---

# Architecture Philosophy

LUPER follows a clean, modular architecture.

Every directory and code module must exhibit:

- **Single Responsibility:** Group closely related code for one clear purpose.
- **Clear Ownership:** Explicit assignment to a specific domain (Frontend, Backend, Shared, Config).
- **Explicit Dependencies:** Clear, non-circular imports flowing inward.
- **Minimal Coupling:** Decoupled components interacting strictly via typed interfaces.
- **High Cohesion:** Closely related logic kept together in dedicated feature folders.

---

# Project Organization

Separate the repository into clean, logical, decoupled layers:

- **`src/`:** React 19 / TypeScript Frontend Layer
- **`electron/`:** Electron Main Process, Preload IPC Bridge, and Node.js Win32 Execution Layer
- **`RULES/`:** AI Team Governance & Technical Specifications
- **`docs/adr/`:** Architecture Decision Records
- **Shared Models:** Strongly typed interfaces mapped across IPC (`src/types/`)
- **Engines:** Service bridges and background execution engines (`src/services/SystemEngine.ts`)
- **Components:** Presentational React UI components (`src/components/`)
- **Services:** External API, Firebase, local storage, and AI services (`src/services/`)
- **Utilities:** Pure helper functions and regex sanitizers
- **Assets:** Public icons, images, and static resources (`public/`, `src/assets/`)
- **Configuration:** Centralized `package.json`, `tsconfig.json`, `vite.config.ts`
- **Documentation:** Turkish user guides, release notes, and `README.md` files

*Never mix responsibilities between layers.*

---

# Folder Structure

Directory trees across the repository must:

- Represent exactly one self-contained concept.
- Maintain clear domain responsibilities.
- Avoid deep nesting (maximum 3-4 levels deep).
- Be easy for developers and AI agents to navigate via standard tools.
- Remain scalable for future module additions.
