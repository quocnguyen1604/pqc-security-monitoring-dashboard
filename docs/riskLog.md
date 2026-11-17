# Project Risk Register

## 1. Purpose

This document identifies, assesses and tracks risks that may affect the successful development and delivery of the PQC Security Monitoring Dashboard.

The risk register is intended to help the group anticipate potential problems, assess their consequences and define appropriate mitigation strategies.

## 2. Instructions for Adding New Risks

When identifying a new risk, use the following template.

### Risk entry template

```markdown
### R-XX: [Short risk title]

- **Date identified:** YYYY-MM-DD
- **Probability:** Low / Medium / High
- **Impact:** Low / Medium / High
- **Risk status:** Open / Mitigated / Occurred / Closed

**Description:**
Describe the uncertain event or condition that could negatively affect the project.

**Potential consequences:**
Explain what could happen if the risk materializes.

**Mitigation strategy:**
Describe preventive actions that can reduce the probability or impact of the risk.

**Contingency plan:**
Describe what the group should do if the risk actually occurs.

**Review history:**
Record updates, changes in probability or impact, and actions taken during subsequent sprints.
```

## 3. Risk Assessment Guidelines

Use the following definitions when evaluating risks.

### Probability

| Level  | Description                                       |
| ------ | ------------------------------------------------- |
| Low    | Unlikely to occur during the project.             |
| Medium | Could reasonably occur during the project.        |
| High   | Likely to occur or already showing warning signs. |

### Impact

| Level  | Description                                                    |
| ------ | -------------------------------------------------------------- |
| Low    | Minor inconvenience with little effect on project delivery.    |
| Medium | Could cause additional work, delays or reduced quality.        |
| High   | Could significantly affect project scope, quality or deadline. |

### Risk Status

| Status    | Meaning                                                      |
| --------- | ------------------------------------------------------------ |
| Open      | Risk has been identified and requires monitoring.            |
| Mitigated | Preventive actions have been implemented, reducing the risk. |
| Occurred  | The risk has materialized and requires management.           |
| Closed    | Risk is no longer relevant or requires no further action.    |

## 4. Project Risks

### R-01: Critical connections remain on classical key exchange

- **Date identified:** 2026-11-10
- **Probability:** High
- **Impact:** High
- **Risk status:** Open

**Description:**
The inventory contains legacy connections using ECDH P-256 or X25519, including critical field and industrial equipment. Some of these connections also have high HNDL exposure or permit classical fallback.

**Potential consequences:**
Sensitive long-lived traffic may remain exposed to future cryptographic decryption capabilities, and critical services may continue operating below the intended migration target.

**Mitigation strategy:**
Prioritize high-criticality and high-HNDL connections, resolve device compatibility blockers, and require a tested replacement or approved migration path. Track the affected connection IDs and review the dashboard status at each checkpoint.

**Contingency plan:**
Escalate blocked critical devices to the migration owner, apply approved interim controls where available, and revise the replacement schedule with an explicit residual-risk acceptance.

**Review history:**
2026-11-11: Opened after reviewing the initial 20-connection inventory; three connections are marked blocked and five have high HNDL exposure.

### R-02: Replacement and migration work misses planned dates

- **Date identified:** 2026-11-10
- **Probability:** Medium
- **Impact:** High
- **Risk status:** Open

**Description:**
Several legacy sensors, access panels and controllers have replacement dates extending into 2027, while two connections are still in progress and five are planned.

**Potential consequences:**
PQC coverage may remain below target, project milestones may slip, and interim classical exposure may persist longer than expected.

**Mitigation strategy:**
Confirm supplier and engineering timelines, maintain a connection-level migration plan, and review blocked and planned devices separately from migrated devices. Use the migration distribution and expected replacement dates during each project review.

**Contingency plan:**
Reprioritize work toward critical or high-exposure connections, identify an alternative compatible device or migration path, and document any accepted schedule or exposure change.

**Review history:**
2026-11-11: Opened because the initial inventory includes planned replacements through 2027-06-30.

### R-03: Fallback indicators are misinterpreted as confirmed attacks

- **Date identified:** 2026-11-10
- **Probability:** Medium
- **Impact:** Medium
- **Risk status:** Mitigated

