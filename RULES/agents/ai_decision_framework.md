# AI Decision Framework

# Purpose
Establishes a mandatory, unified decision framework that every AI agent must follow before making, proposing, reviewing, or implementing any technical, architectural, or procedural decisions across the LUPER platform.

# Decision Principles
1. **Evidence-Based Choices:** Every decision must be justified by concrete log data, empirical benchmarks, or official project rules.
2. **Zero Guesswork:** Never assume unstated requirements or infer unvetted Windows OS registry tweaks.
3. **Least Privilege & Isolation:** Prioritize process boundary isolation (`contextIsolation: true`, `sandbox: true`) over implementation shortcuts.
4. **Offline-First Guarantee:** Reject decisions that introduce remote server dependencies, cloud locks, or external API keys.

# Decision Priority Order
Whenever trade-offs or competing requirements arise, agents MUST evaluate choices according to the strict 6-tier Decision Priority Order:

1. **Security:** Hardened process isolation, input regex sanitization, AMSI safety, contextBridge channel whitelisting, zero client AI leakage.
2. **Stability:** Exception handling, atomic file writes, crash resilience, automatic state rollback triggers.
3. **Performance:** 60 FPS UI rendering, idle RAM <= 120MB, window creation < 200ms, sub-5ms Win32 API calls.
4. **Maintainability:** Clean Architecture layer separation, strict TypeScript (`strict: true`), zero `any` casting, clean GFM Markdown docs.
5. **Scalability:** Modular IPC channels, offline JSON database schemas (`src/data/`), extensible plugin API sandboxes (`src/types/plugin.ts`).
6. **Developer Experience:** Clear subagent delegation protocols, predictable build commands, automated syntax verification checks.

# Evidence Requirements
- No diagnostic or architectural decision may be finalized without inspectable evidence.
- Log tracebacks, local build test results (`node --check`, `npm run build`), or empirical benchmark deltas MUST be gathered prior to marking decisions as approved.

# Architecture Consistency
- Decisions must strictly align with Clean Architecture layers (Main Process ➔ Preload ContextBridge ➔ React Renderer).
- Architectural alterations must be documented as Architecture Decision Records in `docs/adr/` following `ADR-TEMPLATE.md`.

# Performance First Policy
- Any design or component decision that reduces UI frame rates below 60 FPS or increases idle RAM above 150MB MUST be rejected or escalated to the Performance Engineer.
- Asynchronous non-blocking I/O is mandatory for all disk and native API interactions.

# Security First Policy
- Any change compromising Electron `contextIsolation`, `sandbox`, or exposing raw `child_process` methods in preload scripts is strictly forbidden.
- Security Agent holds absolute veto power over any decision violating security standards.

# Maintainability Rules
- Prefer clean, decoupled React 19 functional components and typed custom hooks over complex global state hacks.
- All code edits must preserve TypeScript `strict: true` compliance with zero `any` type casting.

# Scalability Rules
- Ensure data structures and IPC payload contracts support future category expansions without breaking schema backwards compatibility.
- Use explicit versioning flags in JSON database schemas (`src/data/`).

# Simplicity Rules
- Choose the simplest architectural solution that satisfies requirements without over-engineering.
- Avoid introducing third-party npm dependencies when native Node.js or Win32 APIs suffice.

# Backward Compatibility
- State schema modifications must include backwards-compatible hydration fallbacks.
- Existing IPC channel signatures and state stores must maintain backwards compatibility unless a formal breaking change policy is approved.

# Breaking Change Policy
- Breaking changes to IPC channels, state schemas, or core module contracts require explicit approval from the Architect Agent and Product Owner Agent.
- All breaking changes must be documented in `docs/adr/` and communicated across affected specialist agents.

# Risk Assessment
- Before implementing high-impact changes (e.g. main process refactoring or registry engine edits), agents must assess:
  - System crash risk.
  - State corruption risk.
  - Antivirus / AMSI false-positive risk.
  - UI frame drop risk.

# Decision Matrix

| Evaluation Criteria | High Priority Choice | Low Priority / Rejected Choice |
| :--- | :--- | :--- |
| **Process Security** | Preload ContextBridge whitelist | Direct `nodeIntegration: true` or wildcard IPC |
| **PowerShell Execution** | Base64 UTF-16LE in-memory stdin pipe | Dropping temporary `.ps1` files to disk |
| **State Persistence** | Atomic write to `.tmp` then rename | Direct file overwrite without atomic backup |
| **Type Checking** | Strict TypeScript interfaces (`strict: true`)| `as any` type casting workarounds |
| **UI Performance** | React 19 `useMemo` & `React.memo` | Un-memoized inline object props in render tree |

# Decision Approval Rules
- **Tier 1 (Architecture & ADRs):** Requires Architect Agent approval.
- **Tier 2 (Security & IPC Contracts):** Requires Security Agent & IPC Architect approval.
- **Tier 3 (Native OS & Shell Execution):** Requires Windows System Expert & PowerShell Specialist approval.
- **Tier 4 (UI & Styling):** Requires Design System Agent & UX Specialist approval.
- **Tier 5 (Final Release Packaging):** Requires Release Engineer & Critic Agent sign-off.

# Exception Handling
- If an emergency architectural exception is required, the agent must document the justification, evaluate risk against the Decision Priority Order, and obtain explicit sign-off from the Architect Agent.

# Rollback Decision Rules
- If an applied optimization or system modification results in a non-zero exit code or runtime fault, the agent MUST immediately trigger an automatic state rollback via State & Persistence Agent.

# Validation Before Decision
- Subagents must run local verification scripts (`node --check electron/main.js` and `npm run build`) to validate choices before submitting decisions for final review.

# Decision Checklist
- [ ] Evaluated against 6-tier Decision Priority Order (Security ➔ Stability ➔ Performance ➔ Maintainability ➔ Scalability ➔ Dev Experience).
- [ ] Confirmed Clean Architecture layer alignment and ADR requirements.
- [ ] Verified zero `any` type casting and strict TypeScript compliance.
- [ ] Confirmed local build verification passed cleanly with 0 errors.
- [ ] Verified 100% offline-first operation with 0 user-facing AI models.

# Related Documents
- [definition_of_done.md](definition_of_done.md)
- [code_review_protocol.md](code_review_protocol.md)
- [file_ownership_matrix.md](file_ownership_matrix.md)
- [agent_collaboration_protocol.md](agent_collaboration_protocol.md)
- [common_agent_standards.md](common_agent_standards.md)
- [AGENTS.md](../../AGENTS.md)
- [RULES/security_rules.md](../security_rules.md)
- [RULES/performance_rules.md](../performance_rules.md)
