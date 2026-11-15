import type { Connection, EventSeverity, EventType, SecurityEvent } from '../types/security'

export interface SecurityEventFilters {
  severity: EventSeverity | 'All'
  type: EventType | 'All'
}

export const noSecurityEventFilters: SecurityEventFilters = {
  severity: 'All',
  type: 'All',
}

export function filterSecurityEvents(
  events: readonly SecurityEvent[],
  filters: SecurityEventFilters,
): SecurityEvent[] {
  return events.filter((event) =>
    (filters.severity === 'All' || event.severity === filters.severity) &&
    (filters.type === 'All' || event.type === filters.type),
  )
}

export function getEventContextDescription(
  event: SecurityEvent,
  connection: Connection | undefined,
): string {
  if (!connection) {
    return `No matching connection record was found for ${event.connectionId}.`
  }

  const fallbackPermission = connection.classicalFallbackPermitted ? 'permitted' : 'not permitted'

  switch (event.type) {
    case 'expected_fallback':
      return `The event is marked expected; the connection inventory says classical fallback is ${fallbackPermission}. Classical key exchange still represents potential future exposure.`
    case 'unexpected_fallback':
      return `The event is marked unexpected; the connection inventory says classical fallback is ${fallbackPermission}. Review policy and migration context. This indicator does not prove an attack.`
    case 'handshake_failure':
      return 'A handshake failure is recorded. By itself, this does not indicate a successful downgrade or attack.'
    case 'policy_change':
      return `This record concerns a policy change for a connection currently configured with ${connection.keyExchangeAlgorithm}.`
    case 'migration_checkpoint':
      return `This checkpoint is associated with the connection currently configured to use ${connection.keyExchangeAlgorithm}.`
  }
}
