# Definition of Done & Quality Gates

# Purpose
Establishes the mandatory completion criteria, quality gates, exit conditions, and automatic failure rules across the LUPER platform. No task, prompt, PR, or feature implementation may be marked as completed until every Quality Gate in this framework has passed cleanly.

# Definition of Done
Specific completion criteria are enforced for each category of task:

## Features
- All functional requirements and user story acceptance criteria strictly implemented.
- React 19 UI components styled cleanly following Apple/macOS Sequoia and Windows 11 Fluent Design guidelines.
- 100% natural Turkish language text for user-facing UI buttons, tooltips, and guides.
- Electron IPC channels whitelisted in Preload ContextBridge and strongly typed in `src/types/ipc.ts`.
- Sub-200ms window creation and sustained 60 FPS UI rendering.

## Bug Fixes
- Empirical log evidence gathered justifying root cause diagnosis prior to editing code.
- Zero superficial symptom patches; underlying contract failure resolved.
- Automated unit test added to `src/__tests__/` preventing regression.
- Local build verification (`node --check` and `npm run build`) passing with 0 errors.

## Refactoring
- Code refactored without altering public API signatures or breaking contract compatibility.
- React components memoized using `useMemo`, `useCallback`, or `React.memo`.
- Strict TypeScript (`strict: true`) preserved with zero `any` casting workarounds.
- Bundle chunking size maintained <= 15MB.

## Documentation
- All `.md` files updated cleanly in GitHub Flavored Markdown (GFM) format.
- Clickable relative file links (`file:///...`) verified with 0 dead links.
- 2-click document reachability from `README.md` maintained.
- `AGENTS.md` and sitemap tables updated.

## Configuration
- `vite.config.ts`, `tsconfig.json`, and `package.json` options updated cleanly.
- Incremental dev build time maintained < 5s.
- Installer build configuration verified for sub-100MB NSIS package output.

## Architecture
- Module boundary separation documented in `docs/adr/` following `ADR-TEMPLATE.md`.
- Zero circular dependencies introduced.
- Dual-layer state persistence (localStorage + Node JSON) synchronized atomically.

## Tests
- 80%+ unit test coverage achieved on core service modules.
- IPC communication boundaries 100% mocked in `src/mocks/`.
- Unit test suite executing with 100% pass rate.

# Mandatory Quality Gates
Every task deliverable must pass all 17 Quality Gates prior to completion sign-off:

1. **Architecture Compliance:** Clean Architecture layers strictly maintained (Main ➔ Preload ➔ Renderer).
2. **RULES Compliance:** 100% compliance with every rule specification in `RULES/`.
3. **ADR Compliance:** Architecture decisions matched to records in `docs/adr/`.
4. **Coding Standards:** TypeScript `strict: true`, zero `any` casting, React 19 memoization.
5. **Naming Standards:** PascalCase components/types, camelCase hooks/services, kebab-case IPC channels.
6. **Electron Compatibility:** webPreferences hardened (`contextIsolation: true`, `sandbox: true`), main thread unblocked.
7. **React Compatibility:** React 19 rendering tree optimized, zero unnecessary re-renders.
8. **TypeScript Validation:** `npm run build` passes with 0 compilation errors or warning flags.
9. **IPC Validation:** Preload ContextBridge whitelist array `VALID_CHANNELS` strictly enforced.
10. **Security Validation:** Regex input sanitization, Base64 in-memory PowerShell streams (0 temp `.ps1` disk drops), AMSI safety.
11. **Performance Validation:** Sustained 60 FPS rendering, idle RAM <= 120MB, startup time < 200ms.
12. **Error Handling:** Uncaught exception handlers active, automatic state rollback on failure, friendly Turkish UI notices.
13. **Logging:** Structured JSON logging in `%APPDATA%\luper\logs\` with privacy sanitization and 10MB log rotation.
14. **Documentation:** Turkish user guides updated, relative file links verified, navigation tables synced.
15. **Test Coverage:** Core service coverage >= 80%, zero flaky test assertions.
16. **Build Verification:** `node --check electron/main.js` and `npm run build` execute with zero errors.
17. **Production Readiness:** Installer executable (<100MB) verified cleanly; 0 user-facing AI models or API key leaks.

# Exit Criteria
A task may ONLY be closed when all of the following exit conditions are satisfied:

1. All requested modifications implemented within approved domain file scope.
2. All 17 Mandatory Quality Gates verified and passed.
3. Code Review Protocol passed with formal Approval.
4. Learned technical lessons persisted to the appropriate Markdown document in `RULES/`.
5. Completion report explicitly states the AI Model and Tier utilized during execution.

# Automatic Failure Conditions
Any of the following conditions causes IMMEDIATE task failure and rejection:

- Local build failure (`node --check electron/main.js` or `npm run build` fails).
- Presence of `any` type casting or implicit coercions.
- Direct `child_process` exposure or synchronous IPC in preload scripts.
- Temporary `.ps1` script file dropped to disk.
- User-facing AI model or remote LLM API key shipped in client application.
- UI frame rate drops below 60 FPS or idle RAM exceeds 150MB.
- Raw developer stack traces or error codes shown to end-users instead of Turkish text.

# Final Validation Checklist
- [ ] Verified task requirements against approved scope.
- [ ] Confirmed local build checks passed (`node --check` and `npm run build`).
- [ ] Audited against all 17 Mandatory Quality Gates.
- [ ] Passed Code Review Protocol.
- [ ] Persisted learned technical lessons into `RULES/`.
- [ ] Stated AI Model and Tier in completion report.

# Related Documents
- [common_agent_standards.md](common_agent_standards.md)
- [agent_collaboration_protocol.md](agent_collaboration_protocol.md)
- [ai_decision_framework.md](ai_decision_framework.md)
- [file_ownership_matrix.md](file_ownership_matrix.md)
- [code_review_protocol.md](code_review_protocol.md)
- [AGENTS.md](../../AGENTS.md)
