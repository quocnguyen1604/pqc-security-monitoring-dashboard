import { FileText } from 'lucide-react'
import { CustomerExposureBreakdown } from '../../components/customer/CustomerExposureBreakdown'
import { RiskIndicator } from '../../components/ui/RiskIndicator'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { CUSTOMER_PQC_DEADLINE } from '../../config/customerDeadline'
import { CUSTOMER_REPORTING_CONFIG } from '../../config/customerReporting'
import { mockConnections } from '../../data/mockConnections'
import { mockCustomerDataFlows } from '../../data/mockCustomerDataFlows'
import { mockEvents } from '../../data/mockEvents'
import { mockRisks } from '../../data/mockRisks'
import { assessCustomerDeadline, calculateCustomerMigrationMetrics, getCustomerDataConnections } from '../../services/customerMigration'
import { calculateOverallSecurityStatus, getOrganizationalRiskContext } from '../../services/riskAssessment'

const customerConnections = getCustomerDataConnections(mockConnections)
const customerConnectionIds = new Set(customerConnections.map((connection) => connection.id))
const customerEvents = mockEvents.filter((event) => customerConnectionIds.has(event.connectionId))
const customerStatus = calculateOverallSecurityStatus(customerConnections, customerEvents)
const customerMetrics = calculateCustomerMigrationMetrics(mockConnections)
const deadlineAssessment = assessCustomerDeadline(mockConnections)
const dateFormatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
const proposedDeadlineLabel = dateFormatter.format(new Date(`${CUSTOMER_PQC_DEADLINE}T00:00:00Z`))
const customerClassicalConnections = deadlineAssessment.classicalConnections
const customerBlockedConnections = customerConnections.filter((connection) => connection.migrationStatus === 'Blocked')
const customerRiskContexts = mockRisks.map((risk) => ({
  risk,
  connections: getOrganizationalRiskContext(risk, mockConnections).affectedConnections.filter((connection) => customerConnectionIds.has(connection.id)),
})).filter(({ connections }) => connections.length > 0)
const deadlineConflictIds = new Set(deadlineAssessment.replacementTargetsAfterDeadline.map((connection) => connection.id))

const statusTone = { Green: 'success', Amber: 'warning', Red: 'danger' } as const

function getMainOutstandingIssue(): string {
  const items: string[] = []
  if (customerMetrics.classicalConnections > 0) {
    items.push(`${customerMetrics.classicalConnections} customer-data connection(s) still use classical key exchange`)
  }
  if (deadlineAssessment.replacementTargetsAfterDeadline.length > 0) {
    items.push(`${deadlineAssessment.replacementTargetsAfterDeadline.length} replacement target(s) fall after the proposed date`)
  }
  if (deadlineAssessment.missingReplacementTargets.length > 0) {
    items.push(`${deadlineAssessment.missingReplacementTargets.length} connection(s) need target-date clarification`)
  }
  return items.length > 0 ? `${items.join('; ')}.` : 'No classical customer-data connections are recorded in the current dataset.'
}

const recommendations = [
  'Prioritize customer-data connections still using classical key exchange.',
  'Review blockers and replacement targets that fall after the proposed deadline.',
  'Evaluate the data classes with the largest classical-associated estimated volumes.',
  'Confirm the deadline, classification labels, volume unit, and reporting period with the Product Owner and customer.',
]

