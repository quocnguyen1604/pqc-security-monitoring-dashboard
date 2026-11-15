import { ChevronDown, RotateCcw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { EmptyState } from '../../components/ui/EmptyState'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { mockConnections } from '../../data/mockConnections'
import { mockEvents } from '../../data/mockEvents'
import { filterSecurityEvents, getEventContextDescription, noSecurityEventFilters } from '../../services/events'
import type { EventSeverity, EventType, SecurityEvent } from '../../types/security'

const connectionById = new Map(mockConnections.map((connection) => [connection.id, connection]))
const severityTone = { Info: 'info', Low: 'success', Medium: 'warning', High: 'danger', Critical: 'danger' } as const
const investigationTone = { 'Not required': 'neutral', Open: 'danger', 'In review': 'warning', Resolved: 'success' } as const
const severities: EventSeverity[] = ['Info', 'Low', 'Medium', 'High', 'Critical']
const eventTypes: EventType[] = ['expected_fallback', 'unexpected_fallback', 'handshake_failure', 'policy_change', 'migration_checkpoint']
const eventLabel: Record<EventType, string> = {
  expected_fallback: 'Expected fallback',
  unexpected_fallback: 'Unexpected fallback',
  handshake_failure: 'Handshake failure',
  policy_change: 'Policy change',
  migration_checkpoint: 'Migration checkpoint',
}
const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' })
const sortedEvents = [...mockEvents].sort((a, b) => b.timestamp.localeCompare(a.timestamp))

function formatTimestamp(timestamp: string): string {
  return `${dateFormatter.format(new Date(timestamp))} UTC`
}

function EventDetails({ event }: { event: SecurityEvent }) {
  const connection = connectionById.get(event.connectionId)

  return (
    <div className="border-t border-slate-800 px-4 pb-4 pt-4 sm:px-5">
      <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2 xl:grid-cols-4">
        <div><dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Event ID</dt><dd className="mt-1 text-sm text-slate-300">{event.id}</dd></div>
        <div><dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Timestamp</dt><dd className="mt-1 text-sm text-slate-300">{formatTimestamp(event.timestamp)}</dd></div>
        <div><dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Connection</dt><dd className="mt-1 text-sm text-slate-300">{event.connectionId}</dd></div>
        <div><dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Device and location</dt><dd className="mt-1 text-sm text-slate-300">{connection ? `${connection.deviceName} · ${connection.site}` : 'Connection record unavailable'}</dd></div>
        <div><dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Severity</dt><dd className="mt-1"><StatusBadge tone={severityTone[event.severity]}>{event.severity}</StatusBadge></dd></div>
        <div><dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Investigation</dt><dd className="mt-1"><StatusBadge tone={investigationTone[event.investigationStatus]}>{event.investigationStatus}</StatusBadge></dd></div>
        {connection && <>
          <div><dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Current key exchange</dt><dd className="mt-1 text-sm text-slate-300">{connection.keyExchangeAlgorithm}</dd></div>
          <div><dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Fallback policy</dt><dd className="mt-1 text-sm text-slate-300">{connection.classicalFallbackPermitted ? 'Permitted' : 'Not permitted'}</dd></div>
        </>}
      </dl>
      <div className="mt-5 grid gap-4 border-t border-slate-800 pt-4 md:grid-cols-2">
        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Event description</h4>
          <p className="mt-1 text-sm leading-6 text-slate-300">{event.description}</p>
        </div>
        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Context</h4>
          <p className="mt-1 text-sm leading-6 text-slate-400">{getEventContextDescription(event, connection)}</p>
        </div>
      </div>
    </div>
  )
}

export function EventsFeature() {
  const [severity, setSeverity] = useState<EventSeverity | 'All'>('All')
  const [type, setType] = useState<EventType | 'All'>('All')
  const filteredEvents = useMemo(
    () => filterSecurityEvents(sortedEvents, { severity, type }),
    [severity, type],
  )
  const hasActiveFilters = severity !== 'All' || type !== 'All'

  function clearFilters() {
    setSeverity(noSecurityEventFilters.severity)
    setType(noSecurityEventFilters.type)
  }

  return (
    <section id="events" aria-labelledby="events-title" className="scroll-mt-28 space-y-6">
      <SectionHeader eyebrow="Contextual activity" title="Security events" description="Filter event records and expand an entry to inspect its connection and policy context." />

      <div className="rounded-xl border border-slate-800 bg-slate-900/70">
        <div className="flex flex-col gap-4 border-b border-slate-800 p-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs font-medium text-slate-400">
              Severity
              <select value={severity} onChange={(event) => setSeverity(event.target.value as EventSeverity | 'All')} className="mt-1.5 block w-full min-w-40 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-700 focus:ring-2 focus:ring-cyan-900/50">
                <option value="All">All severities</option>
                {severities.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label className="block text-xs font-medium text-slate-400">
              Event type
              <select value={type} onChange={(event) => setType(event.target.value as EventType | 'All')} className="mt-1.5 block w-full min-w-52 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-700 focus:ring-2 focus:ring-cyan-900/50">
                <option value="All">All event types</option>
                {eventTypes.map((item) => <option key={item} value={item}>{eventLabel[item]}</option>)}
              </select>
            </label>
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs tabular-nums text-slate-500" aria-live="polite">Showing {filteredEvents.length} of {mockEvents.length} events</p>
            <button type="button" onClick={clearFilters} disabled={!hasActiveFilters} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40">
              <RotateCcw size={14} aria-hidden="true" /> Clear filters
            </button>
          </div>
        </div>

        {filteredEvents.length > 0 ? (
          <ol className="space-y-3 p-3 sm:p-4">
            {filteredEvents.map((event) => {
              const connection = connectionById.get(event.connectionId)
              const isUnexpectedFallback = event.type === 'unexpected_fallback'
              const isExpectedFallback = event.type === 'expected_fallback'
              const eventTone = isUnexpectedFallback ? 'warning' : isExpectedFallback ? 'info' : 'neutral'

              return (
                <li key={event.id}>
                  <details className={`group rounded-xl border bg-slate-950/30 ${isUnexpectedFallback ? 'border-amber-800/80' : 'border-slate-800'}`}>
                    <summary className="flex cursor-pointer list-none flex-col gap-3 p-4 marker:content-none sm:flex-row sm:items-center sm:justify-between [&::-webkit-details-marker]:hidden">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <time dateTime={event.timestamp} className="text-xs tabular-nums text-slate-500">{formatTimestamp(event.timestamp)}</time>
                          <StatusBadge tone={eventTone}>{eventLabel[event.type]}</StatusBadge>
                        </div>
                        <p className="mt-2 text-sm font-semibold text-slate-100">{connection?.deviceName ?? 'Unknown connection'}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{connection ? `${connection.site} · ${connection.id}` : event.connectionId}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                        <StatusBadge tone={severityTone[event.severity]}>{event.severity}</StatusBadge>
                        <StatusBadge tone={investigationTone[event.investigationStatus]}>{event.investigationStatus}</StatusBadge>
                        <span className="ml-1 inline-flex items-center gap-1 text-xs text-cyan-300">Inspect <ChevronDown size={15} className="transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" /></span>
                      </div>
                    </summary>
                    <EventDetails event={event} />
                  </details>
                </li>
              )
            })}
          </ol>
        ) : (
          <div className="p-4">
            <EmptyState title="No events match these filters" description="Change or clear the severity and event type filters to see more records." />
          </div>
        )}
      </div>
      <p className="text-xs leading-5 text-slate-500">These event records are fictional examples, not live monitoring. Unexpected fallback is a review indicator, not confirmation of an attack.</p>
    </section>
  )
}
