# LUPER Permanent Git & GitHub Workflow Standards (`RULES/git_rules.md`)

This document defines the permanent Git workflow, commit conventions, branching strategies, and repository maintenance policies for **LUPER** (Commercial Windows Desktop Optimization & Performance Platform built with Electron, Node.js, React 19, TypeScript, and Tailwind CSS v4).

Every AI agent and software engineer working on LUPER must strictly follow these rules.

---

# Purpose

Define a consistent, transparent Git workflow for the entire LUPER repository.

Every code modification must be 100% traceable, reviewable, and reversible. Git history should clearly tell the architectural story and evolution of the commercial product over time.

---

# Git Philosophy

Git commit history is considered a core part of the commercial product.

Every commit added to the LUPER repository should:

- Have a transparent, single purpose.
- Be understandable upon first reading.
- Be isolated and easily reviewable.
- Be safely reversible (`git revert`) without side effects.
- Be logically grouped by domain or feature category.

*Avoid noisy, fragmented, or un-descriptive commit histories.*

---

# Branch Strategy

LUPER follows a strict, structured branching model:

- **`main`:** Production-ready release code only. Always 100% stable, built, and verified.
- **`develop`:** Primary integration and active development branch.
- **`feature/<feature-name>`:** New capabilities or view components (e.g. `feature/settings-engine`).
- **`bugfix/<bug-name>`:** Targeted defect resolution (e.g. `bugfix/ipc-timeout`).
- **`hotfix/<issue-name>`:** Critical production patches for live builds (e.g. `hotfix/uac-elevation-fix`).
- **`release/<version>`:** Release candidate preparation and final release validation (e.g. `release/v1.2.0`).

---

# Branch Rules

- **Never commit directly to `main`:** All changes must arrive via reviewed Pull Requests.
- **Never commit unfinished work to release branches:** Release branches are strictly for final verification.
- **Feature branches remain focused:** Scope a feature branch strictly to a single objective.
- **Clean up completed branches:** Delete merged feature/bugfix branches immediately after merging into `develop`.

---

# Commit Philosophy

- Every commit must represent **one single logical change**.
- Avoid combining unrelated modifications (e.g. combining a UI fix with a Node.js main process refactor).
- Always prefer multiple small, clean commits over one massive, multi-file commit.

---

# Commit Message Format

Use the **imperative mood** (e.g., "Add feature" instead of "Added feature" or "Adding feature"):

### Good Examples:
- `Add notification engine IPC handler`
- `Fix startup tray minimize crash`
- `Improve dashboard system score card layout`
- `Refactor category settings hook`
- `Update Turkish user guide tooltips`

*Avoid vague, un-descriptive commit messages such as "fix", "wip", "updates", or "stuff".*

---

# Commit Rules

Every commit submitted to the repository must:

- Build cleanly without compilation or TypeScript errors (`npm run build`).
- Keep the overall application completely functional.
- Contain strictly related changes for a single task.
- Pass lint and quality checks.

> 🛑 **COMMIT RULE:**
> Never commit broken, un-compilable, or non-functional code intentionally.

---

# Pull Request Rules

Every Pull Request (PR) opened for LUPER must include:

- **Summary:** Clear description of the changes introduced.
- **Reason for Change:** Rationale and user value explanation.
- **Files Affected:** Catalog of updated modules, components, or rule files.
- **Potential Risks:** Assessment of regression or compatibility risks.
- **Testing Performed:** Verification logs (`npm run build`) and runtime testing steps.
- **Screenshots:** Visual UI before/after captures when presentation components change.

*Small, concise, focused PRs are always preferred over sprawling multi-thousand line PRs.*

---

# Code Review

Every Pull Request must undergo formal review covering:

- Software Architecture & Clean Layer Separation
- TypeScript Type Safety & Readability
- Code Maintainability & Modularity
- Application Performance & Memory Footprint
- Security, Sanitization & Permission Safety
- Visual Design System & UI/UX Consistency
- Documentation & Turkish User Tooltip Copy
- Automated Test Scenarios & Build Verification

*The Critic Agent performs the final technical review and issues the final verdict (`✅ APPROVED`, `🟡 APPROVED WITH CHANGES`, `❌ REJECTED`).*

---

# Merge Strategy

Merge a PR into `develop` or `main` ONLY when:

- Formal Code Review is completed and approved (`✅ APPROVED`).
- All automated tests and build checks compile cleanly (`npm run build`).
- Documentation files are updated when requirements change.
- Merge conflicts are fully resolved.
- All rules defined in `AGENTS.md` and `RULES/` are satisfied.

---

# Version Control

- Every meaningful feature, fix, or architectural modification must be tracked cleanly in Git.
- **Avoid force pushes (`git push --force`)** on shared development branches (`develop`, `main`, `release/*`).
- Never rewrite shared Git history without explicit owner approval.

---

# Release Branches

Release candidate branches (`release/vX.Y.Z`) are strictly restricted to:

- Final bug fixes discovered during release validation.
- Release documentation updates and changelog summaries.
- Version number updates in `package.json`.
- Installer and build verification.

*No new features may be merged into a release branch.*

---

# Things Never Allowed

The following practices are **STRICTLY FORBIDDEN** across LUPER:

- ❌ Committing secrets, API keys, passwords, or tokens.
- ❌ Committing local credentials, SSH keys, or environment files.
- ❌ Committing generated build artifacts (`dist/`, `target/`, `node_modules/`).
- ❌ Committing temporary debug scripts or scratch files.
- ❌ Committing commented-out code or dead files.
- ❌ Committing unrelated changes combined into a single messy commit.
- ❌ Pushing directly to production branches (`main`) without review.

---

# Definition of Done

A Git change is considered **DONE** and compliant only if:

- ✅ **Commit History is Clean:** Logical, imperative commit messages with zero noise.
- ✅ **Branch Strategy is Respected:** Feature branch merged into `develop` via PR.
- ✅ **Review is Completed:** Formally audited and approved by `critic_agent`.
- ✅ **Changes are Traceable:** Clear PR description and issue linkage.
- ✅ **Project Rules are Satisfied:** Fully compliant with `AGENTS.md` and `RULES/git_rules.md`.
