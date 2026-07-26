# LUPER Permanent Feature Lifecycle Standards (`RULES/feature_rules.md`)

This document defines the permanent feature planning, evaluation, implementation, release, and lifecycle standards for the **LUPER** project.

Every AI agent and software engineer working on LUPER must follow these rules.

---

## Technology Stack

- **Windows** (Target OS Platform)
- **Electron** (Application Framework & IPC Interfaces)
- **Node.js** (Native Backend & Low-Level Feature Execution Engine)
- **React 19** (TypeScript Frontend UI & Component Views)
- **TypeScript** (Strongly Typed Feature Contracts & State Interfaces)

---

## Purpose

Define a structured, predictable, and maintainable lifecycle for every feature developed within the LUPER project.

Every feature must deliver measurable user value while preserving the application's Clean Architecture, sub-100ms startup performance, security boundaries, and long-term maintainability.

---

## Feature Philosophy

- **User-Problem Centric:** Every feature exists exclusively to solve a clearly defined, verified user problem.
- **No Novelty Features:** Features must **never** be implemented solely because they are technically interesting, trend-driven, or easy to build.
- **Product Value:** Every new feature must measurably improve the product quality, performance, or user experience.

---

## Core Principles

Every feature in LUPER must be:

- **User-focused:** Directly addressing real user needs.
- **Well defined:** Unambiguous scope and acceptance criteria.
- **Justified:** Supported by clear business or technical rationale.
- **Maintainable:** Clean Architecture alignment following SOLID principles.
- **Testable:** Accompanied by unit/integration/E2E test scenarios.
- **Documented:** Clear Turkish user guidance and technical docs.
- **Consistent:** Adhering 100% to all LUPER rule files.

---

## Feature Lifecycle

Every feature must progress sequentially through the explicit 12-stage lifecycle pipeline:

```
Proposal ──► Evaluation ──► Planning ──► Design ──► Approval ──► Implementation ──► Testing ──► Documentation ──► Release ──► Maintenance ──► Deprecation ──► Removal
```

> 🛑 **LIFECYCLE RULE:**
> No stage in the feature lifecycle pipeline may be skipped, bypassed, or rushed under any circumstances.

---

## Feature Proposal

Every proposed feature specification must explicitly define:

- **Problem Statement:** Clear description of the user problem or technical bottleneck.
- **Target Users:** Primary user personas (e.g., competitive gamers, power users, system administrators).
- **Expected Value:** Measurable benefits (e.g., "Reduces startup delay by 15ms").
- **Success Criteria:** Concrete metrics defining feature completion.
- **Scope Boundaries:** What the feature explicitly includes and excludes.
- **Constraints:** Technical boundaries (Windows 10/11 x64, zero `any`, sub-100ms startup).

*Proposals lacking a clearly documented purpose must be rejected immediately.*

---

## Evaluation

Prior to implementation approval, every feature proposal must undergo rigorous evaluation across 7 dimensions:

1. **User Value:** High impact on user experience or performance.
2. **Technical Feasibility:** Compatibility with Electron / Win32 native APIs.
3. **Architectural Impact:** Alignment with `RULES/architect_agent.md` and module boundaries.
4. **Performance Impact:** Zero degradation of startup speed (<100ms) or UI frame rate (60 FPS).
5. **Security Impact:** Principle of Least Privilege and regex sanitization compliance (`RULES/security_rules.md`).
6. **Maintenance Cost:** Long-term engineering effort to maintain code and tests.
7. **Long-Term Sustainability:** Clean abstraction without introducing technical debt.

---

## Planning

Feature planning documentation must specify:

- Concrete engineering objectives and component deliverables.
- Dependencies on existing Node.js modules or React components.
- Identified technical risks and mitigation strategies.
- Target release milestones and version targets.
- Explicit, verifiable **Acceptance Criteria**.

*Planning must eliminate ambiguity before a single line of production code is written.*

---

## Implementation

Feature implementation must strictly comply with all existing project standards:

