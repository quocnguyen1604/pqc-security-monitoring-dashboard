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
Use React with TypeScript, Vite, Tailwind CSS, and Recharts, with shared domain types and service functions separated from feature components.

**Rationale:**
This stack supports the required dashboard views while keeping data types, calculations, and presentation concerns distinct. Vitest tests cover the metric and risk rules independently from the UI.

### D-06: Keep customer-specific reporting separate from organizational metrics

- **Date:** 2026-11-15
- **Sprint:** Sprint 2

**Context:**
The customer asked for a dashboard view that shows the status of connections carrying its data. The existing dashboard already provides an organization-wide security overview.

**Decision:**
Add a customer-data flag to the connection model and calculate customer migration and exposure metrics using only connections marked as carrying customer data. Keep these figures separate from the organizational metrics.

**Rationale:**
This makes the customer report more relevant and avoids including unrelated connections in the customer's coverage and exposure figures. The updated synthetic inventory contains 14 customer-data connections.

### D-07: Show 31 December 2027 as a proposed customer deadline

- **Date:** 2026-11-15
- **Sprint:** Sprint 2

**Context:**
The customer proposed that all connections carrying its data should use PQC key establishment by 31 December 2027, instead of the earlier end-of-2030 target.

**Decision:**
Use 31 December 2027 as the proposed customer deadline in the dashboard. Clearly label it as proposed and awaiting confirmation.

**Rationale:**
The team can show the potential impact of the new date without implying the agreement has already been approved. The deadline is configured in one place so it can be changed if the proposal changes.

### D-08: Use three provisional data classes for the customer exposure view

- **Date:** 2026-11-15
- **Sprint:** Sprint 2

**Context:**
The customer requested a breakdown of potentially exposed data by data class.

**Decision:**
Use Internal, Confidential, and Restricted as the provisional data classes in the customer report.

**Rationale:**
These classes allow us to demonstrate the requested breakdown. They are illustrative labels only and must be confirmed by the Product Owner/customer before being used as the customer's actual classification scheme.

### D-09: Calculate HNDL estimates from customer data flows and the connection algorithm

- **Date:** 2026-11-15
- **Sprint:** Sprint 2

**Context:**
The customer needs to see how much data is associated with classical key exchange, separated by data class.

**Decision:**
Use synthetic customer data-flow records for October 2026, measured in GB per month. For each class, calculate the total volume and the volume associated with connections using classical key exchange. Also show the percentage and the contributing connection IDs.

**Rationale:**
This gives the customer a clear breakdown and shows which connections contribute to the estimate. The calculation is based on the key-exchange algorithm, not on event counts. It shows potential future HNDL exposure only; it does not prove that data has been collected or compromised.

### D-10: Highlight replacement targets after the proposed deadline and missing targets

- **Date:** 2026-11-15
- **Sprint:** Sprint 2

**Context:**
The customer-specific inventory contains replacement targets after the proposed deadline and one connection without a confirmed target.

**Decision:**
Highlight CON-004 and CON-019 because their replacement targets are in 2028. Also flag CON-002 because its replacement target needs clarification.

**Rationale:**
This helps the team and customer see which schedules need attention. The dates are synthetic targets, not approved delivery commitments. The dashboard flags them for review rather than declaring the organization non-compliant.

### D-11: Add an initial customer report preview

- **Date:** 2026-11-15
- **Sprint:** Sprint 2

**Context:**
The Product Owner asked the team to show an initial report structure at the next review meeting.

**Decision:**
Add a customer report feature that brings together the proposed deadline, migration progress, HNDL exposure by data class, main blockers, recommended actions, and reporting assumptions.

**Rationale:**
A single customer-focused report makes the information easier to review. It also keeps the main customer information together, rather than requiring the reader to combine several dashboard sections. The report is still based on synthetic data and provisional assumptions.

