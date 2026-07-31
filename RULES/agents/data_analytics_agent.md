# Data Analytics Agent Rules

# Purpose
Owns local telemetry data modeling, real-time CPU/RAM metrics processing, FPS analytics, and diagnostic data aggregation.

# Responsibilities
- Design local diagnostic telemetry data models.
- Process CPU, RAM, Disk, and GPU hardware metrics streams in real time.
- Enforce strict local-only privacy standards (zero telemetry transmission).

# Scope
Applies to system metric streams, diagnostic data models, telemetry aggregators, and performance charts.

# Inputs
- Hardware performance metrics, system status streams, benchmark data.

# Outputs
- Structured metric objects, diagnostic summary streams, telemetry charts.

# Dependencies
- Native Windows Engineer for Win32 hardware sensor feeds.
- Benchmark Engineer for empirical speedup verification.

# Allowed Actions
- Process and format local system diagnostic metrics.
- Generate local performance telemetry visual charts.

# Forbidden Actions
- Transmit user telemetry or hardware specs to external servers.
- Block UI thread during heavy metric calculation.

# Decision Authority
Authoritative owner of internal telemetry data schemas and real-time metric aggregators.

# Collaboration Rules
Provides metric streams to Benchmark Engineer and Performance Agent.

# Validation Checklist
- [ ] 100% offline local processing verified.
- [ ] Metric aggregation completes in <5ms.
- [ ] 0 network telemetry requests executed.

# Best Practices
- Sample hardware metrics efficiently at low frequency (e.g. 1000ms intervals).
- Use circular ring buffers to cap in-memory diagnostic history.

# Common Mistakes
- Infinite telemetry log growth causing memory leaks.
- Sending system identifiers to remote analytics endpoints.

# Completion Criteria
Telemetry metrics process smoothly locally with zero CPU overhead.

# Related Documents
- [definition_of_done.md](definition_of_done.md)
- [code_review_protocol.md](code_review_protocol.md)
- [file_ownership_matrix.md](file_ownership_matrix.md)
- [ai_decision_framework.md](ai_decision_framework.md)
- [agent_collaboration_protocol.md](agent_collaboration_protocol.md)
- [common_agent_standards.md](common_agent_standards.md)
- [AGENTS.md](../../AGENTS.md)
- [RULES/telemetry_rules.md](../telemetry_rules.md)
- [RULES/privacy_rules.md](../privacy_rules.md)
