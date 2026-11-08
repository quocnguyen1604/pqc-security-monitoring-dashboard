import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { DashboardMetrics } from '../../services/metrics'

interface PqcAdoptionChartProps {
  metrics: DashboardMetrics
}

const COLORS = { 'ML-KEM': '#2dd4bf', Classical: '#fbbf24' }

export function PqcAdoptionChart({ metrics }: PqcAdoptionChartProps) {
  const total = metrics.totalConnections
  const data = [
    { name: 'ML-KEM', value: metrics.mlKemConnections, percent: total === 0 ? 0 : metrics.mlKemConnections / total * 100, fill: COLORS['ML-KEM'] },
    { name: 'Classical', value: metrics.classicalConnections, percent: metrics.classicalConnectionPercentage, fill: COLORS.Classical },
  ]

  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
      <h3 className="font-semibold text-slate-100">PQC adoption</h3>
      <p className="mt-1 text-sm text-slate-400">Share of connections by active key exchange.</p>
      <div className="mt-3 grid items-center gap-4 sm:grid-cols-[minmax(180px,1fr)_1fr]">
        <div className="relative mx-auto h-56 w-full max-w-[280px]" role="img" aria-label={`PQC adoption: ${metrics.mlKemConnections} ML-KEM connections (${data[0].percent.toFixed(0)} percent), ${metrics.classicalConnections} classical connections (${data[1].percent.toFixed(0)} percent)`}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={62} outerRadius={91} paddingAngle={3} stroke="#0b1422" isAnimationActive={false}>
                {data.map((item) => <Cell key={item.name} fill={item.fill} />)}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} connections`, name]} contentStyle={{ background: '#0b1422', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-semibold tabular-nums text-slate-100">{metrics.pqcCoveragePercentage.toFixed(0)}%</span>
            <span className="text-xs text-slate-500">ML-KEM coverage</span>
          </div>
        </div>
        <ul className="space-y-4">
          {data.map((item) => (
            <li key={item.name} className="flex items-start gap-3">
              <span className="mt-1 h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: item.fill }} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-medium text-slate-200">{item.name}</span>
                  <span className="text-sm font-semibold tabular-nums text-slate-100">{item.value}</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">{item.percent.toFixed(0)}% of {total} connections</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-2 border-t border-slate-800 pt-3 text-xs leading-5 text-slate-500">Coverage measures algorithm adoption only; review classical exposure and risk status separately.</p>
    </article>
  )
}
