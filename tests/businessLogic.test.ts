import { describe, expect, it } from 'vitest'
import { mockConnections } from '../src/data/mockConnections'
import { mockEvents } from '../src/data/mockEvents'
import { mockRisks } from '../src/data/mockRisks'
import type { Connection, SecurityEvent } from '../src/types/security'
import { calculateMetrics, calculateMigrationStatusDistribution, calculatePqcCoverage, calculateRiskSeverityDistribution } from '../src/services/metrics'
import { assessConnectionRisks, calculateOverallSecurityStatus, getOverallStatusFactors } from '../src/services/riskAssessment'

const makeConnection = (overrides: Partial<Connection> = {}): Connection => ({
  id: 'TEST-001',
  deviceName: 'Test Device',
  site: 'Test Site',
  category: 'Field gateway',
  keyExchangeAlgorithm: 'ML-KEM-768',
  isLegacy: false,
  classicalFallbackPermitted: false,
  criticality: 'Low',
  hndlExposure: 'Low',
  migrationStatus: 'Migrated',
  lastSeenAt: '2026-11-08T10:00:00Z',
  ...overrides,
})

const makeEvent = (overrides: Partial<SecurityEvent> = {}): SecurityEvent => ({
  id: 'TEST-EVENT-001',
  connectionId: 'TEST-001',
  timestamp: '2026-11-08T10:00:00Z',
  type: 'unexpected_fallback',
  severity: 'High',
  description: 'Unexpected fallback indicator needs review.',
  investigationStatus: 'Open',
  ...overrides,
})

describe('PQC coverage and connection metrics', () => {
  it('returns zero coverage for an empty connection set', () => {
    expect(calculatePqcCoverage([])).toBe(0)
    expect(calculateMetrics([], []).pqcCoveragePercentage).toBe(0)
  })

  it('returns 100 percent for full ML-KEM adoption', () => {
    const connections = [makeConnection(), makeConnection({ id: 'TEST-002' })]
    expect(calculatePqcCoverage(connections)).toBe(100)
  })

  it('returns zero percent for no ML-KEM connections', () => {
    const connections = [
      makeConnection({ keyExchangeAlgorithm: 'ECDH P-256', migrationStatus: 'Planned' }),
      makeConnection({ id: 'TEST-002', keyExchangeAlgorithm: 'X25519', migrationStatus: 'Blocked' }),
    ]
    expect(calculatePqcCoverage(connections)).toBe(0)
  })

  it('calculates counts and leaves classical exposure visible', () => {
    const metrics = calculateMetrics(mockConnections, mockEvents)
    expect(metrics.totalConnections).toBe(20)
    expect(metrics.mlKemConnections).toBe(10)
    expect(metrics.classicalConnections).toBe(10)
    expect(metrics.pqcCoveragePercentage).toBe(50)
    expect(metrics.classicalConnectionPercentage).toBe(50)
    expect(metrics.legacyDevices).toBe(10)
    expect(metrics.highExposureConnections).toBe(5)
  })
})

describe('event metrics', () => {
  it('counts expected and unexpected fallback events separately', () => {
    const metrics = calculateMetrics(mockConnections, mockEvents)
    expect(metrics.expectedFallbackEvents).toBe(5)
    expect(metrics.unexpectedFallbackEvents).toBe(2)
  })

  it('counts only unresolved high or critical severity events', () => {
    const events = [
      makeEvent({ id: 'OPEN', severity: 'High', investigationStatus: 'Open' }),
      makeEvent({ id: 'REVIEW', severity: 'Critical', investigationStatus: 'In review' }),
      makeEvent({ id: 'RESOLVED', severity: 'High', investigationStatus: 'Resolved' }),
      makeEvent({ id: 'LOW', severity: 'Low', investigationStatus: 'Open' }),
    ]
    expect(calculateMetrics([], events).unresolvedHighSeverityEvents).toBe(2)
  })

  it('returns zero event counts for an empty event set', () => {
    const metrics = calculateMetrics([makeConnection()], [])
    expect(metrics.expectedFallbackEvents).toBe(0)
    expect(metrics.unexpectedFallbackEvents).toBe(0)
    expect(metrics.unresolvedHighSeverityEvents).toBe(0)
  })

  it('calculates migration and risk chart distributions from their datasets', () => {
    expect(calculateMigrationStatusDistribution(mockConnections)).toEqual({
      Migrated: 10,
      'In progress': 2,
      Blocked: 3,
      Planned: 5,
    })
    expect(calculateRiskSeverityDistribution(mockRisks)).toEqual({
      Critical: 1,
      High: 1,
      Medium: 1,
      Low: 0,
    })
  })
})

