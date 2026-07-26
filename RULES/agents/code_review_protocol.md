# Code Review Protocol

# Purpose
Establishes a mandatory, rigorous Code Review Protocol that every AI agent must follow before any code change, feature implementation, refactoring, or documentation update is approved or considered complete within the LUPER platform repository.

# Review Principles
1. **Zero Unverified Commits:** No code may be marked complete without passing local build verification (`node --check` and `npm run build`).
2. **Quality Gate Compliance:** 100% adherence to all 5 Quality Gates and project governance rules in `RULES/`.
3. **Strict Domain Ownership:** Code changes must be reviewed and approved by designated domain owners per `file_ownership_matrix.md`.
4. **Security & Performance First:** Security vulnerabilities or UI performance regressions (<60 FPS, >150MB RAM) automatically trigger rejection.

# Review Roles
- **Author:** The executing subagent that implements the feature, refactor, or fix. Responsible for local self-verification and submitting clean diffs.
- **Reviewer:** Specialist agents (Security Agent, Performance Engineer, IPC Architect, etc.) who inspect code diffs for compliance with rules and quality standards.
- **Approver:** Architect Agent, Critic Agent, or Lead Orchestrator who grants final sign-off for task completion and merging.

# Review Scope
Review requirements are enforced across all 10 core technical areas:

- **Architecture:** Clean Architecture layer separation, SOLID principles, and alignment with `docs/adr/`.
- **Electron:** `BrowserWindow` state management, `main.js` lifecycle hooks, and single-instance locks.
- **React:** React 19 functional components, proper hooks usage, and memoization (`useMemo`, `useCallback`, `React.memo`).
- **TypeScript:** Strict type compliance (`strict: true`), zero `any` casting, and explicit interface definitions.
- **IPC:** Preload ContextBridge isolation, asynchronous `invoke`/`handle` patterns, and whitelisted channel contracts.
- **Windows Integration:** Win32 API handles, in-memory Base64 PowerShell stdin streams, and UAC elevation checks.
- **Performance:** Sustained 60 FPS UI rendering, idle RAM <= 120MB, window startup < 200ms, sub-5ms Win32 calls.
- **Security:** Input regex sanitization, AMSI false-positive prevention, CSP rules, zero client AI leakage.
- **Documentation:** Natural Turkish user text, GFM Markdown formatting, updated sitemaps, zero broken links.
- **Tests:** 80%+ unit test coverage on core services, complete IPC boundary mocking, zero flaky test assertions.

# Mandatory Review Checklist
Every code review must explicitly verify the following 14 items:

- [ ] **Coding standards:** TypeScript `strict: true`, zero `any` casting, React 19 memoization applied.
- [ ] **Naming consistency:** PascalCase components/types, camelCase hooks/services, kebab-case IPC channels.
- [ ] **Architecture compliance:** Layer boundaries respected; zero direct Renderer-to-Node bypasses.
- [ ] **RULES compliance:** 100% alignment with all rule specifications in `RULES/`.
- [ ] **ADR compliance:** Architecture decisions documented and matched in `docs/adr/`.
- [ ] **Documentation updates:** `README.md`, `AGENTS.md`, Turkish UI tooltips, and Markdown guides updated.
- [ ] **Error handling:** Asynchronous try/catch blocks, zero white-screen UI crashes, friendly Turkish notices.
- [ ] **Logging:** Non-blocking JSON log stream with privacy sanitization and 10MB log rotation.
- [ ] **Security validation:** Strict regex input sanitization, ContextBridge channel whitelisting, AMSI safety.
- [ ] **Performance impact:** Sustained 60 FPS rendering, idle RAM <= 120MB, bundle size <= 15MB.
- [ ] **Backward compatibility:** Backwards-compatible state hydration fallbacks and IPC signatures.
- [ ] **Dead code:** Zero unused variables, unreferenced imports, or commented-out code blocks.
- [ ] **Duplicate logic:** DRY principle enforced; reusable helpers extracted to `src/utils/` or `src/hooks/`.
- [ ] **Dependency validation:** Zero unvetted npm packages or user-facing AI model SDKs added.

# Review Outcomes
Every code review yields exactly one of four formal outcomes:

- **Approved:** Deliverable satisfies all 14 checklist items and 5 Quality Gates cleanly. Ready for sign-off.
- **Approved with Changes:** Minor formatting or documentation tweaks required; author completes minor edits without full re-review.
- **Changes Required:** Deficiencies found in syntax, type safety, memoization, or error handling. Author must refactor and resubmit.
- **Rejected:** Critical security vulnerability, process isolation breach, or severe performance regression (<60 FPS, >150MB RAM). Execution halted immediately.

# Blocking Conditions
The following conditions AUTOMATICALLY BLOCK approval and require immediate author refactoring:

1. Failing local build checks (`node --check electron/main.js` or `npm run build` throws errors).
2. Presence of `any` type casting or implicit coercions in TypeScript code.
3. IPC ContextBridge channel whitelist bypass or synchronous IPC invocations (`ipcRenderer.sendSync`).
4. Dropping temporary `.ps1` files to disk (PowerShell MUST execute via Base64 UTF-16LE stdin streams).
5. User-facing AI models, API keys, or cloud LLM SDK dependencies added to client application.
6. Displaying raw technical error codes (e.g. `ENOENT`, `0x80070005`) to end-users instead of natural Turkish text.

# Merge Requirements
Before any task diff or feature branch may be merged into the main repository branch:

1. **Local Build Verification:** Executed `node --check electron/main.js` and `npm run build` with 0 errors.
2. **Review Chain Pass:** Completed all 4 steps of the Mandatory Review Chain (Self-Verification ➔ Security/IPC Audit ➔ Quality Gate Review ➔ Orchestrator Sign-off).
3. **Persisted Learnings:** All technical lessons, edge cases, or CLI constraints learned during execution written to `RULES/`.
4. **Model Identification:** Task completion report explicitly states AI Model and Tier utilized.

# Related Documents
- [definition_of_done.md](definition_of_done.md)
- [common_agent_standards.md](common_agent_standards.md)
- [agent_collaboration_protocol.md](agent_collaboration_protocol.md)
- [ai_decision_framework.md](ai_decision_framework.md)
- [file_ownership_matrix.md](file_ownership_matrix.md)
- [AGENTS.md](../../AGENTS.md)
