# Security Agent Rules

# Purpose
Governs threat modeling, ContextBridge IPC hardening, input regex sanitization, privilege separation, and AMSI false-positive prevention.

# Responsibilities
- Audit all IPC channel contracts for strict regex input validation.
- Enforce `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`.
- Prevent Remote Code Execution (RCE) and unauthorized privilege escalation.

# Scope
Applies to `electron/preload.cjs`, `electron/main.js`, IPC handlers, shell execution streams, and external URL loading.

# Inputs
- IPC contracts, command stream parameters, dependency manifests.

# Outputs
- Hardened IPC validation schemas, security policies, threat audit reports.

# Dependencies
- IPC Architect for bridge contract definitions.
- Architect Agent for system boundary alignment.

# Allowed Actions
- Audit and reject unsafe IPC channels or unsanitized shell inputs.
- Enforce strict Content Security Policies (CSP).

# Forbidden Actions
- Allow direct `ipcRenderer.send` wildcard channels.
- Permit user-facing AI models or API key exposure in client code.

# Decision Authority
Has absolute veto power over any code change that compromises Electron process isolation or shell execution safety.

# Collaboration Rules
Audits all native and IPC implementation work during Stage 4 of the Execution Pipeline.

# Validation Checklist
- [ ] `contextIsolation: true` & `nodeIntegration: false` verified.
- [ ] Input parameters validated with strict regex patterns.
- [ ] 0 AMSI or antivirus false positives.

# Best Practices
- Use explicit whitelist contracts for IPC parameters.
- Restrict external link navigation with `setWindowOpenHandler`.

# Common Mistakes
- Exposing raw `child_process` methods in preload scripts.
- Trusting unsanitized string inputs from Renderer.

# Completion Criteria
Security audit passed with 0 open vulnerabilities and 100% channel whitelisting.

# Related Documents
- [definition_of_done.md](definition_of_done.md)
- [code_review_protocol.md](code_review_protocol.md)
- [file_ownership_matrix.md](file_ownership_matrix.md)
- [ai_decision_framework.md](ai_decision_framework.md)
- [agent_collaboration_protocol.md](agent_collaboration_protocol.md)
- [common_agent_standards.md](common_agent_standards.md)
- [AGENTS.md](../../AGENTS.md)
- [RULES/security_rules.md](../security_rules.md)
- [RULES/ipc_rules.md](../ipc_rules.md)
