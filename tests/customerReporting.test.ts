import { describe, expect, it } from 'vitest'
import { CUSTOMER_REPORTING_CONFIG } from '../src/config/customerReporting'
import { mockConnections } from '../src/data/mockConnections'
import { mockCustomerDataFlows } from '../src/data/mockCustomerDataFlows'
import type { Connection } from '../src/types/security'
import type { CustomerDataFlow } from '../src/types/customerReporting'
import { calculateCustomerExposureByClass, validateCustomerDataFlows } from '../src/services/customerReporting'

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

const makeFlow = (overrides: Partial<CustomerDataFlow> = {}): CustomerDataFlow => ({
  id: 'FLOW-TEST-1',
  connectionId: 'TEST-CUSTOMER-1',
  dataClass: 'Internal',
  estimatedVolume: 12,
  measurementUnit: CUSTOMER_REPORTING_CONFIG.measurementUnit,
  reportingPeriod: CUSTOMER_REPORTING_CONFIG.reportingPeriod,
  ...overrides,
})

describe('customer HNDL volume calculations', () => {
  it('aggregates totals and classical-associated volumes for each data class', () => {
    const summaries = calculateCustomerExposureByClass(mockConnections, mockCustomerDataFlows)
    expect(summaries).toEqual([
      expect.objectContaining({ dataClass: 'Internal', totalEstimatedVolume: 760, mlKemAssociatedVolume: 700, potentiallyExposedVolume: 60, affectedConnectionIds: ['CON-014'] }),
      expect.objectContaining({ dataClass: 'Confidential', totalEstimatedVolume: 610, mlKemAssociatedVolume: 400, potentiallyExposedVolume: 210, affectedConnectionIds: ['CON-002', 'CON-019'] }),
      expect.objectContaining({ dataClass: 'Restricted', totalEstimatedVolume: 960, mlKemAssociatedVolume: 590, potentiallyExposedVolume: 370, affectedConnectionIds: ['CON-001', 'CON-004', 'CON-007'] }),
    ])
    expect(summaries[1].potentiallyExposedPercentage).toBeCloseTo((210 / 610) * 100)
  })

  it('reports zero exposure percentage for a class with only ML-KEM flows', () => {
    const summary = calculateCustomerExposureByClass([makeConnection()], [makeFlow()])[0]
    expect(summary.totalEstimatedVolume).toBe(12)
    expect(summary.potentiallyExposedVolume).toBe(0)
    expect(summary.potentiallyExposedPercentage).toBe(0)
    expect(summary.affectedConnectionIds).toEqual([])
  })

  it('returns zero totals for empty customer datasets', () => {
    const summaries = calculateCustomerExposureByClass([], [])
    expect(summaries).toHaveLength(CUSTOMER_REPORTING_CONFIG.dataClasses.length)
    expect(summaries.every((summary) => summary.totalEstimatedVolume === 0 && summary.potentiallyExposedPercentage === 0)).toBe(true)
  })

  it('validates all provided flow records and flags unknown connection references', () => {
    expect(validateCustomerDataFlows(mockCustomerDataFlows, mockConnections)).toEqual([])
    const issues = validateCustomerDataFlows([makeFlow({ connectionId: 'MISSING-CONNECTION' })], mockConnections)
    expect(issues.some((issue) => issue.code === 'unknown-connection')).toBe(true)
  })

  it('flags flows linked to non-customer connections and inconsistent reporting assumptions', () => {
    const nonCustomer = makeConnection({ id: 'NON-CUSTOMER', carriesCustomerData: false })
    const issues = validateCustomerDataFlows([
      makeFlow({ connectionId: nonCustomer.id, reportingPeriod: '2025-01' }),
    ], [nonCustomer])
    expect(issues.map((issue) => issue.code)).toEqual(expect.arrayContaining([
      'connection-not-marked-as-customer-data',
      'period-mismatch',
    ]))
  })
})
