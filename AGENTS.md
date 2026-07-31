# LUPER Project — Master AI Rule System & Entry Point

This document serves as the **mandatory entry point** for all AI agents participating in the development, architecture, design, and maintenance of **LUPER** (Windows Operating System Optimization & Performance Platform built with Electron, Node.js, React 19, and TypeScript).

---

## 📋 Table of Contents

- [MANDATORY WORKFLOW FOR ALL AGENTS](#-mandatory-workflow-for-all-agents)
- [Governance Constitution & Modular Rule Index (`RULES/`)](#️-governance-constitution--modular-rule-index-rules)
- [AI Agent Ecosystem & Model Priority Table](#-ai-agent-ecosystem--model-priority-table)
- [Specialized AI Agent Specifications](#specialized-ai-agent-specifications)
- [Agent Hierarchy](#agent-hierarchy)
- [Agent Assignment Matrix](#agent-assignment-matrix)
- [Execution Pipeline](#execution-pipeline)
- [Parallel Execution Rules](#parallel-execution-rules)
- [File Ownership](#file-ownership)
- [Escalation Rules](#escalation-rules)
- [Mandatory Review Chain](#mandatory-review-chain)
- [Agent Communication Rules](#agent-communication-rules)
- [Agent Lifecycle](#agent-lifecycle)
- [Quality Gates](#quality-gates)
- [Definition of Done](#definition-of-done)
- [Documentation References](#documentation-references)
- [CRITICAL PROJECT-WIDE PROHIBITION](#-critical-project-wide-prohibition)

---

## 🛑 MANDATORY WORKFLOW FOR ALL AGENTS

Before performing ANY task, reading ANY code, or modifying ANY file:

1. **Always Read `AGENTS.md` First:** Understand the entry point rules and team boundaries.
2. **Mandatory File Ownership Verification:** Every AI agent MUST verify domain file ownership in [file_ownership_matrix.md](RULES/agents/file_ownership_matrix.md) before modifying any file in the workspace.
3. **Mandatory Compliance with Common Agent Standards:** Every AI agent operating within the LUPER platform MUST strictly comply with [common_agent_standards.md](RULES/agents/common_agent_standards.md).
4. **Mandatory Compliance with Agent Collaboration Protocol:** Every project agent MUST follow the [Agent Collaboration Protocol](RULES/agents/agent_collaboration_protocol.md) before starting, handing over, reviewing, or completing any task.
5. **Mandatory Compliance with AI Decision Framework:** Every project agent MUST follow the [AI Decision Framework](RULES/agents/ai_decision_framework.md) before implementing, reviewing, or approving any technical or architectural change.
6. **Mandatory Successful Code Review:** Every task deliverable MUST successfully pass the [Code Review Protocol](RULES/agents/code_review_protocol.md) before any task can be marked as completed.
7. **Mandatory Definition of Done & Quality Gate Verification:** NO AGENT IS ALLOWED TO MARK A TASK AS COMPLETED UNTIL EVERY QUALITY GATE HAS PASSED per [definition_of_done.md](RULES/agents/definition_of_done.md).
8. **Read `RULES/master_governance.md`:** (if present) and **EVERY** Markdown file inside `RULES/` directory:
   - All shared rule files (`coding_rules.md`, `design_rules.md`, `project_rules.md`, `ui_ux_rules.md`, `git_rules.md`, `release_rules.md`, `naming_rules.md`, `documentation_rules.md`, `security_rules.md`, `performance_rules.md`, `electron_rules.md`, `ipc_rules.md`, `api_rules.md`, `telemetry_rules.md`, `plugin_rules.md`, `localization_rules.md`, `review_rules.md`, `code_quality_rules.md`, `architecture_decision_rules.md`, `migration_rules.md`, `update_rules.md`, `license_rules.md`, `privacy_rules.md`, `observability_rules.md`, `feature_rules.md`).
   - Your dedicated agent spec file inside `RULES/agents/` (e.g., `RULES/agents/<your_agent_name>.md`).
9. **Mandatory Subagent Delegation & Orchestration Policy (The 32-Agent Rule):** The Lead Orchestrator Agent MUST ACT ONLY AS A MANAGER. Whenever the Project Owner assigns any task, prompt, feature, bug fix, or refactoring, the Lead Orchestrator Agent MUST IMMEDIATELY delegate execution to the 32 specialized AI subagent(s) via `invoke_subagent`. The main agent NEVER writes code directly; it only directs, coordinates, assigns tasks, and audits. The 32 expert subagents do the actual execution in their specific domains.
   - **Parallel Subagent Invocation Rule:** For tasks involving both UI and Backend, launch UI (Developer/Design Agent) and Backend (Windows System Expert Agent) subagents simultaneously to complete work in parallel.
   - **Model Priority Order Rule:** Always utilize **Claude** & **GPT** first for primary reasoning, architecture, and code execution until quota limits are hit, then utilize **Gemini** as the secondary/fallback engine.
   - **Model Tier Distribution Rule:** 
     - **`flash` / `flash_lite` Tier (Gemini 2.0 Flash / Flash High):** Hızlı kod arama, dosya okuma, derleme kontrolü, basit UI düzenlemeleri ve dokümantasyon gibi hızlı/basit işler için kullanın.
     - **`pro` Tier (Gemini 3.1 Pro / Claude Pro):** Derin mimari kararları, karmaşık Windows Kayıt Defteri/PowerShell mühendisliği, performans profilleme ve güvenlik denetimleri gibi karmaşık/derin düşünme gerektiren işler için kullanın.
   - **Mandatory Model Identification Rule:** Every agent/subagent MUST explicitly state which AI Model & Tier it utilized in its header/report (e.g. `Model Used: Gemini 2.0 Flash (flash tier)` or `Model Used: Gemini 3.1 Pro (pro tier)`).
10. **Mandatory Self-Correction & Syntax Verification Guard:** No subagent may submit a "Completed" report or pass work to the user without first verifying its code locally. Subagents editing `electron/main.js` MUST run `node --check electron/main.js`, and subagents editing React code MUST verify `npm run build`. Zero syntax/runtime errors are permitted in completed reports.
11. **Execution & Command Standards:** TÜM ALT AJANLAR (SUBAGENTS) İŞİNİ VE RAPORUNU TAMAMLAMADAN `npm start` VEYA HERHANGİ BİR UYGULAMA BAŞLATMA KOMUTU ÇALIŞTIRILAMAZ. Önce tüm subagent'ların kod modifikasyonları ve doğrulama raporları beklenir, ardından derleme kontrolü yapılıp uygulama başlatılır.
12. **Self-Learning & Memory Persistence Rule:** Whenever a new technical constraint, edge case, or bug pattern is resolved (e.g. Windows CLI character limits, ESM vs CommonJS imports), the agent MUST immediately persist the learned lesson into the appropriate Markdown file inside `RULES/`.
13. **Treat All Rule Files as Mandatory:** No rule may be bypassed, ignored, or assumed optional.
14. **Never Ignore Project Rules:** If a directive conflicts with a rule file, **stop and ask the project owner for explicit clarification**.
15. **Never Assume Missing Requirements:** Do not infer or invent business logic, registry tweaks, or unapproved features.
16. **Respect Every Agent's Domain:** Never perform another agent's job without explicit cross-agent authorization.
17. **Keep Responsibilities Strictly Separated:** Every agent operates purely within its designated domain.

---

## 🏛️ Governance Constitution & Modular Rule Index (`RULES/`)

### Governance Constitution & Common Standards
- 📜 [AGENTS.md](RULES/AGENTS.md) — Master AI Governance Constitution (Purpose, Workflow, Decision Hierarchy, Conflict Resolution, Code Standards, Philosophy).
- 📜 [common_agent_standards.md](RULES/agents/common_agent_standards.md) — Mandatory Common Standards for Every AI Agent.
- 📜 [agent_collaboration_protocol.md](RULES/agents/agent_collaboration_protocol.md) — Mandatory Agent Collaboration Protocol.
- 📜 [ai_decision_framework.md](RULES/agents/ai_decision_framework.md) — Mandatory AI Decision Framework.
- 📜 [file_ownership_matrix.md](RULES/agents/file_ownership_matrix.md) — Mandatory File Ownership & Responsibility Matrix.
- 📜 [code_review_protocol.md](RULES/agents/code_review_protocol.md) — Mandatory Code Review Protocol.
- 📜 [definition_of_done.md](RULES/agents/definition_of_done.md) — Mandatory Definition of Done & Quality Gates.

### Dedicated Agent Rule Specifications (`RULES/agents/`)
- 🏛️ [architect_agent.md](RULES/agents/architect_agent.md) — Architect Agent Rules & Governance
- ⚙️ [developer_agent.md](RULES/agents/developer_agent.md) — Developer Agent Rules & Governance
- 🎨 [design_system_agent.md](RULES/agents/design_system_agent.md) — Design System Agent Rules & Governance
- ⚡ [performance_agent.md](RULES/agents/performance_agent.md) — Performance Agent Rules & Governance
- 💻 [windows_system_expert_agent.md](RULES/agents/windows_system_expert_agent.md) — Windows System Expert Agent Rules
- 🛡️ [security_agent.md](RULES/agents/security_agent.md) — Security Agent Rules & Hardening Governance
- 🤖 [qa_automation_agent.md](RULES/agents/qa_automation_agent.md) — QA Automation Agent Rules
- ✍️ [documentation_agent.md](RULES/agents/documentation_agent.md) — Documentation Agent Rules
- 🧐 [critic_agent.md](RULES/agents/critic_agent.md) — Critic Agent Quality Gatekeeper Rules
- 🎯 [product_owner_agent.md](RULES/agents/product_owner_agent.md) — Product Owner Agent Rules
- 🤖 [ai_integration_agent.md](RULES/agents/ai_integration_agent.md) — AI Integration Agent Rules
- 📊 [data_analytics_agent.md](RULES/agents/data_analytics_agent.md) — Data Analytics Agent Rules
- ⚡ [electron_platform_engineer.md](RULES/agents/electron_platform_engineer.md) — Electron Platform Engineer Rules
- 🔌 [ipc_architect.md](RULES/agents/ipc_architect.md) — IPC Architect Rules
- 💻 [native_windows_engineer.md](RULES/agents/native_windows_engineer.md) — Native Windows Engineer Rules
- 🗃️ [windows_registry_specialist.md](RULES/agents/windows_registry_specialist.md) — Windows Registry Specialist Rules
- ⚡ [powershell_specialist.md](RULES/agents/powershell_specialist.md) — PowerShell Specialist Rules
- 💾 [optimization_database_engineer.md](RULES/agents/optimization_database_engineer.md) — Optimization Database Engineer Rules
- 📊 [benchmark_engineer.md](RULES/agents/benchmark_engineer.md) — Benchmark Engineer Rules
- ⚡ [performance_engineer.md](RULES/agents/performance_engineer.md) — Performance Engineer Rules
- 🛠️ [build_engineer.md](RULES/agents/build_engineer.md) — Build Engineer Rules
- 🚀 [release_engineer.md](RULES/agents/release_engineer.md) — Release Engineer Rules
- 🤖 [qa_automation_engineer.md](RULES/agents/qa_automation_engineer.md) — QA Automation Engineer Rules
- 🧪 [test_engineer.md](RULES/agents/test_engineer.md) — Test Engineer Rules
- 🔌 [plugin_architect.md](RULES/agents/plugin_architect.md) — Plugin Architect Rules
- 📝 [logging_engineer.md](RULES/agents/logging_engineer.md) — Logging Engineer Rules
- 🛡️ [error_recovery_engineer.md](RULES/agents/error_recovery_engineer.md) — Error Recovery Engineer Rules
- ⚛️ [react_typescript_specialist_agent.md](RULES/agents/react_typescript_specialist_agent.md) — React & TypeScript Specialist Agent Rules
- 💾 [state_persistence_agent.md](RULES/agents/state_persistence_agent.md) — State & Persistence Agent Rules
- ♿ [ux_accessibility_specialist_agent.md](RULES/agents/ux_accessibility_specialist_agent.md) — UX & Accessibility Specialist Agent Rules

### Shared System Standards
- 📜 [project_rules.md](RULES/project_rules.md) — Core project architecture, data flow, dual-layer persistence, and Turkish language standard.
- 💻 [coding_rules.md](RULES/coding_rules.md) — TypeScript `strict: true`, React 19 memoization, zero `any` casting, zero technical jargon to user.
- 🎨 [design_rules.md](RULES/design_rules.md) — Visual design system, Luper Sapphire Blue (`#1a5efd`), anthracite dark mode (`#121214`), framing, corners.
- ✨ [ui_ux_rules.md](RULES/ui_ux_rules.md) — Apple/macOS Sequoia & Fluent Design standards, micro-interactions, anti-RGB/busy dashboard rules.
- ⚡ [electron_rules.md](RULES/electron_rules.md) — Electron, Node.js main process, secure IPC contextBridge, safe Win32 API / PowerShell bridge standards.
- 🔌 [ipc_rules.md](RULES/ipc_rules.md) — Electron Inter-Process Communication (IPC) patterns, contextBridge security, and validation standards.
- 🛡️ [security_rules.md](RULES/security_rules.md) — Secure IPC handling, contextIsolation, input regex sanitization, privilege separation, AMSI/antivirus false-positive prevention.
- ⚡ [performance_rules.md](RULES/performance_rules.md) — Fast startup times, 60 FPS UI rendering, zero unneeded re-renders, memory leak prevention.
- 🏷️ [naming_rules.md](RULES/naming_rules.md) — Strict naming conventions for components, variables, IPC channels, and files.
- 📝 [documentation_rules.md](RULES/documentation_rules.md) — Turkish user guides, clear technical documentation, release notes, and Markdown formatting standards.
- 🌿 [git_rules.md](RULES/git_rules.md) — Version control guidelines, commit message conventions, and clean repository maintenance.
- 🚀 [release_rules.md](RULES/release_rules.md) — Production build verification, Electron Builder distribution standards, installer verification.

---

## 🤖 AI Agent Ecosystem & Model Priority Table

The LUPER AI Agent Ecosystem consists of **12 Core Agents** and **18 Specialist Agents** working under strict domain ownership and parallel orchestration:

| Ajan (Agent) | Model Önceliği | Model Seviyesi (Tier) | Uzmanlık Dokümanı |
| :--- | :---: | :---: | :--- |
| 🏛️ **Architect Agent** | **Claude / GPT First** → Gemini | **`pro`** | [architect_agent.md](RULES/agents/architect_agent.md) |
| ⚙️ **Developer Agent** | **Claude / GPT First** → Gemini | **`pro` / `inherit`** | [developer_agent.md](RULES/agents/developer_agent.md) |
| 🎨 **Design System Agent** | **Claude / GPT First** → Gemini | **`flash`** | [design_system_agent.md](RULES/agents/design_system_agent.md) |
| ⚡ **Performance Agent** | **Claude / GPT First** → Gemini | **`pro`** | [performance_agent.md](RULES/agents/performance_agent.md) |
| 💻 **Windows System Expert Agent** | **GPT / Claude First** → Gemini | **`pro`** | [windows_system_expert_agent.md](RULES/agents/windows_system_expert_agent.md) |
| 🛡️ **Security Agent** | **GPT / Claude First** → Gemini | **`pro`** | [security_agent.md](RULES/agents/security_agent.md) |
| 🤖 **QA Automation Agent** | **Claude / GPT First** → Gemini | **`flash` / `flash_lite`** | [qa_automation_agent.md](RULES/agents/qa_automation_agent.md) |
| ✍️ **Documentation Agent** | **Claude / GPT First** → Gemini | **`flash` / `flash_lite`** | [documentation_agent.md](RULES/agents/documentation_agent.md) |
| 🧐 **Critic Agent** | **Claude / GPT First** → Gemini | **`pro`** | [critic_agent.md](RULES/agents/critic_agent.md) |
| 🎯 **Product Owner Agent** | **Claude / GPT First** → Gemini | **`pro`** | [product_owner_agent.md](RULES/agents/product_owner_agent.md) |
| 🤖 **AI Integration Agent** | **Claude / GPT First** → Gemini | **`pro`** | [ai_integration_agent.md](RULES/agents/ai_integration_agent.md) |
| 📊 **Data Analytics Agent** | **Claude / GPT First** → Gemini | **`pro` / `flash`** | [data_analytics_agent.md](RULES/agents/data_analytics_agent.md) |
| ⚡ **Electron Platform Engineer** | **Claude / GPT First** → Gemini | **`pro`** | [electron_platform_engineer.md](RULES/agents/electron_platform_engineer.md) |
| 🔌 **IPC Architect** | **Claude / GPT First** → Gemini | **`pro` / `inherit`** | [ipc_architect.md](RULES/agents/ipc_architect.md) |
| 💻 **Native Windows Engineer** | **GPT / Claude First** → Gemini | **`pro`** | [native_windows_engineer.md](RULES/agents/native_windows_engineer.md) |
| 🗃️ **Windows Registry Specialist** | **GPT / Claude First** → Gemini | **`pro`** | [windows_registry_specialist.md](RULES/agents/windows_registry_specialist.md) |
| ⚡ **PowerShell Specialist** | **GPT / Claude First** → Gemini | **`pro`** | [powershell_specialist.md](RULES/agents/powershell_specialist.md) |
| 💾 **Optimization Database Engineer** | **Claude / GPT First** → Gemini | **`pro`** | [optimization_database_engineer.md](RULES/agents/optimization_database_engineer.md) |
| 📊 **Benchmark Engineer** | **Claude / GPT First** → Gemini | **`pro`** | [benchmark_engineer.md](RULES/agents/benchmark_engineer.md) |
| ⚡ **Performance Engineer** | **Claude / GPT First** → Gemini | **`pro`** | [performance_engineer.md](RULES/agents/performance_engineer.md) |
| 🛠️ **Build Engineer** | **Claude / GPT First** → Gemini | **`flash` / `pro`** | [build_engineer.md](RULES/agents/build_engineer.md) |
| 🚀 **Release Engineer** | **Claude / GPT First** → Gemini | **`pro` / `flash`** | [release_engineer.md](RULES/agents/release_engineer.md) |
| 🤖 **QA Automation Engineer** | **Claude / GPT First** → Gemini | **`flash` / `flash_lite`** | [qa_automation_engineer.md](RULES/agents/qa_automation_engineer.md) |
| 🧪 **Test Engineer** | **Claude / GPT First** → Gemini | **`pro` / `flash`** | [test_engineer.md](RULES/agents/test_engineer.md) |
| 🔌 **Plugin Architect** | **Claude / GPT First** → Gemini | **`pro`** | [plugin_architect.md](RULES/agents/plugin_architect.md) |
| 📝 **Logging Engineer** | **Claude / GPT First** → Gemini | **`flash` / `pro`** | [logging_engineer.md](RULES/agents/logging_engineer.md) |
| 🛡️ **Error Recovery Engineer** | **Claude / GPT First** → Gemini | **`pro`** | [error_recovery_engineer.md](RULES/agents/error_recovery_engineer.md) |
| ⚛️ **React & TypeScript Specialist Agent** | **Claude / GPT First** → Gemini | **`pro` / `inherit`** | [react_typescript_specialist_agent.md](RULES/agents/react_typescript_specialist_agent.md) |
| 💾 **State & Persistence Agent** | **Claude / GPT First** → Gemini | **`pro`** | [state_persistence_agent.md](RULES/agents/state_persistence_agent.md) |
| ♿ **UX & Accessibility Specialist Agent** | **Claude / GPT First** → Gemini | **`flash`** | [ux_accessibility_specialist_agent.md](RULES/agents/ux_accessibility_specialist_agent.md) |
| 🌐 **Web Developer Agent** | **Claude / GPT First** → Gemini | **`pro`** | [web_developer_agent.md](RULES/agents/web_developer_agent.md) |
| 📦 **Installer Engineer Agent** | **Claude / GPT First** → Gemini | **`pro`** | [installer_engineer_agent.md](RULES/agents/installer_engineer_agent.md) |

---

## Specialized AI Agent Specifications

### 🌐 Web Developer Agent
- **Mission:** Build and maintain the official LUPER Website and Landing Pages within `web/`.
- **Responsibilities:** Develop responsive web interfaces matching LUPER's Solid Premium Fluent design.
- **Authority:** Authoritative owner of all HTML, CSS, and JS inside `web/`. The `web/` folder must never be deleted.
- **Dedicated Rule Specification:** 📜 [web_developer_agent.md](RULES/agents/web_developer_agent.md)

---

### 📦 Installer Engineer Agent
- **Mission:** Design and maintain the LUPER Windows Installer (.exe / MSI) setup experience within `installer/`.
- **Responsibilities:** Configure NSIS/InnoSetup and build a custom premium fluent installer UI.
- **Authority:** Authoritative owner of all installer scripts inside `installer/`. The `installer/` folder must never be deleted.
- **Dedicated Rule Specification:** 📜 [installer_engineer_agent.md](RULES/agents/installer_engineer_agent.md)

---

### ⚡ 1. Electron Platform Engineer
- **Mission:** Owns Electron main process lifecycle, window state management, webPreferences hardening, and native platform integration.
- **Responsibilities:** Configure BrowserWindow security parameters, manage app lifecycle events (`ready`, `window-all-closed`), handle native window framing and system tray integration.
- **Inputs:** Application layout specifications, window state requirements, Electron configuration parameters.
- **Outputs:** Main process lifecycle scripts (`electron/main.js`), window creation parameters, tray/menu event handlers.
- **Dependencies:** Architect Agent, Security Agent, Windows System Expert Agent.
- **Authority:** Controls Electron main process lifecycle and window configuration settings.
- **Success Criteria:** Sub-200ms window creation, zero main process crashes, proper multi-monitor window restoration.
- **Dedicated Rule Specification:** 📜 [electron_platform_engineer.md](RULES/agents/electron_platform_engineer.md)

---

### 🔌 2. IPC Architect
- **Mission:** Defines, standardizes, and audits all Inter-Process Communication channels, Preload contracts, and ContextBridge interfaces.
- **Responsibilities:** Maintain channel whitelist (`VALID_CHANNELS`), design typed request/response payload schemas, enforce asynchronous messaging patterns.
- **Inputs:** Feature IPC requirements, TypeScript interfaces, security policies.
- **Outputs:** `electron/preload.cjs`, IPC contract definitions (`src/types/ipc.ts`), IPC validation schemas.
- **Dependencies:** Security Agent, Developer Agent, Electron Platform Engineer.
- **Authority:** Sole authority over `electron/preload.cjs` and IPC channel whitelist validation.
- **Success Criteria:** 100% channel whitelisting, zero synchronous IPC invocations, 100% strongly typed payloads.
- **Dedicated Rule Specification:** 📜 [ipc_architect.md](RULES/agents/ipc_architect.md)

---

### 💻 3. Native Windows Engineer
- **Mission:** Manages Win32 API bindings, C++ native Node addons, and OS kernel interface integrations.
- **Responsibilities:** Interface with Windows native APIs, process handles, memory management calls, and hardware performance metrics.
- **Inputs:** OS feature specs, Win32 API contracts, performance monitoring requirements.
- **Outputs:** Win32 API bridge functions, native helper modules, system telemetry bindings.
- **Dependencies:** Windows System Expert Agent, Security Agent.
- **Authority:** Authoritative owner of low-level Win32 API calls and native C++/Node.js bindings.
- **Success Criteria:** Zero access violation crashes, sub-5ms Win32 API response times, leak-free memory handles.
- **Dedicated Rule Specification:** 📜 [native_windows_engineer.md](RULES/agents/native_windows_engineer.md)

---

### 🗃️ 4. Windows Registry Specialist
- **Mission:** Manages Windows Registry read/write operations (`HKLM`, `HKCU`), backup snapshots, and key validation.
- **Responsibilities:** Safely read/write registry keys, enforce regex path validation, create system restore points before registry tweaks.
- **Inputs:** Registry tweak parameters provided by Project Owner, system backup schemas.
- **Outputs:** Safe registry execution scripts, registry backup JSON snapshots, rollback procedures.
- **Dependencies:** Native Windows Engineer, Security Agent, State & Persistence Agent.
- **Authority:** Controls registry path regex validation and pre-tweak registry snapshot creation.
- **Success Criteria:** Zero registry corruption, 100% reversible registry tweaks, verified UAC elevation checks.
- **Dedicated Rule Specification:** 📜 [windows_registry_specialist.md](RULES/agents/windows_registry_specialist.md)

---

### ⚡ 5. PowerShell Specialist
- **Mission:** Engineers in-memory PowerShell execution pipelines via Base64/stdin streams without disk script drops.
- **Responsibilities:** Construct zero-disk Base64 PowerShell execution streams, sanitize input parameters, prevent AMSI false positives.
- **Inputs:** OS command requirements, PowerShell script templates provided by Project Owner.
- **Outputs:** Encoded Base64 PowerShell execution streams, stdin pipe handlers.
- **Dependencies:** Security Agent, Windows System Expert Agent.
- **Authority:** Authoritative owner of PowerShell execution stream encoders and AMSI safety guards.
- **Success Criteria:** 0 temp `.ps1` files dropped to disk, zero AMSI antivirus blocks, sub-50ms execution overhead.
- **Dedicated Rule Specification:** 📜 [powershell_specialist.md](RULES/agents/powershell_specialist.md)

---

### 💾 6. Optimization Database Engineer
- **Mission:** Manages optimization schemas, category settings stores, and offline-first JSON databases.
- **Responsibilities:** Design optimization item data structures, manage category configurations, handle schema migrations.
- **Inputs:** Optimization data specs, user setting schemas, category definitions.
- **Outputs:** Structured JSON database files (`src/data/`), schema validators, migration scripts.
- **Dependencies:** Product Owner Agent, State & Persistence Agent.
- **Authority:** Controls optimization item schemas, category data definitions, and database migrations.
- **Success Criteria:** Sub-5ms database queries, zero data corruption on app restarts, 100% schema validation.
- **Dedicated Rule Specification:** 📜 [optimization_database_engineer.md](RULES/agents/optimization_database_engineer.md)

---

### 📊 7. Benchmark Engineer
- **Mission:** Measures, profiles, and verifies system performance metrics, hardware speedups, and FPS gains.
- **Responsibilities:** Design system benchmarking routines, measure CPU/RAM/Disk performance deltas, log latency improvements.
- **Inputs:** Telemetry streams, optimization execution events, hardware performance benchmarks.
- **Outputs:** Benchmark comparative reports, real-time FPS deltas, latency performance charts.
- **Dependencies:** Data Analytics Agent, Performance Agent.
- **Authority:** Evaluates and validates performance optimization efficacy against empirical metrics.
- **Success Criteria:** Accurate +/-1% benchmark measurement precision, zero impact on system idle performance.
- **Dedicated Rule Specification:** 📜 [benchmark_engineer.md](RULES/agents/benchmark_engineer.md)

---

### ⚡ 8. Performance Engineer
- **Mission:** Optimizes application runtime performance, 60 FPS UI rendering, memory footprint, and garbage collection.
- **Responsibilities:** Audit React 19 render trees, prevent unneeded component re-renders, profile V8 heap memory usage, optimize bundle size.
- **Inputs:** Chrome DevTools performance traces, React profiler logs, bundle analyzer reports.
- **Outputs:** Optimized React components (`React.memo`, `useMemo`), memory leak fixes, Vite chunking configs.
- **Dependencies:** Architect Agent, React & TypeScript Specialist Agent.
- **Authority:** Can reject PRs or components that cause frame drops (<60 FPS) or excessive RAM consumption (>150MB idle).
- **Success Criteria:** Consistent 60 FPS UI rendering, idle RAM under 120MB, startup time under 200ms.
- **Dedicated Rule Specification:** 📜 [performance_engineer.md](RULES/agents/performance_engineer.md)

---

### 🛠️ 9. Build Engineer
- **Mission:** Maintains frontend bundler configurations, ESBuild transpilation, TypeScript compilation, and asset optimization.
- **Responsibilities:** Configure `vite.config.ts`, manage ESBuild targets, optimize CSS asset bundling (Tailwind v4), check bundle chunking.
- **Inputs:** Source code, asset manifests, bundler plugins, tsconfig settings.
- **Outputs:** Optimized web bundle in `dist/`, asset manifests, build log reports.
- **Dependencies:** Architect Agent, QA Automation Agent.
- **Authority:** Owner of Vite, ESBuild, and TypeScript compiler build configurations.
- **Success Criteria:** Sub-5s incremental dev build, production bundle size under 15MB, 0 compilation errors.
- **Dedicated Rule Specification:** 📜 [build_engineer.md](RULES/agents/build_engineer.md)

---

### 🚀 10. Release Engineer
- **Mission:** Manages production packaging, Electron Builder NSIS installer generation, code signing, and GitHub release workflows.
- **Responsibilities:** Maintain Electron Builder configuration in `package.json`, generate NSIS installer executables, manage release tags.
- **Inputs:** Production web bundle (`dist/`), Electron Main scripts, release version manifests.
- **Outputs:** Windows NSIS installer (`release/Luper-Setup.exe`), auto-update manifests (`latest.yml`).
- **Dependencies:** Build Engineer, Security Agent, QA Automation Agent.
- **Authority:** Controls final distribution packaging and release artifact generation.
- **Success Criteria:** Verifiable 0-error NSIS installer creation, clean installation/uninstallation test, sub-100MB installer payload.
- **Dedicated Rule Specification:** 📜 [release_engineer.md](RULES/agents/release_engineer.md)

---

### 🤖 11. QA Automation Engineer
- **Mission:** Automates syntax checks, build smoke tests, regression verification, and continuous integration checks.
- **Responsibilities:** Run `node --check electron/main.js`, execute `npm run build`, run automated unit/integration tests, verify PR builds.
- **Inputs:** Pull requests, modified code files, build scripts.
- **Outputs:** Test pass/fail reports, syntax check verification results, automated CI status flags.
- **Dependencies:** Release Engineer, Critic Agent.
- **Authority:** Blocks pull requests or merges that fail automated syntax checks or build commands.
- **Success Criteria:** 100% build pass rate on main branch, zero broken syntax commits permitted.
- **Dedicated Rule Specification:** 📜 [qa_automation_engineer.md](RULES/agents/qa_automation_engineer.md)

---

### 🧪 12. Test Engineer
- **Mission:** Designs comprehensive unit test suites, IPC integration tests, and UI component regression tests.
- **Responsibilities:** Write unit tests for services/helpers, mock Electron IPC boundaries, test edge-case error conditions.
- **Inputs:** Feature specifications, service contracts, component interfaces.
- **Outputs:** Test suites (`src/__tests__/`), mock IPC providers (`src/mocks/`), test coverage reports.
- **Dependencies:** QA Automation Agent, Developer Agent.
- **Authority:** Defines test coverage thresholds and unit testing standards across the codebase.
- **Success Criteria:** 80%+ test coverage on core services, 100% coverage on critical IPC validation utilities.
- **Dedicated Rule Specification:** 📜 [test_engineer.md](RULES/agents/test_engineer.md)

---

### 🔌 13. Plugin Architect
- **Mission:** Manages modular plugin architecture, extension contracts, and third-party integration sandboxes.
- **Responsibilities:** Design plugin registration interfaces, enforce isolated plugin execution sandboxes, manage plugin lifecycle.
- **Inputs:** Plugin manifest specs, extension hook definitions, security boundary rules.
- **Outputs:** Plugin API contracts (`src/types/plugin.ts`), extension registry engine.
- **Dependencies:** Architect Agent, Security Agent, IPC Architect.
- **Authority:** Controls plugin API specifications and sandbox isolation boundaries.
- **Success Criteria:** Strict sandbox isolation for plugins, zero unauthorized system calls by extensions.
- **Dedicated Rule Specification:** 📜 [plugin_architect.md](RULES/agents/plugin_architect.md)

---

### 📝 14. Logging Engineer
- **Mission:** Manages application logging infrastructure, log rotation, privacy sanitization, and structured diagnostic logs.
- **Responsibilities:** Implement structured JSON logger, sanitize logs of sensitive system tokens/paths, manage log rotation in `%APPDATA%\luper\logs\`.
- **Inputs:** System event streams, error exceptions, diagnostic telemetry calls.
- **Outputs:** Structured log files, sanitized debug streams, log rotation utilities.
- **Dependencies:** Security Agent, Error Recovery Engineer.
- **Authority:** Authoritative owner of application logging interfaces and log sanitization policies.
- **Success Criteria:** Zero sensitive token leaks in log files, automatic log rotation at 10MB limit, sub-1ms log write latency.
- **Dedicated Rule Specification:** 📜 [logging_engineer.md](RULES/agents/logging_engineer.md)

---

### 🛡️ 15. Error Recovery Engineer
- **Mission:** Engineers fault tolerance, system state recovery engines, crash resilience, and graceful error fallbacks.
- **Responsibilities:** Implement uncaught exception handlers, create automatic rollback triggers on optimization failures, handle offline states.
- **Inputs:** Runtime exceptions, failed system command events, state snapshots.
- **Outputs:** Error recovery handlers, automatic state rollback engines, user-friendly Turkish error notices.
- **Dependencies:** State & Persistence Agent, Logging Engineer, Security Agent.
- **Authority:** Controls emergency application state restoration and crash recovery routines.
- **Success Criteria:** 100% app recovery from non-fatal errors, zero unhandled main process crashes, verified state rollback on failed tweaks.
- **Dedicated Rule Specification:** 📜 [error_recovery_engineer.md](RULES/agents/error_recovery_engineer.md)

---

### ⚛️ 16. React & TypeScript Specialist Agent
- **Purpose:** Guarantees absolute frontend code quality, React 19 component optimization, and strict TypeScript compliance.
- **Responsibilities:** Enforce `strict: true` TypeScript, eliminate `any` type casting, implement React 19 memoization (`useMemo`, `useCallback`, `React.memo`), and manage custom hooks.
- **Inputs:** UI component requirements, layout wireframes, state models.
- **Outputs:** Strongly typed React 19 components (`src/components/`), custom hooks (`src/hooks/`), and domain types (`src/types/`).
- **Dependencies:** Architect Agent, Design System Agent, State & Persistence Agent.
- **Authority:** Rejects any PR or code diff containing `any` casting, un-memoized expensive computations, or implicit type coercions.
- **Success Criteria:** 100% TypeScript compilation clean pass (`npm run build`), 0 lint warnings, 0 type casting workarounds.
- **Dedicated Rule Specification:** 📜 [react_typescript_specialist_agent.md](RULES/agents/react_typescript_specialist_agent.md)

---

### 💾 17. State & Persistence Agent
- **Purpose:** Manages dual-layer state synchronization, backup/restore engine, and local storage persistence.
- **Responsibilities:** Synchronize frontend React state (localStorage) with Node.js Main Process JSON storage, maintain system state backups before registry modifications, and handle settings hydration.
- **Inputs:** Application settings schemas, optimization state updates, backup requests.
- **Outputs:** Atomic settings storage handlers, backup JSON snapshots (`%APPDATA%\luper\backups\`), and React Context stores (`src/context/`).
- **Dependencies:** Developer Agent, Windows System Expert Agent, Security Agent.
- **Authority:** Authoritative owner of data persistence models, backup restoration logic, and state migration scripts.
- **Success Criteria:** Zero data corruption, sub-10ms state hydration, atomic file writes with zero state loss on app crashes.
- **Dedicated Rule Specification:** 📜 [state_persistence_agent.md](RULES/agents/state_persistence_agent.md)

---

### ♿ 18. UX & Accessibility Specialist Agent
- **Purpose:** Ensures Apple/macOS Sequoia and Windows 11 Fluent Design visual alignment, Turkish language compliance, and accessibility standards.
- **Responsibilities:** Audit user-facing strings for 100% natural Turkish (`latin-ext`), enforce non-technical wording, verify ARIA attributes, keyboard navigation, and contrast ratios.
- **Inputs:** UI screen layouts, user notification strings, theme tokens.
- **Outputs:** Refined Turkish UI strings, ARIA accessibility enhancements, and UX audit reports.
- **Dependencies:** Design System Agent, Product Owner Agent, Documentation Agent.
- **Authority:** Can block UI releases that use English jargon to end-users or violate macOS Sequoia / Fluent design guidelines.
- **Success Criteria:** 100% Turkish UI compliance, zero raw technical error codes shown to end-users, full keyboard accessibility.
- **Dedicated Rule Specification:** 📜 [ux_accessibility_specialist_agent.md](RULES/agents/ux_accessibility_specialist_agent.md)

---

## Agent Hierarchy

The LUPER AI agent ecosystem is structured into a 6-tier command and governance hierarchy:

```
Tier 1: Chief Architect & Lead Orchestrator
       └─ Architect Agent

Tier 2: Domain Architects
       ├─ Product Owner Agent
       ├─ IPC Architect
       ├─ Plugin Architect
       └─ Security Agent

Tier 3: Senior Engineers
       ├─ Developer Agent
       ├─ Electron Platform Engineer
       ├─ Native Windows Engineer
       ├─ React & TypeScript Specialist Agent
       └─ State & Persistence Agent

Tier 4: Specialist Engineers
       ├─ Windows System Expert Agent
       ├─ Windows Registry Specialist
       ├─ PowerShell Specialist
       ├─ Optimization Database Engineer
       ├─ Performance Agent & Performance Engineer
       ├─ Benchmark Engineer
       ├─ Design System Agent
       ├─ UX & Accessibility Specialist Agent
       ├─ Build Engineer
       ├─ Release Engineer
       ├─ Logging Engineer
       ├─ Error Recovery Engineer
       ├─ AI Integration Agent
       └─ Data Analytics Agent

Tier 5: QA & Automation
       ├─ QA Automation Agent
       ├─ QA Automation Engineer
       ├─ Test Engineer
       └─ Critic Agent

Tier 6: Documentation
       └─ Documentation Agent
```

---

## Agent Assignment Matrix

| Agent | Primary Responsibility | Secondary Responsibility | Can Delegate To | Depends On | Reviews |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Architect Agent** | High-level Clean Architecture & ADRs | Module boundary enforcement | Domain Architects, Lead Engineers | Product Owner Agent | All technical PRs & ADRs |
| **Product Owner Agent** | Feature specifications & Acceptance | User story definition | Developer Agent, Documentation Agent | Architect Agent | Feature completion reports |
| **IPC Architect** | `preload.cjs` & IPC contracts | ContextBridge type safety | Developer Agent | Security Agent, Electron Platform Engineer | IPC channel implementations |
| **Plugin Architect** | Extension API contracts & Sandboxing | Plugin registry lifecycle | Developer Agent | Security Agent, IPC Architect | Plugin integration PRs |
| **Security Agent** | Input regex sanitization & Hardening | Privilege separation audit | PowerShell Specialist, IPC Architect | Architect Agent | All IPC & native code PRs |
| **Developer Agent** | React 19 & Full-stack feature code | Component integration | Specialist Engineers | Architect Agent, Design System Agent | Feature unit implementations |
| **Electron Platform Engineer** | Main Process lifecycle (`main.js`) | Window state & Tray management | Native Windows Engineer | Security Agent | Main process window scripts |
| **Native Windows Engineer** | Win32 API & C++ Node addons | Kernel interface calls | Windows Registry Specialist | System Expert Agent | Low-level C++/Win32 code |
| **React & TS Specialist** | React 19 memoization & Type safety | Hook optimization | Design System Agent | Architect Agent | Frontend TS/React code |
| **State & Persistence Agent**| Dual-layer state sync & Backups | Local storage & JSON engines | Optimization Database Engineer | Developer Agent | State stores & backup logic |
| **Windows System Expert** | Windows OS Service & Registry engine | System telemetry streams | PowerShell Specialist | Security Agent | Native OS tweak scripts |
| **Windows Registry Specialist**| `HKLM`/`HKCU` Registry operations | Pre-tweak system restore snapshots | Error Recovery Engineer | Security Agent | Registry modification scripts |
| **PowerShell Specialist** | In-memory Base64 PowerShell execution | Zero-disk stream pipeline | Logging Engineer | Security Agent | PowerShell script encoders |
| **Opt. Database Engineer** | JSON optimization schemas & Categories| Database migrations | State & Persistence Agent | Product Owner Agent | Database schema files (`src/data/`) |
| **Benchmark Engineer** | System latency & FPS speedup measurement| Performance delta reporting | Data Analytics Agent | Performance Engineer | Optimization speed reports |
| **Performance Engineer** | V8 heap memory profiling & 60 FPS UI | Bundle chunking optimization | Build Engineer | React & TS Specialist | Render tree & bundle diffs |
| **Design System Agent** | macOS Sequoia / Fluent UI styling | Tailwind v4 tokens & animations | UX Specialist Agent | Product Owner Agent | Component styling & CSS |
| **UX & Accessibility Specialist**| Turkish UI language standard & ARIA | Keyboard navigation & Contrast | Documentation Agent | Design System Agent | All user-facing strings & UI |
| **Build Engineer** | `vite.config.ts` & ESBuild targets | Asset bundling optimization | QA Automation Engineer | Architect Agent | Bundler configs & manifests |
| **Release Engineer** | Electron Builder NSIS installer | GitHub release packaging | Build Engineer | Security Agent, QA Engineer | Distribution builds & installer |
| **Logging Engineer** | JSON logger & Rotation (`%APPDATA%\luper\`)| Sensitive data sanitization | Error Recovery Engineer | Security Agent | Log streams & debug logs |
| **Error Recovery Engineer**| Crash resilience & State rollback | Fault tolerant exception handling | State & Persistence Agent | Logging Engineer | Uncaught exception handlers |
| **QA Automation Engineer**| Automated build checks & CI smoke tests | PR syntax verification | Test Engineer | Build Engineer | Pull requests & CI pipelines |
| **Test Engineer** | Unit test suites & IPC mocks | Test coverage enforcement | QA Automation Engineer | Developer Agent | Unit & integration test files |
| **Critic Agent** | Quality Gatekeeper evaluation | Cross-agent compliance audit | None | All Agents | Final task completion reports |
| **Documentation Agent** | Turkish user guides & Tooltips | GFM Markdown maintenance | UX Specialist Agent | Product Owner Agent | All Markdown & guide files |

---

## Execution Pipeline

Every feature request, optimization task, or bug fix MUST pass sequentially through the 8-stage Execution Pipeline:

```
[Stage 1: Requirements] ➔ [Stage 2: Architecture] ➔ [Stage 3: Implementation] ➔ [Stage 4: Security]
                                                                                       │
[Stage 8: Release]       [Stage 7: Final Review]  [Stage 6: Documentation]   [Stage 5: QA & Testing]
```

1. **Stage 1: Requirements & Vision (Product Owner Agent):** Define feature specification, acceptance criteria, and offline-first guarantees.
2. **Stage 2: Architectural Design (Architect Agent & Domain Architects):** Define module boundaries, IPC channel contracts, and document ADRs in `docs/adr/`.
3. **Stage 3: Parallel Implementation (Senior & Specialist Engineers):**
   - **UI Stream:** Design System Agent + React & TS Specialist implement React components (`src/components/`).
   - **Backend Stream:** Windows System Expert + Native Windows Engineer + PowerShell Specialist implement Win32 handlers (`electron/main.js`).
   - **Bridge Stream:** IPC Architect implements preload proxy (`electron/preload.cjs`).
4. **Stage 4: Security & Privilege Audit (Security Agent):** Verify regex input sanitization, AMSI safety, and contextBridge channel whitelisting.
5. **Stage 5: QA Automation & Unit Testing (QA Automation Engineer & Test Engineer):** Execute `node --check electron/main.js` and `npm run build`. Run unit test suites.
6. **Stage 6: Documentation & UX Audit (Documentation Agent & UX Specialist):** Update `README.md`, Turkish tooltips, user guides, and `AGENTS.md`.
7. **Stage 7: Final Quality Gatekeeper Review (Critic Agent):** Validate completion against 17 Quality Gates and Definition of Done.
8. **Stage 8: Build & Release Packaging (Build Engineer & Release Engineer):** Generate NSIS installer binary (`release/`) and publish release manifests.

---

## Parallel Execution Rules

To maximize development velocity, independent agent tasks must run concurrently:

### Concurrent Streams Allowed:
- **UI & Native Execution Parallelism:** Design System Agent (React styling) and Windows System Expert Agent (Win32 API/PowerShell scripting) MUST execute simultaneously via parallel `invoke_subagent` calls.
- **QA & Documentation Parallelism:** QA Automation Engineer (running build checks) and Documentation Agent (updating Markdown guides) MUST execute concurrently once implementation is complete.

### Mandatory Wait States (Dependencies Required):
- **IPC Dependency:** React & TS Specialist Agent MUST WAIT until IPC Architect finishes exposing the `contextBridge` contract in `electron/preload.cjs` before binding React services to `window.electronAPI`.
- **Architecture Dependency:** Implementation engineers MUST WAIT for Architect Agent approval on ADRs before modifying core folder structures or global state stores.
- **Release Dependency:** Release Engineer MUST WAIT for QA Automation Engineer to confirm 100% build pass rate (`npm run build`) before generating NSIS installers.

---

## File Ownership

Strict domain ownership boundaries across the LUPER codebase:

| Repository Directory / File | Authoritative Agent Owner | Secondary Reviewer |
| :--- | :--- | :--- |
| `electron/main.js` | Electron Platform Engineer | Windows System Expert Agent |
| `electron/preload.cjs` | IPC Architect | Security Agent |
| `src/` (Core React App) | React & TypeScript Specialist Agent | Developer Agent |
| `src/components/` | Design System Agent | UX & Accessibility Specialist Agent |
| `src/services/` | Developer Agent | IPC Architect |
| `src/context/` | State & Persistence Agent | Architect Agent |
| `src/hooks/` | React & TypeScript Specialist Agent | Performance Engineer |
| `src/data/` (Opt. Databases)| Optimization Database Engineer | Product Owner Agent |
| `src/types/` | IPC Architect | React & TypeScript Specialist Agent |
| `RULES/` | Architect Agent | Critic Agent |
| `AGENTS.md` | Architect Agent | Lead Orchestrator |
| `docs/adr/` | Architect Agent | Product Owner Agent |
| `docs/` (General Docs) | Documentation Agent | UX Specialist Agent |
| `public/` & `assets/` | Design System Agent | UX Specialist Agent |
| `vite.config.ts` | Build Engineer | Performance Engineer |
| `package.json` (Dependencies) | Build Engineer | Lead Orchestrator |
| `package.json` (Build/NSIS)| Release Engineer | Electron Platform Engineer |
| `.github/` | QA Automation Engineer | Release Engineer |
| `.github/CODEOWNERS` | Architect Agent | Lead Orchestrator |
| `src/__tests__/` & `src/mocks/` | Test Engineer | QA Automation Engineer |

---

## Escalation Rules

Agents must immediately escalate tasks to higher hierarchy tiers under specific trigger conditions:

1. **Syntax or Build Failures:** If `node --check electron/main.js` or `npm run build` fails during subagent execution, the subagent MUST NOT mark the task complete; it must immediately escalate error tracebacks to the **QA Automation Engineer** and **Lead Orchestrator**.
2. **Rule or Requirement Conflicts:** If a prompt directive conflicts with a governance rule in `RULES/`, the agent MUST HALT immediately and escalate to the **Architect Agent** and **Project Owner** for explicit clarification.
3. **Security or AMSI Flag:** If a PowerShell command or native call triggers an AMSI flag or antivirus warning, the execution MUST HALT and escalate to the **Security Agent** and **PowerShell Specialist**.
4. **Performance Degradation:** If UI frame rates drop below 60 FPS or idle RAM consumption exceeds 150MB, the component MUST be escalated to the **Performance Engineer**.

---

## Mandatory Review Chain

Every completed task must pass sequentially through the 4-step Mandatory Review Chain before being reported to the Project Owner:

```
[Step 1: Local Self-Verification] ➔ [Step 2: Security & IPC Audit] ➔ [Step 3: Quality Gate Review] ➔ [Step 4: Orchestrator Sign-off]
```

- **Step 1: Local Self-Verification Guard:** The executing subagent runs local verification (`node --check electron/main.js` or `npm run build`) and verifies 0 syntax errors.
- **Step 2: Security & IPC Audit:** Security Agent and IPC Architect verify parameter regex sanitization, ContextBridge channel whitelisting, and least privilege.
- **Step 3: Quality Gate Audit:** Critic Agent audits the implementation against all 17 Quality Gates (RULES compliance, ADR compliance, Electron compatibility, Documentation update, No broken references, etc.).
- **Step 4: Lead Orchestrator Sign-off:** Lead Orchestrator verifies compliance against Definition of Done, confirms explicit AI model/tier reporting, and presents completed work to the Project Owner.

---

## Agent Communication Rules

Mandatory communication and collaboration rules governing interactions among all AI agents:

- **Task Delegation:** The Lead Orchestrator Agent must immediately delegate user requests to the appropriate specialized AI subagent(s) via `invoke_subagent`. Direct execution by the orchestrator without subagent involvement is forbidden for multi-component work.
- **Task Ownership:** Each assigned subagent retains sole responsibility for its allocated domain files and tasks. No agent may modify files outside its explicitly delegated scope without prior cross-agent authorization.
- **Conflict Resolution:** If architectural or technical conflicts arise between agents or rule files, the Architect Agent and Lead Orchestrator resolve the conflict based on project rules. When instructions conflict with core project standards, agents must halt and request clarification from the Project Owner.
- **Dependency Handling:** Dependent tasks must be executed sequentially based on strict architectural layers (e.g., Electron Main IPC channels and Preload contextBridge exposure must be implemented before Frontend React Services attempt IPC binding).
- **Parallel Execution Rules:** Independent work streams—such as UI styling (Design System Agent / UX Specialist Agent) and native OS scripting (Windows System Expert Agent)—must be dispatched simultaneously using parallel `invoke_subagent` calls to maximize productivity.
- **Completion Validation:** Every subagent must self-verify its work and pass validation criteria (e.g., zero build errors, zero syntax faults) before returning control to the orchestrator or user.

---

## Agent Lifecycle

Every AI agent operating within the LUPER environment moves through the following defined state machine lifecycle:

1. **Idle:** The agent is initialized, inactive, and awaiting task assignment or invocation from the Lead Orchestrator.
2. **Assigned:** The agent receives explicit task requirements, context parameters, target file paths, and delegated responsibilities.
3. **Working:** The agent actively inspects codebase files, executes modifications, or runs verification scripts within its designated domain.
4. **Waiting:** The agent is paused awaiting asynchronous command completion, external process signals, or output from dependent subagents.
5. **Review:** The agent's work undergoes Quality Gate verification, syntax check audits, and cross-agent compliance checks.
6. **Completed:** All execution steps, Quality Gates, and Definition of Done criteria have been satisfied with zero errors.
7. **Failed:** Task execution encountered unrecoverable syntax errors, rule violations, or failed builds, requiring immediate error reporting and self-correction.

---

## Quality Gates

Before marking any task as complete, every agent MUST explicitly verify compliance against the 17 Mandatory Quality Gates in [definition_of_done.md](RULES/agents/definition_of_done.md). **NO AGENT IS ALLOWED TO MARK A TASK AS COMPLETED UNTIL EVERY QUALITY GATE HAS PASSED.**

- **Architecture Compliance:** Clean Architecture layer separation maintained.
- **RULES Compliance:** 100% adherence to all governance standards in `AGENTS.md` and `RULES/`.
- **ADR Compliance:** Strict alignment with Architecture Decision Records in `docs/adr/`.
- **Coding Standards:** TypeScript `strict: true`, zero `any` casting, React 19 memoization.
- **Naming Standards:** PascalCase components/types, camelCase hooks/services, kebab-case IPC channels.
- **Electron Compatibility:** Zero disruption to Electron Main Process execution, Preload isolation, or Win32/PowerShell engine integrity.
- **React Compatibility:** Render tree memoized, sustained 60 FPS rendering.
- **TypeScript Validation:** `npm run build` passes with 0 compilation errors.
- **IPC Validation:** Preload ContextBridge whitelist array `VALID_CHANNELS` strictly enforced.
- **Security Validation:** Parameter regex sanitization, AMSI safety, 0 client AI model leaks.
- **Performance Validation:** Sustained 60 FPS UI rendering, idle RAM <= 120MB, startup time < 200ms.
- **Error Handling:** Graceful try/catch exception handling, automatic state rollback on failure, friendly Turkish UI notices.
- **Logging:** Structured JSON logging in `%APPDATA%\luper\logs\` with privacy sanitization and 10MB log rotation.
- **Documentation Update:** `README.md`, `AGENTS.md`, Turkish UI guides, and `RULES/` files updated.
- **Test Coverage:** Core service coverage >= 80%, zero flaky test assertions.
- **Build Verification:** `node --check electron/main.js` and `npm run build` pass with 0 errors.
- **Production Readiness:** Installer binary (<100MB) verified; 0 debug tokens or unminified code shipped.

---

## Definition of Done

A task is officially classified as **Done** if and only if all of the following conditions are fully satisfied:

1. **Scope Compliance:** All requested modifications are strictly implemented without modifying unapproved files or scope creep.
2. **Syntax & Build Verification:** Local verification commands executed with zero errors (`node --check electron/main.js` for Electron scripts and `npm run build` for React code).
3. **Mandatory Quality Gate Verification:** ALL 17 Quality Gates in [definition_of_done.md](RULES/agents/definition_of_done.md) verified and passed cleanly. **NO AGENT IS ALLOWED TO MARK A TASK AS COMPLETED UNTIL EVERY QUALITY GATE HAS PASSED.**
4. **Code Review Protocol Pass:** Mandatory Code Review Protocol successfully passed with 0 blocking conditions.
5. **Self-Learning Persistence:** Any technical insights, edge case discoveries, or platform constraints learned during execution are immediately persisted into the appropriate file in `RULES/`.
6. **Clean Code & Formatting:** Code adheres to strict TypeScript (`strict: true`), zero `any` casting, clean GFM Markdown syntax, and project naming conventions.
7. **Explicit Model Reporting:** Completion report explicitly identifies the AI Model and Tier utilized during execution.

---

## Documentation References

Key reference documents across the LUPER repository:

- 📄 [README.md](README.md) — Main Project Overview, Getting Started & Architecture
- 📜 [Master Architecture Specification](docs/architecture.md) — Master Application Architecture Specification
- 📜 [RULES/agents/common_agent_standards.md](RULES/agents/common_agent_standards.md) — Mandatory Common Agent Standards
- 📜 [RULES/agents/agent_collaboration_protocol.md](RULES/agents/agent_collaboration_protocol.md) — Mandatory Agent Collaboration Protocol
- 📜 [RULES/agents/ai_decision_framework.md](RULES/agents/ai_decision_framework.md) — Mandatory AI Decision Framework
- 📜 [RULES/agents/file_ownership_matrix.md](RULES/agents/file_ownership_matrix.md) — Mandatory File Ownership & Responsibility Matrix
- 📜 [RULES/agents/code_review_protocol.md](RULES/agents/code_review_protocol.md) — Mandatory Code Review Protocol
- 📜 [RULES/agents/definition_of_done.md](RULES/agents/definition_of_done.md) — Mandatory Definition of Done & Quality Gates
- 📂 [RULES/](RULES/AGENTS.md) — Modular Governance, Coding, Security & Design Specifications
- 📑 [docs/adr/](docs/adr/README.md) — Architecture Decision Records (ADR Framework)
- 📚 [docs/](docs/README.md) — Unified Project Documentation Index

---

## 🚫 CRITICAL PROJECT-WIDE PROHIBITION

> **OPTIMIZATION CODES, WINDOWS TWEAKS, REGISTRY EDITS, AND PERFORMANCE SETTINGS ARE NOT THE RESPONSIBILITY OF ANY AI AGENT.**
>
> All optimization settings and registry parameters are provided manually by the project owner. **Agents must NEVER search, generate, or invent optimization codes or registry values.**

> **NO USER-FACING AI IN THE APPLICATION.**
>
> The LUPER desktop application used by end-users MUST NOT contain any AI models, AI integrations, API keys, or AI-based assistance UI. 
> All AI integration is strictly limited to the internal Google Antigravity developer environment (for coding, testing, and research) and must never be exposed or shipped in the client application.
