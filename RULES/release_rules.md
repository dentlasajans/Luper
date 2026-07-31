# LUPER Permanent Release Management Standards (`RULES/release_rules.md`)

This document defines the permanent release lifecycle, distribution standards, versioning rules, and production deployment policies for **LUPER** (Commercial Windows Desktop Optimization & Performance Platform built with Electron, Node.js, React 19, and TypeScript).

Every AI agent and software engineer working on LUPER must strictly follow these rules.

---

# Purpose

Define a professional, reliable release lifecycle for the entire LUPER product.

Every release must be predictable, stable, thoroughly reviewed, and 100% production-ready. No feature or patch may reach end users without passing the complete release validation process.

---

# Release Philosophy

Every release of LUPER should:

- Measurably improve the product's capabilities, performance, or clarity.
- Preserve 100% system stability and Windows compatibility.
- Minimize user risk through rigorous automated validation.
- Be fully reviewed and approved by all specialized domain AI agents.
- Be fully tested across Windows 10 and Windows 11 environments.

> 🛑 **CORE RELEASE RULE:**
> Quality is always far more important than release speed. Never rush a build to production.

---

# Release Types

LUPER supports 4 distinct release categories:

- **Major Release (`X.0.0`):** Significant new platform functionality, major architectural evolutions, or breaking changes.
- **Minor Release (`x.Y.0`):** New optimization categories, new system tools, feature enhancements, fully backward compatible.
- **Patch Release (`x.y.Z`):** Targeted bug fixes, minor UX polish, performance optimizations, and security patches.
- **Hotfix (`x.y.Z-hotfix`):** Critical production patches reserved strictly for emergency live build issues.

---

# Versioning

LUPER strictly adheres to **Semantic Versioning (SemVer 2.0.0)**:

```
MAJOR . MINOR . PATCH
```

### Examples:
- `1.0.0` (Initial Production Milestone)
- `1.2.0` (Minor Feature Release - New Tools Added)
- `1.2.5` (Patch Release - Bug Fixes & Performance Polish)
- `2.0.0` (Major Platform Upgrade)

---

# Release Workflow

Every production release MUST execute the following 10-step lifecycle:

```
Feature Complete
       ↓
Architecture Review (architect_agent)
       ↓
Code Review (developer_agent)
       ↓
Performance Review (performance_agent)
       ↓
Security Review (security_agent)
       ↓
QA Validation (qa_automation_agent)
       ↓
Documentation Update (documentation_agent)
       ↓
Release Candidate Build (release/vX.Y.Z)
       ↓
Final Quality Approval (critic_agent)
       ↓
Production Release (main)
```

---

# Release Checklist

Before releasing any build to production, verify:

- [ ] All planned features and roadmap items are 100% complete.
- [ ] Zero known critical, high, or blocking defects exist.
- [ ] All automated unit, integration, and E2E regression tests pass.
- [ ] All user tooltips, README, and Turkish guides are fully updated.
- [ ] `CHANGELOG.md` is updated with complete version notes.
- [ ] Version numbers in `package.json` are incremented.
- [ ] Production compilation build succeeds without errors (`npm run build`).
- [ ] Native Electron Builder packaging and installer generation succeeds.
- [ ] Installer setup binary is verified on clean Windows 10 and 11 test machines.

---

# Release Candidate

A Release Candidate (`release/vX.Y.Z` branch) must:

- Contain **zero planned feature work** or new code additions.
- Receive strictly critical bug fixes and version/documentation updates.
- Remain completely frozen and stable during testing.
- Be fully testable by QA automation test harnesses.

---

# Rollback Strategy

Every release deployment must include a pre-planned recovery strategy:

- **Rollback Availability:** Retain previous version binaries (`vX.Y.(Z-1)`) for immediate user fallback.
- **Issue Tracking:** Monitor crash reports and error logs actively post-release.
- **Recovery Plan:** Prepare hotfix patch procedures to resolve unexpected live issues within hours.
- **Previous Version Availability:** Ensure clean uninstaller and backup restore mechanics work flawlessly across version rollbacks.

---

# Quality Gate

A release **CANNOT PROCEED** to production unless all 7 specialist agents have completed their responsibilities:

- 🏛️ **Architect Agent:** Architectural integrity and module boundaries approved.
- ⚙️ **Developer Agent:** Code implementation fully completed and typed (`strict: true`).
- ⚡ **Performance Agent:** Sub-100ms startup, <50MB RAM baseline, and 60 FPS verified.
- 🛡️ **Security Agent:** Input sanitization, IPC safety, and AMSI/antivirus compliance verified.
- 🤖 **QA Automation Agent:** Automated test suite and regression tests passed 100%.
- ✍️ **Documentation Agent:** Turkish tooltips, release notes, and `CHANGELOG.md` published.
- 🧐 **Critic Agent:** Final review completed with explicit **`✅ APPROVED`** verdict.

---

# Changelog

Every release must include a structured entry in `CHANGELOG.md` formatted as follows:

```markdown
## [1.2.0] - 2026-07-24

### 🚀 Yeni Özellikler (New Features)
- Added new Startup Apps Management Tool.

### ⚡ İyileştirmeler (Improvements)
- Optimized React state memoization for sub-200ms view switching.

### 🐞 Hata Düzeltmeleri (Bug Fixes)
- Fixed IPC timeout issue on un-elevated process checks.

### 🛡️ Güvenlik (Security)
- Added regex whitelist validation for all IPC parameters.
```

---

# Things Never Allowed

The following practices are **STRICTLY FORBIDDEN** across LUPER:

- ❌ Releasing un-tested or un-verified code to production.
- ❌ Releasing unfinished features or incomplete UI screens.
- ❌ Skipping QA automation testing or regression validation.
- ❌ Skipping security audits or IPC input sanitization reviews.
- ❌ Skipping documentation updates or Turkish tooltip copy.
- ❌ Releasing builds containing known critical or blocking bugs.
- ❌ Ignoring reviewer feedback or overriding `critic_agent` verdicts.

---

# Definition of Release Ready

A release build is considered **PRODUCTION-READY** only if it is:

- ✅ **Stable:** Zero crashes, zero unhandled panics, zero memory leaks.
- ✅ **Secure:** 100% IPC sanitization, zero privilege escalation risks.
- ✅ **Reviewed:** Formally audited and approved (`✅ APPROVED`) by `critic_agent`.
- ✅ **Tested:** Passed all unit, integration, and installer verification tests.
- ✅ **Documented:** Updated tooltips, release notes, and `CHANGELOG.md`.
- ✅ **Versioned:** Correct SemVer increment in `package.json`.
- ✅ **Approved:** Final sign-off completed by Product Owner.
- ✅ **Fully Compliant with All LUPER Project Rules:** Compliant with `AGENTS.md` and `RULES/release_rules.md`.
