export type KeyExchangeAlgorithm = 'ML-KEM-768' | 'ECDH P-256' | 'X25519'
export type DeviceCategory = 'Field gateway' | 'Environmental sensor' | 'Industrial controller' | 'Payment terminal' | 'Operations server' | 'Building access panel'
export type DeviceCriticality = 'Low' | 'Medium' | 'High' | 'Critical'
export type HndlExposure = 'Low' | 'Moderate' | 'High'
export type MigrationStatus = 'Migrated' | 'In progress' | 'Blocked' | 'Planned'
export type EventType = 'expected_fallback' | 'unexpected_fallback' | 'handshake_failure' | 'policy_change' | 'migration_checkpoint'
export type EventSeverity = 'Info' | 'Low' | 'Medium' | 'High' | 'Critical'
export type InvestigationStatus = 'Not required' | 'Open' | 'In review' | 'Resolved'
export type RiskSeverity = 'Low' | 'Medium' | 'High' | 'Critical'

/** One connection record. Timestamps use ISO 8601 UTC strings. */
export interface Connection {
  id: string
  deviceName: string
  site: string
  category: DeviceCategory
  keyExchangeAlgorithm: KeyExchangeAlgorithm
  isLegacy: boolean
  classicalFallbackPermitted: boolean
  criticality: DeviceCriticality
  hndlExposure: HndlExposure
  migrationStatus: MigrationStatus
  lastSeenAt: string
  expectedReplacementDate?: string
}

/** Dashboard event; it does not assert that a real incident occurred. */
export interface SecurityEvent {
  id: string
  connectionId: Connection['id']
  timestamp: string
  type: EventType
  severity: EventSeverity
  description: string
  investigationStatus: InvestigationStatus
}

export interface Risk {
  id: string
  title: string
  description: string
  severity: RiskSeverity
  affectedConnectionIds: Connection['id'][]
  recommendedAction: string
}

