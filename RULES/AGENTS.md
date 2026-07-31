# LUPER Project — Master AI Rule System & Entry Point

This document serves as the **mandatory entry point** for all AI agents participating in the development, architecture, design, and maintenance of **LUPER** (Windows Operating System Optimization & Performance Platform built with Electron, Node.js, React 19, and TypeScript).

---

## 🛑 MANDATORY WORKFLOW FOR ALL AGENTS

Before performing ANY task, reading ANY code, or modifying ANY file:

1. **Always Read `AGENTS.md` First:** Understand the entry point rules and team boundaries.
2. **Read `RULES/master_governance.md`:** (if present) and **EVERY** Markdown file inside `RULES/` directory:
   - All shared rule files (`coding_rules.md`, `design_rules.md`, `project_rules.md`, `ui_ux_rules.md`, `git_rules.md`, `release_rules.md`, `naming_rules.md`, `documentation_rules.md`, `security_rules.md`, `performance_rules.md`, `electron_rules.md`, `ipc_rules.md`, `api_rules.md`, `telemetry_rules.md`, `plugin_rules.md`, `localization_rules.md`, `review_rules.md`, `code_quality_rules.md`, `architecture_decision_rules.md`, `migration_rules.md`, `update_rules.md`, `license_rules.md`, `privacy_rules.md`, `observability_rules.md`, `feature_rules.md`).
   - Your dedicated agent spec file (`RULES/<your_agent_name>.md`).
3. **Mandatory Subagent Delegation & Model Priority Order:** Whenever the Project Owner assigns any prompt, feature, bug fix, refactoring, design, or audit task, IMMEDIATELY delegate execution to the specialized AI subagent(s) via `invoke_subagent`.
   - **Model Priority Order Rule:** Always utilize **Claude** & **GPT** first for primary reasoning, architecture, and code execution until quota limits are hit, then utilize **Gemini** as the secondary/fallback engine.
   - **Model Tier Distribution Rule:** Appropriately distribute `pro` tier for deep reasoning/architecture/security, `flash` / `flash_lite` tier for fast lookups/builds/docs, and `inherit` tier for general task continuity.
   - **Mandatory Model Identification Rule:** Every agent/subagent MUST explicitly state which AI Model & Tier it utilized in its header/report (e.g. `Model Used: Claude 3.7 Sonnet (pro tier)` or `Model Used: GPT-4o (pro tier)` or `Model Used: Gemini 2.0 Flash (flash tier)`).
4. **Treat All Rule Files as Mandatory:** No rule may be bypassed, ignored, or assumed optional.
5. **Never Ignore Project Rules:** If a directive conflicts with a rule file, **stop and ask the project owner for explicit clarification**.
6. **Never Assume Missing Requirements:** Do not infer or invent business logic, registry tweaks, or unapproved features.
7. **Respect Every Agent's Domain:** Never perform another agent's job without explicit cross-agent authorization.
8. **Keep Responsibilities Strictly Separated:** Every agent operates purely within its designated domain.

---

## 🏛️ Governance Constitution & Modular Rule Index (`RULES/`)

### Governance Constitution
- 📜 [AGENTS.md](AGENTS.md) — Master AI Governance Constitution (Purpose, Workflow, Decision Hierarchy, Conflict Resolution, Code Standards, Philosophy).

### Shared System Standards
- 📜 [project_rules.md](project_rules.md) — Core project architecture, data flow, dual-layer persistence, and Turkish language standard.
- 💻 [coding_rules.md](coding_rules.md) — TypeScript `strict: true`, React 19 memoization, zero `any` casting, zero technical jargon to user.
- 🎨 [design_rules.md](design_rules.md) — Visual design system, Luper Sapphire Blue (`#1a5efd`), anthracite dark mode (`#121214`), framing, corners.
- ✨ [ui_ux_rules.md](ui_ux_rules.md) — Apple/macOS Sequoia & Fluent Design standards, micro-interactions, anti-RGB/busy dashboard rules.
- ⚡ [electron_rules.md](electron_rules.md) — Electron, Node.js main process, secure IPC contextBridge, safe Win32 API / PowerShell bridge standards.
- 🔌 [ipc_rules.md](ipc_rules.md) — Electron Inter-Process Communication (IPC) patterns, contextBridge security, and validation standards.
- 🛡️ [security_rules.md](security_rules.md) — Secure IPC handling, contextIsolation, input regex sanitization, privilege separation, AMSI/antivirus false-positive prevention.
- ⚡ [performance_rules.md](performance_rules.md) — Fast startup times, 60 FPS UI rendering, zero unneeded re-renders, memory leak prevention.
- 🏷️ [naming_rules.md](naming_rules.md) — Strict naming conventions for components, variables, IPC channels, and files.
- 📝 [documentation_rules.md](documentation_rules.md) — Turkish user guides, clear technical documentation, release notes, and Markdown formatting standards.
- 🌿 [git_rules.md](git_rules.md) — Version control guidelines, commit message conventions, and clean repository maintenance.
- 🚀 [release_rules.md](release_rules.md) — Production build verification, Electron Builder distribution standards, installer verification.

