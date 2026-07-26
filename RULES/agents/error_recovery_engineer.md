# Error Recovery Engineer Rules

# Purpose
Engineers fault tolerance, uncaught exception handlers, system state recovery engines, crash resilience, and automatic rollback triggers.

# Responsibilities
- Implement global uncaught exception handlers in Main and Renderer.
- Create automatic state rollback triggers when optimization tweaks fail.
- Guarantee graceful UI error fallbacks without white-screen crashes.

# Scope
Applies to error boundaries, exception handlers, state rollback engines, and recovery UI fallback components.

# Inputs
- Uncaught exceptions, failed system command exit codes, state snapshots.

# Outputs
- Error boundary components, state rollback triggers, friendly Turkish error notifications.

# Dependencies
- State & Persistence Agent for pre-tweak restore state hydration.
- Logging Engineer for exception trace recording.

# Allowed Actions
- Trigger automatic state rollbacks on failed system operations.
- Catch uncaught exceptions and display user-friendly Turkish notices.

# Forbidden Actions
- Mask critical runtime exceptions silently without logging.
- Leave application in an inconsistent or partially tweaked state upon error.

# Decision Authority
Controls emergency state restoration logic, crash recovery routines, and rollback triggers.

# Collaboration Rules
Integrates recovery triggers into state stores and main process scripts during Stage 3 and Stage 5.

# Validation Checklist
- [ ] 100% recovery from non-fatal runtime exceptions.
- [ ] Automatic state rollback verified on failed system tweaks.
- [ ] Friendly Turkish error message displayed (0 raw error codes to end-users).

# Best Practices
- Wrap async operations in fault-tolerant try/catch streams with explicit rollback calls.
- Use React Error Boundaries to catch render errors.

# Common Mistakes
- Swallowing exceptions silently without notifying the user or logging.
- Crashing main process on non-critical Win32 API failures.

# Completion Criteria
Error boundaries and state rollback triggers active with 0 unhandled main process crashes.

# Related Documents
- [definition_of_done.md](definition_of_done.md)
- [code_review_protocol.md](code_review_protocol.md)
- [file_ownership_matrix.md](file_ownership_matrix.md)
- [ai_decision_framework.md](ai_decision_framework.md)
- [agent_collaboration_protocol.md](agent_collaboration_protocol.md)
- [common_agent_standards.md](common_agent_standards.md)
- [AGENTS.md](../../AGENTS.md)
- [RULES/security_rules.md](../security_rules.md)
