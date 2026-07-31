# LUPER Permanent Documentation Standards (`RULES/documentation_rules.md`)

This document defines the permanent technical writing standards, Markdown conventions, and repository documentation policies for **LUPER** (Commercial Windows Desktop Optimization & Performance Platform built with Electron, Node.js, React 19, TypeScript, and Tailwind CSS v4).

Every AI agent and software engineer working on LUPER must strictly follow these rules.

---

# Purpose

Define a single, unified, and consistent technical documentation standard for the entire LUPER repository.

Documentation makes the project significantly easier to understand, maintain, debug, scale, and onboard new engineers into. In LUPER, high-quality documentation is not an afterthought—it is considered a core part of the commercial product.

---

# Documentation Philosophy

Technical documentation across LUPER must be:

- **Accurate:** Reflect exact code implementation without factual errors or speculative claims.
- **Clear:** Written in transparent, unambiguous, professional engineering language.
- **Concise:** Deliver maximum information without fluff or unnecessary repetition.
- **Consistent:** Use uniform terminology, formatting styles, and document structures.
- **Up to Date:** Synchronized immediately whenever code logic or architecture changes.
- **Easy to Navigate:** Organized with clear Markdown headings, sitemaps, and clickable file links.

> 🛑 **SYNCHRONIZATION RULE:**
> If code changes, the corresponding documentation MUST be updated in the same pull request.

---

# Language & Localization Policy

- **Developer Documentation:** All technical documentation, developer guides, rule files, and architecture specifications must be written in **English**.
- **User-Facing UI & Tooltips:** End-user facing UI text, category descriptions, in-app tooltips, and release notes must be written in **clean, gamer-friendly, professional Turkish**.
- **Tone & Style:** Avoid slang, non-standard jargon, and obscure project-specific abbreviations.

---

# Turkish User Guides, Tooltips & Release Notes Standards

All end-user facing Turkish content (including `ReleaseNotes.tsx`, `ChangelogModal.tsx`, tooltips, and category cards) must adhere to the following standards:

1. **Gamer-Friendly & Value-Oriented Language:**
   - Focus on tangible benefits (e.g. *Düşük ping*, *Sıfır girdi gecikmesi*, *Yüksek ve kararlı FPS*).
   - Avoid overwhelming the user with raw registry keys, hex values, or internal script details.
2. **Tooltip Structure & Length:**
   - Maximum 2 concise sentences per tooltip.
   - Use active present tense (e.g. *İvmelenme sapmalarını kaldırır*, *Gereksiz bellek kullanımını düşürür*).
3. **Release Notes Formatting:**
   - Explicit version tag (e.g. `v1.0.0`).
   - Full localized date format (e.g. `24 Temmuz 2026`).
   - Structured list items with category badges or visual icons (`CheckCircle2`, `ShieldCheck`, `Zap`).
   - Proper ARIA accessibility markup (`role="region"`, `aria-label="Sürüm Notları"`).
4. **Grammar & Terminology Consistency:**
   - Product name casing must always be **Luper** or **LUPER**.
   - Spellings must be strictly verified (e.g., use **Telemetri**, never *Teleometri*).

---

# Documentation Scope

Documentation across the repository should cover:

- **Project Architecture:** System layer boundaries, IPC bridges, data flow models.
- **Features:** Detailed user workflows and functional optimization capabilities.
- **Modules:** Component hierarchies, hooks, stores, and backend engine modules.
- **APIs & IPC Commands:** Command signatures, input parameters, and return payloads.
- **Components:** Presentational React components, props, and design system tokens.
- **Configuration:** `package.json`, `electron/main.js`, environment variables, and build settings.
- **Installation:** Prerequisites, setup instructions, and developer environment configuration.
- **Development Workflow:** Branch strategy, PR reviews, and coding standards.
- **Build Process:** Vite build, Electron Main Process bundling, and Electron Builder packaging pipelines.
- **Release Process:** Versioning, changelog updates, and release candidate validation.
- **Troubleshooting:** Common Win32 permission errors, IPC timeouts, and debugging steps.

---

