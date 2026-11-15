# Project Decision Log

## 1. Purpose

This document records significant technical and architectural decisions made during the development of the PQC Security Monitoring Dashboard. It provides transparency regarding the reasoning behind the current implementation.

## 2. Instructions for Adding New Decisions

When documenting a new decision, use the following template.

### Decision entry template

```markdown
### D-XX: [Short decision title]

- **Date:** YYYY-MM-DD
- **Sprint** Sprint X

**Context:**
Describe the problem, requirement or situation that required a decision.

**Decision:**
Clearly describe what was decided.

**Rationale:**
Explain why this approach was selected and, where relevant, what alternatives were considered.
```

## 3. Project Decisions

### D-01: Use a local synthetic inventory for the dashboard

- **Date:** 2026-11-11
- **Sprint:** Sprint 1

**Context:**
The project needs to demonstrate post-quantum migration monitoring without connecting to real infrastructure or handling operational security data.

**Decision:**
Use local, fictional connection, event and risk records as the dashboard data source.

**Rationale:**
This keeps the university project safe, deterministic and easy to demonstrate. It also makes the application testable without external services. The limitation is documented clearly so the dashboard is not presented as a production monitoring system.

### D-02: Measure PQC coverage using ML-KEM-768 adoption

- **Date:** 2026-11-11
- **Sprint:** Sprint 1

**Context:**
Users need a simple measure of migration progress across the connection inventory.

**Decision:**
Define PQC coverage as the percentage of connections using `ML-KEM-768`, while reporting classical connections separately.

**Rationale:**
The rule is transparent and directly reflects the migration target represented by the project. Keeping classical exposure visible prevents a high-level percentage from hiding remaining legacy connections. This metric is intentionally not treated as a complete security score.

### D-03: Use layered, explainable risk and status rules

- **Date:** 2026-11-11
- **Sprint:** Sprint 1

**Context:**
The dashboard must communicate overall posture while preserving important connection-level differences such as criticality, HNDL exposure and unresolved events.

**Decision:**
Classify connection risk from key-exchange algorithm, HNDL exposure, business criticality and unresolved unexpected fallback indicators. Derive the overall status from the resulting risk and event signals, with critical unresolved exposure or high-severity unexpected fallback producing a red status.

**Rationale:**
These inputs are available in the local model and can be explained to a user in plain language. Layered rules avoid allowing aggregate PQC coverage to conceal a single critical connection. The rules are implemented as project rules, not as a formal security certification.

### D-04: Treat fallback events as review indicators, not incident confirmation

- **Date:** 2026-11-11
- **Sprint:** Sprint 1

**Context:**
Classical fallback and handshake signals may indicate configuration or policy problems, but the project has no evidence source capable of confirming an attack.

**Decision:**
Display expected fallback, unexpected fallback and handshake events with investigation status, and describe unexpected fallback as an indicator requiring review rather than proof of compromise.

**Rationale:**
This preserves useful operational context without overstating what fictional event data can prove. Separating unresolved from resolved events also allows the risk classification to reduce after investigation.

### D-05: Build the interface as a typed React and TypeScript single-page application

- **Date:** 2026-11-11
- **Sprint:** Sprint 1

**Context:**
The project needs a responsive, maintainable interface with reusable dashboard components and testable business logic.

**Decision:**
Use React with TypeScript, Vite, Tailwind CSS and Recharts, with shared domain types and service functions separated from feature components.

**Rationale:**
This stack supports the required dashboard views while keeping data types, calculations and presentation concerns distinct. Vitest tests cover the metric and risk rules independently from the UI.