export function CustomerReportFeature() {
  return (
    <section id="customer-report" aria-labelledby="customer-report-title" className="scroll-mt-28 space-y-6">
      <SectionHeader
        eyebrow="Customer review preparation"
        title="Customer PQC status report preview"
        description="Initial report structure assembled from the current synthetic data for review and refinement."
        action={<StatusBadge tone="info"><FileText size={13} aria-hidden="true" /> Preview</StatusBadge>}
      />

      <article className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/70">
        <div className="flex flex-col gap-4 border-b border-slate-800 bg-slate-950/30 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">PQC migration and exposure update</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-100">Customer-facing draft</h2>
          </div>
          <StatusBadge tone="warning">Proposed deadline · {proposedDeadlineLabel}</StatusBadge>
        </div>

        <div className="space-y-8 p-5 sm:p-6">
          <section aria-labelledby="report-summary-title">
            <h3 id="report-summary-title" className="text-base font-semibold text-slate-100">1. Executive summary</h3>
            <div className="mt-3 grid gap-4 lg:grid-cols-[auto_1fr] lg:items-start">
              <StatusBadge tone={statusTone[customerStatus]}>{customerStatus} customer-data posture</StatusBadge>
              <div>
                <p className="text-sm leading-6 text-slate-300">The current inventory records {customerMetrics.totalConnections} customer-data connections, with {customerMetrics.classicalConnections} still using classical key exchange. The proposed deadline is not treated as an approved contractual commitment.</p>
                <p className="mt-2 text-sm leading-6 text-rose-200">Main outstanding issue: {getMainOutstandingIssue()}</p>
              </div>
            </div>
          </section>

          <section aria-labelledby="report-migration-title" className="border-t border-slate-800 pt-6">
            <h3 id="report-migration-title" className="text-base font-semibold text-slate-100">2. PQC migration status</h3>
            <p className="mt-1 text-xs text-slate-500">Customer-data connections only · proposed deadline {proposedDeadlineLabel}</p>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ['Total customer-data connections', customerMetrics.totalConnections],
                ['ML-KEM connections', customerMetrics.mlKemConnections],
                ['Classical connections', customerMetrics.classicalConnections],
                ['Customer PQC coverage', `${customerMetrics.pqcCoveragePercentage.toFixed(1)}%`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
                  <dt className="text-xs text-slate-500">{label}</dt>
                  <dd className="mt-1 text-xl font-semibold tabular-nums text-slate-100">{value}</dd>
                </div>
              ))}
            </dl>
            <ul className="mt-4 grid gap-3 lg:grid-cols-2">
              {customerClassicalConnections.map((connection) => {
                const isConflict = deadlineConflictIds.has(connection.id)
                return (
                  <li key={connection.id} className="rounded-lg border border-slate-800 bg-slate-950/30 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-medium text-slate-200">{connection.deviceName}</span>
                      <div className="flex gap-2">
                        <StatusBadge tone={connection.migrationStatus === 'Blocked' ? 'danger' : 'warning'}>{connection.migrationStatus}</StatusBadge>
                        {isConflict && <StatusBadge tone="danger">After deadline</StatusBadge>}
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{connection.site} · {connection.id} · blocker: {connection.migrationBlockerReason ?? 'none recorded'}</p>
                    <p className="mt-1 text-xs text-slate-400">Replacement target: {connection.expectedReplacementDate ? dateFormatter.format(new Date(`${connection.expectedReplacementDate}T00:00:00Z`)) : 'Requires clarification'}</p>
                  </li>
                )
              })}
            </ul>
          </section>

          <section aria-labelledby="report-exposure-title" className="border-t border-slate-800 pt-6">
            <h3 id="report-exposure-title" className="mb-3 text-base font-semibold text-slate-100">3. HNDL exposure by data class</h3>
            <CustomerExposureBreakdown compact />
          </section>

          <section aria-labelledby="report-risk-title" className="border-t border-slate-800 pt-6">
            <h3 id="report-risk-title" className="text-base font-semibold text-slate-100">4. Key risks and blockers</h3>
            <div className="mt-4 grid gap-3 xl:grid-cols-2">
              {customerRiskContexts.map(({ risk, connections }) => (
                <article key={risk.id} className="rounded-lg border border-slate-800 bg-slate-950/30 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm font-medium text-slate-200">{risk.title}</h4>
                    <RiskIndicator severity={risk.severity} compact />
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{risk.description}</p>
                  <p className="mt-2 text-xs text-slate-500">Customer-data devices: {connections.map((connection) => connection.deviceName).join(', ')}</p>
                </article>
              ))}
            </div>
            <div className="mt-3 rounded-lg border border-rose-900/60 bg-rose-950/20 p-4">
              <h4 className="text-sm font-medium text-rose-200">Potential deadline conflicts and blockers</h4>
              <ul className="mt-2 space-y-2 text-xs leading-5 text-slate-300">
                {customerClassicalConnections.map((connection) => {
                  const conflict = deadlineConflictIds.has(connection.id)
                  const missingTarget = deadlineAssessment.missingReplacementTargets.some((item) => item.id === connection.id)
                  const relevant = conflict || missingTarget || connection.migrationStatus === 'Blocked'
                  if (!relevant) return null
                  return (
                    <li key={connection.id}>
                      {connection.deviceName}: {connection.migrationStatus.toLowerCase()}; blocker {connection.migrationBlockerReason ?? 'not recorded'}; replacement target {connection.expectedReplacementDate ? dateFormatter.format(new Date(`${connection.expectedReplacementDate}T00:00:00Z`)) : 'requires clarification'}{conflict ? ' (after proposed deadline)' : ''}.
                    </li>
                  )
                })}
                {customerBlockedConnections.length === 0 && deadlineAssessment.replacementTargetsAfterDeadline.length === 0 && deadlineAssessment.missingReplacementTargets.length === 0 && <li>No customer-data blockers or replacement targets after the proposed date are recorded.</li>}
              </ul>
            </div>
          </section>

          <section aria-labelledby="report-actions-title" className="border-t border-slate-800 pt-6">
            <h3 id="report-actions-title" className="text-base font-semibold text-slate-100">5. Recommended actions</h3>
            <ol className="mt-3 grid gap-2 sm:grid-cols-2">
              {recommendations.map((recommendation, index) => (
                <li key={recommendation} className="flex gap-3 rounded-lg border border-slate-800 bg-slate-950/30 p-3 text-sm leading-5 text-slate-300">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-cyan-300">{index + 1}</span>{recommendation}
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="report-method-title" className="border-t border-slate-800 pt-6">
            <h3 id="report-method-title" className="text-base font-semibold text-slate-100">6. Methodology and limitations</h3>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-400 sm:grid-cols-2">
              <li className="rounded-lg bg-slate-950/30 p-3">Customer connections are identified by the synthetic inventory's customer-data flag.</li>
              <li className="rounded-lg bg-slate-950/30 p-3">For each class, potential exposure is the sum of flow volumes linked to classical connections; its percentage is that sum divided by the class total.</li>
              <li className="rounded-lg bg-slate-950/30 p-3">Classes ({CUSTOMER_REPORTING_CONFIG.dataClasses.map((item) => item.name).join(', ')}) are provisional illustrative labels, not an approved customer taxonomy.</li>
              <li className="rounded-lg bg-slate-950/30 p-3">Volumes use illustrative {CUSTOMER_REPORTING_CONFIG.measurementUnit}-per-month estimates for {CUSTOMER_REPORTING_CONFIG.reportingPeriodLabel}; they are not observed traffic.</li>
              <li className="rounded-lg bg-slate-950/30 p-3">The deadline is proposed and requires confirmation. Replacement targets are not schedule baselines and cannot prove delivery readiness.</li>
              <li className="rounded-lg bg-slate-950/30 p-3">This prototype does not monitor systems or prove collection, compromise, attack success, or future decryption.</li>
            </ul>
            <p className="mt-3 text-xs text-slate-500">Report values are derived from {mockCustomerDataFlows.length} illustrative customer data-flow records and the current connection inventory.</p>
          </section>
        </div>
      </article>
    </section>
  )
}
