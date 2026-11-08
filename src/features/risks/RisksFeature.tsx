import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { mockConnections } from '../../data/mockConnections'
import { mockRisks } from '../../data/mockRisks'
import { getOrganizationalRiskContext } from '../../services/riskAssessment'
import { RiskIndicator } from '../../components/ui/RiskIndicator'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { StatusBadge } from '../../components/ui/StatusBadge'

const statusTone = { Low: 'success', Medium: 'warning', High: 'warning', Critical: 'danger' } as const

export function RisksFeature() {
  return (
    <section id="risks" aria-labelledby="risks-title" className="scroll-mt-28 space-y-6">
      <SectionHeader eyebrow="Prioritized review" title="Security risks" description="Organizational risk statements connect migration and security trade-offs to affected devices and recommended action." />
      <div className="grid gap-4 xl:grid-cols-2">
        {mockRisks.map((risk, index) => {
          const { affectedConnections, highHndlConnections, classicalConnections } =
            getOrganizationalRiskContext(risk, mockConnections)

          return (
            <article key={risk.id} className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-400">0{index + 1}</span>
                  <div>
                    <h3 className="font-semibold leading-6 text-slate-100">{risk.title}</h3>
                    <div className="mt-2"><RiskIndicator severity={risk.severity} /></div>
                  </div>
                </div>
                <StatusBadge tone={statusTone[risk.severity]}>{risk.severity}</StatusBadge>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-400">{risk.description}</p>
              <div className="mt-4 grid gap-3 rounded-lg border border-slate-800 bg-slate-950/40 p-4 sm:grid-cols-3">
                <div><p className="text-xs text-slate-500">Affected connections</p><p className="mt-1 font-semibold tabular-nums text-slate-200">{affectedConnections.length}</p></div>
                <div><p className="text-xs text-slate-500">Classical exchange</p><p className="mt-1 font-semibold tabular-nums text-amber-300">{classicalConnections}</p></div>
                <div><p className="text-xs text-slate-500">High HNDL exposure</p><p className="mt-1 font-semibold tabular-nums text-rose-300">{highHndlConnections}</p></div>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Affected devices</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {affectedConnections.map((connection) => (
                    <li key={connection.id} className="rounded-md border border-slate-700 bg-slate-800/70 px-2.5 py-1 text-xs text-slate-300" title={`${connection.site} · ${connection.criticality} criticality`}>
                      {connection.deviceName}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 border-t border-slate-800 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Recommended action</p>
                <p className="mt-2 flex gap-2 text-sm leading-6 text-slate-300"><ArrowRight size={16} className="mt-1 shrink-0 text-cyan-400" aria-hidden="true" />{risk.recommendedAction}</p>
              </div>
              <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500"><CheckCircle2 size={14} className="mt-0.5 shrink-0" aria-hidden="true" />Risk classifications summarize potential exposure and operational priority; they do not confirm an attack.</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
