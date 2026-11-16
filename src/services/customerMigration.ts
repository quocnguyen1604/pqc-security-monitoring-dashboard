import { CUSTOMER_PQC_DEADLINE } from '../config/customerDeadline'
import type { Connection } from '../types/security'

export interface CustomerMigrationMetrics {
  totalConnections: number
  mlKemConnections: number
  classicalConnections: number
  pqcCoveragePercentage: number
}

export interface CustomerDeadlineAssessment {
  deadline: string
  classicalConnections: Connection[]
  replacementTargetsAfterDeadline: Connection[]
  missingReplacementTargets: Connection[]
}

export function getCustomerDataConnections(connections: readonly Connection[]): Connection[] {
  return connections.filter((connection) => connection.carriesCustomerData)
}

export function calculateCustomerMigrationMetrics(
  connections: readonly Connection[],
): CustomerMigrationMetrics {
  const customerConnections = getCustomerDataConnections(connections)
  const mlKemConnections = customerConnections.filter(
    (connection) => connection.keyExchangeAlgorithm === 'ML-KEM-768',
  ).length

  return {
    totalConnections: customerConnections.length,
    mlKemConnections,
    classicalConnections: customerConnections.length - mlKemConnections,
    pqcCoveragePercentage: customerConnections.length === 0
      ? 0
      : (mlKemConnections / customerConnections.length) * 100,
  }
}

export function assessCustomerDeadline(
  connections: readonly Connection[],
  deadline: string = CUSTOMER_PQC_DEADLINE,
): CustomerDeadlineAssessment {
  const classicalConnections = getCustomerDataConnections(connections).filter(
    (connection) => connection.keyExchangeAlgorithm !== 'ML-KEM-768',
  )

  return {
    deadline,
    classicalConnections,
    replacementTargetsAfterDeadline: classicalConnections.filter(
      (connection) => connection.expectedReplacementDate !== undefined && connection.expectedReplacementDate > deadline,
    ),
    missingReplacementTargets: classicalConnections.filter(
      (connection) => connection.expectedReplacementDate === undefined,
    ),
  }
}
