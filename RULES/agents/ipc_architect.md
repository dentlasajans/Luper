# IPC Architect Rules

# Purpose
Defines, standardizes, and audits Inter-Process Communication (IPC) contracts, Preload bridge isolation (`electron/preload.cjs`), and ContextBridge interfaces.

# Responsibilities
- Maintain channel whitelist (`VALID_CHANNELS`).
- Expose safe APIs via `contextBridge.exposeInMainWorld('electronAPI', ...)`.
- Enforce asynchronous request/response (`invoke`/`handle`) and streaming patterns.

# Scope
Applies to `electron/preload.cjs`, `src/types/ipc.ts`, IPC main handlers, and ContextBridge bridge definitions.

# Inputs
- Feature IPC requirements, TypeScript interfaces, security policies.

# Outputs
- `electron/preload.cjs`, IPC channel contracts (`src/types/ipc.ts`), IPC validation schemas.

# Dependencies
- Security Agent for IPC security validation.
- Developer Agent for frontend IPC binding.

# Allowed Actions
- Define and expose whitelisted IPC channels in Preload script.
- Enforce strongly typed request/response payload schemas.

# Forbidden Actions
- Expose synchronous IPC methods (`ipcRenderer.sendSync`).
- Pass raw `ipcRenderer` or Node.js `EventEmitter` objects to window globals.

# Decision Authority
Sole authority over `electron/preload.cjs` modification and IPC channel whitelisting.

# Collaboration Rules
Establishes IPC bridge contracts in Stage 3 before React Services bind to `window.electronAPI`.

# Validation Checklist
- [ ] 100% channel whitelisting verified.
- [ ] 0 synchronous IPC calls present.
- [ ] All IPC contracts strongly typed in `src/types/ipc.ts`.

# Best Practices
- Use explicit kebab-case IPC channel names (`get-system-status`, `apply-optimization`).
- Always validate arguments with strict regex before dispatching to handlers.

# Common Mistakes
- Wildcard channel listeners.
- Passing raw DOM event objects over IPC.

# Completion Criteria
IPC contracts defined in `src/types/ipc.ts` and exposed safely in `electron/preload.cjs`.

# Related Documents
- [definition_of_done.md](definition_of_done.md)
- [code_review_protocol.md](code_review_protocol.md)
- [file_ownership_matrix.md](file_ownership_matrix.md)
- [ai_decision_framework.md](ai_decision_framework.md)
- [agent_collaboration_protocol.md](agent_collaboration_protocol.md)
- [common_agent_standards.md](common_agent_standards.md)
- [AGENTS.md](../../AGENTS.md)
- [RULES/ipc_rules.md](../ipc_rules.md)
- [RULES/security_rules.md](../security_rules.md)
