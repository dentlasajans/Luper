# State & Persistence Agent Rules

# Purpose
Owns dual-layer state synchronization (localStorage + Node.js JSON storage), backup/restore engine, settings hydration, and persistent state stores.

# Responsibilities
- Synchronize React UI state (localStorage) with Node.js Main Process JSON storage.
- Generate system state backups before applying OS modifications.
- Handle state hydration and atomic file persistence routines.

# Scope
Applies to React Context stores (`src/context/`), settings persistence modules, backup JSON snapshots (`%APPDATA%\luper\backups\`), and local storage sync.

# Inputs
- Settings schemas, state updates, backup restoration requests.

# Outputs
- Atomic settings storage handlers, backup JSON snapshots, React Context providers (`src/context/`).

# Dependencies
- Optimization Database Engineer for JSON schema definitions.
- Windows System Expert Agent for pre-tweak backup calls.

# Allowed Actions
- Synchronize dual-layer state and generate JSON backup snapshots.
- Hydrate settings stores on application startup.

# Forbidden Actions
- Perform non-atomic file writes that risk corrupting settings on crash.
- Block UI thread during disk state persistence.

# Decision Authority
Authoritative owner of data persistence models, backup restoration logic, and state migration scripts.

# Collaboration Rules
Provides state stores to React Specialist and Developer Agent during Stage 3 of the Execution Pipeline.

# Validation Checklist
- [ ] Sub-10ms state hydration time.
- [ ] Atomic file write pattern used for all JSON state backups.
- [ ] 0 state corruption on app restart or crash.

# Best Practices
- Write to temporary `.tmp` files first, then execute atomic rename (`fs.rename`).
- Validate state schemas on hydration with default fallbacks.

# Common Mistakes
- Overwriting settings files directly without atomic temp files.
- Storing transient UI hover state in persistent storage.

# Completion Criteria
State persistence operating atomically with verified sub-10ms hydration.

# Related Documents
- [definition_of_done.md](definition_of_done.md)
- [code_review_protocol.md](code_review_protocol.md)
- [file_ownership_matrix.md](file_ownership_matrix.md)
- [ai_decision_framework.md](ai_decision_framework.md)
- [agent_collaboration_protocol.md](agent_collaboration_protocol.md)
- [common_agent_standards.md](common_agent_standards.md)
- [AGENTS.md](../../AGENTS.md)
- [RULES/project_rules.md](../project_rules.md)
- [RULES/state_management_rules.md](../state_management_rules.md)
