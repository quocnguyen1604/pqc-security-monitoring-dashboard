import { describe, expect, it } from 'vitest'
import { mockConnections } from '../src/data/mockConnections'
import { mockEvents } from '../src/data/mockEvents'
import { filterSecurityEvents, getEventContextDescription, noSecurityEventFilters } from '../src/services/events'

const connectionsById = new Map(mockConnections.map((connection) => [connection.id, connection]))

describe('security event filtering', () => {
  it('returns all events when filters are cleared', () => {
    expect(filterSecurityEvents(mockEvents, noSecurityEventFilters)).toEqual(mockEvents)
  })

  it('filters by severity', () => {
    const highEvents = filterSecurityEvents(mockEvents, { severity: 'High', type: 'All' })
    expect(highEvents.length).toBeGreaterThan(0)
    expect(highEvents.every((event) => event.severity === 'High')).toBe(true)
  })

  it('filters by event type', () => {
    const unexpectedFallbacks = filterSecurityEvents(mockEvents, { severity: 'All', type: 'unexpected_fallback' })
    expect(unexpectedFallbacks).toHaveLength(2)
    expect(unexpectedFallbacks.every((event) => event.type === 'unexpected_fallback')).toBe(true)
  })

  it('combines severity and type filters', () => {
    const results = filterSecurityEvents(mockEvents, { severity: 'High', type: 'unexpected_fallback' })
    expect(results).toHaveLength(1)
    expect(results[0].id).toBe('EVT-002')
  })

  it('returns no results when no events match', () => {
    expect(filterSecurityEvents(mockEvents, { severity: 'Critical', type: 'unexpected_fallback' })).toEqual([])
  })
})

describe('security event context', () => {
  it('explains unexpected fallback using the associated connection policy', () => {
    const event = mockEvents.find((item) => item.type === 'unexpected_fallback')!
    const connection = connectionsById.get(event.connectionId)
    const context = getEventContextDescription(event, connection)
    expect(context).toContain('marked unexpected')
    expect(context).toContain('not permitted')
    expect(context).toContain('does not prove an attack')
  })

  it('reports when an event has no matching connection record', () => {
    const event = mockEvents[0]
    expect(getEventContextDescription(event, undefined)).toContain(event.connectionId)
  })

  it('keeps every fixture event linked to a known connection', () => {
    expect(mockEvents.every((event) => connectionsById.has(event.connectionId))).toBe(true)
  })
})
