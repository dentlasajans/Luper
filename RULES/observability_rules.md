# LUPER Permanent Observability & Diagnostics Standards (`RULES/observability_rules.md`)

This document defines the permanent observability, subsystem health monitoring, metrics, and diagnostic standards for the **LUPER** project.

Every AI agent and software engineer working on LUPER must follow these rules.

---

## Technology Stack

- **Windows** (Target OS Platform)
- **Electron** (Application Framework & IPC Diagnostics)
- **Node.js** (Main Process, Health Probes & Tracing Systems)
- **React 19** (TypeScript Frontend UI & Health Dashboard Components)
- **TypeScript** (Strongly Typed Metric Contracts & Diagnostic Schemas)

---

## Purpose

Define a comprehensive observability architecture that enables reliable real-time monitoring, rapid diagnostics, and effective troubleshooting throughout the lifetime of the LUPER project.

Observability must allow developers and AI agents to understand system behavior and root causes without impacting user experience or system responsiveness.

---

## Observability Philosophy

- **Observable Systems:** Every critical subsystem in LUPER must be inherently observable.
- **Detectability:** System problems and performance degradations must be proactively detectable.
- **Diagnosability:** All runtime failures must provide actionable root-cause diagnostic traces.
- **Measurability:** Healthy systems must be quantifiable through concrete metrics.

*Observability exists to improve application reliability and health, never to gather excessive or intrusive data.*

---

## Core Principles

Observability in LUPER must be:

- **Reliable:** Accurate, deterministic reporting of subsystem states.
- **Lightweight:** Negligible CPU, RAM, and disk I/O overhead.
- **Secure:** Encrypted diagnostic channels with strict access boundaries.
- **Privacy-first:** Zero PII, credentials, or sensitive path collection.
- **Consistent:** Uniform metric naming and logging formats across Node.js main process and React renderer.
- **Actionable:** Every diagnostic signal must point to a specific resolution path.

---

## Observability Pillars

LUPER observability rests upon 5 integrated pillars:

```
    ┌──────────┐     ┌──────────┐     ┌─────────────┐     ┌───────────────────┐     ┌───────────────────────┐
    │   Logs   │ ──► │ Metrics  │ ──► │ Diagnostics │ ──► │ Health Indicator  │ ──► │ Performance Profiler  │
    └──────────┘     └──────────┘     └─────────────┘     └───────────────────┘     └───────────────────────┘
```

1. **Structured Logs:** Diagnostic events emitted by Node.js main process logger and TypeScript renderer logger.
2. **Metrics:** Quantitative measurements of startup duration, memory footprints, and execution latency.
3. **Diagnostics:** Automated root-cause inspection of failed IPC commands or Win32 calls.
4. **Health Information:** Real-time health status reporting across core subsystems.
5. **Performance Indicators:** High-frequency rendering and frame-rate profiling metrics (60 FPS enforcement).

---

## Health Monitoring

The application must continuously monitor and report the health of major subsystems:

- **Startup & Boot Health:** Cold startup timing checks (target <100ms).
- **Initialization Health:** Subsystem load verification (Win32 bridge, SQLite DB, Electron IPC handlers).
- **Resource Availability:** System memory availability, disk quotas, and handle counts.
- **Configuration Integrity:** Schema validity checks for `config.json` and dual-layer persistence files.
- **Internal Component Status:** Detecting thread panics, unhandled promise rejections, or IPC timeouts.

*Health reports must remain clear, non-technical, and actionable.*

---

## Metrics

Observability metrics must focus strictly on LUPER application behavior:

- **Startup Duration:** Time elapsed from process launch to main UI paint (sub-100ms).
- **Module Initialization Time:** Delay per native Node.js plugin or React component load.
- **Memory Footprint:** RAM consumption of Electron main process and webview renderers.
- **CPU Utilization:** Core utilization percentages during active optimization tasks.
- **IPC Response Time:** Latency per Electron ContextBridge IPC invocation (target <16ms).
- **Operation Duration:** Execution timing for system scans, backups, or registry queries.
- **Resource Utilization:** Open file handles, thread count, and channel queue depths.

