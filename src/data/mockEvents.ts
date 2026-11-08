import type { SecurityEvent } from '../types/security'

// All records below are fictional dashboard examples, not reports of actual incidents.
export const mockEvents: SecurityEvent[] = [
  { id: 'EVT-001', connectionId: 'CON-001', timestamp: '2026-11-08T06:42:00Z', type: 'expected_fallback', severity: 'Medium', description: 'Connection used its approved classical fallback while the device remains migration-blocked.', investigationStatus: 'Not required' },
  { id: 'EVT-002', connectionId: 'CON-004', timestamp: '2026-11-08T06:18:00Z', type: 'unexpected_fallback', severity: 'High', description: 'Handshake negotiated classical exchange although fallback is not permitted; review policy and configuration.', investigationStatus: 'Open' },
  { id: 'EVT-003', connectionId: 'CON-007', timestamp: '2026-11-08T06:44:00Z', type: 'expected_fallback', severity: 'Low', description: 'Session used the documented fallback during staged migration.', investigationStatus: 'Not required' },
  { id: 'EVT-004', connectionId: 'CON-009', timestamp: '2026-11-08T06:12:00Z', type: 'handshake_failure', severity: 'Medium', description: 'Handshake retry recorded; no successful downgrade is implied.', investigationStatus: 'In review' },
  { id: 'EVT-005', connectionId: 'CON-005', timestamp: '2026-11-07T21:15:00Z', type: 'migration_checkpoint', severity: 'Info', description: 'Migration checkpoint confirms the configured ML-KEM profile.', investigationStatus: 'Resolved' },
  { id: 'EVT-006', connectionId: 'CON-014', timestamp: '2026-11-07T18:30:00Z', type: 'expected_fallback', severity: 'Low', description: 'Fallback occurred within the approved migration window.', investigationStatus: 'Not required' },
  { id: 'EVT-007', connectionId: 'CON-019', timestamp: '2026-11-07T15:02:00Z', type: 'unexpected_fallback', severity: 'Medium', description: 'Policy check found classical negotiation outside the device migration plan; investigate the configuration.', investigationStatus: 'Open' },
  { id: 'EVT-008', connectionId: 'CON-006', timestamp: '2026-11-07T11:48:00Z', type: 'policy_change', severity: 'Info', description: 'Policy update applied to the migrated connection profile.', investigationStatus: 'Resolved' },
  { id: 'EVT-009', connectionId: 'CON-002', timestamp: '2026-11-06T09:10:00Z', type: 'expected_fallback', severity: 'Medium', description: 'Legacy sensor session used its documented classical-only profile.', investigationStatus: 'Not required' },
  { id: 'EVT-010', connectionId: 'CON-010', timestamp: '2026-11-05T16:20:00Z', type: 'migration_checkpoint', severity: 'Info', description: 'Checkpoint recorded the migrated ML-KEM profile.', investigationStatus: 'Resolved' },
  { id: 'EVT-011', connectionId: 'CON-012', timestamp: '2026-11-05T08:35:00Z', type: 'handshake_failure', severity: 'Low', description: 'Intermittent handshake failure queued for routine maintenance review.', investigationStatus: 'In review' },
  { id: 'EVT-012', connectionId: 'CON-019', timestamp: '2026-11-04T14:05:00Z', type: 'expected_fallback', severity: 'Low', description: 'Fallback used before the recorded policy exception review.', investigationStatus: 'Resolved' },
]

