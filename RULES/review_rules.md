# LUPER Permanent Engineering Review Standards (`RULES/review_rules.md`)

This document defines the permanent engineering review standards, code audit criteria, and quality assurance workflows for the **LUPER** project.

Every AI agent (including the Critic Agent) and software engineer working on LUPER must follow these rules.

---

## Technology Stack

- **Windows** (Target OS Platform)
- **Electron** (Application Framework & IPC Gateways)
- **Node.js** (Native Backend & Core Main Process Systems)
- **React 19** (TypeScript Frontend UI Framework)
- **TypeScript** (Strongly Typed Application Architecture)

---

## Purpose

Define a consistent, objective, and high-quality review process for every engineering artifact produced within the LUPER project.

Every implementation, bug fix, feature, or refactor must be thoroughly reviewed before being considered complete.

Reviews exist to improve code quality, maintainability, visual consistency, and long-term application reliability.

---

## Review Philosophy

- **Quality Assurance Process:** Reviews are a collaborative quality assurance process, not a personal critique of the author.
- **Goals of Review:** Every review should improve code quality, detect hidden risks, ensure rule consistency, prevent technical debt, and protect core software architecture.
- **Evidence-Based Decisions:** Review decisions must always be evidence-based, backed by explicit log traces, code inspections, or rule specifications.

---

## Review Scope

Review standards apply to all project artifacts:

- Source Code (TypeScript, React 19 JSX/TSX, Node.js)
- Architecture & Module Structure
- User Interface (UI) Design & Styling
- User Experience (UX) & Micro-interactions
- Technical Documentation & User Tooltips
- Application Configuration (`package.json`, `tsconfig.json`, Electron build configs)
- Build & CI/CD Pipeline Configurations
- Distribution & Installer Release Configurations
- Security Policies & Privilege Boundary Changes
- Performance Profiling & Optimization Metrics
- AI-generated Code, Shell Commands, & Documentation

---

## Core Review Principles

Every review must rigorously evaluate artifacts against 10 core dimensions:

1. **Correctness:** Free of logical bugs, race conditions, or unhandled exceptions.
2. **Readability:** Clean structure, self-describing identifiers, zero clutter.
3. **Maintainability:** Modular, decoupled architecture following SOLID principles.
4. **Simplicity:** Elegant, simple solutions without over-engineering.
5. **Consistency:** Absolute adherence to LUPER naming and style conventions.
6. **Reliability:** Graceful error handling without crashes (`unwrap()` / `expect()` forbidden).
7. **Testability:** Clear unit/integration test pathways and verifiable behaviors.
8. **Performance:** Sub-100ms startup times, 60 FPS UI rendering, zero memory leaks.
9. **Security:** Input regex sanitization, privilege separation, least privilege.
10. **Accessibility:** Screen-reader support, contrast compliance, keyboard navigation.

---

## Architecture Review

Architecture reviews must verify:

- Full compliance with `RULES/architect_agent.md` and LUPER Clean Architecture guidelines.
- Proper separation of concerns across UI, IPC, Node.js main process, and Win32 layer.
- Correct module boundaries and strict dependency direction (inner layers must not depend on outer layers).
- Scalability for future plugin or feature extensions.
- Long-term maintainability without architectural debt.

> 🛑 **ARCHITECTURE RULE:**
> Architectural integrity takes absolute priority over temporary implementation convenience.

---

## Code Review

Every code review must verify:

- Strict naming consistency according to `RULES/naming_rules.md`.
- Full compliance with `RULES/coding_rules.md` (TypeScript `strict: true`, React 19 memoization, zero `any`).
- Robust error handling returning structured response types.
- Structured, non-sensitive logging for developer diagnostics.
- Efficient resource management (memory cleanup in Node.js, cleanup hooks in React).
- Explicit edge-case handling (null checks, empty arrays, missing registry values).

---

## Security Review

Security reviews must verify:

- Strict enforcement of the **Principle of Least Privilege**.
- Secure defaults for all configuration parameters and IPC channels.
- Comprehensive input sanitization against regex whitelists.
- Secure output sanitization preventing raw system detail leakage.
- Zero hardcoded secrets, tokens, or credentials.
- Protection against unauthorized privilege elevation or AMSI/antivirus false positives.
- Reduction of the application attack surface.