*Do not collect unrelated third-party system activity or background process telemetry.*

---

## Diagnostics

Diagnostic systems must accelerate root-cause analysis by capturing:

- Unexpected runtime panics or IPC failure codes.
- Performance degradation triggers (e.g., UI frame drops below 60 FPS).
- Memory allocation spikes or resource exhaustion states.
- Hardware or Windows build version incompatibilities.
- Configuration syntax errors or schema validation mismatches.

---

## Alerting

The observability architecture must trigger internal alerts for:

- **Critical Failures:** Core subsystem crashes, Win32 privilege elevation rejections, or DB corruption.
- **Repeated Failures:** Consecutive IPC channel timeouts or failed retries.
- **Unexpected Application States:** Dual-layer persistence sync mismatches.
- **Recovery Events:** Successful automatic rollback or configuration restoration.

> 🛑 **NOISE PREVENTION RULE:**
> Alert mechanisms must be strictly filtered to prevent log spam, false positives, or unnecessary user notifications.

---

## Privacy

Observability implementations MUST strictly comply with `RULES/privacy_rules.md` and `RULES/telemetry_rules.md`:

- **NEVER** expose personal user documents, personal directory paths, or usernames.
- **NEVER** log passwords, authentication tokens, or cryptographic secret keys.
- **NEVER** capture clipboard contents, keystrokes, or web browsing history.

*Privacy remains non-negotiable across all diagnostic logging and metric aggregation.*

---

## Performance

Observability tools must:

- Impose **< 1% CPU overhead** during active operations and **0% idle overhead**.
- Avoid memory allocations inside high-frequency render loops or IPC handlers.
- Use asynchronous logging channels (`electron-log` / async stream in Node.js) to prevent main-thread I/O blocking.
- Scale efficiently without inflating disk log sizes (enforce log rotation and compression).

---

## Integration

Observability must integrate seamlessly across core architectural boundaries:

- **Logging:** Structured JSON logs mapped directly to diagnostic event schemas.
- **Telemetry:** Aggregated, privacy-sanitized metrics routed to `RULES/telemetry_rules.md`.
- **Diagnostics:** Error codes formatted according to `RULES/api_rules.md`.
- **Update System:** Pre- and post-update health status validation.
- **Backup & Migration:** Verification of data integrity during migrations (`RULES/migration_rules.md`).
- **Plugin System:** Sandboxed plugin health and memory monitoring (`RULES/plugin_rules.md`).

---

## Documentation

The engineering team must maintain documentation detailing:

- Catalog of all subsystem health indicators and warning thresholds.
- Complete metric naming directory and unit definitions.
- Diagnostic capabilities, troubleshooting guides, and trace extraction procedures.
- Monitoring architecture diagrams and IPC channel maps.
- Operational limitations and profiler overhead boundaries.

---

## Things Never Allowed

**NEVER:**

- ❌ Monitor or log undocumented, un-justified user information.
- ❌ Expose sensitive data, credentials, or personal directory paths in diagnostic traces.
- ❌ Duplicate telemetry or metric payloads unnecessarily across channels.
- ❌ Allow observability tools to degrade UI responsiveness below 60 FPS or delay startup.
- ❌ Swallow or hide critical subsystem failures without diagnostic logging.
- ❌ Ignore failed health checks or proceed with corrupted application states.

---

## Definition of Done

An observability implementation is considered **DONE** only if it is:

- ✅ **Reliable:** Accurate, deterministic health state reporting.
- ✅ **Actionable:** Diagnostics provide explicit technical resolution paths.
- ✅ **Lightweight:** Imposes <1% CPU overhead and zero main-thread blocking.
- ✅ **Secure:** Encrypted channels with strict log sanitization.
- ✅ **Privacy-first:** Zero PII or sensitive data collection.
- ✅ **Well Documented:** Complete metric catalogs and health indicators documented.
- ✅ **Fully Aligned with LUPER Standards:** Compliant with `AGENTS.md` and `RULES/observability_rules.md`.

*This document defines the permanent observability standards for the LUPER project.*