**Description:**
Users may interpret an unexpected fallback or handshake failure event as proof that an attack occurred, even though the dashboard only contains fictional policy and event signals.

**Potential consequences:**
The team could make unsupported incident claims, prioritize the wrong remediation, or lose confidence in the dashboard when an indicator is later resolved.

**Mitigation strategy:**
Label events with investigation status, distinguish expected from unexpected fallback, and use wording that identifies unexpected fallback as a review indicator. Test that unresolved high-severity events affect status while resolved events do not have the same effect.

**Contingency plan:**
Pause incident conclusions, review the associated connection and configuration evidence, and update the event investigation status and risk record once the signal is understood.

**Review history:**
2026-11-11: Mitigated in the data model, UI wording and risk tests; continue reviewing wording as features change.

### R-04: Synthetic data is mistaken for live security monitoring

- **Date identified:** 2026-11-11
- **Probability:** Medium
- **Impact:** High
- **Risk status:** Mitigated

**Description:**
The dashboard may be presented outside its intended university-project context even though it does not connect to infrastructure, external services or cryptographic operations.

**Potential consequences:**
Stakeholders may rely on fictional records for operational decisions or assume that the dashboard provides evidence of current protection or compromise.

**Mitigation strategy:**
Keep all records local and fictional, document scope and limitations in the README, and describe HNDL ratings and fallback signals as indicators rather than evidence.

**Contingency plan:**
Correct the presentation immediately, label demonstrations as fictional, and prevent deployment or use as an operational monitoring tool until a separately approved data source and security review exist.

**Review history:**
2026-11-11: Mitigated through project documentation and explicit comments in the domain and data model; revisit if the data source changes.

### R-05: Aggregate coverage obscures a high-risk connection

- **Date identified:** 2026-11-11
- **Probability:** Medium
- **Impact:** High
- **Risk status:** Mitigated

**Description:**
A single PQC coverage percentage could appear healthy while an individual critical connection remains on classical exchange or has an unresolved fallback indicator.

**Potential consequences:**
Decision-makers could overlook a small number of severe exposures and incorrectly conclude that migration is complete.

**Mitigation strategy:**
Show classical connection counts, high-exposure counts, migration status distribution, connection-level risk details and overall status factors alongside the coverage percentage. Ensure critical unresolved exposure can produce a red overall status even when coverage is high.

**Contingency plan:**
Use the connection and risk views as the authoritative prioritization surface, investigate the affected records, and communicate the specific residual exposure rather than relying on the aggregate percentage.

**Review history:**
2026-11-11: Mitigated by separate metrics, layered status rules and tests covering 95% coverage with one critical exposed connection.


### R-06: Customer replacement targets may not meet the proposed deadline

- **Date identified:** 2026-11-15
- **Probability:** High
- **Impact:** High
- **Risk status:** Open

**Description:**
The customer-specific dashboard shows that CON-004 and CON-019 have replacement targets in 2028, which is after the proposed 31 December 2027 deadline. CON-002 has no confirmed replacement target.

**Potential consequences:**
The group may not be able to show a clear migration schedule for all customer-data connections by the proposed date. Some customer data may remain associated with classical key exchange for longer than expected.

**Mitigation strategy:**
Confirm replacement dates with the relevant owners and suppliers. Review the two targets after the proposed deadline and ask for a replacement target for CON-002. Discuss the schedule with the Product Owner.

**Contingency plan:**
Escalate the missing and late targets, look for another suitable replacement or migration plan, and explain the remaining risks at the next review.

**Review history:**
2026-11-17: Added in Sprint 2 after the customer deadline was changed to a proposed date of 31 December 2027. The dashboard shows two potential deadline conflicts and one target that needs clarification.

### R-07: The proposed customer deadline is not confirmed

- **Date identified:** 2026-11-15
- **Probability:** Medium
- **Impact:** High
- **Risk status:** Open

**Description:**
The customer has proposed 31 December 2027 as the new PQC deadline, but the proposal is still awaiting confirmation from the Product Owner and the customer.

**Potential consequences:**
The group may plan the migration or present the deadline as an approved commitment before it has been agreed.

