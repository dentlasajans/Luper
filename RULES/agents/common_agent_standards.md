# Common Agent Standards

# Mission
Establishes universal, mandatory engineering, governance, communication, and security standards that every AI agent operating within the LUPER platform ecosystem MUST follow strictly.

# Core Principles
1. **Domain Ownership:** Every agent operates strictly within its designated area of expertise.
2. **Subagent Delegation:** The Lead Orchestrator delegates execution tasks immediately via `invoke_subagent`.
3. **Model Priority & Selection:** Always utilize **Claude** & **GPT** first for primary reasoning, architecture, and code execution until quota limits are hit, then utilize **Gemini** as secondary/fallback. Use `flash`/`flash_lite` tier for quick searches and `pro` tier for deep architectural engineering.
4. **Mandatory Model Identification:** Every report MUST explicitly state the AI Model and Tier utilized.
5. **Offline-First Policy:** The client application MUST operate 100% offline without remote cloud locks or user-facing AI models.
6. **No Optimization Code Invention:** Agents must NEVER search for, invent, or generate registry tweaks or optimization values (provided manually by Project Owner).

# Communication Standards
- Agent-to-agent communication is conducted via `send_message` using unique conversation IDs.
- Never use `send_message` to communicate with the end-user.
- Maintain professional, concise, natural Turkish language for user-facing UI tooltips and documentation.
- Maintain clear GitHub Flavored Markdown (GFM) formatting for all reports and rule files.

# Coding Standards
- **TypeScript Strictness:** Enforce `strict: true` across all TypeScript files.
- **Zero Type Casting Workarounds:** Absolute prohibition of `any` type assertions or coercions.
- **React 19 Memoization:** Wrap expensive calculations in `useMemo` and functions in `useCallback`. Use `React.memo` for pure presentational components.
- **IPC Asynchrony:** Use asynchronous two-way (`invoke`/`handle`) or one-way streaming (`send`/`on`) IPC patterns only.

# Documentation Standards
- Keep `README.md`, `AGENTS.md`, `RULES/`, and `docs/` synchronized across all architectural changes.
- Maintain clickable markdown file links (`file:///...`) for all referenced files.
- Document architectural decisions in `docs/adr/` following `ADR-TEMPLATE.md`.

# Naming Standards
- **Components:** PascalCase (e.g. `SystemStatusCard.tsx`).
- **Custom Hooks:** camelCase prefixed with `use` (e.g. `useSystemMetrics.ts`).
- **Services:** camelCase suffixed with `Service` (e.g. `optimizationService.ts`).
- **IPC Channels:** kebab-case strings (e.g. `apply-optimization`, `get-system-status`).
- **Types & Interfaces:** PascalCase (e.g. `OptimizationItem`, `SystemStatusPayload`).

# Error Handling Standards
- Main Process errors must be caught gracefully and logged asynchronously without crashing the application.
- Never display raw developer stack traces or technical error codes (e.g. `ENOENT`, `0x80070005`) to end-users.
- Implement automatic state rollback triggers when system optimization operations fail.

# Validation Standards
- Every input argument passed via IPC or CLI must be validated against strict regex whitelist patterns.
- Preload ContextBridge interfaces must strictly validate channel whitelist array `VALID_CHANNELS`.
- Subagents modifying Electron scripts MUST execute `node --check electron/main.js`.
- Subagents modifying React code MUST execute `npm run build`.

# Review Standards
- Every task deliverable must pass the 4-step Mandatory Review Chain (Self-Verification Guard ➔ Security & IPC Audit ➔ Quality Gate Review ➔ Orchestrator Sign-off).
- Critic Agent holds veto authority over any task failing any of the 5 Quality Gates.

# Security Standards
- Maintain strict Electron isolation: `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`.
- Zero temporary `.ps1` files dropped to disk (use Base64 UTF-16LE in-memory stdin streams).
- Enforce least privilege separation and AMSI false-positive prevention.
- Zero user-facing AI models or API key exposures in client desktop application.

# Performance Standards
- Sunk 60 FPS UI rendering sustained without frame drops.
- Idle RAM footprint <= 120MB; window creation time < 200ms.
- Production web bundle size <= 15MB; NSIS installer size < 100MB.

# Logging Standards
- Log entries formatted as structured JSON with ISO timestamps and severity levels (`INFO`, `WARN`, `ERROR`).
- Log files stored in `%APPDATA%\luper\logs\` with automatic log rotation at 10MB limits.
- Sanitize all log streams to prevent sensitive user paths or tokens from leaking.

# Decision-Making Rules
- When prompt directives conflict with repository rules, HALT immediately and request clarification from Project Owner.
- Never make arbitrary assumptions regarding unapproved business logic or OS tweaks.

# Collaboration Rules
- Work streams must execute in parallel where independent (e.g. UI styling + Win32/PowerShell native scripting).
- Dependent stages must wait for upstream completion (e.g. IPC Preload bridge exposed before React binding).

# Escalation Rules
- Escalate build or syntax failures to QA Automation Engineer and Lead Orchestrator.
- Escalate AMSI or antivirus flags to Security Agent and PowerShell Specialist.
- Escalate frame drops (<60 FPS) or V8 heap memory leaks (>150MB) to Performance Engineer.

# Execution & Command Standards
- TÜM ALT AJANLAR (SUBAGENTS) İŞİNİ VE RAPORUNU TAMAMLAMADAN `npm start` VEYA HERHANGİ BİR UYGULAMA BAŞLATMA KOMUTU ÇALIŞTIRILAMAZ. Önce tüm subagent'ların kod modifikasyonları ve doğrulama raporları beklenir, ardından derleme kontrolü yapılıp uygulama başlatılır.

# Completion Rules
- A task is classified as complete ONLY after local build verification passes with 0 errors.
- Any new technical constraint or bug lesson learned MUST be persisted to the appropriate `RULES/` markdown document.

# Definition of Done
1. Scope compliance strictly implemented without scope creep.
2. Local syntax and build commands pass with 0 errors (`node --check` and `npm run build`).
3. 5 Quality Gates passed (RULES compliance, ADR compliance, Electron compatibility, Documentation update, No broken references).
4. Self-learning technical lessons persisted in `RULES/`.
5. Code formatted under strict TypeScript (`strict: true`) and GFM Markdown syntax.
6. Completion report explicitly states AI Model and Tier utilized.

# Quality Requirements
- 100% adherence to governance constitution in `AGENTS.md` and rule specifications in `RULES/`.
- 100% natural Turkish language for user-facing UI strings and tooltips.
- 0 broken relative Markdown links across repository documentation.

# Mandatory Checklists
- [ ] Read `AGENTS.md` and `RULES/` before starting work.
- [ ] Execute subagent delegation via `invoke_subagent`.
- [ ] Verify code locally (`node --check electron/main.js` and/or `npm run build`).
- [ ] Audit against 5 Quality Gates and Definition of Done.
- [ ] Explicitly state AI Model and Tier in task completion report.

# Related Documents
- [definition_of_done.md](definition_of_done.md)
- [code_review_protocol.md](code_review_protocol.md)
- [file_ownership_matrix.md](file_ownership_matrix.md)
- [ai_decision_framework.md](ai_decision_framework.md)
- [agent_collaboration_protocol.md](agent_collaboration_protocol.md)
- [AGENTS.md](../../AGENTS.md)
- [RULES/coding_rules.md](../coding_rules.md)
- [RULES/security_rules.md](../security_rules.md)
- [RULES/electron_rules.md](../electron_rules.md)
- [RULES/ipc_rules.md](../ipc_rules.md)
- [RULES/performance_rules.md](../performance_rules.md)
