# LUPER Permanent Migration Standards (`RULES/migration_rules.md`)

This document defines the permanent migration, schema evolution, and data transition standards for the **LUPER** project.

Every AI agent and software engineer working on LUPER must follow these rules.

---

## Technology Stack

- **Windows** (Target OS Platform)
- **Electron** (Application Framework & IPC Gateways)
- **Node.js** (Native Main Process & Schema Migration Handlers)
- **React 19** (TypeScript Frontend UI & State Sync)
- **TypeScript** (Strongly Typed Schema Specifications)

---

## Purpose

Define a safe, predictable, and version-aware migration strategy for the LUPER project.

Every migration must preserve application integrity, user settings, configuration state, and backward compatibility whenever technically feasible.

---

## Migration Philosophy

- **Controlled Evolution:** Migration is a controlled, transparent evolution of application state.
- **Key Characteristics:** Every migration must be planned, documented, versioned, recoverable, verifiable, and backward-aware whenever possible.
- **Zero Surprises:** Migration processes must **never** surprise the user, cause unexpected data loss, or corrupt application configuration.

---

## Migration Scope

Migration rules apply to all persistent and semi-persistent assets:

- Configuration files (`config.json`, user preferences)
- User settings & preset configurations
- Dual-layer persistence state (local storage & Node.js main process storage)
- Internal databases (SQLite / key-value stores)
- Custom file formats & backup archives
- Module structures & directory layouts
- Storage layouts & path schemas
- Metadata & index files
- Cache formats (when schema changes affect cache validation)

---

## Migration Triggers

A migration process must be triggered when:

- Application version changes (e.g., v1.x → v2.0).
- Configuration schemas or payload data formats change.
- Internal database table structures or columns are modified.
- Storage paths or directory layouts are reorganized.
- Plugin compatibility or manifest requirements evolve.
- Core feature modules undergo architectural restructuring.
- Dual-layer persistence sync protocols are updated.

---

## Version Management

Every migration script or module must explicitly define:

- **Source Version:** Expected starting version string (e.g., `1.2.0`).
- **Target Version:** Target destination version string (e.g., `2.0.0`).
- **Compatibility Requirements:** Minimum supported legacy version boundary.
- **Migration Identifier:** Unique identifier (e.g., `MIGRATION_2026_001_CONFIG_V2`).
- **Migration Status:** Current state (`Pending`, `Running`, `Completed`, `RolledBack`, `Failed`).

*Version transitions must be explicit and cryptographically/programmatically verified.*

---

## Migration Process

Every migration must follow a strict 6-stage execution pipeline:

```
Validation ──► Compatibility Checks ──► Backup ──► Execution ──► Verification ──► Completion Reporting
```

1. **Validation:** Verifying schema integrity and target directory access.
2. **Compatibility Checks:** Ensuring the source data matches expected input schemas.
3. **Backup:** Creating a safe restore point of user configuration before mutation.
4. **Execution:** Atomic step-by-step schema/data transformation.
5. **Verification:** Validating output data against target schema definitions.
6. **Completion Reporting:** Logging success metrics and notifying system state.

---

## Validation

Before executing any data or schema migration, the migration engine MUST verify:

- Source data integrity (JSON schema validation / checksum checks).
- Required file system write permissions and Windows elevation status.
- Available disk space for backup generation.
- Version compatibility bounds.
- Migration prerequisites and dependent modules.

> 🛑 **VALIDATION RULE:**
> If any pre-execution validation check fails, **abort the migration immediately** and log the diagnostic reason.

---

## Recovery

Whenever technically feasible:

- All original data must be backed up to a temporary recovery snapshot prior to mutation.
- The system must support automatic or manual **rollback** upon execution error.
- Partial migrations are strictly forbidden; execution must be atomic.
- In the event of a failure, the application must be left in a valid, functional state matching pre-migration conditions.

---

## Failure Handling

When a migration failure occurs, the system must:

- Stop execution safely without attempting corrupted writes.
- Produce structured, non-sensitive diagnostic log entries.
- Restore the original data snapshot from backup.
- Prevent data corruption or silent fallback to invalid defaults.
- Present a clear, gamer-friendly Turkish notification to the user if user action is required.

---

## Compatibility

- Migration scripts must maintain backward compatibility with legacy user data whenever practical.
- Any unavoidable breaking changes must be:
  - Documented in release notes and migration guides.
  - Formally justified through an Architecture Decision Record (ADR).
  - Version controlled in migration manifests.
  - Clearly communicated to users prior to installation.

---

## Performance

Migration routines must:

- Minimize startup delay (cold startup targets remain under 100ms for non-migration boots; migration boots must show a smooth loading indicator).
- Minimize user downtime during application updates.
- Avoid unnecessary file duplication or redundant disk I/O operations.
- Scale efficiently for large user datasets or deep backup histories.

---

## Logging

Migration audit logs must record:

- Unique Migration Identifier.
- Source Version and Target Version.
- Pre-execution validation results.
- Detailed step execution milestones.
- Success, Failure, or Rollback outcomes.
- Recovery actions taken (if any).

*Sensitive user information, passwords, or personal paths must NEVER be logged.*

---

## Documentation

The project team must maintain documentation detailing:

- Migration purpose and business rationale for every version jump.
- Complete version mapping matrix (`v1.x → v2.x`).
- Schema compatibility rules and field deprecation schedules.
- Step-by-step recovery and rollback instructions.
- Known limitations and non-migratable legacy edge cases.

---

## Things Never Allowed

**NEVER:**

- ❌ Migrate unsupported, un-validated, or malformed data formats silently.
- ❌ Ignore failed validation checks or proceed with corrupted inputs.
- ❌ Corrupt, overwrite, or erase user settings without explicit permission/backup.
- ❌ Delete user data or presets without documented architectural justification.
- ❌ Leave the application in a partially migrated or inconsistent state.
- ❌ Execute undocumented or un-tracked data migration scripts.

---

## Definition of Done

A migration implementation is considered **DONE** only if it is:

- ✅ **Safe:** Includes pre-execution backup and zero risk of data loss.
- ✅ **Version-aware:** Explicit version boundaries and schema contracts.
- ✅ **Recoverable:** Verified atomic rollback upon any step failure.
- ✅ **Verified:** Output schemas validated against target specifications.
- ✅ **Documented:** Documented in version release notes and migration manifests.
- ✅ **Predictable:** Non-surprising, transparent execution flow.
- ✅ **Fully Aligned with LUPER Standards:** Compliant with `AGENTS.md` and `RULES/migration_rules.md`.

*This document defines the permanent migration standards for the LUPER project.*
