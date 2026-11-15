import { Activity, Cable, Laptop, Percent } from 'lucide-react'
import { mockConnections } from '../../data/mockConnections'
import { mockEvents } from '../../data/mockEvents'
import { calculateMetrics, calculateMigrationStatusDistribution } from '../../services/metrics'
import { MetricCard } from '../../components/ui/MetricCard'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { MigrationStatusChart } from './MigrationStatusChart'

const metrics = calculateMetrics(mockConnections, mockEvents)
const distribution = calculateMigrationStatusDistribution(mockConnections)
const blockedConnections = mockConnections.filter((connection) => connection.migrationStatus === 'Blocked')
const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeZone: 'UTC' })

export function MigrationFeature() {
  return (
    <section id="migration" aria-labelledby="migration-title" className="scroll-mt-28 space-y-6">
      <SectionHeader eyebrow="Program delivery" title="Migration progress" description="Track algorithm adoption alongside legacy devices, blockers and remaining classical connections." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="ML-KEM adoption" value={`${metrics.pqcCoveragePercentage.toFixed(0)}%`} helperText={`${metrics.mlKemConnections} of ${metrics.totalConnections} connections`} icon={Percent} />
        <MetricCard label="Classical connections" value={metrics.classicalConnections} helperText="Still using classical key exchange" icon={Cable} />
        <MetricCard label="Legacy devices" value={metrics.legacyDevices} helperText="Devices identified as legacy in inventory" icon={Laptop} />
        <MetricCard label="Migration blockers" value={distribution.Blocked} helperText="Devices marked blocked in the inventory" icon={Activity} />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <MigrationStatusChart distribution={distribution} />
        <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
          <h3 className="font-semibold text-slate-100">Blocked devices</h3>
          <p className="mt-1 text-sm text-slate-400">Connections currently recorded with migration status Blocked.</p>
          {blockedConnections.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {blockedConnections.map((connection) => (
                <li key={connection.id} className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-100">{connection.deviceName}</p>
                      <p className="mt-1 text-xs text-slate-500">{connection.site} · {connection.criticality} criticality</p>
                    </div>
                    <StatusBadge tone="danger">{connection.migrationStatus}</StatusBadge>
                  </div>
                  <dl className="mt-3 grid gap-3 border-t border-slate-800 pt-3 sm:grid-cols-2">
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Blocker reason</dt>
                      <dd className="mt-1 text-sm text-amber-200">{connection.migrationBlockerReason ?? 'Reason not recorded'}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Replacement target</dt>
                      <dd className="mt-1 text-sm text-slate-300">{connection.expectedReplacementDate ? dateFormatter.format(new Date(`${connection.expectedReplacementDate}T00:00:00Z`)) : 'No target date recorded'}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
          ) : <p className="mt-4 text-sm text-slate-400">No devices are currently marked blocked.</p>}
          <p className="mt-4 border-t border-slate-800 pt-3 text-xs leading-5 text-slate-500">Blocker categories and target dates are illustrative dataset fields. Schedule baselines and milestone tracking are not modeled.</p>
        </article>
      </div>
      <p className="rounded-lg border border-amber-900/60 bg-amber-950/20 p-3 text-xs leading-5 text-amber-200/80">Migration percentage describes algorithm adoption only; it does not account for every operational or HNDL risk.</p>
    </section>
  )
}
