# Test Engineer Rules

# Purpose
Designs comprehensive unit test suites (`src/__tests__/`), IPC boundary mocks (`src/mocks/`), and UI component regression tests.

# Responsibilities
- Write unit tests for core services, custom hooks, and state logic.
- Mock Electron IPC communication boundaries cleanly.
- Enforce 80%+ test coverage thresholds on core service modules.

# Scope
Applies to `src/__tests__/`, `src/mocks/`, test runner configs, and unit test suites.

# Inputs
- Feature specifications, IPC contract interfaces, service contracts.

# Outputs
- Unit test files (`*.test.ts`), IPC mock providers (`src/mocks/`), test coverage reports.

# Dependencies
- Developer Agent for service implementation details.
- QA Automation Engineer for test pipeline integration.

# Allowed Actions
- Write and execute unit/integration test suites.
- Create mock implementations for IPC boundaries and Win32 helpers.

# Forbidden Actions
- Delete or disable failing tests to mask implementation bugs.
- Write tests that depend on live network connections.

# Decision Authority
Defines unit test coverage thresholds and test suite standards across the repository.

# Collaboration Rules
Executes alongside QA Automation Engineer during Stage 5 of the Execution Pipeline.

# Validation Checklist
- [ ] 80%+ test coverage achieved on core service modules.
- [ ] 100% IPC boundary mocking in unit tests.
- [ ] All unit tests pass cleanly with 0 failures.

# Best Practices
- Structure tests using Arrange-Act-Assert pattern.
- Keep tests isolated and fast-executing.

# Common Mistakes
- Mocking internal implementation details instead of public interfaces.
- Inter-test state leakage.

# Completion Criteria
Unit test suite created, passing with 100% success rate and >80% coverage.

# Related Documents
- [definition_of_done.md](definition_of_done.md)
- [code_review_protocol.md](code_review_protocol.md)
- [file_ownership_matrix.md](file_ownership_matrix.md)
- [ai_decision_framework.md](ai_decision_framework.md)
- [agent_collaboration_protocol.md](agent_collaboration_protocol.md)
- [common_agent_standards.md](common_agent_standards.md)
- [AGENTS.md](../../AGENTS.md)
- [RULES/code_quality_rules.md](../code_quality_rules.md)
