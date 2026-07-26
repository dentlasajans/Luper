# LUPER Permanent Code Quality Standards (`RULES/code_quality_rules.md`)

This document defines the permanent code quality standards, engineering excellence guidelines, and production readiness criteria for the **LUPER** project.

Every AI agent and software engineer working on LUPER must follow these rules.

---

## Technology Stack

- **Windows** (Target OS Platform)
- **Electron** (Application Framework & ContextBridge IPC Bridge)
- **Node.js** (Native Main Process & Low-Level Win32 Integrations)
- **React 19** (TypeScript Frontend UI Framework)
- **TypeScript** (Strongly Typed Application Logic)

---

## Purpose

Define the minimum quality standards that every source file, module, component, and implementation must satisfy before being considered production-ready.

Code quality is a permanent engineering requirement and must never be sacrificed for development speed or short-term convenience.

---

## Code Quality Philosophy

- **Human-Centric Engineering:** Code should be written for humans first and computers second.
- **Readable & Predictable:** Every line of code should be readable, predictable, maintainable, testable, efficient, and consistent.
- **Zero Technical Compromise:** Speed is temporary; code quality and system stability are permanent.

---

## Core Principles

Every software implementation in LUPER must prioritize:

- **Simplicity:** Elegant, straightforward code over clever, obscure tricks.
- **Clarity:** Unambiguous variable naming and self-documenting logic.
- **Consistency:** Strict adherence to project architecture and style guides.
- **Correctness:** Deterministic, bug-free runtime behavior.
- **Reliability:** Graceful fault handling and zero application crashes.
- **Maintainability:** Modular separation of concerns for long-term evolution.

*Complexity must always require clear, explicit justification.*

---

## Readability

Source code in LUPER must:

- Be easy to read and understand without deep mental tracing.
- Use explicit, self-describing identifiers following `RULES/naming_rules.md`.
- Avoid unnecessary control flow nesting (max 3 levels of indentation).
- Minimize cognitive complexity by breaking large functions into single-purpose helpers.

*Readable code drastically reduces long-term maintenance costs and bug risk.*

---

## Maintainability

Code must:

- Be highly modular and adhere to Clean Architecture principles (`RULES/architect_agent.md`).
- Enforce the **Single Responsibility Principle (SRP)** per file and component.
- Avoid code duplication (**DRY Principle**).
- Encourage safe code reuse through utility abstractions.
- Be easy to modify or refactor without causing unintended side effects.

---

## Correctness

Implementations must:

- Produce deterministic, predictable execution behavior.
- Validate and handle expected inputs correctly.
- Validate invalid, malformed, or malicious inputs safely.
- Explicitly handle all edge cases (null checks, empty lists, registry key misses).
- Completely eliminate undefined behavior, race conditions, or unhandled promise rejections.

---

## Consistency

Every source file must strictly follow:

- LUPER project architecture and directory structure (`RULES/project_structure_rules.md`).
- Language coding standards (`RULES/coding_rules.md`, `RULES/react_rules.md`, `RULES/electron_rules.md`).
- Strict naming conventions (`RULES/naming_rules.md`).
- Automated formatting rules (Prettier / ESLint).
- Design system conventions (`RULES/design_rules.md`).

*Consistency is far more valuable than personal developer preference.*

---

## Performance

Code must:

- Avoid unnecessary memory allocations, deep object cloning, or redundant string copies.
- Minimize blocking synchronous operations on the main UI/thread loops.
- Avoid premature optimization while ensuring scalable algorithm design.
- Scale efficiently as dataset sizes or system capabilities grow.
- Respect system resources (CPU, RAM, disk I/O, battery life).

*Performance optimizations must not reduce readability without measurable, profiler-backed benefits.*

---

## Error Handling

Every failure path must:

- Be anticipated before implementation.
- Be handled explicitly using strongly typed error wrappers (`IPCResponse<T>`).
- Provide meaningful, non-sensitive diagnostic logs for developers.
- Preserve application stability without crashing (`unwrap()` and `expect()` forbidden).

> 🛑 **ERROR HANDLING RULE:**
> Silent failures, swallowed exceptions, or empty catch blocks are strictly unacceptable.

---

## Dependencies

Third-party dependencies must:

- Have a clear, indispensable technical purpose.
- Be actively maintained, secure, and audited against vulnerabilities.
- Minimize project complexity and footprint.
- Avoid unnecessary transitive dependencies or bloated packages.

---

## Testing

Code quality must be verified through:

- **Unit Tests:** Verifying isolated business logic, helpers, and utilities.
- **Integration Tests:** Verifying Electron ContextBridge IPC channels and Node.js main process modules.
- **End-to-End Tests:** Verifying full user flows and UI state transitions.
- **Manual Validation:** Verifying native Win32 interactions on physical Windows environments.

*Untested critical functionality must never be considered complete.*

---

## Documentation

Complex implementations must include clear inline documentation detailing:

- Technical purpose of the module or component.
- Architectural design decisions and trade-offs.
- Known hardware or OS limitations.
- Pre-conditions and operational assumptions.

*Documentation must complement code clarity rather than restate obvious logic.*

---

## Technical Debt

Technical debt must be:

- Explicitly identified during reviews.
- Documented in code comments or issue trackers with `TODO(refactor):` tags.
- Minimized at creation time.
- Scheduled for immediate resolution in upcoming sprints.

*Intentional technical debt must never be hidden or swept under the rug.*

---

## Refactoring

Refactoring efforts must:

- Improve code readability, maintainability, or performance metrics.
- Preserve 100% of existing behavior and test contracts.
- Reduce architectural complexity and technical debt.

*Behavioral changes or new feature logic must not be introduced unintentionally during refactoring.*

---

## Acceptance Criteria

Code is considered **production-ready** only if it is:

- **Correct:** 100% bug-free and deterministic.
- **Readable:** Clean, well-structured, self-describing.
- **Maintainable:** Modular, decoupled, DRY compliant.
- **Consistent:** Adhering 100% to all LUPER rule files.
- **Tested:** Covered by unit/integration tests with clean passes.
- **Documented:** Clear comments and Turkish user-facing tooltips.
- **Secure:** Input sanitization and privilege boundaries enforced.
- **Performant:** Sub-100ms startup, 60 FPS UI rendering, sub-16ms frame times.

---

## Things Never Allowed

**NEVER:**

- ❌ Commit dead code, unused functions, or unreachable branches.
- ❌ Leave commented-out production code blocks in files.
- ❌ Ignore compiler, linter, or TypeScript warnings without explicit justification.
- ❌ Duplicate business logic across frontend or backend layers.
- ❌ Introduce unnecessary abstraction layers or over-engineering.
- ❌ Sacrifice maintainability or security for short-term speed.
- ❌ Merge code that fails project quality, security, or build checks.

---

## Definition of Done

An implementation satisfies the LUPER code quality standards only if it is:

- ✅ **Readable:** Clear, clean, and cognitive-complexity checked.
- ✅ **Maintainable:** Modular Clean Architecture alignment.
- ✅ **Consistent:** Compliant with all project rule standards.
- ✅ **Correct:** Fully deterministic without runtime bugs.
- ✅ **Testable:** Accompanied by automated test coverage.
- ✅ **Efficient:** Zero main-thread blocking or memory leaks.
- ✅ **Production-ready:** Verified by build pipelines and Critic Agent review.
- ✅ **Fully Aligned with LUPER Standards:** Compliant with `AGENTS.md` and `RULES/code_quality_rules.md`.

*This document defines the permanent code quality standards for the LUPER project.*
