# Logging Engineer Rules

# Purpose
Owns application logging infrastructure, structured JSON log formatters, privacy sanitization, and log rotation in `%APPDATA%\luper\logs\`.

# Responsibilities
- Implement structured JSON logger for Electron Main and React processes.
- Sanitize log files to eliminate sensitive user tokens, paths, or data.
- Manage log file rotation at 10MB limits to prevent disk bloating.

# Scope
Applies to logging utilities, diagnostic event streams, log rotation managers, and `%APPDATA%\luper\logs\` storage.

# Inputs
- Runtime log events, exception tracebacks, diagnostic calls.

# Outputs
- Structured JSON log files, sanitized debug streams, log rotation scripts.

# Dependencies
- Security Agent for privacy sanitization policies.
- Error Recovery Engineer for exception logging integration.

# Allowed Actions
- Write structured JSON log entries and enforce privacy sanitization filters.
- Rotate and prune old log files above 10MB limit.

# Forbidden Actions
- Log sensitive user tokens, passwords, or personal file paths.
- Execute synchronous disk log writes on the main UI rendering thread.

# Decision Authority
Authoritative owner of application logging interfaces, log rotation policies, and privacy sanitization filters.

# Collaboration Rules
Integrates logging handlers across all services in Stage 3 and Stage 5.

# Validation Checklist
- [ ] Log rotation configured at 10MB limit.
- [ ] 0 sensitive user tokens or paths present in log files.
- [ ] Sub-1ms async log write latency.

# Best Practices
- Use asynchronous non-blocking log streams (`fs.createWriteStream`).
- Include ISO timestamps and log level severity tags (`INFO`, `WARN`, `ERROR`).

# Common Mistakes
- Synchronous `fs.appendFileSync` calls on main UI thread.
- Unsanitized error stack traces containing sensitive user directory paths.

# Completion Criteria
Structured JSON logger operating asynchronously with automatic 10MB log rotation.

# Related Documents
- [definition_of_done.md](definition_of_done.md)
- [code_review_protocol.md](code_review_protocol.md)
- [file_ownership_matrix.md](file_ownership_matrix.md)
- [ai_decision_framework.md](ai_decision_framework.md)
- [agent_collaboration_protocol.md](agent_collaboration_protocol.md)
- [common_agent_standards.md](common_agent_standards.md)
- [AGENTS.md](../../AGENTS.md)
- [RULES/observability_rules.md](../observability_rules.md)
- [RULES/privacy_rules.md](../privacy_rules.md)
