import { AlertTriangle, Cable, CircleAlert, Link2, Percent, ShieldCheck } from 'lucide-react'
import { mockConnections } from '../../data/mockConnections'
import { mockEvents } from '../../data/mockEvents'
import { mockRisks } from '../../data/mockRisks'
import { calculateMetrics, calculateRiskSeverityDistribution } from '../../services/metrics'
import { calculateOverallSecurityStatus } from '../../services/riskAssessment'
import { MetricCard } from '../../components/ui/MetricCard'
import { RiskIndicator } from '../../components/ui/RiskIndicator'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { ExecutiveStatusPanel } from './ExecutiveStatusPanel'
import { PqcAdoptionChart } from './PqcAdoptionChart'
import { RiskDistributionChart } from '../risks/RiskDistributionChart'

const metrics = calculateMetrics(mockConnections, mockEvents)
const overallStatus = calculateOverallSecurityStatus(mockConnections, mockEvents)
const riskDistribution = calculateRiskSeverityDistribution(mockRisks)

export function OverviewFeature() {
  return (
    <section id="overview" aria-labelledby="overview-title" className="scroll-mt-28 space-y-7">
      <SectionHeader
        eyebrow="Executive security overview"
        title="Organizational posture"
        description="A plain-language status grounded in connection risk and unresolved indicators, with migration coverage shown separately."
      />

      <ExecutiveStatusPanel status={overallStatus} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <MetricCard label="PQC coverage" value={`${metrics.pqcCoveragePercentage.toFixed(0)}%`} helperText="ML-KEM share of all connections; not an overall security score." icon={Percent} />
        <MetricCard label="Total connections" value={metrics.totalConnections} helperText={`${metrics.mlKemConnections} currently use ML-KEM-768.`} icon={Link2} />
        <MetricCard label="Classical connections" value={metrics.classicalConnections} helperText="Remaining classical key exchange paths." icon={Cable} />
        <MetricCard label="High HNDL exposure" value={metrics.highExposureConnections} helperText="Potential future exposure, not evidence of traffic collection." icon={ShieldCheck} />
        <MetricCard label="Unexpected fallback" value={metrics.unexpectedFallbackEvents} helperText="Indicators requiring context; not confirmed attacks." icon={AlertTriangle} />
        <MetricCard label="Unresolved high severity" value={metrics.unresolvedHighSeverityEvents} helperText="Open or in-review high and critical events." icon={CircleAlert} />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <PqcAdoptionChart metrics={metrics} />
        <RiskDistributionChart distribution={riskDistribution} />
      </div>

      <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="font-semibold text-slate-100">Top organizational risks</h3>
            <p className="mt-1 text-sm text-slate-400">Three priority items from the risk register, with action context.</p>
          </div>
          <a href="#risks" className="text-sm font-medium text-cyan-300 hover:text-cyan-200">View all risks <span aria-hidden="true">→</span></a>
        </div>
        <ol className="mt-4 grid gap-3 xl:grid-cols-3">
          {mockRisks.slice(0, 3).map((risk) => (
            <li key={risk.id} className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-sm font-medium leading-5 text-slate-200">{risk.title}</h4>
                <RiskIndicator severity={risk.severity} compact />
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-500">{risk.affectedConnectionIds.length} affected connections</p>
              <p className="mt-3 border-t border-slate-800 pt-3 text-xs leading-5 text-slate-400">{risk.recommendedAction}</p>
            </li>
          ))}
        </ol>
      </article>
    </section>
  )
}
