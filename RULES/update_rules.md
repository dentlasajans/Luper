# LUPER Permanent Application Update Standards (`RULES/update_rules.md`)

This document defines the permanent application update, distribution, package verification, and update lifecycle standards for the **LUPER** project.

Every AI agent and software engineer working on LUPER must follow these rules.

---

## Technology Stack

- **Windows** (Target OS Platform)
- **Electron** (Application Framework & Electron Auto-Updater Engine)
- **Node.js** (Native Main Process, Signature Verification & Installation Handlers)
- **React 19** (TypeScript Frontend UI & Update Notification Dialogs)
- **TypeScript** (Strongly Typed Update Manifests & Payload Contracts)

---

## Purpose

Define a secure, reliable, and predictable application update architecture for the LUPER project.

Updates exist to improve application quality, security, and performance without compromising user trust, system stability, or data integrity.

---

## Update Philosophy

- **Safety & Predictability:** Every update must be safe, predictable, verifiable, recoverable, transparent, and backward-aware whenever practical.
- **Zero Risk to User Data:** An update process must **never** put user data, settings, presets, or core application integrity at risk.

---

## Supported Update Types

LUPER supports 4 distinct update categories:

1. **Stable Releases:** Major and minor feature updates thoroughly validated across all QA gates.
2. **Hotfix Releases:** Target patch updates resolving critical runtime regressions or stability issues.
3. **Security Releases:** Critical security patches addressing vulnerabilities or privilege escalation risks.
4. **Maintenance Releases:** Routine performance optimizations, localization updates, and documentation fixes.

*Every update type must adhere strictly to the same security and verification standards.*

---

## Release Channel

LUPER defines official, controlled distribution channels:

- **Stable Channel:** Production-ready builds for general users (100% QA approved).
- **Beta Channel:** Opt-in testing builds for pre-release validation.
- **Internal / Dev Channel:** Nightly development builds for core AI agent and developer verification.

> 🛑 **CHANNEL DISTRIBUTION RULE:**
> Only officially signed, QA-approved builds distributed through official release channels may be served to production users.

---

## Version Management

Every update payload and manifest (`updater.json`) must contain:

- **Application Version:** Semantic Versioning (`MAJOR.MINOR.PATCH`).
- **Build Identifier:** Unique build SHA/commit hash identifier.
- **Release Date:** ISO-8601 release timestamp (`YYYY-MM-DD`).
- **Compatibility Information:** Supported Windows build boundaries (e.g., Windows 10/11 x64).
- **Release Notes:** Detailed Turkish release notes for end-users and technical changelogs for developers.

---

## Update Process

The update pipeline must follow an explicit 7-stage lifecycle:

```
Discovery ──► Version Comparison ──► Integrity Verification ──► Compatibility Validation ──► Download ──► Installation ──► Post-Update Verification
```

1. **Discovery:** Querying official update server over HTTPS.
2. **Version Comparison:** Comparing local version against remote manifest version.
3. **Integrity Verification:** Cryptographic signature verification (Ed25519) of the remote manifest.
4. **Compatibility Validation:** Verifying OS build and system architecture requirements.
5. **Download:** Downloading package payload into a sandboxed staging directory.
6. **Installation:** Atomic package extraction and binary replacement via Electron Auto-Updater native service.
7. **Post-Update Verification:** Verifying post-update application startup and schema migration checks.

---

## Integrity Verification

Before any installation step begins, the updater engine MUST verify:

- **Cryptographic Signature:** Validating Ed25519 digital signatures against the embedded public key.
- **Checksum Integrity:** Validating SHA-256 binary package checksums.
- **Manifest Consistency:** Ensuring target version and build metadata match expected values.
- **Version Compatibility:** Verifying that the update path is valid and supported.

*Updates failing any verification step must be rejected immediately and deleted from staging.*

---

## Compatibility

Before applying an update, the system MUST verify compatibility across 5 dimensions:

- **Operating System Compatibility:** Windows 10 (19041+) / Windows 11 x64.
- **Architecture Compatibility:** x86_64 native architecture matching.
- **Plugin Compatibility:** Ensuring installed official plugins remain compatible with the target version.
- **Configuration Compatibility:** Validating configuration schema transitions (`RULES/migration_rules.md`).
- **Data Compatibility:** Verifying dual-layer persistence compatibility.

---

## User Data Protection

Update installation routines must strictly preserve:

- User settings and preferences.
- Customized preset configurations and optimization profiles.
- Dual-layer persistence files (`config.json` and local storage).
- Application logs, backup archives, and diagnostic records.

*User settings and configurations must NEVER be deleted or reset during an update.*

---

## Rollback

Whenever technically feasible, the update architecture must maintain:

- **Failed Update Recovery:** Automatic detection of failed update extractions or startup crashes.
- **Rollback Strategy:** Restoring the previous working binary version from the pre-update backup snapshot.
- **Safe Restoration:** Restoring pre-update configuration files if post-update migration fails.
- **Recovery Validation:** Verifying that the rolled-back state is stable and operational.

---

## Failure Handling

If an update execution fails at any point:

- Stop execution safely and abort binary replacement.
- Preserve application integrity and restore pre-update files.
- Produce structured, non-sensitive diagnostic logs for developer analysis.
- Display a clear, non-technical Turkish message explaining the failure and recovery options to the user.

*Leaving the system in a partially updated or un-bootable state is strictly prohibited.*

---

## Performance

Update operations must:

- Minimize user downtime during application restarting.
- Minimize network bandwidth usage using delta updates or compressed installers (`.nsis` / `.msi`).
- Avoid unnecessary binary re-downloads if cached staging payloads pass signature checks.
- Optimize installer execution time to complete within seconds.

---

## Security

Every update operation must:

- Use TLS 1.3 / HTTPS encrypted communication channels.
- Validate server TLS certificates and authenticity.
- Prevent package tampering or man-in-the-middle (MitM) payload injections.
- Protect update metadata and signature keys.

*Only cryptographically trusted and verified updates may be installed.*

---

## Logging

Update logs must record:

- Update discovery query timestamps and endpoints.
- Version comparison metrics (current vs target).
- Cryptographic signature and SHA-256 checksum verification results.
- Download progress and installation stage milestones.
- Success, Failure, or Rollback outcomes.
- Diagnostic error codes in case of failure.

*Sensitive user data, personal paths, or credentials must NEVER be written to update logs.*

---

## Documentation

The project team must maintain technical documentation detailing:

- Step-by-step update pipeline architecture and Electron Auto-Updater hooks.
- Versioning policy and release channel specifications.
- Public key management and digital signature rotation procedures.
- Rollback execution steps and disaster recovery plans.
- OS and hardware compatibility boundaries.

---

## Things Never Allowed

**NEVER:**

- ❌ Install un-verified, unsigned, or checksum-mismatched update packages.
- ❌ Skip OS, plugin, or configuration compatibility validation checks.
- ❌ Overwrite, reset, or corrupt user data and settings during update.
- ❌ Leave an installation in an incomplete, partially extracted state.
- ❌ Hide update failures or swallow installation errors silently.
- ❌ Downgrade application versions without explicit developer override flags.

---

## Definition of Done

An application update implementation is considered **DONE** only if it is:

- ✅ **Secure:** Ed25519 signature verified over TLS 1.3 channels.
- ✅ **Verified:** SHA-256 checksum and compatibility bounds checked.
- ✅ **Recoverable:** Tested rollback mechanism for failed installations.
- ✅ **Version-aware:** Explicit SemVer checks against release manifests.
- ✅ **Reliable:** Zero data loss and zero corrupted configuration states.
- ✅ **Transparent:** Clear Turkish release notes and progress feedback.
- ✅ **Fully Aligned with LUPER Standards:** Compliant with `AGENTS.md` and `RULES/update_rules.md`.

*This document defines the permanent application update standards for the LUPER project.*