- `RULES/project_rules.md` (Dual-Layer Persistence & Turkish UI)
- `RULES/coding_rules.md` (Strict TypeScript, React 19 memoization, zero `any`)
- `RULES/security_rules.md` (Secure IPC, input regex sanitization)
- `RULES/performance_rules.md` (Sub-100ms startup, 60 FPS UI rendering)
- `RULES/design_rules.md` & `RULES/ui_ux_rules.md` (Visuals & micro-interactions)
- `RULES/accessibility_rules.md` (Screen readers & contrast compliance)

---

## Testing

Every feature must be thoroughly verified before release:

- **Functional Correctness:** All happy path flows operating as designed.
- **Edge Cases:** Handling empty lists, missing registry keys, or lost network access.
- **Error Handling:** Returning structured `Result<T, E>` types without panics (`unwrap()` forbidden).
- **Performance Profiling:** Verifying frame render times (<16ms) and RAM footprint.
- **Security Audit:** Verifying input regex whitelists and privilege boundaries.
- **User Experience Verification:** Smooth Turkish UI feedback, micro-animations, and loading states.

---

## Documentation

Every feature release must be accompanied by synchronized documentation:

- **Technical Guide:** Module architecture, IPC channel signatures, and state schemas.
- **User Guidance:** Clear, non-technical Turkish tooltips and help documentation.
- **Configuration Specs:** Settings parameters, default values, and range limits.
- **Dependencies & Limitations:** Hardware or Windows build prerequisites.

---

## Release Readiness

Before a feature can be marked ready for release, the **Product Owner Agent** and **Critic Agent** must verify:

- All functional requirements and acceptance criteria are 100% satisfied.
- Technical and user documentation is complete and verified.
- Automated unit and integration test suites pass with zero failures.
- Performance metrics confirm sub-100ms cold startup and 60 FPS UI rendering.
- Security audit confirms zero unsanitized inputs or privilege leaks.

---

## Feature Evolution

As features evolve over time:

- Changes must remain backward-compatible whenever practical.
- Any API schema modifications must be documented in migration guides (`RULES/migration_rules.md`).
- Refactoring must be formally reviewed and versioned (`RULES/review_rules.md`).
- Breaking changes must be clearly communicated to users in release notes.

---

## Deprecation

When a feature is slated for deprecation:

- Document the deprecation rationale in release notes and technical guides.
- Display non-intrusive Turkish UI warnings to users explaining the planned deprecation.
- Provide clear migration guidance or alternative feature recommendations.
- Define a formal removal timeline across version milestones (e.g., deprecated in v2.1, removed in v3.0).

---

## Removal

When removing a feature:

- Provide formal technical justification in an Architecture Decision Record (ADR).
- Document the removal in version release notes.
- Preserve user configuration data and presets whenever possible.
- Update all affected codebase files, IPC channels, and documentation files to prevent dead code.

---

## Things Never Allowed

**NEVER:**

- ❌ Implement undocumented, un-evaluated, or informal "skunkworks" features.
- ❌ Skip planning or jump straight to coding without approved specs.
- ❌ Ignore negative architectural, security, or performance impacts.
- ❌ Ship untested features or bypass quality gate verifications.
- ❌ Leave undocumented feature flags or hidden background behaviors.
- ❌ Remove or deprecate features without documented justification and timelines.

---

## Definition of Done

A feature implementation is considered **DONE** only if it is:

- ✅ **Valuable:** Solves a documented, verified user problem.
- ✅ **Well Planned:** Built from approved specifications and acceptance criteria.
- ✅ **Correctly Implemented:** Clean Architecture code complying with all `RULES/*.md`.
- ✅ **Fully Tested:** 100% test scenario passes with zero regressions.
- ✅ **Secure:** Input sanitization and privilege boundaries enforced.
- ✅ **Documented:** Clear Turkish user guidance and developer guides.
- ✅ **Maintainable:** Decoupled, modular, and technical-debt free.
- ✅ **Fully Aligned with LUPER Standards:** Compliant with `AGENTS.md` and `RULES/feature_rules.md`.

*This document defines the permanent feature lifecycle standards for the LUPER project.*
