import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { mockConnections } from '../../data/mockConnections'
import { mockEvents } from '../../data/mockEvents'
import { mockRisks } from '../../data/mockRisks'
import { getOverallStatusFactors, type OverallSecurityStatus } from '../../services/riskAssessment'

interface ExecutiveStatusPanelProps {
  status: OverallSecurityStatus
}

const statusCopy: Record<OverallSecurityStatus, { action: string; explanation: string; color: string }> = {
  Red: {
    action: 'Action required',
    explanation: 'High-risk classical exposure and unresolved indicators need review. PQC coverage is shown separately and does not determine this status.',
    color: 'rose',
  },
  Amber: {
    action: 'Attention needed',
    explanation: 'Classical exposure or elevated connection risk remains. Continue migration and review the listed exceptions.',
    color: 'amber',
  },
  Green: {
    action: 'Acceptable under defined risk criteria',
    explanation: 'No red or amber condition was found under the current status rules. This is not a guarantee of security.',
    color: 'emerald',
  },
}

export function ExecutiveStatusPanel({ status }: ExecutiveStatusPanelProps) {
  const copy = statusCopy[status]
  const factors = getOverallStatusFactors(mockConnections, mockEvents)
  const topActions = mockRisks.slice(0, 3)
  const colorClasses = {
    Red: 'border-rose-500 bg-rose-950/50 text-rose-300 shadow-rose-950/30',
    Amber: 'border-amber-400 bg-amber-950/40 text-amber-200 shadow-amber-950/20',
    Green: 'border-emerald-500 bg-emerald-950/40 text-emerald-300 shadow-emerald-950/20',
  } as const

  return (
    <article className={`overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl`}>
      <div className={`h-1 ${status === 'Red' ? 'bg-rose-500' : status === 'Amber' ? 'bg-amber-400' : 'bg-emerald-500'}`} />
      <div className="grid gap-7 p-5 sm:p-7 lg:grid-cols-[220px_1fr] lg:items-center lg:gap-9">
        <div className="flex justify-center lg:justify-start">
          <div className={`flex h-44 w-44 flex-col items-center justify-center rounded-full border-[6px] shadow-lg sm:h-48 sm:w-48 ${colorClasses[status]}`} role="img" aria-label={`${status}: ${copy.action}`}>
            <span className="text-4xl font-bold tracking-[0.12em]">{status.toUpperCase()}</span>
            <span className="mt-2 text-center text-xs font-semibold uppercase tracking-wider">Overall status</span>
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Executive security overview</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">{copy.action}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">{copy.explanation}</p>

          <div className="mt-5 grid gap-6 xl:grid-cols-[1fr_1fr]">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Status factors</h3>
              <ul className="mt-2 space-y-2">
                {factors.map((factor) => (
                  <li key={factor} className="flex gap-2 text-sm leading-5 text-slate-400"><span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${status === 'Red' ? 'bg-rose-400' : status === 'Amber' ? 'bg-amber-300' : 'bg-emerald-400'}`} />{factor}</li>
                ))}
                {factors.length === 0 && <li className="text-sm text-slate-400">No active status factors in this dataset.</li>}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Recommended actions</h3>
              <ol className="mt-2 space-y-2">
                {topActions.map((risk) => (
                  <li key={risk.id} className="flex gap-2 text-sm leading-5 text-slate-400">
                    <ArrowRight size={15} className="mt-0.5 shrink-0 text-cyan-400" aria-hidden="true" />
                    <span>{risk.recommendedAction}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <p className="mt-5 flex items-start gap-2 border-t border-slate-800 pt-4 text-xs leading-5 text-slate-500">
            <CheckCircle2 size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
            Status follows the documented risk assessment rules. HNDL is potential future exposure; an unexpected fallback is an indicator, not proof of attack.
          </p>
        </div>
      </div>
    </article>
  )
}
