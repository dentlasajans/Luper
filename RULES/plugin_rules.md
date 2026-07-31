# LUPER Permanent Plugin Architecture & Management Standards (`RULES/plugin_rules.md`)

This document defines the permanent plugin architecture, lifecycle, permission model, and security standards for the **LUPER** project.

Every AI agent and software engineer working on LUPER must follow these rules.

---

## Technology Stack

- **Windows** (Target OS Platform)
- **Electron** (Application Framework & Dynamic Native IPC Bridges)
- **Node.js** (Plugin Engine, Main Process Isolation & Security Validation)
- **React 19** (TypeScript Plugin UI Components & Views)

---

## Purpose

Define a secure, modular, and maintainable plugin architecture for the LUPER project.

Plugins exist to extend the application's capabilities without compromising system stability, security, or core performance.

---

## Plugin Philosophy

- **Lightweight Core:** The core LUPER application must remain lean, fast, and unbloated.
- **Modular Functionality:** Additional or specialized features should be encapsulated as modular plugins whenever appropriate.
- **Core Integrity:** Plugins must **never** weaken or bypass the stability, security, or governance of the core application.

---

## Core Principles

The LUPER plugin system must be:

- **Secure:** Verified integrity with permission sandboxing.
- **Modular:** Independent components with clean interfaces.
- **Isolated:** Fault-tolerant execution preventing core app crashes.
- **Predictable:** Well-defined lifecycle states and predictable APIs.
- **Versioned:** Explicit semver matching against core LUPER versions.
- **Maintainable:** Clean code structure and standardized dynamic IPC boundaries.
- **Documented:** Transparent manifests, permission declarations, and guides.

---

## Plugin Types

LUPER supports the following plugin categories:

1. **Official Plugins:** Developed and signed directly by the core LUPER team. Full access to authorized core APIs.
2. **Premium Plugins:** High-tier commercial extensions with verified digital signatures and license validation.
3. **Experimental Plugins:** Opt-in feature previews subjected to isolated sandbox constraints.
4. **Internal Development Plugins:** Internal diagnostic tools enabled exclusively in debug builds (`NODE_ENV === 'development'`).

*Each plugin type must have clearly defined capabilities, manifest requirements, and security restrictions.*

---

## Plugin Lifecycle

Every plugin must support and adhere to the explicit 7-stage lifecycle:

```
Installation ──► Validation ──► Initialization ──► Activation ──► Update / Deactivation ──► Removal
```

1. **Installation:** Unpacking plugin assets into dedicated sandboxed directories.
2. **Validation:** Verifying digital signature, manifest integrity, and permission requirements.
3. **Initialization:** Loading Node.js main process backend bindings and instantiating React frontend views.
4. **Activation:** Registering IPC channels and mounting UI extensions.
5. **Update:** Safe hot-reloading or stage-update verification.
6. **Deactivation:** Unregistering handlers, clearing memory buffers, and unmounting UI elements.
7. **Removal:** Cleaning up local files and revoking registered permissions.

---

## Compatibility

Every plugin must declare a valid manifest specifying:

- **Plugin Version:** Semantic Versioning (`MAJOR.MINOR.PATCH`).
- **Minimum Supported LUPER Version:** E.g., `^1.0.0`.
- **Maximum Supported LUPER Version:** (If applicable for breaking API changes).
- **Required Capabilities:** Standardized Electron / Win32 capability strings.
- **Compatibility Information:** OS build constraints (e.g., Windows 10/11 x64).

> 🛑 **COMPATIBILITY RULE:**
> Incompatible or unverified plugins **must not be loaded** under any circumstances.

---

## Isolation

- Plugins must remain strictly isolated from one another.
- One plugin must **never** directly access, inspect, or modify another plugin's state or memory space.
- A plugin crash, panic, or unhandled failure must be caught gracefully and **must never crash the core application**.

---

## Security

Plugins must:

- Validate file hashes and package integrity before execution.
- Require cryptographic digital signatures for production loading.
- Request only strictly required system capabilities.
- Operate under the **Principle of Least Privilege**.

*Unauthorized, unsigned, or tampered plugins must be rejected immediately.*

---

## Permissions

Every plugin manifest (`plugin.json` / `package.json` feature specs) must explicitly declare:

- **Required Permissions:** E.g., `registry:read`, `service:query`.
- **Required Resources:** Storage folders, memory quotas, or IPC channels.
- **Required APIs:** Core Win32 / Electron ContextBridge API bridge access.
- **Required System Access:** Elevation requirements (if any).

*Permissions are never assumed or implicitly granted.*

---

## Performance

Plugins must:

- **Minimize startup impact:** Avoid blocking main thread initialization (startup target <100ms).
- **Release unused resources:** Clean up timers, subscribers, and RAM upon deactivation.
- **Avoid unnecessary background activity:** No idle CPU spinning or continuous disk polling.
- **Respect system performance:** Throttle background diagnostic checks.

*Plugins must not degrade UI responsiveness below 60 FPS.*

---

## Error Handling

Plugin failures must:

- Be isolated within the plugin sandbox boundaries.
- Produce meaningful, structured diagnostic logs.
- Allow graceful user-driven recovery or automatic deactivation.
- **Never corrupt core application state or user settings.**

---

## Updates

Plugin updates must:

- Preserve backward compatibility with user settings and plugin state.
- Validate cryptographic package signatures before replacing files.
- Support safe rollback mechanisms in the event of an update failure.
- Explicitly notify users of any new permission requests or breaking changes.

---

## Documentation

Every plugin project must provide comprehensive documentation detailing:

- **Purpose & Scope:** Clear description of features added.
- **Feature Manifest:** Detailed capability listing.
- **Requirements:** Hardware, OS, and LUPER version constraints.
- **Permissions:** Explicit justification for every requested permission.
- **Compatibility Matrix:** Tested Windows build versions.
- **Limitations:** Known constraints or non-supported scenarios.
- **Changelog:** Detailed version history (`CHANGELOG.md`).

---

## Things Never Allowed

**NEVER:**

- ❌ Load incompatible, malformed, or unverified plugins.
- ❌ Execute unsigned or tampered plugin binaries in production.
- ❌ Bypass permission validation or privilege boundaries.
- ❌ Allow plugins unrestricted, un-sandboxed system access.
- ❌ Allow one plugin to silently inspect, tamper with, or modify another plugin.
- ❌ Allow plugin panics to compromise core application stability.

---

## Definition of Done

A plugin architecture and implementation is considered **DONE** only if it is:

- ✅ **Secure:** Cryptographically validated with strict permission checks.
- ✅ **Modular:** Self-contained without core codebase pollution.
- ✅ **Isolated:** Sandbox failure protection verified.
- ✅ **Version-aware:** Strict semver compatibility enforcement.
- ✅ **Maintainable:** Clean IPC interfaces and standardized manifests.
- ✅ **Extensible:** Flexible hook points without breaking changes.
- ✅ **Fully Aligned with LUPER Standards:** Compliant with `AGENTS.md` and `RULES/plugin_rules.md`.

*This document defines the permanent plugin standards for the LUPER project.*
