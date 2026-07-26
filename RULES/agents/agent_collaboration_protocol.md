# Agent Collaboration Protocol

# Purpose
Defines the mandatory multi-agent collaboration, delegation, context-sharing, conflict resolution, and execution protocol across all AI agents in the LUPER platform ecosystem.

# Collaboration Principles
1. **Parallel First:** Execute independent work streams (UI styling + Win32/PowerShell native scripting) concurrently via parallel `invoke_subagent` calls.
2. **Explicit Layer Boundaries:** Adhere strictly to architectural layer contracts (Main Process ➔ ContextBridge Preload ➔ React Renderer).
3. **Domain Ownership:** No agent may edit files outside its designated ownership boundary without explicit cross-agent authorization.
4. **Mandatory Model Identification:** State AI Model and Tier explicitly in every inter-agent request and task report.

# Task Assignment
- Tasks are assigned by the Lead Orchestrator via `invoke_subagent`.
- Subagents receive target file paths, specific requirements, input parameters, and expected deliverables.

# Task Ownership
- The assigned agent holds exclusive responsibility for its domain files during task execution.
- No secondary agent may mutate domain files during active execution by the primary owner.

# Task Handover
- Completed deliverables are passed downstream along the 8-stage Execution Pipeline.
- Handovers must include: changed file paths, verification outputs, updated types, and explicit completion status.

# Dependency Management
- Upstream dependencies must be satisfied before downstream tasks commence.
- IPC Preload bridge interfaces (`electron/preload.cjs`) MUST be defined before React services bind to `window.electronAPI`.

# Parallel Execution
- Simultaneous execution permitted for independent streams:
  - Design System Agent (React styling) + Windows System Expert Agent (Win32 API/PowerShell scripting).
  - QA Automation Engineer (running build checks) + Documentation Agent (updating Markdown guides).

# Sequential Execution
- Dependent execution required for sequential stages:
  - Stage 1 (Requirements) ➔ Stage 2 (Architecture) ➔ Stage 3 (Implementation) ➔ Stage 4 (Security Audit) ➔ Stage 5 (QA Testing) ➔ Stage 6 (Documentation) ➔ Stage 7 (Critic Gate Review) ➔ Stage 8 (Release Packaging).

# Communication Protocol
- Agents communicate using `send_message` tool with target conversation IDs.
- Never use `send_message` to communicate with the end-user.
- Inter-agent messages must be concise, structured, and action-oriented.

# Shared Context
- Shared system state and contracts are maintained in `AGENTS.md`, `RULES/`, `docs/adr/`, and TypeScript interface declarations (`src/types/`).
- Learned technical lessons must be persisted immediately into the appropriate file in `RULES/`.

# Conflict Resolution
- Technical conflicts between agents are resolved by the Architect Agent and Lead Orchestrator based on Clean Architecture rules.
- Rule conflicts are escalated to the Project Owner.

# Priority Rules
1. Security & Process Isolation (Security Agent veto power).
2. Clean Architecture & ADR alignment (Architect Agent authority).
3. Product specifications & Offline-first policy (Product Owner Agent authority).
4. Code Quality & Type Safety (React & TypeScript Specialist authority).

# Blocking Rules
- An agent must block execution if upstream contracts are missing or invalid.
- QA Automation Engineer blocks PRs failing `node --check` or `npm run build`.
- Critic Agent blocks completion if any of the 5 Quality Gates fail.

# Approval Workflow
- Architectural changes require explicit approval from Architect Agent (ADR entry).
- Security-critical IPC channels require explicit approval from Security Agent.
- Final task completion requires sign-off from Critic Agent and Lead Orchestrator.

# Review Workflow
- Completed work passes through the 4-step Mandatory Review Chain:
  1. Local Self-Verification Guard (`node --check` and `npm run build`).
  2. Security & IPC Audit.
  3. Quality Gate Review (Critic Agent).
  4. Lead Orchestrator Sign-off.

# Escalation Workflow
- Build/syntax failures ➔ QA Automation Engineer + Lead Orchestrator.
- AMSI or antivirus flags ➔ Security Agent + PowerShell Specialist.
- UI frame drops (<60 FPS) or V8 memory leaks (>150MB) ➔ Performance Engineer.

# Decision Ownership
- Architecture & ADRs: Architect Agent.
- IPC Contracts & Preload: IPC Architect.
- Security & Hardening: Security Agent.
- UI Aesthetics & Styling: Design System Agent.
- Native Win32 / PowerShell: Windows System Expert Agent.

# Knowledge Sharing
- Every technical constraint or bug fix discovered during execution MUST be written to the relevant file in `RULES/` before marking the task complete.

# File Locking Strategy
- While a subagent is actively modifying a file (e.g. `electron/preload.cjs`), no other subagent may write to that file concurrently.

# Change Coordination
- Multi-component changes must coordinate TypeScript types in `src/types/` prior to implementing component or main process logic.

# Completion Validation
- Local verification commands executed cleanly (`node --check electron/main.js` and `npm run build`).
- 0 syntax errors, 0 lint warnings, 0 type casting workarounds (`any`).

# Failure Recovery
- Unhandled exceptions or failed system tweaks trigger automatic state rollback via State & Persistence Agent.
- Errors are logged asynchronously via Logging Engineer and reported cleanly in Turkish UI.

# Collaboration Checklist
- [ ] Verify domain ownership before editing files.
- [ ] Confirm upstream dependencies are completed.
- [ ] Communicate status via structured subagent reports.
- [ ] Pass through 4-step Mandatory Review Chain.
- [ ] Persist learned lessons to `RULES/`.

# Related Documents
- [definition_of_done.md](definition_of_done.md)
- [code_review_protocol.md](code_review_protocol.md)
- [file_ownership_matrix.md](file_ownership_matrix.md)
- [ai_decision_framework.md](ai_decision_framework.md)
- [common_agent_standards.md](common_agent_standards.md)
- [AGENTS.md](../../AGENTS.md)
- [RULES/coding_rules.md](../coding_rules.md)
- [RULES/security_rules.md](../security_rules.md)