---

## Performance Review

Performance reviews must evaluate:

- **Startup Performance:** Sub-100ms cold startup targets.
- **Runtime Efficiency:** Sub-16ms frame render times (60 FPS minimum).
- **Memory Usage:** Zero memory leaks or dangling event listeners.
- **CPU Usage:** Zero idle thread spinning or excessive polling loops.
- **Rendering Performance:** Zero unnecessary React re-renders (`React.memo`, `useCallback`).
- **Resource Allocations:** Elimination of unnecessary memory allocations or string copies.
- **Non-blocking Operations:** Zero blocking synchronous Win32/I-O calls on the main thread.

*Performance regressions must be identified and resolved before release approval.*

---

## UI/UX Review

UI/UX reviews must verify:

- Visual consistency with Luper Sapphire Blue (`#1a5efd`) and anthracite dark mode (`#121214`).
- Strict compliance with `RULES/design_rules.md` and `RULES/ui_ux_rules.md`.
- High accessibility standards (contrast ratios, readable typography).
- Responsive layout behavior across window resizes.
- Smooth user feedback (micro-interactions, loading skeletons, clear status badges).
- Interaction consistency matching macOS Sequoia / Fluent Design standards.

---

## Documentation Review

Documentation artifacts must be verified to be:

- **Accurate:** Reflecting exact codebase reality and API signatures.
- **Up to date:** Synchronized with the latest features and breaking changes.
- **Complete:** Covering parameters, return types, error states, and permissions.
- **Consistent:** Written in clean, gamer-friendly Turkish for end-users.
- **Easy to understand:** Free of jargon or ambiguous technical shorthand.

---

## AI-generated Content Review

Every AI-generated code change, script, or documentation artifact **must be reviewed** by the Critic Agent or lead developer before acceptance.

Review must verify:

- Logical correctness and absence of hallucinated APIs or invalid imports.
- 100% compliance with all `RULES/*.md` specification files.
- Security and input sanitization bounds.
- Maintainability and zero introduction of technical debt.
- Structural alignment with existing codebase patterns.

> 🛑 **AI REVIEW GUARANTEE:**
> AI-generated output must **never** be accepted solely because it was generated automatically.

---

## Review Outcomes

Every engineering review must conclude with one of the following explicit verdicts:

- **APPROVED:** Artifact meets 100% of quality, security, performance, and architecture rules. Ready for merge/release.
- **APPROVED WITH MINOR CHANGES:** Minor cosmetic or comment tweaks required; no architectural or logic re-review needed.
- **CHANGES REQUIRED:** Critical flaws, rule violations, or performance regressions detected. Must be fixed and re-reviewed.
- **REJECTED:** Major architectural violations, severe security vulnerabilities, or un-remediable flaws. Artifact discarded.

*Every rejected or changes-required review must include a clear, itemized technical explanation.*

---

## Documentation

The engineering team must maintain documentation detailing:

- Step-by-step review process and agent responsibilities.
- Standardized review checklist for pull requests.
- Clear approval criteria and quality gate requirements.
- Catalog of common issues, anti-patterns, and prevention steps.

---

## Things Never Allowed

**NEVER:**

- ❌ Approve unreviewed or unverified code implementations.
- ❌ Ignore architectural rule violations for deadline convenience.
- ❌ Ignore security vulnerabilities, unsanitized inputs, or privilege escalations.
- ❌ Approve performance regressions or main-thread blocking operations.
- ❌ Approve undocumented breaking changes to IPC contracts or APIs.
- ❌ Skip code review or quality gates due to schedule pressures.

---

## Definition of Done

An engineering review process is complete only if it is:

- ✅ **Objective:** Evaluated against concrete project standards.
- ✅ **Consistent:** Uniform criteria applied to all code artifacts.
- ✅ **Repeatable:** Automated linting, build, and test verification.
- ✅ **Thorough:** Covering security, performance, UI/UX, and architecture.
- ✅ **Evidence-based:** Supported by empirical logs, traces, and code inspection.
- ✅ **Fully Aligned with LUPER Standards:** Compliant with `AGENTS.md` and `RULES/review_rules.md`.

*This document defines the permanent engineering review standards for the LUPER project.*
