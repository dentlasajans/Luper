# File Ownership Matrix

# Purpose
Establishes a mandatory, authoritative File Ownership & Responsibility Matrix across the LUPER platform. Ensures strict domain boundary separation, prevents unauthorized file mutations, and defines explicit review and approval authorities.

# Ownership Principles
1. **Single Primary Ownership:** Every file or directory has exactly one Primary Owner agent holding domain responsibility.
2. **Pre-Mutation Verification:** Every agent MUST verify file ownership before modifying any file in the workspace.
3. **No Unassigned Files:** Every path in the repository maps to defined Primary and Secondary owners.
4. **Clean Boundary Separation:** Cross-domain file mutations require explicit authorization and handover via `invoke_subagent`.

# Ownership Levels
- **Primary Owner:** Holds exclusive write and refactoring responsibility for domain files.
- **Secondary Owner:** Assists Primary Owner, performs secondary reviews, and provides fallback execution.
- **Reviewer:** Audits code diffs against governance rules, security filters, and performance metrics.
- **Approver:** Authorizes pull request merges, architectural ADRs, and distribution releases.

# Ownership Matrix

| System Domain / File Path | Primary Owner | Secondary Owner | Reviewer | Approver |
| :--- | :--- | :--- | :--- | :--- |
| **Electron Main** (`electron/main.js`)| Electron Platform Engineer | Windows System Expert | Security Agent | Architect Agent |
| **Electron Preload** (`electron/preload.cjs`)| IPC Architect | Security Agent | Electron Platform Eng. | Architect Agent |
| **IPC Contracts** (`src/types/ipc.ts`)| IPC Architect | Developer Agent | Security Agent | Architect Agent |
| **React Components** (`src/components/`)| Design System Agent | React & TS Specialist | UX Specialist Agent | Architect Agent |
| **React Hooks** (`src/hooks/`)| React & TS Specialist | Performance Engineer | Developer Agent | Architect Agent |
| **Context API** (`src/context/`)| State & Persistence Agent | Developer Agent | React & TS Specialist | Architect Agent |
| **Services** (`src/services/`)| Developer Agent | IPC Architect | Performance Engineer | Architect Agent |
| **Stores** (`src/stores/`)| State & Persistence Agent | Opt. Database Engineer | Architect Agent | Lead Orchestrator |
| **Utilities** (`src/utils/`)| React & TS Specialist | Developer Agent | QA Automation Eng. | Architect Agent |
| **Assets** (`public/`, `assets/`)| Design System Agent | UX Specialist Agent | Documentation Agent | Product Owner |
| **Build System** (`vite.config.ts`, `tsconfig.json`)| Build Engineer | Performance Engineer | QA Automation Eng. | Architect Agent |
| **Release System** (`package.json` build)| Release Engineer | Build Engineer | Security Agent | Lead Orchestrator |
| **Documentation** (`docs/`, `README.md`)| Documentation Agent | UX Specialist Agent | Product Owner Agent | Lead Orchestrator |
| **AGENTS** (`AGENTS.md`, `RULES/agents/`)| Architect Agent | Critic Agent | Lead Orchestrator | Project Owner |
| **RULES** (`RULES/` shared rules)| Architect Agent | Security Agent | Critic Agent | Project Owner |
| **ADR** (`docs/adr/`)| Architect Agent | Product Owner Agent | Critic Agent | Project Owner |
| **Tests** (`src/__tests__/`, `src/mocks/`)| Test Engineer | QA Automation Engineer | Developer Agent | Critic Agent |
| **Benchmark** (`src/benchmark/`)| Benchmark Engineer | Performance Engineer | Data Analytics Agent | Architect Agent |
| **Opt. Database** (`src/data/`)| Opt. Database Engineer | State & Persistence Agent| Product Owner Agent | Architect Agent |
| **Windows Integration** (Win32 bridge)| Native Windows Engineer | Windows System Expert | Security Agent | Architect Agent |
| **PowerShell** (Base64 streams)| PowerShell Specialist | Windows System Expert | Security Agent | Architect Agent |
| **Registry** (`HKLM`/`HKCU` ops)| Registry Specialist | Native Windows Engineer | Security Agent | Architect Agent |
| **Logging** (`%APPDATA%\luper\logs\`)| Logging Engineer | Error Recovery Engineer | Security Agent | Architect Agent |
| **Error Recovery** (Error Boundaries)| Error Recovery Engineer | State & Persistence Agent| Logging Engineer | Architect Agent |
| **Installer** (NSIS setup configs)| Release Engineer | Build Engineer | Security Agent | Lead Orchestrator |
| **Updater** (Auto-update manifests)| Release Engineer | Electron Platform Eng. | Security Agent | Lead Orchestrator |

# Ownership Rules
- **Exclusive Ownership:** Primary Owners hold exclusive authority to modify their designated domain files. Secondary agents may not edit domain files without explicit subagent delegation.
- **Shared Ownership:** Files shared across components (e.g. `src/types/index.ts`) must be coordinated by the IPC Architect and React & TS Specialist.
- **Temporary Ownership:** When a specialist subagent is assigned a task by the Lead Orchestrator, it holds temporary exclusive write access to specified target files for the duration of the subagent invocation.
- **Ownership Transfer:** Formal handover of file responsibility occurs sequentially along the 8-stage Execution Pipeline.
- **Emergency Ownership:** In the event of build or runtime failure, the Lead Orchestrator may assign emergency ownership to Error Recovery Engineer or QA Automation Engineer to resolve syntax defects.
- **Abandoned Ownership:** Files lacking active owners default to the governance domain of the Architect Agent.

# Modification Permissions
- **Who May Edit:** Assigned Primary Owners and explicitly delegated subagents.
- **Who May Review:** Secondary Owners, Security Agent, Performance Engineer, and Critic Agent.
- **Who May Approve:** Architect Agent (Architecture/ADRs), Product Owner (Features), Security Agent (Security/IPC), Lead Orchestrator & Project Owner (Final release).
- **Who May Reject:** Critic Agent (Quality Gate failures), QA Automation Engineer (Build/syntax failures), Security Agent (Vulnerability/isolation breaches), Performance Engineer (Frame drops/RAM leaks).
- **Who May Override:** Architect Agent and Lead Orchestrator (with explicit Project Owner confirmation).

# Ownership Validation Checklist
- [ ] Checked `file_ownership_matrix.md` before editing target file.
- [ ] Confirmed Primary Owner authority or explicit subagent delegation.
- [ ] Verified file edits are restricted strictly to approved domain paths.
- [ ] Passed completed edits to designated Reviewer and Approver.
- [ ] Verified local build commands pass cleanly (`node --check` and `npm run build`).

# Related Documents
- [definition_of_done.md](definition_of_done.md)
- [code_review_protocol.md](code_review_protocol.md)
- [ai_decision_framework.md](ai_decision_framework.md)
- [agent_collaboration_protocol.md](agent_collaboration_protocol.md)
- [common_agent_standards.md](common_agent_standards.md)
- [AGENTS.md](../../AGENTS.md)