describe('connection risk classification', () => {
  it('does not classify a low exposure classical connection as an incident', () => {
    const [assessment] = assessConnectionRisks([
      makeConnection({ keyExchangeAlgorithm: 'ECDH P-256', migrationStatus: 'Planned' }),
    ], [])
    expect(assessment.severity).toBe('Low')
    expect(assessment.isConfirmedIncident).toBe(false)
  })

  it('raises classification for high HNDL exposure and criticality', () => {
    const [assessment] = assessConnectionRisks([
      makeConnection({ keyExchangeAlgorithm: 'X25519', hndlExposure: 'High', criticality: 'Critical' }),
    ], [])
    expect(assessment.severity).toBe('High')
    expect(assessment.reasons).toEqual(expect.arrayContaining([
      expect.stringContaining('classical key exchange'),
      expect.stringContaining('high potential HNDL'),
      expect.stringContaining('critical business'),
    ]))
  })

  it('raises risk for unresolved unexpected fallback and lowers it after resolution', () => {
    const connection = makeConnection({ keyExchangeAlgorithm: 'ECDH P-256', hndlExposure: 'High', criticality: 'High' })
    const unresolved = assessConnectionRisks([connection], [makeEvent()])[0]
    const resolved = assessConnectionRisks([connection], [makeEvent({ investigationStatus: 'Resolved' })])[0]

    expect(unresolved.severity).toBe('Critical')
    expect(unresolved.hasUnresolvedUnexpectedFallback).toBe(true)
    expect(resolved.severity).toBe('High')
    expect(resolved.hasUnresolvedUnexpectedFallback).toBe(false)
    expect(unresolved.isConfirmedIncident).toBe(false)
  })

  it('returns an empty list for an empty connection set', () => {
    expect(assessConnectionRisks([], mockEvents)).toEqual([])
  })
})

describe('overall security status', () => {
  it('returns green for an empty inventory', () => {
    expect(calculateOverallSecurityStatus([], [])).toBe('Green')
  })

  it('returns green for fully migrated connections without unresolved events', () => {
    expect(calculateOverallSecurityStatus([makeConnection()], [])).toBe('Green')
  })

  it('returns amber for classical exposure even with no event indicator', () => {
    expect(calculateOverallSecurityStatus([
      makeConnection({ keyExchangeAlgorithm: 'ECDH P-256', migrationStatus: 'Planned' }),
    ], [])).toBe('Amber')
  })

  it('returns red for unresolved high severity unexpected fallback regardless of coverage', () => {
    expect(calculateOverallSecurityStatus([makeConnection()], [makeEvent()])).toBe('Red')
  })

  it('returns red for a critical unresolved classical exposure despite high coverage', () => {
    const mostlyMigrated = [
      ...Array.from({ length: 19 }, (_, index) => makeConnection({ id: `MIGRATED-${index}` })),
      makeConnection({
        id: 'EXPOSED',
        keyExchangeAlgorithm: 'ECDH P-256',
        hndlExposure: 'High',
        criticality: 'Critical',
      }),
    ]
    expect(calculatePqcCoverage(mostlyMigrated)).toBe(95)
    expect(calculateOverallSecurityStatus(mostlyMigrated, [])).toBe('Red')
  })

  it('provides plain language factors from the existing status rules', () => {
    const factors = getOverallStatusFactors(mockConnections, mockEvents)
    expect(factors.some((factor) => factor.includes('classify as high or critical risk'))).toBe(true)
    expect(factors.some((factor) => factor.includes('unexpected fallback indicator'))).toBe(true)
  })
})

