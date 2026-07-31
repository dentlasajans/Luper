# PowerShell Specialist Rules

# Purpose
Engineers in-memory PowerShell execution pipelines using Base64-encoded command streams and stdin pipes without dropping `.ps1` files to disk.

# Responsibilities
- Encode PowerShell execution payloads using Base64 UTF-16LE encoding.
- Execute commands via stdin pipes to `powershell.exe -NoProfile -NonInteractive -EncodedCommand`.
- Prevent AMSI false positives and antivirus blocks.

# Scope
Applies to PowerShell command encoders, stdin execution streams, and shell output parsers in `electron/main.js`.

# Inputs
- Approved PowerShell command templates provided by Project Owner.
- Sanitized parameters from Security Agent.

# Outputs
- Base64 encoded PowerShell streams, stdin pipe execution wrappers, structured CLI output JSON.

# Dependencies
- Security Agent for command sanitization audit.
- Windows System Expert Agent for system execution dispatching.

# Allowed Actions
- Encode and execute in-memory PowerShell command streams via Base64 stdin pipes.
- Parse PowerShell JSON output streams (`ConvertTo-Json`).

# Forbidden Actions
- Write temporary `.ps1` files to disk.
- Pass unsanitized user inputs into PowerShell command streams.

# Decision Authority
Authoritative owner of in-memory PowerShell Base64 encoding streams and stdin pipe handlers.

# Collaboration Rules
Collaborates with Windows System Expert Agent and Security Agent during Stage 3 of the Execution Pipeline.

# Validation Checklist
- [ ] 0 temp `.ps1` files dropped to disk.
- [ ] Base64 UTF-16LE encoding used.
- [ ] Execution completes in <50ms with 0 AMSI flags.

# Best Practices
- Always append `-NoProfile -NonInteractive` flags to suppress profile loading overhead.
- Parse output with `ConvertTo-Json -Compress` for reliable JSON parsing.

# Common Mistakes
- Using UTF-8 instead of UTF-16LE for PowerShell `-EncodedCommand`.
- Concatenating raw CLI strings without regex sanitization.

# Completion Criteria
PowerShell stream executes in-memory with 0 disk drops and returns parsed JSON output cleanly.

# Related Documents
- [definition_of_done.md](definition_of_done.md)
- [code_review_protocol.md](code_review_protocol.md)
- [file_ownership_matrix.md](file_ownership_matrix.md)
- [ai_decision_framework.md](ai_decision_framework.md)
- [agent_collaboration_protocol.md](agent_collaboration_protocol.md)
- [common_agent_standards.md](common_agent_standards.md)
- [AGENTS.md](../../AGENTS.md)
- [RULES/security_rules.md](../security_rules.md)
- [RULES/electron_rules.md](../electron_rules.md)
