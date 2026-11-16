import { describe, expect, it } from 'vitest'
import { CUSTOMER_PQC_DEADLINE } from '../src/config/customerDeadline'
import { mockConnections } from '../src/data/mockConnections'
import type { Connection } from '../src/types/security'
import { assessCustomerDeadline, calculateCustomerMigrationMetrics } from '../src/services/customerMigration'

const makeConnection = (overrides: Partial<Connection> = {}): Connection => ({
  id: 'TEST-CUSTOMER-1',
  deviceName: 'Customer test gateway',
  site: 'Test site',
  carriesCustomerData: true,
  category: 'Field gateway',
  keyExchangeAlgorithm: 'ML-KEM-768',
  isLegacy: false,
  classicalFallbackPermitted: false,
  criticality: 'Medium',
  hndlExposure: 'Low',
  migrationStatus: 'Migrated',
  lastSeenAt: '2026-11-08T10:00:00Z',
  ...overrides,
})

describe('customer migration calculations', () => {
  it('uses only customer-data connections in the customer denominator', () => {
    expect(calculateCustomerMigrationMetrics(mockConnections)).toEqual({
      totalConnections: 14,
      mlKemConnections: 8,
      classicalConnections: 6,
      pqcCoveragePercentage: (8 / 14) * 100,
    })
  })

  it('returns zero coverage when there are no customer-data connections', () => {
    expect(calculateCustomerMigrationMetrics([makeConnection({ carriesCustomerData: false })])).toEqual({
      totalConnections: 0,
      mlKemConnections: 0,
      classicalConnections: 0,
      pqcCoveragePercentage: 0,
    })
  })

  it('handles all-ML-KEM and all-classical customer inventories', () => {
    const allMlKem = [makeConnection(), makeConnection({ id: 'TEST-2' })]
    const allClassical = allMlKem.map((connection) => ({ ...connection, keyExchangeAlgorithm: 'ECDH P-256' as const }))
    expect(calculateCustomerMigrationMetrics(allMlKem).pqcCoveragePercentage).toBe(100)
    expect(calculateCustomerMigrationMetrics(allClassical)).toMatchObject({
      totalConnections: 2,
      mlKemConnections: 0,
      classicalConnections: 2,
      pqcCoveragePercentage: 0,
    })
  })

  it('compares replacement targets with the proposed deadline without claiming compliance', () => {
    expect(CUSTOMER_PQC_DEADLINE).toBe('2027-12-31')
    const assessment = assessCustomerDeadline(mockConnections)
    expect(assessment.replacementTargetsAfterDeadline.map((connection) => connection.id)).toEqual(['CON-004', 'CON-019'])
    expect(assessment.missingReplacementTargets.map((connection) => connection.id)).toEqual(['CON-002'])
    expect(assessment.classicalConnections).toHaveLength(6)
  })

  it('identifies classical customer connections that need a replacement target clarified', () => {
    const assessment = assessCustomerDeadline([
      makeConnection({ keyExchangeAlgorithm: 'X25519', expectedReplacementDate: undefined }),
      makeConnection({ id: 'NON-CUSTOMER', carriesCustomerData: false, keyExchangeAlgorithm: 'ECDH P-256' }),
    ])
    expect(assessment.missingReplacementTargets.map((connection) => connection.id)).toEqual(['TEST-CUSTOMER-1'])
  })
})
