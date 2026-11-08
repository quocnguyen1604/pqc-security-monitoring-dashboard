import type {
  Connection,
  EventSeverity,
  RiskSeverity,
  Risk,
  SecurityEvent,
} from '../types/security'

export type OverallSecurityStatus = 'Green' | 'Amber' | 'Red'

export interface ConnectionRiskAssessment {
  connectionId: string
  severity: RiskSeverity
  score: number
  reasons: string[]
  hasUnresolvedUnexpectedFallback: boolean
  isConfirmedIncident: false
}

export interface OrganizationalRiskContext {
  affectedConnections: Connection[]
  classicalConnections: number
  highHndlConnections: number
}

export function getOrganizationalRiskContext(
  risk: Risk,
  connections: readonly Connection[],
): OrganizationalRiskContext {
  const affectedConnections = connections.filter((connection) =>
    risk.affectedConnectionIds.includes(connection.id),
  )

  return {
    affectedConnections,
    classicalConnections: affectedConnections.filter(
      (connection) => connection.keyExchangeAlgorithm !== 'ML-KEM-768',
    ).length,
    highHndlConnections: affectedConnections.filter(
      (connection) => connection.hndlExposure === 'High',
    ).length,
  }
}

export interface RiskAssessmentConfig {
  classicalExchangePoints: number
  moderateHndlPoints: number
  highHndlPoints: number
  highCriticalityPoints: number
  criticalCriticalityPoints: number
  unresolvedUnexpectedFallbackPoints: number
  resolvedUnexpectedFallbackPoints: number
  mediumSeverityScore: number
  highSeverityScore: number
  criticalSeverityScore: number
  redStatusEventSeverities: readonly EventSeverity[]
}

/**
 * Explainable initial scoring. Classical exchange contributes exposure points,
 * not an incident finding. Unexpected fallback contributes more when unresolved.
 */
export const defaultRiskAssessmentConfig: RiskAssessmentConfig = {
  classicalExchangePoints: 1,
  moderateHndlPoints: 1,
  highHndlPoints: 2,
  highCriticalityPoints: 1,
  criticalCriticalityPoints: 2,
  unresolvedUnexpectedFallbackPoints: 2,
  resolvedUnexpectedFallbackPoints: 1,
  mediumSeverityScore: 2,
  highSeverityScore: 4,
  criticalSeverityScore: 6,
  redStatusEventSeverities: ['High', 'Critical'],
}

function severityForScore(score: number, config: RiskAssessmentConfig): RiskSeverity {
  if (score >= config.criticalSeverityScore) return 'Critical'
  if (score >= config.highSeverityScore) return 'High'
  if (score >= config.mediumSeverityScore) return 'Medium'
  return 'Low'
}

function isUnresolved(event: SecurityEvent): boolean {
  return event.investigationStatus === 'Open' || event.investigationStatus === 'In review'
}

export function assessConnectionRisks(
  connections: readonly Connection[],
  events: readonly SecurityEvent[],
  config: RiskAssessmentConfig = defaultRiskAssessmentConfig,
): ConnectionRiskAssessment[] {
  return connections.map((connection) => {
    let score = 0
    const reasons: string[] = []

    if (connection.keyExchangeAlgorithm !== 'ML-KEM-768') {
      score += config.classicalExchangePoints
      reasons.push('Uses classical key exchange, creating potential future exposure.')
    }

    if (connection.hndlExposure === 'High') {
      score += config.highHndlPoints
      reasons.push('Classified as having high potential HNDL exposure.')
    } else if (connection.hndlExposure === 'Moderate') {
      score += config.moderateHndlPoints
      reasons.push('Classified as having moderate potential HNDL exposure.')
    }

    if (connection.criticality === 'Critical') {
      score += config.criticalCriticalityPoints
      reasons.push('Supports a critical business or operational function.')
    } else if (connection.criticality === 'High') {
      score += config.highCriticalityPoints
      reasons.push('Supports a high-criticality function.')
    }

    const unexpectedFallbackEvents = events.filter((event) =>
      event.connectionId === connection.id && event.type === 'unexpected_fallback',
    )
    const hasUnresolvedUnexpectedFallback = unexpectedFallbackEvents.some(isUnresolved)

    if (hasUnresolvedUnexpectedFallback) {
      score += config.unresolvedUnexpectedFallbackPoints
      reasons.push('Has an unresolved unexpected fallback indicator requiring review.')
    } else if (unexpectedFallbackEvents.length > 0) {
      score += config.resolvedUnexpectedFallbackPoints
      reasons.push('Has a resolved unexpected fallback indicator in its event history.')
    }

    return {
      connectionId: connection.id,
      severity: severityForScore(score, config),
      score,
      reasons,
      hasUnresolvedUnexpectedFallback,
      isConfirmedIncident: false,
    }
  })
}

