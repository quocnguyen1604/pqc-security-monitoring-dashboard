import { mockConnections } from '../../data/mockConnections'
import { mockEvents } from '../../data/mockEvents'
import type { SecurityEvent } from '../../types/security'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { StatusBadge } from '../../components/ui/StatusBadge'

const connectionById = new Map(mockConnections.map((connection) => [connection.id, connection]))
const severityTone = { Info: 'info', Low: 'success', Medium: 'warning', High: 'danger', Critical: 'danger' } as const
const investigationTone = { 'Not required': 'neutral', Open: 'danger', 'In review': 'warning', Resolved: 'success' } as const
const eventLabel: Record<SecurityEvent['type'], string> = {
  expected_fallback: 'Expected fallback',
  unexpected_fallback: 'Unexpected fallback indicator',
  handshake_failure: 'Handshake failure',
  policy_change: 'Policy change',
  migration_checkpoint: 'Migration checkpoint',
}

const sortedEvents = [...mockEvents].sort((a, b) => b.timestamp.localeCompare(a.timestamp))

export function EventsFeature() {
  return (
    <section id="events" aria-labelledby="events-title" className="scroll-mt-28 space-y-6">
      <SectionHeader eyebrow="Contextual activity" title="Security events" description="Review simulated event records with connection context. Unexpected fallback is flagged for investigation, not treated as proof of a successful attack." />
      <ol className="space-y-3">
        {sortedEvents.map((event) => {
          const connection = connectionById.get(event.connectionId)
          const isUnexpectedFallback = event.type === 'unexpected_fallback'
          const isExpectedFallback = event.type === 'expected_fallback'

          return (
            <li key={event.id} className={`rounded-xl border bg-slate-900/70 p-4 sm:p-5 ${isUnexpectedFallback ? 'border-amber-800/80' : 'border-slate-800'}`}>
              <article>
                <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <time dateTime={event.timestamp} className="text-xs tabular-nums text-slate-500">
                        {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }).format(new Date(event.timestamp))} UTC
                      </time>
                      <StatusBadge tone={isUnexpectedFallback ? 'warning' : isExpectedFallback ? 'info' : 'neutral'}>{eventLabel[event.type]}</StatusBadge>
                    </div>
                    <h3 className="mt-2 text-sm font-semibold text-slate-100">{connection?.deviceName ?? 'Unknown connection'}</h3>
                    <p className="mt-0.5 text-xs text-slate-500">{connection ? `${connection.site} · ${connection.id}` : event.connectionId}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{event.description}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 xl:justify-end">
                    <StatusBadge tone={severityTone[event.severity]}>{event.severity} severity</StatusBadge>
                    <StatusBadge tone={investigationTone[event.investigationStatus]}>{event.investigationStatus}</StatusBadge>
                  </div>
                </div>
                {isUnexpectedFallback && (
                  <p className="mt-4 border-t border-amber-900/60 pt-3 text-xs leading-5 text-amber-200/80">
                    Potential downgrade indicator. Review connection policy and context; this event does not establish an attack.
                  </p>
                )}
                {isExpectedFallback && (
                  <p className="mt-4 border-t border-slate-800 pt-3 text-xs leading-5 text-slate-500">
                    Recorded as expected under the documented fallback allowance. Classical key exchange still contributes to exposure.
                  </p>
                )}
              </article>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
