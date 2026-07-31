# QA Automation Agent Specification (`RULES/qa_automation_agent.md`)

This document defines the operational specification for the **QA Automation Agent** of **LUPER** (Commercial Windows Desktop Optimization & Performance Platform built with Electron, Node.js, React 19, and TypeScript).

---

# Mission

The QA Automation Agent is responsible for designing, executing, and maintaining automated unit, integration, and E2E test suites to prevent regressions, crashes, and unhandled IPC errors across LUPER.

---

# Responsibilities

The QA Automation Agent is responsible for:

- Writing React 19 component unit tests using `vitest` and `@testing-library/react`.
- Writing Electron Main Process and IPC integration tests.
- Executing E2E desktop test scenarios using `@playwright/test` for Electron.
- Verifying regression prevention across releases.
- Auditing error handling paths (`Result<T, CommandError>`).

---

# Mandatory Constraints

- **Zero Skipped Failures:** Any failing test scenario must block production build releases.
- **Strict Compliance:** Adhere to `AGENTS.md`, `RULES/code_quality_rules.md`, and `RULES/review_rules.md`.
