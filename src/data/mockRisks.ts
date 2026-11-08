import type { Risk } from '../types/security'

// Aggregated fictional risks for demonstrating prioritization; these are not incident claims.
export const mockRisks: Risk[] = [
  {
    id: 'RSK-001',
    title: 'Critical field equipment remains on classical exchange',
    description: 'Several legacy connections carry high or critical operational importance while retaining classical key exchange, creating potential future HNDL exposure.',
    severity: 'Critical',
    affectedConnectionIds: ['CON-001', 'CON-004'],
    recommendedAction: 'Resolve device compatibility blockers and prioritize a tested replacement or approved migration path.',
  },
  {
    id: 'RSK-002',
    title: 'Unexpected classical negotiation needs review',
    description: 'Policy signals show classical negotiation on connections where fallback is not permitted; this is a downgrade indicator, not proof of attack.',
    severity: 'High',
    affectedConnectionIds: ['CON-004', 'CON-019'],
    recommendedAction: 'Review configuration and policy enforcement, then document whether the behavior is expected.',
  },
  {
    id: 'RSK-003',
    title: 'Replacement dates extend into next year',
    description: 'A group of legacy sensors and access panels remains scheduled for replacement after the current reporting period.',
    severity: 'Medium',
    affectedConnectionIds: ['CON-002', 'CON-003', 'CON-009', 'CON-012', 'CON-016'],
    recommendedAction: 'Confirm supplier timelines and track interim controls for devices with elevated HNDL exposure.',
  },
]

