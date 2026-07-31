# LUPER Permanent Telemetry & Diagnostics Standards (`RULES/telemetry_rules.md`)

This document defines the permanent telemetry, diagnostics, and analytics standards for the **LUPER** project.

Every AI agent and software engineer working on LUPER must follow these rules.

---

## Technology Stack

- **Windows** (Target OS Platform)
- **Electron** (Application Framework & IPC Bridge)
- **Node.js** (Native Backend & Diagnostic Handlers)
- **React 19** (TypeScript Frontend UI)

---

## Purpose

Define a transparent, privacy-first, and secure telemetry architecture for the LUPER project.

Telemetry exists exclusively to improve application quality, system reliability, and diagnostics while respecting user privacy at all times.

---

## Telemetry Philosophy

- **Privacy comes before analytics:** User privacy is non-negotiable.
- **Measurable Value:** Telemetry should collect only information that provides measurable technical value for performance tuning or bug resolution.
- **No Unnecessary Data:** Never collect data simply because it is available.
- **Data Minimization:** Always minimize collected data payloads to the strict minimum required.

---

## Core Principles

Telemetry in LUPER must be:

- **Transparent:** Users can inspect what telemetry is collected.
- **Optional where appropriate:** Non-essential telemetry must be opt-in or configurable.
- **Minimal:** Compact payload sizes without bloated attributes.
- **Secure:** Encrypted transmission channels with strict integrity validation.
- **Anonymous whenever possible:** Identifiers must be anonymized or pseudonymous hashes.
- **Well Documented:** Every event category and field must be clearly documented.

*Users should always understand what is being collected and why.*

---

## Telemetry Categories

Supported telemetry categories in LUPER include:

- **Crash Reports:** Fatal panics, native application crashes, and unhandled exception traces.
- **Performance Metrics:** Application startup times, module loading durations, and memory footprint.
- **Diagnostic Information:** Hardware capability detection, OS build versions, and IPC error codes.
- **Update Statistics:** Application version update success/failure counts.
- **Feature Usage:** Frequency of feature execution (if explicitly enabled by user).
- **License Validation Events:** Anonymous cryptographic license validation checks.

Each category must have a clearly documented purpose.

---

## Data Collection

- Collect only the minimum information necessary to achieve diagnostic goals.
- Prefer aggregated statistical information over detailed individual user activity logs.
- Avoid continuous background data collection or excessive polling telemetry.

---

## Personally Identifiable Information

**NEVER COLLECT:**

- User documents or personal files
- Passwords, access tokens, or credentials
- Registry keys or values unrelated to LUPER configuration
- Clipboard contents
- Web browsing history
- Keystrokes or input logging
- Personal identifiers (name, email, IP addresses in raw form, MAC addresses)

> 🛑 **PRIVACY GUARANTEE:**
> Telemetry must **never** become user surveillance under any circumstances.

---

## Crash Reporting

- Crash reports should include only technical information required to diagnose failures (e.g., stack trace, LUPER build version, OS build number).
- Sensitive information, personal paths, or environment variables must be sanitized and removed before transmission whenever possible.

---

## Performance Metrics

Performance telemetry may include:

- Application startup duration (sub-100ms targets)
- Module load time and lazy initialization delays
- Feature execution duration
- RAM/Memory usage footprint
- CPU usage percentage during active operations

*Do not collect unrelated system activity or third-party background process performance.*

---

## Diagnostics

Diagnostic information should help identify:

- Failed native Win32/Electron operations
- Hardware or Windows version compatibility issues
- Application update failures
- Unexpected behavior or IPC channel errors

Diagnostics should remain strictly focused on application health and stability.

---

## User Control

Users must be able to:

- View clear telemetry settings in the UI.
- Enable or disable optional telemetry categories at any time.
- Understand all telemetry categories through user-friendly Turkish descriptions.
- Change their telemetry preferences at any time without restriction.

---

## Security

Telemetry transmission must:

- Use TLS/HTTPS encrypted communication endpoints.
- Validate transmitted payload schemas and signatures.
- Protect telemetry endpoint integrity.
- Prevent unauthorized access or interception of telemetry streams.

---

## Retention

- Collected telemetry data must not be retained on servers longer than technically necessary.
- Data retention policies and expiration schedules must be clearly documented.

---

## Documentation

LUPER telemetry implementation must document:

- All collected data fields and event names.
- Technical purpose for each telemetry event.
- Data storage and server retention duration.
- User opt-in/opt-out control mechanisms.
- Encrypted transmission methods and endpoints.

---

## Things Never Allowed

**NEVER:**

- ❌ Collect personal files, documents, or personal directory listings.
- ❌ Collect passwords, credentials, or authentication tokens.
- ❌ Track user activity unrelated to LUPER application functions.
- ❌ Hide telemetry behavior or run secret data collection background services.
- ❌ Ignore user privacy choices or telemetry opt-out preferences.
- ❌ Transmit unnecessary or bloated system information payloads.

---

## Definition of Done

A telemetry implementation is considered **DONE** only if it is:

- ✅ **Transparent:** Fully visible and inspectable.
- ✅ **Privacy-first:** Zero PII or sensitive data collection.
- ✅ **Secure:** Encrypted over TLS with schema validation.
- ✅ **Minimal:** Tailored exclusively to essential health metrics.
- ✅ **User-controlled:** Fully toggleable via user settings.
- ✅ **Well Documented:** Documented in project technical guides.
- ✅ **Fully Aligned with LUPER Standards:** Compliant with `AGENTS.md` and `RULES/telemetry_rules.md`.

*This document defines the permanent telemetry standards for the LUPER project.*
