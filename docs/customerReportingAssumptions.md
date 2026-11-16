# Customer reporting assumptions

This document records provisional assumptions used by the customer-specific PQC migration and HNDL report preview. None of these assumptions should be presented as customer-approved policy or as an approved contractual commitment.

## Proposed PQC deadline

- The customer has proposed **31 December 2027** as the PQC key-establishment deadline.
- The application defines this as `CUSTOMER_PQC_DEADLINE` in `src/config/customerReporting.ts`.
- The proposal remains subject to confirmation by the Product Owner and customer. The dashboard identifies replacement targets after this date for review; it does not assert compliance, non-compliance, or whether delivery is on track.

## Customer-data connections

- `Connection.carriesCustomerData` identifies which existing synthetic connections carry this customer's data.
- Fourteen of the twenty demonstration connections are currently marked as carrying customer data: `CON-001`, `CON-002`, `CON-004`, `CON-005`, `CON-006`, `CON-007`, `CON-010`, `CON-011`, `CON-013`, `CON-014`, `CON-015`, `CON-017`, `CON-019`, and `CON-020`.
- `CON-003`, `CON-008`, `CON-009`, `CON-012`, `CON-016`, and `CON-018` are marked as not carrying customer data and are excluded from customer migration denominators and customer report exposure calculations.
- These flags are illustrative. They must be confirmed or replaced when customer-specific inventory is available.

## Data classes

The provisional classes are centrally configured in `src/config/customerReporting.ts`:

- **Internal** — routine operational information for demonstration.
- **Confidential** — sensitive business information for demonstration.
- **Restricted** — the highest sensitivity class in this demonstration.

These names and descriptions are illustrative labels, not an adopted customer classification taxonomy. The Product Owner/customer must confirm the taxonomy before using this report as a customer statement.

## Volume and reporting period

- Each `CustomerDataFlow` records an estimated volume in **GB per month** for **October 2026**.
- The unit and period are configured centrally; the corresponding values are also recorded on each flow so assumptions can be validated.
- Values are fictional estimates created to demonstrate aggregation and visualization. They are not measured network traffic or actual customer data volumes.

## HNDL estimate methodology

For every configured data class:

1. Sum the estimated volumes of its valid customer data-flow records to obtain the class total.
2. Look up each flow's associated connection in the connection inventory.
3. Sum the flow volume as potentially exposed when the connection's key-exchange algorithm is classical. ML-KEM-associated volume is reported separately.
4. Calculate the classical-associated share as `classical-associated volume / total class volume * 100` (zero when the class total is zero).
5. List the connections contributing classical-associated volume.

The classification uses the key-exchange algorithm, not event counts or the connection's HNDL label. Classical key exchange indicates potential future HNDL exposure only. These figures do not indicate that traffic has been collected, that a compromise occurred, or the probability that data could be decrypted in the future.

## Schedule interpretation

- The synthetic targets for `CON-004` and `CON-019` are in 2028, after the proposed deadline, to make the schedule trade-off visible.
- `CON-002` has no replacement target to demonstrate the need for schedule clarification.
- Replacement dates are not project baselines or delivery commitments. The dashboard flags dates for review and does not automatically resolve the conflict between existing plans and the proposal.

## Prototype limitations

All connection, risk, event, customer-data-flow, and schedule values are local fictional data. The application does not connect to customer systems, monitor traffic, perform cryptographic operations, or detect actual security incidents.
