import { CalendarClock, CircleAlert } from 'lucide-react'
import { CUSTOMER_PQC_DEADLINE } from '../../config/customerDeadline'
import { mockConnections } from '../../data/mockConnections'
import { mockEvents } from '../../data/mockEvents'
import { calculateCustomerMigrationMetrics, assessCustomerDeadline, getCustomerDataConnections } from '../../services/customerMigration'
import { calculateMigrationStatusDistribution } from '../../services/metrics'
import { calculateOverallSecurityStatus } from '../../services/riskAssessment'
import { MetricCard } from '../../components/ui/MetricCard'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { StatusBadge } from '../../components/ui/StatusBadge'

const dateFormatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
const customerConnections = getCustomerDataConnections(mockConnections)
const customerMetrics = calculateCustomerMigrationMetrics(mockConnections)
const deadlineAssessment = assessCustomerDeadline(mockConnections)
const statusDistribution = calculateMigrationStatusDistribution(customerConnections)
const customerIds = new Set(customerConnections.map((connection) => connection.id))
const customerEvents = mockEvents.filter((event) => customerIds.has(event.connectionId))
const customerStatus = calculateOverallSecurityStatus(customerConnections, customerEvents)

export function CustomerMigrationFeature() {
const classicalCustomerConnections = deadlineAssessment.classicalConnections
  const deadlineConflictIds = new Set(deadlineAssessment.replacementTargetsAfterDeadline.map((connection) => connection.id))
  const noTargetIds = new Set(deadlineAssessment.missingReplacementTargets.map((connection) => connection.id))

  return (
    <section id="customer-migration" aria-labelledby="customer-migration-title" className="scroll-mt-28 space-y-5">
      <SectionHeader
        eyebrow="Customer agreement proposal"
        title="Customer PQC deadline readiness"
        description="Customer-data connections are reported separately from organizational totals. The date below is proposed and has not been treated as an approved commitment."
        action={<StatusBadge tone="warning">Proposed deadline</StatusBadge>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Proposed deadline" value={dateFormatter.format(new Date(`${CUSTOMER_PQC_DEADLINE}T00:00:00Z`))} helperText="Agreement modification is awaiting confirmation." icon={CalendarClock} />
        <MetricCard label="Customer PQC coverage" value={`${customerMetrics.pqcCoveragePercentage.toFixed(0)}%`} helperText={`${customerMetrics.mlKemConnections} of ${customerMetrics.totalConnections} customer-data connections`} icon={CalendarClock} />
        <MetricCard label="Customer classical connections" value={customerMetrics.classicalConnections} helperText="Customer-data paths still using classical key exchange." icon={CircleAlert} />
        <MetricCard label="Potential deadline conflicts" value={deadlineAssessment.replacementTargetsAfterDeadline.length} helperText="Classical connections with replacement targets after the proposed date." icon={CalendarClock} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-slate-100">Customer migration snapshot</h3>
              <p className="mt-1 text-sm text-slate-400">Only customer-data connections are included.</p>
            </div>
            <StatusBadge tone={customerStatus === 'Red' ? 'danger' : customerStatus === 'Amber' ? 'warning' : 'success'}>{customerStatus}</StatusBadge>
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3"><dt className="text-xs text-slate-500">Total connections</dt><dd className="mt-1 text-xl font-semibold text-slate-100">{customerMetrics.totalConnections}</dd></div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3"><dt className="text-xs text-slate-500">ML-KEM</dt><dd className="mt-1 text-xl font-semibold text-emerald-300">{customerMetrics.mlKemConnections}</dd></div>
            {(['Migrated', 'In progress', 'Blocked', 'Planned'] as const).map((migrationStatus) => (
              <div key={migrationStatus} className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
                <dt className="text-xs text-slate-500">{migrationStatus}</dt>
                <dd className="mt-1 text-xl font-semibold text-slate-100">{statusDistribution[migrationStatus]}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 border-t border-slate-800 pt-3 text-xs leading-5 text-slate-500">The status badge applies the existing risk rules to customer connections and their events. It is not a deadline-compliance assessment.</p>
        </article>

        <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
          <h3 className="font-semibold text-slate-100">Classical customer-data connections</h3>
          <p className="mt-1 text-sm text-slate-400">Replacement dates after {dateFormatter.format(new Date(`${CUSTOMER_PQC_DEADLINE}T00:00:00Z`))} need review against the proposal.</p>
          <ul className="mt-4 space-y-3">
            {classicalCustomerConnections.map((connection) => {
              const hasDeadlineConflict = deadlineConflictIds.has(connection.id)
              const hasNoTarget = noTargetIds.has(connection.id)
              return (
                <li key={connection.id} className={`rounded-lg border p-4 ${hasDeadlineConflict ? 'border-rose-900/80 bg-rose-950/20' : 'border-slate-800 bg-slate-950/40'}`}>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-100">{connection.deviceName}</p>
                      <p className="mt-1 text-xs text-slate-500">{connection.site} · {connection.id} · {connection.criticality} criticality</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge tone={connection.migrationStatus === 'Blocked' ? 'danger' : connection.migrationStatus === 'In progress' ? 'info' : 'warning'}>{connection.migrationStatus}</StatusBadge>
                      {hasDeadlineConflict && <StatusBadge tone="danger">Target after deadline</StatusBadge>}
                      {hasNoTarget && <StatusBadge tone="warning">Target needs clarification</StatusBadge>}
                    </div>
                  </div>
                  <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
                    <p><span className="text-slate-500">Blocker: </span><span className="text-slate-300">{connection.migrationBlockerReason ?? 'None recorded'}</span></p>
                    <p><span className="text-slate-500">Replacement target: </span><span className="text-slate-300">{connection.expectedReplacementDate ? dateFormatter.format(new Date(`${connection.expectedReplacementDate}T00:00:00Z`)) : 'Requires clarification'}</span></p>
                  </div>
                </li>
              )
            })}
          </ul>
          <p className="mt-4 text-xs leading-5 text-slate-500">Dates after the proposed deadline are potential conflicts for review, not a determination that the organization cannot meet the proposal.</p>
        </article>
      </div>
    </section>
  )
}
