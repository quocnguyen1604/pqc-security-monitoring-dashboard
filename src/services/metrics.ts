import type { Connection, MigrationStatus, Risk, RiskSeverity, SecurityEvent } from '../types/security'

export type MigrationStatusDistribution = Record<MigrationStatus, number>
export type RiskSeverityDistribution = Record<RiskSeverity, number>

export interface DashboardMetrics {
  totalConnections: number
  mlKemConnections: number
  classicalConnections: number
  pqcCoveragePercentage: number
  classicalConnectionPercentage: number
  legacyDevices: number
  highExposureConnections: number
  expectedFallbackEvents: number
  unexpectedFallbackEvents: number
  unresolvedHighSeverityEvents: number
}

const isMlKem = (connection: Connection): boolean =>
  connection.keyExchangeAlgorithm === 'ML-KEM-768'

const isHighSeverity = (event: SecurityEvent): boolean =>
  event.severity === 'High' || event.severity === 'Critical'

export function calculatePqcCoverage(connections: readonly Connection[]): number {
  if (connections.length === 0) return 0
  const mlKemCount = connections.filter(isMlKem).length
  return (mlKemCount / connections.length) * 100
}

export function calculateMetrics(
  connections: readonly Connection[],
  events: readonly SecurityEvent[],
): DashboardMetrics {
  const mlKemConnections = connections.filter(isMlKem).length

  return {
    totalConnections: connections.length,
    mlKemConnections,
    classicalConnections: connections.length - mlKemConnections,
    pqcCoveragePercentage: connections.length === 0 ? 0 : (mlKemConnections / connections.length) * 100,
    classicalConnectionPercentage: connections.length === 0 ? 0 : ((connections.length - mlKemConnections) / connections.length) * 100,
    legacyDevices: connections.filter((connection) => connection.isLegacy).length,
    highExposureConnections: connections.filter((connection) => connection.hndlExposure === 'High').length,
    expectedFallbackEvents: events.filter((event) => event.type === 'expected_fallback').length,
    unexpectedFallbackEvents: events.filter((event) => event.type === 'unexpected_fallback').length,
    unresolvedHighSeverityEvents: events.filter((event) =>
      isHighSeverity(event) &&
      (event.investigationStatus === 'Open' || event.investigationStatus === 'In review'),
    ).length,
  }
}

export function calculateMigrationStatusDistribution(
  connections: readonly Connection[],
): MigrationStatusDistribution {
  const distribution: MigrationStatusDistribution = { Migrated: 0, 'In progress': 0, Blocked: 0, Planned: 0 }
  for (const connection of connections) distribution[connection.migrationStatus] += 1
  return distribution
}

export function calculateRiskSeverityDistribution(risks: readonly Risk[]): RiskSeverityDistribution {
  const distribution: RiskSeverityDistribution = { Critical: 0, High: 0, Medium: 0, Low: 0 }
  for (const risk of risks) distribution[risk.severity] += 1
  return distribution
}