export interface OverallStatusConfig {
  redSeverityThreshold: RiskSeverity
  amberSeverityThreshold: RiskSeverity
  redOnUnresolvedUnexpectedFallback: boolean
  redOnUnresolvedHighSeverityEvent: boolean
}

export const defaultOverallStatusConfig: OverallStatusConfig = {
  redSeverityThreshold: 'Critical',
  amberSeverityThreshold: 'High',
  redOnUnresolvedUnexpectedFallback: true,
  redOnUnresolvedHighSeverityEvent: true,
}

const severityRank: Record<RiskSeverity, number> = {
  Low: 0,
  Medium: 1,
  High: 2,
  Critical: 3,
}

/**
 * Status rules: Red for a critical assessment, high-risk classical exposure, or unresolved
 * high/critical unexpected fallback/security event; Amber for any high-risk
 * connection or remaining classical connection; Green only when none apply.
 * Coverage is deliberately not used to downgrade exposure-driven status.
 */
export function calculateOverallSecurityStatus(
  connections: readonly Connection[],
  events: readonly SecurityEvent[],
  config: OverallStatusConfig = defaultOverallStatusConfig,
): OverallSecurityStatus {
  const assessments = assessConnectionRisks(connections, events)
  const hasCriticalAssessment = assessments.some(
    (assessment) => severityRank[assessment.severity] >= severityRank[config.redSeverityThreshold],
  )
  const hasHighAssessment = assessments.some(
    (assessment) => severityRank[assessment.severity] >= severityRank[config.amberSeverityThreshold],
  )
  const hasHighRiskClassicalExposure = assessments.some((assessment) => {
    const connection = connections.find((item) => item.id === assessment.connectionId)
    return connection !== undefined &&
      connection.keyExchangeAlgorithm !== 'ML-KEM-768' &&
      severityRank[assessment.severity] >= severityRank.High
  })
  const hasUnresolvedUnexpectedFallback = events.some((event) =>
    event.type === 'unexpected_fallback' && isUnresolved(event),
  )
  const hasUnresolvedHighSeverityEvent = events.some((event) =>
    (event.severity === 'High' || event.severity === 'Critical') && isUnresolved(event),
  )

  if (
    hasCriticalAssessment ||
    hasHighRiskClassicalExposure ||
    (config.redOnUnresolvedUnexpectedFallback && hasUnresolvedUnexpectedFallback) ||
    (config.redOnUnresolvedHighSeverityEvent && hasUnresolvedHighSeverityEvent)
  ) {
    return 'Red'
  }

  if (hasHighAssessment || connections.some((connection) => connection.keyExchangeAlgorithm !== 'ML-KEM-768')) {
    return 'Amber'
  }

  return 'Green'
}

/** Plain-language drivers supporting the same status rules used above. */
export function getOverallStatusFactors(
  connections: readonly Connection[],
  events: readonly SecurityEvent[],
): string[] {
  const assessments = assessConnectionRisks(connections, events)
  const classicalById = new Map(
    connections
      .filter((connection) => connection.keyExchangeAlgorithm !== 'ML-KEM-768')
      .map((connection) => [connection.id, connection]),
  )
  const highRiskClassical = assessments.filter((assessment) =>
    classicalById.has(assessment.connectionId) &&
    severityRank[assessment.severity] >= severityRank.High,
  ).length
  const unresolvedUnexpected = events.filter((event) =>
    event.type === 'unexpected_fallback' && isUnresolved(event),
  ).length
  const unresolvedHighSeverity = events.filter((event) =>
    (event.severity === 'High' || event.severity === 'Critical') && isUnresolved(event),
  ).length
  const classicalCount = classicalById.size
  const factors: string[] = []

  if (highRiskClassical > 0) {
    factors.push(`${highRiskClassical} classical connection${highRiskClassical === 1 ? '' : 's'} classify as high or critical risk.`)
  }
  if (unresolvedUnexpected > 0) {
    factors.push(`${unresolvedUnexpected} unexpected fallback indicator${unresolvedUnexpected === 1 ? '' : 's'} remain unresolved.`)
  }
  if (unresolvedHighSeverity > 0) {
    factors.push(`${unresolvedHighSeverity} high or critical severity event${unresolvedHighSeverity === 1 ? '' : 's'} remain unresolved.`)
  }
  if (classicalCount > 0) {
    factors.push(`${classicalCount} connection${classicalCount === 1 ? '' : 's'} still use classical key exchange.`)
  }

  return factors
}

