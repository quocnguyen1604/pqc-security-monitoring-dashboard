import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { RiskSeverityDistribution } from '../../services/metrics'

interface RiskDistributionChartProps {
  distribution: RiskSeverityDistribution
}

const severities = [
  { severity: 'Critical' as const, color: '#fb7185' },
  { severity: 'High' as const, color: '#fb923c' },
  { severity: 'Medium' as const, color: '#fbbf24' },
  { severity: 'Low' as const, color: '#34d399' },
]

export function RiskDistributionChart({ distribution }: RiskDistributionChartProps) {
  const chartData = severities.map(({ severity, color }) => ({ severity, count: distribution[severity], fill: color }))
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
      <h3 className="font-semibold text-slate-100">Organizational risk distribution</h3>
      <p className="mt-1 text-sm text-slate-400">Recorded risk items grouped by their assigned severity.</p>
      <div className="mt-4 h-56" role="img" aria-label={chartData.map((item) => `${item.severity}: ${item.count}`).join(', ')}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 25, bottom: 4, left: 4 }}>
            <CartesianGrid stroke="#1e293b" horizontal={false} />
            <XAxis type="number" allowDecimals={false} domain={[0, (max: number) => Math.max(1, max)]} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: '#334155' }} tickLine={false} />
            <YAxis type="category" dataKey="severity" width={68} tick={{ fill: '#cbd5e1', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: '#1e293b', opacity: 0.5 }} formatter={(value) => [`${value} risks`, 'Risk items']} contentStyle={{ background: '#0b1422', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0' }} />
            <Bar dataKey="count" name="Risk items" barSize={18} radius={[0, 5, 5, 0]} isAnimationActive={false}>
              {chartData.map((item) => <Cell key={item.severity} fill={item.fill} />)}
              <LabelList dataKey="count" position="right" fill="#cbd5e1" fontSize={12} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}
