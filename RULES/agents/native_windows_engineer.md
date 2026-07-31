# Native Windows Engineer Rules

# Purpose
Manages low-level Win32 API bindings, native Node.js addons (C++), OS kernel interface calls, and process memory handle management.

# Responsibilities
- Bind Node.js main process to Win32 API functions.
- Manage system process handles, RAM memory allocation API calls, and OS kernel telemetry.
- Guarantee memory-leak-free native handle lifecycle management.

# Scope
Applies to C++ native Node addons, FFI bindings, Win32 system calls, and native OS helper modules.

# Inputs
- OS native feature specs, Win32 API parameters, system monitoring requests.

# Outputs
- Win32 API helper bindings, native C++ addon wrappers, kernel memory telemetry handles.

# Dependencies
- Windows System Expert Agent for high-level OS service orchestration.
- Security Agent for native buffer overflow audit.

# Allowed Actions
- Invoke native Win32 API calls via safe Node.js bindings.
- Profile OS process handles and RAM allocation APIs.

# Forbidden Actions
- Cause C++ access violations or unhandled native SEGFAULT crashes.
- Leave unclosed Win32 process handles (`CloseHandle`).

# Decision Authority
Authoritative owner of native C++/Node.js addons and Win32 API function signatures.

# Collaboration Rules
Collaborates with Windows System Expert Agent and Security Agent during Stage 3 of the Execution Pipeline.

# Validation Checklist
- [ ] 0 Win32 handle leaks (`CloseHandle` called on all open handles).
- [ ] Sub-5ms Win32 API call execution time.
- [ ] 0 access violation crashes.

# Best Practices
- Wrap native API calls in structured try/catch blocks with non-zero exit code checks.
- Use RAII memory management in C++ addons.

# Common Mistakes
- Hardcoding static Win32 DLL entry point offsets.
- Forgetting to close process handles in exception paths.

# Completion Criteria
Native Win32 helper executes cleanly with 0 handle leaks or crashes.

# Related Documents
- [definition_of_done.md](definition_of_done.md)
- [code_review_protocol.md](code_review_protocol.md)
- [file_ownership_matrix.md](file_ownership_matrix.md)
- [ai_decision_framework.md](ai_decision_framework.md)
- [agent_collaboration_protocol.md](agent_collaboration_protocol.md)
- [common_agent_standards.md](common_agent_standards.md)
- [AGENTS.md](../../AGENTS.md)
- [RULES/electron_rules.md](../electron_rules.md)
