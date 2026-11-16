import { CUSTOMER_REPORTING_CONFIG } from '../config/customerReporting'
import type { Connection } from '../types/security'
import type { CustomerDataClass, CustomerDataFlow } from '../types/customerReporting'

export interface CustomerDataClassExposure {
  dataClass: CustomerDataClass
  totalEstimatedVolume: number
  mlKemAssociatedVolume: number
  potentiallyExposedVolume: number
  potentiallyExposedPercentage: number
  affectedConnectionIds: string[]
}

export type CustomerDataFlowIssueCode =
  | 'unknown-connection'
  | 'connection-not-marked-as-customer-data'
  | 'unconfigured-data-class'
  | 'invalid-volume'
  | 'unit-mismatch'
  | 'period-mismatch'

export interface CustomerDataFlowIssue {
  flowId: string
  code: CustomerDataFlowIssueCode
  message: string
}

export function validateCustomerDataFlows(
  flows: readonly CustomerDataFlow[],
  connections: readonly Connection[],
): CustomerDataFlowIssue[] {
  const connectionById = new Map(connections.map((connection) => [connection.id, connection]))
  const configuredClasses = new Set(CUSTOMER_REPORTING_CONFIG.dataClasses.map(({ name }) => name))
  const issues: CustomerDataFlowIssue[] = []

  for (const flow of flows) {
    const connection = connectionById.get(flow.connectionId)
    if (!connection) {
      issues.push({ flowId: flow.id, code: 'unknown-connection', message: `No connection exists for ${flow.connectionId}.` })
    } else if (!connection.carriesCustomerData) {
      issues.push({ flowId: flow.id, code: 'connection-not-marked-as-customer-data', message: `${flow.connectionId} is not marked as carrying customer data.` })
    }
    if (!configuredClasses.has(flow.dataClass)) {
      issues.push({ flowId: flow.id, code: 'unconfigured-data-class', message: `${flow.dataClass} is not in the configured customer data classes.` })
    }
    if (!Number.isFinite(flow.estimatedVolume) || flow.estimatedVolume < 0) {
      issues.push({ flowId: flow.id, code: 'invalid-volume', message: 'Estimated volume must be a non-negative finite number.' })
    }
    if (flow.measurementUnit !== CUSTOMER_REPORTING_CONFIG.measurementUnit) {
      issues.push({ flowId: flow.id, code: 'unit-mismatch', message: `Expected ${CUSTOMER_REPORTING_CONFIG.measurementUnit} as the volume unit.` })
    }
    if (flow.reportingPeriod !== CUSTOMER_REPORTING_CONFIG.reportingPeriod) {
      issues.push({ flowId: flow.id, code: 'period-mismatch', message: `Expected reporting period ${CUSTOMER_REPORTING_CONFIG.reportingPeriod}.` })
    }
  }

  return issues
}

export function calculateCustomerExposureByClass(
  connections: readonly Connection[],
  flows: readonly CustomerDataFlow[],
): CustomerDataClassExposure[] {
  const connectionById = new Map(connections.map((connection) => [connection.id, connection]))
  const configuredClasses = CUSTOMER_REPORTING_CONFIG.dataClasses.map(({ name }) => name)
  const summaries = new Map<CustomerDataClass, CustomerDataClassExposure>(
    configuredClasses.map((dataClass) => [dataClass, {
      dataClass,
      totalEstimatedVolume: 0,
      mlKemAssociatedVolume: 0,
      potentiallyExposedVolume: 0,
      potentiallyExposedPercentage: 0,
      affectedConnectionIds: [],
    }]),
  )

  for (const flow of flows) {
    const connection = connectionById.get(flow.connectionId)
    const summary = summaries.get(flow.dataClass)
    const validRecord = connection?.carriesCustomerData &&
      summary !== undefined &&
      Number.isFinite(flow.estimatedVolume) &&
      flow.estimatedVolume >= 0 &&
      flow.measurementUnit === CUSTOMER_REPORTING_CONFIG.measurementUnit &&
      flow.reportingPeriod === CUSTOMER_REPORTING_CONFIG.reportingPeriod

    if (!validRecord || !connection || !summary) continue

    summary.totalEstimatedVolume += flow.estimatedVolume
    if (connection.keyExchangeAlgorithm !== 'ML-KEM-768') {
      summary.potentiallyExposedVolume += flow.estimatedVolume
      if (!summary.affectedConnectionIds.includes(connection.id)) {
        summary.affectedConnectionIds.push(connection.id)
      }
    } else {
      summary.mlKemAssociatedVolume += flow.estimatedVolume
    }
  }

  return configuredClasses.map((dataClass) => {
    const summary = summaries.get(dataClass)!
    return {
      ...summary,
      potentiallyExposedPercentage: summary.totalEstimatedVolume === 0
        ? 0
        : (summary.potentiallyExposedVolume / summary.totalEstimatedVolume) * 100,
    }
  })
}
