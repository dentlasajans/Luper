# LUPER Permanent Licensing & Subscription Standards (`RULES/license_rules.md`)

This document defines the permanent licensing, key activation, feature gating, and subscription architecture standards for the **LUPER** project.

Every AI agent and software engineer working on LUPER must follow these rules.

---

## Technology Stack

- **Windows** (Target OS Platform)
- **Electron** (Application Framework & Native IPC Bridge)
- **Node.js** (Cryptographic License Validation & Key Handlers)
- **React 19** (TypeScript Frontend UI & Activation Dialogs)
- **TypeScript** (Strongly Typed License Schemas & Feature Gates)

---

## Purpose

Define a secure, transparent, privacy-conscious, and maintainable licensing architecture for the LUPER commercial platform.

The licensing system exists to protect the commercial product while providing a smooth, trustworthy, and non-intrusive experience for legitimate users.

---

## Licensing Philosophy

- **Fair Commercial Use:** Licensing enables fair commercial monetization without degrading legitimate user experiences or application performance.
- **Key Qualities:** The licensing system must be secure, reliable, transparent, user-friendly, maintainable, and privacy-conscious.
- **Transparency:** Users should always clearly understand their active license status, tier capabilities, and renewal schedules.

---

## License Types

LUPER supports the following license categories:

1. **Free Tier:** Core application functionality, baseline performance metrics, and essential system monitoring tools.
2. **Trial License:** Full access to Premium features for a limited evaluation period (e.g., 7 or 14 days).
3. **Premium License:** Full commercial access to advanced optimization profiles, automated background tuning, and priority updates.
4. **Enterprise License:** Multi-device commercial deployment licenses for organization management.

*Each license type must have clearly documented capabilities, permissions, and feature boundaries.*

---

## Activation

The license activation workflow must be:

- **Simple:** Intuitive key entry or single-click account sign-in UI in React 19.
- **Secure:** Cryptographically signed license token verification (Ed25519) performed inside the Node.js main process.
- **Verifiable:** Immediate verification response displaying active tier status.
- **Recoverable:** Key restoration and license re-binding support upon system reinstall.

*Users must receive clear, real-time Turkish feedback during activation steps.*

---

## License Validation

License validation routines must verify:

- **License Authenticity:** Cryptographic signature verification using embedded public keys.
- **License Status:** Active, Expired, Revoked, or Grace Period.
- **Product Compatibility:** License eligibility for the LUPER product line.
- **Version Compatibility:** License entitlement for the running application version (`MAJOR.MINOR`).
- **Expiration Date:** Time-based expiration checks for subscriptions or trial keys.

> 🛑 **VALIDATION FAILURE RULE:**
> Validation failures must **never** silently crash the application, corrupt user data, or disable free-tier functionality without clear feedback.

---

## Offline Behavior

The licensing system must define explicit offline rules:

- **Offline Capability:** Validated licenses must cache cryptographically signed local activation tokens to allow offline application usage.
- **Grace Period:** Support a minimum 14-day offline grace period before requiring online revalidation.
- **Revalidation Policy:** Automatic background revalidation when network connectivity is restored.
- **Recovery:** Smooth recovery to active status upon successful online handshake.

---

## Subscription Lifecycle

The licensing engine must support and manage explicit lifecycle states:

```
Activation ──► Active Usage ──► Renewal / Upgrade ──► Expiration / Grace Period ──► Downgrade / Cancellation ──► Recovery
```

Each state transition must be explicitly handled by backend IPC handlers and reflected in the React UI state.

---

## Feature Gating

Licensed functionality must:

- Be clearly demarcated in the UI with intuitive badges (e.g., "PRO", "PREMIUM").
- Behave consistently across all modules.
- Fail gracefully when invoked without required license entitlement.
- Present helpful Turkish dialogs explaining how to unlock or upgrade when gated features are clicked.

*Users must always understand exactly why a specific feature is gated or unavailable.*

---

## Security

The licensing architecture must:

- Validate incoming IPC activation requests in the Node.js main process before granting feature flags.
- Prevent license key sharing or brute-force activation attempts.
- Minimize exposure of sensitive cryptographic data.

*Security mechanisms must never unnecessarily lock out or annoy legitimate paying users.*

---

## Privacy

- License validation routines must collect **only** the minimum information required for licensing verification (e.g., pseudonymous machine hash, license key).
- **NEVER** collect personal files, documents, passwords, or unrelated hardware details during license validation.
- Telemetry and license validation data must remain strictly separated (`RULES/telemetry_rules.md`).

---

## Error Handling

License-related errors must:

- Explain the precise problem clearly in user-friendly, non-technical Turkish.
- Provide actionable recovery steps (e.g., "Re-enter key", "Check internet connection", "Renew subscription").
- Preserve all user settings, presets, and local optimization data intact.
- Avoid exposing confusing technical stack traces, crypto errors, or raw HTTP status codes.

---

## Logging

License audit logs must record:

- Activation attempts (timestamp, anonymized machine hash ID, outcome).
- Validation events (online handshake results, grace period status).
- License state changes (e.g., Trial → Premium, Active → Expired).
- Recovery and revalidation events.
- Structured error diagnostic codes.

*Full license keys, passwords, or personal user identifiers must NEVER be written to log files.*

---

## Documentation

The project repository must maintain documentation detailing:

- Supported license tiers, feature matrices, and pricing rules.
- Step-by-step activation workflow and Node.js main process IPC endpoints.
- Online and offline validation policies.
- Offline grace period specifications.
- Subscription lifecycle event handlers.
- License recovery and re-binding procedures.

---

## Things Never Allowed

**NEVER:**

- ❌ Lock users out of the core application or freeze the UI without clear explanation.
- ❌ Delete, corrupt, or reset user data/presets due to license changes or expiration.
- ❌ Expose full license keys or sensitive cryptographic tokens in logs or raw UI dumps.
- ❌ Bypass backend license validation rules via frontend state tampering.
- ❌ Permanently disable or revoke legitimate user licenses without server verification.
- ❌ Hide licensing behavior, subscription charges, or renewal dates from users.

---

## Definition of Done

A licensing implementation is considered **DONE** only if it is:

- ✅ **Secure:** Cryptographically signed tokens verified in Node.js main process.
- ✅ **Transparent:** Clear tier badges, expiration dates, and renewal status.
- ✅ **Reliable:** Stable offline grace period support without false lockouts.
- ✅ **User-friendly:** Clear Turkish error messages and single-click activation.
- ✅ **Privacy-conscious:** Zero PII or unnecessary system data collection.
- ✅ **Commercially Maintainable:** Extensible tier schemas and lifecycle management.
- ✅ **Fully Aligned with LUPER Standards:** Compliant with `AGENTS.md` and `RULES/license_rules.md`.

*This document defines the permanent licensing and subscription standards for the LUPER project.*