**Mitigation strategy:**
Keep the deadline labeled as proposed in the dashboard. Ask the Product Owner to confirm the date and the customer-data scope before treating it as an approved requirement.

**Contingency plan:**
If the proposal changes, update the configured deadline, review the affected replacement targets, and update the customer report.

**Review history:**
2026-11-17: Added in Sprint 2. The dashboard labels the deadline as proposed and says that the agreement modification is awaiting confirmation.

### R-08: Customer connection details and data classes may be incorrect

- **Date identified:** 2026-11-15
- **Probability:** High
- **Impact:** High
- **Risk status:** Open

**Description:**
The current demonstration marks 14 of 20 connections as carrying customer data. It uses Internal, Confidential, and Restricted as provisional data classes. These values are illustrative and have not been confirmed as the customer's actual inventory or classification scheme.

**Potential consequences:**
Incorrect connection details or data classes could affect customer PQC coverage, HNDL estimates, and the list of connections shown in the report.

**Mitigation strategy:**
Ask the Product Owner/customer to confirm which connections carry customer data and whether the three data classes are suitable. Keep the current values clearly labeled as synthetic until confirmation.

**Contingency plan:**
Update the connection flags and data classes, rerun the calculations and tests, and create a new report using the corrected information.

**Review history:**
2026-11-17: Added in Sprint 2 because the new customer report depends on customer-specific connection scope and data classification.

### R-09: Synthetic HNDL estimates are mistaken for actual customer traffic

- **Date identified:** 2026-11-15
- **Probability:** Medium
- **Impact:** High
- **Risk status:** Mitigated

**Description:**
The customer exposure view uses fictional data-flow estimates (GB per month) for October 2026. The classical-associated volume is calculated from each linked connection's key-exchange algorithm. It does not measure real network traffic or attacker activity.

**Potential consequences:**
A reader may think the displayed volume is actual collected data or proof of a security breach.

**Mitigation strategy:**
Show the reporting period, unit, and synthetic-data note. Explain that classical key exchange indicates possible future HNDL exposure only and does not prove that data has been collected or compromised.

**Contingency plan:**
Correct any unclear wording, explain how the figures are calculated, and replace any report that presents the estimates as real traffic.

**Review history:**
2026-11-17: Mitigated in Sprint 2 through the customer reporting assumptions and the explanation shown with the HNDL breakdown. The dashboard shows 2,330 GB/month total estimated volume and 640 GB/month associated with classical key exchange. These are synthetic estimates, not measured traffic.

### R-10: Customer data-flow records may be missing or linked incorrectly

- **Date identified:** 2026-11-15
- **Probability:** Medium
- **Impact:** High
- **Risk status:** Open

**Description:**
The HNDL breakdown depends on customer data-flow records being linked to the correct connection and data class. Missing or incorrect records could change the totals and percentages shown in the dashboard.

**Potential consequences:**
The customer may see an incorrect estimate of data associated with classical key exchange, or a connection contributing to exposure may be missing from the report.

**Mitigation strategy:**
Check that each data-flow record has a valid connection, data class, volume, unit, and reporting period. Compare the class totals with the source records and test the calculation when values are missing or zero.

**Contingency plan:**
Correct the records, then rerun the calculations and tests before using the report. If information is incomplete, label the affected result as incomplete rather than presenting it as final.

**Review history:**
2026-11-17: Added in Sprint 2 because the new exposure feature calculates class totals and percentages from linked synthetic data-flow records.

### R-11: The customer report preview is not reviewed before it is shared

- **Date identified:** 2026-11-15
- **Probability:** Medium
- **Impact:** Medium
- **Risk status:** Open

**Description:**

The Sprint 2 requirements include an initial customer report structure for the next review meeting. The source code includes a customer report feature, but the report structure still needs review.

**Potential consequences:**

The report may not include the information or wording the Product Owner expects, or a draft based on synthetic data may be mistaken for an approved customer report.

**Mitigation strategy:**

Show the report preview to the Product Owner and ask for feedback on its sections, wording, and assumptions. Clearly label it as a draft based on synthetic data.

**Contingency plan:**

Update the report structure based on the feedback and review it again before sharing it outside the project group.

**Review history:**

2026-11-17: Added in Sprint 2 because the customer report feature needs Product Owner review before sharing.
