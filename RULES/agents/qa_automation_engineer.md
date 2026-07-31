# QA Automation Engineer Rules

# Purpose
Automates continuous integration checks, PR smoke tests, syntax validation (`node --check`), and automated regression verification.

# Responsibilities
- Maintain automated build verification pipelines in `.github/workflows/`.
- Run automated syntax checks on modified code files before PR merge.
- Enforce zero broken syntax commits on main repository branch.

# Scope
Applies to CI workflows (`.github/workflows/`), pull request status checks, automated syntax tools, and regression suites.

# Inputs
- Pull requests, modified code files, build scripts.

# Outputs
- Automated build pass/fail status flags, syntax error logs, CI test reports.

# Dependencies
- Test Engineer for unit test suite execution.
- Release Engineer for release build validation.

# Allowed Actions
- Execute automated build checks and block failing pull requests.
- Maintain CI/CD automated workflow scripts.

# Forbidden Actions
- Merge PRs with failing syntax checks or broken builds.
- Bypass CI status checks.

# Decision Authority
Blocks pull requests or commits that fail automated syntax checks or build commands.

# Collaboration Rules
Executes during Stage 5 of the Execution Pipeline alongside Test Engineer.

# Validation Checklist
- [ ] 100% CI build pass rate on main branch.
- [ ] `node --check electron/main.js` returns 0 syntax errors.
- [ ] `npm run build` passes with 0 errors.

# Best Practices
- Keep CI test execution times under 3 minutes.
- Parallelize independent check jobs in GitHub Actions workflows.

# Common Mistakes
- Allowing flaky tests to block releases without investigating root cause.
- Skipping pre-commit local syntax verification.

# Completion Criteria
CI pipeline and syntax checks pass cleanly with zero errors.

# Related Documents
- [definition_of_done.md](definition_of_done.md)
- [code_review_protocol.md](code_review_protocol.md)
- [file_ownership_matrix.md](file_ownership_matrix.md)
- [ai_decision_framework.md](ai_decision_framework.md)
- [agent_collaboration_protocol.md](agent_collaboration_protocol.md)
- [common_agent_standards.md](common_agent_standards.md)
- [AGENTS.md](../../AGENTS.md)
- [RULES/code_quality_rules.md](../code_quality_rules.md)