---

## 🤖 Permanent 12 AI Agent Model Priorities & Tier Distribution (Claude & GPT First → Gemini Secondary)

| Ajan (Agent) | Model Önceliği | Model Seviyesi (Tier) | Uzmanlık ve Model Seçim Sebebi |
| :--- | :---: | :---: | :--- |
| 🏛️ **Architect Agent** | **Claude / GPT First** → Gemini | **`pro`** | Yüksek seviyeli Clean Architecture, ADR kararları, klasör sınırları ve SOLID ilkeleri denetimi. |
| ⚙️ **Developer Agent** | **Claude / GPT First** → Gemini | **`pro` / `inherit`** | React 19, TypeScript `strict: true`, Electron IPC ve karmaşık iş mantığı kodlaması. |
| 🎨 **Design System Agent** | **Claude / GPT First** → Gemini | **`flash`** | Hızlı Apple/macOS Sequoia UI bileşenleri, Tailwind v4 stilleri, mikro-etkileşimler ve cam katmanlar. |
| ⚡ **Performance Agent** | **Claude / GPT First** → Gemini | **`pro`** | Derin bellek profilleme, React 19 render tuning, 60 FPS UI takibi, IPC gecikme optimizasyonu. |
| 💻 **Windows System Expert Agent** | **GPT / Claude First** → Gemini | **`pro`** | Win32 API bağlayıcıları, Kayıt Defteri güvenliği, PowerShell köprüsü, servis ve WMI yönetimi. |
| 🛡️ **Security Agent** | **GPT / Claude First** → Gemini | **`pro`** | Tehdit analizi, regex girdi dezenfeksiyonu, ContextBridge sıkılaştırma, yetki ayrıştırma denetimi. |
| 🤖 **QA Automation Agent** | **Claude / GPT First** → Gemini | **`flash` / `flash_lite`** | Hızlı derleme doğrulaması (`npm run build`), birim test çalıştırma ve çökme önleme kontrolleri. |
| ✍️ **Documentation Agent** | **Claude / GPT First** → Gemini | **`flash` / `flash_lite`** | Hızlı Türkçe kullanıcı rehberleri, ipuçları (tooltips), sürüm notları ve Markdown dokümantasyonu. |
| 🧐 **Critic Agent** | **Claude / GPT First** → Gemini | **`pro`** | Nihai Kalite Kapısı (Quality Gatekeeper) değerlendirmesi ve tüm 12 alanın çapraz denetim onayı. |
| 🎯 **Product Owner Agent** | **Claude / GPT First** → Gemini | **`pro`** | Ürün vizyonu, özellik kabulü, yol haritası hizalaması ve çevrimdışı (offline-first) garantisi. |
| 🤖 **AI Integration Agent** | **Claude / GPT First** → Gemini | **`pro`** | AI mimarisi, LLM entegrasyonları (ChatGPT, Gemini, Claude), prompt sanitasyon süzgeçleri ve MCP. |
| 📊 **Data Analytics Agent** | **Claude / GPT First** → Gemini | **`pro` / `flash`** | Telemetri veri modellemesi, anlık CPU/RAM telemetrisi, FPS analitiği ve karşılaştırma motoru. |

---

## Related Documents

- 📄 [README.md](../README.md) — Main Project Overview & System Architecture
- 🤖 [AGENTS.md](../AGENTS.md) — Master AI Rule System Entry Point
- 📑 [ADR Index](../docs/adr/README.md) — Architecture Decision Records Framework
- 📚 [docs/](../docs/README.md) — Unified Project Documentation Index

---

## 🚫 CRITICAL PROJECT-WIDE PROHIBITION

> **OPTIMIZATION CODES, WINDOWS TWEAKS, REGISTRY EDITS, AND PERFORMANCE SETTINGS ARE NOT THE RESPONSIBILITY OF ANY AI AGENT.**
>
> All optimization settings and registry parameters are provided manually by the project owner. **Agents must NEVER search, generate, or invent optimization codes or registry values.**

> **NO USER-FACING AI IN THE APPLICATION.**
>
> The LUPER desktop application used by end-users MUST NOT contain any AI models, AI integrations, API keys, or AI-based assistance UI. 
> All AI integration is strictly limited to the internal Google Antigravity developer environment (for coding, testing, and research) and must never be exposed or shipped in the client application.
