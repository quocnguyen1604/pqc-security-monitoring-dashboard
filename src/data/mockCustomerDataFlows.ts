import type { CustomerDataFlow } from '../types/customerReporting'

// Illustrative estimated customer data volumes per month for October 2026.
// These are not observed traffic measurements; classes are provisional examples.
export const mockCustomerDataFlows: CustomerDataFlow[] = [
  { id: 'FLOW-001', connectionId: 'CON-001', dataClass: 'Restricted', estimatedVolume: 80, measurementUnit: 'GB', reportingPeriod: '2026-10' },
  { id: 'FLOW-002', connectionId: 'CON-002', dataClass: 'Confidential', estimatedVolume: 140, measurementUnit: 'GB', reportingPeriod: '2026-10' },
  { id: 'FLOW-003', connectionId: 'CON-004', dataClass: 'Restricted', estimatedVolume: 200, measurementUnit: 'GB', reportingPeriod: '2026-10' },
  { id: 'FLOW-004', connectionId: 'CON-005', dataClass: 'Restricted', estimatedVolume: 50, measurementUnit: 'GB', reportingPeriod: '2026-10' },
  { id: 'FLOW-005', connectionId: 'CON-006', dataClass: 'Confidential', estimatedVolume: 100, measurementUnit: 'GB', reportingPeriod: '2026-10' },
  { id: 'FLOW-006', connectionId: 'CON-007', dataClass: 'Restricted', estimatedVolume: 90, measurementUnit: 'GB', reportingPeriod: '2026-10' },
  { id: 'FLOW-007', connectionId: 'CON-010', dataClass: 'Internal', estimatedVolume: 400, measurementUnit: 'GB', reportingPeriod: '2026-10' },
  { id: 'FLOW-008', connectionId: 'CON-011', dataClass: 'Internal', estimatedVolume: 300, measurementUnit: 'GB', reportingPeriod: '2026-10' },
  { id: 'FLOW-009', connectionId: 'CON-013', dataClass: 'Confidential', estimatedVolume: 180, measurementUnit: 'GB', reportingPeriod: '2026-10' },
  { id: 'FLOW-010', connectionId: 'CON-014', dataClass: 'Internal', estimatedVolume: 60, measurementUnit: 'GB', reportingPeriod: '2026-10' },
  { id: 'FLOW-011', connectionId: 'CON-015', dataClass: 'Confidential', estimatedVolume: 120, measurementUnit: 'GB', reportingPeriod: '2026-10' },
  { id: 'FLOW-012', connectionId: 'CON-017', dataClass: 'Restricted', estimatedVolume: 240, measurementUnit: 'GB', reportingPeriod: '2026-10' },
  { id: 'FLOW-013', connectionId: 'CON-019', dataClass: 'Confidential', estimatedVolume: 70, measurementUnit: 'GB', reportingPeriod: '2026-10' },
  { id: 'FLOW-014', connectionId: 'CON-020', dataClass: 'Restricted', estimatedVolume: 300, measurementUnit: 'GB', reportingPeriod: '2026-10' },
]
