# LUPER Permanent Privacy & Data Protection Standards (`RULES/privacy_rules.md`)

This document defines the permanent privacy principles, data protection guidelines, user rights, and data governance standards for the **LUPER** project.

Every AI agent and software engineer working on LUPER must follow these rules.

---

## Technology Stack

- **Windows** (Target OS Platform)
- **Electron** (Application Framework & ContextBridge IPC Gateways)
- **Node.js** (Main Process Backend & Encrypted Storage Handlers)
- **React 19** (TypeScript Frontend UI & Privacy Settings Views)
- **TypeScript** (Strongly Typed Privacy Schemas & State Interfaces)

---

## Purpose

Define the privacy principles, data protection standards, and user rights that govern every design, architectural, and implementation decision within the LUPER project.

Privacy is a non-negotiable, core product requirement and must be embedded into the application lifecycle from day one.

---

## Privacy Philosophy

- **Privacy by Design & Default:** Every feature must be built with privacy as the default state.
- **User Trust:** Trust is earned through absolute transparency and responsible data handling.
- **Core Tenets:** Privacy by Design, Privacy by Default, Data Minimization, Transparency, User Control, and Accountability.

*Privacy must never become an afterthought, secondary task, or optional feature.*

---

## Core Principles

Every feature implementation in LUPER must:

- Collect strictly the minimum amount of data required for operation (**Data Minimization**).
- Process only verified, necessary technical information.
- Clearly explain data collection purposes to the user in non-technical Turkish.
- Respect user privacy choices and toggle settings instantly.
- Protect stored and transmitted user information using strong cryptography.
- Support future compliance standards (e.g., KVKK / GDPR principles).

---

## Data Categories

LUPER classifies all application data into 6 explicit categories:

1. **Application Data:** Local presets, optimization logs, and application execution states.
2. **User Preferences:** UI themes, language settings, display options, and custom profiles.
3. **Diagnostic Data:** Technical crash dumps, error codes, and performance timing metrics.
4. **Licensing Data:** Cryptographic activation tokens, license tier badges, and renewal dates.
5. **Update Data:** Application build version, OS build number, and update channel choices.
6. **Configuration Data:** Dual-layer persistence files (`config.json` and Node.js main process storage).

*Every data category must have a documented technical purpose and retention boundary.*

---

## Data Collection

Before introducing any new data collection mechanism, developers must:

- Explicitly define its technical purpose.
- Justify why the data is strictly necessary for feature execution.
- Document its retention policy and expiration schedule.
- Define access permissions and security controls.

> 🛑 **COLLECTION RULE:**
> Never collect information simply because it is technically accessible. Undocumented data collection is strictly forbidden.

---

## User Consent

Where user consent is required (e.g., optional telemetry or usage statistics):

- Request consent clearly using transparent React UI modal dialogs.
- Explain precisely why the data is needed and how it benefits the user.
- Allow users to decline consent easily without crippling core functionality.
- Allow users to revoke or change their consent choices at any time in Settings.

---

## Data Storage

Stored information in LUPER must:

- Be protected locally using secure file permissions and encrypted storage where appropriate.
- Adhere strictly to the **Principle of Least Access**.
- Avoid unnecessary data duplication across local storage and Node.js main process files.
- Remain consistent across dual-layer persistence boundaries (`RULES/project_rules.md`).
- Support safe recovery and backup generation without data leakage.

---

## Data Retention

Retention policies for stored data must specify:

- **What** data attributes are stored.
- **Why** the data is retained.
- **How long** the data persists (e.g., session-only, 30 days, or persistent configuration).
- **When & How** expired data is securely deleted.

*Data must never be retained on disk or remote servers longer than technically required.*

---

## Data Sharing

Data sharing or remote transmission must be:

- Explicitly documented in `RULES/telemetry_rules.md` and privacy manifests.
- Strictly purpose-specific (e.g., telemetry or license validation).
- Limited to the exact minimal payload necessary over TLS 1.3 / HTTPS.
- Protected against third-party access or interception.

*Data transmission must never exceed documented technical requirements.*

---

## User Rights

LUPER users retain absolute rights to:

- Inspect all collected data categories and privacy settings in the application UI.
- View transparent Turkish descriptions of all privacy controls.
- Enable or disable optional data collection at any time.
- Purge local diagnostic logs, application cache, or stored presets with one click.
- Receive clear, non-technical explanations regarding data protection practices.

---

## Security

Privacy depends fundamentally on security:

- Protect all stored configuration and licensing data against unauthorized local tampering.
- Enforce regex input sanitization on all IPC channels (`RULES/security_rules.md`).
- Use TLS 1.3 / HTTPS encrypted channels for all external network requests.
- Prevent privilege escalation risks or unauthorized process access.

---

## Transparency

The LUPER application must clearly communicate to the user:

- What information is collected.
- Why it is collected and processed.
- How it is used to improve performance or validate licenses.
- When external network transmissions occur.
- How users can manage, toggle, or purge their data.

---

## Documentation

The project repository must maintain technical documentation detailing:

- Complete inventory of data categories and storage paths.
- Data collection purposes and legal/privacy justifications.
- Data retention schedules and purge workflows.
- User privacy controls and toggle settings specifications.
- Security practices and encryption standards.
- Overall privacy architecture diagram.

---

## Things Never Allowed

**NEVER:**

- ❌ Collect personal files, documents, passwords, browsing history, or keystrokes.
- ❌ Hide data collection behavior or run secret background transmission routines.
- ❌ Process undocumented or un-justified user data.
- ❌ Ignore or override user privacy choices and opt-out toggles.
- ❌ Retain diagnostic data indefinitely without technical justification.
- ❌ Share user data with unauthorized third parties or outside documented purposes.

---

## Definition of Done

A privacy implementation is considered **DONE** only if it is:

- ✅ **Transparent:** Clear Turkish user descriptions and visible privacy settings.
- ✅ **Privacy-first:** Zero PII collection; Privacy by Design enforced.
- ✅ **Secure:** Protected by local access controls and encrypted channels.
- ✅ **User-controlled:** Fully toggleable and purgeable by the user.
- ✅ **Well Documented:** Detailed in privacy manifests and rule specs.
- ✅ **Maintainable:** Clean separation of data categories and retention logic.
- ✅ **Fully Aligned with LUPER Standards:** Compliant with `AGENTS.md` and `RULES/privacy_rules.md`.

*This document defines the permanent privacy and data protection standards for the LUPER project.*
