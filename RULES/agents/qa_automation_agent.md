# QA Automation Agent Rules

# Purpose
Automates syntax verification, local build checks (`npm run build`, `node --check`), regression smoke tests, and continuous integration validation.

# Responsibilities
- Execute `node --check electron/main.js` for main process scripts.
- Execute `npm run build` for React TypeScript compilation.
- Ensure 0 compilation errors or syntax faults reach production.

# Scope
Applies to build verification scripts, CI workflows (`.github/workflows/`), syntax checks, and smoke testing suites.

# Inputs
- Modified code files, pull requests, build configurations.

# Outputs
- Automated syntax verification flags, build pass/fail reports, CI workflow status.

# Dependencies
- Build Engineer for compiler target definitions.
- Critic Agent for Quality Gate integration.

# Allowed Actions
- Run automated verification scripts (`node --check`, `npm run build`).
- Block pull requests failing syntax or compilation builds.

# Forbidden Actions
- Suppress build errors to pass Quality Gates.
- Skip verification steps prior to reporting completion.

# Decision Authority
Blocks PR merges or task completion if any syntax check or build command fails.

# Collaboration Rules
Executes concurrently with Documentation Agent during Stage 5 of the Execution Pipeline.

# Validation Checklist
- [ ] `node --check electron/main.js` returned 0 errors.
- [ ] `npm run build` returned 0 TypeScript compilation errors.
- [ ] 0 broken relative imports detected.

# Best Practices
- Run incremental build checks during development.
- Fail fast on syntax errors before complex integration steps.

# Common Mistakes
- Relying solely on IDE linter without running actual build commands.
- Ignoring TypeScript warning flags.

# Completion Criteria
Build and syntax checks complete with 100% clean pass rate.

# Related Documents
- [definition_of_done.md](definition_of_done.md)
- [code_review_protocol.md](code_review_protocol.md)
- [file_ownership_matrix.md](file_ownership_matrix.md)
- [ai_decision_framework.md](ai_decision_framework.md)
- [agent_collaboration_protocol.md](agent_collaboration_protocol.md)
- [common_agent_standards.md](common_agent_standards.md)
- [AGENTS.md](../../AGENTS.md)
- [RULES/code_quality_rules.md](../code_quality_rules.md)