# README Standards

Every major module or sub-system directory should include a dedicated `README.md` when appropriate.

A module `README.md` should clearly explain:

1. **Purpose:** Why the module exists and its business value.
2. **Responsibilities:** Explicit list of duties and domain boundaries.
3. **Usage:** Code examples showing how to consume or invoke the module.
4. **Dependencies:** External npm packages, native Node modules, or sibling modules required.
5. **Limitations:** Known constraints, Win32 privileges, or version boundaries.

---

# Code Documentation

Document code **ONLY when it adds genuine developer value**:

- Comments should explain **WHY** something exists, **WHY** an architectural decision was made, or **non-obvious** business rules.
- Do not write comments that merely restate obvious code syntax (e.g. avoid `// increment i by 1`).
- Clean up outdated comments immediately during refactoring.

---

# Architecture Documentation

Architecture documents (`RULES/architect_agent.md`, `project_rules.md`, etc.) must clearly describe:

- High-level system overview and 4-tier layer diagrams.
- Inter-module relationships and IPC contracts.
- End-to-end data flow models (Frontend (React 19) → ContextBridge IPC → Electron Main (Node.js) → PowerShell / Win32 Bridge).
- Module responsibilities and domain isolation rules.
- Underlying architectural design decisions and trade-offs.

---

# API Documentation

Every public API signature, custom hook, and native Electron IPC channel must document:

- **Purpose:** Clear summary of what the endpoint accomplishes.
- **Parameters:** Strongly typed payload parameters and regex validation constraints.
- **Return Values:** Expected return structures (`Promise<IPCResponse<T>>`).
- **Possible Errors:** Potential failure cases (e.g. `Access Denied`, `Timeout`).
- **Usage Examples:** Concise code snippets demonstrating invocation.

---

# Change Documentation

Whenever a significant feature or architectural refactor is merged, update:

- Relevant Architecture Documents (`RULES/*.md`).
- Directory `README.md` files.
- Project `CHANGELOG.md` with SemVer release notes.
- Developer onboarding guides and setup instructions (if affected).

---

# Examples

Code examples in technical documentation must:

- Be 100% complete and compilable (`strict: true` compliant).
- Be realistic and reflect actual codebase patterns.
- Strictly adhere to LUPER naming conventions (`RULES/naming_rules.md`).
- Be easy for developers to copy, adapt, and run.

---

# Review Checklist

Audit every technical document against these 7 quality criteria:

- [ ] **Accuracy:** Does the text accurately reflect the current codebase implementation?
- [ ] **Clarity:** Is the language transparent, professional, and easy to read?
- [ ] **Completeness:** Are all relevant execution paths, parameters, and fallbacks covered?
- [ ] **Consistency:** Are terms, formatting styles, and alert callouts uniform?
- [ ] **Grammar:** Is the document free of spelling or grammatical errors?
- [ ] **Outdated Information:** Has obsolete or deprecated context been removed?
- [ ] **Broken References:** Are all file links (`file:///...`) valid and clickable?

---

# Things Never Allowed

The following practices are **STRICTLY FORBIDDEN** across LUPER:

- ❌ Leaving outdated, incorrect, or misleading documentation in the repository.
- ❌ Documenting incorrect or un-verified system behaviors.
- ❌ Duplicating documentation content unnecessarily across multiple files.
- ❌ Mixing multiple languages (e.g., English and Turkish) within the same technical document.
- ❌ Copying external third-party documentation without proper attribution.
- ❌ Documenting un-finished or speculative features as complete.

---

# Definition of Done

Documentation is considered **DONE** and compliant only if it is:

- ✅ **Accurate:** 100% aligned with actual code implementation.
- ✅ **Current:** Updated in the same PR as code changes.
- ✅ **Understandable:** Clear, transparent, and professionally written.
- ✅ **Consistent:** Formatted according to LUPER Markdown rules.
- ✅ **Useful:** Provides genuine value for current and future developers.
- ✅ **Aligned with LUPER Project Standards:** Fully compliant with `AGENTS.md` and `RULES/documentation_rules.md`.

